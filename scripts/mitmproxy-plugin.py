import json
import re
from pathlib import Path

from mitmproxy import http


SCRIPT_DIR = Path(__file__).resolve().parent
ROOT = SCRIPT_DIR.parent
BATTLE_FILE = ROOT / "generated-battle.json"
URL_PATTERN = re.compile(r"/api/battle/get/([-a-f0-9]+)")


def is_valid_battle_url(url: str) -> str:
    match = URL_PATTERN.search(url or "")
    if not match:
        return ""
    return match.group(1)


def load_battle_payload() -> dict:
    if not BATTLE_FILE.exists():
        raise FileNotFoundError(
            f"Missing generated battle file: {BATTLE_FILE}. Run 'python .\\scripts\\make-team.py' first."
        )
    with BATTLE_FILE.open("r", encoding="utf-8") as f:
        payload = json.load(f)
    if not isinstance(payload, dict):
        raise ValueError("generated-battle.json must contain a JSON object.")
    return payload


def request(flow: http.HTTPFlow) -> None:
    if flow.request.method != "GET":
        return

    battle_id = is_valid_battle_url(flow.request.pretty_url)
    if not battle_id:
        return

    try:
        data = load_battle_payload()
        data["Id"] = battle_id
        body = json.dumps(data)
        flow.response = http.Response.make(
            200,
            body.encode("utf-8"),
            {
                "Content-Type": "application/json; charset=utf-8",
                "Access-Control-Allow-Origin": "*",
            },
        )
    except Exception as error:
        flow.response = http.Response.make(
            500,
            json.dumps({"error": str(error)}).encode("utf-8"),
            {"Content-Type": "application/json; charset=utf-8"},
        )
