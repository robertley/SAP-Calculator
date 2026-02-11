# Replay API Deployment (Shared Server)

This guide sets up the replay backend so teammates can use replay import without running a local server.

## What this enables

- Frontend calls to `/api/health` and `/api/replay-battle` work from your hosted calculator.
- Teammates only open the site; no local replay server needed.

## Prerequisites

- Linux server with Node.js 20+ and npm
- Nginx already serving your calculator site
- Access to SAP account credentials for replay lookup

## 1) Deploy code and install deps

```bash
cd /path/to/SAP-Calculator
npm ci --legacy-peer-deps
```

## 2) Configure replay server environment

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```dotenv
SAP_EMAIL=you@example.com
SAP_PASSWORD=yourpassword
SAP_API_VERSION=44
PORT=3000
```

Notes:
- `PORT` should match the upstream port used in Nginx.
- `SAP_API_VERSION` defaults to `44` in `server/index.js`.

## 3) Start backend process

Quick start:

```bash
npm run start:server
```

Production (recommended) with PM2:

```bash
npm i -g pm2
cd /path/to/SAP-Calculator
pm2 start "npm run start:server" --name sap-replay
pm2 save
pm2 status
```

## 4) Add Nginx reverse proxy for `/api`

In your site config:

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3000/api/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location = /api {
    proxy_pass http://127.0.0.1:3000/api;
}
```

Reload Nginx:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

## 5) Verify

Health endpoint:

```bash
curl https://your-domain.example/api/health
```

Expected response shape:

```json
{
  "ok": true,
  "hasCredentials": true,
  "tokenLoaded": false
}
```

Then test from UI:

1. Open calculator.
2. Use Import/Replay with `{ "Pid": "...", "T": 1 }` (or PID + turn input flow).
3. Confirm battle imports successfully.

## Troubleshooting

- `Replay API is not reachable`:
  - Check PM2 status and logs: `pm2 logs sap-replay`
  - Confirm Nginx `/api` proxy points to correct port.
- `SAP credentials are required`:
  - Verify `server/.env` exists and has valid `SAP_EMAIL`/`SAP_PASSWORD`.
- `Replay fetch failed (status 401/502)`:
  - Re-check credentials and API version.
  - Restart process after env changes: `pm2 restart sap-replay`.
- Timeout errors in UI:
  - Check server outbound network access to `api.teamwood.games`.

