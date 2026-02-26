const http = require("http");
const https = require("https");
const { URL } = require("url");
const fs = require("fs");
const path = require("path");
const {
  parseReplayCalculatorState,
  generateReplayCalculatorLink,
  runReplayOddsFromCalculatorState,
} = require("../simulation/dist/index.js");

function loadEnvFile(envPath) {
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

loadEnvFile(path.resolve(process.cwd(), ".env"));
loadEnvFile(path.join(__dirname, ".env"));

const PORT = Number(process.env.PORT || 3000);
const API_VERSION = process.env.SAP_API_VERSION || "44";
const SAP_EMAIL = process.env.SAP_EMAIL;
const SAP_PASSWORD = process.env.SAP_PASSWORD;
const CORS_ALLOWED_ORIGIN =
  process.env.CORS_ALLOWED_ORIGIN || "https://www.sap-calculator.com";
const CALCULATOR_PUBLIC_BASE_URL =
  process.env.CALCULATOR_PUBLIC_BASE_URL || "https://sap-calculator.com/";

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
    "Access-Control-Allow-Origin": CORS_ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.end(body);
}

function toPositiveInteger(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  const intValue = Math.trunc(parsed);
  return intValue > 0 ? intValue : null;
}

function toReplayPayload(body) {
  if (!body || typeof body !== "object") {
    return null;
  }
  if (body.replay && typeof body.replay === "object") {
    return body.replay;
  }
  if (Array.isArray(body.Actions) || Array.isArray(body.turns)) {
    return body;
  }
  return null;
}

function parseReplayCalculatorStateFromBody(body) {
  const replayPayload = toReplayPayload(body);
  if (!replayPayload) {
    throw makeError(
      "Replay payload is required. Provide `replay`, `Actions`, or `turns`.",
      400,
    );
  }

  const turnNumber =
    toPositiveInteger(body?.turnNumber) ??
    toPositiveInteger(body?.turn) ??
    toPositiveInteger(body?.T);
  if (!turnNumber) {
    throw makeError(
      "A positive turn number is required (`turnNumber`, `turn`, or `T`).",
      400,
    );
  }

  const options =
    body?.abilityPetMap && typeof body.abilityPetMap === "object"
      ? { abilityPetMap: body.abilityPetMap }
      : undefined;
  const parsedState = parseReplayCalculatorState(
    replayPayload,
    turnNumber,
    undefined,
    options,
  );
  if (!parsedState) {
    throw makeError(`No battle found for turn ${turnNumber}.`, 404);
  }

  return {
    parsedState,
    turnNumber,
  };
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

const COPY_SOURCE_PET_IDS = new Set(["53", "373"]);

function safeParseJson(rawJson) {
  if (typeof rawJson !== "string" || rawJson.length === 0) {
    return null;
  }
  try {
    return JSON.parse(rawJson);
  } catch (error) {
    return null;
  }
}

function safeParseBattle(battleJson) {
  return safeParseJson(battleJson);
}

function getBattleActions(replay) {
  const actions = Array.isArray(replay?.Actions) ? replay.Actions : [];
  return actions.filter((action) => action?.Type === 0 && action?.Battle);
}

function getBattleForTurn(replay, turnNumber) {
  const battleActions = getBattleActions(replay);
  const actionByTurn = battleActions.find(
    (action) => Number(action?.Turn) === turnNumber,
  );
  if (actionByTurn?.Battle) {
    return safeParseBattle(actionByTurn.Battle);
  }

  const fallbackAction = battleActions[turnNumber - 1];
  return fallbackAction?.Battle ? safeParseBattle(fallbackAction.Battle) : null;
}

function readFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function buildTurnStats(board) {
  return {
    turn: readFiniteNumber(board?.Tur),
    victories: readFiniteNumber(board?.Vic),
    health: readFiniteNumber(board?.Back),
    goldSpent: readFiniteNumber(board?.GoSp),
    rolls: readFiniteNumber(board?.Rold),
    summons: readFiniteNumber(board?.MiSu),
    level3Sold: readFiniteNumber(board?.MSFL),
    transformed: readFiniteNumber(board?.TrTT),
  };
}

function buildTurnPet(pet, fallbackSlot) {
  if (!pet || typeof pet !== "object") {
    return null;
  }

  const abilities = Array.isArray(pet.Abil)
    ? pet.Abil
        .filter((ability) => ability && typeof ability === "object")
        .map((ability) => ({
          id: toReplayId(ability.Enu),
          level: readFiniteNumber(ability.Lvl),
          group: readFiniteNumber(ability.Grop),
          triggersConsumed: readFiniteNumber(ability.TrCo),
        }))
    : [];

  return {
    slot: readFiniteNumber(pet?.Poi?.x) ?? fallbackSlot,
    id: toReplayId(pet.Enu),
    level: readFiniteNumber(pet.Lvl),
    experience: readFiniteNumber(pet.Exp),
    perkId: toReplayId(pet.Perk),
    attack: {
      permanent: readFiniteNumber(pet?.At?.Perm),
      temporary: readFiniteNumber(pet?.At?.Temp),
      max: readFiniteNumber(pet?.At?.Max),
    },
    health: {
      permanent: readFiniteNumber(pet?.Hp?.Perm),
      temporary: readFiniteNumber(pet?.Hp?.Temp),
      max: readFiniteNumber(pet?.Hp?.Max),
    },
    mana: readFiniteNumber(pet.Mana),
    cosmetic: readFiniteNumber(pet.Cosm),
    abilities,
  };
}

function buildTurnPets(board) {
  const items = Array.isArray(board?.Mins?.Items) ? board.Mins.Items : [];
  return items
    .map((pet, index) => buildTurnPet(pet, index))
    .filter((pet) => pet !== null);
}

function buildTurnRecord(action, fallbackTurn) {
  const battle = safeParseBattle(action?.Battle);
  if (!battle || typeof battle !== "object") {
    return null;
  }

  const userBoard = battle.UserBoard;
  const opponentBoard = battle.OpponentBoard;
  const actionTurn = Number(action?.Turn);
  const inferredTurn =
    readFiniteNumber(userBoard?.Tur) ?? readFiniteNumber(opponentBoard?.Tur);
  const turn =
    Number.isFinite(actionTurn) && actionTurn > 0
      ? actionTurn
      : inferredTurn ?? fallbackTurn;

  return {
    turn,
    user: {
      stats: buildTurnStats(userBoard),
      pets: buildTurnPets(userBoard),
    },
    opponent: {
      stats: buildTurnStats(opponentBoard),
      pets: buildTurnPets(opponentBoard),
    },
  };
}

function getReplayTurns(replay) {
  const battleActions = getBattleActions(replay);
  const turns = battleActions
    .map((action, index) => buildTurnRecord(action, index + 1))
    .filter((turnRecord) => turnRecord !== null)
    .sort((a, b) => a.turn - b.turn);
  return turns;
}

function toReplayId(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value === "string" && value.length > 0) {
    return value;
  }
  return null;
}

function incrementAbilityOwnerCount(abilityOwnerCounts, abilityId, petId) {
  let petCountById = abilityOwnerCounts.get(abilityId);
  if (!petCountById) {
    petCountById = new Map();
    abilityOwnerCounts.set(abilityId, petCountById);
  }
  petCountById.set(petId, (petCountById.get(petId) || 0) + 1);
}

function collectAbilityOwnerCounts(value, abilityOwnerCounts) {
  if (Array.isArray(value)) {
    value.forEach((entry) => {
      collectAbilityOwnerCounts(entry, abilityOwnerCounts);
    });
    return;
  }

  if (!value || typeof value !== "object") {
    return;
  }

  const petId = toReplayId(value.Enu);
  const abilities = value.Abil;
  if (petId && Array.isArray(abilities) && !COPY_SOURCE_PET_IDS.has(petId)) {
    abilities.forEach((ability) => {
      if (!ability || typeof ability !== "object") {
        return;
      }
      const abilityId = toReplayId(ability.Enu);
      if (!abilityId) {
        return;
      }
      incrementAbilityOwnerCount(abilityOwnerCounts, abilityId, petId);
    });
  }

  Object.values(value).forEach((entry) => {
    collectAbilityOwnerCounts(entry, abilityOwnerCounts);
  });
}

function pickMostLikelyPetId(petCountById) {
  let bestPetId = null;
  let bestCount = -1;

  for (const [petId, count] of petCountById.entries()) {
    if (
      count > bestCount ||
      (count === bestCount && (bestPetId === null || petId < bestPetId))
    ) {
      bestPetId = petId;
      bestCount = count;
    }
  }

  return bestPetId;
}

function buildReplayAbilityPetMap(replay) {
  const abilityOwnerCounts = new Map();
  const actions = Array.isArray(replay?.Actions) ? replay.Actions : [];

  actions.forEach((action) => {
    const parsedBuild = safeParseJson(action?.Build);
    const parsedBattle = safeParseJson(action?.Battle);
    const parsedMode = safeParseJson(action?.Mode);
    collectAbilityOwnerCounts(parsedBuild, abilityOwnerCounts);
    collectAbilityOwnerCounts(parsedBattle, abilityOwnerCounts);
    collectAbilityOwnerCounts(parsedMode, abilityOwnerCounts);
  });

  collectAbilityOwnerCounts(replay?.GenesisBuildModel, abilityOwnerCounts);

  const abilityPetMap = {};
  for (const [abilityId, petCountById] of abilityOwnerCounts.entries()) {
    const petId = pickMostLikelyPetId(petCountById);
    if (petId) {
      abilityPetMap[abilityId] = petId;
    }
  }

  return abilityPetMap;
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
      "Access-Control-Allow-Origin": CORS_ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
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

  const replayTurnsMatch =
    req.method === "GET"
      ? url.pathname.match(/^\/api\/replays\/([^/]+)\/turns$/)
      : null;
  if (replayTurnsMatch) {
    try {
      const participationId = decodeURIComponent(replayTurnsMatch[1]);
      const sapEmail =
        url.searchParams.get("SapEmail") ||
        url.searchParams.get("sapEmail") ||
        url.searchParams.get("Email") ||
        url.searchParams.get("email") ||
        SAP_EMAIL;
      const sapPassword =
        url.searchParams.get("SapPassword") ||
        url.searchParams.get("sapPassword") ||
        url.searchParams.get("Password") ||
        url.searchParams.get("password") ||
        SAP_PASSWORD;

      if (!participationId) {
        sendJson(res, 400, {
          error: "Replay id is required.",
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
      const turns = getReplayTurns(replay);
      if (turns.length === 0) {
        sendJson(res, 404, {
          error: "No turn-level battle data found for this replay.",
        });
        return;
      }

      sendJson(res, 200, {
        replayId: participationId,
        totalTurns: turns.length,
        turns,
        genesisBuildModel: replay?.GenesisBuildModel || null,
        genesisModeModel: replay?.GenesisModeModel || null,
        abilityPetMap: buildReplayAbilityPetMap(replay),
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      sendJson(res, statusCode, {
        error: error.message || "Replay lookup failed.",
      });
    }
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
      const battle = getBattleForTurn(replay, turnNumber);
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
        abilityPetMap: buildReplayAbilityPetMap(replay),
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
        battle = getBattleForTurn(replay, turnNumber);
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

  if (req.method === "POST" && url.pathname === "/api/replay/parse-link") {
    try {
      const body = await readJsonBody(req);
      const { parsedState, turnNumber } = parseReplayCalculatorStateFromBody(body);
      const linkBaseUrl =
        typeof body?.baseUrl === "string" && body.baseUrl.length > 0
          ? body.baseUrl
          : CALCULATOR_PUBLIC_BASE_URL;
      const calculatorLink = generateReplayCalculatorLink(parsedState, linkBaseUrl);

      sendJson(res, 200, {
        turnNumber,
        link: calculatorLink,
        calculatorState: parsedState,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      sendJson(res, statusCode, {
        error: error.message || "Failed to parse replay into calculator link.",
      });
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/replay/odds") {
    try {
      const body = await readJsonBody(req);
      const { parsedState, turnNumber } = parseReplayCalculatorStateFromBody(body);
      const simulationCount = toPositiveInteger(body?.simulationCount) || 1000;
      const result = runReplayOddsFromCalculatorState(parsedState, simulationCount);
      const totalBattles = result.playerWins + result.opponentWins + result.draws;
      const toPercent = (value) =>
        totalBattles > 0
          ? Number(((value / totalBattles) * 100).toFixed(2))
          : 0;

      sendJson(res, 200, {
        turnNumber,
        simulationCount,
        parsedState,
        odds: {
          playerWins: result.playerWins,
          opponentWins: result.opponentWins,
          draws: result.draws,
          totalBattles,
          playerWinPercent: toPercent(result.playerWins),
          opponentWinPercent: toPercent(result.opponentWins),
          drawPercent: toPercent(result.draws),
        },
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      sendJson(res, statusCode, {
        error: error.message || "Failed to parse replay odds.",
      });
    }
    return;
  }

  sendJson(res, 404, { error: "Not found." });
});

server.listen(PORT, () => {
  console.log(`Replay API listening on port ${PORT}.`);
});
