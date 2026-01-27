const http = require("http");
const https = require("https");
const { URL } = require("url");
const fs = require("fs");
const path = require("path");

function loadEnvFile() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) {
    return;
  }
  const contents = fs.readFileSync(envPath, "utf8");
  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const idx = trimmed.indexOf("=");
    if (idx === -1) {
      continue;
    }
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile();

const PORT = Number(process.env.PORT || 3000);
const API_VERSION = process.env.SAP_API_VERSION || "44";
const SAP_EMAIL = process.env.SAP_EMAIL;
const SAP_PASSWORD = process.env.SAP_PASSWORD;

const authCache = new Map();

function makeError(message, statusCode = 500) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(body);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 5 * 1024 * 1024) {
        req.destroy();
        reject(new Error("Payload too large."));
      }
    });
    req.on("end", () => {
      if (!data) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(new Error("Invalid JSON payload."));
      }
    });
    req.on("error", reject);
  });
}

function decodeJwtExpiry(token) {
  try {
    const payload = token.split(".")[1];
    const padded = payload.padEnd(
      payload.length + ((4 - (payload.length % 4 || 4)) % 4),
      "=",
    );
    const json = Buffer.from(padded, "base64").toString("utf8");
    const data = JSON.parse(json);
    return typeof data.exp === "number" ? data.exp : 0;
  } catch (error) {
    return 0;
  }
}

function postJson(hostname, path, body, headers = {}) {
  const data = JSON.stringify(body);
  const options = {
    hostname,
    path,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(data),
      ...headers,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = "";
      res.on("data", (chunk) => {
        responseData += chunk;
      });
      res.on("end", () => {
        let parsed = null;
        if (responseData) {
          try {
            parsed = JSON.parse(responseData);
          } catch (error) {
            parsed = responseData;
          }
        }
        resolve({ status: res.statusCode, data: parsed });
      });
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function safeParseBattle(battleJson) {
  if (!battleJson) {
    return null;
  }
  try {
    return JSON.parse(battleJson);
  } catch (error) {
    return null;
  }
}

async function login(email, password) {
  if (!email || !password) {
    throw makeError(
      "SAP_EMAIL and SAP_PASSWORD must be set for replay lookups.",
      400,
    );
  }

  const { status, data } = await postJson(
    "api.teamwood.games",
    `/0.${API_VERSION}/api/user/login`,
    {
      Email: email,
      Password: password,
      Version: API_VERSION,
    },
    { authority: "api.teamwood.games" },
  );

  if (status !== 200 || !data || !data.Token) {
    console.error("Login failed:", status, data);
    throw makeError("Failed to authenticate with Teamwood API.", 502);
  }

  const token = data.Token;
  authCache.set(email, {
    token,
    expiry: decodeJwtExpiry(token),
    password,
  });
}

async function ensureAuth(email, password) {
  const now = Math.floor(Date.now() / 1000);
  const cached = authCache.get(email);
  if (!cached || cached.expiry - now < 60 || cached.password !== password) {
    await login(email, password);
  }
}

async function fetchReplay(participationId, email, password) {
  await ensureAuth(email, password);

  const cached = authCache.get(email);
  const authToken = cached?.token;
  if (!authToken) {
    throw makeError("Failed to authenticate with Teamwood API.", 502);
  }

  const { status, data } = await postJson(
    "api.teamwood.games",
    `/0.${API_VERSION}/api/playback/participation`,
    {
      ParticipationId: participationId,
      Turn: 1,
      Version: API_VERSION,
    },
    {
      Authorization: `Bearer ${authToken}`,
      Authority: "api.teamwood.games",
    },
  );

  if (status === 401) {
    await login(email, password);
    return fetchReplay(participationId, email, password);
  }

  if (status !== 200) {
    console.error("Replay fetch failed:", status, data);
    throw makeError(`Replay fetch failed (status ${status}).`, 502);
  }

  return data;
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === "GET" && url.pathname === "/api/health") {
    sendJson(res, 200, {
      ok: true,
      hasCredentials: Boolean(SAP_EMAIL && SAP_PASSWORD),
      tokenLoaded: authCache.size > 0,
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/replay-battle") {
    try {
      const body = await readJsonBody(req);
      const participationId = body?.Pid;
      const turnNumber = Number(body?.T);
      const sapEmail = body?.SapEmail || body?.Email || SAP_EMAIL;
      const sapPassword = body?.SapPassword || body?.Password || SAP_PASSWORD;

      if (
        !participationId ||
        !turnNumber ||
        Number.isNaN(turnNumber) ||
        turnNumber <= 0
      ) {
        sendJson(res, 400, {
          error: "Pid and a positive T (turn number) are required.",
        });
        return;
      }

      if (!sapEmail || !sapPassword) {
        sendJson(res, 400, {
          error: "SAP credentials are required for participation lookups.",
        });
        return;
      }

      const replay = await fetchReplay(participationId, sapEmail, sapPassword);
      const battles = replay.Actions.filter((action) => action?.Type === 0)
        .map((action) => safeParseBattle(action.Battle))
        .filter(Boolean);

      const battle = battles[turnNumber - 1];
      if (!battle) {
        sendJson(res, 404, {
          error: `No battle found for turn ${turnNumber}.`,
        });
        return;
      }

      sendJson(res, 200, {
        battle,
        genesisBuildModel: replay.GenesisBuildModel || null,
        genesisModeModel: replay.GenesisModeModel || null,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      sendJson(res, statusCode, {
        error: error.message || "Replay lookup failed.",
      });
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/replay-debug") {
    try {
      const body = await readJsonBody(req);
      const participationId = body?.Pid;
      const turnNumber = Number(body?.T);
      const sapEmail = body?.SapEmail || body?.Email || SAP_EMAIL;
      const sapPassword = body?.SapPassword || body?.Password || SAP_PASSWORD;

      if (!participationId) {
        sendJson(res, 400, { error: "Pid is required." });
        return;
      }

      if (!sapEmail || !sapPassword) {
        sendJson(res, 400, {
          error: "SAP credentials are required for participation lookups.",
        });
        return;
      }

      const replay = await fetchReplay(participationId, sapEmail, sapPassword);
      const topLevelKeys = Object.keys(replay || {}).sort();
      const modeActions = replay.Actions.filter(
        (action) => action?.Type === 1,
      ).map((action) => ({
        Mode: action.Mode,
        ModeParsed: (() => {
          try {
            return action.Mode ? JSON.parse(action.Mode) : null;
          } catch (error) {
            return null;
          }
        })(),
        Created: action.Created,
      }));

      let battle = null;
      if (Number.isFinite(turnNumber) && turnNumber > 0) {
        const battles = replay.Actions.filter(
          (action) => action?.Type === 0,
        )
          .map((action) => safeParseBattle(action.Battle))
          .filter(Boolean);
        battle = battles[turnNumber - 1] || null;
      }

      sendJson(res, 200, {
        Keys: topLevelKeys,
        GenesisModeModel: replay.GenesisModeModel || null,
        GenesisBuildModel: replay.GenesisBuildModel || null,
        ModeActions: modeActions,
        TurnBattle: battle,
        TurnNumber: Number.isFinite(turnNumber) ? turnNumber : null,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      sendJson(res, statusCode, {
        error: error.message || "Replay debug lookup failed.",
      });
    }
    return;
  }

  sendJson(res, 404, { error: "Not found." });
});

server.listen(PORT, () => {
  console.log(`Replay API listening on port ${PORT}.`);
});
