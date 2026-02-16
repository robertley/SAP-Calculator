# Replay JSON Generator (`scripts/make-team.py`)

This script generates a `generated-battle.json` replay payload you can serve to the game replay endpoint (same workflow style as replay-editor tooling).

## Quick Start

1. Copy config template:

```powershell
Copy-Item .\scripts\make-team.config.example.json .\scripts\make-team.config.json
```

2. Put a real replay battle template at:

`tmp/replay-template.json`

3. Edit `scripts/make-team.config.json` teams/perks/stats.

	- Optional (recommended): set `calculatorStateFile` to a file containing your calculator export (`SAPC1:...`) so teams are auto-derived from calculator state.

4. Generate replay JSON:

```powershell
python .\scripts\make-team.py
```

Output defaults to `generated-battle.json`.

## Inject into Game Replay Endpoint (Local)

After generating `generated-battle.json`, run a local mitmproxy that rewrites SAP battle replay requests:

Windows PowerShell:

```powershell
.\scripts\start-proxy.ps1
```

macOS/Linux:

```bash
./scripts/start-proxy.sh
```

Then:

1. Enable system/browser proxy to `127.0.0.1:8080`.
2. Install mitmproxy root certificate (`http://mitm.it`) if needed.
3. Open SAP in browser, click a replay.
4. Request to `/api/battle/get/<id>` is served from local `generated-battle.json`.

If needed, run the command directly:

```powershell
mitmproxy --allow-hosts teamwood.games -s .\scripts\mitmproxy-plugin.py
```

## Notes

- This script edits `UserBoard` and `OpponentBoard` from your template.
- Team arrays are back-most to front-most.
- `team_2` is mirrored to match SAP replay orientation.
- Pet/perk IDs are resolved from `src/assets/data/pets.json` and `src/assets/data/perks.json`.
- Ability IDs, hats, and backgrounds are provided via config (`abilitiesByPet`, `hats`, `backgrounds`).
- If `calculatorState` or `calculatorStateFile` is set, it overrides `team_1` and `team_2`.
- Supported calculator-state inputs:
	- `SAPC1:...` export token
	- Full calculator URL containing `#c=...`
	- Plain calculator JSON (expanded keys) or compact JSON (short keys like `p`, `o`, `n`, `a`, `h`, `e`, `eq`).
- Calculator pet order is treated as front-to-back by default and reversed for make-team (`calculatorPetsAreFrontToBack: true`).

## Important

The template must be a valid battle JSON from SAP replay data. Without a real template, the generated file may be missing required fields for in-game playback.
