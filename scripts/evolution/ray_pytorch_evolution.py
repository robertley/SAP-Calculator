#!/usr/bin/env python3
import argparse
import base64
import json
import math
import os
import random
import subprocess
import time
from concurrent.futures import ThreadPoolExecutor
from copy import deepcopy
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import torch
from torch import nn
from torch.utils.data import DataLoader, TensorDataset

try:
    import ray  # type: ignore

    HAS_RAY = True
except Exception:
    ray = None  # type: ignore
    HAS_RAY = False

TeamSide = Dict[str, Any]

ABOM_SWALLOW_SLOTS = (1, 2, 3)
ABOM_LEVEL_CHOICES = (1, 3)
FORCED_SIDE_VALUE = 1000
ALLOWED_TURNS = (1000, 1001)
TIMES_HURT_PET_NAMES = frozenset({"Sabertooth Tiger", "Tuna"})
DEFAULT_FOCUS_PRESETS = ("Orca Scam", "Infinite Damage")
AILMENT_EQUIPMENT_NAMES = (
    "Crisp",
    "Dazed",
    "Icky",
    "Silly",
    "Toasty",
    "Weak",
)
DEFAULT_PREFERRED_EQUIPMENT = (
    "Churros",
    "Cashew Nut",
    "Mushroom",
    "Garlic",
    "Coconut",
    "Peanut Butter",
    "Meat Bone",
)
EXPORT_TOKEN_PREFIX = "SAPC1:"

REVERSE_EXPORT_KEY_MAP: Dict[str, str] = {
    "pP": "playerPack",
    "oP": "opponentPack",
    "pT": "playerToy",
    "pTL": "playerToyLevel",
    "pHT": "playerHardToy",
    "pHTL": "playerHardToyLevel",
    "oT": "opponentToy",
    "oTL": "opponentToyLevel",
    "oHT": "opponentHardToy",
    "oHTL": "opponentHardToyLevel",
    "t": "turn",
    "pGS": "playerGoldSpent",
    "oGS": "opponentGoldSpent",
    "pRA": "playerRollAmount",
    "oRA": "opponentRollAmount",
    "pSA": "playerSummonedAmount",
    "oSA": "opponentSummonedAmount",
    "pL3": "playerLevel3Sold",
    "oL3": "opponentLevel3Sold",
    "pTA": "playerTransformationAmount",
    "oTA": "opponentTransformationAmount",
    "p": "playerPets",
    "o": "opponentPets",
    "ap": "allPets",
    "lf": "logFilter",
    "cp": "customPacks",
    "os": "oldStork",
    "tp": "tokenPets",
    "ks": "komodoShuffle",
    "m": "mana",
    "sd": "seed",
    "tc": "triggersConsumed",
    "sa": "showAdvanced",
    "stn": "showTriggerNamesInLogs",
    "swl": "showSwallowedLevels",
    "ae": "ailmentEquipment",
    "cEU": "changeEquipmentUses",
    "lE": "logsEnabled",
    "sim": "simulations",
    "n": "name",
    "a": "attack",
    "h": "health",
    "e": "exp",
    "eq": "equipment",
    "eU": "equipmentUses",
    "bSP": "belugaSwallowedPet",
    "sFSP": "sarcasticFringeheadSwallowedPet",
    "pCP": "parrotCopyPet",
    "pCPB": "parrotCopyPetBelugaSwallowedPet",
    "aPS": "abomParrotSwallowed",
    "aSP1": "abominationSwallowedPet1",
    "aSP2": "abominationSwallowedPet2",
    "aSP3": "abominationSwallowedPet3",
    "aSP1B": "abominationSwallowedPet1BelugaSwallowedPet",
    "aSP2B": "abominationSwallowedPet2BelugaSwallowedPet",
    "aSP3B": "abominationSwallowedPet3BelugaSwallowedPet",
    "aSP1L": "abominationSwallowedPet1Level",
    "aSP2L": "abominationSwallowedPet2Level",
    "aSP3L": "abominationSwallowedPet3Level",
    "aSP1T": "abominationSwallowedPet1TimesHurt",
    "aSP2T": "abominationSwallowedPet2TimesHurt",
    "aSP3T": "abominationSwallowedPet3TimesHurt",
    "bF": "battlesFought",
    "fDBB": "friendsDiedBeforeBattle",
    "fE": "foodsEaten",
    "tH": "timesHurt",
}


def _pet_uses_times_hurt(pet_name: Any) -> bool:
    return isinstance(pet_name, str) and pet_name in TIMES_HURT_PET_NAMES


def _prune_irrelevant_times_hurt_fields(pet: Dict[str, Any]) -> None:
    if not isinstance(pet, dict):
        return

    if not _pet_uses_times_hurt(pet.get("name")):
        pet.pop("timesHurt", None)

    for slot in ABOM_SWALLOW_SLOTS:
        swallowed_name = pet.get(f"abominationSwallowedPet{slot}")
        hurt_key = f"abominationSwallowedPet{slot}TimesHurt"
        if not _pet_uses_times_hurt(swallowed_name):
            pet.pop(hurt_key, None)


def _normalize_abom_level(value: Any) -> int:
    try:
        parsed = int(value)
    except Exception:
        parsed = 1
    return 3 if parsed >= 2 else 1


def _abom_battle_level_from_exp(exp_value: Any) -> int:
    try:
        exp = int(exp_value)
    except Exception:
        exp = 0
    if exp >= 5:
        return 3
    if exp >= 2:
        return 2
    return 1


def _build_abomination_template(swallowed_pet: str, equipment_name: Optional[str] = None) -> Dict[str, Any]:
    result: Dict[str, Any] = {
        "name": "Abomination",
        "attack": 50,
        "health": 50,
        "exp": 5,
        "mana": 50,
        "equipment": {"name": equipment_name} if equipment_name else None,
        "triggersConsumed": 0,
        "battlesFought": 0,
        "timesHurt": 0,
    }
    for slot in ABOM_SWALLOW_SLOTS:
        result[f"abominationSwallowedPet{slot}"] = swallowed_pet
        result[f"abominationSwallowedPet{slot}Level"] = 1
        result[f"abominationSwallowedPet{slot}TimesHurt"] = 0
    return result


def _coerce_pet_to_abomination(
    pet: Any,
    pet_pool: List[str],
    equipment_pool: List[str],
    rng: Optional[random.Random] = None,
) -> Dict[str, Any]:
    source = pet if isinstance(pet, dict) else {}
    existing_name = source.get("name") if isinstance(source.get("name"), str) else None
    any_pet_pool = [name for name in pet_pool if isinstance(name, str) and name]
    fallback_swallowed = any_pet_pool[0] if any_pet_pool else "Behemoth"
    swallowed_seed = (
        existing_name
        if isinstance(existing_name, str) and existing_name and existing_name != "Abomination"
        else fallback_swallowed
    )
    equipment_name = None
    raw_equipment = source.get("equipment")
    if isinstance(raw_equipment, dict) and isinstance(raw_equipment.get("name"), str):
        equipment_name = raw_equipment.get("name")
    elif isinstance(raw_equipment, str):
        equipment_name = raw_equipment
    if not equipment_name and equipment_pool:
        equipment_name = rng.choice(equipment_pool) if rng is not None else equipment_pool[0]

    if isinstance(existing_name, str) and existing_name == "Abomination":
        base = deepcopy(source)
    else:
        base = _build_abomination_template(str(swallowed_seed), equipment_name)

    if isinstance(source.get("attack"), (int, float)):
        base["attack"] = int(source.get("attack"))
    if isinstance(source.get("health"), (int, float)):
        base["health"] = int(source.get("health"))
    if isinstance(source.get("exp"), (int, float)):
        base["exp"] = int(source.get("exp"))
    if isinstance(source.get("mana"), (int, float)):
        base["mana"] = int(source.get("mana"))

    return base


def _run_cli_json(cli_path: str, command: str, payload: Dict[str, Any], cwd: str) -> Any:
    process = subprocess.run(
        ["node", cli_path, command, "--stdin"],
        input=json.dumps(payload),
        text=True,
        capture_output=True,
        cwd=cwd,
        check=False,
    )
    if process.returncode != 0:
        raise RuntimeError(
            f"CLI command failed ({command})\nstdout:\n{process.stdout}\nstderr:\n{process.stderr}"
        )
    return json.loads(process.stdout)


def _is_sloth_preset(entry: Dict[str, Any]) -> bool:
    entry_id = str(entry.get("id", "")).strip().lower()
    entry_name = str(entry.get("name", "")).strip().lower()
    if entry_id == "default-sloths":
        return True
    return "sloth" in entry_name


def _parse_focus_presets(raw: str) -> List[str]:
    parts = [part.strip().lower() for part in str(raw).split(",")]
    return [part for part in parts if part]


def _parse_csv_values(raw: str) -> List[str]:
    return [part.strip() for part in str(raw).split(",") if part.strip()]


def _is_focus_preset(entry: Dict[str, Any], focus_terms: List[str]) -> bool:
    entry_id = str(entry.get("id", "")).strip().lower()
    entry_name = str(entry.get("name", "")).strip().lower()
    if not focus_terms:
        return False
    return any(term in entry_id or term in entry_name for term in focus_terms)


def _normalize_toy(team: TeamSide, allowed_toys: List[str], rng: Optional[random.Random] = None) -> TeamSide:
    normalized = normalize_team(team)
    allowed = {name for name in allowed_toys if isinstance(name, str) and name}
    toy_name = normalized.get("toy")
    if not isinstance(toy_name, str) or toy_name not in allowed:
        normalized["toy"] = (rng.choice(allowed_toys) if (rng is not None and allowed_toys) else None)
        normalized["toyLevel"] = 1
        return normalized

    try:
        toy_level = int(normalized.get("toyLevel", 1))
    except Exception:
        toy_level = 1
    normalized["toyLevel"] = max(1, min(3, toy_level))
    return normalized


def load_preset_entries(cli_path: str, cwd: str) -> List[Dict[str, Any]]:
    process = subprocess.run(
        ["node", cli_path, "preset-pool"],
        text=True,
        capture_output=True,
        cwd=cwd,
        check=False,
    )
    if process.returncode != 0:
        raise RuntimeError(
            f"Failed to load preset pool\nstdout:\n{process.stdout}\nstderr:\n{process.stderr}"
        )
    data = json.loads(process.stdout)
    teams = data.get("teams", [])
    filtered_entries = [
        entry
        for entry in teams
        if isinstance(entry, dict) and not _is_sloth_preset(entry)
    ]
    return filtered_entries


def load_preset_pool(cli_path: str, cwd: str) -> List[TeamSide]:
    return [entry.get("team", {}) for entry in load_preset_entries(cli_path, cwd)]


def normalize_team(team: TeamSide) -> TeamSide:
    normalized = deepcopy(team)
    pets = normalized.get("pets")
    if not isinstance(pets, list):
        pets = []
    pets = pets[:5]
    while len(pets) < 5:
        pets.append(None)
    normalized_pets: List[Optional[Dict[str, Any]]] = []
    for pet in pets:
        abom = _coerce_pet_to_abomination(pet, [], [], None)
        _prune_irrelevant_times_hurt_fields(abom)
        _enforce_pet_stat_caps(abom, [], None)
        abom["mana"] = max(0, min(50, int(abom.get("mana", 50))))
        normalized_pets.append(abom)
    normalized["pets"] = normalized_pets
    existing_turn = normalized.get("turn")
    if existing_turn in ALLOWED_TURNS:
        normalized["turn"] = int(existing_turn)
    else:
        normalized["turn"] = FORCED_SIDE_VALUE
    normalized["goldSpent"] = FORCED_SIDE_VALUE
    normalized["rollAmount"] = FORCED_SIDE_VALUE
    normalized["summonedAmount"] = FORCED_SIDE_VALUE
    normalized["level3Sold"] = FORCED_SIDE_VALUE
    normalized["transformationAmount"] = FORCED_SIDE_VALUE
    return normalized


def team_hash(team: TeamSide) -> str:
    return json.dumps(normalize_team(team), sort_keys=True, separators=(",", ":"))


def gather_vocab(teams: List[TeamSide]) -> Tuple[List[str], List[str]]:
    pet_names = set()
    equipment_names = set()
    for team in teams:
        for pet in normalize_team(team).get("pets", []):
            if isinstance(pet, dict):
                name = pet.get("name")
                if isinstance(name, str) and name:
                    pet_names.add(name)
                equipment = pet.get("equipment")
                if isinstance(equipment, dict):
                    equipment_name = equipment.get("name")
                elif isinstance(equipment, str):
                    equipment_name = equipment
                else:
                    equipment_name = None
                if isinstance(equipment_name, str) and equipment_name:
                    equipment_names.add(equipment_name)
    return sorted(pet_names), sorted(equipment_names)


def load_global_catalog_pools(workspace: str) -> Tuple[List[str], List[str], List[str]]:
    data_dir = os.path.join(workspace, "src", "assets", "data")
    pets_path = os.path.join(data_dir, "pets.json")
    perks_path = os.path.join(data_dir, "perks.json")
    toys_path = os.path.join(data_dir, "toys.json")

    def _load_rows(path: str) -> List[Dict[str, Any]]:
        if not os.path.exists(path):
            return []
        with open(path, "r", encoding="utf-8") as f:
            rows = json.load(f)
        if not isinstance(rows, list):
            return []
        parsed_rows: List[Dict[str, Any]] = []
        for row in rows:
            if isinstance(row, dict):
                parsed_rows.append(row)
        return parsed_rows

    def _load_names(path: str, key: str) -> List[str]:
        names: List[str] = []
        for row in _load_rows(path):
            value = row.get(key)
            if isinstance(value, str) and value.strip():
                names.append(value.strip())
        return names

    pet_names = sorted(set(_load_names(pets_path, "Name")))
    perk_names = {name for name in _load_names(perks_path, "Name") if name}
    equipment_names = sorted(perk_names)

    for ailment_name in AILMENT_EQUIPMENT_NAMES:
        if ailment_name in perk_names and ailment_name not in equipment_names:
            equipment_names.append(ailment_name)
    equipment_names = sorted(set(equipment_names))
    toy_rows = _load_rows(toys_path)
    toy_names = sorted(
        {
            row["Name"].strip()
            for row in toy_rows
            if isinstance(row.get("Name"), str)
            and row["Name"].strip()
            and int(row.get("ToyType", 0)) == 0
        }
    )
    return pet_names, equipment_names, toy_names


def _extract_side_from_calculator_state(data: Dict[str, Any], side: str) -> TeamSide:
    is_player = side == "player"
    pack_value = data.get("playerPack" if is_player else "opponentPack")
    toy_level_value = data.get("playerToyLevel" if is_player else "opponentToyLevel", 1)
    hard_toy_level_value = data.get("playerHardToyLevel" if is_player else "opponentHardToyLevel", 1)

    pack_name = pack_value if isinstance(pack_value, str) and pack_value.strip() else "Turtle"
    try:
        toy_level = max(1, min(3, int(toy_level_value)))
    except Exception:
        toy_level = 1
    try:
        hard_toy_level = max(1, min(3, int(hard_toy_level_value)))
    except Exception:
        hard_toy_level = 1

    return {
        "pack": pack_name,
        "toy": data.get("playerToy" if is_player else "opponentToy"),
        "toyLevel": toy_level,
        "hardToy": data.get("playerHardToy" if is_player else "opponentHardToy"),
        "hardToyLevel": hard_toy_level,
        "turn": data.get("turn", FORCED_SIDE_VALUE),
        "goldSpent": data.get("playerGoldSpent" if is_player else "opponentGoldSpent", FORCED_SIDE_VALUE),
        "rollAmount": data.get("playerRollAmount" if is_player else "opponentRollAmount", FORCED_SIDE_VALUE),
        "summonedAmount": data.get(
            "playerSummonedAmount" if is_player else "opponentSummonedAmount",
            FORCED_SIDE_VALUE,
        ),
        "level3Sold": data.get("playerLevel3Sold" if is_player else "opponentLevel3Sold", FORCED_SIDE_VALUE),
        "transformationAmount": data.get(
            "playerTransformationAmount" if is_player else "opponentTransformationAmount",
            FORCED_SIDE_VALUE,
        ),
        "pets": data.get("playerPets" if is_player else "opponentPets", []),
    }


def load_teams_from_file(path: str) -> List[TeamSide]:
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, dict):
        raise ValueError(f"Warm-start team file must contain a JSON object: {path}")
    if isinstance(data.get("pets"), list):
        return [data]
    if isinstance(data.get("playerPets"), list) and isinstance(data.get("opponentPets"), list):
        return [
            _extract_side_from_calculator_state(data, "player"),
            _extract_side_from_calculator_state(data, "opponent"),
        ]
    raise ValueError(
        f"Warm-start JSON must be either team-side shape ('pets') or calculator-state shape ('playerPets'/'opponentPets'): {path}"
    )


def _expand_export_keys(data: Any) -> Any:
    if isinstance(data, list):
        return [_expand_export_keys(item) for item in data]
    if isinstance(data, dict):
        expanded: Dict[str, Any] = {}
        for key, value in data.items():
            new_key = REVERSE_EXPORT_KEY_MAP.get(str(key), str(key))
            expanded[new_key] = _expand_export_keys(value)
        return expanded
    return data


def _decode_base64url_json(encoded_payload: str) -> Any:
    payload = encoded_payload.replace("-", "+").replace("_", "/")
    payload += "=" * ((4 - (len(payload) % 4)) % 4)
    decoded = base64.b64decode(payload.encode("utf-8")).decode("utf-8")
    return json.loads(decoded)


def load_teams_from_export_token(token: str, side: str = "opponent") -> List[TeamSide]:
    raw = str(token or "").strip()
    if not raw:
        return []

    encoded = raw
    if raw.startswith(EXPORT_TOKEN_PREFIX):
        encoded = raw[len(EXPORT_TOKEN_PREFIX) :]
    elif "#c=" in raw:
        encoded = raw.split("#c=", 1)[1]

    parsed = _decode_base64url_json(encoded)
    expanded = _expand_export_keys(parsed)
    if not isinstance(expanded, dict):
        raise ValueError("Warm-start export must decode to a JSON object.")

    if isinstance(expanded.get("pets"), list):
        return [expanded]

    if not isinstance(expanded.get("playerPets"), list) or not isinstance(expanded.get("opponentPets"), list):
        raise ValueError(
            "Warm-start export must contain player/opponent pets after decode."
        )

    normalized_side = str(side or "opponent").strip().lower()
    if normalized_side not in {"player", "opponent", "both"}:
        normalized_side = "opponent"

    teams: List[TeamSide] = []
    if normalized_side in {"player", "both"}:
        teams.append(_extract_side_from_calculator_state(expanded, "player"))
    if normalized_side in {"opponent", "both"}:
        teams.append(_extract_side_from_calculator_state(expanded, "opponent"))
    return teams


def random_pet(pet_pool: List[str], equipment_pool: List[str], rng: random.Random) -> Dict[str, Any]:
    any_pet_pool = [name for name in pet_pool if isinstance(name, str) and name]
    swallowed_pet = rng.choice(any_pet_pool) if any_pet_pool else "Behemoth"
    equipment_name = rng.choice(equipment_pool) if equipment_pool and rng.random() < 0.95 else None
    pet = _build_abomination_template(swallowed_pet, equipment_name)
    pet["attack"] = rng.randint(1, 50)
    pet["health"] = rng.randint(1, 50)
    pet["exp"] = rng.choice([0, 1, 2, 5])
    pet["mana"] = rng.randint(0, 50)
    _ensure_abomination_constraints(pet, pet_pool, rng)
    return pet


def _abom_cap(value: int) -> int:
    return max(1, min(100, value))


def _ensure_abomination_constraints(
    pet: Dict[str, Any],
    pet_pool: List[str],
    rng: Optional[random.Random] = None,
) -> None:
    if str(pet.get("name", "")) != "Abomination":
        return

    any_pet_pool = [name for name in pet_pool if isinstance(name, str) and name]
    fallback_pool = any_pet_pool if any_pet_pool else ["Behemoth", "Leopard", "Beluga Whale"]

    abom_level = _abom_battle_level_from_exp(pet.get("exp", 0))
    active_slots = set(ABOM_SWALLOW_SLOTS[:abom_level])
    used_swallowed: set[str] = set()

    swallowed_values: List[str] = []
    for slot in ABOM_SWALLOW_SLOTS:
        pet_key = f"abominationSwallowedPet{slot}"
        level_key = f"abominationSwallowedPet{slot}Level"
        hurt_key = f"abominationSwallowedPet{slot}TimesHurt"
        beluga_key = f"abominationSwallowedPet{slot}BelugaSwallowedPet"

        if slot not in active_slots:
            pet[pet_key] = None
            pet.pop(level_key, None)
            pet.pop(hurt_key, None)
            pet.pop(beluga_key, None)
            continue

        raw_swallowed = pet.get(pet_key)
        candidate_name = raw_swallowed.strip() if isinstance(raw_swallowed, str) and raw_swallowed.strip() else None
        if candidate_name in used_swallowed:
            candidate_name = None

        if candidate_name is None:
            available = [name for name in fallback_pool if name not in used_swallowed]
            if not available:
                available = fallback_pool
            if rng is not None:
                swallowed_name = rng.choice(available)
            else:
                swallowed_name = available[0]
        else:
            swallowed_name = candidate_name

        pet[pet_key] = swallowed_name
        used_swallowed.add(swallowed_name)
        swallowed_values.append(swallowed_name)
        pet[level_key] = _normalize_abom_level(pet.get(level_key, 1))
        if _pet_uses_times_hurt(swallowed_name):
            hurt_value = int(pet.get(hurt_key, 0))
            pet[hurt_key] = max(0, min(200, hurt_value))
        else:
            pet.pop(hurt_key, None)
        if swallowed_name != "Beluga Whale":
            pet.pop(beluga_key, None)

    has_behemoth = any(swallowed == "Behemoth" for swallowed in swallowed_values)
    stat_cap = 100 if has_behemoth else 50
    pet["attack"] = max(1, min(stat_cap, int(pet.get("attack", 100))))
    pet["health"] = max(1, min(stat_cap, int(pet.get("health", 100))))


def _enforce_pet_stat_caps(
    pet: Dict[str, Any],
    pet_pool: List[str],
    rng: Optional[random.Random] = None,
) -> None:
    if str(pet.get("name", "")) == "Abomination":
        _ensure_abomination_constraints(pet, pet_pool, rng)
        return
    pet["attack"] = max(1, min(50, int(pet.get("attack", 1))))
    pet["health"] = max(1, min(50, int(pet.get("health", 1))))


def _mutate_abomination_swallowed(
    pet: Dict[str, Any],
    pet_pool: List[str],
    rng: random.Random,
) -> None:
    if str(pet.get("name", "")) != "Abomination":
        return

    abom_level = _abom_battle_level_from_exp(pet.get("exp", 0))
    active_slots = ABOM_SWALLOW_SLOTS[:abom_level]
    if not active_slots:
        return

    slot = rng.choice(active_slots)
    mode = rng.choice(["pet", "level", "times_hurt", "beluga_swallowed"])
    any_pet_pool = [name for name in pet_pool if isinstance(name, str) and name]
    if not any_pet_pool:
        any_pet_pool = ["Behemoth", "Leopard", "Beluga Whale", "Slug"]

    pet_key = f"abominationSwallowedPet{slot}"
    level_key = f"abominationSwallowedPet{slot}Level"
    hurt_key = f"abominationSwallowedPet{slot}TimesHurt"
    beluga_key = f"abominationSwallowedPet{slot}BelugaSwallowedPet"

    if mode == "pet":
        other_swallowed = {
            str(pet.get(f"abominationSwallowedPet{s}", "")).strip()
            for s in active_slots
            if s != slot and isinstance(pet.get(f"abominationSwallowedPet{s}"), str)
        }
        choices = [name for name in any_pet_pool if name not in other_swallowed]
        if not choices:
            choices = any_pet_pool
        pet[pet_key] = rng.choice(choices)
    elif mode == "level":
        current = _normalize_abom_level(pet.get(level_key, 1))
        pet[level_key] = 3 if current == 1 else 1
    elif mode == "times_hurt":
        if _pet_uses_times_hurt(pet.get(pet_key)):
            base = int(pet.get(hurt_key, 0))
            pet[hurt_key] = max(0, min(200, base + rng.randint(-20, 20)))
    else:
        swallowed = str(pet.get(pet_key, ""))
        if swallowed == "Beluga Whale" or rng.random() < 0.25:
            pet[beluga_key] = rng.choice(any_pet_pool)

    _ensure_abomination_constraints(pet, pet_pool, rng)


def mutate_team(
    team: TeamSide,
    pet_pool: List[str],
    equipment_pool: List[str],
    toy_pool: List[str],
    rng: random.Random,
    mutation_strength: float = 1.0,
) -> TeamSide:
    candidate = normalize_team(team)
    pets = candidate["pets"]
    mutation_count = max(1, int(round(rng.uniform(1, 3) * mutation_strength)))

    op_pool = [
        "swap",
        "replace",
        "stats",
        "equip",
        "equip",
        "equip",
        "exp",
        "mana",
        "abom_swallowed",
        "turn",
        "toy",
        "reroll_team_equip",
    ]

    for _ in range(mutation_count):
        op = rng.choice(op_pool)
        idx = rng.randrange(5)
        if op == "reroll_team_equip":
            if equipment_pool:
                for slot_pet in pets:
                    if not isinstance(slot_pet, dict):
                        continue
                    if rng.random() < 0.85:
                        slot_pet["equipment"] = {"name": rng.choice(equipment_pool)}
                    elif rng.random() < 0.03:
                        slot_pet["equipment"] = None
            continue


        if op == "swap":
            jdx = rng.randrange(5)
            pets[idx], pets[jdx] = pets[jdx], pets[idx]
            continue

        if op == "replace":
            pets[idx] = random_pet(pet_pool, equipment_pool, rng)
            continue

        pet = pets[idx]
        if not isinstance(pet, dict):
            pets[idx] = random_pet(pet_pool, equipment_pool, rng)
            continue

        if str(pet.get("name", "")) != "Abomination":
            pet = _coerce_pet_to_abomination(pet, pet_pool, equipment_pool, rng)
            pets[idx] = pet

        _ensure_abomination_constraints(pet, pet_pool, rng)

        if op == "stats":
            attack = int(pet.get("attack", 1))
            health = int(pet.get("health", 1))
            if str(pet.get("name", "")) == "Abomination":
                pet["attack"] = _abom_cap(attack + rng.randint(-12, 12))
                pet["health"] = _abom_cap(health + rng.randint(-12, 12))
                _ensure_abomination_constraints(pet, pet_pool, rng)
            else:
                pet["attack"] = max(1, min(50, attack + rng.randint(-12, 12)))
                pet["health"] = max(1, min(50, health + rng.randint(-12, 12)))
            if "mana" in pet:
                pet["mana"] = max(0, min(50, int(pet.get("mana", 0)) + rng.randint(-8, 8)))
            continue

        if op == "equip":
            if equipment_pool and rng.random() < 0.97:
                pet["equipment"] = {"name": rng.choice(equipment_pool)}
            else:
                pet["equipment"] = None
            continue

        if op == "exp":
            pet["exp"] = rng.choice([0, 1, 2, 5])
            continue

        if op == "mana":
            base_mana = int(pet.get("mana", 50))
            pet["mana"] = max(0, min(50, base_mana + rng.randint(-8, 8)))
            continue

        if op == "abom_swallowed":
            _mutate_abomination_swallowed(pet, pet_pool, rng)
            continue

        if op == "turn":
            candidate["turn"] = rng.choice(ALLOWED_TURNS)
            continue

        if op == "toy":
            if toy_pool:
                candidate["toy"] = rng.choice(toy_pool)
            candidate["toyLevel"] = rng.randint(1, 3)
            continue

    candidate["pets"] = pets
    for index, pet in enumerate(candidate["pets"]):
        if not isinstance(pet, dict) or str(pet.get("name", "")) != "Abomination":
            pet = _coerce_pet_to_abomination(pet, pet_pool, equipment_pool, rng)
            candidate["pets"][index] = pet
        _enforce_pet_stat_caps(pet, pet_pool, rng)
        pet["mana"] = max(0, min(50, int(pet.get("mana", 50))))
    if candidate.get("turn") not in ALLOWED_TURNS:
        candidate["turn"] = FORCED_SIDE_VALUE
    if toy_pool:
        if candidate.get("toy") not in toy_pool:
            candidate["toy"] = rng.choice(toy_pool)
    else:
        candidate["toy"] = None
    try:
        toy_level = int(candidate.get("toyLevel", 1))
    except Exception:
        toy_level = 1
    candidate["toyLevel"] = max(1, min(3, toy_level))
    candidate["goldSpent"] = FORCED_SIDE_VALUE
    candidate["rollAmount"] = FORCED_SIDE_VALUE
    candidate["summonedAmount"] = FORCED_SIDE_VALUE
    candidate["level3Sold"] = FORCED_SIDE_VALUE
    candidate["transformationAmount"] = FORCED_SIDE_VALUE
    return candidate


def crossover(parent_a: TeamSide, parent_b: TeamSide, rng: random.Random) -> TeamSide:
    a_pets = normalize_team(parent_a)["pets"]
    b_pets = normalize_team(parent_b)["pets"]
    child_pets = []
    for idx in range(5):
        source = a_pets if rng.random() < 0.5 else b_pets
        child_pets.append(deepcopy(source[idx]))
    child = normalize_team(parent_a)
    child["pets"] = child_pets
    return child


def team_to_tokens(team: TeamSide) -> List[str]:
    tokens: List[str] = []
    normalized = normalize_team(team)
    toy_name = normalized.get("toy")
    if isinstance(toy_name, str) and toy_name:
        tokens.append(f"team:toy:{toy_name}")
    tokens.append(f"team:toyLevel:{int(normalized.get('toyLevel', 1))}")
    tokens.append(f"team:turn:{int(normalized.get('turn', FORCED_SIDE_VALUE))}")
    for idx, pet in enumerate(normalized["pets"]):
        if not isinstance(pet, dict):
            tokens.append(f"slot:{idx}:empty")
            continue
        name = str(pet.get("name", ""))
        tokens.append(f"slot:{idx}:pet:{name}")
        equipment = pet.get("equipment")
        equipment_name = None
        if isinstance(equipment, dict):
            equipment_name = equipment.get("name")
        elif isinstance(equipment, str):
            equipment_name = equipment
        if equipment_name:
            tokens.append(f"slot:{idx}:equip:{equipment_name}")
        attack = int(pet.get("attack", 0))
        health = int(pet.get("health", 0))
        exp = int(pet.get("exp", 0))
        tokens.append(f"slot:{idx}:atk:{min(20, attack // 10)}")
        tokens.append(f"slot:{idx}:hp:{min(20, health // 10)}")
        tokens.append(f"slot:{idx}:exp:{exp}")
        if name == "Abomination":
            for swallow_idx in ABOM_SWALLOW_SLOTS:
                swallowed = str(pet.get(f"abominationSwallowedPet{swallow_idx}", ""))
                swallowed_level = int(pet.get(f"abominationSwallowedPet{swallow_idx}Level", 1))
                if swallowed:
                    tokens.append(f"slot:{idx}:abom:{swallow_idx}:pet:{swallowed}")
                tokens.append(
                    f"slot:{idx}:abom:{swallow_idx}:lvl:{max(1, min(3, swallowed_level))}"
                )
    return tokens


def featurize(team: TeamSide, dim: int) -> torch.Tensor:
    vector = torch.zeros(dim, dtype=torch.float32)
    for token in team_to_tokens(team):
        index = hash(token) % dim
        vector[index] += 1.0
    return vector


class SurrogateModel(nn.Module):
    def __init__(self, input_dim: int):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, 256),
            nn.ReLU(),
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Linear(128, 1),
            nn.Sigmoid(),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x)


@dataclass
class Sample:
    team: TeamSide
    fitness: float


def evaluate_batch_worker(
    cli_path: str,
    cwd: str,
    batch: List[TeamSide],
    opponents: List[TeamSide],
    simulations_per_matchup: int,
    base_config: Dict[str, Any],
    seed: int,
    variance_penalty: float,
) -> List[float]:
    payload = {
        "candidates": batch,
        "opponents": opponents,
        "simulationsPerMatchup": simulations_per_matchup,
        "baseConfig": base_config,
        "seed": seed,
        "variancePenalty": variance_penalty,
        "includeMatchups": False,
    }
    response = _run_cli_json(cli_path, "evaluate-batch", payload, cwd)
    return [float(row.get("fitness", 0.0)) for row in response]


def _team_quality_bonus(
    team: TeamSide,
    mana_weight: float,
    equipment_weight: float,
    preferred_equipment: List[str],
) -> float:
    normalized = normalize_team(team)
    pets = [pet for pet in normalized.get("pets", []) if isinstance(pet, dict)]
    if not pets:
        return 0.0

    avg_mana_ratio = sum(max(0, min(50, int(pet.get("mana", 50)))) for pet in pets) / (len(pets) * 50.0)
    preferred_set = {name.strip() for name in preferred_equipment if isinstance(name, str) and name.strip()}

    equipment_score = 0.0
    for pet in pets:
        equipment = pet.get("equipment")
        equipment_name = None
        if isinstance(equipment, dict):
            equipment_name = equipment.get("name")
        elif isinstance(equipment, str):
            equipment_name = equipment

        if isinstance(equipment_name, str) and equipment_name.strip():
            if equipment_name.strip() in preferred_set:
                equipment_score += 1.0
            else:
                equipment_score += 0.35
        else:
            equipment_score += 0.0

    avg_equipment_score = equipment_score / len(pets)
    return mana_weight * avg_mana_ratio + equipment_weight * avg_equipment_score


def train_surrogate(
    model: SurrogateModel,
    samples: List[Sample],
    feature_dim: int,
    epochs: int,
    batch_size: int,
    device: torch.device,
) -> None:
    if len(samples) < 32:
        return
    features = torch.stack([featurize(sample.team, feature_dim) for sample in samples])
    targets = torch.tensor([[sample.fitness] for sample in samples], dtype=torch.float32)
    dataset = TensorDataset(features, targets)
    loader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

    optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
    loss_fn = nn.MSELoss()
    model.train()
    model.to(device)

    for _ in range(epochs):
        for x, y in loader:
            x = x.to(device)
            y = y.to(device)
            optimizer.zero_grad()
            prediction = model(x)
            loss = loss_fn(prediction, y)
            loss.backward()
            optimizer.step()


def predict_scores(
    model: SurrogateModel,
    teams: List[TeamSide],
    feature_dim: int,
    device: torch.device,
) -> List[float]:
    if not teams:
        return []
    model.eval()
    with torch.no_grad():
        features = torch.stack([featurize(team, feature_dim) for team in teams]).to(device)
        preds = model(features).squeeze(-1).detach().cpu().tolist()
    return [float(value) for value in preds]


def chunked(items: List[Any], chunk_size: int) -> List[List[Any]]:
    return [items[i : i + chunk_size] for i in range(0, len(items), chunk_size)]


def evaluate_population_ray(
    cli_path: str,
    cwd: str,
    population: List[TeamSide],
    opponents: List[TeamSide],
    simulations_per_matchup: int,
    base_config: Dict[str, Any],
    variance_penalty: float,
    batch_size: int,
    seed: int,
) -> List[float]:
    batches = chunked(population, batch_size)
    results: List[List[float]] = []

    def _run_threadpool() -> List[List[float]]:
        max_workers = max(1, min(len(batches), (os.cpu_count() or 1)))
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            futures = []
            for index, batch in enumerate(batches):
                futures.append(
                    executor.submit(
                        evaluate_batch_worker,
                        cli_path,
                        cwd,
                        batch,
                        opponents,
                        simulations_per_matchup,
                        base_config,
                        seed + index * 1000,
                        variance_penalty,
                    )
                )
            return [future.result() for future in futures]

    if HAS_RAY and ray is not None and ray.is_initialized():
        refs = []
        remote_worker = ray.remote(evaluate_batch_worker)
        for index, batch in enumerate(batches):
            refs.append(
                remote_worker.remote(
                    cli_path,
                    cwd,
                    batch,
                    opponents,
                    simulations_per_matchup,
                    base_config,
                    seed + index * 1000,
                    variance_penalty,
                )
            )
        try:
            results = ray.get(refs)
        except Exception as error:
            print(f"ray_batch_failed_fallback={error}")
            results = _run_threadpool()
    else:
        results = _run_threadpool()

    scores: List[float] = []
    for batch_scores in results:
        scores.extend(batch_scores)
    return scores


def select_top_unique(teams: List[TeamSide], scores: List[float], count: int) -> Tuple[List[TeamSide], List[float]]:
    rows = sorted(zip(teams, scores), key=lambda row: row[1], reverse=True)
    chosen_teams: List[TeamSide] = []
    chosen_scores: List[float] = []
    seen = set()
    for team, score in rows:
        key = team_hash(team)
        if key in seen:
            continue
        seen.add(key)
        chosen_teams.append(team)
        chosen_scores.append(score)
        if len(chosen_teams) >= count:
            break
    return chosen_teams, chosen_scores


def ensure_population(
    seeds: List[TeamSide],
    population_size: int,
    rng: random.Random,
    pet_pool: List[str],
    equipment_pool: List[str],
    toy_pool: List[str],
) -> List[TeamSide]:
    population = [normalize_team(team) for team in seeds]
    while len(population) < population_size:
        source = rng.choice(population) if population else {"pets": [None, None, None, None, None]}
        population.append(mutate_team(source, pet_pool, equipment_pool, toy_pool, rng))
    return population[:population_size]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Evolutionary team search using Ray + PyTorch surrogate")
    parser.add_argument("--workspace", default=str(Path(__file__).resolve().parents[2]))
    parser.add_argument("--cli", default="simulation/dist/cli.js")
    parser.add_argument("--output", default="tmp/evolution-ray-pytorch-report.json")
    parser.add_argument("--generations", type=int, default=20)
    parser.add_argument("--population", type=int, default=64)
    parser.add_argument("--offspring", type=int, default=160)
    parser.add_argument("--elite", type=int, default=16)
    parser.add_argument("--opponents", type=int, default=20)
    parser.add_argument("--simulations", type=int, default=60)
    parser.add_argument("--batch-size", type=int, default=8)
    parser.add_argument("--seed", type=int, default=1337)
    parser.add_argument("--variance-penalty", type=float, default=0.1)
    parser.add_argument("--feature-dim", type=int, default=1024)
    parser.add_argument("--surrogate-epochs", type=int, default=20)
    parser.add_argument("--surrogate-batch-size", type=int, default=64)
    parser.add_argument("--ray-address", default=None)
    parser.add_argument("--cpu", type=int, default=None)
    parser.add_argument("--focus-presets", default=",".join(DEFAULT_FOCUS_PRESETS))
    parser.add_argument("--focus-share", type=float, default=0.7)
    parser.add_argument("--seed-source", choices=["all", "focus"], default="all")
    parser.add_argument("--focus-anchor-only", action="store_true")
    parser.add_argument("--warm-start-team", action="append", default=[])
    parser.add_argument("--warm-start-export", action="append", default=[])
    parser.add_argument(
        "--warm-start-export-side",
        choices=["player", "opponent", "both"],
        default="opponent",
    )
    parser.add_argument("--opponent-source", choices=["presets", "warm-start"], default="presets")
    parser.add_argument("--prototype", action="store_true")
    parser.add_argument("--simulations-min", type=int, default=None)
    parser.add_argument("--surrogate-train-every", type=int, default=1)
    parser.add_argument("--force-max-mana", action="store_true")
    parser.add_argument("--mana-weight", type=float, default=0.05)
    parser.add_argument("--equipment-weight", type=float, default=0.0)
    parser.add_argument("--preferred-equipment", default="")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    workspace = os.path.abspath(args.workspace)
    cli_path = os.path.abspath(os.path.join(workspace, args.cli))

    if not os.path.exists(cli_path):
        raise FileNotFoundError(
            f"CLI not found at {cli_path}. Build it first with: npm run bundle-simulation"
        )

    if args.prototype:
        args.generations = min(args.generations, 8)
        args.population = min(args.population, 28)
        args.offspring = min(args.offspring, 64)
        args.elite = min(args.elite, 8)
        args.opponents = min(args.opponents, 14)
        args.simulations = min(args.simulations, 20)
        args.surrogate_epochs = min(args.surrogate_epochs, 8)
        args.batch_size = max(args.batch_size, 10)
        args.surrogate_train_every = max(1, args.surrogate_train_every, 2)
        if args.simulations_min is None:
            args.simulations_min = max(6, min(12, args.simulations))

    args.focus_share = max(0.0, min(1.0, float(args.focus_share)))
    args.surrogate_train_every = max(1, int(args.surrogate_train_every))
    args.mana_weight = max(0.0, float(args.mana_weight))
    args.equipment_weight = max(0.0, float(args.equipment_weight))
    preferred_equipment = _parse_csv_values(args.preferred_equipment)

    rng = random.Random(args.seed)

    if HAS_RAY and ray is not None:
        try:
            if args.ray_address:
                ray.init(address=args.ray_address, ignore_reinit_error=True)
            else:
                ray.init(num_cpus=args.cpu, ignore_reinit_error=True)
            print("parallel_backend=ray")
        except Exception as error:
            print(f"parallel_backend=threadpool (ray init failed: {error})")
    else:
        print("parallel_backend=threadpool (ray unavailable)")

    preset_entries = load_preset_entries(cli_path, workspace)
    preset_teams = [entry.get("team", {}) for entry in preset_entries]
    if not preset_teams:
        raise RuntimeError("No preset teams were loaded from CLI preset-pool command.")

    focus_terms = _parse_focus_presets(args.focus_presets)
    focus_entries = [entry for entry in preset_entries if _is_focus_preset(entry, focus_terms)]
    non_focus_entries = [entry for entry in preset_entries if not _is_focus_preset(entry, focus_terms)]
    selected_focus_entries = [focus_entries[0]] if (args.focus_anchor_only and focus_entries) else focus_entries

    opponent_limit = max(1, args.opponents)
    opponents: List[TeamSide] = []
    if args.opponent_source == "presets":
        if focus_entries:
            focus_slots = max(len(focus_entries), int(round(opponent_limit * args.focus_share)))
            focus_slots = min(opponent_limit, focus_slots)
            focus_index = 0
            while len(opponents) < focus_slots:
                entry = focus_entries[focus_index % len(focus_entries)]
                opponents.append(normalize_team(entry.get("team", {})))
                focus_index += 1
            opponents.extend(
                normalize_team(entry.get("team", {}))
                for entry in non_focus_entries[: max(0, opponent_limit - len(opponents))]
            )
        else:
            opponents.extend(
                normalize_team(entry.get("team", {}))
                for entry in non_focus_entries[:opponent_limit]
            )
    if args.seed_source == "focus" and selected_focus_entries:
        seed_population = [normalize_team(entry.get("team", {})) for entry in selected_focus_entries]
    else:
        seed_population = [normalize_team(team) for team in preset_teams]
    seed_pet_pool, seed_equipment_pool = gather_vocab(seed_population)
    catalog_pet_pool, catalog_equipment_pool, catalog_toy_pool = load_global_catalog_pools(workspace)
    pet_pool = sorted(set(seed_pet_pool + catalog_pet_pool))
    equipment_pool = sorted(set(seed_equipment_pool + catalog_equipment_pool))
    toy_pool = sorted(set(catalog_toy_pool))

    seed_population = [_normalize_toy(team, toy_pool, rng) for team in seed_population]
    opponents = [_normalize_toy(team, toy_pool, rng) for team in opponents]

    warm_start_teams: List[TeamSide] = []
    warm_start_inputs = [str(path).strip() for path in args.warm_start_team if str(path).strip()]
    warm_start_exports = [str(value).strip() for value in args.warm_start_export if str(value).strip()]
    if warm_start_inputs or warm_start_exports:
        for warm_start_input in warm_start_inputs:
            warm_start_path = os.path.abspath(os.path.join(workspace, warm_start_input))
            if not os.path.exists(warm_start_path):
                raise FileNotFoundError(f"Warm-start team file not found: {warm_start_path}")
            teams_from_file = load_teams_from_file(warm_start_path)
            for team_from_file in teams_from_file:
                warm_start_team = _normalize_toy(normalize_team(team_from_file), toy_pool, rng)
                warm_start_teams.append(warm_start_team)

        for warm_start_export in warm_start_exports:
            teams_from_export = load_teams_from_export_token(
                warm_start_export,
                side=args.warm_start_export_side,
            )
            for team_from_export in teams_from_export:
                warm_start_team = _normalize_toy(normalize_team(team_from_export), toy_pool, rng)
                warm_start_teams.append(warm_start_team)

        unique_warm: List[TeamSide] = []
        seen_warm = set()
        for team in warm_start_teams:
            key = team_hash(team)
            if key in seen_warm:
                continue
            seen_warm.add(key)
            unique_warm.append(team)
        warm_start_teams = unique_warm

        if warm_start_teams:
            per_team_variants = max(2, min(12, max(1, args.population // max(2, len(warm_start_teams) * 2))))
            warm_start_variants: List[TeamSide] = []
            for warm_start_team in warm_start_teams:
                warm_start_variants.extend(
                    mutate_team(
                        deepcopy(warm_start_team),
                        pet_pool,
                        equipment_pool,
                        toy_pool,
                        rng,
                        mutation_strength=1.15,
                    )
                    for _ in range(per_team_variants)
                )

            seed_population = warm_start_teams + warm_start_variants + seed_population
            print(
                f"warm_start=inputs count={len(warm_start_teams) + len(warm_start_variants)} "
                f"files={','.join(warm_start_inputs) if warm_start_inputs else '-'} "
                f"exports={len(warm_start_exports)} side={args.warm_start_export_side}"
            )

    if args.opponent_source == "warm-start":
        if not warm_start_teams:
            raise ValueError("--opponent-source warm-start requires at least one --warm-start-team input")
        opponents = []
        idx = 0
        while len(opponents) < opponent_limit:
            opponents.append(deepcopy(warm_start_teams[idx % len(warm_start_teams)]))
            idx += 1

    if selected_focus_entries:
        warm_start_count = max(4, min(24, max(1, args.population // 3)))
        focused_warm_starts: List[TeamSide] = []
        per_focus = max(1, warm_start_count // len(selected_focus_entries))
        for entry in selected_focus_entries:
            focus_base = _normalize_toy(normalize_team(entry.get("team", {})), toy_pool, rng)
            focused_warm_starts.append(focus_base)
            focused_warm_starts.extend(
                mutate_team(
                    deepcopy(focus_base),
                    pet_pool,
                    equipment_pool,
                    toy_pool,
                    rng,
                    mutation_strength=1.35,
                )
                for _ in range(per_focus)
            )
        seed_population = focused_warm_starts + seed_population
        print(
            f"warm_start=focus_presets count={len(focused_warm_starts)} presets="
            + ",".join(str(entry.get('id', 'unknown')) for entry in selected_focus_entries)
        )
    else:
        print("warm_start=focus_presets not_found")

    population = ensure_population(
        seed_population,
        max(2, args.population),
        rng,
        pet_pool,
        equipment_pool,
        toy_pool,
    )

    if args.force_max_mana:
        for team in population:
            for pet in team.get("pets", []):
                if isinstance(pet, dict):
                    pet["mana"] = 50

    base_config = {
        "mana": True,
        "tokenPets": True,
        "allPets": True,
        "logsEnabled": False,
    }

    model = SurrogateModel(args.feature_dim)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    history: List[Sample] = []

    generation_reports: List[Dict[str, Any]] = []
    best_team: TeamSide = population[0]
    best_score = -math.inf

    for generation in range(args.generations):
        start = time.time()

        if args.simulations_min is not None and args.generations > 1:
            progress = generation / float(args.generations - 1)
            generation_sims = int(round(args.simulations_min + progress * (args.simulations - args.simulations_min)))
        else:
            generation_sims = args.simulations
        generation_sims = max(1, generation_sims)

        scores = evaluate_population_ray(
            cli_path=cli_path,
            cwd=workspace,
            population=population,
            opponents=opponents,
            simulations_per_matchup=generation_sims,
            base_config=base_config,
            variance_penalty=max(0.0, args.variance_penalty),
            batch_size=max(1, args.batch_size),
            seed=args.seed + generation * 10000,
        )

        if args.force_max_mana:
            for team in population:
                for pet in team.get("pets", []):
                    if isinstance(pet, dict):
                        pet["mana"] = 50

        if args.mana_weight > 0.0 or args.equipment_weight > 0.0:
            shaped_scores: List[float] = []
            for team, score in zip(population, scores):
                bonus = _team_quality_bonus(team, args.mana_weight, args.equipment_weight, preferred_equipment)
                shaped_scores.append(max(0.0, min(1.0, float(score) + bonus)))
            scores = shaped_scores

        for team, score in zip(population, scores):
            history.append(Sample(team=team, fitness=float(score)))
            if score > best_score:
                best_score = float(score)
                best_team = deepcopy(team)

        elites, elite_scores = select_top_unique(
            population,
            scores,
            max(2, min(args.elite, len(population))),
        )

        if generation % args.surrogate_train_every == 0:
            train_surrogate(
                model=model,
                samples=history,
                feature_dim=args.feature_dim,
                epochs=max(1, args.surrogate_epochs),
                batch_size=max(8, args.surrogate_batch_size),
                device=device,
            )

        candidate_pool: List[TeamSide] = []
        trial_count = max(args.offspring * 3, args.offspring)
        for _ in range(trial_count):
            parent_a = rng.choice(elites)
            parent_b = rng.choice(elites)
            child = crossover(parent_a, parent_b, rng)
            child = mutate_team(child, pet_pool, equipment_pool, toy_pool, rng)
            if args.force_max_mana:
                for pet in child.get("pets", []):
                    if isinstance(pet, dict):
                        pet["mana"] = 50
            candidate_pool.append(child)

        predictions = predict_scores(model, candidate_pool, args.feature_dim, device)
        candidate_rows = list(zip(candidate_pool, predictions))
        candidate_rows.sort(key=lambda row: row[1], reverse=True)

        selected_offspring = [row[0] for row in candidate_rows[: max(1, args.offspring)]]
        while len(selected_offspring) < args.offspring:
            child = mutate_team(rng.choice(elites), pet_pool, equipment_pool, toy_pool, rng)
            if args.force_max_mana:
                for pet in child.get("pets", []):
                    if isinstance(pet, dict):
                        pet["mana"] = 50
            selected_offspring.append(child)

        next_population = elites + selected_offspring
        population, _ = select_top_unique(
            next_population,
            [1.0] * len(next_population),
            max(2, args.population),
        )

        elapsed = time.time() - start
        generation_reports.append(
            {
                "generation": generation,
                "best": max(scores) if scores else None,
                "mean": (sum(scores) / len(scores)) if scores else None,
                "std": (
                    math.sqrt(
                        sum((score - (sum(scores) / len(scores))) ** 2 for score in scores) / len(scores)
                    )
                    if scores
                    else None
                ),
                "elapsedSeconds": elapsed,
                "eliteScore": elite_scores[0] if elite_scores else None,
                "historySize": len(history),
                "simulationsPerMatchup": generation_sims,
            }
        )

        print(
            f"gen={generation:03d} best={generation_reports[-1]['best']:.4f} "
            f"mean={generation_reports[-1]['mean']:.4f} elapsed={elapsed:.1f}s"
        )

    output_path = os.path.join(workspace, args.output)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    report = {
        "createdAt": int(time.time() * 1000),
        "settings": {
            "generations": args.generations,
            "population": args.population,
            "offspring": args.offspring,
            "elite": args.elite,
            "opponents": args.opponents,
            "simulations": args.simulations,
            "batchSize": args.batch_size,
            "seed": args.seed,
            "variancePenalty": args.variance_penalty,
            "featureDim": args.feature_dim,
            "surrogateEpochs": args.surrogate_epochs,
            "focusPresets": args.focus_presets,
            "focusShare": args.focus_share,
            "seedSource": args.seed_source,
            "focusAnchorOnly": bool(args.focus_anchor_only),
            "warmStartTeam": args.warm_start_team,
            "warmStartExport": args.warm_start_export,
            "warmStartExportSide": args.warm_start_export_side,
            "opponentSource": args.opponent_source,
            "prototype": bool(args.prototype),
            "simulationsMin": args.simulations_min,
            "surrogateTrainEvery": args.surrogate_train_every,
            "forceMaxMana": bool(args.force_max_mana),
            "manaWeight": args.mana_weight,
            "equipmentWeight": args.equipment_weight,
            "preferredEquipment": preferred_equipment,
        },
        "bestFitness": best_score,
        "bestTeam": best_team,
        "generationReports": generation_reports,
        "historySize": len(history),
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

    print(f"Saved report to {output_path}")


if __name__ == "__main__":
    main()
