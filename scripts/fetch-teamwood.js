const fs = require('fs');
const path = require('path');

// Basic .env loader
function loadEnv() {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envFile = fs.readFileSync(envPath, 'utf8');
        envFile.split(/\r?\n/).forEach(line => {
            const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
            if (match) {
                let value = match[2] || '';
                if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
                process.env[match[1]] = value;
            }
        });
    }
}

loadEnv();

const API_VERSION = process.env.SAP_API_VERSION || '44';
let AUTH_TOKEN = null;
let tokenExpiresAt = null;
let loginPromise = null;

function getTokenExpiry(token) {
    try {
        const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString("utf8"));
        if (payload && Number.isFinite(payload.exp)) {
            return payload.exp * 1000;
        }
    } catch {
        // ignore
    }
    return null;
}

async function login() {
    if (loginPromise) return loginPromise;
    loginPromise = (async () => {
        const email = process.env.SAP_EMAIL;
        const password = process.env.SAP_PASSWORD;
        if (!email || !password) {
            throw new Error("SAP_EMAIL and SAP_PASSWORD are required for login");
        }
        console.log(`Logging in as ${email}...`);
        const response = await fetch(`https://api.teamwood.games/0.${API_VERSION}/api/user/login`, {
            method: "POST",
            body: JSON.stringify({
                Email: email,
                Password: password,
                Version: API_VERSION
            }),
            headers: {
                "Content-Type": "application/json; utf-8",
                authority: "api.teamwood.games"
            }
        });
        if (!response.ok) {
            const body = await response.text();
            console.error("Teamwood login failed", { status: response.status, body });
            throw new Error(`Login failed: ${response.status}`);
        }
        const responseJSON = await response.json();
        AUTH_TOKEN = responseJSON["Token"];
        tokenExpiresAt = getTokenExpiry(AUTH_TOKEN);
        console.log("Ready! Logged in");
        return AUTH_TOKEN;
    })();

    try {
        return await loginPromise;
    } finally {
        loginPromise = null;
    }
}

async function getAuthToken() {
    if (AUTH_TOKEN) {
        if (!tokenExpiresAt || tokenExpiresAt - Date.now() > 60_000) {
            return AUTH_TOKEN;
        }
    }
    return await login();
}

async function fetchReplay(participationId) {
    const token = await getAuthToken();
    const options = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            Authority: "api.teamwood.games",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ParticipationId: participationId,
            Turn: 1,
            Version: API_VERSION
        })
    };
    return fetch(`https://api.teamwood.games/0.${API_VERSION}/api/playback/participation`, options);
}

async function run() {
    const Pid = "a91f3f74-3c0b-4b47-97e8-1a9e466950b3";
    try {
        const response = await fetchReplay(Pid);
        if (!response.ok) {
            const text = await response.text();
            console.error(`Fetch failed with status ${response.status}: ${text}`);
            return;
        }
        const data = await response.json();
        fs.writeFileSync('tmp/replay-participation-full.json', JSON.stringify(data, null, 2));
        console.log("Successfully saved playback data to tmp/replay-participation-full.json");
    } catch (err) {
        console.error("Error in run:", err);
    }
}

run();
