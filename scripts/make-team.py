#!/usr/bin/env python3
import base64
import binascii
import json
from copy import deepcopy
from pathlib import Path
from typing import Any, Dict, List, Optional


SCRIPT_DIR = Path(__file__).resolve().parent
ROOT = SCRIPT_DIR.parent
PETS_PATH = ROOT / "src" / "assets" / "data" / "pets.json"
PERKS_PATH = ROOT / "src" / "assets" / "data" / "perks.json"

DEFAULT_CONFIG_PATHS = [
    SCRIPT_DIR / "make-team.config.json",
    ROOT / "make-team.config.json",
]
FALLBACK_CONFIG_PATH = SCRIPT_DIR / "make-team.config.example.json"


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def normalize_name(value: Optional[str]) -> str:
    return (value or "").strip().lower()


def build_name_to_id_map(rows: List[Dict[str, Any]]) -> Dict[str, int]:
    mapped: Dict[str, int] = {}
    for row in rows:
        name = normalize_name(str(row.get("Name", "")))
        id_raw = row.get("Id")
        if not name or id_raw is None:
            continue
        try:
            mapped[name] = int(id_raw)
        except (TypeError, ValueError):
            continue
    return mapped


def transform_ability(ability_id: int, level: int) -> Dict[str, Any]:
    return {
        "Enu": int(ability_id),
        "Lvl": int(level),
        "Nat": True,
        "Dur": 0,
        "TrCo": 0,
        "AcCo": 0,
        "Char": None,
        "Dis": False,
        "DisT": False,
        "AIML": False,
        "IgRe": False,
        "Grop": 0,
    }


def reset_minion_state(minion: Dict[str, Any]) -> None:
    scalar_defaults = {
        "Exp": 0,
        "Mana": 0,
        "Cou": None,
        "CoBr": None,
        "LaPP": None,
        "PeBo": False,
        "PeDu": None,
        "PeDM": None,
        "PeMu": None,
        "PeDr": 0,
        "AbDi": False,
        "Dead": False,
        "Dest": False,
        "DeBy": None,
        "Link": None,
        "Pow": None,
        "SeV": None,
        "Rwds": 0,
        "Rwrd": False,
        "MiMs": None,
        "SpMe": None,
        "Tri": None,
        "AtkC": 0,
        "HrtC": 0,
        "SpCT": 0,
        "OlTs": None,
        "Fro": False,
        "WFro": False,
        "AFro": False,
        "LastTargetsThisTurn": None,
    }
    for key, value in scalar_defaults.items():
        if key in minion:
            minion[key] = value

    for stat_key in ("Hp", "At"):
        stat = minion.get(stat_key)
        if isinstance(stat, dict):
            if "Temp" in stat:
                stat["Temp"] = 0
            if "Max" in stat:
                stat["Max"] = None


def resolve_id(
    item_name: Optional[str],
    mapper: Dict[str, int],
    label: str,
    required: bool = True,
) -> Optional[int]:
    if item_name is None:
        if required:
            raise ValueError(f"Missing required {label} name.")
        return None
    normalized = normalize_name(item_name)
    if normalized == "":
        if required:
            raise ValueError(f"Missing required {label} name.")
        return None
    if normalized not in mapper:
        raise ValueError(f"Unknown {label} '{item_name}'.")
    return mapper[normalized]


def decode_base64url(value: str) -> str:
    padded = value + ("=" * ((4 - (len(value) % 4)) % 4))
    normalized = padded.replace("-", "+").replace("_", "/")
    try:
        return base64.b64decode(normalized).decode("utf-8")
    except (binascii.Error, UnicodeDecodeError) as error:
        raise ValueError(f"Invalid base64url replay/calculator payload: {error}")


def read_text(path: Path) -> str:
    with path.open("r", encoding="utf-8") as f:
        return f.read()


def get_with_short_key(obj: Dict[str, Any], long_key: str, short_key: str) -> Any:
    if long_key in obj:
        return obj[long_key]
    return obj.get(short_key)


def exp_to_level(exp: int) -> int:
    if exp >= 5:
        return 3
    if exp >= 2:
        return 2
    return 1


def parse_calculator_state_payload(raw: str) -> Dict[str, Any]:
    trimmed = (raw or "").strip()
    if not trimmed:
        raise ValueError("Calculator state payload is empty.")

    if "#c=" in trimmed:
        token = trimmed.split("#c=", 1)[1].strip()
        if "&" in token:
            token = token.split("&", 1)[0]
        trimmed = f"SAPC1:{token}"

    if trimmed.startswith("SAPC1:"):
        encoded = trimmed[len("SAPC1:") :].strip()
        decoded = decode_base64url(encoded)
        parsed = json.loads(decoded)
    else:
        parsed = json.loads(trimmed)

    if not isinstance(parsed, dict):
        raise ValueError("Calculator state must decode to a JSON object.")
    return parsed


def parse_team_from_calculator_state(
    state: Dict[str, Any],
    side_key: str,
    pets_are_front_to_back: bool,
    default_hat: Optional[str],
) -> List[Optional[Dict[str, Any]]]:
    short_side_key = "p" if side_key == "playerPets" else "o"
    raw_pets = state.get(side_key)
    if raw_pets is None:
        raw_pets = state.get(short_side_key, [])
    if not isinstance(raw_pets, list):
        raise ValueError(f"'{side_key}' must be an array in calculator state.")

    pets: List[Optional[Dict[str, Any]]] = []
    for pet_entry in raw_pets[:5]:
        if pet_entry is None:
            pets.append(None)
            continue
        if not isinstance(pet_entry, dict):
            pets.append(None)
            continue

        pet_name = get_with_short_key(pet_entry, "name", "n")
        if pet_name is None:
            pets.append(None)
            continue

        attack = int(get_with_short_key(pet_entry, "attack", "a") or 0)
        health = int(get_with_short_key(pet_entry, "health", "h") or 0)
        exp = int(get_with_short_key(pet_entry, "exp", "e") or 0)
        equipment = get_with_short_key(pet_entry, "equipment", "eq")
        perk_name = None
        if isinstance(equipment, dict):
            perk_name = get_with_short_key(equipment, "name", "n")

        pets.append(
            {
                "pet": str(pet_name),
                "perk": str(perk_name) if perk_name else None,
                "level": exp_to_level(exp),
                "attack": attack,
                "health": health,
                "hat": default_hat,
            }
        )

    while len(pets) < 5:
        pets.append(None)

    if pets_are_front_to_back:
        pets.reverse()

    return pets


def resolve_teams_from_config(config: Dict[str, Any]) -> Dict[str, List[Optional[Dict[str, Any]]]]:
    calculator_state_raw = config.get("calculatorState")
    calculator_state_file = config.get("calculatorStateFile")

    if calculator_state_file:
        state_path = ROOT / str(calculator_state_file)
        if not state_path.exists():
            raise ValueError(f"calculatorStateFile not found: {state_path}")
        calculator_state_raw = read_text(state_path)

    if calculator_state_raw:
        state = parse_calculator_state_payload(str(calculator_state_raw))
        pets_are_front_to_back = bool(
            config.get("calculatorPetsAreFrontToBack", True)
        )
        default_hat = config.get("defaultHat")

        return {
            "team_1": parse_team_from_calculator_state(
                state,
                "playerPets",
                pets_are_front_to_back,
                default_hat,
            ),
            "team_2": parse_team_from_calculator_state(
                state,
                "opponentPets",
                pets_are_front_to_back,
                default_hat,
            ),
        }

    return {
        "team_1": (config.get("team_1", []) or []),
        "team_2": (config.get("team_2", []) or []),
    }


def edit_board(
    battle: Dict[str, Any],
    board_key: str,
    team: List[Optional[Dict[str, Any]]],
    reverse_index: bool,
    pets_by_name: Dict[str, int],
    perks_by_name: Dict[str, int],
    abilities_by_pet: Dict[str, List[int]],
    hats_by_name: Dict[str, int],
    background_id: Optional[int],
) -> None:
    board = battle.get(board_key)
    if not isinstance(board, dict):
        raise ValueError(f"Missing board '{board_key}' in template.")

    mins = board.get("Mins")
    if not isinstance(mins, dict) or not isinstance(mins.get("Items"), list):
        raise ValueError(f"Board '{board_key}' missing Mins.Items array.")
    items = mins["Items"]
    if len(items) < 5:
        raise ValueError(f"Board '{board_key}' has fewer than 5 minion slots.")

    if "Tur" in board:
        board["Tur"] = 1
    if "Vic" in board:
        board["Vic"] = 1
    if background_id is not None and "Back" in board:
        board["Back"] = background_id

    for i in range(5):
        index = (4 - i) if reverse_index else i
        spec = team[i] if i < len(team) else None

        if spec is None:
            items[index] = None
            continue

        if not isinstance(spec, dict):
            raise ValueError(f"Invalid team entry at index {i} on board {board_key}.")

        minion = items[index] if isinstance(items[index], dict) else {}
        reset_minion_state(minion)

        pet_name = spec.get("pet")
        perk_name = spec.get("perk")
        level = int(spec.get("level", 1))
        attack = int(spec.get("attack", 1))
        health = int(spec.get("health", 1))
        hat_name = spec.get("hat")

        pet_id = resolve_id(pet_name, pets_by_name, "pet")
        perk_id = resolve_id(perk_name, perks_by_name, "perk", required=False)
        hat_id = resolve_id(hat_name, hats_by_name, "hat", required=False) if hats_by_name else None

        minion["Enu"] = pet_id
        minion["Lvl"] = level
        minion["Perk"] = perk_id
        if "Cosm" in minion:
            minion["Cosm"] = hat_id or 0

        if isinstance(minion.get("At"), dict):
            minion["At"]["Perm"] = attack
        else:
            minion["At"] = {"Perm": attack, "Temp": 0, "Max": None}

        if isinstance(minion.get("Hp"), dict):
            minion["Hp"]["Perm"] = health
        else:
            minion["Hp"] = {"Perm": health, "Temp": 0, "Max": None}

        ability_ids = abilities_by_pet.get(normalize_name(str(pet_name)), [])
        minion["Abil"] = [transform_ability(ability_id, level) for ability_id in ability_ids]

        items[index] = minion


def main() -> None:
    config_path = next((p for p in DEFAULT_CONFIG_PATHS if p.exists()), FALLBACK_CONFIG_PATH)
    if not config_path.exists():
        raise SystemExit(
            "No config found. Create scripts/make-team.config.json (or scripts/make-team.config.example.json)."
        )

    config = load_json(config_path)
    template_path = ROOT / config.get("template", "tmp/replay-template.json")
    output_path = ROOT / config.get("output", "generated-battle.json")

    if not template_path.exists():
        raise SystemExit(
            f"Template not found: {template_path}\n"
            "Put a valid SAP battle JSON template there (see docs/REPLAY_JSON_GENERATOR.md)."
        )

    pets_by_name = build_name_to_id_map(load_json(PETS_PATH))
    perks_by_name = build_name_to_id_map(load_json(PERKS_PATH))

    hats_by_name = {
        normalize_name(k): int(v)
        for k, v in (config.get("hats", {}) or {}).items()
    }
    backgrounds_by_name = {
        normalize_name(k): int(v)
        for k, v in (config.get("backgrounds", {}) or {}).items()
    }

    battle = load_json(template_path)
    battle = deepcopy(battle)

    background_name = config.get("background")
    background_id = None
    if background_name is not None:
        background_id = resolve_id(background_name, backgrounds_by_name, "background", required=False)

    abilities_by_pet = {
        normalize_name(k): [int(x) for x in v]
        for k, v in (config.get("abilitiesByPet", {}) or {}).items()
    }

    resolved_teams = resolve_teams_from_config(config)
    user_team = resolved_teams["team_1"]
    opponent_team = resolved_teams["team_2"]

    edit_board(
        battle,
        "UserBoard",
        user_team,
        reverse_index=False,
        pets_by_name=pets_by_name,
        perks_by_name=perks_by_name,
        abilities_by_pet=abilities_by_pet,
        hats_by_name=hats_by_name,
        background_id=background_id,
    )
    edit_board(
        battle,
        "OpponentBoard",
        opponent_team,
        reverse_index=True,
        pets_by_name=pets_by_name,
        perks_by_name=perks_by_name,
        abilities_by_pet=abilities_by_pet,
        hats_by_name=hats_by_name,
        background_id=background_id,
    )

    with output_path.open("w", encoding="utf-8") as f:
        json.dump(battle, f, indent=2)

    if config.get("calculatorState") or config.get("calculatorStateFile"):
        print("Loaded teams from calculator state.")
    print(f"Generated replay battle JSON: {output_path}")


if __name__ == "__main__":
    try:
        main()
    except ValueError as error:
        raise SystemExit(f"Configuration error: {error}")
