#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __knownSymbol = (name, symbol) => (symbol = Symbol[name]) ? symbol : /* @__PURE__ */ Symbol.for("Symbol." + name);
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __decoratorStart = (base) => [, , , __create(base?.[__knownSymbol("metadata")] ?? null)];
var __decoratorStrings = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"];
var __expectFn = (fn) => fn !== void 0 && typeof fn !== "function" ? __typeError("Function expected") : fn;
var __decoratorContext = (kind, name, done, metadata, fns) => ({ kind: __decoratorStrings[kind], name, metadata, addInitializer: (fn) => done._ ? __typeError("Already initialized") : fns.push(__expectFn(fn || null)) });
var __decoratorMetadata = (array, target) => __defNormalProp(target, __knownSymbol("metadata"), array[3]);
var __runInitializers = (array, flags, self, value) => {
  for (var i = 0, fns = array[flags >> 1], n = fns && fns.length; i < n; i++) flags & 1 ? fns[i].call(self) : value = fns[i].call(self, value);
  return value;
};
var __decorateElement = (array, flags, name, decorators, target, extra) => {
  var fn, it, done, ctx, access, k = flags & 7, s = !!(flags & 8), p = !!(flags & 16);
  var j = k > 3 ? array.length + 1 : k ? s ? 1 : 2 : 0, key = __decoratorStrings[k + 5];
  var initializers = k > 3 && (array[j - 1] = []), extraInitializers = array[j] || (array[j] = []);
  var desc = k && (!p && !s && (target = target.prototype), k < 5 && (k > 3 || !p) && __getOwnPropDesc(k < 4 ? target : { get [name]() {
    return __privateGet(this, extra);
  }, set [name](x) {
    return __privateSet(this, extra, x);
  } }, name));
  k ? p && k < 4 && __name(extra, (k > 2 ? "set " : k > 1 ? "get " : "") + name) : __name(target, name);
  for (var i = decorators.length - 1; i >= 0; i--) {
    ctx = __decoratorContext(k, name, done = {}, array[3], extraInitializers);
    if (k) {
      ctx.static = s, ctx.private = p, access = ctx.access = { has: p ? (x) => __privateIn(target, x) : (x) => name in x };
      if (k ^ 3) access.get = p ? (x) => (k ^ 1 ? __privateGet : __privateMethod)(x, target, k ^ 4 ? extra : desc.get) : (x) => x[name];
      if (k > 2) access.set = p ? (x, y) => __privateSet(x, target, y, k ^ 4 ? extra : desc.set) : (x, y) => x[name] = y;
    }
    it = (0, decorators[i])(k ? k < 4 ? p ? extra : desc[key] : k > 4 ? void 0 : { get: desc.get, set: desc.set } : target, ctx), done._ = 1;
    if (k ^ 4 || it === void 0) __expectFn(it) && (k > 4 ? initializers.unshift(it) : k ? p ? extra = it : desc[key] = it : target = it);
    else if (typeof it !== "object" || it === null) __typeError("Object expected");
    else __expectFn(fn = it.get) && (desc.get = fn), __expectFn(fn = it.set) && (desc.set = fn), __expectFn(fn = it.init) && initializers.unshift(fn);
  }
  return k || __decoratorMetadata(array, target), desc && __defProp(target, name, desc), p ? k ^ 4 ? extra : desc : target;
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateIn = (member, obj) => Object(obj) !== obj ? __typeError('Cannot use the "in" operator on this value') : member.has(obj);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

// simulation/cli.ts
var import_fs = __toESM(require("fs"));

// src/app/integrations/simulation/battle-engine.ts
var import_sap_battle_engine2 = require("sap-battle-engine");

// simulation/shims.ts
function Injectable(_args) {
  return function(target) {
  };
}

// src/app/runtime/content-catalogs.ts
var import_sap_battle_engine = require("sap-battle-engine");
var pets = structuredClone(import_sap_battle_engine.catalogs.pets);
var toys = structuredClone(import_sap_battle_engine.catalogs.toys);
var food = structuredClone(import_sap_battle_engine.catalogs.food);
var perks = structuredClone(import_sap_battle_engine.catalogs.perks);

// src/app/runtime/asset-catalog.ts
var getNameList = (entries) => entries.map((entry) => entry?.Name).filter((name) => Boolean(name));
var petNameOverrides = {
  "Beluga Whale": "WhiteWhale",
  "Great One": "Cthulu",
  "Small One": "BabyCthulhu",
  Abomination: "Shoggoth",
  Visitor: "Xenomorph",
  Swordfish: "SwordFish",
  Doberman: "DobermanDog",
  "Highland Cow": "HighlandCow",
  "Sabertooth Tiger": "SaberToothTiger",
  "Moby Dick": "MochaDick",
  "Chimera Goat": "ChimeraGoat",
  "Chimera Lion": "ChimeraLion",
  "Chimera Snake": "ChimeraSnake",
  CrackedEgg: "EggLadCracked",
  "Fake Nessie": "FakeNessie",
  "Tand and Tand": "ThorGoats"
};
var perkNameOverrides = {
  Corncob: "Corn",
  "Cake Slice": "BirthdayCakeSlice",
  "Peanut Butter": "PeanutButter",
  "Mana Potion": "ManaPotion",
  "Faint Bread": "DeadBread",
  Kiwifruit: "Kiwi",
  Eggplant: "EggPlant",
  Rice: "RiceBall",
  Donut: "Doughnut",
  Cherry: "Cherries",
  "Melon Slice": "WaterMelon",
  Cold: "Frozen",
  Crisp: "Burn",
  Dazed: "Deaf",
  Icky: "Acid",
  Inked: "Ink",
  Spooked: "Scared",
  Sleepy: "Drowsy",
  Webbed: "Web",
  Cursed: "Curse",
  Silly: "Silly",
  Bloated: "Bloated"
};
var perkNameOverridesLower = Object.fromEntries(
  Object.entries(perkNameOverrides).map(([key, value]) => [
    key.toLowerCase(),
    value
  ])
);
var normalize = (name) => {
  if (!name) {
    return "";
  }
  return name.replace(/[^a-zA-Z0-9]/g, "");
};
var buildNameIdMap = (entries) => {
  const map = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    if (entry?.Name && entry?.NameId) {
      map.set(entry.Name, entry.NameId);
    }
  }
  return map;
};
var formatAbilityText = (abilities, perkNote) => {
  const isNoAbilityText = (text) => !text || /^no ability\.?$/i.test(text.trim());
  const lines = [];
  if (Array.isArray(abilities)) {
    for (const ability of abilities) {
      if (!ability?.About || isNoAbilityText(ability.About)) {
        continue;
      }
      if (ability.Level != null) {
        lines.push(`Lv${ability.Level}: ${ability.About}`);
      } else {
        lines.push(ability.About);
      }
    }
  }
  if (perkNote) {
    lines.push(perkNote);
  }
  return lines.length ? lines.join("\n") : null;
};
var petNameIds = buildNameIdMap(
  pets.default ?? pets ?? []
);
var petIdByName = /* @__PURE__ */ new Map();
var petIdEntries = pets.default ?? pets ?? [];
for (const entry of petIdEntries) {
  if (!entry?.Name || !entry?.Id) {
    continue;
  }
  petIdByName.set(entry.Name, entry.Id);
}
var petAbilityMap = /* @__PURE__ */ new Map();
var petAbilityEntries = pets.default ?? pets ?? [];
for (const entry of petAbilityEntries) {
  if (!entry?.Name) {
    continue;
  }
  const abilityText = formatAbilityText(entry.Abilities, entry.PerkNote);
  if (abilityText) {
    petAbilityMap.set(entry.Name, abilityText);
  }
}
var petNames = getNameList(
  pets.default ?? pets ?? []
);
var toyNameIds = buildNameIdMap(
  toys.default ?? toys ?? []
);
var toyAbilityMap = /* @__PURE__ */ new Map();
var toyAbilityEntries = toys.default ?? toys ?? [];
for (const entry of toyAbilityEntries) {
  if (!entry?.Name) {
    continue;
  }
  const abilityText = formatAbilityText(entry.Abilities);
  if (abilityText) {
    toyAbilityMap.set(entry.Name, abilityText);
  }
}
var toyNames = getNameList(
  toys.default ?? toys ?? []
);
var equipmentNameIds = buildNameIdMap(
  perks.default ?? perks ?? []
);
var equipmentNameIdsLower = new Map(
  Array.from(equipmentNameIds.entries()).map(([key, value]) => [
    key.toLowerCase(),
    value
  ])
);
var equipmentNameIdsNormalized = new Map(
  Array.from(equipmentNameIds.entries()).map(([key, value]) => [
    normalize(key),
    value
  ])
);
var equipmentAbilityMap = /* @__PURE__ */ new Map();
var equipmentAbilityEntries = perks.default ?? perks ?? [];
for (const entry of equipmentAbilityEntries) {
  if (!entry?.Name) {
    continue;
  }
  if (entry.Ability) {
    equipmentAbilityMap.set(entry.Name, entry.Ability);
  }
}
var equipmentNames = getNameList(
  perks.default ?? perks ?? []
);
function getPetIconFileName(petName) {
  if (!petName) {
    return null;
  }
  const nameId = petNameIds.get(petName);
  if (nameId) {
    return nameId;
  }
  const mapped = petNameOverrides[petName];
  if (mapped) {
    return mapped;
  }
  return null;
}
function getPetIconPath(petName) {
  const fileName = getPetIconFileName(petName);
  if (!fileName) {
    return null;
  }
  return `assets/art/Public/Public/Pets/${fileName}.png`;
}
function getAllPetNames() {
  return [...petNames];
}
function getToyIconPath(toyName) {
  if (!toyName) {
    return null;
  }
  const nameId = toyNameIds.get(toyName);
  const fileName = nameId ?? normalize(toyName);
  if (!fileName) {
    return null;
  }
  return `assets/art/Public/Public/Toys/${fileName}.png`;
}
function getAllToyNames() {
  return [...toyNames];
}
var getEquipmentFileName = (equipmentName) => {
  if (!equipmentName) {
    return null;
  }
  const normalized = normalize(equipmentName);
  const nameId = equipmentNameIds.get(equipmentName) ?? equipmentNameIdsLower.get(equipmentName.toLowerCase()) ?? equipmentNameIdsNormalized.get(normalized);
  const override = perkNameOverrides[equipmentName] ?? perkNameOverridesLower[equipmentName.toLowerCase()];
  const fileName = nameId ?? override ?? normalized;
  return fileName || null;
};
function getEquipmentIconPath(equipmentName, isAilment = false) {
  const fileName = getEquipmentFileName(equipmentName);
  if (!fileName) {
    return null;
  }
  if (isAilment) {
    return `assets/art/Ailments/Ailments/${fileName}.png`;
  }
  return `assets/art/Public/Public/Food/${fileName}.png`;
}
function getAllEquipmentNames() {
  return [...equipmentNames];
}

// src/app/integrations/equipment/equipment-categories.ts
var AILMENT_CATEGORIES = {
  Ailments: [
    "Bloated",
    "Cold",
    "Confused",
    "Cowardly",
    "Crisp",
    "Cursed",
    "Dazed",
    "Icky",
    "Inked",
    "Sad",
    "Silly",
    "Sleepy",
    "Spooked",
    "Tasty",
    "Toasty",
    "Weak",
    "Webbed"
  ]
};

// src/app/integrations/log/log-inline-icons.ts
function buildNameRegex(names) {
  const escaped = names.filter((name) => Boolean(name)).sort((a, b) => b.length - a.length).map((name) => escapeRegExp(name));
  if (!escaped.length) {
    return null;
  }
  return new RegExp(
    `(?<![A-Za-z0-9])(${escaped.join("|")})(?![A-Za-z0-9])`,
    "g"
  );
}
function buildInlineNameTypeMap(petNames2, toyNames2, equipmentNames2) {
  const map = /* @__PURE__ */ new Map();
  for (const name of equipmentNames2) {
    if (name) {
      map.set(name, "equipment");
    }
  }
  for (const name of toyNames2) {
    if (name) {
      map.set(name, "toy");
    }
  }
  for (const name of petNames2) {
    if (name) {
      map.set(name, "pet");
    }
  }
  return map;
}
function buildInlineNameRegex(petNames2, toyNames2, equipmentNames2) {
  const combined = /* @__PURE__ */ new Set();
  petNames2.forEach((name) => name && combined.add(name));
  toyNames2.forEach((name) => name && combined.add(name));
  equipmentNames2.forEach((name) => name && combined.add(name));
  return buildNameRegex(Array.from(combined));
}
function decorateInlineIcons(message, inlineNameRegex, inlineNameTypeMap, ailmentNames) {
  if (!message || message.includes("<img") || !inlineNameRegex) {
    return message;
  }
  let updated = replaceMatchesWithIconsOutsideTags(
    message,
    inlineNameRegex,
    (name) => getInlineIconPath(name, inlineNameTypeMap, ailmentNames),
    (name) => getInlineIconHtml(name, inlineNameTypeMap, ailmentNames)
  );
  const manaIcon = "assets/art/Public/Public/Icons/TextMap-resources.assets-31-split/mana.png";
  const manaRegex = /(?<![A-Za-z0-9])mana(?![A-Za-z0-9])(?!\s+Potion)/gi;
  updated = replaceMatchesWithIconsOutsideTags(updated, manaRegex, () => manaIcon);
  const expIcon = "assets/art/Public/Public/Icons/TextMap-resources.assets-31-split/xp.png";
  const expRegex = /(?<![A-Za-z0-9])(?:xp|exp)(?![A-Za-z0-9])/gi;
  updated = replaceMatchesWithIconsOutsideTags(updated, expRegex, () => expIcon);
  const goldIcon = "assets/art/Public/Public/Icons/TextMap-resources.assets-31-split/gold.png";
  const goldRegex = /(?<![A-Za-z0-9])gold(?![A-Za-z0-9])/gi;
  updated = replaceMatchesWithIconsOutsideTags(updated, goldRegex, () => goldIcon);
  const trumpetIcon = "assets/art/Public/Public/Icons/TextMap-resources.assets-31-split/trumpet.png";
  const trumpetRegex = /(?<![A-Za-z0-9])trumpets?(?![A-Za-z0-9])/gi;
  updated = replaceMatchesWithIconsOutsideTags(
    updated,
    trumpetRegex,
    () => trumpetIcon
  );
  return updated;
}
function getInlineIconPath(name, inlineNameTypeMap, ailmentNames) {
  const type = inlineNameTypeMap.get(name) ?? null;
  if (type === "pet") {
    return getPetIconPath(name);
  }
  if (type === "toy") {
    return getToyIconPath(name);
  }
  if (type === "equipment") {
    const isAilment = ailmentNames.has(name);
    return getEquipmentIconPath(name, isAilment) ?? getEquipmentIconPath(name, !isAilment);
  }
  return null;
}
function getInlineIconHtml(name, inlineNameTypeMap, ailmentNames) {
  const type = inlineNameTypeMap.get(name) ?? null;
  if (type !== "equipment") {
    return null;
  }
  const isAilment = ailmentNames.has(name);
  const primary = getEquipmentIconPath(name, isAilment);
  if (!primary) {
    return null;
  }
  const secondary = getEquipmentIconPath(name, !isAilment);
  const secondaryAttr = secondary ? `this.dataset.step='1';this.src='${secondary}';` : `this.dataset.step='1';`;
  return `<img src="${primary}" class="log-inline-icon" alt="${name}" onerror="if(!this.dataset.step){${secondaryAttr}return;}this.remove();"> ${name}`;
}
function replaceMatchesWithIconsOutsideTags(message, regex, getIcon, getHtml) {
  return message.split(/(<[^>]+>)/g).map(
    (segment) => segment.startsWith("<") ? segment : replaceMatchesWithIcons(segment, regex, getIcon, getHtml)
  ).join("");
}
function replaceMatchesWithIcons(message, regex, getIcon, getHtml) {
  if (!regex) {
    return message;
  }
  return message.replace(regex, (match) => {
    const icon = getIcon(match);
    if (getHtml) {
      const html = getHtml(match, icon);
      if (html) {
        return html;
      }
    }
    if (!icon) {
      return match;
    }
    return `<img src="${icon}" class="log-inline-icon" alt="${match}" onerror="this.remove()"> ${match}`;
  });
}
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// src/app/integrations/log/log-merge-utils.ts
function getMergedAttackHealthMessage(lastLog, nextLog) {
  if (!lastLog || !nextLog) {
    return null;
  }
  if (lastLog.noCollapse || nextLog.noCollapse) {
    return null;
  }
  if (lastLog.player !== nextLog.player) {
    return null;
  }
  if (lastLog.type !== nextLog.type) {
    return null;
  }
  if (lastLog.randomEvent !== nextLog.randomEvent) {
    return null;
  }
  if (lastLog.randomEventReason !== nextLog.randomEventReason) {
    return null;
  }
  if (lastLog.sourcePet !== nextLog.sourcePet || lastLog.sourceIndex !== nextLog.sourceIndex) {
    return null;
  }
  if (lastLog.targetPet !== nextLog.targetPet || lastLog.targetIndex !== nextLog.targetIndex) {
    return null;
  }
  if (lastLog.tiger !== nextLog.tiger) {
    return null;
  }
  if (lastLog.puma !== nextLog.puma) {
    return null;
  }
  if (lastLog.pteranodon !== nextLog.pteranodon) {
    return null;
  }
  const lastPanther = lastLog.pantherMultiplier ?? null;
  const nextPanther = nextLog.pantherMultiplier ?? null;
  if (lastPanther !== nextPanther) {
    return null;
  }
  const lastText = stripTags(lastLog.rawMessage ?? lastLog.message ?? "");
  const nextText = stripTags(nextLog.rawMessage ?? nextLog.message ?? "");
  if (!lastText || !nextText) {
    return null;
  }
  if (lastText.includes(" attack and ") || lastText.includes(" health and ") || nextText.includes(" attack and ") || nextText.includes(" health and ")) {
    return null;
  }
  return combineAttackHealthLogs(lastText, nextText) ?? combineAttackHealthLogs(nextText, lastText);
}
function combineAttackHealthLogs(attackLog, healthLog) {
  const lossAttack = parseStatLog(attackLog, "lost", "attack");
  const lossHealth = parseStatLog(healthLog, "lost", "health");
  if (lossAttack && lossHealth) {
    if (lossAttack.prefix === lossHealth.prefix && lossAttack.suffix === lossHealth.suffix) {
      return `${lossAttack.prefix}${lossAttack.value} attack and ${lossHealth.value} health${lossAttack.suffix}`;
    }
  }
  const gainAttack = parseStatLog(attackLog, "gave", "attack");
  const gainHealth = parseStatLog(healthLog, "gave", "health");
  if (gainAttack && gainHealth) {
    if (gainAttack.prefix === gainHealth.prefix && gainAttack.suffix === gainHealth.suffix) {
      return `${gainAttack.prefix}${gainAttack.plus}${gainAttack.value} attack and ${gainHealth.plus}${gainHealth.value} health${gainAttack.suffix}`;
    }
  }
  return null;
}
function parseStatLog(message, verb, stat) {
  if (verb === "lost") {
    const regex2 = new RegExp(`^(.*\\blost\\s+)(\\d+)\\s+${stat}\\b(.*)$`, "i");
    const match2 = message.match(regex2);
    if (!match2) {
      return null;
    }
    return {
      prefix: match2[1],
      plus: "",
      value: match2[2],
      suffix: match2[3]
    };
  }
  const regex = new RegExp(
    `^(.*\\b(?:gave|give|gives)\\b.*?\\s+)(\\+?)(\\d+)\\s+${stat}\\b(.*)$`,
    "i"
  );
  const match = message.match(regex);
  if (!match) {
    return null;
  }
  return {
    prefix: match[1],
    plus: match[2] ?? "",
    value: match[3],
    suffix: match[4]
  };
}
function stripTags(message) {
  return message.replace(/<[^>]+>/g, "").trim();
}

// src/app/integrations/log/log-board-render.ts
function buildBoardStateMessage(player, opponent, getFrontIndex, isAilmentName) {
  let playerState = "";
  if (player.toy) {
    playerState += `{{toy:${player.toy.name}}} `;
  }
  if (player.hardToy) {
    playerState += `{{hardtoy:${player.hardToy.name}}} `;
  }
  playerState += renderPetText(player.pet4, getFrontIndex, isAilmentName);
  playerState += renderPetText(player.pet3, getFrontIndex, isAilmentName);
  playerState += renderPetText(player.pet2, getFrontIndex, isAilmentName);
  playerState += renderPetText(player.pet1, getFrontIndex, isAilmentName);
  playerState += renderPetText(player.pet0, getFrontIndex, isAilmentName);
  let opponentState = "";
  opponentState += renderPetText(opponent.pet0, getFrontIndex, isAilmentName);
  opponentState += renderPetText(opponent.pet1, getFrontIndex, isAilmentName);
  opponentState += renderPetText(opponent.pet2, getFrontIndex, isAilmentName);
  opponentState += renderPetText(opponent.pet3, getFrontIndex, isAilmentName);
  opponentState += renderPetText(opponent.pet4, getFrontIndex, isAilmentName);
  if (opponent.toy) {
    opponentState += `{{toy:${opponent.toy.name}}} `;
  }
  if (opponent.hardToy) {
    opponentState += `{{hardtoy:${opponent.hardToy.name}}} `;
  }
  return `${playerState}| ${opponentState}`;
}
function renderPetText(pet, getFrontIndex, isAilmentName) {
  if (pet == null) {
    return "___ (-/-) ";
  }
  const index = getFrontIndex(pet);
  const label = index != null ? `${pet.parent?.isOpponent ? "O" : "P"}${index} ` : "";
  const iconPath = getPetIconPath(pet.name);
  const petDisplay = iconPath ? `<img src="${iconPath}" class="log-pet-icon" alt="${pet.name}">` : "";
  const equipmentName = typeof pet.equipment?.name === "string" ? pet.equipment.name : null;
  const equipmentDisplay = equipmentName ? (() => {
    const isAilment = isAilmentName(equipmentName);
    const primary = getEquipmentIconPath(equipmentName, isAilment) ?? getEquipmentIconPath(equipmentName, !isAilment);
    if (!primary) {
      return "";
    }
    const secondary = getEquipmentIconPath(equipmentName, !isAilment);
    const secondaryAttr = secondary ? `this.dataset.step='1';this.src='${secondary}';` : `this.dataset.step='1';`;
    return `<img src="${primary}" class="log-inline-icon" alt="${equipmentName}" onerror="if(!this.dataset.step){${secondaryAttr}return;}this.remove()">`;
  })() : "";
  const manaValue = Number.isFinite(pet.mana) ? Math.max(0, Math.trunc(pet.mana)) : 0;
  const manaSuffix = manaValue > 0 ? `/${manaValue}mana` : "";
  return `${label}${petDisplay}${equipmentDisplay}(${pet.attack}/${pet.health}/${pet.exp}xp${manaSuffix}) `;
}

// src/app/integrations/log.service.ts
var _LogService_decorators, _init;
_LogService_decorators = [Injectable({
  providedIn: "root"
})];
var LogService = class {
  constructor() {
    this.logs = [];
    this.petNameRegex = void 0;
    this.toyNameRegex = void 0;
    this.equipmentNameRegex = void 0;
    this.inlineNameRegex = void 0;
    this.inlineNameTypeMap = void 0;
    this.ailmentNames = void 0;
    this.enabled = true;
    this.deferDecorations = false;
    this.showTriggerNamesInLogs = false;
    this.debugSummonBoardStateLogs = false;
    const petNames2 = getAllPetNames();
    const toyNames2 = getAllToyNames();
    const equipmentNames2 = getAllEquipmentNames();
    this.petNameRegex = buildNameRegex(petNames2);
    this.toyNameRegex = buildNameRegex(toyNames2);
    this.equipmentNameRegex = buildNameRegex(equipmentNames2);
    this.inlineNameTypeMap = buildInlineNameTypeMap(
      petNames2,
      toyNames2,
      equipmentNames2
    );
    this.inlineNameRegex = buildInlineNameRegex(
      petNames2,
      toyNames2,
      equipmentNames2
    );
    this.ailmentNames = new Set(
      Object.values(AILMENT_CATEGORIES).flat().filter(Boolean)
    );
  }
  setEnabled(enabled) {
    this.enabled = Boolean(enabled);
    if (!this.enabled) {
      this.logs = [];
    }
  }
  isEnabled() {
    return this.enabled;
  }
  setDeferDecorations(enabled) {
    this.deferDecorations = Boolean(enabled);
  }
  isDeferDecorations() {
    return this.deferDecorations;
  }
  setShowTriggerNamesInLogs(enabled) {
    this.showTriggerNamesInLogs = Boolean(enabled);
  }
  isShowTriggerNamesInLogs() {
    return this.showTriggerNamesInLogs;
  }
  setDebugSummonBoardStateLogs(enabled) {
    this.debugSummonBoardStateLogs = Boolean(enabled);
  }
  isDebugSummonBoardStateLogs() {
    return this.debugSummonBoardStateLogs;
  }
  decorateLogIfNeeded(log) {
    if (!log || log.decorated || !log.rawMessage) {
      return;
    }
    const message = this.decorateMessageWithNames(
      log.rawMessage,
      log.sourcePet,
      log.targetPet,
      log.sourceIndex,
      log.targetIndex
    );
    log.message = decorateInlineIcons(
      message,
      this.inlineNameRegex,
      this.inlineNameTypeMap,
      this.ailmentNames
    );
    log.decorated = true;
  }
  createLog(log) {
    if (!this.enabled) {
      return;
    }
    if (log.message?.startsWith("Phase ")) {
      log.bold = true;
    }
    this.resolveLogMetadata(log);
    let message = this.decorateLogMessage(log);
    message = this.appendTagSuffixes(message, log);
    this.persistDecoratedMessage(log, message);
    const lastLog = this.logs[this.logs.length - 1];
    const shouldAppendSummonBoard = this.shouldAppendSummonBoardState(log);
    if (this.tryMergeAttackHealthLogs(lastLog, log)) {
      if (shouldAppendSummonBoard) {
        this.appendSummonBoardStateLog(log);
      }
      return;
    }
    if (this.shouldCollapseLog(lastLog, log)) {
      lastLog.count = (lastLog.count ?? 1) + 1;
    } else {
      this.logs.push(log);
    }
    if (shouldAppendSummonBoard) {
      this.appendSummonBoardStateLog(log);
    }
  }
  resolveLogMetadata(log) {
    if (!log.sourcePet && log.player && log.message) {
      const possiblePets = log.player.petArray.filter(
        (p) => p && log.message.startsWith(p.name)
      );
      if (possiblePets.length === 1) {
        log.sourcePet = possiblePets[0];
      }
    }
    if (log.type === "attack" && log.player && log.message) {
      this.resolveAttackPetsFromMessage(log);
    }
    if (!log.randomEventReason && log.randomEvent === true) {
      log.randomEventReason = "true-random";
    }
    if (log.player && log.message) {
      this.resolveSourceTargetFromMessage(log);
    }
    if (log.sourcePet && log.sourceIndex == null) {
      log.sourceIndex = this.getFrontIndex(log.sourcePet) ?? void 0;
    }
    if (log.targetPet && log.targetIndex == null) {
      log.targetIndex = this.getFrontIndex(log.targetPet) ?? void 0;
    }
  }
  decorateLogMessage(log) {
    const message = log.message ?? "";
    if (this.deferDecorations) {
      return message;
    }
    return this.decorateMessageWithNames(
      message,
      log.sourcePet,
      log.targetPet,
      log.sourceIndex,
      log.targetIndex
    );
  }
  appendTagSuffixes(message, log) {
    let updated = message;
    if (log.tiger) {
      updated += " (Tiger)";
    }
    if (log.puma) {
      updated += " (Puma)";
    }
    if (log.pteranodon) {
      updated += " (Pteranodon)";
    }
    if (log.pantherMultiplier != null && log.pantherMultiplier > 1) {
      updated += ` x${log.pantherMultiplier} (Panther)`;
    }
    return updated;
  }
  persistDecoratedMessage(log, message) {
    if (!message) {
      return;
    }
    if (this.deferDecorations) {
      log.rawMessage = message;
      log.message = message;
      log.decorated = false;
      return;
    }
    log.message = decorateInlineIcons(
      message,
      this.inlineNameRegex,
      this.inlineNameTypeMap,
      this.ailmentNames
    );
    log.decorated = true;
  }
  shouldCollapseLog(lastLog, log) {
    if (!lastLog) {
      return false;
    }
    if (lastLog.noCollapse || log.noCollapse) {
      return false;
    }
    const samePlayer = lastLog.player === log.player;
    const sameMessage = lastLog.message?.trim() === log.message?.trim();
    const sameRandom = lastLog.randomEvent === log.randomEvent;
    const sameRandomReason = lastLog.randomEventReason === log.randomEventReason;
    const sameSource = lastLog.sourcePet === log.sourcePet && lastLog.sourceIndex === log.sourceIndex;
    const sameTarget = lastLog.targetPet === log.targetPet && lastLog.targetIndex === log.targetIndex;
    const hasSourceOrTarget = log.sourcePet != null || log.targetPet != null || log.sourceIndex != null || log.targetIndex != null;
    return sameMessage && samePlayer && sameRandom && sameRandomReason && (!hasSourceOrTarget || sameSource && sameTarget);
  }
  getLogs() {
    return this.logs;
  }
  reset() {
    this.logs = [];
  }
  getFrontIndex(pet) {
    const parent = pet?.parent;
    if (!parent) {
      return null;
    }
    if (parent.pet0 === pet) {
      return 1;
    }
    if (parent.pet1 === pet) {
      return 2;
    }
    if (parent.pet2 === pet) {
      return 3;
    }
    if (parent.pet3 === pet) {
      return 4;
    }
    if (parent.pet4 === pet) {
      return 5;
    }
    if (Number.isFinite(pet.savedPosition)) {
      return pet.savedPosition + 1;
    }
    return null;
  }
  decorateMessage(message, pet) {
    const index = this.getFrontIndex(pet);
    if (index == null) {
      return message;
    }
    const label = pet.parent?.isOpponent ? "O" : "P";
    const fullLabel = `${label}${index} ${pet.name}`;
    return this.replaceFirst(message, pet.name, fullLabel);
  }
  decorateAttackMessage(message, sourcePet, targetPet, sourceIndexOverride, targetIndexOverride) {
    const sourceIndex = sourceIndexOverride ?? this.getFrontIndex(sourcePet);
    const targetIndex = targetIndexOverride ?? this.getFrontIndex(targetPet);
    if (sourceIndex == null || targetIndex == null) {
      return message;
    }
    const sourceLabel = sourcePet.parent?.isOpponent ? "O" : "P";
    const targetLabel = targetPet.parent?.isOpponent ? "O" : "P";
    const sourceFullLabel = `${sourceLabel}${sourceIndex} ${sourcePet.name}`;
    const targetFullLabel = `${targetLabel}${targetIndex} ${targetPet.name}`;
    const SOURCE_HOLDER = "___SOURCE_HOLDER___";
    const TARGET_HOLDER = "___TARGET_HOLDER___";
    let updated = this.replaceFirst(message, sourcePet.name, SOURCE_HOLDER);
    updated = this.replaceFirst(updated, targetPet.name, TARGET_HOLDER);
    updated = updated.replace(SOURCE_HOLDER, sourceFullLabel);
    updated = updated.replace(TARGET_HOLDER, targetFullLabel);
    return updated;
  }
  decorateMessageWithNames(message, sourcePet, targetPet, sourceIndex, targetIndex) {
    if (!message) {
      return message;
    }
    if (sourcePet && targetPet) {
      return this.decorateAttackMessage(
        message,
        sourcePet,
        targetPet,
        sourceIndex,
        targetIndex
      );
    }
    if (sourcePet) {
      if (sourceIndex != null) {
        const label = sourcePet.parent?.isOpponent ? "O" : "P";
        const fullLabel = `${label}${sourceIndex} ${sourcePet.name}`;
        return this.replaceFirst(message, sourcePet.name, fullLabel);
      }
      return this.decorateMessage(message, sourcePet);
    }
    return message;
  }
  replaceFirst(source, search, replacement) {
    const index = source.indexOf(search);
    if (index === -1) {
      return source;
    }
    return source.slice(0, index) + replacement + source.slice(index + search.length);
  }
  resolveAttackPetsFromMessage(log) {
    if (!log?.message || !log.player) {
      return;
    }
    if (log.sourcePet && log.targetPet) {
      return;
    }
    const message = log.message;
    const snipedMatch = /^(.+?)\s+sniped\s+(.+?)\s+for\s+/i.exec(message);
    const attackMatch = /^(.+?)\s+(?:jump-)?attacks?\s+(.+?)\s+for\s+/i.exec(message);
    const match = snipedMatch ?? attackMatch;
    if (!match) {
      return;
    }
    const sourceName = match[1].trim();
    const targetName = match[2].trim();
    const playerPets = log.player.petArray ?? [];
    const opponentPets = log.player.opponent?.petArray ?? [];
    if (!log.sourcePet) {
      log.sourcePet = playerPets.find((pet) => pet?.name === sourceName) ?? null;
    }
    if (!log.targetPet) {
      log.targetPet = opponentPets.find((pet) => pet?.name === targetName) ?? playerPets.find((pet) => pet?.name === targetName) ?? null;
    }
  }
  isAilmentName(name) {
    return this.ailmentNames.has(name);
  }
  resolveSourceTargetFromMessage(log) {
    if (log.sourcePet && log.targetPet) {
      return;
    }
    const message = log.message;
    if (!message) {
      return;
    }
    const names = this.extractPetNames(message);
    if (names.length < 2) {
      return;
    }
    const playerPets = log.player?.petArray ?? [];
    const opponentPets = log.player?.opponent?.petArray ?? [];
    const findPet = (pets2, name, exclude) => pets2.find((pet) => pet?.name === name && pet !== exclude) ?? null;
    if (!log.sourcePet) {
      log.sourcePet = findPet(playerPets, names[0]) ?? findPet(opponentPets, names[0]);
    }
    if (!log.targetPet) {
      if (names[1] === names[0]) {
        const messageStartsWithSource = log.sourcePet && message.startsWith(log.sourcePet.name);
        if (messageStartsWithSource && log.sourcePet) {
          log.targetPet = log.sourcePet;
        } else {
          log.targetPet = findPet(playerPets, names[1], log.sourcePet) ?? findPet(opponentPets, names[1], log.sourcePet) ?? log.sourcePet ?? null;
        }
      } else {
        log.targetPet = findPet(opponentPets, names[1]) ?? findPet(playerPets, names[1]);
      }
    }
  }
  extractPetNames(message) {
    if (!this.petNameRegex || !message) {
      return [];
    }
    const matches = message.match(this.petNameRegex);
    return matches ?? [];
  }
  tryMergeAttackHealthLogs(lastLog, nextLog) {
    const combined = getMergedAttackHealthMessage(lastLog, nextLog);
    if (!combined) {
      return false;
    }
    if (this.deferDecorations) {
      lastLog.rawMessage = combined;
      lastLog.message = combined;
      lastLog.decorated = false;
    } else {
      const decorated = this.decorateMessageWithNames(
        combined,
        lastLog.sourcePet,
        lastLog.targetPet,
        lastLog.sourceIndex,
        lastLog.targetIndex
      );
      lastLog.message = decorateInlineIcons(
        decorated,
        this.inlineNameRegex,
        this.inlineNameTypeMap,
        this.ailmentNames
      );
      lastLog.decorated = true;
    }
    return true;
  }
  shouldAppendSummonBoardState(log) {
    if (!this.debugSummonBoardStateLogs) {
      return false;
    }
    if (!log?.message || log.type === "board") {
      return false;
    }
    if (!log.player || !log.player.opponent) {
      return false;
    }
    return /\b(summoned|spawned)\b|^No room to spawn\b/i.test(log.message);
  }
  appendSummonBoardStateLog(log) {
    const player = log.player;
    const opponent = log.player?.opponent;
    if (!player || !opponent) {
      return;
    }
    this.logs.push({
      message: this.buildPlainBoardStateMessage(player, opponent),
      type: "board",
      player
    });
  }
  buildPlainBoardStateMessage(player, opponent) {
    const playerState = [
      player.pet4,
      player.pet3,
      player.pet2,
      player.pet1,
      player.pet0
    ].map((pet) => this.renderPlainPetText(pet)).join(" ");
    const opponentState = [
      opponent.pet0,
      opponent.pet1,
      opponent.pet2,
      opponent.pet3,
      opponent.pet4
    ].map((pet) => this.renderPlainPetText(pet)).join(" ");
    return `${playerState} | ${opponentState}`;
  }
  renderPlainPetText(pet) {
    if (!pet) {
      return "___ (-/-)";
    }
    const index = this.getFrontIndex(pet);
    const label = index != null ? `${pet.parent?.isOpponent ? "O" : "P"}${index}` : "P?";
    return `${label} ${pet.name}(${pet.attack}/${pet.health}/${pet.exp}xp)`;
  }
  printState(player, opponent, message) {
    if (!this.enabled) {
      return;
    }
    if (message) {
      this.createLog({
        message,
        type: "board"
      });
    }
    const boardMessage = buildBoardStateMessage(
      player,
      opponent,
      (pet) => this.getFrontIndex(pet),
      (name) => this.isAilmentName(name)
    );
    this.createLog({
      message: boardMessage,
      type: "board"
    });
  }
};
_init = __decoratorStart(null);
LogService = __decorateElement(_init, 0, "LogService", _LogService_decorators, LogService);
__runInitializers(_init, 1, LogService);

// src/app/integrations/simulation/battle-engine.ts
var ailments = new Set(Object.values(AILMENT_CATEGORIES).flat());

// simulation/simulate.ts
var import_sap_battle_engine3 = require("sap-battle-engine");

// src/app/integrations/replay/replay-calc-schema.ts
var PETS_BY_ID = /* @__PURE__ */ new Map();
var PETS_META_BY_ID = /* @__PURE__ */ new Map();
var PET_IDS_BY_NAME = /* @__PURE__ */ new Map();
function isObjectRecord(value) {
  return value !== null && typeof value === "object";
}
var petsModule = pets;
var petListRaw = petsModule.default ?? pets;
var petList = Array.isArray(petListRaw) ? petListRaw : isObjectRecord(petListRaw) ? Object.values(petListRaw).filter((v) => typeof v === "object" && v !== null && ("Id" in v || "id" in v)) : [];
petList.forEach((petUnknown) => {
  if (!isObjectRecord(petUnknown)) {
    return;
  }
  const pet = petUnknown;
  const petId = String(pet.Id ?? pet.id);
  const tierValue = Number(pet.Tier ?? pet.tier);
  const name = pet.Name ?? pet.name;
  if (name) {
    PETS_BY_ID.set(petId, name);
    const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, "");
    PET_IDS_BY_NAME.set(normalizedName, petId);
  }
  if (Number.isFinite(tierValue) && name) {
    PETS_META_BY_ID.set(petId, { name, tier: tierValue });
  }
});
var perkList = perks.default ?? perks;
var toyList = toys.default ?? toys;
var PERKS_BY_ID = new Map(
  perkList.map((perk) => [String(perk.Id), perk.Name])
);
var TOYS_BY_ID = new Map(
  toyList.map((toy) => [String(toy.Id), toy.Name])
);
var PACK_MAP = {
  0: "Turtle",
  1: "Puppy",
  2: "Star",
  5: "Golden",
  6: "Unicorn",
  7: "Danger"
};
var PARROT_COPY_PET_ABOMINATION_KEY_MAP = (() => {
  const map = {};
  for (let outer = 1; outer <= 3; outer++) {
    const base = `parrotCopyPetAbominationSwallowedPet${outer}`;
    const outerPrefix = `pCPAS${outer}`;
    map[base] = outerPrefix;
    map[`${base}BelugaSwallowedPet`] = `${outerPrefix}B`;
    map[`${base}Level`] = `${outerPrefix}L`;
    map[`${base}TimesHurt`] = `${outerPrefix}T`;
    map[`${base}ParrotCopyPet`] = `${outerPrefix}PCP`;
    map[`${base}ParrotCopyPetBelugaSwallowedPet`] = `${outerPrefix}PCPB`;
    for (let inner = 1; inner <= 3; inner++) {
      const innerBase = `${base}ParrotCopyPetAbominationSwallowedPet${inner}`;
      const innerPrefix = `${outerPrefix}PCPAS${inner}`;
      map[innerBase] = innerPrefix;
      map[`${innerBase}BelugaSwallowedPet`] = `${innerPrefix}B`;
      map[`${innerBase}Level`] = `${innerPrefix}L`;
      map[`${innerBase}TimesHurt`] = `${innerPrefix}T`;
    }
  }
  return map;
})();
var KEY_MAP = {
  playerPack: "pP",
  opponentPack: "oP",
  playerToy: "pT",
  playerToyLevel: "pTL",
  playerHardToy: "pHT",
  playerHardToyLevel: "pHTL",
  opponentToy: "oT",
  opponentToyLevel: "oTL",
  opponentHardToy: "oHT",
  opponentHardToyLevel: "oHTL",
  turn: "t",
  playerGoldSpent: "pGS",
  opponentGoldSpent: "oGS",
  playerRollAmount: "pRA",
  opponentRollAmount: "oRA",
  playerSummonedAmount: "pSA",
  opponentSummonedAmount: "oSA",
  playerLevel3Sold: "pL3",
  opponentLevel3Sold: "oL3",
  playerTransformationAmount: "pTA",
  opponentTransformationAmount: "oTA",
  playerPets: "p",
  opponentPets: "o",
  allPets: "ap",
  logFilter: "lf",
  customPacks: "cp",
  oldStork: "os",
  tokenPets: "tp",
  komodoShuffle: "ks",
  mana: "m",
  seed: "sd",
  triggersConsumed: "tc",
  showAdvanced: "sa",
  showTriggerNamesInLogs: "stn",
  showPositionalArgsInLogs: "spa",
  ailmentEquipment: "ae",
  name: "n",
  attack: "a",
  health: "h",
  exp: "e",
  equipment: "eq",
  belugaSwallowedPet: "bSP",
  abominationSwallowedPet1: "aSP1",
  abominationSwallowedPet2: "aSP2",
  abominationSwallowedPet3: "aSP3",
  abominationSwallowedPet1BelugaSwallowedPet: "aSP1B",
  abominationSwallowedPet2BelugaSwallowedPet: "aSP2B",
  abominationSwallowedPet3BelugaSwallowedPet: "aSP3B",
  abominationSwallowedPet1SarcasticFringeheadSwallowedPet: "aSP1SFS",
  abominationSwallowedPet2SarcasticFringeheadSwallowedPet: "aSP2SFS",
  abominationSwallowedPet3SarcasticFringeheadSwallowedPet: "aSP3SFS",
  abominationSwallowedPet1Level: "aSP1L",
  abominationSwallowedPet2Level: "aSP2L",
  abominationSwallowedPet3Level: "aSP3L",
  abominationSwallowedPet1TimesHurt: "aSP1T",
  abominationSwallowedPet2TimesHurt: "aSP2T",
  abominationSwallowedPet3TimesHurt: "aSP3T",
  parrotCopyPet: "pCP",
  parrotCopyPetBelugaSwallowedPet: "pCPB",
  ...PARROT_COPY_PET_ABOMINATION_KEY_MAP,
  abominationSwallowedPet1ParrotCopyPet: "aSP1PCP",
  abominationSwallowedPet2ParrotCopyPet: "aSP2PCP",
  abominationSwallowedPet3ParrotCopyPet: "aSP3PCP",
  abominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet: "aSP1PCPB",
  abominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet: "aSP2PCPB",
  abominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet: "aSP3PCPB",
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1: "aSP1PCPAS1",
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2: "aSP1PCPAS2",
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3: "aSP1PCPAS3",
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1: "aSP2PCPAS1",
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2: "aSP2PCPAS2",
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3: "aSP2PCPAS3",
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1: "aSP3PCPAS1",
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2: "aSP3PCPAS2",
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3: "aSP3PCPAS3",
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet: "aSP1PCPAS1B",
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet: "aSP1PCPAS2B",
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet: "aSP1PCPAS3B",
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet: "aSP2PCPAS1B",
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet: "aSP2PCPAS2B",
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet: "aSP2PCPAS3B",
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet: "aSP3PCPAS1B",
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet: "aSP3PCPAS2B",
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet: "aSP3PCPAS3B",
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level: "aSP1PCPAS1L",
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level: "aSP1PCPAS2L",
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level: "aSP1PCPAS3L",
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level: "aSP2PCPAS1L",
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level: "aSP2PCPAS2L",
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level: "aSP2PCPAS3L",
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level: "aSP3PCPAS1L",
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level: "aSP3PCPAS2L",
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level: "aSP3PCPAS3L",
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt: "aSP1PCPAS1T",
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt: "aSP1PCPAS2T",
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt: "aSP1PCPAS3T",
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt: "aSP2PCPAS1T",
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt: "aSP2PCPAS2T",
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt: "aSP2PCPAS3T",
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt: "aSP3PCPAS1T",
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt: "aSP3PCPAS2T",
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt: "aSP3PCPAS3T",
  timesHurt: "tH",
  ailmentsCount: "aC",
  friendsHurtBeforeBattle: "fHBB"
};

// src/app/integrations/replay/replay-calc-parser-utils.ts
var REPLAY_DEBUG_ENABLED = (() => {
  try {
    const fromStorage = localStorage.getItem("sapReplayDebug");
    if (fromStorage === "1") {
      return true;
    }
  } catch {
    return false;
  }
  try {
    return new URL(window.location.href).searchParams.get("sapReplayDebug") === "1";
  } catch {
    return false;
  }
})();

// src/app/integrations/replay/replay-calc-parser.ts
var replayFoodEntries = food.default ?? food;
var REPLAY_PERK_FOOD_NAMES_BY_SPELL_ID = new Map(
  replayFoodEntries.filter(
    (entry) => entry?.Id !== null && entry?.Id !== void 0 && typeof entry?.Name === "string" && /^Give one pet the .+ perk\.$/i.test(entry?.Ability ?? "")
  ).map((entry) => [String(entry.Id), entry.Name])
);
function buildPackIdByNameLookup() {
  const lookup = /* @__PURE__ */ new Map();
  Object.entries(PACK_MAP).forEach(([packIdRaw, packName]) => {
    if (typeof packName !== "string") {
      return;
    }
    const packId = Number(packIdRaw);
    if (!Number.isFinite(packId)) {
      return;
    }
    lookup.set(packName.toLowerCase(), packId);
  });
  return lookup;
}
var PACK_ID_BY_NAME = buildPackIdByNameLookup();

// simulation/simulate.ts
var import_sap_battle_engine4 = require("sap-battle-engine");

// src/app/integrations/team-presets.defaults.ts
function getDefaultTeams() {
  return [
    {
      id: "default-max-damage",
      name: "1000 Mana",
      createdAt: Date.now(),
      toyName: "Nutcracker",
      toyLevel: 3,
      pets: Array.from({ length: 5 }, () => ({
        name: "Sea Serpent",
        attack: 50,
        health: 50,
        exp: 5,
        equipment: { name: "Coconut" },
        belugaSwallowedPet: null,
        sarcasticFringeheadSwallowedPet: null,
        mana: 50,
        triggersConsumed: 0,
        abominationSwallowedPet1: null,
        abominationSwallowedPet2: null,
        abominationSwallowedPet3: null,
        abominationSwallowedPet1TimesHurt: 0,
        abominationSwallowedPet2TimesHurt: 0,
        abominationSwallowedPet3TimesHurt: 0,
        battlesFought: 0,
        timesHurt: 0,
        equipmentUses: null
      }))
    },
    {
      id: "default-great-six",
      name: "The Great Six",
      createdAt: Date.now(),
      toyName: "Evil Book",
      toyLevel: 3,
      pets: Array.from({ length: 5 }, () => ({
        name: "Beluga Whale",
        attack: 50,
        health: 50,
        exp: 5,
        equipment: { name: "White Okra" },
        belugaSwallowedPet: "Great One",
        sarcasticFringeheadSwallowedPet: null,
        mana: 50,
        triggersConsumed: 0,
        abominationSwallowedPet1: null,
        abominationSwallowedPet2: null,
        abominationSwallowedPet3: null,
        abominationSwallowedPet1TimesHurt: 0,
        abominationSwallowedPet2TimesHurt: 0,
        abominationSwallowedPet3TimesHurt: 0,
        battlesFought: 0,
        timesHurt: 0,
        equipmentUses: null
      }))
    },
    {
      id: "default-ability-removal",
      name: "Orca Scam",
      createdAt: Date.now(),
      playerToyName: "Pandoras Box",
      playerToyLevel: 1,
      opponentToyName: null,
      opponentToyLevel: 1,
      playerHardToy: null,
      playerHardToyLevel: 1,
      opponentHardToy: null,
      opponentHardToyLevel: 1,
      turn: 11,
      playerGoldSpent: 10,
      opponentGoldSpent: 10,
      allPets: true,
      tokenPets: true,
      komodoShuffle: false,
      mana: true,
      plainCopies: false,
      triggersConsumed: false,
      changeEquipmentUses: false,
      playerRollAmount: 3,
      opponentRollAmount: 1,
      playerLevel3Sold: 0,
      opponentLevel3Sold: 0,
      playerSummonedAmount: 0,
      opponentSummonedAmount: 0,
      playerTransformationAmount: 100,
      opponentTransformationAmount: 100,
      pets: [
        {
          name: "Giant Pangasius",
          attack: 49,
          health: 1,
          exp: 1,
          equipment: null,
          belugaSwallowedPet: null,
          sarcasticFringeheadSwallowedPet: null,
          mana: 50,
          triggersConsumed: 0,
          abominationSwallowedPet1: null,
          abominationSwallowedPet2: null,
          abominationSwallowedPet3: null,
          abominationSwallowedPet1Level: 1,
          abominationSwallowedPet2Level: 1,
          abominationSwallowedPet3Level: 1,
          abominationSwallowedPet1TimesHurt: 0,
          abominationSwallowedPet2TimesHurt: 0,
          abominationSwallowedPet3TimesHurt: 0,
          battlesFought: 0,
          timesHurt: 0,
          equipmentUses: null
        },
        {
          name: "Abomination",
          attack: 100,
          health: 1,
          exp: 5,
          equipment: { name: "Churros" },
          belugaSwallowedPet: null,
          sarcasticFringeheadSwallowedPet: null,
          mana: 50,
          triggersConsumed: 0,
          abominationSwallowedPet1: "Orca",
          abominationSwallowedPet2: "Behemoth",
          abominationSwallowedPet3: "Rat",
          abominationSwallowedPet1Level: 3,
          abominationSwallowedPet2Level: 3,
          abominationSwallowedPet3Level: 3,
          abominationSwallowedPet1TimesHurt: 0,
          abominationSwallowedPet2TimesHurt: 0,
          abominationSwallowedPet3TimesHurt: 0,
          battlesFought: 0,
          timesHurt: 0,
          equipmentUses: null
        },
        {
          name: "Abomination",
          attack: 50,
          health: 1,
          exp: 5,
          equipment: { name: "Silly" },
          belugaSwallowedPet: null,
          sarcasticFringeheadSwallowedPet: null,
          mana: 50,
          triggersConsumed: 0,
          abominationSwallowedPet1: "Rat",
          abominationSwallowedPet2: "Phoenix",
          abominationSwallowedPet3: "Giant Pangasius",
          abominationSwallowedPet1Level: 3,
          abominationSwallowedPet2Level: 3,
          abominationSwallowedPet3Level: 1,
          abominationSwallowedPet1TimesHurt: 0,
          abominationSwallowedPet2TimesHurt: 0,
          abominationSwallowedPet3TimesHurt: 0,
          battlesFought: 0,
          timesHurt: 0,
          equipmentUses: null
        },
        {
          name: "Abomination",
          attack: 100,
          health: 1,
          exp: 5,
          equipment: { name: "Churros" },
          belugaSwallowedPet: null,
          sarcasticFringeheadSwallowedPet: null,
          mana: 50,
          triggersConsumed: 0,
          abominationSwallowedPet1: "Behemoth",
          abominationSwallowedPet2: "Rat",
          abominationSwallowedPet3: "Albatross",
          abominationSwallowedPet1Level: 3,
          abominationSwallowedPet2Level: 3,
          abominationSwallowedPet3Level: 3,
          abominationSwallowedPet1TimesHurt: 0,
          abominationSwallowedPet2TimesHurt: 0,
          abominationSwallowedPet3TimesHurt: 0,
          battlesFought: 0,
          timesHurt: 0,
          equipmentUses: null
        },
        {
          name: "Abomination",
          attack: 100,
          health: 100,
          exp: 5,
          equipment: { name: "Cashew Nut" },
          belugaSwallowedPet: null,
          sarcasticFringeheadSwallowedPet: null,
          mana: 50,
          triggersConsumed: 0,
          abominationSwallowedPet1: "Behemoth",
          abominationSwallowedPet2: "Panther",
          abominationSwallowedPet3: "Guineafowl",
          abominationSwallowedPet1Level: 1,
          abominationSwallowedPet2Level: 1,
          abominationSwallowedPet3Level: 1,
          abominationSwallowedPet1TimesHurt: 0,
          abominationSwallowedPet2TimesHurt: 0,
          abominationSwallowedPet3TimesHurt: 0,
          battlesFought: 0,
          timesHurt: 0,
          equipmentUses: null
        }
      ]
    },
    {
      id: "default-sob-snipes",
      name: "SoB Snipes",
      createdAt: Date.now(),
      toyName: "Nutcracker",
      toyLevel: 3,
      pets: Array.from({ length: 5 }, () => ({
        name: "Leopard",
        attack: 50,
        health: 50,
        exp: 5,
        equipment: { name: "Churros" },
        belugaSwallowedPet: null,
        sarcasticFringeheadSwallowedPet: null,
        mana: 50,
        triggersConsumed: 0,
        abominationSwallowedPet1: null,
        abominationSwallowedPet2: null,
        abominationSwallowedPet3: null,
        battlesFought: 0,
        timesHurt: 0,
        equipmentUses: null
      }))
    },
    {
      id: "default-infinite-damage",
      name: "Infinite Damage",
      createdAt: Date.now(),
      toyName: "Nutcracker",
      toyLevel: 1,
      rollAmount: 47,
      transformationAmount: 200,
      pets: [
        {
          name: "Giant Pangasius",
          attack: 50,
          health: 1,
          exp: 5,
          equipment: { name: "Mushroom" },
          belugaSwallowedPet: null,
          sarcasticFringeheadSwallowedPet: null,
          mana: 50,
          triggersConsumed: 0,
          abominationSwallowedPet1: null,
          abominationSwallowedPet2: null,
          abominationSwallowedPet3: null,
          abominationSwallowedPet1TimesHurt: 0,
          abominationSwallowedPet2TimesHurt: 0,
          abominationSwallowedPet3TimesHurt: 0,
          battlesFought: 0,
          timesHurt: 0,
          equipmentUses: null
        },
        {
          name: "Abomination",
          attack: 100,
          health: 100,
          exp: 5,
          equipment: { name: "Churros" },
          belugaSwallowedPet: null,
          sarcasticFringeheadSwallowedPet: null,
          mana: 50,
          triggersConsumed: 0,
          abominationSwallowedPet1: "Behemoth",
          abominationSwallowedPet1Level: 3,
          abominationSwallowedPet2: "Leopard",
          abominationSwallowedPet2Level: 3,
          abominationSwallowedPet3: "Beluga Whale",
          abominationSwallowedPet3Level: 1,
          abominationSwallowedPet3BelugaSwallowedPet: "Giant Pangasius",
          abominationSwallowedPet1TimesHurt: 0,
          abominationSwallowedPet2TimesHurt: 0,
          abominationSwallowedPet3TimesHurt: 0,
          battlesFought: 0,
          timesHurt: 0,
          equipmentUses: null
        },
        {
          name: "Abomination",
          attack: 100,
          health: 100,
          exp: 5,
          equipment: { name: "Cashew Nut" },
          belugaSwallowedPet: null,
          sarcasticFringeheadSwallowedPet: null,
          mana: 50,
          triggersConsumed: 0,
          abominationSwallowedPet1: "Behemoth",
          abominationSwallowedPet1Level: 3,
          abominationSwallowedPet2: "Leopard",
          abominationSwallowedPet2Level: 3,
          abominationSwallowedPet3: "Beluga Whale",
          abominationSwallowedPet3Level: 1,
          abominationSwallowedPet3BelugaSwallowedPet: "Nessie",
          abominationSwallowedPet1TimesHurt: 0,
          abominationSwallowedPet2TimesHurt: 0,
          abominationSwallowedPet3TimesHurt: 0,
          battlesFought: 0,
          timesHurt: 0,
          equipmentUses: null
        },
        {
          name: "Abomination",
          attack: 100,
          health: 100,
          exp: 5,
          equipment: { name: "Churros" },
          belugaSwallowedPet: null,
          sarcasticFringeheadSwallowedPet: null,
          mana: 50,
          triggersConsumed: 0,
          abominationSwallowedPet1: "Behemoth",
          abominationSwallowedPet1Level: 3,
          abominationSwallowedPet2: "Leopard",
          abominationSwallowedPet2Level: 3,
          abominationSwallowedPet3: "Sabertooth Tiger",
          abominationSwallowedPet3Level: 3,
          abominationSwallowedPet1TimesHurt: 0,
          abominationSwallowedPet2TimesHurt: 0,
          abominationSwallowedPet3TimesHurt: 25,
          battlesFought: 0,
          timesHurt: 0,
          equipmentUses: null
        },
        {
          name: "Abomination",
          attack: 100,
          health: 100,
          exp: 5,
          equipment: { name: "Churros" },
          belugaSwallowedPet: null,
          sarcasticFringeheadSwallowedPet: null,
          mana: 50,
          triggersConsumed: 0,
          abominationSwallowedPet1: "Behemoth",
          abominationSwallowedPet1Level: 3,
          abominationSwallowedPet2: "Leopard",
          abominationSwallowedPet2Level: 3,
          abominationSwallowedPet3: "Beluga Whale",
          abominationSwallowedPet3Level: 1,
          abominationSwallowedPet3BelugaSwallowedPet: "Slug",
          abominationSwallowedPet1TimesHurt: 0,
          abominationSwallowedPet2TimesHurt: 0,
          abominationSwallowedPet3TimesHurt: 0,
          battlesFought: 0,
          timesHurt: 0,
          equipmentUses: null
        }
      ]
    },
    {
      id: "default-layers",
      name: "Layers",
      createdAt: Date.now(),
      playerToyName: "Nutcracker",
      playerToyLevel: 3,
      opponentToyName: "Nutcracker",
      opponentToyLevel: 3,
      playerHardToy: null,
      playerHardToyLevel: 1,
      opponentHardToy: null,
      opponentHardToyLevel: 1,
      turn: 13,
      playerGoldSpent: 13,
      opponentGoldSpent: 13,
      allPets: true,
      tokenPets: true,
      komodoShuffle: false,
      mana: true,
      plainCopies: false,
      triggersConsumed: false,
      changeEquipmentUses: false,
      playerRollAmount: 1e3,
      opponentRollAmount: 1e3,
      playerLevel3Sold: 1e3,
      opponentLevel3Sold: 1e3,
      playerSummonedAmount: 1e3,
      opponentSummonedAmount: 1e3,
      playerTransformationAmount: 1e3,
      opponentTransformationAmount: 1e3,
      pets: [
        {
          name: "Giant Pangasius",
          attack: 50,
          health: 1,
          exp: 5,
          equipment: { name: "Mushroom" },
          belugaSwallowedPet: null,
          sarcasticFringeheadSwallowedPet: null,
          mana: 50,
          triggersConsumed: 0,
          abominationSwallowedPet1: null,
          abominationSwallowedPet2: null,
          abominationSwallowedPet3: null,
          abominationSwallowedPet1Level: 1,
          abominationSwallowedPet2Level: 1,
          abominationSwallowedPet3Level: 1,
          abominationSwallowedPet1TimesHurt: 0,
          abominationSwallowedPet2TimesHurt: 0,
          abominationSwallowedPet3TimesHurt: 0,
          battlesFought: 0,
          timesHurt: 0,
          equipmentUses: null
        },
        {
          name: "Abomination",
          attack: 100,
          health: 100,
          exp: 5,
          equipment: { name: "Churros" },
          belugaSwallowedPet: null,
          sarcasticFringeheadSwallowedPet: null,
          mana: 50,
          triggersConsumed: 0,
          abominationSwallowedPet1: "Behemoth",
          abominationSwallowedPet2: "Rat",
          abominationSwallowedPet3: "Sabertooth Tiger",
          abominationSwallowedPet1Level: 3,
          abominationSwallowedPet2Level: 3,
          abominationSwallowedPet3Level: 3,
          abominationSwallowedPet1TimesHurt: 0,
          abominationSwallowedPet2TimesHurt: 0,
          abominationSwallowedPet3TimesHurt: 50,
          battlesFought: 0,
          timesHurt: 0,
          equipmentUses: null
        },
        {
          name: "Abomination",
          attack: 100,
          health: 100,
          exp: 5,
          equipment: { name: "Cashew Nut" },
          belugaSwallowedPet: null,
          sarcasticFringeheadSwallowedPet: null,
          mana: 50,
          triggersConsumed: 0,
          abominationSwallowedPet1: "Behemoth",
          abominationSwallowedPet2: "Guineafowl",
          abominationSwallowedPet3: "Vaquita",
          abominationSwallowedPet1Level: 3,
          abominationSwallowedPet2Level: 1,
          abominationSwallowedPet3Level: 3,
          abominationSwallowedPet1TimesHurt: 0,
          abominationSwallowedPet2TimesHurt: 0,
          abominationSwallowedPet3TimesHurt: 50,
          battlesFought: 0,
          timesHurt: 0,
          equipmentUses: 1
        },
        {
          name: "Abomination",
          attack: 100,
          health: 100,
          exp: 5,
          equipment: { name: "Churros" },
          belugaSwallowedPet: null,
          sarcasticFringeheadSwallowedPet: null,
          mana: 50,
          triggersConsumed: 0,
          abominationSwallowedPet1: "Behemoth",
          abominationSwallowedPet2: "Rat",
          abominationSwallowedPet3: "Vaquita",
          abominationSwallowedPet1Level: 3,
          abominationSwallowedPet2Level: 3,
          abominationSwallowedPet3Level: 3,
          abominationSwallowedPet1TimesHurt: 0,
          abominationSwallowedPet2TimesHurt: 0,
          abominationSwallowedPet3TimesHurt: 50,
          battlesFought: 0,
          timesHurt: 0,
          equipmentUses: 1
        },
        {
          name: "Abomination",
          attack: 100,
          health: 100,
          exp: 5,
          equipment: { name: "Churros" },
          belugaSwallowedPet: null,
          sarcasticFringeheadSwallowedPet: null,
          mana: 50,
          triggersConsumed: 0,
          abominationSwallowedPet1: "Behemoth",
          abominationSwallowedPet2: "Rat",
          abominationSwallowedPet3: "Sabertooth Tiger",
          abominationSwallowedPet1Level: 3,
          abominationSwallowedPet2Level: 3,
          abominationSwallowedPet3Level: 3,
          abominationSwallowedPet1TimesHurt: 0,
          abominationSwallowedPet2TimesHurt: 0,
          abominationSwallowedPet3TimesHurt: 50,
          battlesFought: 0,
          timesHurt: 0,
          equipmentUses: null
        }
      ]
    }
  ];
}

// simulation/evolution.ts
function isRecord(value) {
  return typeof value === "object" && value !== null;
}
function parseNumber(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return parsed;
}
function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}
function normalizePet(pet) {
  if (!isRecord(pet)) {
    return null;
  }
  const name = typeof pet.name === "string" ? pet.name : "";
  if (!name.trim()) {
    return null;
  }
  const normalized = { ...pet, name };
  if ("equipment" in normalized) {
    const rawEquipment = normalized.equipment;
    if (typeof rawEquipment === "string") {
      normalized.equipment = rawEquipment.trim() ? { name: rawEquipment.trim() } : null;
    } else if (isRecord(rawEquipment)) {
      const equipmentName = typeof rawEquipment.name === "string" ? rawEquipment.name.trim() : "";
      normalized.equipment = equipmentName ? { name: equipmentName } : null;
    } else {
      normalized.equipment = null;
    }
  }
  return normalized;
}
function normalizePetList(pets2, targetLength = 5) {
  const list = Array.isArray(pets2) ? pets2 : [];
  const normalized = list.slice(0, targetLength).map((pet) => normalizePet(pet));
  while (normalized.length < targetLength) {
    normalized.push(null);
  }
  return normalized;
}
function normalizeTeamSide(input) {
  const side = isRecord(input) ? input : {};
  return {
    pack: typeof side.pack === "string" && side.pack.trim() ? side.pack.trim() : void 0,
    toy: typeof side.toy === "string" ? side.toy : side.toy === null ? null : void 0,
    toyLevel: side.toyLevel == null ? void 0 : Math.max(1, Math.trunc(parseNumber(side.toyLevel, 1))),
    hardToy: typeof side.hardToy === "string" ? side.hardToy : side.hardToy === null ? null : void 0,
    hardToyLevel: side.hardToyLevel == null ? void 0 : Math.max(1, Math.trunc(parseNumber(side.hardToyLevel, 1))),
    turn: side.turn == null ? void 0 : Math.max(1, Math.trunc(parseNumber(side.turn, 11))),
    goldSpent: side.goldSpent == null ? void 0 : Math.max(0, Math.trunc(parseNumber(side.goldSpent, 10))),
    rollAmount: side.rollAmount == null ? void 0 : Math.max(0, Math.trunc(parseNumber(side.rollAmount, 4))),
    summonedAmount: side.summonedAmount == null ? void 0 : Math.max(0, Math.trunc(parseNumber(side.summonedAmount, 0))),
    level3Sold: side.level3Sold == null ? void 0 : Math.max(0, Math.trunc(parseNumber(side.level3Sold, 0))),
    transformationAmount: side.transformationAmount == null ? void 0 : Math.max(0, Math.trunc(parseNumber(side.transformationAmount, 0))),
    pets: normalizePetList(side.pets)
  };
}
function defaultSimulationConfig() {
  return {
    playerPack: "Turtle",
    opponentPack: "Turtle",
    playerToy: null,
    playerToyLevel: 1,
    playerHardToy: null,
    playerHardToyLevel: 1,
    opponentToy: null,
    opponentToyLevel: 1,
    opponentHardToy: null,
    opponentHardToyLevel: 1,
    turn: 11,
    playerGoldSpent: 10,
    opponentGoldSpent: 10,
    playerRollAmount: 4,
    opponentRollAmount: 4,
    playerSummonedAmount: 0,
    opponentSummonedAmount: 0,
    playerLevel3Sold: 0,
    opponentLevel3Sold: 0,
    playerTransformationAmount: 0,
    opponentTransformationAmount: 0,
    playerPets: [null, null, null, null, null],
    opponentPets: [null, null, null, null, null],
    customPacks: [],
    allPets: false,
    oldStork: false,
    tokenPets: true,
    komodoShuffle: false,
    mana: false,
    seed: null,
    simulationCount: 100,
    logsEnabled: false,
    maxLoggedBattles: 0
  };
}
function mergeBaseConfig(baseConfig) {
  const defaults = defaultSimulationConfig();
  if (!baseConfig) {
    return defaults;
  }
  return {
    ...defaults,
    ...deepClone(baseConfig),
    playerPets: normalizePetList(baseConfig.playerPets ?? defaults.playerPets),
    opponentPets: normalizePetList(baseConfig.opponentPets ?? defaults.opponentPets)
  };
}
function applySideToConfig(config, side, perspective) {
  if (perspective === "player") {
    config.playerPack = side.pack ?? config.playerPack;
    config.playerToy = side.toy === void 0 ? config.playerToy : side.toy;
    config.playerToyLevel = side.toyLevel ?? config.playerToyLevel;
    config.playerHardToy = side.hardToy === void 0 ? config.playerHardToy : side.hardToy;
    config.playerHardToyLevel = side.hardToyLevel ?? config.playerHardToyLevel;
    config.playerGoldSpent = side.goldSpent ?? config.playerGoldSpent;
    config.playerRollAmount = side.rollAmount ?? config.playerRollAmount;
    config.playerSummonedAmount = side.summonedAmount ?? config.playerSummonedAmount;
    config.playerLevel3Sold = side.level3Sold ?? config.playerLevel3Sold;
    config.playerTransformationAmount = side.transformationAmount ?? config.playerTransformationAmount;
    config.playerPets = normalizePetList(side.pets);
  } else {
    config.opponentPack = side.pack ?? config.opponentPack;
    config.opponentToy = side.toy === void 0 ? config.opponentToy : side.toy;
    config.opponentToyLevel = side.toyLevel ?? config.opponentToyLevel;
    config.opponentHardToy = side.hardToy === void 0 ? config.opponentHardToy : side.hardToy;
    config.opponentHardToyLevel = side.hardToyLevel ?? config.opponentHardToyLevel;
    config.opponentGoldSpent = side.goldSpent ?? config.opponentGoldSpent;
    config.opponentRollAmount = side.rollAmount ?? config.opponentRollAmount;
    config.opponentSummonedAmount = side.summonedAmount ?? config.opponentSummonedAmount;
    config.opponentLevel3Sold = side.level3Sold ?? config.opponentLevel3Sold;
    config.opponentTransformationAmount = side.transformationAmount ?? config.opponentTransformationAmount;
    config.opponentPets = normalizePetList(side.pets);
  }
  if (side.turn != null) {
    config.turn = side.turn;
  }
}
function buildMatchConfig(baseConfig, candidate, opponent, simulationsPerMatchup, seed) {
  const config = deepClone(baseConfig);
  applySideToConfig(config, candidate, "player");
  applySideToConfig(config, opponent, "opponent");
  config.simulationCount = simulationsPerMatchup;
  config.seed = seed;
  config.logsEnabled = false;
  config.maxLoggedBattles = 0;
  config.captureRandomDecisions = false;
  return config;
}
function runMatch(config) {
  return (0, import_sap_battle_engine3.runHeadlessSimulation)(config, {
    includeBattles: false,
    enableLogs: false
  });
}
function computeStdDev(values) {
  if (values.length === 0) {
    return 0;
  }
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  return Math.sqrt(Math.max(0, variance));
}
function normalizeWeights(count, weights) {
  if (!weights || weights.length === 0) {
    return Array.from({ length: count }, () => 1 / Math.max(1, count));
  }
  const normalized = Array.from({ length: count }, (_, index) => {
    const value = Number(weights[index]);
    return Number.isFinite(value) && value > 0 ? value : 0;
  });
  const sum = normalized.reduce((acc, value) => acc + value, 0);
  if (sum <= 0) {
    return Array.from({ length: count }, () => 1 / Math.max(1, count));
  }
  return normalized.map((value) => value / sum);
}
function evaluateCandidateVsPool(input) {
  const candidate = normalizeTeamSide(input.candidate);
  const opponents = Array.isArray(input.opponents) ? input.opponents.map((opponent) => normalizeTeamSide(opponent)) : [];
  if (opponents.length === 0) {
    throw new Error("Evaluation requires at least one opponent team.");
  }
  const simulationsPerMatchup = Math.max(
    1,
    Math.trunc(parseNumber(input.simulationsPerMatchup, 100))
  );
  const variancePenalty = Math.max(0, parseNumber(input.variancePenalty, 0.1));
  const baseConfig = mergeBaseConfig(input.baseConfig);
  const weights = normalizeWeights(opponents.length, input.matchupWeights);
  const matchups = [];
  const winRates = [];
  for (let index = 0; index < opponents.length; index += 1) {
    const opponent = opponents[index];
    const matchupSeed = input.seed == null ? null : Math.trunc(parseNumber(input.seed, 0)) + index;
    const config = buildMatchConfig(
      baseConfig,
      candidate,
      opponent,
      simulationsPerMatchup,
      matchupSeed
    );
    const result = runMatch(config);
    const total = Math.max(
      1,
      result.playerWins + result.opponentWins + result.draws
    );
    const winRate = result.playerWins / total;
    winRates.push(winRate);
    matchups.push({
      index,
      wins: result.playerWins,
      losses: result.opponentWins,
      draws: result.draws,
      winRate,
      weightedWinRate: winRate * weights[index],
      weight: weights[index]
    });
  }
  const meanWinRate = winRates.reduce((sum, value) => sum + value, 0) / Math.max(1, winRates.length);
  const weightedWinRate = matchups.reduce(
    (sum, matchup) => sum + matchup.weightedWinRate,
    0
  );
  const stdDev = computeStdDev(winRates);
  const fitness = weightedWinRate - variancePenalty * stdDev;
  const totalBattles = simulationsPerMatchup * opponents.length;
  const confidence95 = 1.96 * Math.sqrt(meanWinRate * (1 - meanWinRate) / Math.max(1, totalBattles));
  return {
    fitness,
    meanWinRate,
    weightedWinRate,
    stdDev,
    variancePenalty,
    confidence95,
    simulationsPerMatchup,
    opponentCount: opponents.length,
    totalBattles,
    ...input.includeMatchups ? { matchups } : {}
  };
}
function evaluateCandidateBatch(input) {
  if (!Array.isArray(input.candidates) || input.candidates.length === 0) {
    return [];
  }
  return input.candidates.map((candidate, index) => {
    const seed = input.seed == null ? null : Math.trunc(parseNumber(input.seed, 0)) + index * 1e5;
    return evaluateCandidateVsPool({
      candidate,
      opponents: input.opponents,
      simulationsPerMatchup: input.simulationsPerMatchup,
      baseConfig: input.baseConfig,
      seed,
      variancePenalty: input.variancePenalty,
      matchupWeights: input.matchupWeights,
      includeMatchups: input.includeMatchups
    });
  });
}
function getDefaultPresetPool() {
  const teams = getDefaultTeams();
  return teams.map((team) => {
    const side = {
      pack: "Turtle",
      toy: team.playerToyName ?? team.toyName ?? team.opponentToyName ?? null,
      toyLevel: team.playerToyLevel ?? team.toyLevel ?? team.opponentToyLevel ?? 1,
      hardToy: team.playerHardToy ?? team.opponentHardToy ?? null,
      hardToyLevel: team.playerHardToyLevel ?? team.opponentHardToyLevel ?? 1,
      turn: team.turn ?? 11,
      goldSpent: team.playerGoldSpent ?? team.opponentGoldSpent ?? 10,
      rollAmount: team.playerRollAmount ?? team.opponentRollAmount ?? 4,
      summonedAmount: team.playerSummonedAmount ?? team.opponentSummonedAmount ?? 0,
      level3Sold: team.playerLevel3Sold ?? team.opponentLevel3Sold ?? 0,
      transformationAmount: team.playerTransformationAmount ?? team.opponentTransformationAmount ?? 0,
      pets: normalizePetList(team.pets)
    };
    return {
      id: team.id,
      name: team.name,
      team: side
    };
  });
}

// simulation/cli.ts
function parseArgs(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--stdin" || arg === "-") {
      options.useStdin = true;
      continue;
    }
    if (arg === "--include-battles") {
      options.includeBattles = true;
      continue;
    }
    if (arg === "--logs") {
      options.enableLogs = true;
      continue;
    }
    if (arg === "--pretty") {
      options.pretty = true;
      continue;
    }
    if (arg === "--input" || arg === "-i") {
      options.inputPath = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
    if (!arg.startsWith("-") && !options.inputPath) {
      options.inputPath = arg;
    }
  }
  return options;
}
function parsePresetPoolArgs(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--pretty") {
      options.pretty = true;
      continue;
    }
    if (arg.startsWith("--limit=")) {
      const raw = Number(arg.split("=").slice(1).join("="));
      options.limit = Number.isFinite(raw) ? Math.max(1, Math.trunc(raw)) : void 0;
      continue;
    }
    if (arg === "--limit") {
      const raw = Number(argv[i + 1]);
      options.limit = Number.isFinite(raw) ? Math.max(1, Math.trunc(raw)) : void 0;
      i += 1;
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
  }
  return options;
}
function printHelp() {
  const text = [
    "Usage: sap-calculator-sim [command] [options] [path]",
    "",
    "Commands:",
    "  simulate (default)       Run a single simulation config",
    "  evaluate                 Score candidate vs opponent pool",
    "  evaluate-batch           Score many candidates vs opponent pool",
    "  preset-pool              Output default preset teams for seeding",
    "",
    "Options:",
    "  -i, --input <path>     JSON config file path",
    "  --stdin, -             Read JSON config from stdin",
    "  --include-battles      Include battles array in output",
    "  --logs                 Enable log generation",
    "  --pretty               Pretty-print JSON output",
    "  --limit <n>            (preset-pool) limit output rows",
    "  -h, --help             Show help"
  ];
  console.log(text.join("\n"));
}
function readInput(options) {
  if (options.useStdin) {
    return import_fs.default.readFileSync(0, "utf8");
  }
  if (!options.inputPath) {
    throw new Error("No input provided. Use --stdin or provide a JSON file path.");
  }
  return import_fs.default.readFileSync(options.inputPath, "utf8");
}
function printJson(value, pretty) {
  const output = pretty ? JSON.stringify(value, null, 2) : JSON.stringify(value);
  process.stdout.write(output);
}
function runPresetPool(argv) {
  const options = parsePresetPoolArgs(argv);
  const allTeams = getDefaultPresetPool();
  const teams = options.limit ? allTeams.slice(0, options.limit) : allTeams;
  printJson(
    {
      generatedAt: Date.now(),
      totalTeams: teams.length,
      teams
    },
    options.pretty
  );
}
function runEvaluate(argv) {
  const options = parseArgs(argv);
  const input = readInput(options);
  const payload = JSON.parse(input);
  const result = evaluateCandidateVsPool(payload);
  printJson(result, options.pretty);
}
function runEvaluateBatch(argv) {
  const options = parseArgs(argv);
  const input = readInput(options);
  const payload = JSON.parse(input);
  const result = evaluateCandidateBatch(payload);
  printJson(result, options.pretty);
}
function runSimulate(argv) {
  const options = parseArgs(argv);
  const input = readInput(options);
  const config = JSON.parse(input);
  const result = (0, import_sap_battle_engine3.runHeadlessSimulation)(config, {
    includeBattles: options.includeBattles,
    enableLogs: options.enableLogs
  });
  printJson(result, options.pretty);
}
function run() {
  const argv = process.argv.slice(2);
  if (argv.length === 0) {
    runSimulate(argv);
    return;
  }
  const command = argv[0];
  if (command === "--help" || command === "-h") {
    printHelp();
    return;
  }
  if (command === "preset-pool") {
    runPresetPool(argv.slice(1));
    return;
  }
  if (command === "evaluate") {
    runEvaluate(argv.slice(1));
    return;
  }
  if (command === "evaluate-batch") {
    runEvaluateBatch(argv.slice(1));
    return;
  }
  if (command === "simulate") {
    runSimulate(argv.slice(1));
    return;
  }
  runSimulate(argv);
}
run();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vY2xpLnRzIiwgIi4uLy4uL3NyYy9hcHAvaW50ZWdyYXRpb25zL3NpbXVsYXRpb24vYmF0dGxlLWVuZ2luZS50cyIsICIuLi9zaGltcy50cyIsICIuLi8uLi9zcmMvYXBwL3J1bnRpbWUvY29udGVudC1jYXRhbG9ncy50cyIsICIuLi8uLi9zcmMvYXBwL3J1bnRpbWUvYXNzZXQtY2F0YWxvZy50cyIsICIuLi8uLi9zcmMvYXBwL2ludGVncmF0aW9ucy9lcXVpcG1lbnQvZXF1aXBtZW50LWNhdGVnb3JpZXMudHMiLCAiLi4vLi4vc3JjL2FwcC9pbnRlZ3JhdGlvbnMvbG9nL2xvZy1pbmxpbmUtaWNvbnMudHMiLCAiLi4vLi4vc3JjL2FwcC9pbnRlZ3JhdGlvbnMvbG9nL2xvZy1tZXJnZS11dGlscy50cyIsICIuLi8uLi9zcmMvYXBwL2ludGVncmF0aW9ucy9sb2cvbG9nLWJvYXJkLXJlbmRlci50cyIsICIuLi8uLi9zcmMvYXBwL2ludGVncmF0aW9ucy9sb2cuc2VydmljZS50cyIsICIuLi9zaW11bGF0ZS50cyIsICIuLi8uLi9zcmMvYXBwL2ludGVncmF0aW9ucy9yZXBsYXkvcmVwbGF5LWNhbGMtc2NoZW1hLnRzIiwgIi4uLy4uL3NyYy9hcHAvaW50ZWdyYXRpb25zL3JlcGxheS9yZXBsYXktY2FsYy1wYXJzZXItdXRpbHMudHMiLCAiLi4vLi4vc3JjL2FwcC9pbnRlZ3JhdGlvbnMvcmVwbGF5L3JlcGxheS1jYWxjLXBhcnNlci50cyIsICIuLi8uLi9zcmMvYXBwL2ludGVncmF0aW9ucy90ZWFtLXByZXNldHMuZGVmYXVsdHMudHMiLCAiLi4vZXZvbHV0aW9uLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIjIS91c3IvYmluL2VudiBub2RlXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHsgcnVuSGVhZGxlc3NTaW11bGF0aW9uIH0gZnJvbSAnLi9zaW11bGF0ZSc7XG5pbXBvcnQgeyBTaW11bGF0aW9uQ29uZmlnIH0gZnJvbSAnLi4vc3JjL2FwcC9kb21haW4vaW50ZXJmYWNlcy9zaW11bGF0aW9uLWNvbmZpZy5pbnRlcmZhY2UnO1xuaW1wb3J0IHtcbiAgZXZhbHVhdGVDYW5kaWRhdGVCYXRjaCxcbiAgZXZhbHVhdGVDYW5kaWRhdGVWc1Bvb2wsXG4gIEV2YWx1YXRlQmF0Y2hSZXF1ZXN0LFxuICBFdmFsdWF0ZVJlcXVlc3QsXG4gIGdldERlZmF1bHRQcmVzZXRQb29sLFxufSBmcm9tICcuL2V2b2x1dGlvbic7XG5cbnR5cGUgQ2xpT3B0aW9ucyA9IHtcbiAgaW5wdXRQYXRoPzogc3RyaW5nO1xuICB1c2VTdGRpbj86IGJvb2xlYW47XG4gIGluY2x1ZGVCYXR0bGVzPzogYm9vbGVhbjtcbiAgZW5hYmxlTG9ncz86IGJvb2xlYW47XG4gIHByZXR0eT86IGJvb2xlYW47XG59O1xuXG5mdW5jdGlvbiBwYXJzZUFyZ3MoYXJndjogc3RyaW5nW10pOiBDbGlPcHRpb25zIHtcbiAgY29uc3Qgb3B0aW9uczogQ2xpT3B0aW9ucyA9IHt9O1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGFyZ3YubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBhcmcgPSBhcmd2W2ldO1xuICAgIGlmIChhcmcgPT09ICctLXN0ZGluJyB8fCBhcmcgPT09ICctJykge1xuICAgICAgb3B0aW9ucy51c2VTdGRpbiA9IHRydWU7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKGFyZyA9PT0gJy0taW5jbHVkZS1iYXR0bGVzJykge1xuICAgICAgb3B0aW9ucy5pbmNsdWRlQmF0dGxlcyA9IHRydWU7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKGFyZyA9PT0gJy0tbG9ncycpIHtcbiAgICAgIG9wdGlvbnMuZW5hYmxlTG9ncyA9IHRydWU7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKGFyZyA9PT0gJy0tcHJldHR5Jykge1xuICAgICAgb3B0aW9ucy5wcmV0dHkgPSB0cnVlO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChhcmcgPT09ICctLWlucHV0JyB8fCBhcmcgPT09ICctaScpIHtcbiAgICAgIG9wdGlvbnMuaW5wdXRQYXRoID0gYXJndltpICsgMV07XG4gICAgICBpICs9IDE7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKGFyZyA9PT0gJy0taGVscCcgfHwgYXJnID09PSAnLWgnKSB7XG4gICAgICBwcmludEhlbHAoKTtcbiAgICAgIHByb2Nlc3MuZXhpdCgwKTtcbiAgICB9XG4gICAgaWYgKCFhcmcuc3RhcnRzV2l0aCgnLScpICYmICFvcHRpb25zLmlucHV0UGF0aCkge1xuICAgICAgb3B0aW9ucy5pbnB1dFBhdGggPSBhcmc7XG4gICAgfVxuICB9XG4gIHJldHVybiBvcHRpb25zO1xufVxuXG50eXBlIFByZXNldFBvb2xPcHRpb25zID0ge1xuICBwcmV0dHk/OiBib29sZWFuO1xuICBsaW1pdD86IG51bWJlcjtcbn07XG5cbmZ1bmN0aW9uIHBhcnNlUHJlc2V0UG9vbEFyZ3MoYXJndjogc3RyaW5nW10pOiBQcmVzZXRQb29sT3B0aW9ucyB7XG4gIGNvbnN0IG9wdGlvbnM6IFByZXNldFBvb2xPcHRpb25zID0ge307XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXJndi5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGNvbnN0IGFyZyA9IGFyZ3ZbaV07XG4gICAgaWYgKGFyZyA9PT0gJy0tcHJldHR5Jykge1xuICAgICAgb3B0aW9ucy5wcmV0dHkgPSB0cnVlO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChhcmcuc3RhcnRzV2l0aCgnLS1saW1pdD0nKSkge1xuICAgICAgY29uc3QgcmF3ID0gTnVtYmVyKGFyZy5zcGxpdCgnPScpLnNsaWNlKDEpLmpvaW4oJz0nKSk7XG4gICAgICBvcHRpb25zLmxpbWl0ID0gTnVtYmVyLmlzRmluaXRlKHJhdykgPyBNYXRoLm1heCgxLCBNYXRoLnRydW5jKHJhdykpIDogdW5kZWZpbmVkO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChhcmcgPT09ICctLWxpbWl0Jykge1xuICAgICAgY29uc3QgcmF3ID0gTnVtYmVyKGFyZ3ZbaSArIDFdKTtcbiAgICAgIG9wdGlvbnMubGltaXQgPSBOdW1iZXIuaXNGaW5pdGUocmF3KSA/IE1hdGgubWF4KDEsIE1hdGgudHJ1bmMocmF3KSkgOiB1bmRlZmluZWQ7XG4gICAgICBpICs9IDE7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKGFyZyA9PT0gJy0taGVscCcgfHwgYXJnID09PSAnLWgnKSB7XG4gICAgICBwcmludEhlbHAoKTtcbiAgICAgIHByb2Nlc3MuZXhpdCgwKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG9wdGlvbnM7XG59XG5cbmZ1bmN0aW9uIHByaW50SGVscCgpIHtcbiAgY29uc3QgdGV4dCA9IFtcbiAgICAnVXNhZ2U6IHNhcC1jYWxjdWxhdG9yLXNpbSBbY29tbWFuZF0gW29wdGlvbnNdIFtwYXRoXScsXG4gICAgJycsXG4gICAgJ0NvbW1hbmRzOicsXG4gICAgJyAgc2ltdWxhdGUgKGRlZmF1bHQpICAgICAgIFJ1biBhIHNpbmdsZSBzaW11bGF0aW9uIGNvbmZpZycsXG4gICAgJyAgZXZhbHVhdGUgICAgICAgICAgICAgICAgIFNjb3JlIGNhbmRpZGF0ZSB2cyBvcHBvbmVudCBwb29sJyxcbiAgICAnICBldmFsdWF0ZS1iYXRjaCAgICAgICAgICAgU2NvcmUgbWFueSBjYW5kaWRhdGVzIHZzIG9wcG9uZW50IHBvb2wnLFxuICAgICcgIHByZXNldC1wb29sICAgICAgICAgICAgICBPdXRwdXQgZGVmYXVsdCBwcmVzZXQgdGVhbXMgZm9yIHNlZWRpbmcnLFxuICAgICcnLFxuICAgICdPcHRpb25zOicsXG4gICAgJyAgLWksIC0taW5wdXQgPHBhdGg+ICAgICBKU09OIGNvbmZpZyBmaWxlIHBhdGgnLFxuICAgICcgIC0tc3RkaW4sIC0gICAgICAgICAgICAgUmVhZCBKU09OIGNvbmZpZyBmcm9tIHN0ZGluJyxcbiAgICAnICAtLWluY2x1ZGUtYmF0dGxlcyAgICAgIEluY2x1ZGUgYmF0dGxlcyBhcnJheSBpbiBvdXRwdXQnLFxuICAgICcgIC0tbG9ncyAgICAgICAgICAgICAgICAgRW5hYmxlIGxvZyBnZW5lcmF0aW9uJyxcbiAgICAnICAtLXByZXR0eSAgICAgICAgICAgICAgIFByZXR0eS1wcmludCBKU09OIG91dHB1dCcsXG4gICAgJyAgLS1saW1pdCA8bj4gICAgICAgICAgICAocHJlc2V0LXBvb2wpIGxpbWl0IG91dHB1dCByb3dzJyxcbiAgICAnICAtaCwgLS1oZWxwICAgICAgICAgICAgIFNob3cgaGVscCcsXG4gIF07XG4gIGNvbnNvbGUubG9nKHRleHQuam9pbignXFxuJykpO1xufVxuXG5mdW5jdGlvbiByZWFkSW5wdXQob3B0aW9uczogQ2xpT3B0aW9ucyk6IHN0cmluZyB7XG4gIGlmIChvcHRpb25zLnVzZVN0ZGluKSB7XG4gICAgcmV0dXJuIGZzLnJlYWRGaWxlU3luYygwLCAndXRmOCcpO1xuICB9XG4gIGlmICghb3B0aW9ucy5pbnB1dFBhdGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGlucHV0IHByb3ZpZGVkLiBVc2UgLS1zdGRpbiBvciBwcm92aWRlIGEgSlNPTiBmaWxlIHBhdGguJyk7XG4gIH1cbiAgcmV0dXJuIGZzLnJlYWRGaWxlU3luYyhvcHRpb25zLmlucHV0UGF0aCwgJ3V0ZjgnKTtcbn1cblxuZnVuY3Rpb24gcHJpbnRKc29uKHZhbHVlOiB1bmtub3duLCBwcmV0dHk6IGJvb2xlYW4gfCB1bmRlZmluZWQpOiB2b2lkIHtcbiAgY29uc3Qgb3V0cHV0ID0gcHJldHR5XG4gICAgPyBKU09OLnN0cmluZ2lmeSh2YWx1ZSwgbnVsbCwgMilcbiAgICA6IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgcHJvY2Vzcy5zdGRvdXQud3JpdGUob3V0cHV0KTtcbn1cblxuZnVuY3Rpb24gcnVuUHJlc2V0UG9vbChhcmd2OiBzdHJpbmdbXSk6IHZvaWQge1xuICBjb25zdCBvcHRpb25zID0gcGFyc2VQcmVzZXRQb29sQXJncyhhcmd2KTtcbiAgY29uc3QgYWxsVGVhbXMgPSBnZXREZWZhdWx0UHJlc2V0UG9vbCgpO1xuICBjb25zdCB0ZWFtcyA9IG9wdGlvbnMubGltaXQgPyBhbGxUZWFtcy5zbGljZSgwLCBvcHRpb25zLmxpbWl0KSA6IGFsbFRlYW1zO1xuICBwcmludEpzb24oXG4gICAge1xuICAgICAgZ2VuZXJhdGVkQXQ6IERhdGUubm93KCksXG4gICAgICB0b3RhbFRlYW1zOiB0ZWFtcy5sZW5ndGgsXG4gICAgICB0ZWFtcyxcbiAgICB9LFxuICAgIG9wdGlvbnMucHJldHR5LFxuICApO1xufVxuXG5mdW5jdGlvbiBydW5FdmFsdWF0ZShhcmd2OiBzdHJpbmdbXSk6IHZvaWQge1xuICBjb25zdCBvcHRpb25zID0gcGFyc2VBcmdzKGFyZ3YpO1xuICBjb25zdCBpbnB1dCA9IHJlYWRJbnB1dChvcHRpb25zKTtcbiAgY29uc3QgcGF5bG9hZCA9IEpTT04ucGFyc2UoaW5wdXQpIGFzIEV2YWx1YXRlUmVxdWVzdDtcbiAgY29uc3QgcmVzdWx0ID0gZXZhbHVhdGVDYW5kaWRhdGVWc1Bvb2wocGF5bG9hZCk7XG4gIHByaW50SnNvbihyZXN1bHQsIG9wdGlvbnMucHJldHR5KTtcbn1cblxuZnVuY3Rpb24gcnVuRXZhbHVhdGVCYXRjaChhcmd2OiBzdHJpbmdbXSk6IHZvaWQge1xuICBjb25zdCBvcHRpb25zID0gcGFyc2VBcmdzKGFyZ3YpO1xuICBjb25zdCBpbnB1dCA9IHJlYWRJbnB1dChvcHRpb25zKTtcbiAgY29uc3QgcGF5bG9hZCA9IEpTT04ucGFyc2UoaW5wdXQpIGFzIEV2YWx1YXRlQmF0Y2hSZXF1ZXN0O1xuICBjb25zdCByZXN1bHQgPSBldmFsdWF0ZUNhbmRpZGF0ZUJhdGNoKHBheWxvYWQpO1xuICBwcmludEpzb24ocmVzdWx0LCBvcHRpb25zLnByZXR0eSk7XG59XG5cbmZ1bmN0aW9uIHJ1blNpbXVsYXRlKGFyZ3Y6IHN0cmluZ1tdKTogdm9pZCB7XG4gIGNvbnN0IG9wdGlvbnMgPSBwYXJzZUFyZ3MoYXJndik7XG4gIGNvbnN0IGlucHV0ID0gcmVhZElucHV0KG9wdGlvbnMpO1xuICBjb25zdCBjb25maWcgPSBKU09OLnBhcnNlKGlucHV0KSBhcyBTaW11bGF0aW9uQ29uZmlnO1xuICBjb25zdCByZXN1bHQgPSBydW5IZWFkbGVzc1NpbXVsYXRpb24oY29uZmlnLCB7XG4gICAgaW5jbHVkZUJhdHRsZXM6IG9wdGlvbnMuaW5jbHVkZUJhdHRsZXMsXG4gICAgZW5hYmxlTG9nczogb3B0aW9ucy5lbmFibGVMb2dzLFxuICB9KTtcbiAgcHJpbnRKc29uKHJlc3VsdCwgb3B0aW9ucy5wcmV0dHkpO1xufVxuXG5mdW5jdGlvbiBydW4oKSB7XG4gIGNvbnN0IGFyZ3YgPSBwcm9jZXNzLmFyZ3Yuc2xpY2UoMik7XG4gIGlmIChhcmd2Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJ1blNpbXVsYXRlKGFyZ3YpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGNvbW1hbmQgPSBhcmd2WzBdO1xuICBpZiAoY29tbWFuZCA9PT0gJy0taGVscCcgfHwgY29tbWFuZCA9PT0gJy1oJykge1xuICAgIHByaW50SGVscCgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChjb21tYW5kID09PSAncHJlc2V0LXBvb2wnKSB7XG4gICAgcnVuUHJlc2V0UG9vbChhcmd2LnNsaWNlKDEpKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoY29tbWFuZCA9PT0gJ2V2YWx1YXRlJykge1xuICAgIHJ1bkV2YWx1YXRlKGFyZ3Yuc2xpY2UoMSkpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChjb21tYW5kID09PSAnZXZhbHVhdGUtYmF0Y2gnKSB7XG4gICAgcnVuRXZhbHVhdGVCYXRjaChhcmd2LnNsaWNlKDEpKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoY29tbWFuZCA9PT0gJ3NpbXVsYXRlJykge1xuICAgIHJ1blNpbXVsYXRlKGFyZ3Yuc2xpY2UoMSkpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHJ1blNpbXVsYXRlKGFyZ3YpO1xufVxuXG5ydW4oKTtcbiIsICJpbXBvcnQgeyBjcmVhdGVCYXR0bGVFbmdpbmUsIEJhdHRsZSwgQmF0dGxlRXZlbnQsIEJvYXJkU25hcHNob3QsIFBldFNuYXBzaG90LCBTaW11bGF0aW9uUnVuSG9va3MgfSBmcm9tICdzYXAtYmF0dGxlLWVuZ2luZSc7XG5pbXBvcnQgeyBTaW11bGF0aW9uQ29uZmlnLCBTaW11bGF0aW9uUmVzdWx0LCBQZXRDb25maWcgfSBmcm9tICdhcHAvZG9tYWluL2ludGVyZmFjZXMvc2ltdWxhdGlvbi1jb25maWcuaW50ZXJmYWNlJztcbmltcG9ydCB7IExvZyB9IGZyb20gJ2FwcC9kb21haW4vaW50ZXJmYWNlcy9sb2cuaW50ZXJmYWNlJztcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJ2FwcC9kb21haW4vZW50aXRpZXMvcGxheWVyLmNsYXNzJztcbmltcG9ydCB7IFBldCB9IGZyb20gJ2FwcC9kb21haW4vZW50aXRpZXMvcGV0LmNsYXNzJztcbmltcG9ydCB7IExvZ1NlcnZpY2UgfSBmcm9tICcuLi9sb2cuc2VydmljZSc7XG5pbXBvcnQgeyBidWlsZEJvYXJkU3RhdGVNZXNzYWdlIH0gZnJvbSAnLi4vbG9nL2xvZy1ib2FyZC1yZW5kZXInO1xuaW1wb3J0IHsgQUlMTUVOVF9DQVRFR09SSUVTIH0gZnJvbSAnLi4vZXF1aXBtZW50L2VxdWlwbWVudC1jYXRlZ29yaWVzJztcblxuY29uc3QgYWlsbWVudHMgPSBuZXcgU2V0KE9iamVjdC52YWx1ZXMoQUlMTUVOVF9DQVRFR09SSUVTKS5mbGF0KCkpO1xuXG5leHBvcnQgZnVuY3Rpb24gc2FtcGxlQmF0dGxlc0J5T3V0Y29tZShcbiAgYmF0dGxlczogQmF0dGxlW10sXG4gIGxpbWl0UGVyT3V0Y29tZTogbnVtYmVyLFxuKTogQmF0dGxlW10ge1xuICBjb25zdCBsaW1pdCA9IE1hdGgubWF4KDAsIE1hdGgudHJ1bmMobGltaXRQZXJPdXRjb21lKSk7XG4gIGNvbnN0IGNvdW50czogUmVjb3JkPEJhdHRsZVsnd2lubmVyJ10sIG51bWJlcj4gPSB7XG4gICAgcGxheWVyOiAwLFxuICAgIG9wcG9uZW50OiAwLFxuICAgIGRyYXc6IDAsXG4gIH07XG4gIHJldHVybiBiYXR0bGVzLmZpbHRlcigoYmF0dGxlKSA9PiB7XG4gICAgaWYgKGNvdW50c1tiYXR0bGUud2lubmVyXSA+PSBsaW1pdCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb3VudHNbYmF0dGxlLndpbm5lcl0gKz0gMTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlQZXQoc25hcHNob3Q6IFBldFNuYXBzaG90KTogUGV0IHtcbiAgY29uc3QgcGFyZW50ID0gbmV3IFBsYXllcigpO1xuICBwYXJlbnQuaXNPcHBvbmVudCA9IHNuYXBzaG90LnNpZGUgPT09ICdvcHBvbmVudCc7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKG5ldyBQZXQoKSwgc25hcHNob3QsIHtcbiAgICBwYXJlbnQsIHNhdmVkUG9zaXRpb246IHNuYXBzaG90LnBvc2l0aW9uIC0gMSxcbiAgICBlcXVpcG1lbnQ6IHNuYXBzaG90LmVxdWlwbWVudCA/IHsgbmFtZTogc25hcHNob3QuZXF1aXBtZW50LCB1c2VzOiBzbmFwc2hvdC5lcXVpcG1lbnRVc2VzIH0gOiBudWxsLFxuICB9KTtcbn1cbmZ1bmN0aW9uIGRpc3BsYXlCb2FyZChib2FyZDogQm9hcmRTbmFwc2hvdCwgY29uZmlnOiBTaW11bGF0aW9uQ29uZmlnKTogc3RyaW5nIHtcbiAgY29uc3Qgc2lkZXMgPSAoWydwbGF5ZXInLCAnb3Bwb25lbnQnXSBhcyBjb25zdCkubWFwKChzaWRlKSA9PiB7XG4gICAgY29uc3QgcGxheWVyID0gbmV3IFBsYXllcigpO1xuICAgIHBsYXllci5pc09wcG9uZW50ID0gc2lkZSA9PT0gJ29wcG9uZW50JztcbiAgICBib2FyZFtzaWRlXS5mb3JFYWNoKChwZXQsIGluZGV4KSA9PiBwbGF5ZXIuc2V0UGV0KGluZGV4LCBwZXQgPyBkaXNwbGF5UGV0KHBldCkgOiBudWxsKSk7XG4gICAgY29uc3QgdG95ID0gc2lkZSA9PT0gJ3BsYXllcicgPyBjb25maWcucGxheWVyVG95IDogY29uZmlnLm9wcG9uZW50VG95O1xuICAgIGNvbnN0IGhhcmRUb3kgPSBzaWRlID09PSAncGxheWVyJyA/IGNvbmZpZy5wbGF5ZXJIYXJkVG95IDogY29uZmlnLm9wcG9uZW50SGFyZFRveTtcbiAgICBwbGF5ZXIudG95ID0gdG95ID8geyBuYW1lOiB0b3ksIGxldmVsOiAxIH0gOiBudWxsO1xuICAgIHBsYXllci5oYXJkVG95ID0gaGFyZFRveSA/IHsgbmFtZTogaGFyZFRveSwgbGV2ZWw6IDEgfSA6IG51bGw7XG4gICAgcmV0dXJuIHBsYXllcjtcbiAgfSk7XG4gIHJldHVybiBidWlsZEJvYXJkU3RhdGVNZXNzYWdlKHNpZGVzWzBdLCBzaWRlc1sxXSwgKHBldCkgPT4gcGV0LnNhdmVkUG9zaXRpb24gKyAxLCAobmFtZSkgPT4gYWlsbWVudHMuaGFzKG5hbWUpKTtcbn1cblxuLyoqIFRoZSBvbmx5IGJyaWRnZSBiZXR3ZWVuIGJhdHRsZSBleGVjdXRpb24gYW5kIGNhbGN1bGF0b3IgcHJlc2VudGF0aW9uLiAqL1xuZXhwb3J0IGNsYXNzIENhbGN1bGF0b3JCYXR0bGVFbmdpbmUge1xuICBwcml2YXRlIHJlYWRvbmx5IGVuZ2luZSA9IGNyZWF0ZUJhdHRsZUVuZ2luZSgpO1xuICBwcml2YXRlIHJlYWRvbmx5IGxvZ1NlcnZpY2UgPSBuZXcgTG9nU2VydmljZSgpO1xuICBjb25zdHJ1Y3RvcihzZXR0aW5ncz86IExvZ1NlcnZpY2UpIHtcbiAgICB0aGlzLmxvZ1NlcnZpY2Uuc2V0U2hvd1RyaWdnZXJOYW1lc0luTG9ncyhzZXR0aW5ncz8uaXNTaG93VHJpZ2dlck5hbWVzSW5Mb2dzKCkgPz8gZmFsc2UpO1xuICB9XG4gIHJ1bihcbiAgICBjb25maWc6IFNpbXVsYXRpb25Db25maWcsXG4gICAgaG9va3M/OiBTaW11bGF0aW9uUnVuSG9va3MsXG4gICAgbWF4QmF0dGxlc1Blck91dGNvbWU/OiBudW1iZXIsXG4gICk6IFNpbXVsYXRpb25SZXN1bHQge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuZW5naW5lLnJ1blNpbXVsYXRpb24oY29uZmlnLCBob29rcyk7XG4gICAgLy8gUmVkdWNlIHRoZSBleHBlbnNpdmUgZm9ybWF0dGVkL3N0cnVjdHVyZWQtY2xvbmVkIHJlc3VsdCB3aXRob3V0IHN0YXJ2aW5nXG4gICAgLy8gYW55IHdpbm5lciBmaWx0ZXIgd2hlbiBvbmUgb3V0Y29tZSBhcHBlYXJzIGxhdGUgaW4gdGhlIHNpbXVsYXRpb24uXG4gICAgY29uc3QgYmF0dGxlcyA9XG4gICAgICByZXN1bHQuYmF0dGxlcyAmJiBtYXhCYXR0bGVzUGVyT3V0Y29tZSAhPSBudWxsXG4gICAgICAgID8gc2FtcGxlQmF0dGxlc0J5T3V0Y29tZShyZXN1bHQuYmF0dGxlcywgbWF4QmF0dGxlc1Blck91dGNvbWUpXG4gICAgICAgIDogcmVzdWx0LmJhdHRsZXM7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnJlc3VsdCxcbiAgICAgIC4uLihiYXR0bGVzID8geyBiYXR0bGVzOiBiYXR0bGVzLm1hcCgoYmF0dGxlKSA9PiAoe1xuICAgICAgICAuLi5iYXR0bGUsXG4gICAgICAgIGxvZ3M6IHRoaXMuZm9ybWF0RXZlbnRzKGJhdHRsZS5sb2dzLCBjb25maWcpLFxuICAgICAgfSkpIH0gOiB7fSksXG4gICAgfTtcbiAgfVxuICBwcm9qZWN0TGluZXVwQWZ0ZXJFbmRUdXJuKGNvbmZpZzogU2ltdWxhdGlvbkNvbmZpZywgc2lkZTogJ3BsYXllcicgfCAnb3Bwb25lbnQnLCBsaW5ldXA6IChQZXRDb25maWcgfCBudWxsKVtdKTogKFBldENvbmZpZyB8IG51bGwpW10ge1xuICAgIHJldHVybiB0aGlzLmVuZ2luZS5wcm9qZWN0TGluZXVwQWZ0ZXJFbmRUdXJuKGNvbmZpZywgc2lkZSwgbGluZXVwKTtcbiAgfVxuICBwcml2YXRlIGZvcm1hdEV2ZW50cyhldmVudHM6IEJhdHRsZUV2ZW50W10sIGNvbmZpZzogU2ltdWxhdGlvbkNvbmZpZyk6IExvZ1tdIHtcbiAgICB0aGlzLmxvZ1NlcnZpY2UucmVzZXQoKTtcbiAgICB0aGlzLmxvZ1NlcnZpY2Uuc2V0RW5hYmxlZCh0cnVlKTtcbiAgICB0aGlzLmxvZ1NlcnZpY2Uuc2V0RGVmZXJEZWNvcmF0aW9ucyh0cnVlKTtcbiAgICBmb3IgKGNvbnN0IGV2ZW50IG9mIGV2ZW50cykge1xuICAgICAgdGhpcy5sb2dTZXJ2aWNlLmNyZWF0ZUxvZyh7XG4gICAgICAgIC4uLmV2ZW50LFxuICAgICAgICBtZXNzYWdlOiBldmVudC50eXBlID09PSAnYm9hcmQnICYmICFldmVudC5tZXNzYWdlID8gZGlzcGxheUJvYXJkKGV2ZW50LmJvYXJkLCBjb25maWcpIDogZXZlbnQubWVzc2FnZSxcbiAgICAgICAgcGxheWVySXNPcHBvbmVudDogZXZlbnQuc2lkZSA9PSBudWxsID8gdW5kZWZpbmVkIDogZXZlbnQuc2lkZSA9PT0gJ29wcG9uZW50JyxcbiAgICAgICAgdGFyZ2V0SXNPcHBvbmVudDogZXZlbnQudGFyZ2V0U2lkZSA9PSBudWxsID8gdW5kZWZpbmVkIDogZXZlbnQudGFyZ2V0U2lkZSA9PT0gJ29wcG9uZW50JyxcbiAgICAgICAgc291cmNlUGV0OiBldmVudC5zb3VyY2UgPyBkaXNwbGF5UGV0KGV2ZW50LnNvdXJjZSkgOiB1bmRlZmluZWQsXG4gICAgICAgIHRhcmdldFBldDogZXZlbnQudGFyZ2V0ID8gZGlzcGxheVBldChldmVudC50YXJnZXQpIDogdW5kZWZpbmVkLFxuICAgICAgICAvLyBLZWVwIHNuYXBzaG90IGV2ZW50cyBzZXBhcmF0ZSBzbyB0aGVpciBpZGVudGl0aWVzIGFuZCBib2FyZCBzdGF0ZXMgcmVtYWluIG1lYW5pbmdmdWwuXG4gICAgICAgIG5vQ29sbGFwc2U6IHRydWUsXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMubG9nU2VydmljZS5nZXRMb2dzKCk7XG4gIH1cbn1cbiIsICIvLyBNb2NrIEFuZ3VsYXIgRGVjb3JhdG9yc1xuZXhwb3J0IGZ1bmN0aW9uIEluamVjdGFibGUoX2FyZ3M/OiBhbnkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQ6IGFueSkge307XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDb21wb25lbnQoYXJnczogYW55KSB7XG4gIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0OiBhbnkpIHt9O1xufVxuXG5leHBvcnQgY2xhc3MgSW5qZWN0b3Ige31cblxuLy8gTW9jayBBbmd1bGFyIEZvcm1zXG5leHBvcnQgY2xhc3MgQWJzdHJhY3RDb250cm9sIHtcbiAgdmFsdWU6IGFueTtcbiAgY29uc3RydWN0b3IodmFsdWU6IGFueSkge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgfVxuICBnZXQocGF0aDogc3RyaW5nIHwgKHN0cmluZyB8IG51bWJlcilbXSk6IEFic3RyYWN0Q29udHJvbCB8IG51bGwge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBGb3JtQ29udHJvbCBleHRlbmRzIEFic3RyYWN0Q29udHJvbCB7XG4gIGNvbnN0cnVjdG9yKHZhbHVlOiBhbnksIF92YWxpZGF0b3JPck9wdHM/OiBhbnkpIHtcbiAgICBzdXBlcih2YWx1ZSk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEZvcm1Hcm91cCBleHRlbmRzIEFic3RyYWN0Q29udHJvbCB7XG4gIGNvbnRyb2xzOiB7IFtrZXk6IHN0cmluZ106IEFic3RyYWN0Q29udHJvbCB9O1xuICBjb25zdHJ1Y3Rvcihjb250cm9sczogeyBba2V5OiBzdHJpbmddOiBBYnN0cmFjdENvbnRyb2wgfSkge1xuICAgIHN1cGVyKGNvbnRyb2xzKTtcbiAgICB0aGlzLmNvbnRyb2xzID0gY29udHJvbHM7XG4gIH1cbiAgb3ZlcnJpZGUgZ2V0KHBhdGg6IHN0cmluZyk6IEFic3RyYWN0Q29udHJvbCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmNvbnRyb2xzW3BhdGhdIHx8IG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEZvcm1BcnJheSBleHRlbmRzIEFic3RyYWN0Q29udHJvbCB7XG4gIGNvbnRyb2xzOiBBYnN0cmFjdENvbnRyb2xbXTtcbiAgY29uc3RydWN0b3IoY29udHJvbHM6IEFic3RyYWN0Q29udHJvbFtdKSB7XG4gICAgc3VwZXIoY29udHJvbHMpO1xuICAgIHRoaXMuY29udHJvbHMgPSBjb250cm9scztcbiAgfVxuICBvdmVycmlkZSBnZXQoaW5kZXg6IGFueSk6IEFic3RyYWN0Q29udHJvbCB8IG51bGwge1xuICAgIGlmICh0eXBlb2YgaW5kZXggPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250cm9sc1tpbmRleF0gfHwgbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFZhbGlkYXRvcnMge1xuICBzdGF0aWMgcmVxdWlyZWQoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IHR5cGUgVmFsaWRhdGlvbkVycm9ycyA9IHtcbiAgW2tleTogc3RyaW5nXTogYW55O1xufSB8IG51bGw7XG5cbmV4cG9ydCB0eXBlIFZhbGlkYXRvckZuID0gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4gVmFsaWRhdGlvbkVycm9ycyB8IG51bGw7XG4iLCAiaW1wb3J0IHsgY2F0YWxvZ3MgfSBmcm9tICdzYXAtYmF0dGxlLWVuZ2luZSc7XG4vLyBDb25zdW1lcnMgcmVjZWl2ZSBtdXRhYmxlIG1ldGFkYXRhIGNvcGllcyBmb3IgZXhpc3RpbmcgZm9ybSBhbmQgcGFyc2VyIEFQSXMuXG50eXBlIE11dGFibGU8VD4gPSBUIGV4dGVuZHMgb2JqZWN0ID8geyAtcmVhZG9ubHkgW0sgaW4ga2V5b2YgVF06IE11dGFibGU8VFtLXT4gfSA6IFQ7XG5leHBvcnQgY29uc3QgcGV0cyA9IHN0cnVjdHVyZWRDbG9uZShjYXRhbG9ncy5wZXRzKSBhcyBNdXRhYmxlPHR5cGVvZiBjYXRhbG9ncy5wZXRzPjtcbmV4cG9ydCBjb25zdCB0b3lzID0gc3RydWN0dXJlZENsb25lKGNhdGFsb2dzLnRveXMpIGFzIE11dGFibGU8dHlwZW9mIGNhdGFsb2dzLnRveXM+O1xuZXhwb3J0IGNvbnN0IGZvb2QgPSBzdHJ1Y3R1cmVkQ2xvbmUoY2F0YWxvZ3MuZm9vZCkgYXMgTXV0YWJsZTx0eXBlb2YgY2F0YWxvZ3MuZm9vZD47XG5leHBvcnQgY29uc3QgcGVya3MgPSBzdHJ1Y3R1cmVkQ2xvbmUoY2F0YWxvZ3MucGVya3MpIGFzIE11dGFibGU8dHlwZW9mIGNhdGFsb2dzLnBlcmtzPjtcbiIsICJpbXBvcnQgeyBwZXRzIGFzIHBldHNKc29uIH0gZnJvbSAnYXBwL3J1bnRpbWUvY29udGVudC1jYXRhbG9ncyc7XG5pbXBvcnQgeyB0b3lzIGFzIHRveXNKc29uIH0gZnJvbSAnYXBwL3J1bnRpbWUvY29udGVudC1jYXRhbG9ncyc7XG5pbXBvcnQgeyBwZXJrcyBhcyBwZXJrc0pzb24gfSBmcm9tICdhcHAvcnVudGltZS9jb250ZW50LWNhdGFsb2dzJztcblxuaW50ZXJmYWNlIE5hbWVJZEVudHJ5IHtcbiAgTmFtZT86IHN0cmluZztcbiAgTmFtZUlkPzogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgQWJpbGl0eUVudHJ5IHtcbiAgTGV2ZWw/OiBudW1iZXI7XG4gIEFib3V0Pzogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgUGV0QWJpbGl0eUVudHJ5IGV4dGVuZHMgTmFtZUlkRW50cnkge1xuICBBYmlsaXRpZXM/OiBBYmlsaXR5RW50cnlbXTtcbiAgUGVya05vdGU/OiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBUb3lBYmlsaXR5RW50cnkgZXh0ZW5kcyBOYW1lSWRFbnRyeSB7XG4gIEFiaWxpdGllcz86IEFiaWxpdHlFbnRyeVtdO1xufVxuXG5pbnRlcmZhY2UgRXF1aXBtZW50QWJpbGl0eUVudHJ5IGV4dGVuZHMgTmFtZUlkRW50cnkge1xuICBBYmlsaXR5Pzogc3RyaW5nO1xufVxuXG5jb25zdCBnZXROYW1lTGlzdCA9IChlbnRyaWVzOiBOYW1lSWRFbnRyeVtdKTogc3RyaW5nW10gPT5cbiAgZW50cmllc1xuICAgIC5tYXAoKGVudHJ5KSA9PiBlbnRyeT8uTmFtZSlcbiAgICAuZmlsdGVyKChuYW1lKTogbmFtZSBpcyBzdHJpbmcgPT4gQm9vbGVhbihuYW1lKSk7XG5cbmNvbnN0IHBldE5hbWVPdmVycmlkZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICdCZWx1Z2EgV2hhbGUnOiAnV2hpdGVXaGFsZScsXG4gICdHcmVhdCBPbmUnOiAnQ3RodWx1JyxcbiAgJ1NtYWxsIE9uZSc6ICdCYWJ5Q3RodWxodScsXG4gIEFib21pbmF0aW9uOiAnU2hvZ2dvdGgnLFxuICBWaXNpdG9yOiAnWGVub21vcnBoJyxcbiAgU3dvcmRmaXNoOiAnU3dvcmRGaXNoJyxcbiAgRG9iZXJtYW46ICdEb2Jlcm1hbkRvZycsXG4gICdIaWdobGFuZCBDb3cnOiAnSGlnaGxhbmRDb3cnLFxuICAnU2FiZXJ0b290aCBUaWdlcic6ICdTYWJlclRvb3RoVGlnZXInLFxuICAnTW9ieSBEaWNrJzogJ01vY2hhRGljaycsXG4gICdDaGltZXJhIEdvYXQnOiAnQ2hpbWVyYUdvYXQnLFxuICAnQ2hpbWVyYSBMaW9uJzogJ0NoaW1lcmFMaW9uJyxcbiAgJ0NoaW1lcmEgU25ha2UnOiAnQ2hpbWVyYVNuYWtlJyxcbiAgQ3JhY2tlZEVnZzogJ0VnZ0xhZENyYWNrZWQnLFxuICAnRmFrZSBOZXNzaWUnOiAnRmFrZU5lc3NpZScsXG4gICdUYW5kIGFuZCBUYW5kJzogJ1Rob3JHb2F0cycsXG59O1xuXG5leHBvcnQgY29uc3QgcGVya05hbWVPdmVycmlkZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIENvcm5jb2I6ICdDb3JuJyxcbiAgJ0Nha2UgU2xpY2UnOiAnQmlydGhkYXlDYWtlU2xpY2UnLFxuICAnUGVhbnV0IEJ1dHRlcic6ICdQZWFudXRCdXR0ZXInLFxuICAnTWFuYSBQb3Rpb24nOiAnTWFuYVBvdGlvbicsXG4gICdGYWludCBCcmVhZCc6ICdEZWFkQnJlYWQnLFxuICBLaXdpZnJ1aXQ6ICdLaXdpJyxcbiAgRWdncGxhbnQ6ICdFZ2dQbGFudCcsXG4gIFJpY2U6ICdSaWNlQmFsbCcsXG4gIERvbnV0OiAnRG91Z2hudXQnLFxuICBDaGVycnk6ICdDaGVycmllcycsXG4gICdNZWxvbiBTbGljZSc6ICdXYXRlck1lbG9uJyxcbiAgQ29sZDogJ0Zyb3plbicsXG4gIENyaXNwOiAnQnVybicsXG4gIERhemVkOiAnRGVhZicsXG4gIElja3k6ICdBY2lkJyxcbiAgSW5rZWQ6ICdJbmsnLFxuICBTcG9va2VkOiAnU2NhcmVkJyxcbiAgU2xlZXB5OiAnRHJvd3N5JyxcbiAgV2ViYmVkOiAnV2ViJyxcbiAgQ3Vyc2VkOiAnQ3Vyc2UnLFxuICBTaWxseTogJ1NpbGx5JyxcbiAgQmxvYXRlZDogJ0Jsb2F0ZWQnLFxufTtcbmNvbnN0IHBlcmtOYW1lT3ZlcnJpZGVzTG93ZXIgPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gIE9iamVjdC5lbnRyaWVzKHBlcmtOYW1lT3ZlcnJpZGVzKS5tYXAoKFtrZXksIHZhbHVlXSkgPT4gW1xuICAgIGtleS50b0xvd2VyQ2FzZSgpLFxuICAgIHZhbHVlLFxuICBdKSxcbik7XG5cbmNvbnN0IG5vcm1hbGl6ZSA9IChuYW1lOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICBpZiAoIW5hbWUpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgcmV0dXJuIG5hbWUucmVwbGFjZSgvW15hLXpBLVowLTldL2csICcnKTtcbn07XG5cbmNvbnN0IGJ1aWxkTmFtZUlkTWFwID0gKGVudHJpZXM6IE5hbWVJZEVudHJ5W10pOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0+IHtcbiAgY29uc3QgbWFwID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgZm9yIChjb25zdCBlbnRyeSBvZiBlbnRyaWVzKSB7XG4gICAgaWYgKGVudHJ5Py5OYW1lICYmIGVudHJ5Py5OYW1lSWQpIHtcbiAgICAgIG1hcC5zZXQoZW50cnkuTmFtZSwgZW50cnkuTmFtZUlkKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG1hcDtcbn07XG5cbmNvbnN0IGZvcm1hdEFiaWxpdHlUZXh0ID0gKFxuICBhYmlsaXRpZXM/OiBBYmlsaXR5RW50cnlbXSxcbiAgcGVya05vdGU/OiBzdHJpbmcsXG4pOiBzdHJpbmcgfCBudWxsID0+IHtcbiAgY29uc3QgaXNOb0FiaWxpdHlUZXh0ID0gKHRleHQ/OiBzdHJpbmcpOiBib29sZWFuID0+XG4gICAgIXRleHQgfHwgL15ubyBhYmlsaXR5XFwuPyQvaS50ZXN0KHRleHQudHJpbSgpKTtcblxuICBjb25zdCBsaW5lczogc3RyaW5nW10gPSBbXTtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYWJpbGl0aWVzKSkge1xuICAgIGZvciAoY29uc3QgYWJpbGl0eSBvZiBhYmlsaXRpZXMpIHtcbiAgICAgIGlmICghYWJpbGl0eT8uQWJvdXQgfHwgaXNOb0FiaWxpdHlUZXh0KGFiaWxpdHkuQWJvdXQpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKGFiaWxpdHkuTGV2ZWwgIT0gbnVsbCkge1xuICAgICAgICBsaW5lcy5wdXNoKGBMdiR7YWJpbGl0eS5MZXZlbH06ICR7YWJpbGl0eS5BYm91dH1gKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpbmVzLnB1c2goYWJpbGl0eS5BYm91dCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmIChwZXJrTm90ZSkge1xuICAgIGxpbmVzLnB1c2gocGVya05vdGUpO1xuICB9XG4gIHJldHVybiBsaW5lcy5sZW5ndGggPyBsaW5lcy5qb2luKCdcXG4nKSA6IG51bGw7XG59O1xuXG5jb25zdCBwZXROYW1lSWRzID0gYnVpbGROYW1lSWRNYXAoXG4gIChwZXRzSnNvbiBhcyB1bmtub3duIGFzIHsgZGVmYXVsdD86IE5hbWVJZEVudHJ5W10gfSkuZGVmYXVsdCA/P1xuICAgIChwZXRzSnNvbiBhcyB1bmtub3duIGFzIE5hbWVJZEVudHJ5W10pID8/XG4gICAgW10sXG4pO1xuY29uc3QgcGV0SWRCeU5hbWUgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuY29uc3QgcGV0SWRFbnRyaWVzID1cbiAgKHBldHNKc29uIGFzIHVua25vd24gYXMgeyBkZWZhdWx0PzogQXJyYXk8TmFtZUlkRW50cnkgJiB7IElkPzogc3RyaW5nIH0+IH0pXG4gICAgLmRlZmF1bHQgPz9cbiAgKHBldHNKc29uIGFzIHVua25vd24gYXMgQXJyYXk8TmFtZUlkRW50cnkgJiB7IElkPzogc3RyaW5nIH0+KSA/P1xuICBbXTtcbmZvciAoY29uc3QgZW50cnkgb2YgcGV0SWRFbnRyaWVzKSB7XG4gIGlmICghZW50cnk/Lk5hbWUgfHwgIWVudHJ5Py5JZCkge1xuICAgIGNvbnRpbnVlO1xuICB9XG4gIHBldElkQnlOYW1lLnNldChlbnRyeS5OYW1lLCBlbnRyeS5JZCk7XG59XG5jb25zdCBwZXRBYmlsaXR5TWFwID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbmNvbnN0IHBldEFiaWxpdHlFbnRyaWVzID1cbiAgKHBldHNKc29uIGFzIHVua25vd24gYXMgeyBkZWZhdWx0PzogUGV0QWJpbGl0eUVudHJ5W10gfSkuZGVmYXVsdCA/P1xuICAocGV0c0pzb24gYXMgdW5rbm93biBhcyBQZXRBYmlsaXR5RW50cnlbXSkgPz9cbiAgW107XG5mb3IgKGNvbnN0IGVudHJ5IG9mIHBldEFiaWxpdHlFbnRyaWVzKSB7XG4gIGlmICghZW50cnk/Lk5hbWUpIHtcbiAgICBjb250aW51ZTtcbiAgfVxuICBjb25zdCBhYmlsaXR5VGV4dCA9IGZvcm1hdEFiaWxpdHlUZXh0KGVudHJ5LkFiaWxpdGllcywgZW50cnkuUGVya05vdGUpO1xuICBpZiAoYWJpbGl0eVRleHQpIHtcbiAgICBwZXRBYmlsaXR5TWFwLnNldChlbnRyeS5OYW1lLCBhYmlsaXR5VGV4dCk7XG4gIH1cbn1cbmNvbnN0IHBldE5hbWVzID0gZ2V0TmFtZUxpc3QoXG4gIChwZXRzSnNvbiBhcyB1bmtub3duIGFzIHsgZGVmYXVsdD86IE5hbWVJZEVudHJ5W10gfSkuZGVmYXVsdCA/P1xuICAgIChwZXRzSnNvbiBhcyB1bmtub3duIGFzIE5hbWVJZEVudHJ5W10pID8/XG4gICAgW10sXG4pO1xuY29uc3QgdG95TmFtZUlkcyA9IGJ1aWxkTmFtZUlkTWFwKFxuICAodG95c0pzb24gYXMgdW5rbm93biBhcyB7IGRlZmF1bHQ/OiBOYW1lSWRFbnRyeVtdIH0pLmRlZmF1bHQgPz9cbiAgICAodG95c0pzb24gYXMgdW5rbm93biBhcyBOYW1lSWRFbnRyeVtdKSA/P1xuICAgIFtdLFxuKTtcbmNvbnN0IHRveUFiaWxpdHlNYXAgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuY29uc3QgdG95QWJpbGl0eUVudHJpZXMgPVxuICAodG95c0pzb24gYXMgdW5rbm93biBhcyB7IGRlZmF1bHQ/OiBUb3lBYmlsaXR5RW50cnlbXSB9KS5kZWZhdWx0ID8/XG4gICh0b3lzSnNvbiBhcyB1bmtub3duIGFzIFRveUFiaWxpdHlFbnRyeVtdKSA/P1xuICBbXTtcbmZvciAoY29uc3QgZW50cnkgb2YgdG95QWJpbGl0eUVudHJpZXMpIHtcbiAgaWYgKCFlbnRyeT8uTmFtZSkge1xuICAgIGNvbnRpbnVlO1xuICB9XG4gIGNvbnN0IGFiaWxpdHlUZXh0ID0gZm9ybWF0QWJpbGl0eVRleHQoZW50cnkuQWJpbGl0aWVzKTtcbiAgaWYgKGFiaWxpdHlUZXh0KSB7XG4gICAgdG95QWJpbGl0eU1hcC5zZXQoZW50cnkuTmFtZSwgYWJpbGl0eVRleHQpO1xuICB9XG59XG5jb25zdCB0b3lOYW1lcyA9IGdldE5hbWVMaXN0KFxuICAodG95c0pzb24gYXMgdW5rbm93biBhcyB7IGRlZmF1bHQ/OiBOYW1lSWRFbnRyeVtdIH0pLmRlZmF1bHQgPz9cbiAgICAodG95c0pzb24gYXMgdW5rbm93biBhcyBOYW1lSWRFbnRyeVtdKSA/P1xuICAgIFtdLFxuKTtcbmNvbnN0IGVxdWlwbWVudE5hbWVJZHMgPSBidWlsZE5hbWVJZE1hcChcbiAgKHBlcmtzSnNvbiBhcyB1bmtub3duIGFzIHsgZGVmYXVsdD86IE5hbWVJZEVudHJ5W10gfSkuZGVmYXVsdCA/P1xuICAgIChwZXJrc0pzb24gYXMgdW5rbm93biBhcyBOYW1lSWRFbnRyeVtdKSA/P1xuICAgIFtdLFxuKTtcbmNvbnN0IGVxdWlwbWVudE5hbWVJZHNMb3dlciA9IG5ldyBNYXAoXG4gIEFycmF5LmZyb20oZXF1aXBtZW50TmFtZUlkcy5lbnRyaWVzKCkpLm1hcCgoW2tleSwgdmFsdWVdKSA9PiBbXG4gICAga2V5LnRvTG93ZXJDYXNlKCksXG4gICAgdmFsdWUsXG4gIF0pLFxuKTtcbmNvbnN0IGVxdWlwbWVudE5hbWVJZHNOb3JtYWxpemVkID0gbmV3IE1hcChcbiAgQXJyYXkuZnJvbShlcXVpcG1lbnROYW1lSWRzLmVudHJpZXMoKSkubWFwKChba2V5LCB2YWx1ZV0pID0+IFtcbiAgICBub3JtYWxpemUoa2V5KSxcbiAgICB2YWx1ZSxcbiAgXSksXG4pO1xuY29uc3QgZXF1aXBtZW50QWJpbGl0eU1hcCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG5jb25zdCBlcXVpcG1lbnRBYmlsaXR5RW50cmllcyA9XG4gIChwZXJrc0pzb24gYXMgdW5rbm93biBhcyB7IGRlZmF1bHQ/OiBFcXVpcG1lbnRBYmlsaXR5RW50cnlbXSB9KS5kZWZhdWx0ID8/XG4gIChwZXJrc0pzb24gYXMgdW5rbm93biBhcyBFcXVpcG1lbnRBYmlsaXR5RW50cnlbXSkgPz9cbiAgW107XG5mb3IgKGNvbnN0IGVudHJ5IG9mIGVxdWlwbWVudEFiaWxpdHlFbnRyaWVzKSB7XG4gIGlmICghZW50cnk/Lk5hbWUpIHtcbiAgICBjb250aW51ZTtcbiAgfVxuICBpZiAoZW50cnkuQWJpbGl0eSkge1xuICAgIGVxdWlwbWVudEFiaWxpdHlNYXAuc2V0KGVudHJ5Lk5hbWUsIGVudHJ5LkFiaWxpdHkpO1xuICB9XG59XG5jb25zdCBlcXVpcG1lbnROYW1lcyA9IGdldE5hbWVMaXN0KFxuICAocGVya3NKc29uIGFzIHVua25vd24gYXMgeyBkZWZhdWx0PzogTmFtZUlkRW50cnlbXSB9KS5kZWZhdWx0ID8/XG4gICAgKHBlcmtzSnNvbiBhcyB1bmtub3duIGFzIE5hbWVJZEVudHJ5W10pID8/XG4gICAgW10sXG4pO1xuXG5leHBvcnQgZnVuY3Rpb24gdG9Bc3NldEZpbGVOYW1lKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBub3JtYWxpemUobmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQZXRJY29uRmlsZU5hbWUocGV0TmFtZT86IHN0cmluZyk6IHN0cmluZyB8IG51bGwge1xuICBpZiAoIXBldE5hbWUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBjb25zdCBuYW1lSWQgPSBwZXROYW1lSWRzLmdldChwZXROYW1lKTtcbiAgaWYgKG5hbWVJZCkge1xuICAgIHJldHVybiBuYW1lSWQ7XG4gIH1cbiAgY29uc3QgbWFwcGVkID0gcGV0TmFtZU92ZXJyaWRlc1twZXROYW1lXTtcbiAgaWYgKG1hcHBlZCkge1xuICAgIHJldHVybiBtYXBwZWQ7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQZXRJY29uUGF0aChwZXROYW1lPzogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IGZpbGVOYW1lID0gZ2V0UGV0SWNvbkZpbGVOYW1lKHBldE5hbWUpO1xuICBpZiAoIWZpbGVOYW1lKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIGBhc3NldHMvYXJ0L1B1YmxpYy9QdWJsaWMvUGV0cy8ke2ZpbGVOYW1lfS5wbmdgO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGV0QWJpbGl0eVRleHQocGV0TmFtZT86IHN0cmluZyk6IHN0cmluZyB8IG51bGwge1xuICBpZiAoIXBldE5hbWUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gcGV0QWJpbGl0eU1hcC5nZXQocGV0TmFtZSkgPz8gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBldFNvdW5kTG9va3VwSW5mbyhcbiAgcGV0TmFtZT86IHN0cmluZyxcbik6IHsgbmFtZUlkOiBzdHJpbmcgfCBudWxsOyBwZXRJZDogc3RyaW5nIHwgbnVsbCB9IHwgbnVsbCB7XG4gIGlmICghcGV0TmFtZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiB7XG4gICAgbmFtZUlkOiBwZXROYW1lSWRzLmdldChwZXROYW1lKSA/PyBudWxsLFxuICAgIHBldElkOiBwZXRJZEJ5TmFtZS5nZXQocGV0TmFtZSkgPz8gbnVsbCxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFsbFBldE5hbWVzKCk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIFsuLi5wZXROYW1lc107XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUb3lJY29uUGF0aCh0b3lOYW1lPzogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gIGlmICghdG95TmFtZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGNvbnN0IG5hbWVJZCA9IHRveU5hbWVJZHMuZ2V0KHRveU5hbWUpO1xuICBjb25zdCBmaWxlTmFtZSA9IG5hbWVJZCA/PyBub3JtYWxpemUodG95TmFtZSk7XG4gIGlmICghZmlsZU5hbWUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gYGFzc2V0cy9hcnQvUHVibGljL1B1YmxpYy9Ub3lzLyR7ZmlsZU5hbWV9LnBuZ2A7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUb3lBYmlsaXR5VGV4dCh0b3lOYW1lPzogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gIGlmICghdG95TmFtZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiB0b3lBYmlsaXR5TWFwLmdldCh0b3lOYW1lKSA/PyBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsVG95TmFtZXMoKTogc3RyaW5nW10ge1xuICByZXR1cm4gWy4uLnRveU5hbWVzXTtcbn1cblxuY29uc3QgZ2V0RXF1aXBtZW50RmlsZU5hbWUgPSAoZXF1aXBtZW50TmFtZT86IHN0cmluZyk6IHN0cmluZyB8IG51bGwgPT4ge1xuICBpZiAoIWVxdWlwbWVudE5hbWUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplKGVxdWlwbWVudE5hbWUpO1xuICBjb25zdCBuYW1lSWQgPVxuICAgIGVxdWlwbWVudE5hbWVJZHMuZ2V0KGVxdWlwbWVudE5hbWUpID8/XG4gICAgZXF1aXBtZW50TmFtZUlkc0xvd2VyLmdldChlcXVpcG1lbnROYW1lLnRvTG93ZXJDYXNlKCkpID8/XG4gICAgZXF1aXBtZW50TmFtZUlkc05vcm1hbGl6ZWQuZ2V0KG5vcm1hbGl6ZWQpO1xuICBjb25zdCBvdmVycmlkZSA9XG4gICAgcGVya05hbWVPdmVycmlkZXNbZXF1aXBtZW50TmFtZV0gPz9cbiAgICBwZXJrTmFtZU92ZXJyaWRlc0xvd2VyW2VxdWlwbWVudE5hbWUudG9Mb3dlckNhc2UoKV07XG4gIGNvbnN0IGZpbGVOYW1lID0gbmFtZUlkID8/IG92ZXJyaWRlID8/IG5vcm1hbGl6ZWQ7XG4gIHJldHVybiBmaWxlTmFtZSB8fCBudWxsO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVxdWlwbWVudEljb25QYXRoKFxuICBlcXVpcG1lbnROYW1lPzogc3RyaW5nLFxuICBpc0FpbG1lbnQgPSBmYWxzZSxcbik6IHN0cmluZyB8IG51bGwge1xuICBjb25zdCBmaWxlTmFtZSA9IGdldEVxdWlwbWVudEZpbGVOYW1lKGVxdWlwbWVudE5hbWUpO1xuICBpZiAoIWZpbGVOYW1lKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgaWYgKGlzQWlsbWVudCkge1xuICAgIHJldHVybiBgYXNzZXRzL2FydC9BaWxtZW50cy9BaWxtZW50cy8ke2ZpbGVOYW1lfS5wbmdgO1xuICB9XG4gIHJldHVybiBgYXNzZXRzL2FydC9QdWJsaWMvUHVibGljL0Zvb2QvJHtmaWxlTmFtZX0ucG5nYDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVxdWlwbWVudEFiaWxpdHlUZXh0KGVxdWlwbWVudE5hbWU/OiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgaWYgKCFlcXVpcG1lbnROYW1lKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIGVxdWlwbWVudEFiaWxpdHlNYXAuZ2V0KGVxdWlwbWVudE5hbWUpID8/IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBbGxFcXVpcG1lbnROYW1lcygpOiBzdHJpbmdbXSB7XG4gIHJldHVybiBbLi4uZXF1aXBtZW50TmFtZXNdO1xufVxuXG5jb25zdCBwYWNrTmFtZVRvUGV0TWFwOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICBUdXJ0bGU6ICdUdXJ0bGUnLFxuICBHb2xkZW46ICdHb2xkZW4gUmV0cmlldmVyJyxcbiAgUHVwcHk6ICdQdXBweScsXG4gIFN0YXI6ICdTdGFyZmlzaCcsXG4gIFVuaWNvcm46ICdVbmljb3JuJyxcbiAgRGFuZ2VyOiAnQmx1ZSBXaGFsZScsXG4gIEN1c3RvbTogJ1doaXRlIFRpZ2VyJyxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYWNrSWNvblBhdGgocGFja05hbWU/OiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgaWYgKCFwYWNrTmFtZSB8fCBwYWNrTmFtZSA9PT0gJ0FkZCBDdXN0b20gUGFjaycpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBjb25zdCBwZXROYW1lID0gcGFja05hbWVUb1BldE1hcFtwYWNrTmFtZV07XG4gIGlmIChwZXROYW1lKSB7XG4gICAgcmV0dXJuIGdldFBldEljb25QYXRoKHBldE5hbWUpO1xuICB9XG4gIC8vIEZvciBjdXN0b20gcGFja3MgKHVzZXItY3JlYXRlZCksIHVzZSBXaGl0ZSBUaWdlciBhcyBkZWZhdWx0XG4gIHJldHVybiBnZXRQZXRJY29uUGF0aCgnV2hpdGUgVGlnZXInKTtcbn1cbiIsICJleHBvcnQgY29uc3QgRVFVSVBNRU5UX0NBVEVHT1JJRVM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nW10gfSA9IHtcbiAgVHVydGxlOiBbXG4gICAgJ0JyZWFkJyxcbiAgICAnQ2FrZScsXG4gICAgJ0NoaWxpJyxcbiAgICAnQ29jb251dCcsXG4gICAgJ0dhcmxpYycsXG4gICAgJ0hvbmV5JyxcbiAgICAnTWVhdCBCb25lJyxcbiAgICAnTWVsb24nLFxuICAgICdNdXNocm9vbScsXG4gICAgJ1BlYW51dCcsXG4gICAgJ1N0ZWFrJyxcbiAgXSxcbiAgUHVwcHk6IFtcbiAgICAnQmxhY2tiZXJyeScsXG4gICAgJ0Nyb2lzc2FudCcsXG4gICAgJ0VnZycsXG4gICAgJ0V1Y2FseXB0dXMnLFxuICAgICdMZW1vbicsXG4gICAgJ0xpbWUnLFxuICAgICdNaWxkIENoaWxpJyxcbiAgICAnUGFuY2FrZXMnLFxuICAgICdQaWUnLFxuICAgICdSaWNlJyxcbiAgICAnU2FsdCcsXG4gICAgJ1NrZXdlcicsXG4gICAgJ1NxdWFzaCcsXG4gICAgJ1dhbG51dCcsXG4gIF0sXG4gIFN0YXI6IFtcbiAgICAnQmFndWV0dGUnLFxuICAgICdDYXJhbWVsJyxcbiAgICAnQ2Fycm90JyxcbiAgICAnQ2hlZXNlJyxcbiAgICAnQ3VjdW1iZXInLFxuICAgICdHcmFwZXMnLFxuICAgICdQZXBwZXInLFxuICAgICdQb3Bjb3JuJyxcbiAgICAnU2Vhd2VlZCcsXG4gICAgJ1N0cmF3YmVycnknLFxuICBdLFxuICBHb2xkZW46IFtcbiAgICAnQmFuYW5hJyxcbiAgICAnQm9rIENob3knLFxuICAgICdDaGVycnknLFxuICAgICdDaG9jb2xhdGUgQ2FrZScsXG4gICAgJ0R1cmlhbicsXG4gICAgJ0VnZ3BsYW50JyxcbiAgICAnRmlnJyxcbiAgICAnSG9uZXlkZXcgTWVsb24nLFxuICAgICdNYXBsZSBTeXJ1cCcsXG4gICAgJ09uaW9uJyxcbiAgICAnUGl0YSBCcmVhZCcsXG4gICAgJ1BvdGF0bycsXG4gICAgJ1RvbWF0bycsXG4gIF0sXG4gIFVuaWNvcm46IFtcbiAgICAnQW1icm9zaWEnLFxuICAgICdFYXN0ZXIgRWdnJyxcbiAgICAnRmFpbnQgQnJlYWQnLFxuICAgICdGYWlyeSBEdXN0JyxcbiAgICAnR2luZ2VyYnJlYWQgTWFuJyxcbiAgICAnR29sZGVuIEVnZycsXG4gICAgJ0hlYWx0aCBQb3Rpb24nLFxuICAgICdMb3ZlIFBvdGlvbicsXG4gICAgJ01hZ2ljIEJlYW5zJyxcbiAgICAnUmFtYnV0YW4nLFxuICAgICdZZ2dkcmFzaWwgRnJ1aXQnLFxuICBdLFxuICBEYW5nZXI6IFtcbiAgICAnQ29jb2EgQmVhbicsXG4gICAgJ0NvZCBSb2UnLFxuICAgICdHcm9zIE1pY2hlbCBCYW5hbmEnLFxuICAgICdHZWVjaGVlIFJlZCBQZWEnLFxuICAgICdTdWRkdXRoIFRvbWF0bycsXG4gICAgJ1doaXRlIE9rcmEnLFxuICAgICdXaGl0ZSBUcnVmZmxlJyxcbiAgXSxcbiAgQ3VzdG9tOiBbXG4gICAgJ0JsdWViZXJyeScsXG4gICAgJ0JydXNzZWxzIFNwcm91dCcsXG4gICAgJ0Nhc2hldyBOdXQnLFxuICAgICdDYXVsaWZsb3dlcicsXG4gICAgJ0NodXJyb3MnLFxuICAgICdEb251dCcsXG4gICAgJ0ZvcnR1bmUgQ29va2llJyxcbiAgICAnR3VhdmEnLFxuICAgICdLaXdhbm8nLFxuICAgICdLaXdpZnJ1aXQnLFxuICAgICdNYWNhcm9uJyxcbiAgICAnTWVsb24gU2xpY2UnLFxuICAgICdOYWNob3MnLFxuICAgICdPeXN0ZXIgTXVzaHJvb20nLFxuICAgICdQaW5lYXBwbGUnLFxuICAgICdSYWRpc2gnLFxuICAgICdTYXJkaW5pYW4gQ3VycmFudCcsXG4gICAgJ1NhdXNhZ2UnLFxuICAgICdVbmFnaScsXG4gIF0sXG4gIEhpZGRlbjogWydDYWtlIFNsaWNlJywgJ1BlYW51dCBCdXR0ZXInXSxcbn07XG5cbmV4cG9ydCBjb25zdCBBSUxNRU5UX0NBVEVHT1JJRVM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nW10gfSA9IHtcbiAgQWlsbWVudHM6IFtcbiAgICAnQmxvYXRlZCcsXG4gICAgJ0NvbGQnLFxuICAgICdDb25mdXNlZCcsXG4gICAgJ0Nvd2FyZGx5JyxcbiAgICAnQ3Jpc3AnLFxuICAgICdDdXJzZWQnLFxuICAgICdEYXplZCcsXG4gICAgJ0lja3knLFxuICAgICdJbmtlZCcsXG4gICAgJ1NhZCcsXG4gICAgJ1NpbGx5JyxcbiAgICAnU2xlZXB5JyxcbiAgICAnU3Bvb2tlZCcsXG4gICAgJ1Rhc3R5JyxcbiAgICAnVG9hc3R5JyxcbiAgICAnV2VhaycsXG4gICAgJ1dlYmJlZCcsXG4gIF0sXG59O1xuIiwgImltcG9ydCB7XG4gIGdldEVxdWlwbWVudEljb25QYXRoLFxuICBnZXRQZXRJY29uUGF0aCxcbiAgZ2V0VG95SWNvblBhdGgsXG59IGZyb20gJ2FwcC9ydW50aW1lL2Fzc2V0LWNhdGFsb2cnO1xuXG5leHBvcnQgdHlwZSBJbmxpbmVJY29uVHlwZSA9ICdwZXQnIHwgJ3RveScgfCAnZXF1aXBtZW50JztcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTmFtZVJlZ2V4KG5hbWVzOiBzdHJpbmdbXSk6IFJlZ0V4cCB8IG51bGwge1xuICBjb25zdCBlc2NhcGVkID0gbmFtZXNcbiAgICAuZmlsdGVyKChuYW1lKSA9PiBCb29sZWFuKG5hbWUpKVxuICAgIC5zb3J0KChhLCBiKSA9PiBiLmxlbmd0aCAtIGEubGVuZ3RoKVxuICAgIC5tYXAoKG5hbWUpID0+IGVzY2FwZVJlZ0V4cChuYW1lKSk7XG4gIGlmICghZXNjYXBlZC5sZW5ndGgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gbmV3IFJlZ0V4cChcbiAgICBgKD88IVtBLVphLXowLTldKSgke2VzY2FwZWQuam9pbignfCcpfSkoPyFbQS1aYS16MC05XSlgLFxuICAgICdnJyxcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkSW5saW5lTmFtZVR5cGVNYXAoXG4gIHBldE5hbWVzOiBzdHJpbmdbXSxcbiAgdG95TmFtZXM6IHN0cmluZ1tdLFxuICBlcXVpcG1lbnROYW1lczogc3RyaW5nW10sXG4pOiBNYXA8c3RyaW5nLCBJbmxpbmVJY29uVHlwZT4ge1xuICBjb25zdCBtYXAgPSBuZXcgTWFwPHN0cmluZywgSW5saW5lSWNvblR5cGU+KCk7XG4gIGZvciAoY29uc3QgbmFtZSBvZiBlcXVpcG1lbnROYW1lcykge1xuICAgIGlmIChuYW1lKSB7XG4gICAgICBtYXAuc2V0KG5hbWUsICdlcXVpcG1lbnQnKTtcbiAgICB9XG4gIH1cbiAgZm9yIChjb25zdCBuYW1lIG9mIHRveU5hbWVzKSB7XG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIG1hcC5zZXQobmFtZSwgJ3RveScpO1xuICAgIH1cbiAgfVxuICBmb3IgKGNvbnN0IG5hbWUgb2YgcGV0TmFtZXMpIHtcbiAgICBpZiAobmFtZSkge1xuICAgICAgbWFwLnNldChuYW1lLCAncGV0Jyk7XG4gICAgfVxuICB9XG4gIHJldHVybiBtYXA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZElubGluZU5hbWVSZWdleChcbiAgcGV0TmFtZXM6IHN0cmluZ1tdLFxuICB0b3lOYW1lczogc3RyaW5nW10sXG4gIGVxdWlwbWVudE5hbWVzOiBzdHJpbmdbXSxcbik6IFJlZ0V4cCB8IG51bGwge1xuICBjb25zdCBjb21iaW5lZCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBwZXROYW1lcy5mb3JFYWNoKChuYW1lKSA9PiBuYW1lICYmIGNvbWJpbmVkLmFkZChuYW1lKSk7XG4gIHRveU5hbWVzLmZvckVhY2goKG5hbWUpID0+IG5hbWUgJiYgY29tYmluZWQuYWRkKG5hbWUpKTtcbiAgZXF1aXBtZW50TmFtZXMuZm9yRWFjaCgobmFtZSkgPT4gbmFtZSAmJiBjb21iaW5lZC5hZGQobmFtZSkpO1xuICByZXR1cm4gYnVpbGROYW1lUmVnZXgoQXJyYXkuZnJvbShjb21iaW5lZCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVjb3JhdGVJbmxpbmVJY29ucyhcbiAgbWVzc2FnZTogc3RyaW5nLFxuICBpbmxpbmVOYW1lUmVnZXg6IFJlZ0V4cCB8IG51bGwsXG4gIGlubGluZU5hbWVUeXBlTWFwOiBNYXA8c3RyaW5nLCBJbmxpbmVJY29uVHlwZT4sXG4gIGFpbG1lbnROYW1lczogU2V0PHN0cmluZz4sXG4pOiBzdHJpbmcge1xuICBpZiAoIW1lc3NhZ2UgfHwgbWVzc2FnZS5pbmNsdWRlcygnPGltZycpIHx8ICFpbmxpbmVOYW1lUmVnZXgpIHtcbiAgICByZXR1cm4gbWVzc2FnZTtcbiAgfVxuICBsZXQgdXBkYXRlZCA9IHJlcGxhY2VNYXRjaGVzV2l0aEljb25zT3V0c2lkZVRhZ3MoXG4gICAgbWVzc2FnZSxcbiAgICBpbmxpbmVOYW1lUmVnZXgsXG4gICAgKG5hbWUpID0+IGdldElubGluZUljb25QYXRoKG5hbWUsIGlubGluZU5hbWVUeXBlTWFwLCBhaWxtZW50TmFtZXMpLFxuICAgIChuYW1lKSA9PiBnZXRJbmxpbmVJY29uSHRtbChuYW1lLCBpbmxpbmVOYW1lVHlwZU1hcCwgYWlsbWVudE5hbWVzKSxcbiAgKTtcbiAgY29uc3QgbWFuYUljb24gPVxuICAgICdhc3NldHMvYXJ0L1B1YmxpYy9QdWJsaWMvSWNvbnMvVGV4dE1hcC1yZXNvdXJjZXMuYXNzZXRzLTMxLXNwbGl0L21hbmEucG5nJztcbiAgY29uc3QgbWFuYVJlZ2V4ID0gLyg/PCFbQS1aYS16MC05XSltYW5hKD8hW0EtWmEtejAtOV0pKD8hXFxzK1BvdGlvbikvZ2k7XG4gIHVwZGF0ZWQgPSByZXBsYWNlTWF0Y2hlc1dpdGhJY29uc091dHNpZGVUYWdzKHVwZGF0ZWQsIG1hbmFSZWdleCwgKCkgPT4gbWFuYUljb24pO1xuICBjb25zdCBleHBJY29uID1cbiAgICAnYXNzZXRzL2FydC9QdWJsaWMvUHVibGljL0ljb25zL1RleHRNYXAtcmVzb3VyY2VzLmFzc2V0cy0zMS1zcGxpdC94cC5wbmcnO1xuICBjb25zdCBleHBSZWdleCA9IC8oPzwhW0EtWmEtejAtOV0pKD86eHB8ZXhwKSg/IVtBLVphLXowLTldKS9naTtcbiAgdXBkYXRlZCA9IHJlcGxhY2VNYXRjaGVzV2l0aEljb25zT3V0c2lkZVRhZ3ModXBkYXRlZCwgZXhwUmVnZXgsICgpID0+IGV4cEljb24pO1xuICBjb25zdCBnb2xkSWNvbiA9XG4gICAgJ2Fzc2V0cy9hcnQvUHVibGljL1B1YmxpYy9JY29ucy9UZXh0TWFwLXJlc291cmNlcy5hc3NldHMtMzEtc3BsaXQvZ29sZC5wbmcnO1xuICBjb25zdCBnb2xkUmVnZXggPSAvKD88IVtBLVphLXowLTldKWdvbGQoPyFbQS1aYS16MC05XSkvZ2k7XG4gIHVwZGF0ZWQgPSByZXBsYWNlTWF0Y2hlc1dpdGhJY29uc091dHNpZGVUYWdzKHVwZGF0ZWQsIGdvbGRSZWdleCwgKCkgPT4gZ29sZEljb24pO1xuICBjb25zdCB0cnVtcGV0SWNvbiA9XG4gICAgJ2Fzc2V0cy9hcnQvUHVibGljL1B1YmxpYy9JY29ucy9UZXh0TWFwLXJlc291cmNlcy5hc3NldHMtMzEtc3BsaXQvdHJ1bXBldC5wbmcnO1xuICBjb25zdCB0cnVtcGV0UmVnZXggPSAvKD88IVtBLVphLXowLTldKXRydW1wZXRzPyg/IVtBLVphLXowLTldKS9naTtcbiAgdXBkYXRlZCA9IHJlcGxhY2VNYXRjaGVzV2l0aEljb25zT3V0c2lkZVRhZ3MoXG4gICAgdXBkYXRlZCxcbiAgICB0cnVtcGV0UmVnZXgsXG4gICAgKCkgPT4gdHJ1bXBldEljb24sXG4gICk7XG4gIHJldHVybiB1cGRhdGVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5saW5lSWNvblBhdGgoXG4gIG5hbWU6IHN0cmluZyxcbiAgaW5saW5lTmFtZVR5cGVNYXA6IE1hcDxzdHJpbmcsIElubGluZUljb25UeXBlPixcbiAgYWlsbWVudE5hbWVzOiBTZXQ8c3RyaW5nPixcbik6IHN0cmluZyB8IG51bGwge1xuICBjb25zdCB0eXBlID0gaW5saW5lTmFtZVR5cGVNYXAuZ2V0KG5hbWUpID8/IG51bGw7XG4gIGlmICh0eXBlID09PSAncGV0Jykge1xuICAgIHJldHVybiBnZXRQZXRJY29uUGF0aChuYW1lKTtcbiAgfVxuICBpZiAodHlwZSA9PT0gJ3RveScpIHtcbiAgICByZXR1cm4gZ2V0VG95SWNvblBhdGgobmFtZSk7XG4gIH1cbiAgaWYgKHR5cGUgPT09ICdlcXVpcG1lbnQnKSB7XG4gICAgY29uc3QgaXNBaWxtZW50ID0gYWlsbWVudE5hbWVzLmhhcyhuYW1lKTtcbiAgICByZXR1cm4gKFxuICAgICAgZ2V0RXF1aXBtZW50SWNvblBhdGgobmFtZSwgaXNBaWxtZW50KSA/PyBnZXRFcXVpcG1lbnRJY29uUGF0aChuYW1lLCAhaXNBaWxtZW50KVxuICAgICk7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbmxpbmVJY29uSHRtbChcbiAgbmFtZTogc3RyaW5nLFxuICBpbmxpbmVOYW1lVHlwZU1hcDogTWFwPHN0cmluZywgSW5saW5lSWNvblR5cGU+LFxuICBhaWxtZW50TmFtZXM6IFNldDxzdHJpbmc+LFxuKTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IHR5cGUgPSBpbmxpbmVOYW1lVHlwZU1hcC5nZXQobmFtZSkgPz8gbnVsbDtcbiAgaWYgKHR5cGUgIT09ICdlcXVpcG1lbnQnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgY29uc3QgaXNBaWxtZW50ID0gYWlsbWVudE5hbWVzLmhhcyhuYW1lKTtcbiAgY29uc3QgcHJpbWFyeSA9IGdldEVxdWlwbWVudEljb25QYXRoKG5hbWUsIGlzQWlsbWVudCk7XG4gIGlmICghcHJpbWFyeSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGNvbnN0IHNlY29uZGFyeSA9IGdldEVxdWlwbWVudEljb25QYXRoKG5hbWUsICFpc0FpbG1lbnQpO1xuICBjb25zdCBzZWNvbmRhcnlBdHRyID0gc2Vjb25kYXJ5XG4gICAgPyBgdGhpcy5kYXRhc2V0LnN0ZXA9JzEnO3RoaXMuc3JjPScke3NlY29uZGFyeX0nO2BcbiAgICA6IGB0aGlzLmRhdGFzZXQuc3RlcD0nMSc7YDtcbiAgcmV0dXJuIGA8aW1nIHNyYz1cIiR7cHJpbWFyeX1cIiBjbGFzcz1cImxvZy1pbmxpbmUtaWNvblwiIGFsdD1cIiR7bmFtZX1cIiBvbmVycm9yPVwiaWYoIXRoaXMuZGF0YXNldC5zdGVwKXske3NlY29uZGFyeUF0dHJ9cmV0dXJuO310aGlzLnJlbW92ZSgpO1wiPiAke25hbWV9YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlcGxhY2VNYXRjaGVzV2l0aEljb25zT3V0c2lkZVRhZ3MoXG4gIG1lc3NhZ2U6IHN0cmluZyxcbiAgcmVnZXg6IFJlZ0V4cCxcbiAgZ2V0SWNvbjogKG5hbWU6IHN0cmluZykgPT4gc3RyaW5nIHwgbnVsbCxcbiAgZ2V0SHRtbD86IChuYW1lOiBzdHJpbmcsIGljb246IHN0cmluZyB8IG51bGwpID0+IHN0cmluZyB8IG51bGwsXG4pOiBzdHJpbmcge1xuICByZXR1cm4gbWVzc2FnZVxuICAgIC5zcGxpdCgvKDxbXj5dKz4pL2cpXG4gICAgLm1hcCgoc2VnbWVudCkgPT5cbiAgICAgIHNlZ21lbnQuc3RhcnRzV2l0aCgnPCcpXG4gICAgICAgID8gc2VnbWVudFxuICAgICAgICA6IHJlcGxhY2VNYXRjaGVzV2l0aEljb25zKHNlZ21lbnQsIHJlZ2V4LCBnZXRJY29uLCBnZXRIdG1sKSxcbiAgICApXG4gICAgLmpvaW4oJycpO1xufVxuXG5mdW5jdGlvbiByZXBsYWNlTWF0Y2hlc1dpdGhJY29ucyhcbiAgbWVzc2FnZTogc3RyaW5nLFxuICByZWdleDogUmVnRXhwLFxuICBnZXRJY29uOiAobmFtZTogc3RyaW5nKSA9PiBzdHJpbmcgfCBudWxsLFxuICBnZXRIdG1sPzogKG5hbWU6IHN0cmluZywgaWNvbjogc3RyaW5nIHwgbnVsbCkgPT4gc3RyaW5nIHwgbnVsbCxcbik6IHN0cmluZyB7XG4gIGlmICghcmVnZXgpIHtcbiAgICByZXR1cm4gbWVzc2FnZTtcbiAgfVxuICByZXR1cm4gbWVzc2FnZS5yZXBsYWNlKHJlZ2V4LCAobWF0Y2gpID0+IHtcbiAgICBjb25zdCBpY29uID0gZ2V0SWNvbihtYXRjaCk7XG4gICAgaWYgKGdldEh0bWwpIHtcbiAgICAgIGNvbnN0IGh0bWwgPSBnZXRIdG1sKG1hdGNoLCBpY29uKTtcbiAgICAgIGlmIChodG1sKSB7XG4gICAgICAgIHJldHVybiBodG1sO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWljb24pIHtcbiAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9XG4gICAgcmV0dXJuIGA8aW1nIHNyYz1cIiR7aWNvbn1cIiBjbGFzcz1cImxvZy1pbmxpbmUtaWNvblwiIGFsdD1cIiR7bWF0Y2h9XCIgb25lcnJvcj1cInRoaXMucmVtb3ZlKClcIj4gJHttYXRjaH1gO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZXNjYXBlUmVnRXhwKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gdmFsdWUucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csICdcXFxcJCYnKTtcbn1cbiIsICJpbXBvcnQgeyBMb2cgfSBmcm9tICdhcHAvZG9tYWluL2ludGVyZmFjZXMvbG9nLmludGVyZmFjZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRNZXJnZWRBdHRhY2tIZWFsdGhNZXNzYWdlKFxuICBsYXN0TG9nOiBMb2cgfCB1bmRlZmluZWQsXG4gIG5leHRMb2c6IExvZyxcbik6IHN0cmluZyB8IG51bGwge1xuICBpZiAoIWxhc3RMb2cgfHwgIW5leHRMb2cpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBpZiAobGFzdExvZy5ub0NvbGxhcHNlIHx8IG5leHRMb2cubm9Db2xsYXBzZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGlmIChsYXN0TG9nLnBsYXllciAhPT0gbmV4dExvZy5wbGF5ZXIpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBpZiAobGFzdExvZy50eXBlICE9PSBuZXh0TG9nLnR5cGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBpZiAobGFzdExvZy5yYW5kb21FdmVudCAhPT0gbmV4dExvZy5yYW5kb21FdmVudCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGlmIChsYXN0TG9nLnJhbmRvbUV2ZW50UmVhc29uICE9PSBuZXh0TG9nLnJhbmRvbUV2ZW50UmVhc29uKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgaWYgKFxuICAgIGxhc3RMb2cuc291cmNlUGV0ICE9PSBuZXh0TG9nLnNvdXJjZVBldCB8fFxuICAgIGxhc3RMb2cuc291cmNlSW5kZXggIT09IG5leHRMb2cuc291cmNlSW5kZXhcbiAgKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgaWYgKFxuICAgIGxhc3RMb2cudGFyZ2V0UGV0ICE9PSBuZXh0TG9nLnRhcmdldFBldCB8fFxuICAgIGxhc3RMb2cudGFyZ2V0SW5kZXggIT09IG5leHRMb2cudGFyZ2V0SW5kZXhcbiAgKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgaWYgKGxhc3RMb2cudGlnZXIgIT09IG5leHRMb2cudGlnZXIpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBpZiAobGFzdExvZy5wdW1hICE9PSBuZXh0TG9nLnB1bWEpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBpZiAobGFzdExvZy5wdGVyYW5vZG9uICE9PSBuZXh0TG9nLnB0ZXJhbm9kb24pIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBjb25zdCBsYXN0UGFudGhlciA9IGxhc3RMb2cucGFudGhlck11bHRpcGxpZXIgPz8gbnVsbDtcbiAgY29uc3QgbmV4dFBhbnRoZXIgPSBuZXh0TG9nLnBhbnRoZXJNdWx0aXBsaWVyID8/IG51bGw7XG4gIGlmIChsYXN0UGFudGhlciAhPT0gbmV4dFBhbnRoZXIpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGxhc3RUZXh0ID0gc3RyaXBUYWdzKGxhc3RMb2cucmF3TWVzc2FnZSA/PyBsYXN0TG9nLm1lc3NhZ2UgPz8gJycpO1xuICBjb25zdCBuZXh0VGV4dCA9IHN0cmlwVGFncyhuZXh0TG9nLnJhd01lc3NhZ2UgPz8gbmV4dExvZy5tZXNzYWdlID8/ICcnKTtcbiAgaWYgKCFsYXN0VGV4dCB8fCAhbmV4dFRleHQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBpZiAoXG4gICAgbGFzdFRleHQuaW5jbHVkZXMoJyBhdHRhY2sgYW5kICcpIHx8XG4gICAgbGFzdFRleHQuaW5jbHVkZXMoJyBoZWFsdGggYW5kICcpIHx8XG4gICAgbmV4dFRleHQuaW5jbHVkZXMoJyBhdHRhY2sgYW5kICcpIHx8XG4gICAgbmV4dFRleHQuaW5jbHVkZXMoJyBoZWFsdGggYW5kICcpXG4gICkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICBjb21iaW5lQXR0YWNrSGVhbHRoTG9ncyhsYXN0VGV4dCwgbmV4dFRleHQpID8/XG4gICAgY29tYmluZUF0dGFja0hlYWx0aExvZ3MobmV4dFRleHQsIGxhc3RUZXh0KVxuICApO1xufVxuXG5mdW5jdGlvbiBjb21iaW5lQXR0YWNrSGVhbHRoTG9ncyhcbiAgYXR0YWNrTG9nOiBzdHJpbmcsXG4gIGhlYWx0aExvZzogc3RyaW5nLFxuKTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IGxvc3NBdHRhY2sgPSBwYXJzZVN0YXRMb2coYXR0YWNrTG9nLCAnbG9zdCcsICdhdHRhY2snKTtcbiAgY29uc3QgbG9zc0hlYWx0aCA9IHBhcnNlU3RhdExvZyhoZWFsdGhMb2csICdsb3N0JywgJ2hlYWx0aCcpO1xuICBpZiAobG9zc0F0dGFjayAmJiBsb3NzSGVhbHRoKSB7XG4gICAgaWYgKFxuICAgICAgbG9zc0F0dGFjay5wcmVmaXggPT09IGxvc3NIZWFsdGgucHJlZml4ICYmXG4gICAgICBsb3NzQXR0YWNrLnN1ZmZpeCA9PT0gbG9zc0hlYWx0aC5zdWZmaXhcbiAgICApIHtcbiAgICAgIHJldHVybiBgJHtsb3NzQXR0YWNrLnByZWZpeH0ke2xvc3NBdHRhY2sudmFsdWV9IGF0dGFjayBhbmQgJHtsb3NzSGVhbHRoLnZhbHVlfSBoZWFsdGgke2xvc3NBdHRhY2suc3VmZml4fWA7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZ2FpbkF0dGFjayA9IHBhcnNlU3RhdExvZyhhdHRhY2tMb2csICdnYXZlJywgJ2F0dGFjaycpO1xuICBjb25zdCBnYWluSGVhbHRoID0gcGFyc2VTdGF0TG9nKGhlYWx0aExvZywgJ2dhdmUnLCAnaGVhbHRoJyk7XG4gIGlmIChnYWluQXR0YWNrICYmIGdhaW5IZWFsdGgpIHtcbiAgICBpZiAoXG4gICAgICBnYWluQXR0YWNrLnByZWZpeCA9PT0gZ2FpbkhlYWx0aC5wcmVmaXggJiZcbiAgICAgIGdhaW5BdHRhY2suc3VmZml4ID09PSBnYWluSGVhbHRoLnN1ZmZpeFxuICAgICkge1xuICAgICAgcmV0dXJuIGAke2dhaW5BdHRhY2sucHJlZml4fSR7Z2FpbkF0dGFjay5wbHVzfSR7Z2FpbkF0dGFjay52YWx1ZX0gYXR0YWNrIGFuZCAke2dhaW5IZWFsdGgucGx1c30ke2dhaW5IZWFsdGgudmFsdWV9IGhlYWx0aCR7Z2FpbkF0dGFjay5zdWZmaXh9YDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gcGFyc2VTdGF0TG9nKFxuICBtZXNzYWdlOiBzdHJpbmcsXG4gIHZlcmI6ICdsb3N0JyB8ICdnYXZlJyxcbiAgc3RhdDogJ2F0dGFjaycgfCAnaGVhbHRoJyxcbik6IHsgcHJlZml4OiBzdHJpbmc7IHBsdXM6IHN0cmluZzsgdmFsdWU6IHN0cmluZzsgc3VmZml4OiBzdHJpbmcgfSB8IG51bGwge1xuICBpZiAodmVyYiA9PT0gJ2xvc3QnKSB7XG4gICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKGBeKC4qXFxcXGJsb3N0XFxcXHMrKShcXFxcZCspXFxcXHMrJHtzdGF0fVxcXFxiKC4qKSRgLCAnaScpO1xuICAgIGNvbnN0IG1hdGNoID0gbWVzc2FnZS5tYXRjaChyZWdleCk7XG4gICAgaWYgKCFtYXRjaCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBwcmVmaXg6IG1hdGNoWzFdLFxuICAgICAgcGx1czogJycsXG4gICAgICB2YWx1ZTogbWF0Y2hbMl0sXG4gICAgICBzdWZmaXg6IG1hdGNoWzNdLFxuICAgIH07XG4gIH1cblxuICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoXG4gICAgYF4oLipcXFxcYig/OmdhdmV8Z2l2ZXxnaXZlcylcXFxcYi4qP1xcXFxzKykoXFxcXCs/KShcXFxcZCspXFxcXHMrJHtzdGF0fVxcXFxiKC4qKSRgLFxuICAgICdpJyxcbiAgKTtcbiAgY29uc3QgbWF0Y2ggPSBtZXNzYWdlLm1hdGNoKHJlZ2V4KTtcbiAgaWYgKCFtYXRjaCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiB7XG4gICAgcHJlZml4OiBtYXRjaFsxXSxcbiAgICBwbHVzOiBtYXRjaFsyXSA/PyAnJyxcbiAgICB2YWx1ZTogbWF0Y2hbM10sXG4gICAgc3VmZml4OiBtYXRjaFs0XSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gc3RyaXBUYWdzKG1lc3NhZ2U6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBtZXNzYWdlLnJlcGxhY2UoLzxbXj5dKz4vZywgJycpLnRyaW0oKTtcbn1cbiIsICJpbXBvcnQgeyBQZXQgfSBmcm9tICdhcHAvZG9tYWluL2VudGl0aWVzL3BldC5jbGFzcyc7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICdhcHAvZG9tYWluL2VudGl0aWVzL3BsYXllci5jbGFzcyc7XG5pbXBvcnQgeyBnZXRFcXVpcG1lbnRJY29uUGF0aCwgZ2V0UGV0SWNvblBhdGggfSBmcm9tICdhcHAvcnVudGltZS9hc3NldC1jYXRhbG9nJztcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkQm9hcmRTdGF0ZU1lc3NhZ2UoXG4gIHBsYXllcjogUGxheWVyLFxuICBvcHBvbmVudDogUGxheWVyLFxuICBnZXRGcm9udEluZGV4OiAocGV0OiBQZXQpID0+IG51bWJlciB8IG51bGwsXG4gIGlzQWlsbWVudE5hbWU6IChuYW1lOiBzdHJpbmcpID0+IGJvb2xlYW4sXG4pOiBzdHJpbmcge1xuICBsZXQgcGxheWVyU3RhdGUgPSAnJztcbiAgaWYgKHBsYXllci50b3kpIHtcbiAgICBwbGF5ZXJTdGF0ZSArPSBge3t0b3k6JHtwbGF5ZXIudG95Lm5hbWV9fX0gYDtcbiAgfVxuICBpZiAocGxheWVyLmhhcmRUb3kpIHtcbiAgICBwbGF5ZXJTdGF0ZSArPSBge3toYXJkdG95OiR7cGxheWVyLmhhcmRUb3kubmFtZX19fSBgO1xuICB9XG4gIHBsYXllclN0YXRlICs9IHJlbmRlclBldFRleHQocGxheWVyLnBldDQsIGdldEZyb250SW5kZXgsIGlzQWlsbWVudE5hbWUpO1xuICBwbGF5ZXJTdGF0ZSArPSByZW5kZXJQZXRUZXh0KHBsYXllci5wZXQzLCBnZXRGcm9udEluZGV4LCBpc0FpbG1lbnROYW1lKTtcbiAgcGxheWVyU3RhdGUgKz0gcmVuZGVyUGV0VGV4dChwbGF5ZXIucGV0MiwgZ2V0RnJvbnRJbmRleCwgaXNBaWxtZW50TmFtZSk7XG4gIHBsYXllclN0YXRlICs9IHJlbmRlclBldFRleHQocGxheWVyLnBldDEsIGdldEZyb250SW5kZXgsIGlzQWlsbWVudE5hbWUpO1xuICBwbGF5ZXJTdGF0ZSArPSByZW5kZXJQZXRUZXh0KHBsYXllci5wZXQwLCBnZXRGcm9udEluZGV4LCBpc0FpbG1lbnROYW1lKTtcblxuICBsZXQgb3Bwb25lbnRTdGF0ZSA9ICcnO1xuICBvcHBvbmVudFN0YXRlICs9IHJlbmRlclBldFRleHQob3Bwb25lbnQucGV0MCwgZ2V0RnJvbnRJbmRleCwgaXNBaWxtZW50TmFtZSk7XG4gIG9wcG9uZW50U3RhdGUgKz0gcmVuZGVyUGV0VGV4dChvcHBvbmVudC5wZXQxLCBnZXRGcm9udEluZGV4LCBpc0FpbG1lbnROYW1lKTtcbiAgb3Bwb25lbnRTdGF0ZSArPSByZW5kZXJQZXRUZXh0KG9wcG9uZW50LnBldDIsIGdldEZyb250SW5kZXgsIGlzQWlsbWVudE5hbWUpO1xuICBvcHBvbmVudFN0YXRlICs9IHJlbmRlclBldFRleHQob3Bwb25lbnQucGV0MywgZ2V0RnJvbnRJbmRleCwgaXNBaWxtZW50TmFtZSk7XG4gIG9wcG9uZW50U3RhdGUgKz0gcmVuZGVyUGV0VGV4dChvcHBvbmVudC5wZXQ0LCBnZXRGcm9udEluZGV4LCBpc0FpbG1lbnROYW1lKTtcbiAgaWYgKG9wcG9uZW50LnRveSkge1xuICAgIG9wcG9uZW50U3RhdGUgKz0gYHt7dG95OiR7b3Bwb25lbnQudG95Lm5hbWV9fX0gYDtcbiAgfVxuICBpZiAob3Bwb25lbnQuaGFyZFRveSkge1xuICAgIG9wcG9uZW50U3RhdGUgKz0gYHt7aGFyZHRveToke29wcG9uZW50LmhhcmRUb3kubmFtZX19fSBgO1xuICB9XG5cbiAgcmV0dXJuIGAke3BsYXllclN0YXRlfXwgJHtvcHBvbmVudFN0YXRlfWA7XG59XG5cbmZ1bmN0aW9uIHJlbmRlclBldFRleHQoXG4gIHBldDogUGV0IHwgdW5kZWZpbmVkLFxuICBnZXRGcm9udEluZGV4OiAocGV0OiBQZXQpID0+IG51bWJlciB8IG51bGwsXG4gIGlzQWlsbWVudE5hbWU6IChuYW1lOiBzdHJpbmcpID0+IGJvb2xlYW4sXG4pOiBzdHJpbmcge1xuICBpZiAocGV0ID09IG51bGwpIHtcbiAgICByZXR1cm4gJ19fXyAoLS8tKSAnO1xuICB9XG4gIGNvbnN0IGluZGV4ID0gZ2V0RnJvbnRJbmRleChwZXQpO1xuICBjb25zdCBsYWJlbCA9IGluZGV4ICE9IG51bGwgPyBgJHtwZXQucGFyZW50Py5pc09wcG9uZW50ID8gJ08nIDogJ1AnfSR7aW5kZXh9IGAgOiAnJztcbiAgY29uc3QgaWNvblBhdGggPSBnZXRQZXRJY29uUGF0aChwZXQubmFtZSk7XG4gIGNvbnN0IHBldERpc3BsYXkgPSBpY29uUGF0aFxuICAgID8gYDxpbWcgc3JjPVwiJHtpY29uUGF0aH1cIiBjbGFzcz1cImxvZy1wZXQtaWNvblwiIGFsdD1cIiR7cGV0Lm5hbWV9XCI+YFxuICAgIDogJyc7XG4gIGNvbnN0IGVxdWlwbWVudE5hbWUgPVxuICAgIHR5cGVvZiAocGV0LmVxdWlwbWVudCBhcyB7IG5hbWU/OiBzdHJpbmcgfSk/Lm5hbWUgPT09ICdzdHJpbmcnXG4gICAgICA/IChwZXQuZXF1aXBtZW50IGFzIHsgbmFtZT86IHN0cmluZyB9KS5uYW1lXG4gICAgICA6IG51bGw7XG4gIGNvbnN0IGVxdWlwbWVudERpc3BsYXkgPSBlcXVpcG1lbnROYW1lXG4gICAgPyAoKCkgPT4ge1xuICAgICAgY29uc3QgaXNBaWxtZW50ID0gaXNBaWxtZW50TmFtZShlcXVpcG1lbnROYW1lKTtcbiAgICAgIGNvbnN0IHByaW1hcnkgPVxuICAgICAgICBnZXRFcXVpcG1lbnRJY29uUGF0aChlcXVpcG1lbnROYW1lLCBpc0FpbG1lbnQpID8/XG4gICAgICAgIGdldEVxdWlwbWVudEljb25QYXRoKGVxdWlwbWVudE5hbWUsICFpc0FpbG1lbnQpO1xuICAgICAgaWYgKCFwcmltYXJ5KSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cbiAgICAgIGNvbnN0IHNlY29uZGFyeSA9IGdldEVxdWlwbWVudEljb25QYXRoKGVxdWlwbWVudE5hbWUsICFpc0FpbG1lbnQpO1xuICAgICAgY29uc3Qgc2Vjb25kYXJ5QXR0ciA9IHNlY29uZGFyeVxuICAgICAgICA/IGB0aGlzLmRhdGFzZXQuc3RlcD0nMSc7dGhpcy5zcmM9JyR7c2Vjb25kYXJ5fSc7YFxuICAgICAgICA6IGB0aGlzLmRhdGFzZXQuc3RlcD0nMSc7YDtcbiAgICAgIHJldHVybiBgPGltZyBzcmM9XCIke3ByaW1hcnl9XCIgY2xhc3M9XCJsb2ctaW5saW5lLWljb25cIiBhbHQ9XCIke2VxdWlwbWVudE5hbWV9XCIgb25lcnJvcj1cImlmKCF0aGlzLmRhdGFzZXQuc3RlcCl7JHtzZWNvbmRhcnlBdHRyfXJldHVybjt9dGhpcy5yZW1vdmUoKVwiPmA7XG4gICAgfSkoKVxuICAgIDogJyc7XG4gIGNvbnN0IG1hbmFWYWx1ZSA9IE51bWJlci5pc0Zpbml0ZShwZXQubWFuYSkgPyBNYXRoLm1heCgwLCBNYXRoLnRydW5jKHBldC5tYW5hKSkgOiAwO1xuICBjb25zdCBtYW5hU3VmZml4ID0gbWFuYVZhbHVlID4gMCA/IGAvJHttYW5hVmFsdWV9bWFuYWAgOiAnJztcblxuICByZXR1cm4gYCR7bGFiZWx9JHtwZXREaXNwbGF5fSR7ZXF1aXBtZW50RGlzcGxheX0oJHtwZXQuYXR0YWNrfS8ke3BldC5oZWFsdGh9LyR7cGV0LmV4cH14cCR7bWFuYVN1ZmZpeH0pIGA7XG59XG4iLCAiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTG9nIH0gZnJvbSAnYXBwL2RvbWFpbi9pbnRlcmZhY2VzL2xvZy5pbnRlcmZhY2UnO1xuaW1wb3J0IHtcbiAgZ2V0QWxsRXF1aXBtZW50TmFtZXMsXG4gIGdldEFsbFBldE5hbWVzLFxuICBnZXRBbGxUb3lOYW1lcyxcbn0gZnJvbSAnYXBwL3J1bnRpbWUvYXNzZXQtY2F0YWxvZyc7XG5pbXBvcnQgeyBQZXQgfSBmcm9tICdhcHAvZG9tYWluL2VudGl0aWVzL3BldC5jbGFzcyc7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICdhcHAvZG9tYWluL2VudGl0aWVzL3BsYXllci5jbGFzcyc7XG5pbXBvcnQgeyBBSUxNRU5UX0NBVEVHT1JJRVMgfSBmcm9tICcuL2VxdWlwbWVudC9lcXVpcG1lbnQtY2F0ZWdvcmllcyc7XG5pbXBvcnQge1xuICBidWlsZElubGluZU5hbWVSZWdleCxcbiAgYnVpbGRJbmxpbmVOYW1lVHlwZU1hcCxcbiAgYnVpbGROYW1lUmVnZXgsXG4gIGRlY29yYXRlSW5saW5lSWNvbnMsXG59IGZyb20gJy4vbG9nL2xvZy1pbmxpbmUtaWNvbnMnO1xuaW1wb3J0IHsgZ2V0TWVyZ2VkQXR0YWNrSGVhbHRoTWVzc2FnZSB9IGZyb20gJy4vbG9nL2xvZy1tZXJnZS11dGlscyc7XG5pbXBvcnQgeyBidWlsZEJvYXJkU3RhdGVNZXNzYWdlIH0gZnJvbSAnLi9sb2cvbG9nLWJvYXJkLXJlbmRlcic7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxufSlcbmV4cG9ydCBjbGFzcyBMb2dTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBsb2dzOiBMb2dbXSA9IFtdO1xuICBwcml2YXRlIHBldE5hbWVSZWdleDogUmVnRXhwO1xuICBwcml2YXRlIHRveU5hbWVSZWdleDogUmVnRXhwO1xuICBwcml2YXRlIGVxdWlwbWVudE5hbWVSZWdleDogUmVnRXhwO1xuICBwcml2YXRlIGlubGluZU5hbWVSZWdleDogUmVnRXhwO1xuICBwcml2YXRlIGlubGluZU5hbWVUeXBlTWFwOiBNYXA8c3RyaW5nLCAncGV0JyB8ICd0b3knIHwgJ2VxdWlwbWVudCc+O1xuICBwcml2YXRlIGFpbG1lbnROYW1lczogU2V0PHN0cmluZz47XG4gIHByaXZhdGUgZW5hYmxlZCA9IHRydWU7XG4gIHByaXZhdGUgZGVmZXJEZWNvcmF0aW9ucyA9IGZhbHNlO1xuICBwcml2YXRlIHNob3dUcmlnZ2VyTmFtZXNJbkxvZ3MgPSBmYWxzZTtcbiAgcHJpdmF0ZSBkZWJ1Z1N1bW1vbkJvYXJkU3RhdGVMb2dzID0gZmFsc2U7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGNvbnN0IHBldE5hbWVzID0gZ2V0QWxsUGV0TmFtZXMoKTtcbiAgICBjb25zdCB0b3lOYW1lcyA9IGdldEFsbFRveU5hbWVzKCk7XG4gICAgY29uc3QgZXF1aXBtZW50TmFtZXMgPSBnZXRBbGxFcXVpcG1lbnROYW1lcygpO1xuICAgIHRoaXMucGV0TmFtZVJlZ2V4ID0gYnVpbGROYW1lUmVnZXgocGV0TmFtZXMpO1xuICAgIHRoaXMudG95TmFtZVJlZ2V4ID0gYnVpbGROYW1lUmVnZXgodG95TmFtZXMpO1xuICAgIHRoaXMuZXF1aXBtZW50TmFtZVJlZ2V4ID0gYnVpbGROYW1lUmVnZXgoZXF1aXBtZW50TmFtZXMpO1xuICAgIHRoaXMuaW5saW5lTmFtZVR5cGVNYXAgPSBidWlsZElubGluZU5hbWVUeXBlTWFwKFxuICAgICAgcGV0TmFtZXMsXG4gICAgICB0b3lOYW1lcyxcbiAgICAgIGVxdWlwbWVudE5hbWVzLFxuICAgICk7XG4gICAgdGhpcy5pbmxpbmVOYW1lUmVnZXggPSBidWlsZElubGluZU5hbWVSZWdleChcbiAgICAgIHBldE5hbWVzLFxuICAgICAgdG95TmFtZXMsXG4gICAgICBlcXVpcG1lbnROYW1lcyxcbiAgICApO1xuICAgIHRoaXMuYWlsbWVudE5hbWVzID0gbmV3IFNldChcbiAgICAgIE9iamVjdC52YWx1ZXMoQUlMTUVOVF9DQVRFR09SSUVTKS5mbGF0KCkuZmlsdGVyKEJvb2xlYW4pLFxuICAgICk7XG4gIH1cblxuICBzZXRFbmFibGVkKGVuYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmVuYWJsZWQgPSBCb29sZWFuKGVuYWJsZWQpO1xuICAgIGlmICghdGhpcy5lbmFibGVkKSB7XG4gICAgICB0aGlzLmxvZ3MgPSBbXTtcbiAgICB9XG4gIH1cblxuICBpc0VuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZW5hYmxlZDtcbiAgfVxuXG4gIHNldERlZmVyRGVjb3JhdGlvbnMoZW5hYmxlZDogYm9vbGVhbikge1xuICAgIHRoaXMuZGVmZXJEZWNvcmF0aW9ucyA9IEJvb2xlYW4oZW5hYmxlZCk7XG4gIH1cblxuICBpc0RlZmVyRGVjb3JhdGlvbnMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZGVmZXJEZWNvcmF0aW9ucztcbiAgfVxuXG4gIHNldFNob3dUcmlnZ2VyTmFtZXNJbkxvZ3MoZW5hYmxlZDogYm9vbGVhbikge1xuICAgIHRoaXMuc2hvd1RyaWdnZXJOYW1lc0luTG9ncyA9IEJvb2xlYW4oZW5hYmxlZCk7XG4gIH1cblxuICBpc1Nob3dUcmlnZ2VyTmFtZXNJbkxvZ3MoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc2hvd1RyaWdnZXJOYW1lc0luTG9ncztcbiAgfVxuXG4gIHNldERlYnVnU3VtbW9uQm9hcmRTdGF0ZUxvZ3MoZW5hYmxlZDogYm9vbGVhbikge1xuICAgIHRoaXMuZGVidWdTdW1tb25Cb2FyZFN0YXRlTG9ncyA9IEJvb2xlYW4oZW5hYmxlZCk7XG4gIH1cblxuICBpc0RlYnVnU3VtbW9uQm9hcmRTdGF0ZUxvZ3MoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZGVidWdTdW1tb25Cb2FyZFN0YXRlTG9ncztcbiAgfVxuXG4gIGRlY29yYXRlTG9nSWZOZWVkZWQobG9nOiBMb2cpIHtcbiAgICBpZiAoIWxvZyB8fCBsb2cuZGVjb3JhdGVkIHx8ICFsb2cucmF3TWVzc2FnZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBtZXNzYWdlID0gdGhpcy5kZWNvcmF0ZU1lc3NhZ2VXaXRoTmFtZXMoXG4gICAgICBsb2cucmF3TWVzc2FnZSxcbiAgICAgIGxvZy5zb3VyY2VQZXQsXG4gICAgICBsb2cudGFyZ2V0UGV0LFxuICAgICAgbG9nLnNvdXJjZUluZGV4LFxuICAgICAgbG9nLnRhcmdldEluZGV4LFxuICAgICk7XG4gICAgbG9nLm1lc3NhZ2UgPSBkZWNvcmF0ZUlubGluZUljb25zKFxuICAgICAgbWVzc2FnZSxcbiAgICAgIHRoaXMuaW5saW5lTmFtZVJlZ2V4LFxuICAgICAgdGhpcy5pbmxpbmVOYW1lVHlwZU1hcCxcbiAgICAgIHRoaXMuYWlsbWVudE5hbWVzLFxuICAgICk7XG4gICAgbG9nLmRlY29yYXRlZCA9IHRydWU7XG4gIH1cblxuICBjcmVhdGVMb2cobG9nOiBMb2cpIHtcbiAgICBpZiAoIXRoaXMuZW5hYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAobG9nLm1lc3NhZ2U/LnN0YXJ0c1dpdGgoJ1BoYXNlICcpKSB7XG4gICAgICBsb2cuYm9sZCA9IHRydWU7XG4gICAgfVxuICAgIHRoaXMucmVzb2x2ZUxvZ01ldGFkYXRhKGxvZyk7XG5cbiAgICBsZXQgbWVzc2FnZSA9IHRoaXMuZGVjb3JhdGVMb2dNZXNzYWdlKGxvZyk7XG4gICAgbWVzc2FnZSA9IHRoaXMuYXBwZW5kVGFnU3VmZml4ZXMobWVzc2FnZSwgbG9nKTtcbiAgICB0aGlzLnBlcnNpc3REZWNvcmF0ZWRNZXNzYWdlKGxvZywgbWVzc2FnZSk7XG5cbiAgICBjb25zdCBsYXN0TG9nID0gdGhpcy5sb2dzW3RoaXMubG9ncy5sZW5ndGggLSAxXTtcbiAgICBjb25zdCBzaG91bGRBcHBlbmRTdW1tb25Cb2FyZCA9IHRoaXMuc2hvdWxkQXBwZW5kU3VtbW9uQm9hcmRTdGF0ZShsb2cpO1xuICAgIGlmICh0aGlzLnRyeU1lcmdlQXR0YWNrSGVhbHRoTG9ncyhsYXN0TG9nLCBsb2cpKSB7XG4gICAgICBpZiAoc2hvdWxkQXBwZW5kU3VtbW9uQm9hcmQpIHtcbiAgICAgICAgdGhpcy5hcHBlbmRTdW1tb25Cb2FyZFN0YXRlTG9nKGxvZyk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLnNob3VsZENvbGxhcHNlTG9nKGxhc3RMb2csIGxvZykpIHtcbiAgICAgIGxhc3RMb2cuY291bnQgPSAobGFzdExvZy5jb3VudCA/PyAxKSArIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubG9ncy5wdXNoKGxvZyk7XG4gICAgfVxuXG4gICAgaWYgKHNob3VsZEFwcGVuZFN1bW1vbkJvYXJkKSB7XG4gICAgICB0aGlzLmFwcGVuZFN1bW1vbkJvYXJkU3RhdGVMb2cobG9nKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlc29sdmVMb2dNZXRhZGF0YShsb2c6IExvZyk6IHZvaWQge1xuICAgIGlmICghbG9nLnNvdXJjZVBldCAmJiBsb2cucGxheWVyICYmIGxvZy5tZXNzYWdlKSB7XG4gICAgICBjb25zdCBwb3NzaWJsZVBldHMgPSBsb2cucGxheWVyLnBldEFycmF5LmZpbHRlcihcbiAgICAgICAgKHApID0+IHAgJiYgbG9nLm1lc3NhZ2Uuc3RhcnRzV2l0aChwLm5hbWUpLFxuICAgICAgKTtcbiAgICAgIGlmIChwb3NzaWJsZVBldHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGxvZy5zb3VyY2VQZXQgPSBwb3NzaWJsZVBldHNbMF0gYXMgUGV0O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAobG9nLnR5cGUgPT09ICdhdHRhY2snICYmIGxvZy5wbGF5ZXIgJiYgbG9nLm1lc3NhZ2UpIHtcbiAgICAgIHRoaXMucmVzb2x2ZUF0dGFja1BldHNGcm9tTWVzc2FnZShsb2cpO1xuICAgIH1cbiAgICBpZiAoIWxvZy5yYW5kb21FdmVudFJlYXNvbiAmJiBsb2cucmFuZG9tRXZlbnQgPT09IHRydWUpIHtcbiAgICAgIGxvZy5yYW5kb21FdmVudFJlYXNvbiA9ICd0cnVlLXJhbmRvbSc7XG4gICAgfVxuICAgIGlmIChsb2cucGxheWVyICYmIGxvZy5tZXNzYWdlKSB7XG4gICAgICB0aGlzLnJlc29sdmVTb3VyY2VUYXJnZXRGcm9tTWVzc2FnZShsb2cpO1xuICAgIH1cbiAgICBpZiAobG9nLnNvdXJjZVBldCAmJiBsb2cuc291cmNlSW5kZXggPT0gbnVsbCkge1xuICAgICAgbG9nLnNvdXJjZUluZGV4ID0gdGhpcy5nZXRGcm9udEluZGV4KGxvZy5zb3VyY2VQZXQpID8/IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgaWYgKGxvZy50YXJnZXRQZXQgJiYgbG9nLnRhcmdldEluZGV4ID09IG51bGwpIHtcbiAgICAgIGxvZy50YXJnZXRJbmRleCA9IHRoaXMuZ2V0RnJvbnRJbmRleChsb2cudGFyZ2V0UGV0KSA/PyB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBkZWNvcmF0ZUxvZ01lc3NhZ2UobG9nOiBMb2cpOiBzdHJpbmcge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBsb2cubWVzc2FnZSA/PyAnJztcbiAgICBpZiAodGhpcy5kZWZlckRlY29yYXRpb25zKSB7XG4gICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZGVjb3JhdGVNZXNzYWdlV2l0aE5hbWVzKFxuICAgICAgbWVzc2FnZSxcbiAgICAgIGxvZy5zb3VyY2VQZXQsXG4gICAgICBsb2cudGFyZ2V0UGV0LFxuICAgICAgbG9nLnNvdXJjZUluZGV4LFxuICAgICAgbG9nLnRhcmdldEluZGV4LFxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGFwcGVuZFRhZ1N1ZmZpeGVzKG1lc3NhZ2U6IHN0cmluZywgbG9nOiBMb2cpOiBzdHJpbmcge1xuICAgIGxldCB1cGRhdGVkID0gbWVzc2FnZTtcbiAgICBpZiAobG9nLnRpZ2VyKSB7XG4gICAgICB1cGRhdGVkICs9ICcgKFRpZ2VyKSc7XG4gICAgfVxuICAgIGlmIChsb2cucHVtYSkge1xuICAgICAgdXBkYXRlZCArPSAnIChQdW1hKSc7XG4gICAgfVxuICAgIGlmIChsb2cucHRlcmFub2Rvbikge1xuICAgICAgdXBkYXRlZCArPSAnIChQdGVyYW5vZG9uKSc7XG4gICAgfVxuICAgIGlmIChsb2cucGFudGhlck11bHRpcGxpZXIgIT0gbnVsbCAmJiBsb2cucGFudGhlck11bHRpcGxpZXIgPiAxKSB7XG4gICAgICB1cGRhdGVkICs9IGAgeCR7bG9nLnBhbnRoZXJNdWx0aXBsaWVyfSAoUGFudGhlcilgO1xuICAgIH1cbiAgICByZXR1cm4gdXBkYXRlZDtcbiAgfVxuXG4gIHByaXZhdGUgcGVyc2lzdERlY29yYXRlZE1lc3NhZ2UobG9nOiBMb2csIG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICghbWVzc2FnZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmRlZmVyRGVjb3JhdGlvbnMpIHtcbiAgICAgIGxvZy5yYXdNZXNzYWdlID0gbWVzc2FnZTtcbiAgICAgIGxvZy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICAgIGxvZy5kZWNvcmF0ZWQgPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsb2cubWVzc2FnZSA9IGRlY29yYXRlSW5saW5lSWNvbnMoXG4gICAgICBtZXNzYWdlLFxuICAgICAgdGhpcy5pbmxpbmVOYW1lUmVnZXgsXG4gICAgICB0aGlzLmlubGluZU5hbWVUeXBlTWFwLFxuICAgICAgdGhpcy5haWxtZW50TmFtZXMsXG4gICAgKTtcbiAgICBsb2cuZGVjb3JhdGVkID0gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgc2hvdWxkQ29sbGFwc2VMb2cobGFzdExvZzogTG9nIHwgdW5kZWZpbmVkLCBsb2c6IExvZyk6IGxhc3RMb2cgaXMgTG9nIHtcbiAgICBpZiAoIWxhc3RMb2cpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGxhc3RMb2cubm9Db2xsYXBzZSB8fCBsb2cubm9Db2xsYXBzZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHNhbWVQbGF5ZXIgPSBsYXN0TG9nLnBsYXllciA9PT0gbG9nLnBsYXllcjtcbiAgICBjb25zdCBzYW1lTWVzc2FnZSA9IGxhc3RMb2cubWVzc2FnZT8udHJpbSgpID09PSBsb2cubWVzc2FnZT8udHJpbSgpO1xuICAgIGNvbnN0IHNhbWVSYW5kb20gPSBsYXN0TG9nLnJhbmRvbUV2ZW50ID09PSBsb2cucmFuZG9tRXZlbnQ7XG4gICAgY29uc3Qgc2FtZVJhbmRvbVJlYXNvbiA9XG4gICAgICBsYXN0TG9nLnJhbmRvbUV2ZW50UmVhc29uID09PSBsb2cucmFuZG9tRXZlbnRSZWFzb247XG4gICAgY29uc3Qgc2FtZVNvdXJjZSA9XG4gICAgICBsYXN0TG9nLnNvdXJjZVBldCA9PT0gbG9nLnNvdXJjZVBldCAmJlxuICAgICAgbGFzdExvZy5zb3VyY2VJbmRleCA9PT0gbG9nLnNvdXJjZUluZGV4O1xuICAgIGNvbnN0IHNhbWVUYXJnZXQgPVxuICAgICAgbGFzdExvZy50YXJnZXRQZXQgPT09IGxvZy50YXJnZXRQZXQgJiZcbiAgICAgIGxhc3RMb2cudGFyZ2V0SW5kZXggPT09IGxvZy50YXJnZXRJbmRleDtcbiAgICBjb25zdCBoYXNTb3VyY2VPclRhcmdldCA9XG4gICAgICBsb2cuc291cmNlUGV0ICE9IG51bGwgfHxcbiAgICAgIGxvZy50YXJnZXRQZXQgIT0gbnVsbCB8fFxuICAgICAgbG9nLnNvdXJjZUluZGV4ICE9IG51bGwgfHxcbiAgICAgIGxvZy50YXJnZXRJbmRleCAhPSBudWxsO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIHNhbWVNZXNzYWdlICYmXG4gICAgICBzYW1lUGxheWVyICYmXG4gICAgICBzYW1lUmFuZG9tICYmXG4gICAgICBzYW1lUmFuZG9tUmVhc29uICYmXG4gICAgICAoIWhhc1NvdXJjZU9yVGFyZ2V0IHx8IChzYW1lU291cmNlICYmIHNhbWVUYXJnZXQpKVxuICAgICk7XG4gIH1cblxuICBnZXRMb2dzKCkge1xuICAgIHJldHVybiB0aGlzLmxvZ3M7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmxvZ3MgPSBbXTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RnJvbnRJbmRleChwZXQ6IFBldCk6IG51bWJlciB8IG51bGwge1xuICAgIGNvbnN0IHBhcmVudCA9IHBldD8ucGFyZW50O1xuICAgIGlmICghcGFyZW50KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKHBhcmVudC5wZXQwID09PSBwZXQpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH1cbiAgICBpZiAocGFyZW50LnBldDEgPT09IHBldCkge1xuICAgICAgcmV0dXJuIDI7XG4gICAgfVxuICAgIGlmIChwYXJlbnQucGV0MiA9PT0gcGV0KSB7XG4gICAgICByZXR1cm4gMztcbiAgICB9XG4gICAgaWYgKHBhcmVudC5wZXQzID09PSBwZXQpIHtcbiAgICAgIHJldHVybiA0O1xuICAgIH1cbiAgICBpZiAocGFyZW50LnBldDQgPT09IHBldCkge1xuICAgICAgcmV0dXJuIDU7XG4gICAgfVxuICAgIGlmIChOdW1iZXIuaXNGaW5pdGUocGV0LnNhdmVkUG9zaXRpb24pKSB7XG4gICAgICByZXR1cm4gcGV0LnNhdmVkUG9zaXRpb24gKyAxO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgZGVjb3JhdGVNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZywgcGV0OiBQZXQpOiBzdHJpbmcge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5nZXRGcm9udEluZGV4KHBldCk7XG4gICAgaWYgKGluZGV4ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgIH1cbiAgICBjb25zdCBsYWJlbCA9IHBldC5wYXJlbnQ/LmlzT3Bwb25lbnQgPyAnTycgOiAnUCc7XG4gICAgY29uc3QgZnVsbExhYmVsID0gYCR7bGFiZWx9JHtpbmRleH0gJHtwZXQubmFtZX1gO1xuICAgIHJldHVybiB0aGlzLnJlcGxhY2VGaXJzdChtZXNzYWdlLCBwZXQubmFtZSwgZnVsbExhYmVsKTtcbiAgfVxuXG4gIHByaXZhdGUgZGVjb3JhdGVBdHRhY2tNZXNzYWdlKFxuICAgIG1lc3NhZ2U6IHN0cmluZyxcbiAgICBzb3VyY2VQZXQ6IFBldCxcbiAgICB0YXJnZXRQZXQ6IFBldCxcbiAgICBzb3VyY2VJbmRleE92ZXJyaWRlPzogbnVtYmVyLFxuICAgIHRhcmdldEluZGV4T3ZlcnJpZGU/OiBudW1iZXIsXG4gICk6IHN0cmluZyB7XG4gICAgY29uc3Qgc291cmNlSW5kZXggPVxuICAgICAgc291cmNlSW5kZXhPdmVycmlkZSA/PyB0aGlzLmdldEZyb250SW5kZXgoc291cmNlUGV0KTtcbiAgICBjb25zdCB0YXJnZXRJbmRleCA9XG4gICAgICB0YXJnZXRJbmRleE92ZXJyaWRlID8/IHRoaXMuZ2V0RnJvbnRJbmRleCh0YXJnZXRQZXQpO1xuICAgIGlmIChzb3VyY2VJbmRleCA9PSBudWxsIHx8IHRhcmdldEluZGV4ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgIH1cblxuICAgIGNvbnN0IHNvdXJjZUxhYmVsID0gc291cmNlUGV0LnBhcmVudD8uaXNPcHBvbmVudCA/ICdPJyA6ICdQJztcbiAgICBjb25zdCB0YXJnZXRMYWJlbCA9IHRhcmdldFBldC5wYXJlbnQ/LmlzT3Bwb25lbnQgPyAnTycgOiAnUCc7XG5cbiAgICBjb25zdCBzb3VyY2VGdWxsTGFiZWwgPSBgJHtzb3VyY2VMYWJlbH0ke3NvdXJjZUluZGV4fSAke3NvdXJjZVBldC5uYW1lfWA7XG4gICAgY29uc3QgdGFyZ2V0RnVsbExhYmVsID0gYCR7dGFyZ2V0TGFiZWx9JHt0YXJnZXRJbmRleH0gJHt0YXJnZXRQZXQubmFtZX1gO1xuXG4gICAgLy8gSWYgbmFtZXMgYXJlIHRoZSBzYW1lLCB3ZSBtdXN0IHVzZSB1bmlxdWUgdG9rZW5zIGR1cmluZyByZXBsYWNlbWVudCB0byBhdm9pZCByZWN1cnNpb24vY2xvYmJlcmluZ1xuICAgIGNvbnN0IFNPVVJDRV9IT0xERVIgPSAnX19fU09VUkNFX0hPTERFUl9fXyc7XG4gICAgY29uc3QgVEFSR0VUX0hPTERFUiA9ICdfX19UQVJHRVRfSE9MREVSX19fJztcblxuICAgIGxldCB1cGRhdGVkID0gdGhpcy5yZXBsYWNlRmlyc3QobWVzc2FnZSwgc291cmNlUGV0Lm5hbWUsIFNPVVJDRV9IT0xERVIpO1xuICAgIHVwZGF0ZWQgPSB0aGlzLnJlcGxhY2VGaXJzdCh1cGRhdGVkLCB0YXJnZXRQZXQubmFtZSwgVEFSR0VUX0hPTERFUik7XG5cbiAgICB1cGRhdGVkID0gdXBkYXRlZC5yZXBsYWNlKFNPVVJDRV9IT0xERVIsIHNvdXJjZUZ1bGxMYWJlbCk7XG4gICAgdXBkYXRlZCA9IHVwZGF0ZWQucmVwbGFjZShUQVJHRVRfSE9MREVSLCB0YXJnZXRGdWxsTGFiZWwpO1xuXG4gICAgcmV0dXJuIHVwZGF0ZWQ7XG4gIH1cblxuICBwcml2YXRlIGRlY29yYXRlTWVzc2FnZVdpdGhOYW1lcyhcbiAgICBtZXNzYWdlOiBzdHJpbmcsXG4gICAgc291cmNlUGV0PzogUGV0LFxuICAgIHRhcmdldFBldD86IFBldCxcbiAgICBzb3VyY2VJbmRleD86IG51bWJlcixcbiAgICB0YXJnZXRJbmRleD86IG51bWJlcixcbiAgKTogc3RyaW5nIHtcbiAgICBpZiAoIW1lc3NhZ2UpIHtcbiAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgIH1cbiAgICBpZiAoc291cmNlUGV0ICYmIHRhcmdldFBldCkge1xuICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGVBdHRhY2tNZXNzYWdlKFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICBzb3VyY2VQZXQsXG4gICAgICAgIHRhcmdldFBldCxcbiAgICAgICAgc291cmNlSW5kZXgsXG4gICAgICAgIHRhcmdldEluZGV4LFxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKHNvdXJjZVBldCkge1xuICAgICAgaWYgKHNvdXJjZUluZGV4ICE9IG51bGwpIHtcbiAgICAgICAgY29uc3QgbGFiZWwgPSBzb3VyY2VQZXQucGFyZW50Py5pc09wcG9uZW50ID8gJ08nIDogJ1AnO1xuICAgICAgICBjb25zdCBmdWxsTGFiZWwgPSBgJHtsYWJlbH0ke3NvdXJjZUluZGV4fSAke3NvdXJjZVBldC5uYW1lfWA7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VGaXJzdChtZXNzYWdlLCBzb3VyY2VQZXQubmFtZSwgZnVsbExhYmVsKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlTWVzc2FnZShtZXNzYWdlLCBzb3VyY2VQZXQpO1xuICAgIH1cbiAgICByZXR1cm4gbWVzc2FnZTtcbiAgfVxuXG4gIHByaXZhdGUgcmVwbGFjZUZpcnN0KFxuICAgIHNvdXJjZTogc3RyaW5nLFxuICAgIHNlYXJjaDogc3RyaW5nLFxuICAgIHJlcGxhY2VtZW50OiBzdHJpbmcsXG4gICk6IHN0cmluZyB7XG4gICAgY29uc3QgaW5kZXggPSBzb3VyY2UuaW5kZXhPZihzZWFyY2gpO1xuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHJldHVybiBzb3VyY2U7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICBzb3VyY2Uuc2xpY2UoMCwgaW5kZXgpICsgcmVwbGFjZW1lbnQgKyBzb3VyY2Uuc2xpY2UoaW5kZXggKyBzZWFyY2gubGVuZ3RoKVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIHJlc29sdmVBdHRhY2tQZXRzRnJvbU1lc3NhZ2UobG9nOiBMb2cpOiB2b2lkIHtcbiAgICBpZiAoIWxvZz8ubWVzc2FnZSB8fCAhbG9nLnBsYXllcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAobG9nLnNvdXJjZVBldCAmJiBsb2cudGFyZ2V0UGV0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG1lc3NhZ2UgPSBsb2cubWVzc2FnZTtcbiAgICBjb25zdCBzbmlwZWRNYXRjaCA9IC9eKC4rPylcXHMrc25pcGVkXFxzKyguKz8pXFxzK2ZvclxccysvaS5leGVjKG1lc3NhZ2UpO1xuICAgIGNvbnN0IGF0dGFja01hdGNoID1cbiAgICAgIC9eKC4rPylcXHMrKD86anVtcC0pP2F0dGFja3M/XFxzKyguKz8pXFxzK2ZvclxccysvaS5leGVjKG1lc3NhZ2UpO1xuICAgIGNvbnN0IG1hdGNoID0gc25pcGVkTWF0Y2ggPz8gYXR0YWNrTWF0Y2g7XG4gICAgaWYgKCFtYXRjaCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzb3VyY2VOYW1lID0gbWF0Y2hbMV0udHJpbSgpO1xuICAgIGNvbnN0IHRhcmdldE5hbWUgPSBtYXRjaFsyXS50cmltKCk7XG4gICAgY29uc3QgcGxheWVyUGV0cyA9IGxvZy5wbGF5ZXIucGV0QXJyYXkgPz8gW107XG4gICAgY29uc3Qgb3Bwb25lbnRQZXRzID0gbG9nLnBsYXllci5vcHBvbmVudD8ucGV0QXJyYXkgPz8gW107XG5cbiAgICBpZiAoIWxvZy5zb3VyY2VQZXQpIHtcbiAgICAgIGxvZy5zb3VyY2VQZXQgPVxuICAgICAgICBwbGF5ZXJQZXRzLmZpbmQoKHBldCkgPT4gcGV0Py5uYW1lID09PSBzb3VyY2VOYW1lKSA/PyBudWxsO1xuICAgIH1cbiAgICBpZiAoIWxvZy50YXJnZXRQZXQpIHtcbiAgICAgIGxvZy50YXJnZXRQZXQgPVxuICAgICAgICBvcHBvbmVudFBldHMuZmluZCgocGV0KSA9PiBwZXQ/Lm5hbWUgPT09IHRhcmdldE5hbWUpID8/XG4gICAgICAgIHBsYXllclBldHMuZmluZCgocGV0KSA9PiBwZXQ/Lm5hbWUgPT09IHRhcmdldE5hbWUpID8/XG4gICAgICAgIG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpc0FpbG1lbnROYW1lKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmFpbG1lbnROYW1lcy5oYXMobmFtZSk7XG4gIH1cblxuICBwcml2YXRlIHJlc29sdmVTb3VyY2VUYXJnZXRGcm9tTWVzc2FnZShsb2c6IExvZyk6IHZvaWQge1xuICAgIGlmIChsb2cuc291cmNlUGV0ICYmIGxvZy50YXJnZXRQZXQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbWVzc2FnZSA9IGxvZy5tZXNzYWdlO1xuICAgIGlmICghbWVzc2FnZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBuYW1lcyA9IHRoaXMuZXh0cmFjdFBldE5hbWVzKG1lc3NhZ2UpO1xuICAgIGlmIChuYW1lcy5sZW5ndGggPCAyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcGxheWVyUGV0cyA9IGxvZy5wbGF5ZXI/LnBldEFycmF5ID8/IFtdO1xuICAgIGNvbnN0IG9wcG9uZW50UGV0cyA9IGxvZy5wbGF5ZXI/Lm9wcG9uZW50Py5wZXRBcnJheSA/PyBbXTtcblxuICAgIGNvbnN0IGZpbmRQZXQgPSAoXG4gICAgICBwZXRzOiBQZXRbXSxcbiAgICAgIG5hbWU6IHN0cmluZyxcbiAgICAgIGV4Y2x1ZGU/OiBQZXQgfCBudWxsLFxuICAgICk6IFBldCB8IG51bGwgPT5cbiAgICAgIHBldHMuZmluZCgocGV0KSA9PiBwZXQ/Lm5hbWUgPT09IG5hbWUgJiYgcGV0ICE9PSBleGNsdWRlKSA/PyBudWxsO1xuXG4gICAgaWYgKCFsb2cuc291cmNlUGV0KSB7XG4gICAgICBsb2cuc291cmNlUGV0ID1cbiAgICAgICAgZmluZFBldChwbGF5ZXJQZXRzLCBuYW1lc1swXSkgPz8gZmluZFBldChvcHBvbmVudFBldHMsIG5hbWVzWzBdKTtcbiAgICB9XG5cbiAgICBpZiAoIWxvZy50YXJnZXRQZXQpIHtcbiAgICAgIGlmIChuYW1lc1sxXSA9PT0gbmFtZXNbMF0pIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZVN0YXJ0c1dpdGhTb3VyY2UgPVxuICAgICAgICAgIGxvZy5zb3VyY2VQZXQgJiYgbWVzc2FnZS5zdGFydHNXaXRoKGxvZy5zb3VyY2VQZXQubmFtZSk7XG4gICAgICAgIGlmIChtZXNzYWdlU3RhcnRzV2l0aFNvdXJjZSAmJiBsb2cuc291cmNlUGV0KSB7XG4gICAgICAgICAgLy8gUHJlZmVyIHNlbGYtdGFyZ2V0IHdoZW4gdGhlIG1lc3NhZ2UgYmVnaW5zIHdpdGggdGhlIHNvdXJjZSBuYW1lIGFuZCB0aGUgbmFtZXMgbWF0Y2guXG4gICAgICAgICAgbG9nLnRhcmdldFBldCA9IGxvZy5zb3VyY2VQZXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9nLnRhcmdldFBldCA9XG4gICAgICAgICAgICBmaW5kUGV0KHBsYXllclBldHMsIG5hbWVzWzFdLCBsb2cuc291cmNlUGV0KSA/P1xuICAgICAgICAgICAgZmluZFBldChvcHBvbmVudFBldHMsIG5hbWVzWzFdLCBsb2cuc291cmNlUGV0KSA/P1xuICAgICAgICAgICAgbG9nLnNvdXJjZVBldCA/P1xuICAgICAgICAgICAgbnVsbDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9nLnRhcmdldFBldCA9XG4gICAgICAgICAgZmluZFBldChvcHBvbmVudFBldHMsIG5hbWVzWzFdKSA/PyBmaW5kUGV0KHBsYXllclBldHMsIG5hbWVzWzFdKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGV4dHJhY3RQZXROYW1lcyhtZXNzYWdlOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgaWYgKCF0aGlzLnBldE5hbWVSZWdleCB8fCAhbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBjb25zdCBtYXRjaGVzID0gbWVzc2FnZS5tYXRjaCh0aGlzLnBldE5hbWVSZWdleCk7XG4gICAgcmV0dXJuIG1hdGNoZXMgPz8gW107XG4gIH1cblxuICBwcml2YXRlIHRyeU1lcmdlQXR0YWNrSGVhbHRoTG9ncyhcbiAgICBsYXN0TG9nOiBMb2cgfCB1bmRlZmluZWQsXG4gICAgbmV4dExvZzogTG9nLFxuICApOiBib29sZWFuIHtcbiAgICBjb25zdCBjb21iaW5lZCA9IGdldE1lcmdlZEF0dGFja0hlYWx0aE1lc3NhZ2UobGFzdExvZywgbmV4dExvZyk7XG4gICAgaWYgKCFjb21iaW5lZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmRlZmVyRGVjb3JhdGlvbnMpIHtcbiAgICAgIGxhc3RMb2cucmF3TWVzc2FnZSA9IGNvbWJpbmVkO1xuICAgICAgbGFzdExvZy5tZXNzYWdlID0gY29tYmluZWQ7XG4gICAgICBsYXN0TG9nLmRlY29yYXRlZCA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBkZWNvcmF0ZWQgPSB0aGlzLmRlY29yYXRlTWVzc2FnZVdpdGhOYW1lcyhcbiAgICAgICAgY29tYmluZWQsXG4gICAgICAgIGxhc3RMb2cuc291cmNlUGV0LFxuICAgICAgICBsYXN0TG9nLnRhcmdldFBldCxcbiAgICAgICAgbGFzdExvZy5zb3VyY2VJbmRleCxcbiAgICAgICAgbGFzdExvZy50YXJnZXRJbmRleCxcbiAgICAgICk7XG4gICAgICBsYXN0TG9nLm1lc3NhZ2UgPSBkZWNvcmF0ZUlubGluZUljb25zKFxuICAgICAgICBkZWNvcmF0ZWQsXG4gICAgICAgIHRoaXMuaW5saW5lTmFtZVJlZ2V4LFxuICAgICAgICB0aGlzLmlubGluZU5hbWVUeXBlTWFwLFxuICAgICAgICB0aGlzLmFpbG1lbnROYW1lcyxcbiAgICAgICk7XG4gICAgICBsYXN0TG9nLmRlY29yYXRlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwcml2YXRlIHNob3VsZEFwcGVuZFN1bW1vbkJvYXJkU3RhdGUobG9nOiBMb2cpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMuZGVidWdTdW1tb25Cb2FyZFN0YXRlTG9ncykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIWxvZz8ubWVzc2FnZSB8fCBsb2cudHlwZSA9PT0gJ2JvYXJkJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIWxvZy5wbGF5ZXIgfHwgIWxvZy5wbGF5ZXIub3Bwb25lbnQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIC9cXGIoc3VtbW9uZWR8c3Bhd25lZClcXGJ8Xk5vIHJvb20gdG8gc3Bhd25cXGIvaS50ZXN0KGxvZy5tZXNzYWdlKTtcbiAgfVxuXG4gIHByaXZhdGUgYXBwZW5kU3VtbW9uQm9hcmRTdGF0ZUxvZyhsb2c6IExvZyk6IHZvaWQge1xuICAgIGNvbnN0IHBsYXllciA9IGxvZy5wbGF5ZXI7XG4gICAgY29uc3Qgb3Bwb25lbnQgPSBsb2cucGxheWVyPy5vcHBvbmVudDtcbiAgICBpZiAoIXBsYXllciB8fCAhb3Bwb25lbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmxvZ3MucHVzaCh7XG4gICAgICBtZXNzYWdlOiB0aGlzLmJ1aWxkUGxhaW5Cb2FyZFN0YXRlTWVzc2FnZShwbGF5ZXIsIG9wcG9uZW50KSxcbiAgICAgIHR5cGU6ICdib2FyZCcsXG4gICAgICBwbGF5ZXIsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGJ1aWxkUGxhaW5Cb2FyZFN0YXRlTWVzc2FnZShwbGF5ZXI6IFBsYXllciwgb3Bwb25lbnQ6IFBsYXllcik6IHN0cmluZyB7XG4gICAgY29uc3QgcGxheWVyU3RhdGUgPSBbXG4gICAgICBwbGF5ZXIucGV0NCxcbiAgICAgIHBsYXllci5wZXQzLFxuICAgICAgcGxheWVyLnBldDIsXG4gICAgICBwbGF5ZXIucGV0MSxcbiAgICAgIHBsYXllci5wZXQwLFxuICAgIF1cbiAgICAgIC5tYXAoKHBldCkgPT4gdGhpcy5yZW5kZXJQbGFpblBldFRleHQocGV0KSlcbiAgICAgIC5qb2luKCcgJyk7XG5cbiAgICBjb25zdCBvcHBvbmVudFN0YXRlID0gW1xuICAgICAgb3Bwb25lbnQucGV0MCxcbiAgICAgIG9wcG9uZW50LnBldDEsXG4gICAgICBvcHBvbmVudC5wZXQyLFxuICAgICAgb3Bwb25lbnQucGV0MyxcbiAgICAgIG9wcG9uZW50LnBldDQsXG4gICAgXVxuICAgICAgLm1hcCgocGV0KSA9PiB0aGlzLnJlbmRlclBsYWluUGV0VGV4dChwZXQpKVxuICAgICAgLmpvaW4oJyAnKTtcblxuICAgIHJldHVybiBgJHtwbGF5ZXJTdGF0ZX0gfCAke29wcG9uZW50U3RhdGV9YDtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyUGxhaW5QZXRUZXh0KHBldDogUGV0IHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gICAgaWYgKCFwZXQpIHtcbiAgICAgIHJldHVybiAnX19fICgtLy0pJztcbiAgICB9XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmdldEZyb250SW5kZXgocGV0KTtcbiAgICBjb25zdCBsYWJlbCA9IGluZGV4ICE9IG51bGwgPyBgJHtwZXQucGFyZW50Py5pc09wcG9uZW50ID8gJ08nIDogJ1AnfSR7aW5kZXh9YCA6ICdQPyc7XG4gICAgcmV0dXJuIGAke2xhYmVsfSAke3BldC5uYW1lfSgke3BldC5hdHRhY2t9LyR7cGV0LmhlYWx0aH0vJHtwZXQuZXhwfXhwKWA7XG4gIH1cblxuICBwcmludFN0YXRlKHBsYXllcjogUGxheWVyLCBvcHBvbmVudDogUGxheWVyLCBtZXNzYWdlPzogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLmVuYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgIHRoaXMuY3JlYXRlTG9nKHtcbiAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICAgICAgdHlwZTogJ2JvYXJkJyxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdCBib2FyZE1lc3NhZ2UgPSBidWlsZEJvYXJkU3RhdGVNZXNzYWdlKFxuICAgICAgcGxheWVyLFxuICAgICAgb3Bwb25lbnQsXG4gICAgICAocGV0KSA9PiB0aGlzLmdldEZyb250SW5kZXgocGV0KSxcbiAgICAgIChuYW1lKSA9PiB0aGlzLmlzQWlsbWVudE5hbWUobmFtZSksXG4gICAgKTtcblxuICAgIHRoaXMuY3JlYXRlTG9nKHtcbiAgICAgIG1lc3NhZ2U6IGJvYXJkTWVzc2FnZSxcbiAgICAgIHR5cGU6ICdib2FyZCcsXG4gICAgfSk7XG4gIH1cbn1cblxuXG5cbiIsICJpbXBvcnQgeyBDYWxjdWxhdG9yQmF0dGxlRW5naW5lIH0gZnJvbSAnLi4vc3JjL2FwcC9pbnRlZ3JhdGlvbnMvc2ltdWxhdGlvbi9iYXR0bGUtZW5naW5lJztcbmltcG9ydCB7IHJ1bkhlYWRsZXNzU2ltdWxhdGlvbiBhcyBlbmdpbmVIZWFkbGVzc1NpbXVsYXRpb24gfSBmcm9tICdzYXAtYmF0dGxlLWVuZ2luZSc7XG5pbXBvcnQge1xuICBTaW11bGF0aW9uQ29uZmlnLFxuICBTaW11bGF0aW9uUmVzdWx0LFxufSBmcm9tICcuLi9zcmMvYXBwL2RvbWFpbi9pbnRlcmZhY2VzL3NpbXVsYXRpb24tY29uZmlnLmludGVyZmFjZSc7XG5pbXBvcnQge1xuICBwYXJzZVRlYW13b29kUmVwbGF5Rm9yQ2FsY3VsYXRvcixcbiAgUmVwbGF5QWN0aW9uc0NvbnRhaW5lckpzb24sXG4gIFJlcGxheUJvdFR1cm5zQ29udGFpbmVySnNvbixcbiAgUmVwbGF5Q2FsY3VsYXRvclN0YXRlLFxuICBSZXBsYXlNZXRhQm9hcmRzLFxuICBSZXBsYXlQYXJzZU9wdGlvbnMsXG4gIFJlcGxheUNhbGNQYXJzZXIsXG59IGZyb20gJy4uL3NyYy9hcHAvaW50ZWdyYXRpb25zL3JlcGxheS9yZXBsYXktY2FsYy1wYXJzZXInO1xuaW1wb3J0IHtcbiAgUG9zaXRpb25pbmdPcHRpbWl6YXRpb25SZXN1bHQsXG4gIFBvc2l0aW9uaW5nT3B0aW1pemF0aW9uU2lkZSxcbiAgcnVuUG9zaXRpb25pbmdPcHRpbWl6YXRpb24sXG59IGZyb20gJy4uL3NyYy9hcHAvaW50ZWdyYXRpb25zL3NpbXVsYXRpb24vcG9zaXRpb25pbmctb3B0aW1pemVyJztcbmltcG9ydCB7XG4gIEJvYXJkU3RyZW5ndGhQcmVjaXNpb24sXG4gIEJvYXJkU3RyZW5ndGhSZXN1bHQsXG4gIHJ1bkJvYXJkU3RyZW5ndGhFdmFsdWF0aW9uLFxufSBmcm9tICcuLi9zcmMvYXBwL2ludGVncmF0aW9ucy9zaW11bGF0aW9uL2JvYXJkLXN0cmVuZ3RoLWV2YWx1YXRvcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBydW5TaW11bGF0aW9uKGNvbmZpZzogU2ltdWxhdGlvbkNvbmZpZyk6IFNpbXVsYXRpb25SZXN1bHQge1xuICByZXR1cm4gbmV3IENhbGN1bGF0b3JCYXR0bGVFbmdpbmUoKS5ydW4oY29uZmlnKTtcbn1cbmV4cG9ydCB7IGVuZ2luZUhlYWRsZXNzU2ltdWxhdGlvbiBhcyBydW5IZWFkbGVzc1NpbXVsYXRpb24gfTtcbmV4cG9ydCB0eXBlIHsgSGVhZGxlc3NTaW11bGF0aW9uT3B0aW9ucyB9IGZyb20gJ3NhcC1iYXR0bGUtZW5naW5lJztcblxuZXhwb3J0IHR5cGUgUmVwbGF5UGF5bG9hZEpzb24gPVxuICB8IFJlcGxheUFjdGlvbnNDb250YWluZXJKc29uXG4gIHwgUmVwbGF5Qm90VHVybnNDb250YWluZXJKc29uO1xuXG5mdW5jdGlvbiB0b051bWJlck9yRmFsbGJhY2sodmFsdWU6IHVua25vd24sIGZhbGxiYWNrOiBudW1iZXIpOiBudW1iZXIge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBOdW1iZXIuaXNGaW5pdGUodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHZhbHVlLnRyaW0oKS5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgcGFyc2VkID0gTnVtYmVyKHZhbHVlKTtcbiAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHBhcnNlZCkpIHtcbiAgICAgIHJldHVybiBwYXJzZWQ7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxsYmFjaztcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplQ2FsY3VsYXRvckJhc2VVcmwoYmFzZVVybD86IHN0cmluZyk6IFVSTCB7XG4gIGNvbnN0IGZhbGxiYWNrVXJsID0gJ2h0dHBzOi8vc2FwLWNhbGN1bGF0b3IuY29tLyc7XG4gIGNvbnN0IGNhbmRpZGF0ZSA9IHR5cGVvZiBiYXNlVXJsID09PSAnc3RyaW5nJyAmJiBiYXNlVXJsLnRyaW0oKS5sZW5ndGggPiAwXG4gICAgPyBiYXNlVXJsLnRyaW0oKVxuICAgIDogZmFsbGJhY2tVcmw7XG4gIHRyeSB7XG4gICAgcmV0dXJuIG5ldyBVUkwoY2FuZGlkYXRlKTtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIG5ldyBVUkwoZmFsbGJhY2tVcmwpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVJlcGxheUNhbGN1bGF0b3JTdGF0ZShcbiAgcmVwbGF5OiBSZXBsYXlQYXlsb2FkSnNvbixcbiAgdHVybk51bWJlcjogbnVtYmVyLFxuICBtZXRhQm9hcmRzPzogUmVwbGF5TWV0YUJvYXJkcyxcbiAgb3B0aW9ucz86IFJlcGxheVBhcnNlT3B0aW9ucyxcbik6IFJlcGxheUNhbGN1bGF0b3JTdGF0ZSB8IG51bGwge1xuICByZXR1cm4gcGFyc2VUZWFtd29vZFJlcGxheUZvckNhbGN1bGF0b3IoXG4gICAgcmVwbGF5LFxuICAgIHR1cm5OdW1iZXIsXG4gICAgbWV0YUJvYXJkcyxcbiAgICBvcHRpb25zLFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU2ltdWxhdGlvbkNvbmZpZ0Zyb21DYWxjdWxhdG9yU3RhdGUoXG4gIGNhbGN1bGF0b3JTdGF0ZTogUmVwbGF5Q2FsY3VsYXRvclN0YXRlLFxuICBzaW11bGF0aW9uQ291bnQ6IG51bWJlcixcbik6IFNpbXVsYXRpb25Db25maWcge1xuICByZXR1cm4ge1xuICAgIHBsYXllclBhY2s6IGNhbGN1bGF0b3JTdGF0ZS5wbGF5ZXJQYWNrLFxuICAgIG9wcG9uZW50UGFjazogY2FsY3VsYXRvclN0YXRlLm9wcG9uZW50UGFjayxcbiAgICBwbGF5ZXJUb3k6IGNhbGN1bGF0b3JTdGF0ZS5wbGF5ZXJUb3ksXG4gICAgcGxheWVyVG95TGV2ZWw6IHRvTnVtYmVyT3JGYWxsYmFjayhjYWxjdWxhdG9yU3RhdGUucGxheWVyVG95TGV2ZWwsIDEpLFxuICAgIHBsYXllckhhcmRUb3k6IGNhbGN1bGF0b3JTdGF0ZS5wbGF5ZXJIYXJkVG95LFxuICAgIHBsYXllckhhcmRUb3lMZXZlbDogY2FsY3VsYXRvclN0YXRlLnBsYXllckhhcmRUb3lMZXZlbCxcbiAgICBvcHBvbmVudFRveTogY2FsY3VsYXRvclN0YXRlLm9wcG9uZW50VG95LFxuICAgIG9wcG9uZW50VG95TGV2ZWw6IHRvTnVtYmVyT3JGYWxsYmFjayhjYWxjdWxhdG9yU3RhdGUub3Bwb25lbnRUb3lMZXZlbCwgMSksXG4gICAgb3Bwb25lbnRIYXJkVG95OiBjYWxjdWxhdG9yU3RhdGUub3Bwb25lbnRIYXJkVG95LFxuICAgIG9wcG9uZW50SGFyZFRveUxldmVsOiBjYWxjdWxhdG9yU3RhdGUub3Bwb25lbnRIYXJkVG95TGV2ZWwsXG4gICAgdHVybjogY2FsY3VsYXRvclN0YXRlLnR1cm4sXG4gICAgcGxheWVyR29sZFNwZW50OiBjYWxjdWxhdG9yU3RhdGUucGxheWVyR29sZFNwZW50LFxuICAgIG9wcG9uZW50R29sZFNwZW50OiBjYWxjdWxhdG9yU3RhdGUub3Bwb25lbnRHb2xkU3BlbnQsXG4gICAgcGxheWVyUm9sbEFtb3VudDogY2FsY3VsYXRvclN0YXRlLnBsYXllclJvbGxBbW91bnQsXG4gICAgb3Bwb25lbnRSb2xsQW1vdW50OiBjYWxjdWxhdG9yU3RhdGUub3Bwb25lbnRSb2xsQW1vdW50LFxuICAgIHBsYXllclN1bW1vbmVkQW1vdW50OiBjYWxjdWxhdG9yU3RhdGUucGxheWVyU3VtbW9uZWRBbW91bnQsXG4gICAgb3Bwb25lbnRTdW1tb25lZEFtb3VudDogY2FsY3VsYXRvclN0YXRlLm9wcG9uZW50U3VtbW9uZWRBbW91bnQsXG4gICAgcGxheWVyTGV2ZWwzU29sZDogY2FsY3VsYXRvclN0YXRlLnBsYXllckxldmVsM1NvbGQsXG4gICAgb3Bwb25lbnRMZXZlbDNTb2xkOiBjYWxjdWxhdG9yU3RhdGUub3Bwb25lbnRMZXZlbDNTb2xkLFxuICAgIHBsYXllclRyYW5zZm9ybWF0aW9uQW1vdW50OiBjYWxjdWxhdG9yU3RhdGUucGxheWVyVHJhbnNmb3JtYXRpb25BbW91bnQsXG4gICAgb3Bwb25lbnRUcmFuc2Zvcm1hdGlvbkFtb3VudDogY2FsY3VsYXRvclN0YXRlLm9wcG9uZW50VHJhbnNmb3JtYXRpb25BbW91bnQsXG4gICAgcGxheWVyUGV0czogY2FsY3VsYXRvclN0YXRlLnBsYXllclBldHMsXG4gICAgb3Bwb25lbnRQZXRzOiBjYWxjdWxhdG9yU3RhdGUub3Bwb25lbnRQZXRzLFxuICAgIGN1c3RvbVBhY2tzOiBjYWxjdWxhdG9yU3RhdGUuY3VzdG9tUGFja3MsXG4gICAgYWxsUGV0czogY2FsY3VsYXRvclN0YXRlLmFsbFBldHMsXG4gICAgb2xkU3Rvcms6IGNhbGN1bGF0b3JTdGF0ZS5vbGRTdG9yayxcbiAgICB0b2tlblBldHM6IGNhbGN1bGF0b3JTdGF0ZS50b2tlblBldHMsXG4gICAga29tb2RvU2h1ZmZsZTogY2FsY3VsYXRvclN0YXRlLmtvbW9kb1NodWZmbGUsXG4gICAgbWFuYTogY2FsY3VsYXRvclN0YXRlLm1hbmEsXG4gICAgc2VlZDogY2FsY3VsYXRvclN0YXRlLnNlZWQsXG4gICAgc2ltdWxhdGlvbkNvdW50LFxuICAgIGxvZ3NFbmFibGVkOiBmYWxzZSxcbiAgICBtYXhMb2dnZWRCYXR0bGVzOiAwLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcnVuUmVwbGF5T2Rkc0Zyb21DYWxjdWxhdG9yU3RhdGUoXG4gIGNhbGN1bGF0b3JTdGF0ZTogUmVwbGF5Q2FsY3VsYXRvclN0YXRlLFxuICBzaW11bGF0aW9uQ291bnQ6IG51bWJlcixcbik6IFNpbXVsYXRpb25SZXN1bHQge1xuICBjb25zdCBjb25maWcgPSBjcmVhdGVTaW11bGF0aW9uQ29uZmlnRnJvbUNhbGN1bGF0b3JTdGF0ZShcbiAgICBjYWxjdWxhdG9yU3RhdGUsXG4gICAgc2ltdWxhdGlvbkNvdW50LFxuICApO1xuICByZXR1cm4gcnVuU2ltdWxhdGlvbihjb25maWcpO1xufVxuXG5leHBvcnQgdHlwZSBSZXBsYXlBbmFseXNpc1ByZWNpc2lvbiA9ICdxdWljaycgfCAnc3RhbmRhcmQnIHwgJ2hpZ2gnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJlcGxheVBvc2l0aW9uaW5nT3B0aW9ucyB7XG4gIHNpZGU6IFBvc2l0aW9uaW5nT3B0aW1pemF0aW9uU2lkZTtcbiAgcHJlY2lzaW9uPzogUmVwbGF5QW5hbHlzaXNQcmVjaXNpb247XG4gIHNpbXVsYXRpb25Db3VudD86IG51bWJlcjtcbiAgcHJvamVjdEVuZFR1cm5FZmZlY3RzPzogYm9vbGVhbjtcbiAgcmVjb21wdXRlUGFycm90Q29waWVzPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZXBsYXlQb3NpdGlvbmluZ1Jlc3VsdCB7XG4gIHByZWNpc2lvbjogUmVwbGF5QW5hbHlzaXNQcmVjaXNpb247XG4gIHNpbXVsYXRpb25Db3VudDogbnVtYmVyO1xuICBiYXNlbGluZTogU2ltdWxhdGlvblJlc3VsdDtcbiAgb3B0aW1pemVkOiBTaW11bGF0aW9uUmVzdWx0O1xuICBvcHRpbWl6YXRpb246IFBvc2l0aW9uaW5nT3B0aW1pemF0aW9uUmVzdWx0O1xuICBvcHRpbWl6ZWRDYWxjdWxhdG9yU3RhdGU6IFJlcGxheUNhbGN1bGF0b3JTdGF0ZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZXBsYXlTdHJlbmd0aFJlc3VsdCB7XG4gIHByZWNpc2lvbjogQm9hcmRTdHJlbmd0aFByZWNpc2lvbjtcbiAgcGxheWVyOiBCb2FyZFN0cmVuZ3RoUmVzdWx0O1xuICBvcHBvbmVudDogQm9hcmRTdHJlbmd0aFJlc3VsdDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZXBsYXlTdHJlbmd0aFJhbmdlIHtcbiAgbWluU3RhdD86IG51bWJlcjtcbiAgbWF4U3RhdD86IG51bWJlcjtcbn1cblxuY29uc3QgUE9TSVRJT05JTkdfU0lNVUxBVElPTlM6IFJlYWRvbmx5PFJlY29yZDxSZXBsYXlBbmFseXNpc1ByZWNpc2lvbiwgbnVtYmVyPj4gPSB7XG4gIHF1aWNrOiAxMDAsXG4gIHN0YW5kYXJkOiAyNTAsXG4gIGhpZ2g6IDUwMCxcbn07XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVNpbXVsYXRpb25Db3VudCh2YWx1ZTogbnVtYmVyIHwgdW5kZWZpbmVkLCBmYWxsYmFjazogbnVtYmVyKTogbnVtYmVyIHtcbiAgaWYgKHZhbHVlID09IG51bGwgfHwgIU51bWJlci5pc0Zpbml0ZSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsbGJhY2s7XG4gIH1cbiAgcmV0dXJuIE1hdGgubWF4KDEsIE1hdGgudHJ1bmModmFsdWUpKTtcbn1cblxuZnVuY3Rpb24gY2xvbmVQZXRMaW5ldXAoXG4gIGxpbmV1cDogUmVwbGF5Q2FsY3VsYXRvclN0YXRlWydwbGF5ZXJQZXRzJ10sXG4pOiBSZXBsYXlDYWxjdWxhdG9yU3RhdGVbJ3BsYXllclBldHMnXSB7XG4gIHJldHVybiAobGluZXVwID8/IFtdKS5tYXAoKHBldCkgPT5cbiAgICBwZXRcbiAgICAgID8ge1xuICAgICAgICAgIC4uLnBldCxcbiAgICAgICAgICBlcXVpcG1lbnQ6IHBldC5lcXVpcG1lbnQgPyB7IC4uLnBldC5lcXVpcG1lbnQgfSA6IG51bGwsXG4gICAgICAgIH1cbiAgICAgIDogbnVsbCxcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJ1blJlcGxheVBvc2l0aW9uaW5nRnJvbUNhbGN1bGF0b3JTdGF0ZShcbiAgY2FsY3VsYXRvclN0YXRlOiBSZXBsYXlDYWxjdWxhdG9yU3RhdGUsXG4gIG9wdGlvbnM6IFJlcGxheVBvc2l0aW9uaW5nT3B0aW9ucyxcbik6IFJlcGxheVBvc2l0aW9uaW5nUmVzdWx0IHtcbiAgY29uc3QgcHJlY2lzaW9uID0gb3B0aW9ucy5wcmVjaXNpb24gPz8gJ3F1aWNrJztcbiAgY29uc3Qgc2ltdWxhdGlvbkNvdW50ID0gbm9ybWFsaXplU2ltdWxhdGlvbkNvdW50KFxuICAgIG9wdGlvbnMuc2ltdWxhdGlvbkNvdW50LFxuICAgIFBPU0lUSU9OSU5HX1NJTVVMQVRJT05TW3ByZWNpc2lvbl0sXG4gICk7XG4gIGNvbnN0IGJhc2VDb25maWcgPSBjcmVhdGVTaW11bGF0aW9uQ29uZmlnRnJvbUNhbGN1bGF0b3JTdGF0ZShcbiAgICBjYWxjdWxhdG9yU3RhdGUsXG4gICAgc2ltdWxhdGlvbkNvdW50LFxuICApO1xuICBjb25zdCBydW5uZXIgPSBuZXcgQ2FsY3VsYXRvckJhdHRsZUVuZ2luZSgpO1xuICBjb25zdCBwcm9qZWN0aW9uUnVubmVyID0gbmV3IENhbGN1bGF0b3JCYXR0bGVFbmdpbmUoKTtcbiAgY29uc3QgYmFzZWxpbmUgPSBydW5uZXIucnVuKGJhc2VDb25maWcpO1xuICBjb25zdCBwcm9qZWN0RW5kVHVybkVmZmVjdHMgPSBvcHRpb25zLnByb2plY3RFbmRUdXJuRWZmZWN0cyAhPT0gZmFsc2U7XG4gIGNvbnN0IHJlY29tcHV0ZVBhcnJvdENvcGllcyA9IG9wdGlvbnMucmVjb21wdXRlUGFycm90Q29waWVzICE9PSBmYWxzZTtcbiAgY29uc3Qgb3B0aW1pemF0aW9uID0gcnVuUG9zaXRpb25pbmdPcHRpbWl6YXRpb24oe1xuICAgIGJhc2VDb25maWcsXG4gICAgb3B0aW9uczoge1xuICAgICAgc2lkZTogb3B0aW9ucy5zaWRlLFxuICAgICAgbWF4U2ltdWxhdGlvbnNQZXJQZXJtdXRhdGlvbjogc2ltdWxhdGlvbkNvdW50LFxuICAgICAgYmF0Y2hTaXplOiBNYXRoLm1pbigyNSwgc2ltdWxhdGlvbkNvdW50KSxcbiAgICAgIG1pblNhbXBsZXNCZWZvcmVFbGltaW5hdGlvbjogTWF0aC5taW4oNTAsIHNpbXVsYXRpb25Db3VudCksXG4gICAgICBjb25maWRlbmNlWjogMS45NixcbiAgICAgIGtlZXBTYW1lQnVmZlRhcmdldHM6ICFwcm9qZWN0RW5kVHVybkVmZmVjdHMsXG4gICAgICByZWNvbXB1dGVQYXJyb3RDb3BpZXMsXG4gICAgfSxcbiAgICBzaW11bGF0ZUJhdGNoOiAoY29uZmlnKSA9PiBydW5uZXIucnVuKGNvbmZpZyksXG4gICAgcHJvamVjdEVuZFR1cm5MaW5ldXA6IHByb2plY3RFbmRUdXJuRWZmZWN0c1xuICAgICAgPyAoeyBiYXNlQ29uZmlnOiBwcm9qZWN0aW9uQ29uZmlnLCBzaWRlLCBsaW5ldXAgfSkgPT5cbiAgICAgICAgICBwcm9qZWN0aW9uUnVubmVyLnByb2plY3RMaW5ldXBBZnRlckVuZFR1cm4oXG4gICAgICAgICAgICBwcm9qZWN0aW9uQ29uZmlnLFxuICAgICAgICAgICAgc2lkZSxcbiAgICAgICAgICAgIGxpbmV1cCxcbiAgICAgICAgICApXG4gICAgICA6IHVuZGVmaW5lZCxcbiAgfSk7XG4gIGNvbnN0IG9wdGltaXplZExpbmV1cCA9XG4gICAgb3B0aW1pemF0aW9uLmJlc3RQZXJtdXRhdGlvbi5zaW11bGF0aW9uTGluZXVwLmxlbmd0aCA+IDBcbiAgICAgID8gb3B0aW1pemF0aW9uLmJlc3RQZXJtdXRhdGlvbi5zaW11bGF0aW9uTGluZXVwXG4gICAgICA6IG9wdGltaXphdGlvbi5iZXN0UGVybXV0YXRpb24ubGluZXVwO1xuICBjb25zdCBvcHRpbWl6ZWRDYWxjdWxhdG9yU3RhdGU6IFJlcGxheUNhbGN1bGF0b3JTdGF0ZSA9IHtcbiAgICAuLi5jYWxjdWxhdG9yU3RhdGUsXG4gICAgcGxheWVyUGV0czogY2xvbmVQZXRMaW5ldXAoXG4gICAgICBvcHRpbWl6YXRpb24uc2lkZSA9PT0gJ3BsYXllcidcbiAgICAgICAgPyBvcHRpbWl6ZWRMaW5ldXBcbiAgICAgICAgOiBjYWxjdWxhdG9yU3RhdGUucGxheWVyUGV0cyxcbiAgICApLFxuICAgIG9wcG9uZW50UGV0czogY2xvbmVQZXRMaW5ldXAoXG4gICAgICBvcHRpbWl6YXRpb24uc2lkZSA9PT0gJ29wcG9uZW50J1xuICAgICAgICA/IG9wdGltaXplZExpbmV1cFxuICAgICAgICA6IGNhbGN1bGF0b3JTdGF0ZS5vcHBvbmVudFBldHMsXG4gICAgKSxcbiAgfTtcbiAgY29uc3Qgb3B0aW1pemVkID0gcnVubmVyLnJ1bihcbiAgICBjcmVhdGVTaW11bGF0aW9uQ29uZmlnRnJvbUNhbGN1bGF0b3JTdGF0ZShcbiAgICAgIG9wdGltaXplZENhbGN1bGF0b3JTdGF0ZSxcbiAgICAgIHNpbXVsYXRpb25Db3VudCxcbiAgICApLFxuICApO1xuXG4gIHJldHVybiB7XG4gICAgcHJlY2lzaW9uLFxuICAgIHNpbXVsYXRpb25Db3VudCxcbiAgICBiYXNlbGluZSxcbiAgICBvcHRpbWl6ZWQsXG4gICAgb3B0aW1pemF0aW9uLFxuICAgIG9wdGltaXplZENhbGN1bGF0b3JTdGF0ZSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJ1blJlcGxheVN0cmVuZ3RoRnJvbUNhbGN1bGF0b3JTdGF0ZShcbiAgY2FsY3VsYXRvclN0YXRlOiBSZXBsYXlDYWxjdWxhdG9yU3RhdGUsXG4gIHByZWNpc2lvbjogQm9hcmRTdHJlbmd0aFByZWNpc2lvbiA9ICdxdWljaycsXG4gIHJhbmdlOiBSZXBsYXlTdHJlbmd0aFJhbmdlID0ge30sXG4pOiBSZXBsYXlTdHJlbmd0aFJlc3VsdCB7XG4gIGNvbnN0IGJhc2VDb25maWcgPSBjcmVhdGVTaW11bGF0aW9uQ29uZmlnRnJvbUNhbGN1bGF0b3JTdGF0ZShjYWxjdWxhdG9yU3RhdGUsIDEpO1xuICBjb25zdCBydW5uZXIgPSBuZXcgQ2FsY3VsYXRvckJhdHRsZUVuZ2luZSgpO1xuICBjb25zdCBldmFsdWF0ZSA9IChzaWRlOiAncGxheWVyJyB8ICdvcHBvbmVudCcpOiBCb2FyZFN0cmVuZ3RoUmVzdWx0ID0+XG4gICAgcnVuQm9hcmRTdHJlbmd0aEV2YWx1YXRpb24oe1xuICAgICAgYmFzZUNvbmZpZyxcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgc2lkZSxcbiAgICAgICAgcHJlY2lzaW9uLFxuICAgICAgICBtaW5TdGF0OiByYW5nZS5taW5TdGF0LFxuICAgICAgICBtYXhTdGF0OiByYW5nZS5tYXhTdGF0LFxuICAgICAgfSxcbiAgICAgIHNpbXVsYXRlQmF0Y2g6IChjb25maWcpID0+IHJ1bm5lci5ydW4oY29uZmlnKSxcbiAgICB9KTtcblxuICByZXR1cm4ge1xuICAgIHByZWNpc2lvbixcbiAgICBwbGF5ZXI6IGV2YWx1YXRlKCdwbGF5ZXInKSxcbiAgICBvcHBvbmVudDogZXZhbHVhdGUoJ29wcG9uZW50JyksXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZVJlcGxheUNhbGN1bGF0b3JMaW5rKFxuICBjYWxjdWxhdG9yU3RhdGU6IFJlcGxheUNhbGN1bGF0b3JTdGF0ZSxcbiAgYmFzZVVybD86IHN0cmluZyxcbik6IHN0cmluZyB7XG4gIGNvbnN0IHBhcnNlciA9IG5ldyBSZXBsYXlDYWxjUGFyc2VyKCk7XG4gIGNvbnN0IG5vcm1hbGl6ZWRCYXNlVXJsID0gbm9ybWFsaXplQ2FsY3VsYXRvckJhc2VVcmwoYmFzZVVybCk7XG5cbiAgY29uc3QgZ2xvYmFsV2l0aFdpbmRvdyA9IGdsb2JhbFRoaXMgYXMgdHlwZW9mIGdsb2JhbFRoaXMgJiB7XG4gICAgd2luZG93PzogV2luZG93ICYgdHlwZW9mIGdsb2JhbFRoaXM7XG4gIH07XG5cbiAgY29uc3QgcHJldmlvdXNXaW5kb3cgPSBnbG9iYWxXaXRoV2luZG93LndpbmRvdztcbiAgY29uc3QgaGFkV2luZG93ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGdsb2JhbFdpdGhXaW5kb3csICd3aW5kb3cnKTtcblxuICBnbG9iYWxXaXRoV2luZG93LndpbmRvdyA9IHtcbiAgICBsb2NhdGlvbjoge1xuICAgICAgb3JpZ2luOiBub3JtYWxpemVkQmFzZVVybC5vcmlnaW4sXG4gICAgICBwYXRobmFtZTogbm9ybWFsaXplZEJhc2VVcmwucGF0aG5hbWUsXG4gICAgfSxcbiAgfSBhcyBXaW5kb3cgJiB0eXBlb2YgZ2xvYmFsVGhpcztcblxuICB0cnkge1xuICAgIGNvbnN0IGhhc2hMaW5rID0gcGFyc2VyLmdlbmVyYXRlQ2FsY3VsYXRvckxpbmsoY2FsY3VsYXRvclN0YXRlKTtcbiAgICByZXR1cm4gaGFzaExpbmsucmVwbGFjZSgnI2M9JywgJz9jPScpO1xuICB9IGZpbmFsbHkge1xuICAgIGlmIChoYWRXaW5kb3cpIHtcbiAgICAgIGdsb2JhbFdpdGhXaW5kb3cud2luZG93ID0gcHJldmlvdXNXaW5kb3c7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSBnbG9iYWxXaXRoV2luZG93LndpbmRvdztcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0ICogZnJvbSAnLi4vc3JjL2FwcC9kb21haW4vaW50ZXJmYWNlcy9zaW11bGF0aW9uLWNvbmZpZy5pbnRlcmZhY2UnO1xuZXhwb3J0ICogZnJvbSAnLi4vc3JjL2FwcC9pbnRlZ3JhdGlvbnMvcmVwbGF5L3JlcGxheS1jYWxjLXBhcnNlcic7XG5leHBvcnQgKiBmcm9tICcuLi9zcmMvYXBwL2ludGVncmF0aW9ucy9zaW11bGF0aW9uL3Bvc2l0aW9uaW5nLW9wdGltaXplcic7XG5leHBvcnQgKiBmcm9tICcuLi9zcmMvYXBwL2ludGVncmF0aW9ucy9zaW11bGF0aW9uL2JvYXJkLXN0cmVuZ3RoLWV2YWx1YXRvcic7XG5cblxuXG5cbmV4cG9ydCB7IGNyZWF0ZUJhdHRsZUVuZ2luZSwgY2F0YWxvZ3MsIG9wdGltaXplRmlnaHQgfSBmcm9tICdzYXAtYmF0dGxlLWVuZ2luZSc7XG4iLCAiaW1wb3J0IHsgcGVya3MgYXMgcGVya3MgfSBmcm9tICdhcHAvcnVudGltZS9jb250ZW50LWNhdGFsb2dzJztcbmltcG9ydCB7IHRveXMgYXMgdG95cyB9IGZyb20gJ2FwcC9ydW50aW1lL2NvbnRlbnQtY2F0YWxvZ3MnO1xuaW1wb3J0IHsgcGV0cyBhcyBwZXRzQnlUaWVyIH0gZnJvbSAnYXBwL3J1bnRpbWUvY29udGVudC1jYXRhbG9ncyc7XG5cbmV4cG9ydCBjb25zdCBQRVRTX0JZX0lEID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbmV4cG9ydCBjb25zdCBQRVRTX01FVEFfQllfSUQgPSBuZXcgTWFwPFxuICBzdHJpbmcsXG4gIHsgbmFtZTogc3RyaW5nOyB0aWVyOiBudW1iZXIgfVxuPigpO1xuXG5leHBvcnQgY29uc3QgUEVUX0lEU19CWV9OQU1FID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcblxudHlwZSBSZXBsYXlEYXRhUGV0ID0ge1xuICBJZD86IHN0cmluZyB8IG51bWJlcjtcbiAgaWQ/OiBzdHJpbmcgfCBudW1iZXI7XG4gIFRpZXI/OiBudW1iZXIgfCBzdHJpbmc7XG4gIHRpZXI/OiBudW1iZXIgfCBzdHJpbmc7XG4gIE5hbWU/OiBzdHJpbmc7XG4gIG5hbWU/OiBzdHJpbmc7XG59O1xuXG50eXBlIFJlcGxheURhdGFDb250YWluZXI8VD4gPSB7XG4gIGRlZmF1bHQ/OiBUO1xufTtcblxuZnVuY3Rpb24gaXNPYmplY3RSZWNvcmQodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB7XG4gIHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnO1xufVxuXG5jb25zdCBwZXRzTW9kdWxlID0gcGV0c0J5VGllciBhcyB1bmtub3duIGFzIFJlcGxheURhdGFDb250YWluZXI8dW5rbm93bj47XG5jb25zdCBwZXRMaXN0UmF3ID0gcGV0c01vZHVsZS5kZWZhdWx0ID8/IHBldHNCeVRpZXI7XG5jb25zdCBwZXRMaXN0ID0gQXJyYXkuaXNBcnJheShwZXRMaXN0UmF3KVxuICA/IHBldExpc3RSYXdcbiAgOiBpc09iamVjdFJlY29yZChwZXRMaXN0UmF3KVxuICAgID8gT2JqZWN0LnZhbHVlcyhwZXRMaXN0UmF3KS5maWx0ZXIodiA9PiB0eXBlb2YgdiA9PT0gJ29iamVjdCcgJiYgdiAhPT0gbnVsbCAmJiAoJ0lkJyBpbiB2IHx8ICdpZCcgaW4gdikpXG4gICAgOiBbXTtcblxucGV0TGlzdC5mb3JFYWNoKChwZXRVbmtub3duKSA9PiB7XG4gIGlmICghaXNPYmplY3RSZWNvcmQocGV0VW5rbm93bikpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgcGV0ID0gcGV0VW5rbm93biBhcyBSZXBsYXlEYXRhUGV0O1xuICBjb25zdCBwZXRJZCA9IFN0cmluZyhwZXQuSWQgPz8gcGV0LmlkKTtcbiAgY29uc3QgdGllclZhbHVlID0gTnVtYmVyKHBldC5UaWVyID8/IHBldC50aWVyKTtcbiAgY29uc3QgbmFtZSA9IHBldC5OYW1lID8/IHBldC5uYW1lO1xuXG4gIGlmIChuYW1lKSB7XG4gICAgUEVUU19CWV9JRC5zZXQocGV0SWQsIG5hbWUpO1xuICAgIGNvbnN0IG5vcm1hbGl6ZWROYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1teYS16MC05XS9nLCAnJyk7XG4gICAgUEVUX0lEU19CWV9OQU1FLnNldChub3JtYWxpemVkTmFtZSwgcGV0SWQpO1xuICB9XG5cbiAgaWYgKE51bWJlci5pc0Zpbml0ZSh0aWVyVmFsdWUpICYmIG5hbWUpIHtcbiAgICBQRVRTX01FVEFfQllfSUQuc2V0KHBldElkLCB7IG5hbWUsIHRpZXI6IHRpZXJWYWx1ZSB9KTtcbiAgfVxufSk7XG5cbmNvbnN0IHBlcmtMaXN0ID1cbiAgKHBlcmtzIGFzIHVua25vd24gYXMgeyBkZWZhdWx0PzogQXJyYXk8eyBJZDogc3RyaW5nOyBOYW1lOiBzdHJpbmcgfT4gfSlcbiAgICAuZGVmYXVsdCA/PyAocGVya3MgYXMgdW5rbm93biBhcyBBcnJheTx7IElkOiBzdHJpbmc7IE5hbWU6IHN0cmluZyB9Pik7XG5jb25zdCB0b3lMaXN0ID1cbiAgKHRveXMgYXMgdW5rbm93biBhcyB7IGRlZmF1bHQ/OiBBcnJheTx7IElkOiBzdHJpbmc7IE5hbWU6IHN0cmluZyB9PiB9KVxuICAgIC5kZWZhdWx0ID8/ICh0b3lzIGFzIHVua25vd24gYXMgQXJyYXk8eyBJZDogc3RyaW5nOyBOYW1lOiBzdHJpbmcgfT4pO1xuXG5leHBvcnQgY29uc3QgUEVSS1NfQllfSUQgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPihcbiAgcGVya0xpc3QubWFwKChwZXJrKSA9PiBbU3RyaW5nKHBlcmsuSWQpLCBwZXJrLk5hbWVdKSxcbik7XG5leHBvcnQgY29uc3QgVE9ZU19CWV9JRCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KFxuICB0b3lMaXN0Lm1hcCgodG95KSA9PiBbU3RyaW5nKHRveS5JZCksIHRveS5OYW1lXSksXG4pO1xuXG5leHBvcnQgY29uc3QgUEFDS19NQVA6IFJlY29yZDxudW1iZXIsIHN0cmluZz4gPSB7XG4gIDA6ICdUdXJ0bGUnLFxuICAxOiAnUHVwcHknLFxuICAyOiAnU3RhcicsXG4gIDU6ICdHb2xkZW4nLFxuICA2OiAnVW5pY29ybicsXG4gIDc6ICdEYW5nZXInLFxufTtcblxuY29uc3QgUEFSUk9UX0NPUFlfUEVUX0FCT01JTkFUSU9OX0tFWV9NQVA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSAoKCkgPT4ge1xuICBjb25zdCBtYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgZm9yIChsZXQgb3V0ZXIgPSAxOyBvdXRlciA8PSAzOyBvdXRlcisrKSB7XG4gICAgY29uc3QgYmFzZSA9IGBwYXJyb3RDb3B5UGV0QWJvbWluYXRpb25Td2FsbG93ZWRQZXQke291dGVyfWA7XG4gICAgY29uc3Qgb3V0ZXJQcmVmaXggPSBgcENQQVMke291dGVyfWA7XG4gICAgbWFwW2Jhc2VdID0gb3V0ZXJQcmVmaXg7XG4gICAgbWFwW2Ake2Jhc2V9QmVsdWdhU3dhbGxvd2VkUGV0YF0gPSBgJHtvdXRlclByZWZpeH1CYDtcbiAgICBtYXBbYCR7YmFzZX1MZXZlbGBdID0gYCR7b3V0ZXJQcmVmaXh9TGA7XG4gICAgbWFwW2Ake2Jhc2V9VGltZXNIdXJ0YF0gPSBgJHtvdXRlclByZWZpeH1UYDtcbiAgICBtYXBbYCR7YmFzZX1QYXJyb3RDb3B5UGV0YF0gPSBgJHtvdXRlclByZWZpeH1QQ1BgO1xuICAgIG1hcFtgJHtiYXNlfVBhcnJvdENvcHlQZXRCZWx1Z2FTd2FsbG93ZWRQZXRgXSA9IGAke291dGVyUHJlZml4fVBDUEJgO1xuICAgIGZvciAobGV0IGlubmVyID0gMTsgaW5uZXIgPD0gMzsgaW5uZXIrKykge1xuICAgICAgY29uc3QgaW5uZXJCYXNlID0gYCR7YmFzZX1QYXJyb3RDb3B5UGV0QWJvbWluYXRpb25Td2FsbG93ZWRQZXQke2lubmVyfWA7XG4gICAgICBjb25zdCBpbm5lclByZWZpeCA9IGAke291dGVyUHJlZml4fVBDUEFTJHtpbm5lcn1gO1xuICAgICAgbWFwW2lubmVyQmFzZV0gPSBpbm5lclByZWZpeDtcbiAgICAgIG1hcFtgJHtpbm5lckJhc2V9QmVsdWdhU3dhbGxvd2VkUGV0YF0gPSBgJHtpbm5lclByZWZpeH1CYDtcbiAgICAgIG1hcFtgJHtpbm5lckJhc2V9TGV2ZWxgXSA9IGAke2lubmVyUHJlZml4fUxgO1xuICAgICAgbWFwW2Ake2lubmVyQmFzZX1UaW1lc0h1cnRgXSA9IGAke2lubmVyUHJlZml4fVRgO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbWFwO1xufSkoKTtcblxuZXhwb3J0IGNvbnN0IEtFWV9NQVA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIHBsYXllclBhY2s6ICdwUCcsXG4gIG9wcG9uZW50UGFjazogJ29QJyxcbiAgcGxheWVyVG95OiAncFQnLFxuICBwbGF5ZXJUb3lMZXZlbDogJ3BUTCcsXG4gIHBsYXllckhhcmRUb3k6ICdwSFQnLFxuICBwbGF5ZXJIYXJkVG95TGV2ZWw6ICdwSFRMJyxcbiAgb3Bwb25lbnRUb3k6ICdvVCcsXG4gIG9wcG9uZW50VG95TGV2ZWw6ICdvVEwnLFxuICBvcHBvbmVudEhhcmRUb3k6ICdvSFQnLFxuICBvcHBvbmVudEhhcmRUb3lMZXZlbDogJ29IVEwnLFxuICB0dXJuOiAndCcsXG4gIHBsYXllckdvbGRTcGVudDogJ3BHUycsXG4gIG9wcG9uZW50R29sZFNwZW50OiAnb0dTJyxcbiAgcGxheWVyUm9sbEFtb3VudDogJ3BSQScsXG4gIG9wcG9uZW50Um9sbEFtb3VudDogJ29SQScsXG4gIHBsYXllclN1bW1vbmVkQW1vdW50OiAncFNBJyxcbiAgb3Bwb25lbnRTdW1tb25lZEFtb3VudDogJ29TQScsXG4gIHBsYXllckxldmVsM1NvbGQ6ICdwTDMnLFxuICBvcHBvbmVudExldmVsM1NvbGQ6ICdvTDMnLFxuICBwbGF5ZXJUcmFuc2Zvcm1hdGlvbkFtb3VudDogJ3BUQScsXG4gIG9wcG9uZW50VHJhbnNmb3JtYXRpb25BbW91bnQ6ICdvVEEnLFxuICBwbGF5ZXJQZXRzOiAncCcsXG4gIG9wcG9uZW50UGV0czogJ28nLFxuICBhbGxQZXRzOiAnYXAnLFxuICBsb2dGaWx0ZXI6ICdsZicsXG4gIGN1c3RvbVBhY2tzOiAnY3AnLFxuICBvbGRTdG9yazogJ29zJyxcbiAgdG9rZW5QZXRzOiAndHAnLFxuICBrb21vZG9TaHVmZmxlOiAna3MnLFxuICBtYW5hOiAnbScsXG4gIHNlZWQ6ICdzZCcsXG4gIHRyaWdnZXJzQ29uc3VtZWQ6ICd0YycsXG4gIHNob3dBZHZhbmNlZDogJ3NhJyxcbiAgc2hvd1RyaWdnZXJOYW1lc0luTG9nczogJ3N0bicsXG4gIHNob3dQb3NpdGlvbmFsQXJnc0luTG9nczogJ3NwYScsXG4gIGFpbG1lbnRFcXVpcG1lbnQ6ICdhZScsXG4gIG5hbWU6ICduJyxcbiAgYXR0YWNrOiAnYScsXG4gIGhlYWx0aDogJ2gnLFxuICBleHA6ICdlJyxcbiAgZXF1aXBtZW50OiAnZXEnLFxuICBiZWx1Z2FTd2FsbG93ZWRQZXQ6ICdiU1AnLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDE6ICdhU1AxJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQyOiAnYVNQMicsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MzogJ2FTUDMnLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDFCZWx1Z2FTd2FsbG93ZWRQZXQ6ICdhU1AxQicsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MkJlbHVnYVN3YWxsb3dlZFBldDogJ2FTUDJCJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzQmVsdWdhU3dhbGxvd2VkUGV0OiAnYVNQM0InLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDFTYXJjYXN0aWNGcmluZ2VoZWFkU3dhbGxvd2VkUGV0OiAnYVNQMVNGUycsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MlNhcmNhc3RpY0ZyaW5nZWhlYWRTd2FsbG93ZWRQZXQ6ICdhU1AyU0ZTJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzU2FyY2FzdGljRnJpbmdlaGVhZFN3YWxsb3dlZFBldDogJ2FTUDNTRlMnLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDFMZXZlbDogJ2FTUDFMJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQyTGV2ZWw6ICdhU1AyTCcsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M0xldmVsOiAnYVNQM0wnLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDFUaW1lc0h1cnQ6ICdhU1AxVCcsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MlRpbWVzSHVydDogJ2FTUDJUJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzVGltZXNIdXJ0OiAnYVNQM1QnLFxuICBwYXJyb3RDb3B5UGV0OiAncENQJyxcbiAgcGFycm90Q29weVBldEJlbHVnYVN3YWxsb3dlZFBldDogJ3BDUEInLFxuICAuLi5QQVJST1RfQ09QWV9QRVRfQUJPTUlOQVRJT05fS0VZX01BUCxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxUGFycm90Q29weVBldDogJ2FTUDFQQ1AnLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDJQYXJyb3RDb3B5UGV0OiAnYVNQMlBDUCcsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M1BhcnJvdENvcHlQZXQ6ICdhU1AzUENQJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxUGFycm90Q29weVBldEJlbHVnYVN3YWxsb3dlZFBldDogJ2FTUDFQQ1BCJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQyUGFycm90Q29weVBldEJlbHVnYVN3YWxsb3dlZFBldDogJ2FTUDJQQ1BCJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzUGFycm90Q29weVBldEJlbHVnYVN3YWxsb3dlZFBldDogJ2FTUDNQQ1BCJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxUGFycm90Q29weVBldEFib21pbmF0aW9uU3dhbGxvd2VkUGV0MTogJ2FTUDFQQ1BBUzEnLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDFQYXJyb3RDb3B5UGV0QWJvbWluYXRpb25Td2FsbG93ZWRQZXQyOiAnYVNQMVBDUEFTMicsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MVBhcnJvdENvcHlQZXRBYm9taW5hdGlvblN3YWxsb3dlZFBldDM6ICdhU1AxUENQQVMzJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQyUGFycm90Q29weVBldEFib21pbmF0aW9uU3dhbGxvd2VkUGV0MTogJ2FTUDJQQ1BBUzEnLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDJQYXJyb3RDb3B5UGV0QWJvbWluYXRpb25Td2FsbG93ZWRQZXQyOiAnYVNQMlBDUEFTMicsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MlBhcnJvdENvcHlQZXRBYm9taW5hdGlvblN3YWxsb3dlZFBldDM6ICdhU1AyUENQQVMzJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzUGFycm90Q29weVBldEFib21pbmF0aW9uU3dhbGxvd2VkUGV0MTogJ2FTUDNQQ1BBUzEnLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDNQYXJyb3RDb3B5UGV0QWJvbWluYXRpb25Td2FsbG93ZWRQZXQyOiAnYVNQM1BDUEFTMicsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M1BhcnJvdENvcHlQZXRBYm9taW5hdGlvblN3YWxsb3dlZFBldDM6ICdhU1AzUENQQVMzJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxUGFycm90Q29weVBldEFib21pbmF0aW9uU3dhbGxvd2VkUGV0MUJlbHVnYVN3YWxsb3dlZFBldDpcbiAgICAnYVNQMVBDUEFTMUInLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDFQYXJyb3RDb3B5UGV0QWJvbWluYXRpb25Td2FsbG93ZWRQZXQyQmVsdWdhU3dhbGxvd2VkUGV0OlxuICAgICdhU1AxUENQQVMyQicsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MVBhcnJvdENvcHlQZXRBYm9taW5hdGlvblN3YWxsb3dlZFBldDNCZWx1Z2FTd2FsbG93ZWRQZXQ6XG4gICAgJ2FTUDFQQ1BBUzNCJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQyUGFycm90Q29weVBldEFib21pbmF0aW9uU3dhbGxvd2VkUGV0MUJlbHVnYVN3YWxsb3dlZFBldDpcbiAgICAnYVNQMlBDUEFTMUInLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDJQYXJyb3RDb3B5UGV0QWJvbWluYXRpb25Td2FsbG93ZWRQZXQyQmVsdWdhU3dhbGxvd2VkUGV0OlxuICAgICdhU1AyUENQQVMyQicsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MlBhcnJvdENvcHlQZXRBYm9taW5hdGlvblN3YWxsb3dlZFBldDNCZWx1Z2FTd2FsbG93ZWRQZXQ6XG4gICAgJ2FTUDJQQ1BBUzNCJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzUGFycm90Q29weVBldEFib21pbmF0aW9uU3dhbGxvd2VkUGV0MUJlbHVnYVN3YWxsb3dlZFBldDpcbiAgICAnYVNQM1BDUEFTMUInLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDNQYXJyb3RDb3B5UGV0QWJvbWluYXRpb25Td2FsbG93ZWRQZXQyQmVsdWdhU3dhbGxvd2VkUGV0OlxuICAgICdhU1AzUENQQVMyQicsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M1BhcnJvdENvcHlQZXRBYm9taW5hdGlvblN3YWxsb3dlZFBldDNCZWx1Z2FTd2FsbG93ZWRQZXQ6XG4gICAgJ2FTUDNQQ1BBUzNCJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxUGFycm90Q29weVBldEFib21pbmF0aW9uU3dhbGxvd2VkUGV0MUxldmVsOlxuICAgICdhU1AxUENQQVMxTCcsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MVBhcnJvdENvcHlQZXRBYm9taW5hdGlvblN3YWxsb3dlZFBldDJMZXZlbDpcbiAgICAnYVNQMVBDUEFTMkwnLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDFQYXJyb3RDb3B5UGV0QWJvbWluYXRpb25Td2FsbG93ZWRQZXQzTGV2ZWw6XG4gICAgJ2FTUDFQQ1BBUzNMJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQyUGFycm90Q29weVBldEFib21pbmF0aW9uU3dhbGxvd2VkUGV0MUxldmVsOlxuICAgICdhU1AyUENQQVMxTCcsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MlBhcnJvdENvcHlQZXRBYm9taW5hdGlvblN3YWxsb3dlZFBldDJMZXZlbDpcbiAgICAnYVNQMlBDUEFTMkwnLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDJQYXJyb3RDb3B5UGV0QWJvbWluYXRpb25Td2FsbG93ZWRQZXQzTGV2ZWw6XG4gICAgJ2FTUDJQQ1BBUzNMJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzUGFycm90Q29weVBldEFib21pbmF0aW9uU3dhbGxvd2VkUGV0MUxldmVsOlxuICAgICdhU1AzUENQQVMxTCcsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M1BhcnJvdENvcHlQZXRBYm9taW5hdGlvblN3YWxsb3dlZFBldDJMZXZlbDpcbiAgICAnYVNQM1BDUEFTMkwnLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDNQYXJyb3RDb3B5UGV0QWJvbWluYXRpb25Td2FsbG93ZWRQZXQzTGV2ZWw6XG4gICAgJ2FTUDNQQ1BBUzNMJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxUGFycm90Q29weVBldEFib21pbmF0aW9uU3dhbGxvd2VkUGV0MVRpbWVzSHVydDpcbiAgICAnYVNQMVBDUEFTMVQnLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDFQYXJyb3RDb3B5UGV0QWJvbWluYXRpb25Td2FsbG93ZWRQZXQyVGltZXNIdXJ0OlxuICAgICdhU1AxUENQQVMyVCcsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MVBhcnJvdENvcHlQZXRBYm9taW5hdGlvblN3YWxsb3dlZFBldDNUaW1lc0h1cnQ6XG4gICAgJ2FTUDFQQ1BBUzNUJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQyUGFycm90Q29weVBldEFib21pbmF0aW9uU3dhbGxvd2VkUGV0MVRpbWVzSHVydDpcbiAgICAnYVNQMlBDUEFTMVQnLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDJQYXJyb3RDb3B5UGV0QWJvbWluYXRpb25Td2FsbG93ZWRQZXQyVGltZXNIdXJ0OlxuICAgICdhU1AyUENQQVMyVCcsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MlBhcnJvdENvcHlQZXRBYm9taW5hdGlvblN3YWxsb3dlZFBldDNUaW1lc0h1cnQ6XG4gICAgJ2FTUDJQQ1BBUzNUJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzUGFycm90Q29weVBldEFib21pbmF0aW9uU3dhbGxvd2VkUGV0MVRpbWVzSHVydDpcbiAgICAnYVNQM1BDUEFTMVQnLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDNQYXJyb3RDb3B5UGV0QWJvbWluYXRpb25Td2FsbG93ZWRQZXQyVGltZXNIdXJ0OlxuICAgICdhU1AzUENQQVMyVCcsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M1BhcnJvdENvcHlQZXRBYm9taW5hdGlvblN3YWxsb3dlZFBldDNUaW1lc0h1cnQ6XG4gICAgJ2FTUDNQQ1BBUzNUJyxcbiAgdGltZXNIdXJ0OiAndEgnLFxuICBhaWxtZW50c0NvdW50OiAnYUMnLFxuICBmcmllbmRzSHVydEJlZm9yZUJhdHRsZTogJ2ZIQkInLFxufTtcbiIsICIvKiBVdGlsaXRpZXMgcG9ydGVkL2FkYXB0ZWQgZnJvbSByZXBsYXkgcGFyaXR5IGZpeGVzIFBSLlxuICAgUHVycG9zZTogcm9idXN0IHBldC90b3kgaWQgcmVzb2x1dGlvbiwgYWJpbGl0eSBmYWxsYmFja3MsIGFib21pbmF0aW9uXG4gICBzd2FsbG93ZWQtcGV0IGluZmVyZW5jZSwgYW5kIHNtYWxsIGhlbHBlcnMgdXNlZCBieSB0aGUgcmVwbGF5IHBhcnNlci5cbiovXG5cbnR5cGUgUmVwbGF5VW5rbm93blJlY29yZCA9IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xudHlwZSBSZXBsYXlOYW1lTG9va3VwID1cbiAgfCBNYXA8c3RyaW5nLCBzdHJpbmcgfCBudW1iZXI+XG4gIHwgUmVjb3JkPHN0cmluZywgc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkPjtcblxuZXhwb3J0IGludGVyZmFjZSBSZXBsYXlQYXJzZXJMb29rdXBNYXBzIHtcbiAgcGV0SWRzQnlOYW1lPzogUmVwbGF5TmFtZUxvb2t1cDtcbiAgUEVUX0lEU19CWV9OQU1FPzogUmVwbGF5TmFtZUxvb2t1cDtcbiAgYWJpbGl0eUlkc0J5UGV0SWQ/OiBSZWNvcmQ8c3RyaW5nLCBBcnJheTxzdHJpbmcgfCBudW1iZXI+IHwgdW5kZWZpbmVkPjtcbiAgdG95SWRzQnlOYW1lPzogUmVjb3JkPHN0cmluZywgc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkPjtcbn1cblxuaW50ZXJmYWNlIFJlcGxheU1lbW9yeVBheWxvYWQge1xuICBMc3RzOiBSZWNvcmQ8c3RyaW5nLCBSZXBsYXlVbmtub3duUmVjb3JkW10+O1xufVxuXG5pbnRlcmZhY2UgUmVwbGF5TWVtb3J5RW50cnkgZXh0ZW5kcyBSZXBsYXlVbmtub3duUmVjb3JkIHtcbiAgRW51OiBudW1iZXI7XG4gIEF0PzogbnVtYmVyO1xuICBIcD86IG51bWJlcjtcbiAgTWFuYT86IG51bWJlciB8IG51bGw7XG4gIEx2bD86IG51bWJlcjtcbiAgRXhwPzogbnVtYmVyIHwgbnVsbDtcbiAgUGVyaz86IG51bWJlciB8IG51bGw7XG4gIFBvd2E/OiBudW1iZXIgfCBudWxsO1xuICBIcnRDPzogbnVtYmVyIHwgbnVsbDtcbiAgTWlNcz86IFJlcGxheU1lbW9yeVBheWxvYWQ7XG59XG5cbmludGVyZmFjZSBBYm9taW5hdGlvblNsb3RDb25maWcge1xuICBwZXRLZXk6IHN0cmluZztcbiAgbGV2ZWxLZXk6IHN0cmluZztcbiAgYmVsdWdhS2V5OiBzdHJpbmc7XG4gIHNmc0tleTogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgQWJvbWluYXRpb25Td2FsbG93ZWRFbnRyeSB7XG4gIHN3YWxsb3dlZFBldElkOiBudW1iZXI7XG4gIHN3YWxsb3dlZEFiaWxpdHlFbnVtczogbnVtYmVyW107XG4gIG1lbW9yeUVudHJ5OiBSZXBsYXlNZW1vcnlFbnRyeTtcbiAgYmVsdWdhU3dhbGxvd2VkRW50cnk/OiBSZXBsYXlNZW1vcnlQYXlsb2FkIHwgbnVsbDtcbn1cblxuaW50ZXJmYWNlIFJlcGxheVdhcm5pbmdCYWcge1xuICB1bmtub3duVG95czogc3RyaW5nW107XG59XG5cbmludGVyZmFjZSBSZXBsYXlBYmlsaXR5RW50cnkge1xuICBFbnU6IG51bWJlcjtcbiAgTHZsOiBudW1iZXI7XG4gIE5hdDogYm9vbGVhbjtcbiAgRHVyOiBudW1iZXI7XG4gIFRyQ286IG51bWJlcjtcbiAgQ2hhcjogbnVsbDtcbiAgRGlzOiBib29sZWFuO1xuICBBSU1MOiBib29sZWFuO1xufVxuXG5pbnRlcmZhY2UgUmVwbGF5UmVsaWNJdGVtIHtcbiAgT3duOiBudW1iZXI7XG4gIEVudTogbnVtYmVyO1xuICBMb2M6IG51bWJlcjtcbiAgUG9pOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH07XG4gIEV4cDogbnVtYmVyO1xuICBMdmw6IG51bWJlcjtcbiAgSHA6IHsgUGVybTogbnVtYmVyOyBUZW1wOiBudW1iZXI7IE1heDogbnVtYmVyIHwgbnVsbCB9O1xuICBBdDogeyBQZXJtOiBudW1iZXI7IFRlbXA6IG51bWJlcjsgTWF4OiBudW1iZXIgfCBudWxsIH07XG4gIE1hbmE6IG51bWJlcjtcbiAgQ291OiBudW1iZXI7XG4gIFBlQm86IGJvb2xlYW47XG4gIFBlRHU6IG51bGw7XG4gIFBlRE06IG51bGw7XG4gIFBlTXU6IG51bGw7XG4gIFBlRHI6IG51bWJlcjtcbiAgQWJpbDogUmVwbGF5QWJpbGl0eUVudHJ5W107XG4gIEFiRGk6IGJvb2xlYW47XG4gIENvc206IG51bWJlcjtcbiAgRGVhZDogYm9vbGVhbjtcbiAgRGVzdDogYm9vbGVhbjtcbiAgRGVCeTogbnVsbDtcbiAgTGluazogbnVsbDtcbiAgUG93OiBudWxsO1xuICBTZVY6IG51bGw7XG4gIFJ3ZHM6IG51bWJlcjtcbiAgUndyZDogYm9vbGVhbjtcbiAgTWlNczogbnVsbDtcbiAgU3BNZTogbnVsbDtcbiAgVHJpOiBudWxsO1xuICBBdGtDOiBudW1iZXI7XG4gIEhydEM6IG51bWJlcjtcbiAgU3BDVDogbnVtYmVyO1xuICBPbFRzOiBudWxsO1xuICBMYXN0VGFyZ2V0c1RoaXNUdXJuOiBudWxsO1xuICBJZDogeyBCb0lkOiBzdHJpbmc7IFVuaTogbnVtYmVyIH07XG4gIFByaTogbnVtYmVyO1xuICBGcm86IGJvb2xlYW47XG4gIFdGcm86IGJvb2xlYW47XG4gIEFGcm86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjb25zdCBGQUxMQkFDS19BQklMSVRZX0lEU19CWV9QRVRfSUQ6IFJlY29yZDxzdHJpbmcsIG51bWJlcltdPiA9IHtcbiAgJzMzOCc6IFszNjhdLFxuICAnMzczJzogWzQwM10sXG4gICc2MzUnOiBbNjY5XSxcbiAgLy8gU2FyY2FzdGljIEZyaW5nZWhlYWQgb2JzZXJ2ZWQgbXVsdGlwbGUgYWJpbGl0eSBlbnVtcyBpbiBwYXlsb2Fkc1xuICAnNzYzJzogWzg1MywgOTcwXSxcbn07XG5cbmV4cG9ydCBjb25zdCBGQUxMQkFDS19UT1lfSURTX0JZX05BTUU6IFJlY29yZDxzdHJpbmcsIG51bWJlcj4gPSB7XG4gIGFjdGlvbmZpZ3VyZTogMjk0LFxuICBhaXJwYWxtdHJlZTogNTExLFxuICBiYWxsb29uOiA0NzksXG4gIGJvb3Q6IDI5OSxcbiAgYm93bGluZ2JhbGw6IDMwMCxcbiAgYnJva2VucGlnZ3liYW5rOiAzMTAsXG4gIGJyb29tOiAzMDEsXG4gIGNhcmRib2FyZGJveDogMzAyLFxuICAvLyAodHJpbW1lZCBsaXN0IC0gaW5jbHVkZSBjb21tb24gZmFsbGJhY2tzIHVzZWQgaW4gbGl2ZSBwYXlsb2FkcylcbiAgdGVsZXZpc2lvbjogNDkxLFxuICB0b3ltb3VzZTogMzI3LFxufTtcblxuZnVuY3Rpb24gaXNQbGFpbk9iamVjdCh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIFJlcGxheVVua25vd25SZWNvcmQge1xuICByZXR1cm4gQm9vbGVhbih2YWx1ZSkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGdldFJlY29yZCh2YWx1ZTogdW5rbm93bik6IFJlcGxheVVua25vd25SZWNvcmQgfCBudWxsIHtcbiAgcmV0dXJuIGlzUGxhaW5PYmplY3QodmFsdWUpID8gdmFsdWUgOiBudWxsO1xufVxuXG5mdW5jdGlvbiBnZXRCeU5hbWVMb29rdXAoXG4gIGxvb2t1cDogUmVwbGF5TmFtZUxvb2t1cCB8IHVuZGVmaW5lZCxcbiAga2V5OiBzdHJpbmcsXG4pOiBzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQge1xuICBpZiAoIWxvb2t1cCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgaWYgKGxvb2t1cCBpbnN0YW5jZW9mIE1hcCkge1xuICAgIHJldHVybiBsb29rdXAuZ2V0KGtleSk7XG4gIH1cbiAgcmV0dXJuIGxvb2t1cFtrZXldO1xufVxuXG5mdW5jdGlvbiB0b0ludE9yTnVsbCh2YWx1ZTogdW5rbm93bik6IG51bWJlciB8IG51bGwge1xuICBjb25zdCBuID0gTnVtYmVyKHZhbHVlKTtcbiAgcmV0dXJuIE51bWJlci5pc0Zpbml0ZShuKSA/IE1hdGgudHJ1bmMobikgOiBudWxsO1xufVxuXG5mdW5jdGlvbiB0b051bGxhYmxlTnVtYmVyKHZhbHVlOiB1bmtub3duKTogbnVtYmVyIHwgbnVsbCB7XG4gIGNvbnN0IG4gPSBOdW1iZXIodmFsdWUpO1xuICByZXR1cm4gTnVtYmVyLmlzRmluaXRlKG4pID8gbiA6IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0Zpbml0ZU51bWJlcih2YWx1ZTogdW5rbm93biwgZmFsbGJhY2sgPSAwKTogbnVtYmVyIHtcbiAgY29uc3QgbnVtZXJpYyA9IE51bWJlcih2YWx1ZSk7XG4gIHJldHVybiBOdW1iZXIuaXNGaW5pdGUobnVtZXJpYykgPyBudW1lcmljIDogZmFsbGJhY2s7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlUGV0SWRGcm9tVW5rbm93bihcbiAgdmFsdWU6IHVua25vd24sXG4gIG1hcHM/OiBSZXBsYXlQYXJzZXJMb29rdXBNYXBzLFxuKTogbnVtYmVyIHwgbnVsbCB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgaWYgKGlzUGxhaW5PYmplY3QodmFsdWUpKSB7XG4gICAgY29uc3QgZGlyZWN0SWRDYW5kaWRhdGVzID0gW1xuICAgICAgdmFsdWVbJ2lkJ10sXG4gICAgICB2YWx1ZVsnSWQnXSxcbiAgICAgIHZhbHVlWydwZXRJZCddLFxuICAgICAgdmFsdWVbJ1BldElkJ10sXG4gICAgICB2YWx1ZVsnZW51bSddLFxuICAgICAgdmFsdWVbJ0VudW0nXSxcbiAgICAgIHZhbHVlWydFbnUnXSxcbiAgICAgIHZhbHVlWydlbnUnXSxcbiAgICBdO1xuICAgIGZvciAoY29uc3QgY2FuZGlkYXRlIG9mIGRpcmVjdElkQ2FuZGlkYXRlcykge1xuICAgICAgaWYgKGNhbmRpZGF0ZSA9PT0gdW5kZWZpbmVkIHx8IGNhbmRpZGF0ZSA9PT0gbnVsbCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG51bWVyaWMgPSB0b0Zpbml0ZU51bWJlcihjYW5kaWRhdGUsIE5hTik7XG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKG51bWVyaWMpKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnRydW5jKG51bWVyaWMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG5hbWVSYXcgPSB2YWx1ZVsnbmFtZSddID8/IHZhbHVlWydOYW1lJ107XG4gICAgaWYgKHR5cGVvZiBuYW1lUmF3ID09PSAnc3RyaW5nJykge1xuICAgICAgY29uc3Qga2V5ID0gbmFtZVJhdy50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1teYS16MC05XS9nLCAnJyk7XG4gICAgICBjb25zdCBwZXRJZHNCeU5hbWUgPSBtYXBzPy5wZXRJZHNCeU5hbWUgPz8gbWFwcz8uUEVUX0lEU19CWV9OQU1FO1xuICAgICAgY29uc3QgaWQgPSBnZXRCeU5hbWVMb29rdXAocGV0SWRzQnlOYW1lLCBrZXkpO1xuICAgICAgY29uc3QgbnVtZXJpYyA9IHRvSW50T3JOdWxsKGlkKTtcbiAgICAgIGlmIChudW1lcmljICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBudW1lcmljO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uc3QgcyA9IHZhbHVlLnRyaW0oKTtcbiAgICBpZiAocyA9PT0gJycpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBudW1lcmljID0gdG9GaW5pdGVOdW1iZXIocywgTmFOKTtcbiAgICBpZiAoTnVtYmVyLmlzRmluaXRlKG51bWVyaWMpKSB7XG4gICAgICByZXR1cm4gTWF0aC50cnVuYyhudW1lcmljKTtcbiAgICB9XG4gICAgY29uc3Qga2V5ID0gcy50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1teYS16MC05XS9nLCAnJyk7XG4gICAgY29uc3QgcGV0SWRzQnlOYW1lID0gbWFwcz8ucGV0SWRzQnlOYW1lID8/IG1hcHM/LlBFVF9JRFNfQllfTkFNRTtcbiAgICBjb25zdCBpZCA9IGdldEJ5TmFtZUxvb2t1cChwZXRJZHNCeU5hbWUsIGtleSk7XG4gICAgY29uc3QgbWFwcGVkID0gdG9JbnRPck51bGwoaWQpO1xuICAgIGlmIChtYXBwZWQgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBtYXBwZWQ7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgbnVtZXJpYyA9IHRvRmluaXRlTnVtYmVyKHZhbHVlLCBOYU4pO1xuICBpZiAoTnVtYmVyLmlzRmluaXRlKG51bWVyaWMpKSB7XG4gICAgcmV0dXJuIE1hdGgudHJ1bmMobnVtZXJpYyk7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bmlxdWVOdW1iZXJzKHZhbHVlczogdW5rbm93bltdKTogbnVtYmVyW10ge1xuICBjb25zdCBvdXQ6IG51bWJlcltdID0gW107XG4gIGNvbnN0IHNlZW4gPSBuZXcgU2V0PG51bWJlcj4oKTtcbiAgZm9yIChjb25zdCB2IG9mIHZhbHVlcykge1xuICAgIGlmICh2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IG4gPSBOdW1iZXIodik7XG4gICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUobikpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCBub3JtYWxpemVkID0gTWF0aC50cnVuYyhuKTtcbiAgICBpZiAoc2Vlbi5oYXMobm9ybWFsaXplZCkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBzZWVuLmFkZChub3JtYWxpemVkKTtcbiAgICBvdXQucHVzaChub3JtYWxpemVkKTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWJpbGl0eUVudW1zRm9yUGV0KFxuICBwZXRJZDogbnVtYmVyLFxuICBtYXBzPzogUmVwbGF5UGFyc2VyTG9va3VwTWFwcyxcbik6IG51bWJlcltdIHtcbiAgY29uc3QgYWJpbGl0eU1hcCA9IG1hcHM/LmFiaWxpdHlJZHNCeVBldElkID8/IHt9O1xuICBjb25zdCBrZXkgPSBTdHJpbmcocGV0SWQpO1xuICBjb25zdCBtYXBwZWQgPSBBcnJheS5pc0FycmF5KGFiaWxpdHlNYXBba2V5XSkgPyBhYmlsaXR5TWFwW2tleV0gPz8gW10gOiBbXTtcbiAgY29uc3QgZmFsbGJhY2sgPSBBcnJheS5pc0FycmF5KEZBTExCQUNLX0FCSUxJVFlfSURTX0JZX1BFVF9JRFtrZXldKVxuICAgID8gRkFMTEJBQ0tfQUJJTElUWV9JRFNfQllfUEVUX0lEW2tleV1cbiAgICA6IFtdO1xuICByZXR1cm4gdW5pcXVlTnVtYmVycyhbLi4ubWFwcGVkLCAuLi5mYWxsYmFja10pO1xufVxuXG5mdW5jdGlvbiBidWlsZEJlbHVnYVN3YWxsb3dlZEVudHJ5KHN3YWxsb3dlZFJhdzogdW5rbm93bik6IFJlcGxheU1lbW9yeUVudHJ5IHwgbnVsbCB7XG4gIGNvbnN0IHN3YWxsb3dlZFBldElkID0gcmVzb2x2ZVBldElkRnJvbVVua25vd24oc3dhbGxvd2VkUmF3KTtcbiAgaWYgKCFOdW1iZXIuaXNGaW5pdGUoc3dhbGxvd2VkUGV0SWQpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgY29uc3QgZW50cnk6IFJlcGxheU1lbW9yeUVudHJ5ID0geyBFbnU6IHN3YWxsb3dlZFBldElkIH07XG4gIGNvbnN0IHN3YWxsb3dlZCA9IGdldFJlY29yZChzd2FsbG93ZWRSYXcpO1xuICBpZiAoIXN3YWxsb3dlZCkge1xuICAgIHJldHVybiBlbnRyeTtcbiAgfVxuICBjb25zdCBhdHRhY2sgPSB0b0Zpbml0ZU51bWJlcihcbiAgICBzd2FsbG93ZWRbJ2F0dGFjayddID8/IHN3YWxsb3dlZFsnQXQnXSA/PyBzd2FsbG93ZWRbJ2F0J10sXG4gICAgTmFOLFxuICApO1xuICBpZiAoTnVtYmVyLmlzRmluaXRlKGF0dGFjaykpIHtcbiAgICBlbnRyeS5BdCA9IE1hdGgubWF4KDAsIE1hdGgucm91bmQoYXR0YWNrKSk7XG4gIH1cbiAgY29uc3QgaGVhbHRoID0gdG9GaW5pdGVOdW1iZXIoXG4gICAgc3dhbGxvd2VkWydoZWFsdGgnXSA/PyBzd2FsbG93ZWRbJ0hwJ10gPz8gc3dhbGxvd2VkWydocCddLFxuICAgIE5hTixcbiAgKTtcbiAgaWYgKE51bWJlci5pc0Zpbml0ZShoZWFsdGgpKSB7XG4gICAgZW50cnkuSHAgPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKGhlYWx0aCkpO1xuICB9XG4gIGNvbnN0IG1hbmEgPSB0b0Zpbml0ZU51bWJlcihzd2FsbG93ZWRbJ21hbmEnXSA/PyBzd2FsbG93ZWRbJ01hbmEnXSwgTmFOKTtcbiAgaWYgKE51bWJlci5pc0Zpbml0ZShtYW5hKSkge1xuICAgIGVudHJ5Lk1hbmEgPSBNYXRoLm1heCgwLCBNYXRoLnJvdW5kKG1hbmEpKTtcbiAgfVxuICBjb25zdCBsZXZlbCA9IHRvRmluaXRlTnVtYmVyKFxuICAgIHN3YWxsb3dlZFsnbGV2ZWwnXSA/PyBzd2FsbG93ZWRbJ2x2bCddID8/IHN3YWxsb3dlZFsnTHZsJ10sXG4gICAgTmFOLFxuICApO1xuICBpZiAoTnVtYmVyLmlzRmluaXRlKGxldmVsKSkge1xuICAgIGVudHJ5Lkx2bCA9IE1hdGgubWF4KDEsIE1hdGgubWluKDMsIE1hdGgucm91bmQobGV2ZWwpKSk7XG4gIH1cbiAgY29uc3QgZXhwID0gdG9GaW5pdGVOdW1iZXIoc3dhbGxvd2VkWydleHAnXSA/PyBzd2FsbG93ZWRbJ0V4cCddLCBOYU4pO1xuICBpZiAoTnVtYmVyLmlzRmluaXRlKGV4cCkpIHtcbiAgICBlbnRyeS5FeHAgPSBNYXRoLm1heCgwLCBNYXRoLnJvdW5kKGV4cCkpO1xuICB9XG4gIGNvbnN0IHBlcmsgPSBzd2FsbG93ZWRbJ3BlcmsnXSA/PyBzd2FsbG93ZWRbJ1BlcmsnXTtcbiAgY29uc3QgcGVya051bWJlciA9IHRvTnVsbGFibGVOdW1iZXIocGVyayk7XG4gIGlmIChwZXJrTnVtYmVyICE9PSBudWxsKSB7XG4gICAgZW50cnkuUGVyayA9IHBlcmtOdW1iZXI7XG4gIH1cbiAgY29uc3QgdGltZXNIdXJ0ID0gdG9GaW5pdGVOdW1iZXIoXG4gICAgc3dhbGxvd2VkWyd0aW1lc0h1cnQnXSA/PyBzd2FsbG93ZWRbJ1RpbWVzSHVydCddID8/IHN3YWxsb3dlZFsnSHJ0QyddLFxuICAgIE5hTixcbiAgKTtcbiAgaWYgKE51bWJlci5pc0Zpbml0ZSh0aW1lc0h1cnQpKSB7XG4gICAgZW50cnkuSHJ0QyA9IE1hdGgubWF4KDAsIE1hdGgucm91bmQodGltZXNIdXJ0KSk7XG4gIH1cbiAgcmV0dXJuIGVudHJ5O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29sbGVjdEFib21pbmF0aW9uU3dhbGxvd2VkRW50cmllcyhcbiAgcmF3UGV0OiB1bmtub3duLFxuICBtYXBzPzogUmVwbGF5UGFyc2VyTG9va3VwTWFwcyxcbik6IEFib21pbmF0aW9uU3dhbGxvd2VkRW50cnlbXSB7XG4gIGNvbnN0IHNsb3RDb25maWdzOiBBYm9taW5hdGlvblNsb3RDb25maWdbXSA9IFtcbiAgICB7XG4gICAgICBwZXRLZXk6ICdhYm9taW5hdGlvblN3YWxsb3dlZFBldDEnLFxuICAgICAgbGV2ZWxLZXk6ICdhYm9taW5hdGlvblN3YWxsb3dlZFBldDFMZXZlbCcsXG4gICAgICBiZWx1Z2FLZXk6ICdhYm9taW5hdGlvblN3YWxsb3dlZFBldDFCZWx1Z2FTd2FsbG93ZWRQZXQnLFxuICAgICAgc2ZzS2V5OiAnYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxU2FyY2FzdGljRnJpbmdlaGVhZFN3YWxsb3dlZFBldCcsXG4gICAgfSxcbiAgICB7XG4gICAgICBwZXRLZXk6ICdhYm9taW5hdGlvblN3YWxsb3dlZFBldDInLFxuICAgICAgbGV2ZWxLZXk6ICdhYm9taW5hdGlvblN3YWxsb3dlZFBldDJMZXZlbCcsXG4gICAgICBiZWx1Z2FLZXk6ICdhYm9taW5hdGlvblN3YWxsb3dlZFBldDJCZWx1Z2FTd2FsbG93ZWRQZXQnLFxuICAgICAgc2ZzS2V5OiAnYWJvbWluYXRpb25Td2FsbG93ZWRQZXQyU2FyY2FzdGljRnJpbmdlaGVhZFN3YWxsb3dlZFBldCcsXG4gICAgfSxcbiAgICB7XG4gICAgICBwZXRLZXk6ICdhYm9taW5hdGlvblN3YWxsb3dlZFBldDMnLFxuICAgICAgbGV2ZWxLZXk6ICdhYm9taW5hdGlvblN3YWxsb3dlZFBldDNMZXZlbCcsXG4gICAgICBiZWx1Z2FLZXk6ICdhYm9taW5hdGlvblN3YWxsb3dlZFBldDNCZWx1Z2FTd2FsbG93ZWRQZXQnLFxuICAgICAgc2ZzS2V5OiAnYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzU2FyY2FzdGljRnJpbmdlaGVhZFN3YWxsb3dlZFBldCcsXG4gICAgfSxcbiAgXTtcbiAgY29uc3Qgcm9vdCA9IGdldFJlY29yZChyYXdQZXQpO1xuICBjb25zdCBlbnRyaWVzOiBBYm9taW5hdGlvblN3YWxsb3dlZEVudHJ5W10gPSBbXTtcbiAgZm9yIChjb25zdCBzbG90Q29uZmlnIG9mIHNsb3RDb25maWdzKSB7XG4gICAgY29uc3Qgc3dhbGxvd2VkUmF3ID0gcm9vdD8uW3Nsb3RDb25maWcucGV0S2V5XTtcbiAgICBjb25zdCBzd2FsbG93ZWRQZXRJZCA9IHJlc29sdmVQZXRJZEZyb21Vbmtub3duKHN3YWxsb3dlZFJhdywgbWFwcyk7XG4gICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUoc3dhbGxvd2VkUGV0SWQpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgY29uc3Qgc3dhbGxvd2VkUmVjb3JkID0gZ2V0UmVjb3JkKHN3YWxsb3dlZFJhdyk7XG4gICAgY29uc3Qgc3dhbGxvd2VkQWJpbGl0eUVudW1zID0gZ2V0QWJpbGl0eUVudW1zRm9yUGV0KHN3YWxsb3dlZFBldElkLCBtYXBzKTtcbiAgICBjb25zdCBtZW1vcnlFbnRyeSA9XG4gICAgICBidWlsZEJlbHVnYVN3YWxsb3dlZEVudHJ5KHN3YWxsb3dlZFJhdykgPz8gKHsgRW51OiBzd2FsbG93ZWRQZXRJZCB9IGFzIFJlcGxheU1lbW9yeUVudHJ5KTtcbiAgICBjb25zdCBzd2FsbG93ZWRMZXZlbCA9IHRvRmluaXRlTnVtYmVyKHJvb3Q/LltzbG90Q29uZmlnLmxldmVsS2V5XSwgTmFOKTtcbiAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHN3YWxsb3dlZExldmVsKSkge1xuICAgICAgbWVtb3J5RW50cnkuTHZsID0gTWF0aC5tYXgoMSwgTWF0aC5taW4oMywgTWF0aC5yb3VuZChzd2FsbG93ZWRMZXZlbCkpKTtcbiAgICB9XG5cbiAgICBpZiAoc3dhbGxvd2VkUGV0SWQgPT09IDE4Mikge1xuICAgICAgY29uc3QgYmVsdWdhUmF3ID1cbiAgICAgICAgcm9vdD8uW3Nsb3RDb25maWcuYmVsdWdhS2V5XSA/PyBzd2FsbG93ZWRSZWNvcmQ/LlsnYmVsdWdhU3dhbGxvd2VkUGV0J10gPz8gbnVsbDtcbiAgICAgIGNvbnN0IGJlbHVnYUVudHJ5ID0gYnVpbGRCZWx1Z2FTd2FsbG93ZWRFbnRyeShiZWx1Z2FSYXcpO1xuICAgICAgaWYgKGJlbHVnYUVudHJ5KSB7XG4gICAgICAgIGNvbnN0IGJlbHVnYUFiaWxpdHlFbnVtcyA9IGdldEFiaWxpdHlFbnVtc0ZvclBldCgxODIsIG1hcHMpO1xuICAgICAgICBjb25zdCBiZWx1Z2FMaXN0czogUmVjb3JkPHN0cmluZywgUmVwbGF5VW5rbm93blJlY29yZFtdPiA9IHtcbiAgICAgICAgICBXaGl0ZVdoYWxlQWJpbGl0eTogW3sgLi4uYmVsdWdhRW50cnkgfV0sXG4gICAgICAgIH07XG4gICAgICAgIGZvciAoY29uc3QgYWJpbGl0eUVudW0gb2YgYmVsdWdhQWJpbGl0eUVudW1zKSB7XG4gICAgICAgICAgYmVsdWdhTGlzdHNbU3RyaW5nKGFiaWxpdHlFbnVtKV0gPSBbeyAuLi5iZWx1Z2FFbnRyeSB9XTtcbiAgICAgICAgfVxuICAgICAgICBtZW1vcnlFbnRyeS5NaU1zID0geyBMc3RzOiBiZWx1Z2FMaXN0cyB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzd2FsbG93ZWRQZXRJZCA9PT0gNzYzKSB7XG4gICAgICBjb25zdCBzZnNSYXcgPVxuICAgICAgICByb290Py5bc2xvdENvbmZpZy5zZnNLZXldID8/XG4gICAgICAgIHN3YWxsb3dlZFJlY29yZD8uWydzYXJjYXN0aWNGcmluZ2VoZWFkU3dhbGxvd2VkUGV0J10gPz9cbiAgICAgICAgbnVsbDtcbiAgICAgIGNvbnN0IHNmc0VudHJ5ID0gYnVpbGRCZWx1Z2FTd2FsbG93ZWRFbnRyeShzZnNSYXcpO1xuICAgICAgaWYgKHNmc0VudHJ5KSB7XG4gICAgICAgIGNvbnN0IHNmc0xpc3RzOiBSZWNvcmQ8c3RyaW5nLCBSZXBsYXlVbmtub3duUmVjb3JkW10+ID0ge1xuICAgICAgICAgIFNhcmNhc3RpY0ZyaW5nZWhlYWRBYmlsaXR5OiBbeyAuLi5zZnNFbnRyeSB9XSxcbiAgICAgICAgfTtcbiAgICAgICAgbWVtb3J5RW50cnkuTWlNcyA9IHsgTHN0czogc2ZzTGlzdHMgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbnRyaWVzLnB1c2goe1xuICAgICAgc3dhbGxvd2VkUGV0SWQsXG4gICAgICBzd2FsbG93ZWRBYmlsaXR5RW51bXMsXG4gICAgICBtZW1vcnlFbnRyeSxcbiAgICAgIGJlbHVnYVN3YWxsb3dlZEVudHJ5OiBtZW1vcnlFbnRyeS5NaU1zID8/IG51bGwsXG4gICAgfSk7XG4gIH1cblxuICBjb25zdCBzd2FsbG93ZWRDYW5kaWRhdGVzID0gQXJyYXkuaXNBcnJheShyb290Py5bJ2Fib21pbmF0aW9uU3dhbGxvd2VkUGV0cyddKVxuICAgID8gKHJvb3Q/LlsnYWJvbWluYXRpb25Td2FsbG93ZWRQZXRzJ10gYXMgdW5rbm93bltdKVxuICAgIDogW107XG4gIGZvciAoY29uc3Qgc3dhbGxvd2VkIG9mIHN3YWxsb3dlZENhbmRpZGF0ZXMpIHtcbiAgICBjb25zdCBzd2FsbG93ZWRQZXRJZCA9IHJlc29sdmVQZXRJZEZyb21Vbmtub3duKHN3YWxsb3dlZCwgbWFwcyk7XG4gICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUoc3dhbGxvd2VkUGV0SWQpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgY29uc3Qgc3dhbGxvd2VkQWJpbGl0eUVudW1zID0gZ2V0QWJpbGl0eUVudW1zRm9yUGV0KHN3YWxsb3dlZFBldElkLCBtYXBzKTtcbiAgICBlbnRyaWVzLnB1c2goe1xuICAgICAgc3dhbGxvd2VkUGV0SWQsXG4gICAgICBzd2FsbG93ZWRBYmlsaXR5RW51bXMsXG4gICAgICBtZW1vcnlFbnRyeTpcbiAgICAgICAgYnVpbGRCZWx1Z2FTd2FsbG93ZWRFbnRyeShzd2FsbG93ZWQpID8/XG4gICAgICAgICh7IEVudTogc3dhbGxvd2VkUGV0SWQgfSBhcyBSZXBsYXlNZW1vcnlFbnRyeSksXG4gICAgICBiZWx1Z2FTd2FsbG93ZWRFbnRyeTogbnVsbCxcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBlbnRyaWVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5mZXJBYm9taW5hdGlvbkFiaWxpdHlFbnVtc0Zyb21Td2FsbG93ZWRQZXRzKFxuICByYXdQZXQ6IHVua25vd24sXG4gIG1hcHM/OiBSZXBsYXlQYXJzZXJMb29rdXBNYXBzLFxuKTogbnVtYmVyW10ge1xuICBjb25zdCBlbnRyaWVzID0gY29sbGVjdEFib21pbmF0aW9uU3dhbGxvd2VkRW50cmllcyhyYXdQZXQsIG1hcHMpO1xuICBjb25zdCBhYmlsaXR5RW51bXM6IG51bWJlcltdID0gW107XG4gIGZvciAoY29uc3QgZW50cnkgb2YgZW50cmllcykge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGVudHJ5LnN3YWxsb3dlZEFiaWxpdHlFbnVtcykpIHtcbiAgICAgIGFiaWxpdHlFbnVtcy5wdXNoKC4uLmVudHJ5LnN3YWxsb3dlZEFiaWxpdHlFbnVtcyk7XG4gICAgfVxuICB9XG4gIHJldHVybiB1bmlxdWVOdW1iZXJzKGFiaWxpdHlFbnVtcyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbmZlckFib21pbmF0aW9uQWJpbGl0eUxldmVsc0Zyb21Td2FsbG93ZWRQZXRzKFxuICByYXdQZXQ6IHVua25vd24sXG4gIG1hcHM/OiBSZXBsYXlQYXJzZXJMb29rdXBNYXBzLFxuKTogUmVjb3JkPHN0cmluZywgbnVtYmVyPiB7XG4gIGNvbnN0IGVudHJpZXMgPSBjb2xsZWN0QWJvbWluYXRpb25Td2FsbG93ZWRFbnRyaWVzKHJhd1BldCwgbWFwcyk7XG4gIGNvbnN0IGxldmVsQnlBYmlsaXR5OiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+ID0ge307XG4gIGNvbnN0IGZhbGxiYWNrTGV2ZWwgPSAxO1xuICBmb3IgKGNvbnN0IGVudHJ5IG9mIGVudHJpZXMpIHtcbiAgICBjb25zdCBzd2FsbG93ZWRMZXZlbCA9IHRvRmluaXRlTnVtYmVyKGVudHJ5Lm1lbW9yeUVudHJ5Py5MdmwsIE5hTik7XG4gICAgY29uc3Qgbm9ybWFsaXplZExldmVsID0gTnVtYmVyLmlzRmluaXRlKHN3YWxsb3dlZExldmVsKVxuICAgICAgPyBNYXRoLm1heCgxLCBNYXRoLm1pbigzLCBNYXRoLnJvdW5kKHN3YWxsb3dlZExldmVsKSkpXG4gICAgICA6IGZhbGxiYWNrTGV2ZWw7XG4gICAgY29uc3Qgc3dhbGxvd2VkQWJpbGl0eUVudW1zID0gdW5pcXVlTnVtYmVycyhcbiAgICAgIEFycmF5LmlzQXJyYXkoZW50cnkuc3dhbGxvd2VkQWJpbGl0eUVudW1zKVxuICAgICAgICA/IGVudHJ5LnN3YWxsb3dlZEFiaWxpdHlFbnVtc1xuICAgICAgICA6IFtdLFxuICAgICk7XG4gICAgZm9yIChjb25zdCBhYmlsaXR5RW51bSBvZiBzd2FsbG93ZWRBYmlsaXR5RW51bXMpIHtcbiAgICAgIGNvbnN0IGtleSA9IFN0cmluZyhhYmlsaXR5RW51bSk7XG4gICAgICBjb25zdCBleGlzdGluZyA9IHRvRmluaXRlTnVtYmVyKGxldmVsQnlBYmlsaXR5W2tleV0sIE5hTik7XG4gICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShleGlzdGluZykgfHwgbm9ybWFsaXplZExldmVsID4gZXhpc3RpbmcpIHtcbiAgICAgICAgbGV2ZWxCeUFiaWxpdHlba2V5XSA9IG5vcm1hbGl6ZWRMZXZlbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGxldmVsQnlBYmlsaXR5O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5mZXJBYm9taW5hdGlvbkFiaWxpdHlFbnVtRnJvbVN3YWxsb3dlZFBldHMoXG4gIHJhd1BldDogdW5rbm93bixcbiAgbWFwcz86IFJlcGxheVBhcnNlckxvb2t1cE1hcHMsXG4pOiBudW1iZXIgfCBudWxsIHtcbiAgY29uc3QgaW5mZXJyZWQgPSBpbmZlckFib21pbmF0aW9uQWJpbGl0eUVudW1zRnJvbVN3YWxsb3dlZFBldHMocmF3UGV0LCBtYXBzKTtcbiAgcmV0dXJuIGluZmVycmVkLmxlbmd0aCA+IDAgPyBpbmZlcnJlZFswXSA6IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQcmltYXJ5QWJpbGl0eUVudW1Gb3JNZW1vcnkoXG4gIHJhd1BldDogdW5rbm93bixcbiAgcGV0SWQ6IG51bWJlcixcbiAgbWFwcz86IFJlcGxheVBhcnNlckxvb2t1cE1hcHMsXG4pOiBudW1iZXIgfCBudWxsIHtcbiAgY29uc3QgcGV0ID0gZ2V0UmVjb3JkKHJhd1BldCk7XG4gIGNvbnN0IGFiaWwgPSBBcnJheS5pc0FycmF5KHBldD8uWydBYmlsJ10pID8gKHBldD8uWydBYmlsJ10gYXMgdW5rbm93bltdKSA6IFtdO1xuICBjb25zdCBhYmlsaXRpZXMgPSBBcnJheS5pc0FycmF5KHBldD8uWydhYmlsaXRpZXMnXSlcbiAgICA/IChwZXQ/LlsnYWJpbGl0aWVzJ10gYXMgdW5rbm93bltdKVxuICAgIDogW107XG4gIGNvbnN0IGRpcmVjdENhbmRpZGF0ZXMgPSBbXG4gICAgcGV0Py5bJ2FiaWxpdHlFbnVtJ10sXG4gICAgcGV0Py5bJ2FiaWxpdHlJZCddLFxuICAgIGdldFJlY29yZChhYmlsWzBdKT8uWydFbnUnXSxcbiAgICBnZXRSZWNvcmQoYWJpbGl0aWVzWzBdKT8uWydFbnUnXSxcbiAgXTtcbiAgZm9yIChjb25zdCBjYW5kaWRhdGUgb2YgZGlyZWN0Q2FuZGlkYXRlcykge1xuICAgIGNvbnN0IG51bSA9IHRvRmluaXRlTnVtYmVyKGNhbmRpZGF0ZSwgTmFOKTtcbiAgICBpZiAoTnVtYmVyLmlzRmluaXRlKG51bSkpIHtcbiAgICAgIHJldHVybiBNYXRoLnRydW5jKG51bSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHBldElkID09PSAzNzMgfHwgcGV0SWQgPT09IDMzOCkge1xuICAgIGNvbnN0IGluZmVycmVkID0gaW5mZXJBYm9taW5hdGlvbkFiaWxpdHlFbnVtRnJvbVN3YWxsb3dlZFBldHMocmF3UGV0LCBtYXBzKTtcbiAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGluZmVycmVkKSkge1xuICAgICAgcmV0dXJuIE1hdGgudHJ1bmMoaW5mZXJyZWQpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG1hcHBlZCA9IGdldEFiaWxpdHlFbnVtc0ZvclBldChwZXRJZCwgbWFwcyk7XG4gIHJldHVybiBtYXBwZWQubGVuZ3RoID4gMCA/IG1hcHBlZFswXSA6IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZEFib21pbmF0aW9uTWVtb3J5KFxuICByYXdQZXQ6IHVua25vd24sXG4gIHBldElkOiBudW1iZXIsXG4gIG1hcHM/OiBSZXBsYXlQYXJzZXJMb29rdXBNYXBzLFxuKTogUmVwbGF5TWVtb3J5UGF5bG9hZCB8IG51bGwge1xuICBjb25zdCBzd2FsbG93ZWRFbnRyaWVzID0gY29sbGVjdEFib21pbmF0aW9uU3dhbGxvd2VkRW50cmllcyhyYXdQZXQsIG1hcHMpO1xuICBpZiAoc3dhbGxvd2VkRW50cmllcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBjb25zdCBmYWxsYmFja0FiaWxpdHlFbnVtID0gZ2V0UHJpbWFyeUFiaWxpdHlFbnVtRm9yTWVtb3J5KHJhd1BldCwgcGV0SWQsIG1hcHMpO1xuICBjb25zdCBmYWxsYmFja0xpc3QgPVxuICAgIGZhbGxiYWNrQWJpbGl0eUVudW0gIT09IG51bGwgPyBbTWF0aC50cnVuYyhmYWxsYmFja0FiaWxpdHlFbnVtKV0gOiBbXTtcbiAgY29uc3QgbGlzdHM6IFJlY29yZDxzdHJpbmcsIFJlcGxheVVua25vd25SZWNvcmRbXT4gPSB7fTtcbiAgZm9yIChjb25zdCBlbnRyeSBvZiBzd2FsbG93ZWRFbnRyaWVzKSB7XG4gICAgY29uc3Qgb3duRW51bXMgPSB1bmlxdWVOdW1iZXJzKFxuICAgICAgQXJyYXkuaXNBcnJheShlbnRyeS5zd2FsbG93ZWRBYmlsaXR5RW51bXMpID8gZW50cnkuc3dhbGxvd2VkQWJpbGl0eUVudW1zIDogW10sXG4gICAgKTtcbiAgICBjb25zdCBrZXlFbnVtcyA9IG93bkVudW1zLmxlbmd0aCA+IDAgPyBvd25FbnVtcyA6IGZhbGxiYWNrTGlzdDtcbiAgICBpZiAoa2V5RW51bXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBhYmlsaXR5RW51bSBvZiBrZXlFbnVtcykge1xuICAgICAgY29uc3Qga2V5ID0gU3RyaW5nKGFiaWxpdHlFbnVtKTtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShsaXN0c1trZXldKSkge1xuICAgICAgICBsaXN0c1trZXldID0gW107XG4gICAgICB9XG4gICAgICBjb25zdCB1c2VCZWx1Z2EgPVxuICAgICAgICBlbnRyeS5zd2FsbG93ZWRQZXRJZCA9PT0gMTgyICYmXG4gICAgICAgIEFycmF5LmlzQXJyYXkoZW50cnkuc3dhbGxvd2VkQWJpbGl0eUVudW1zKSAmJlxuICAgICAgICBlbnRyeS5zd2FsbG93ZWRBYmlsaXR5RW51bXMuaW5jbHVkZXMoYWJpbGl0eUVudW0pICYmXG4gICAgICAgIGVudHJ5LmJlbHVnYVN3YWxsb3dlZEVudHJ5O1xuICAgICAgY29uc3QgcGF5bG9hZCA9IHVzZUJlbHVnYVxuICAgICAgICA/IChlbnRyeS5iZWx1Z2FTd2FsbG93ZWRFbnRyeSBhcyB1bmtub3duIGFzIFJlcGxheVVua25vd25SZWNvcmQpXG4gICAgICAgIDogKGVudHJ5Lm1lbW9yeUVudHJ5IGFzIFJlcGxheVVua25vd25SZWNvcmQpO1xuICAgICAgbGlzdHNba2V5XS5wdXNoKHBheWxvYWQpO1xuICAgIH1cbiAgfVxuICBpZiAoT2JqZWN0LmtleXMobGlzdHMpLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiB7IExzdHM6IGxpc3RzIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZEJlbHVnYU1lbW9yeShcbiAgcmF3UGV0OiB1bmtub3duLFxuICBwZXRJZDogbnVtYmVyLFxuICBtYXBzPzogUmVwbGF5UGFyc2VyTG9va3VwTWFwcyxcbik6IFJlcGxheU1lbW9yeVBheWxvYWQgfCBudWxsIHtcbiAgY29uc3QgcGV0ID0gZ2V0UmVjb3JkKHJhd1BldCk7XG4gIGNvbnN0IHN3YWxsb3dlZFJhdyA9IHBldD8uWydiZWx1Z2FTd2FsbG93ZWRQZXQnXSA/PyBwZXQ/Llsnc3dhbGxvd2VkUGV0J10gPz8gbnVsbDtcbiAgY29uc3Qgc3dhbGxvd2VkRW50cnkgPSBidWlsZEJlbHVnYVN3YWxsb3dlZEVudHJ5KHN3YWxsb3dlZFJhdyk7XG4gIGlmICghc3dhbGxvd2VkRW50cnkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBjb25zdCBtYXBwZWQgPSBnZXRBYmlsaXR5RW51bXNGb3JQZXQocGV0SWQsIG1hcHMpO1xuICBjb25zdCBwcmltYXJ5ID0gZ2V0UHJpbWFyeUFiaWxpdHlFbnVtRm9yTWVtb3J5KHJhd1BldCwgcGV0SWQsIG1hcHMpO1xuICBjb25zdCBiZWx1Z2FBYmlsaXR5RW51bXMgPVxuICAgIG1hcHBlZC5sZW5ndGggPiAwXG4gICAgICA/IG1hcHBlZFxuICAgICAgOiBwcmltYXJ5ICE9PSBudWxsXG4gICAgICAgID8gW01hdGgudHJ1bmMocHJpbWFyeSldXG4gICAgICAgIDogW107XG4gIGlmIChiZWx1Z2FBYmlsaXR5RW51bXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgY29uc3QgbGlzdHM6IFJlY29yZDxzdHJpbmcsIFJlcGxheVVua25vd25SZWNvcmRbXT4gPSB7XG4gICAgV2hpdGVXaGFsZUFiaWxpdHk6IFt7IC4uLnN3YWxsb3dlZEVudHJ5IH1dLFxuICB9O1xuICBmb3IgKGNvbnN0IGFiaWxpdHlFbnVtIG9mIGJlbHVnYUFiaWxpdHlFbnVtcykge1xuICAgIGxpc3RzW1N0cmluZyhhYmlsaXR5RW51bSldID0gW3sgLi4uc3dhbGxvd2VkRW50cnkgfV07XG4gIH1cbiAgcmV0dXJuIHsgTHN0czogbGlzdHMgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkU2FyY2FzdGljRnJpbmdlaGVhZE1lbW9yeShcbiAgcmF3UGV0OiB1bmtub3duLFxuICBfcGV0SWQ6IG51bWJlcixcbiAgX21hcHM/OiBSZXBsYXlQYXJzZXJMb29rdXBNYXBzLFxuKTogUmVwbGF5TWVtb3J5UGF5bG9hZCB8IG51bGwge1xuICBjb25zdCBwZXQgPSBnZXRSZWNvcmQocmF3UGV0KTtcbiAgY29uc3Qgc3dhbGxvd2VkUmF3ID0gcGV0Py5bJ3NhcmNhc3RpY0ZyaW5nZWhlYWRTd2FsbG93ZWRQZXQnXSA/PyBudWxsO1xuICBjb25zdCBzd2FsbG93ZWRFbnRyeSA9IGJ1aWxkQmVsdWdhU3dhbGxvd2VkRW50cnkoc3dhbGxvd2VkUmF3KTtcbiAgaWYgKCFzd2FsbG93ZWRFbnRyeSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGlmICghTnVtYmVyLmlzRmluaXRlKHRvRmluaXRlTnVtYmVyKHN3YWxsb3dlZEVudHJ5Lkx2bCwgTmFOKSkpIHtcbiAgICBzd2FsbG93ZWRFbnRyeS5MdmwgPSAxO1xuICB9XG4gIGlmICghTnVtYmVyLmlzRmluaXRlKHRvRmluaXRlTnVtYmVyKHN3YWxsb3dlZEVudHJ5LkF0LCBOYU4pKSkge1xuICAgIHN3YWxsb3dlZEVudHJ5LkF0ID0gMTtcbiAgfVxuICBpZiAoIU51bWJlci5pc0Zpbml0ZSh0b0Zpbml0ZU51bWJlcihzd2FsbG93ZWRFbnRyeS5IcCwgTmFOKSkpIHtcbiAgICBzd2FsbG93ZWRFbnRyeS5IcCA9IDE7XG4gIH1cbiAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc3dhbGxvd2VkRW50cnksICdNYW5hJykpIHtcbiAgICBzd2FsbG93ZWRFbnRyeS5NYW5hID0gbnVsbDtcbiAgfVxuICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzd2FsbG93ZWRFbnRyeSwgJ1BlcmsnKSkge1xuICAgIHN3YWxsb3dlZEVudHJ5LlBlcmsgPSBudWxsO1xuICB9XG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHN3YWxsb3dlZEVudHJ5LCAnRXhwJykpIHtcbiAgICBzd2FsbG93ZWRFbnRyeS5FeHAgPSBudWxsO1xuICB9XG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHN3YWxsb3dlZEVudHJ5LCAnUG93YScpKSB7XG4gICAgc3dhbGxvd2VkRW50cnkuUG93YSA9IG51bGw7XG4gIH1cbiAgcmV0dXJuIHsgTHN0czogeyBTYXJjYXN0aWNGcmluZ2VoZWFkQWJpbGl0eTogW3sgLi4uc3dhbGxvd2VkRW50cnkgfV0gfSB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRBYmlsaXR5RW50cnkoXG4gIGFiaWxpdHlFbnVtOiBudW1iZXIsXG4gIGxldmVsOiBudW1iZXIsXG4gIHRyaWdnZXJzQ29uc3VtZWQgPSAwLFxuKTogUmVwbGF5QWJpbGl0eUVudHJ5IHtcbiAgY29uc3Qgbm9ybWFsaXplZFRyaWdnZXJzID0gTnVtYmVyLmlzRmluaXRlKHRyaWdnZXJzQ29uc3VtZWQpXG4gICAgPyBNYXRoLm1heCgwLCBNYXRoLnJvdW5kKHRyaWdnZXJzQ29uc3VtZWQpKVxuICAgIDogMDtcbiAgcmV0dXJuIHtcbiAgICBFbnU6IGFiaWxpdHlFbnVtLFxuICAgIEx2bDogbGV2ZWwsXG4gICAgTmF0OiB0cnVlLFxuICAgIER1cjogMCxcbiAgICBUckNvOiBub3JtYWxpemVkVHJpZ2dlcnMsXG4gICAgQ2hhcjogbnVsbCxcbiAgICBEaXM6IGZhbHNlLFxuICAgIEFJTUw6IGZhbHNlLFxuICB9O1xufVxuXG5mdW5jdGlvbiBmaW5kRmluaXRlTnVtYmVyQnlLZXlQcmVkaWNhdGUoXG4gIHNvdXJjZTogdW5rbm93bixcbiAga2V5UHJlZGljYXRlOiAoazogc3RyaW5nKSA9PiBib29sZWFuLFxuKTogbnVtYmVyIHwgbnVsbCB7XG4gIGNvbnN0IHJlY29yZCA9IGdldFJlY29yZChzb3VyY2UpO1xuICBpZiAoIXJlY29yZCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHJlY29yZCkpIHtcbiAgICBpZiAoIWtleVByZWRpY2F0ZShrZXkpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgY29uc3QgbiA9IHRvRmluaXRlTnVtYmVyKHZhbHVlLCBOYU4pO1xuICAgIGlmIChOdW1iZXIuaXNGaW5pdGUobikpIHtcbiAgICAgIHJldHVybiBuO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRyaWdnZXJzQ29uc3VtZWRGcm9tUmF3UGV0KHJhd1BldDogdW5rbm93bik6IG51bWJlciB8IG51bGwge1xuICBjb25zdCBwZXQgPSBnZXRSZWNvcmQocmF3UGV0KTtcbiAgY29uc3QgZGlyZWN0ID0gW1xuICAgIHBldD8uWyd0cmlnZ2Vyc0NvbnN1bWVkJ10sXG4gICAgcGV0Py5bJ1RyQ28nXSxcbiAgICBwZXQ/LlsndHJjbyddLFxuICAgIHBldD8uWyd0cmlnZ2VyQ29uc3VtZWQnXSxcbiAgXTtcbiAgZm9yIChjb25zdCBjYW5kaWRhdGUgb2YgZGlyZWN0KSB7XG4gICAgY29uc3QgbiA9IHRvRmluaXRlTnVtYmVyKGNhbmRpZGF0ZSwgTmFOKTtcbiAgICBpZiAoTnVtYmVyLmlzRmluaXRlKG4pKSB7XG4gICAgICByZXR1cm4gTWF0aC5tYXgoMCwgTWF0aC5yb3VuZChuKSk7XG4gICAgfVxuICB9XG4gIGNvbnN0IHByZWRpY2F0ZSA9IChrZXk6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBrZXkudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBoYXNUcmlnZ2VyID1cbiAgICAgIG5vcm1hbGl6ZWQuaW5jbHVkZXMoJ3RyaWdnZXInKSB8fCBub3JtYWxpemVkLmluY2x1ZGVzKCd0cmlnJyk7XG4gICAgY29uc3QgaGFzQ29uc3VtZWQgPSBub3JtYWxpemVkLmluY2x1ZGVzKCdjb25zdW0nKTtcbiAgICBjb25zdCBpc0FiYnJldiA9IFsndHJnYycsICd0cmdjbicsICd0cmMnLCAndHJjbicsICd0cmNvJ10uaW5jbHVkZXMobm9ybWFsaXplZCk7XG4gICAgcmV0dXJuIChoYXNUcmlnZ2VyICYmIGhhc0NvbnN1bWVkKSB8fCBpc0FiYnJldjtcbiAgfTtcbiAgY29uc3Qgb2JqZWN0Q2FuZGlkYXRlcyA9IFtwZXQsIGdldFJlY29yZChwZXQ/LlsncG93J10pLCBnZXRSZWNvcmQocGV0Py5bJ1BvdyddKV07XG4gIGZvciAoY29uc3QgY2FuZGlkYXRlIG9mIG9iamVjdENhbmRpZGF0ZXMpIHtcbiAgICBjb25zdCBuID0gZmluZEZpbml0ZU51bWJlckJ5S2V5UHJlZGljYXRlKGNhbmRpZGF0ZSwgcHJlZGljYXRlKTtcbiAgICBpZiAoTnVtYmVyLmlzRmluaXRlKG4pKSB7XG4gICAgICByZXR1cm4gTWF0aC5tYXgoMCwgTWF0aC5yb3VuZChuKSk7XG4gICAgfVxuICB9XG4gIGNvbnN0IGFiaWxpdGllcyA9IEFycmF5LmlzQXJyYXkocGV0Py5bJ2FiaWxpdGllcyddKVxuICAgID8gKHBldD8uWydhYmlsaXRpZXMnXSBhcyB1bmtub3duW10pXG4gICAgOiBbXTtcbiAgY29uc3QgYWJpbCA9IEFycmF5LmlzQXJyYXkocGV0Py5bJ0FiaWwnXSkgPyAocGV0Py5bJ0FiaWwnXSBhcyB1bmtub3duW10pIDogW107XG4gIGNvbnN0IGFiaWxpdHlWYWx1ZXM6IG51bWJlcltdID0gW107XG4gIGZvciAoY29uc3QgYWJpbGl0eUFycmF5IG9mIFthYmlsaXRpZXMsIGFiaWxdKSB7XG4gICAgZm9yIChjb25zdCBhYmlsaXR5IG9mIGFiaWxpdHlBcnJheSkge1xuICAgICAgY29uc3QgbiA9IGZpbmRGaW5pdGVOdW1iZXJCeUtleVByZWRpY2F0ZShhYmlsaXR5LCBwcmVkaWNhdGUpO1xuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShuKSkge1xuICAgICAgICBhYmlsaXR5VmFsdWVzLnB1c2gobik7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmIChhYmlsaXR5VmFsdWVzLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoMCwgTWF0aC5yb3VuZChNYXRoLm1heCguLi5hYmlsaXR5VmFsdWVzKSkpO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGltZXNIdXJ0RnJvbVJhd1BldChyYXdQZXQ6IHVua25vd24pOiBudW1iZXIgfCBudWxsIHtcbiAgY29uc3QgcGV0ID0gZ2V0UmVjb3JkKHJhd1BldCk7XG4gIGNvbnN0IHBvdyA9IGdldFJlY29yZChwZXQ/LlsnUG93J10pO1xuICBjb25zdCBwb3dMb3dlciA9IGdldFJlY29yZChwZXQ/LlsncG93J10pO1xuICBjb25zdCBkaXJlY3QgPSBbXG4gICAgcGV0Py5bJ3RpbWVzSHVydCddLFxuICAgIHBldD8uWydUaW1lc0h1cnQnXSxcbiAgICBwZXQ/LlsnSHJ0QyddLFxuICAgIHBldD8uWydocnRjJ10sXG4gICAgcG93Py5bJ1NhYmVydG9vdGhUaWdlckFiaWxpdHknXSxcbiAgICBwb3dMb3dlcj8uWydTYWJlcnRvb3RoVGlnZXJBYmlsaXR5J10sXG4gIF07XG4gIGZvciAoY29uc3QgY2FuZGlkYXRlIG9mIGRpcmVjdCkge1xuICAgIGNvbnN0IG4gPSB0b0Zpbml0ZU51bWJlcihjYW5kaWRhdGUsIE5hTik7XG4gICAgaWYgKE51bWJlci5pc0Zpbml0ZShuKSkge1xuICAgICAgcmV0dXJuIE1hdGgubWF4KDAsIE1hdGgucm91bmQobikpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNwZWxsQ291bnRGcm9tUmF3UGV0KHJhd1BldDogdW5rbm93bik6IG51bWJlciB7XG4gIGNvbnN0IHBldCA9IGdldFJlY29yZChyYXdQZXQpO1xuICBjb25zdCBkaXJlY3QgPSBbXG4gICAgcGV0Py5bJ3NwZWxsQ291bnQnXSxcbiAgICBwZXQ/Llsnc3BlbGxzQ2FzdCddLFxuICAgIHBldD8uWydzcGVsbHNDYXN0VGhpc1R1cm4nXSxcbiAgICBwZXQ/LlsnU3BDVCddLFxuICBdO1xuICBmb3IgKGNvbnN0IGNhbmRpZGF0ZSBvZiBkaXJlY3QpIHtcbiAgICBjb25zdCBuID0gdG9GaW5pdGVOdW1iZXIoY2FuZGlkYXRlLCBOYU4pO1xuICAgIGlmIChOdW1iZXIuaXNGaW5pdGUobikpIHtcbiAgICAgIHJldHVybiBNYXRoLm1heCgwLCBNYXRoLnJvdW5kKG4pKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIDA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUb3lOYW1lKHJhd1RveTogdW5rbm93bik6IHN0cmluZyB8IG51bGwge1xuICBpZiAodHlwZW9mIHJhd1RveSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gcmF3VG95O1xuICB9XG4gIGNvbnN0IHRveSA9IGdldFJlY29yZChyYXdUb3kpO1xuICByZXR1cm4gdHlwZW9mIHRveT8uWyduYW1lJ10gPT09ICdzdHJpbmcnID8gdG95WyduYW1lJ10gOiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVRveUlkKFxuICByYXdUb3k6IHVua25vd24sXG4gIG1hcHM/OiBSZXBsYXlQYXJzZXJMb29rdXBNYXBzLFxuKTogbnVtYmVyIHwgbnVsbCB7XG4gIGlmIChyYXdUb3kgPT09IG51bGwgfHwgcmF3VG95ID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBjb25zdCB0b3kgPSBnZXRSZWNvcmQocmF3VG95KTtcbiAgaWYgKHRveSkge1xuICAgIGNvbnN0IGRpcmVjdCA9IFtcbiAgICAgIHRveVsnaWQnXSxcbiAgICAgIHRveVsnSWQnXSxcbiAgICAgIHRveVsndG95SWQnXSxcbiAgICAgIHRveVsndG95SUQnXSxcbiAgICAgIHRveVsnZW51bSddLFxuICAgICAgdG95WydFbnUnXSxcbiAgICBdO1xuICAgIGZvciAoY29uc3QgY2FuZGlkYXRlIG9mIGRpcmVjdCkge1xuICAgICAgY29uc3QgbiA9IHRvRmluaXRlTnVtYmVyKGNhbmRpZGF0ZSwgTmFOKTtcbiAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUobikpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgudHJ1bmMobik7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGNvbnN0IHRveU5hbWUgPSBnZXRUb3lOYW1lKHJhd1RveSkgPz8gcmF3VG95O1xuICBjb25zdCBsb29rdXBLZXkgPVxuICAgIHR5cGVvZiB0b3lOYW1lID09PSAnc3RyaW5nJ1xuICAgICAgPyB0b3lOYW1lLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvW15hLXowLTldL2csICcnKVxuICAgICAgOiAnJztcbiAgaWYgKCFsb29rdXBLZXkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBjb25zdCBtYXBwZWQgPSB0b0ludE9yTnVsbChtYXBzPy50b3lJZHNCeU5hbWU/Lltsb29rdXBLZXldKTtcbiAgaWYgKG1hcHBlZCAhPT0gbnVsbCkge1xuICAgIHJldHVybiBtYXBwZWQ7XG4gIH1cbiAgY29uc3QgZmFsbGJhY2sgPSBGQUxMQkFDS19UT1lfSURTX0JZX05BTUVbbG9va3VwS2V5XTtcbiAgcmV0dXJuIE51bWJlci5pc0Zpbml0ZShmYWxsYmFjaykgPyBmYWxsYmFjayA6IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlVG95QWJpbGl0eUVudW0oXG4gIHJhd1RveTogdW5rbm93bixcbiAgdG95SWQ6IG51bWJlciB8IG51bGwsXG4pOiBudW1iZXIgfCBudWxsIHtcbiAgY29uc3QgdG95ID0gZ2V0UmVjb3JkKHJhd1RveSk7XG4gIGlmICh0b3kpIHtcbiAgICBjb25zdCBhYmlsID0gQXJyYXkuaXNBcnJheSh0b3lbJ0FiaWwnXSkgPyAodG95WydBYmlsJ10gYXMgdW5rbm93bltdKSA6IFtdO1xuICAgIGNvbnN0IGFiaWxpdGllcyA9IEFycmF5LmlzQXJyYXkodG95WydhYmlsaXRpZXMnXSlcbiAgICAgID8gKHRveVsnYWJpbGl0aWVzJ10gYXMgdW5rbm93bltdKVxuICAgICAgOiBbXTtcbiAgICBjb25zdCBkaXJlY3QgPSBbXG4gICAgICB0b3lbJ2FiaWxpdHlFbnVtJ10sXG4gICAgICB0b3lbJ2FiaWxpdHlJZCddLFxuICAgICAgZ2V0UmVjb3JkKGFiaWxbMF0pPy5bJ0VudSddLFxuICAgICAgZ2V0UmVjb3JkKGFiaWxpdGllc1swXSk/LlsnRW51J10sXG4gICAgXTtcbiAgICBmb3IgKGNvbnN0IGNhbmRpZGF0ZSBvZiBkaXJlY3QpIHtcbiAgICAgIGNvbnN0IG4gPSB0b0Zpbml0ZU51bWJlcihjYW5kaWRhdGUsIE5hTik7XG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKG4pKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnRydW5jKG4pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoTnVtYmVyLmlzRmluaXRlKE51bWJlcih0b3lJZCkpKSB7XG4gICAgcmV0dXJuIE1hdGgudHJ1bmMoTnVtYmVyKHRveUlkKSArIDMyKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVUb3lVc2VzTGVmdChyYXdUb3k6IHVua25vd24sIHRveUxldmVsOiBudW1iZXIpOiBudW1iZXIge1xuICBjb25zdCB0b3kgPSBnZXRSZWNvcmQocmF3VG95KTtcbiAgaWYgKHRveSkge1xuICAgIGNvbnN0IGRpcmVjdCA9IFt0b3lbJ2NvdSddLCB0b3lbJ0NvdSddLCB0b3lbJ3VzZXNMZWZ0J10sIHRveVsnY2hhcmdlcyddXTtcbiAgICBmb3IgKGNvbnN0IGNhbmRpZGF0ZSBvZiBkaXJlY3QpIHtcbiAgICAgIGNvbnN0IG4gPSB0b0Zpbml0ZU51bWJlcihjYW5kaWRhdGUsIE5hTik7XG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKG4pKSB7XG4gICAgICAgIHJldHVybiBNYXRoLm1heCgwLCBNYXRoLnJvdW5kKG4pKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIE1hdGgubWF4KDEsIDMgLSB0b3lMZXZlbCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlVG95SGVhbHRoUGVybShyYXdUb3k6IHVua25vd24sIHRveUxldmVsOiBudW1iZXIpOiBudW1iZXIge1xuICBjb25zdCB0b3kgPSBnZXRSZWNvcmQocmF3VG95KTtcbiAgaWYgKHRveSkge1xuICAgIGNvbnN0IGhwID0gZ2V0UmVjb3JkKHRveVsnSHAnXSk7XG4gICAgY29uc3QgZGlyZWN0ID0gW3RveVsnaHAnXSwgdG95WydoZWFsdGgnXSwgaHA/LlsnUGVybSddXTtcbiAgICBmb3IgKGNvbnN0IGNhbmRpZGF0ZSBvZiBkaXJlY3QpIHtcbiAgICAgIGNvbnN0IG4gPSB0b0Zpbml0ZU51bWJlcihjYW5kaWRhdGUsIE5hTik7XG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKG4pKSB7XG4gICAgICAgIHJldHVybiBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKG4pKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIE1hdGgubWF4KDEsIDMgKyAodG95TGV2ZWwgLSAxKSAqIDQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRSZWxpY0l0ZW1zKFxuICBib2FyZElkOiBzdHJpbmcsXG4gIHJhd1RveTogdW5rbm93bixcbiAgcmF3VG95TGV2ZWw6IHVua25vd24sXG4gIHdhcm5pbmdCYWc6IFJlcGxheVdhcm5pbmdCYWcsXG4gIG1hcHM/OiBSZXBsYXlQYXJzZXJMb29rdXBNYXBzLFxuKTogW251bGwsIFJlcGxheVJlbGljSXRlbSB8IG51bGxdIHtcbiAgY29uc3QgdG95SWQgPSByZXNvbHZlVG95SWQocmF3VG95LCBtYXBzKTtcbiAgY29uc3QgdG95TmFtZSA9IGdldFRveU5hbWUocmF3VG95KSA/PyAodHlwZW9mIHJhd1RveSA9PT0gJ3N0cmluZycgPyByYXdUb3kgOiAnJyk7XG4gIGlmICghTnVtYmVyLmlzRmluaXRlKE51bWJlcih0b3lJZCkpKSB7XG4gICAgaWYgKHRveU5hbWUpIHtcbiAgICAgIHdhcm5pbmdCYWcudW5rbm93blRveXMucHVzaChTdHJpbmcodG95TmFtZSkpO1xuICAgIH1cbiAgICByZXR1cm4gW251bGwsIG51bGxdO1xuICB9XG4gIGNvbnN0IHRveUxldmVsID0gTWF0aC5tYXgoMSwgTWF0aC5yb3VuZCh0b0Zpbml0ZU51bWJlcihyYXdUb3lMZXZlbCwgMSkpKTtcbiAgY29uc3QgdG95QWJpbGl0eUVudW0gPSByZXNvbHZlVG95QWJpbGl0eUVudW0ocmF3VG95LCB0b3lJZCk7XG4gIGNvbnN0IHRveVVzZXNMZWZ0ID0gcmVzb2x2ZVRveVVzZXNMZWZ0KHJhd1RveSwgdG95TGV2ZWwpO1xuICBjb25zdCB0b3lIZWFsdGhQZXJtID0gcmVzb2x2ZVRveUhlYWx0aFBlcm0ocmF3VG95LCB0b3lMZXZlbCk7XG4gIGNvbnN0IHRveVJlbGljOiBSZXBsYXlSZWxpY0l0ZW0gPSB7XG4gICAgT3duOiAxLFxuICAgIEVudTogdG95SWQsXG4gICAgTG9jOiA0LFxuICAgIFBvaTogeyB4OiAxLCB5OiAwIH0sXG4gICAgRXhwOiAwLFxuICAgIEx2bDogdG95TGV2ZWwsXG4gICAgSHA6IHsgUGVybTogdG95SGVhbHRoUGVybSwgVGVtcDogMCwgTWF4OiBudWxsIH0sXG4gICAgQXQ6IHsgUGVybTogMTAwMCwgVGVtcDogMCwgTWF4OiAxMDAwIH0sXG4gICAgTWFuYTogMCxcbiAgICBDb3U6IHRveVVzZXNMZWZ0LFxuICAgIFBlQm86IGZhbHNlLFxuICAgIFBlRHU6IG51bGwsXG4gICAgUGVETTogbnVsbCxcbiAgICBQZU11OiBudWxsLFxuICAgIFBlRHI6IDAsXG4gICAgQWJpbDpcbiAgICAgIHRveUFiaWxpdHlFbnVtICE9PSBudWxsID8gW2J1aWxkQWJpbGl0eUVudHJ5KHRveUFiaWxpdHlFbnVtLCB0b3lMZXZlbCwgMCldIDogW10sXG4gICAgQWJEaTogZmFsc2UsXG4gICAgQ29zbTogMCxcbiAgICBEZWFkOiBmYWxzZSxcbiAgICBEZXN0OiBmYWxzZSxcbiAgICBEZUJ5OiBudWxsLFxuICAgIExpbms6IG51bGwsXG4gICAgUG93OiBudWxsLFxuICAgIFNlVjogbnVsbCxcbiAgICBSd2RzOiAwLFxuICAgIFJ3cmQ6IGZhbHNlLFxuICAgIE1pTXM6IG51bGwsXG4gICAgU3BNZTogbnVsbCxcbiAgICBUcmk6IG51bGwsXG4gICAgQXRrQzogMCxcbiAgICBIcnRDOiAwLFxuICAgIFNwQ1Q6IDAsXG4gICAgT2xUczogbnVsbCxcbiAgICBMYXN0VGFyZ2V0c1RoaXNUdXJuOiBudWxsLFxuICAgIElkOiB7IEJvSWQ6IGJvYXJkSWQsIFVuaTogOTAwIH0sXG4gICAgUHJpOiAzLFxuICAgIEZybzogZmFsc2UsXG4gICAgV0ZybzogZmFsc2UsXG4gICAgQUZybzogZmFsc2UsXG4gIH07XG4gIHJldHVybiBbbnVsbCwgdG95UmVsaWNdO1xufVxuXG5leHBvcnQgY29uc3QgUkVQTEFZX0RFQlVHX0VOQUJMRUQgPSAoKCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGZyb21TdG9yYWdlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NhcFJlcGxheURlYnVnJyk7XG4gICAgaWYgKGZyb21TdG9yYWdlID09PSAnMScpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHRyeSB7XG4gICAgcmV0dXJuIG5ldyBVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpLnNlYXJjaFBhcmFtcy5nZXQoJ3NhcFJlcGxheURlYnVnJykgPT09ICcxJztcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59KSgpO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVwbGF5RGVidWcoLi4uYXJnczogdW5rbm93bltdKTogdm9pZCB7XG4gIGlmICghUkVQTEFZX0RFQlVHX0VOQUJMRUQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc29sZS5sb2coJ1tTQVAgUmVwbGF5IERlYnVnXScsIC4uLmFyZ3MpO1xufVxuIiwgImltcG9ydCB7XG4gIEN1c3RvbVBhY2tJdGVtLFxuICBDdXN0b21QYWNrQ29uZmlnLFxuICBQZXRDb25maWcsXG59IGZyb20gJ2FwcC9kb21haW4vaW50ZXJmYWNlcy9zaW11bGF0aW9uLWNvbmZpZy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgZW5jb2RlQmFzZTY0VXJsIH0gZnJvbSAnYXBwL3J1bnRpbWUvYmFzZTY0LXVybCc7XG5pbXBvcnQgeyBmb29kIGFzIGZvb2RKc29uIH0gZnJvbSAnYXBwL3J1bnRpbWUvY29udGVudC1jYXRhbG9ncyc7XG5pbXBvcnQge1xuICBLRVlfTUFQLFxuICBQQUNLX01BUCxcbiAgUEVSS1NfQllfSUQsXG4gIFBFVFNfQllfSUQsXG4gIFBFVF9JRFNfQllfTkFNRSxcbiAgUEVUU19NRVRBX0JZX0lELFxuICBUT1lTX0JZX0lELFxufSBmcm9tICcuL3JlcGxheS1jYWxjLXNjaGVtYSc7XG5pbXBvcnQge1xuICByZXNvbHZlUGV0SWRGcm9tVW5rbm93bixcbiAgZ2V0VGltZXNIdXJ0RnJvbVJhd1BldCxcbiAgZ2V0VHJpZ2dlcnNDb25zdW1lZEZyb21SYXdQZXQsXG4gIC8vIG90aGVyIGhlbHBlcnMgYXZhaWxhYmxlIGZvciBmdXR1cmUgd2lyaW5nXG4gIHJlc29sdmVUb3lJZCxcbiAgZ2V0VG95TmFtZSxcbiAgYnVpbGRBYm9taW5hdGlvbk1lbW9yeSxcbiAgaW5mZXJBYm9taW5hdGlvbkFiaWxpdHlFbnVtc0Zyb21Td2FsbG93ZWRQZXRzLFxuICBSZXBsYXlQYXJzZXJMb29rdXBNYXBzLFxufSBmcm9tICcuL3JlcGxheS1jYWxjLXBhcnNlci11dGlscyc7XG5cbmludGVyZmFjZSBSZXBsYXlBYmlsaXR5SnNvbiB7XG4gIEVudT86IG51bWJlciB8IHN0cmluZyB8IG51bGw7XG4gIEx2bD86IG51bWJlciB8IG51bGw7XG4gIEdyb3A/OiBudW1iZXIgfCBudWxsO1xuICBUckNvPzogbnVtYmVyIHwgbnVsbDtcbn1cblxuaW50ZXJmYWNlIFJlcGxheVBldFN0YXRzSnNvbiB7XG4gIFRlbXA/OiBudW1iZXIgfCBudWxsO1xuICBQZXJtPzogbnVtYmVyIHwgbnVsbDtcbn1cblxuaW50ZXJmYWNlIFJlcGxheVBldEpzb24ge1xuICBFbnU/OiBudW1iZXIgfCBzdHJpbmcgfCBudWxsO1xuICBBdD86IFJlcGxheVBldFN0YXRzSnNvbiB8IG51bGw7XG4gIEhwPzogUmVwbGF5UGV0U3RhdHNKc29uIHwgbnVsbDtcbiAgRXhwPzogbnVtYmVyIHwgbnVsbDtcbiAgTHZsPzogbnVtYmVyIHwgbnVsbDtcbiAgUGVyaz86IG51bWJlciB8IHN0cmluZyB8IG51bGw7XG4gIE1hbmE/OiBudW1iZXIgfCBudWxsO1xuICBQb3c/OiB7XG4gICAgU2FiZXJ0b290aFRpZ2VyQWJpbGl0eT86IG51bWJlciB8IG51bGw7XG4gIH0gfCBudWxsO1xuICBBYmlsPzogUmVwbGF5QWJpbGl0eUpzb25bXSB8IG51bGw7XG4gIFBvaT86IHtcbiAgICB4PzogbnVtYmVyIHwgbnVsbDtcbiAgfSB8IG51bGw7XG4gIE1pTXM/OiB7XG4gICAgTHN0cz86IHtcbiAgICAgIFdoaXRlV2hhbGVBYmlsaXR5PzogUmVwbGF5UGV0SnNvbltdIHwgbnVsbDtcbiAgICB9IHwgbnVsbDtcbiAgfSB8IG51bGw7XG4gIFtrZXk6IHN0cmluZ106IHVua25vd247XG59XG5cbmludGVyZmFjZSBSZXBsYXlNZW1vcnlFbnRyeUpzb24ge1xuICBFbnU/OiBudW1iZXIgfCBzdHJpbmcgfCBudWxsO1xuICBMdmw/OiBudW1iZXIgfCBudWxsO1xuICBJZD86IG51bWJlciB8IHN0cmluZyB8IG51bGw7XG4gIGlkPzogbnVtYmVyIHwgc3RyaW5nIHwgbnVsbDtcbiAgZW51PzogbnVtYmVyIHwgc3RyaW5nIHwgbnVsbDtcbiAgTWlNcz86IHtcbiAgICBMc3RzPzogUmVjb3JkPHN0cmluZywgQXJyYXk8UmVwbGF5TWVtb3J5RW50cnlKc29uIHwgbnVsbD4gfCBudWxsPiB8IG51bGw7XG4gIH0gfCBudWxsO1xuICBba2V5OiBzdHJpbmddOiB1bmtub3duO1xufVxuXG5pbnRlcmZhY2UgUmVwbGF5VG95SnNvbiB7XG4gIEVudT86IG51bWJlciB8IHN0cmluZyB8IG51bGw7XG4gIEx2bD86IG51bWJlciB8IG51bGw7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVwbGF5RGVja0pzb24ge1xuICBJZD86IG51bWJlciB8IHN0cmluZyB8IG51bGw7XG4gIFRpdGxlPzogc3RyaW5nIHwgbnVsbDtcbiAgTWluaW9ucz86IEFycmF5PG51bWJlciB8IHN0cmluZz4gfCBudWxsO1xuICBTcGVsbHM/OiBBcnJheTxzdHJpbmcgfCBudW1iZXI+IHwgbnVsbDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZXBsYXlCb2FyZEpzb24ge1xuICBba2V5OiBzdHJpbmddOiB1bmtub3duO1xuICBNaW5zPzoge1xuICAgIEl0ZW1zPzogQXJyYXk8UmVwbGF5UGV0SnNvbiB8IG51bGw+IHwgbnVsbDtcbiAgfSB8IG51bGw7XG4gIFJlbD86IHtcbiAgICBJdGVtcz86IEFycmF5PFJlcGxheVRveUpzb24gfCBudWxsPiB8IG51bGw7XG4gIH0gfCBudWxsO1xuICBEZWNrPzogUmVwbGF5RGVja0pzb24gfCBudWxsO1xuICBQYWNrPzogbnVtYmVyIHwgbnVsbDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZXBsYXlCYXR0bGVKc29uIHtcbiAgVXNlckJvYXJkPzogUmVwbGF5Qm9hcmRKc29uIHwgbnVsbDtcbiAgT3Bwb25lbnRCb2FyZD86IFJlcGxheUJvYXJkSnNvbiB8IG51bGw7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVwbGF5QnVpbGRNb2RlbEpzb24ge1xuICBba2V5OiBzdHJpbmddOiB1bmtub3duO1xuICBCb3I/OiB7XG4gICAgRGVjaz86IFJlcGxheURlY2tKc29uIHwgbnVsbDtcbiAgfSB8IG51bGw7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVwbGF5TWV0YUJvYXJkcyB7XG4gIHVzZXJCb2FyZD86IFJlcGxheUJvYXJkSnNvbiB8IG51bGw7XG4gIG9wcG9uZW50Qm9hcmQ/OiBSZXBsYXlCb2FyZEpzb24gfCBudWxsO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlcGxheVBhcnNlT3B0aW9ucyB7XG4gIGFiaWxpdHlQZXRNYXA/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmcgfCBudW1iZXI+IHwgbnVsbDtcbiAgLyoqIFJlcGxheS1kZXJpdmVkIHBlcmsgbmFtZXMga2V5ZWQgYnkgdGhlIHJhdyBwZXQgZW51bS4gKi9cbiAgcGVya05hbWVCeVBldElkPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IG51bGw7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVwbGF5QWN0aW9uSnNvbiB7XG4gIFR5cGU/OiBudW1iZXIgfCBudWxsO1xuICBUdXJuPzogbnVtYmVyIHwgc3RyaW5nIHwgbnVsbDtcbiAgQnVpbGQ/OiBzdHJpbmcgfCBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGw7XG4gIEJhdHRsZT86IHN0cmluZyB8IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgbnVsbDtcbiAgTW9kZT86IHN0cmluZyB8IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgbnVsbDtcbiAgUmVzcG9uc2U/OiBzdHJpbmcgfCBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGw7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVwbGF5QWN0aW9uc0NvbnRhaW5lckpzb24ge1xuICBBY3Rpb25zPzogUmVhZG9ubHlBcnJheTxSZXBsYXlBY3Rpb25Kc29uPiB8IG51bGw7XG4gIEdlbmVzaXNCdWlsZE1vZGVsPzogUmVwbGF5QnVpbGRNb2RlbEpzb24gfCBudWxsO1xufVxuXG5pbnRlcmZhY2UgUmVwbGF5Qm90VHVybkFiaWxpdHlKc29uIHtcbiAgaWQ/OiBudW1iZXIgfCBzdHJpbmcgfCBudWxsO1xuICBsZXZlbD86IG51bWJlciB8IG51bGw7XG4gIGdyb3VwPzogbnVtYmVyIHwgbnVsbDtcbiAgdHJpZ2dlcnNDb25zdW1lZD86IG51bWJlciB8IG51bGw7XG59XG5cbmludGVyZmFjZSBSZXBsYXlCb3RUdXJuU3RhdEJsb2NrSnNvbiB7XG4gIHBlcm1hbmVudD86IG51bWJlciB8IG51bGw7XG4gIHRlbXBvcmFyeT86IG51bWJlciB8IG51bGw7XG59XG5cbmludGVyZmFjZSBSZXBsYXlCb3RUdXJuUGV0SnNvbiB7XG4gIHNsb3Q/OiBudW1iZXIgfCBudWxsO1xuICBpZD86IG51bWJlciB8IHN0cmluZyB8IG51bGw7XG4gIGxldmVsPzogbnVtYmVyIHwgbnVsbDtcbiAgZXhwZXJpZW5jZT86IG51bWJlciB8IG51bGw7XG4gIHBlcmtJZD86IG51bWJlciB8IHN0cmluZyB8IG51bGw7XG4gIGF0dGFjaz86IFJlcGxheUJvdFR1cm5TdGF0QmxvY2tKc29uIHwgbnVsbDtcbiAgaGVhbHRoPzogUmVwbGF5Qm90VHVyblN0YXRCbG9ja0pzb24gfCBudWxsO1xuICBtYW5hPzogbnVtYmVyIHwgbnVsbDtcbiAgYWJpbGl0aWVzPzogUmVwbGF5Qm90VHVybkFiaWxpdHlKc29uW10gfCBudWxsO1xufVxuXG5pbnRlcmZhY2UgUmVwbGF5Qm90VHVyblN0YXRzSnNvbiB7XG4gIHR1cm4/OiBudW1iZXIgfCBudWxsO1xuICBnb2xkU3BlbnQ/OiBudW1iZXIgfCBudWxsO1xuICByb2xscz86IG51bWJlciB8IG51bGw7XG4gIHN1bW1vbnM/OiBudW1iZXIgfCBudWxsO1xuICBsZXZlbDNTb2xkPzogbnVtYmVyIHwgbnVsbDtcbiAgdHJhbnNmb3JtZWQ/OiBudW1iZXIgfCBudWxsO1xufVxuXG5pbnRlcmZhY2UgUmVwbGF5Qm90VHVyblNpZGVKc29uIHtcbiAgc3RhdHM/OiBSZXBsYXlCb3RUdXJuU3RhdHNKc29uIHwgbnVsbDtcbiAgcGV0cz86IFJlcGxheUJvdFR1cm5QZXRKc29uW10gfCBudWxsO1xufVxuXG5pbnRlcmZhY2UgUmVwbGF5Qm90VHVybkpzb24ge1xuICB0dXJuPzogbnVtYmVyIHwgc3RyaW5nIHwgbnVsbDtcbiAgdXNlcj86IFJlcGxheUJvdFR1cm5TaWRlSnNvbiB8IG51bGw7XG4gIG9wcG9uZW50PzogUmVwbGF5Qm90VHVyblNpZGVKc29uIHwgbnVsbDtcbn1cblxuaW50ZXJmYWNlIFJlcGxheUJvdFJlcGxheU1ldGFKc29uIHtcbiAgcGFjaz86IG51bWJlciB8IHN0cmluZyB8IG51bGw7XG4gIG9wcG9uZW50X3BhY2s/OiBudW1iZXIgfCBzdHJpbmcgfCBudWxsO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlcGxheUJvdFR1cm5zQ29udGFpbmVySnNvbiB7XG4gIHR1cm5zPzogUmVhZG9ubHlBcnJheTxSZXBsYXlCb3RUdXJuSnNvbj4gfCBudWxsO1xuICBnZW5lc2lzQnVpbGRNb2RlbD86IFJlcGxheUJ1aWxkTW9kZWxKc29uIHwgbnVsbDtcbiAgYWJpbGl0eVBldE1hcD86IFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IG51bWJlcj4gfCBudWxsO1xuICByZXBsYXlNZXRhPzogUmVwbGF5Qm90UmVwbGF5TWV0YUpzb24gfCBudWxsO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlcGxheUN1c3RvbVBhY2sgZXh0ZW5kcyBDdXN0b21QYWNrQ29uZmlnIHtcbiAgbmFtZTogc3RyaW5nO1xuICBkZWNrSWQ/OiBzdHJpbmcgfCBudWxsO1xuICB0aWVyMVBldHM6IChzdHJpbmcgfCBudWxsKVtdO1xuICB0aWVyMlBldHM6IChzdHJpbmcgfCBudWxsKVtdO1xuICB0aWVyM1BldHM6IChzdHJpbmcgfCBudWxsKVtdO1xuICB0aWVyNFBldHM6IChzdHJpbmcgfCBudWxsKVtdO1xuICB0aWVyNVBldHM6IChzdHJpbmcgfCBudWxsKVtdO1xuICB0aWVyNlBldHM6IChzdHJpbmcgfCBudWxsKVtdO1xuICBzcGVsbHM6IEN1c3RvbVBhY2tJdGVtW107XG59XG5cbmludGVyZmFjZSBSZXBsYXlQYXJzZWRUb3kge1xuICBuYW1lOiBzdHJpbmcgfCBudWxsO1xuICBsZXZlbDogbnVtYmVyO1xufVxuXG50eXBlIFN0cmlwcGVkUmVwbGF5UGV0ID0gUGljazxQZXRDb25maWcsICduYW1lJz4gJiBQYXJ0aWFsPE9taXQ8UGV0Q29uZmlnLCAnbmFtZSc+PjtcblxuZXhwb3J0IGludGVyZmFjZSBSZXBsYXlDYWxjdWxhdG9yU3RhdGUge1xuICBwbGF5ZXJQYWNrOiBzdHJpbmc7XG4gIG9wcG9uZW50UGFjazogc3RyaW5nO1xuICBwbGF5ZXJUb3k6IHN0cmluZyB8IG51bGw7XG4gIHBsYXllclRveUxldmVsOiBzdHJpbmc7XG4gIHBsYXllckhhcmRUb3k6IG51bGw7XG4gIHBsYXllckhhcmRUb3lMZXZlbDogbnVtYmVyO1xuICBvcHBvbmVudFRveTogc3RyaW5nIHwgbnVsbDtcbiAgb3Bwb25lbnRUb3lMZXZlbDogc3RyaW5nO1xuICBvcHBvbmVudEhhcmRUb3k6IG51bGw7XG4gIG9wcG9uZW50SGFyZFRveUxldmVsOiBudW1iZXI7XG4gIHR1cm46IG51bWJlcjtcbiAgcGxheWVyR29sZFNwZW50OiBudW1iZXI7XG4gIG9wcG9uZW50R29sZFNwZW50OiBudW1iZXI7XG4gIHBsYXllclJvbGxBbW91bnQ6IG51bWJlcjtcbiAgb3Bwb25lbnRSb2xsQW1vdW50OiBudW1iZXI7XG4gIHBsYXllclN1bW1vbmVkQW1vdW50OiBudW1iZXI7XG4gIG9wcG9uZW50U3VtbW9uZWRBbW91bnQ6IG51bWJlcjtcbiAgcGxheWVyTGV2ZWwzU29sZDogbnVtYmVyO1xuICBvcHBvbmVudExldmVsM1NvbGQ6IG51bWJlcjtcbiAgcGxheWVyVHJhbnNmb3JtYXRpb25BbW91bnQ6IG51bWJlcjtcbiAgb3Bwb25lbnRUcmFuc2Zvcm1hdGlvbkFtb3VudDogbnVtYmVyO1xuICBwbGF5ZXJQZXRzOiAoUGV0Q29uZmlnIHwgbnVsbClbXTtcbiAgb3Bwb25lbnRQZXRzOiAoUGV0Q29uZmlnIHwgbnVsbClbXTtcbiAgYWxsUGV0czogYm9vbGVhbjtcbiAgbG9nRmlsdGVyOiBzdHJpbmcgfCBudWxsO1xuICBjdXN0b21QYWNrczogUmVwbGF5Q3VzdG9tUGFja1tdO1xuICBvbGRTdG9yazogYm9vbGVhbjtcbiAgdG9rZW5QZXRzOiBib29sZWFuO1xuICBrb21vZG9TaHVmZmxlOiBib29sZWFuO1xuICBtYW5hOiBib29sZWFuO1xuICBzZWVkOiBudW1iZXIgfCBudWxsO1xuICB0cmlnZ2Vyc0NvbnN1bWVkOiBib29sZWFuO1xuICBmb29kc0VhdGVuPzogYm9vbGVhbjtcbiAgc2hvd0FkdmFuY2VkOiBib29sZWFuO1xuICBzaG93VHJpZ2dlck5hbWVzSW5Mb2dzOiBib29sZWFuO1xuICBzaG93UG9zaXRpb25hbEFyZ3NJbkxvZ3M6IGJvb2xlYW47XG4gIGFpbG1lbnRFcXVpcG1lbnQ6IGJvb2xlYW47XG59XG5cbnR5cGUgUmVwbGF5Q3VzdG9tUGFja0NvcmUgPSBPbWl0PFJlcGxheUN1c3RvbVBhY2ssICdkZWNrSWQnPjtcblxuZnVuY3Rpb24gdG9GaW5pdGVOdW1iZXIodmFsdWU6IHVua25vd24pOiBudW1iZXIgfCBudWxsIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgTnVtYmVyLmlzRmluaXRlKHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS50cmltKCkubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IHBhcnNlZCA9IE51bWJlcih2YWx1ZSk7XG4gICAgcmV0dXJuIE51bWJlci5pc0Zpbml0ZShwYXJzZWQpID8gcGFyc2VkIDogbnVsbDtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gdG9OdW1iZXJPckZhbGxiYWNrKHZhbHVlOiB1bmtub3duLCBmYWxsYmFjazogbnVtYmVyKTogbnVtYmVyIHtcbiAgY29uc3QgcGFyc2VkID0gdG9GaW5pdGVOdW1iZXIodmFsdWUpO1xuICByZXR1cm4gcGFyc2VkID8/IGZhbGxiYWNrO1xufVxuXG5mdW5jdGlvbiBpc1JlY29yZCh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgcmV0dXJuIHZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpO1xufVxuXG5mdW5jdGlvbiBhc1JlY29yZCh2YWx1ZTogdW5rbm93bik6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgbnVsbCB7XG4gIHJldHVybiBpc1JlY29yZCh2YWx1ZSkgPyB2YWx1ZSA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIGFzUmVwbGF5TWVtb3J5RW50cnkoXG4gIHZhbHVlOiB1bmtub3duLFxuKTogUmVwbGF5TWVtb3J5RW50cnlKc29uIHwgbnVsbCB7XG4gIHJldHVybiBpc1JlY29yZCh2YWx1ZSkgPyAodmFsdWUgYXMgUmVwbGF5TWVtb3J5RW50cnlKc29uKSA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIGdldFJlcGxheU1lbW9yeUxpc3RzKFxuICB2YWx1ZTogUmVwbGF5UGV0SnNvbiB8IFJlcGxheU1lbW9yeUVudHJ5SnNvbiB8IG51bGwgfCB1bmRlZmluZWQsXG4pOiBSZWNvcmQ8c3RyaW5nLCBBcnJheTxSZXBsYXlNZW1vcnlFbnRyeUpzb24gfCBudWxsPiB8IG51bGw+IHwgbnVsbCB7XG4gIGNvbnN0IGxpc3RzID0gdmFsdWU/Lk1pTXM/LkxzdHM7XG4gIHJldHVybiBpc1JlY29yZChsaXN0cylcbiAgICA/IChsaXN0cyBhcyBSZWNvcmQ8c3RyaW5nLCBBcnJheTxSZXBsYXlNZW1vcnlFbnRyeUpzb24gfCBudWxsPiB8IG51bGw+KVxuICAgIDogbnVsbDtcbn1cblxuZnVuY3Rpb24gZ2V0Rmlyc3RSZXBsYXlNZW1vcnlFbnRyeShcbiAgdmFsdWU6IFJlcGxheVBldEpzb24gfCBSZXBsYXlNZW1vcnlFbnRyeUpzb24gfCBudWxsIHwgdW5kZWZpbmVkLFxuKTogUmVwbGF5TWVtb3J5RW50cnlKc29uIHwgbnVsbCB7XG4gIGNvbnN0IGxpc3RzID0gZ2V0UmVwbGF5TWVtb3J5TGlzdHModmFsdWUpO1xuICBpZiAoIWxpc3RzKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBmb3IgKGNvbnN0IGVudHJpZXMgb2YgT2JqZWN0LnZhbHVlcyhsaXN0cykpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZW50cmllcykpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIGVudHJpZXMpIHtcbiAgICAgIGNvbnN0IG1lbW9yeUVudHJ5ID0gYXNSZXBsYXlNZW1vcnlFbnRyeShlbnRyeSk7XG4gICAgICBpZiAobWVtb3J5RW50cnkpIHtcbiAgICAgICAgcmV0dXJuIG1lbW9yeUVudHJ5O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBnZXRSZXBsYXlNZW1vcnlFbnRyeUJ5QWJpbGl0eUlkKFxuICB2YWx1ZTogUmVwbGF5UGV0SnNvbiB8IFJlcGxheU1lbW9yeUVudHJ5SnNvbiB8IG51bGwgfCB1bmRlZmluZWQsXG4gIGFiaWxpdHlJZDogdW5rbm93bixcbik6IFJlcGxheU1lbW9yeUVudHJ5SnNvbiB8IG51bGwge1xuICBjb25zdCBrZXkgPSB0b1JlcGxheUlkKGFiaWxpdHlJZCk7XG4gIGlmICgha2V5KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBlbnRyaWVzID0gZ2V0UmVwbGF5TWVtb3J5TGlzdHModmFsdWUpPy5ba2V5XTtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGVudHJpZXMpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBmb3IgKGNvbnN0IGVudHJ5IG9mIGVudHJpZXMpIHtcbiAgICBjb25zdCBtZW1vcnlFbnRyeSA9IGFzUmVwbGF5TWVtb3J5RW50cnkoZW50cnkpO1xuICAgIGlmIChtZW1vcnlFbnRyeSkge1xuICAgICAgcmV0dXJuIG1lbW9yeUVudHJ5O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlUmVwbGF5TWVtb3J5UGV0TmFtZShcbiAgdmFsdWU6IFJlcGxheU1lbW9yeUVudHJ5SnNvbiB8IG51bGwgfCB1bmRlZmluZWQsXG4pOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgcmF3UGV0UmVmID1cbiAgICB2YWx1ZT8uRW51ID8/XG4gICAgdmFsdWU/LmVudSA/P1xuICAgIHZhbHVlPy5JZCA/P1xuICAgIHZhbHVlPy5pZDtcbiAgY29uc3QgcmVzb2x2ZWRQZXRJZCA9IHJlc29sdmVQZXRJZEZyb21Vbmtub3duKHJhd1BldFJlZiwgeyBQRVRfSURTX0JZX05BTUUgfSk7XG4gIGlmIChyZXNvbHZlZFBldElkID09PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gUEVUU19CWV9JRC5nZXQoU3RyaW5nKHJlc29sdmVkUGV0SWQpKSA/PyBgUGV0ICMke3Jlc29sdmVkUGV0SWR9YDtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZU5lc3RlZFN3YWxsb3dlZFBldE5hbWUoXG4gIHZhbHVlOiBSZXBsYXlQZXRKc29uIHwgUmVwbGF5TWVtb3J5RW50cnlKc29uIHwgbnVsbCB8IHVuZGVmaW5lZCxcbik6IHN0cmluZyB8IG51bGwge1xuICBjb25zdCBuZXN0ZWRFbnRyeSA9IGdldEZpcnN0UmVwbGF5TWVtb3J5RW50cnkodmFsdWUpO1xuICBpZiAobmVzdGVkRW50cnkpIHtcbiAgICByZXR1cm4gcmVzb2x2ZVJlcGxheU1lbW9yeVBldE5hbWUobmVzdGVkRW50cnkpO1xuICB9XG5cbiAgLy8gQSBmdWxsIHBldCBpcyBub3QgaXRzIG93biBzd2FsbG93ZWQtbWVtb3J5IGVudHJ5LiBUaGlzIG1hdHRlcnMgd2hlbiB0aGVcbiAgLy8gcmVwbGF5IHN1bW1hcnkgb21pdHMgTWlNczogdHJlYXRpbmcgdGhlIHJvb3QgRW51IGFzIG1lbW9yeSBtYWRlIEJlbHVnYVxuICAvLyBzd2FsbG93IGFub3RoZXIgQmVsdWdhIChhbmQgZGlkIHRoZSBzYW1lIGZvciBTYXJjYXN0aWMgRnJpbmdlaGVhZCkuXG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlPy5BYmlsKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHJlc29sdmVSZXBsYXlNZW1vcnlQZXROYW1lKGFzUmVwbGF5TWVtb3J5RW50cnkodmFsdWUpKTtcbn1cblxuY29uc3QgQ09QWV9TT1VSQ0VfUEVUX0lEUyA9IG5ldyBTZXQ8c3RyaW5nPihbXG4gICc1MycsIC8vIFBhcnJvdFxuICAnMTgyJywgLy8gQmVsdWdhIFdoYWxlXG4gICczNzMnLCAvLyBBYm9taW5hdGlvblxuICAnNzYzJywgLy8gU2FyY2FzdGljIEZyaW5nZWhlYWRcbl0pO1xuXG4vLyBTb21lIHN0b3JlZC9jb3B5IGFiaWxpdGllcyBoYXZlIHRoZWlyIG93biBlbnVtIGFuZCB0aGVyZWZvcmUgY2Fubm90IGJlXG4vLyByZWNvdmVyZWQgZnJvbSB0aGUgaG9sZGVyLWJhc2VkIGFiaWxpdHlQZXRNYXAgZW1pdHRlZCBieSByZXBsYXkgaW5kZXhpbmcuXG4vLyBLZWVwIHRoZXNlIGV4cGxpY2l0IHNvIGEgY29waWVkIGFiaWxpdHkgaXMgbmV2ZXIgZ3Vlc3NlZCBmcm9tIGFuIHVucmVsYXRlZFxuLy8gbmVpZ2hib3JpbmcgcGFjaydzIGVudW0gb2Zmc2V0LlxuY29uc3QgU1RPUkVEX0NPUFlfQUJJTElUWV9PV05FUl9CWV9JRCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KFtcbiAgWycyOTYnLCAnV29sZiddLFxuXSk7XG5cbmNvbnN0IEFCT01JTkFUSU9OX1NMT1RfRklFTERTID0gW1xuICB7XG4gICAgcGV0OiAnYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxJyxcbiAgICBsZXZlbDogJ2Fib21pbmF0aW9uU3dhbGxvd2VkUGV0MUxldmVsJyxcbiAgICB0aW1lc0h1cnQ6ICdhYm9taW5hdGlvblN3YWxsb3dlZFBldDFUaW1lc0h1cnQnLFxuICAgIGJlbHVnYTogJ2Fib21pbmF0aW9uU3dhbGxvd2VkUGV0MUJlbHVnYVN3YWxsb3dlZFBldCcsXG4gICAgc2FyY2FzdGljRnJpbmdlaGVhZDogJ2Fib21pbmF0aW9uU3dhbGxvd2VkUGV0MVNhcmNhc3RpY0ZyaW5nZWhlYWRTd2FsbG93ZWRQZXQnLFxuICB9LFxuICB7XG4gICAgcGV0OiAnYWJvbWluYXRpb25Td2FsbG93ZWRQZXQyJyxcbiAgICBsZXZlbDogJ2Fib21pbmF0aW9uU3dhbGxvd2VkUGV0MkxldmVsJyxcbiAgICB0aW1lc0h1cnQ6ICdhYm9taW5hdGlvblN3YWxsb3dlZFBldDJUaW1lc0h1cnQnLFxuICAgIGJlbHVnYTogJ2Fib21pbmF0aW9uU3dhbGxvd2VkUGV0MkJlbHVnYVN3YWxsb3dlZFBldCcsXG4gICAgc2FyY2FzdGljRnJpbmdlaGVhZDogJ2Fib21pbmF0aW9uU3dhbGxvd2VkUGV0MlNhcmNhc3RpY0ZyaW5nZWhlYWRTd2FsbG93ZWRQZXQnLFxuICB9LFxuICB7XG4gICAgcGV0OiAnYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzJyxcbiAgICBsZXZlbDogJ2Fib21pbmF0aW9uU3dhbGxvd2VkUGV0M0xldmVsJyxcbiAgICB0aW1lc0h1cnQ6ICdhYm9taW5hdGlvblN3YWxsb3dlZFBldDNUaW1lc0h1cnQnLFxuICAgIGJlbHVnYTogJ2Fib21pbmF0aW9uU3dhbGxvd2VkUGV0M0JlbHVnYVN3YWxsb3dlZFBldCcsXG4gICAgc2FyY2FzdGljRnJpbmdlaGVhZDogJ2Fib21pbmF0aW9uU3dhbGxvd2VkUGV0M1NhcmNhc3RpY0ZyaW5nZWhlYWRTd2FsbG93ZWRQZXQnLFxuICB9LFxuXSBhcyBjb25zdDtcblxudHlwZSBBYmlsaXR5T3duZXJDb3VudHMgPSBNYXA8c3RyaW5nLCBNYXA8c3RyaW5nLCBudW1iZXI+PjtcblxudHlwZSBBYm9taW5hdGlvblN3YWxsb3dlZFBldEZpZWxkID0gKHR5cGVvZiBBQk9NSU5BVElPTl9TTE9UX0ZJRUxEUylbbnVtYmVyXVsncGV0J107XG50eXBlIEFib21pbmF0aW9uU3dhbGxvd2VkUGV0TGV2ZWxGaWVsZCA9XG4gICh0eXBlb2YgQUJPTUlOQVRJT05fU0xPVF9GSUVMRFMpW251bWJlcl1bJ2xldmVsJ107XG50eXBlIEFib21pbmF0aW9uU3dhbGxvd2VkUGV0VGltZXNIdXJ0RmllbGQgPVxuICAodHlwZW9mIEFCT01JTkFUSU9OX1NMT1RfRklFTERTKVtudW1iZXJdWyd0aW1lc0h1cnQnXTtcbnR5cGUgQWJvbWluYXRpb25Td2FsbG93ZWRQZXROZXN0ZWRGaWVsZCA9XG4gICh0eXBlb2YgQUJPTUlOQVRJT05fU0xPVF9GSUVMRFMpW251bWJlcl1bJ2JlbHVnYSddIHxcbiAgKHR5cGVvZiBBQk9NSU5BVElPTl9TTE9UX0ZJRUxEUylbbnVtYmVyXVsnc2FyY2FzdGljRnJpbmdlaGVhZCddO1xuXG50eXBlIEFib21pbmF0aW9uU3dhbGxvd2VkU3RhdGUgPSBQaWNrPFxuICBQZXRDb25maWcsXG4gIEFib21pbmF0aW9uU3dhbGxvd2VkUGV0RmllbGQgfFxuICBBYm9taW5hdGlvblN3YWxsb3dlZFBldExldmVsRmllbGQgfFxuICBBYm9taW5hdGlvblN3YWxsb3dlZFBldFRpbWVzSHVydEZpZWxkIHxcbiAgQWJvbWluYXRpb25Td2FsbG93ZWRQZXROZXN0ZWRGaWVsZFxuPjtcblxuZnVuY3Rpb24gdG9SZXBsYXlJZCh2YWx1ZTogdW5rbm93bik6IHN0cmluZyB8IG51bGwge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBOdW1iZXIuaXNGaW5pdGUodmFsdWUpKSB7XG4gICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gaW5jcmVtZW50QWJpbGl0eU93bmVyQ291bnQoXG4gIGFiaWxpdHlPd25lckNvdW50czogQWJpbGl0eU93bmVyQ291bnRzLFxuICBhYmlsaXR5SWQ6IHN0cmluZyxcbiAgcGV0SWQ6IHN0cmluZyxcbik6IHZvaWQge1xuICBsZXQgcGV0Q291bnRCeUlkID0gYWJpbGl0eU93bmVyQ291bnRzLmdldChhYmlsaXR5SWQpO1xuICBpZiAoIXBldENvdW50QnlJZCkge1xuICAgIHBldENvdW50QnlJZCA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG4gICAgYWJpbGl0eU93bmVyQ291bnRzLnNldChhYmlsaXR5SWQsIHBldENvdW50QnlJZCk7XG4gIH1cbiAgcGV0Q291bnRCeUlkLnNldChwZXRJZCwgKHBldENvdW50QnlJZC5nZXQocGV0SWQpID8/IDApICsgMSk7XG59XG5cbmZ1bmN0aW9uIGNvbGxlY3RBYmlsaXR5T3duZXJDb3VudHMoXG4gIHZhbHVlOiB1bmtub3duLFxuICBhYmlsaXR5T3duZXJDb3VudHM6IEFiaWxpdHlPd25lckNvdW50cyxcbik6IHZvaWQge1xuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICB2YWx1ZS5mb3JFYWNoKChlbnRyeSkgPT4gY29sbGVjdEFiaWxpdHlPd25lckNvdW50cyhlbnRyeSwgYWJpbGl0eU93bmVyQ291bnRzKSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKCFpc1JlY29yZCh2YWx1ZSkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBwZXRJZCA9IHRvUmVwbGF5SWQodmFsdWUuRW51KTtcbiAgY29uc3QgYWJpbGl0aWVzID0gdmFsdWUuQWJpbDtcbiAgaWYgKHBldElkICYmIEFycmF5LmlzQXJyYXkoYWJpbGl0aWVzKSAmJiAhQ09QWV9TT1VSQ0VfUEVUX0lEUy5oYXMocGV0SWQpKSB7XG4gICAgYWJpbGl0aWVzLmZvckVhY2goKGFiaWxpdHkpID0+IHtcbiAgICAgIGlmICghaXNSZWNvcmQoYWJpbGl0eSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgYWJpbGl0eUlkID0gdG9SZXBsYXlJZChhYmlsaXR5LkVudSk7XG4gICAgICBpZiAoIWFiaWxpdHlJZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpbmNyZW1lbnRBYmlsaXR5T3duZXJDb3VudChhYmlsaXR5T3duZXJDb3VudHMsIGFiaWxpdHlJZCwgcGV0SWQpO1xuICAgIH0pO1xuICB9XG5cbiAgT2JqZWN0LnZhbHVlcyh2YWx1ZSkuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICBjb2xsZWN0QWJpbGl0eU93bmVyQ291bnRzKGVudHJ5LCBhYmlsaXR5T3duZXJDb3VudHMpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcGlja01vc3RMaWtlbHlQZXRJZChwZXRDb3VudEJ5SWQ6IE1hcDxzdHJpbmcsIG51bWJlcj4pOiBzdHJpbmcgfCBudWxsIHtcbiAgbGV0IGJlc3RQZXRJZDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGxldCBiZXN0Q291bnQgPSAtMTtcblxuICBmb3IgKGNvbnN0IFtwZXRJZCwgY291bnRdIG9mIHBldENvdW50QnlJZC5lbnRyaWVzKCkpIHtcbiAgICBpZiAoXG4gICAgICBjb3VudCA+IGJlc3RDb3VudCB8fFxuICAgICAgKGNvdW50ID09PSBiZXN0Q291bnQgJiYgKGJlc3RQZXRJZCA9PT0gbnVsbCB8fCBwZXRJZCA8IGJlc3RQZXRJZCkpXG4gICAgKSB7XG4gICAgICBiZXN0UGV0SWQgPSBwZXRJZDtcbiAgICAgIGJlc3RDb3VudCA9IGNvdW50O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBiZXN0UGV0SWQ7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkUmVwbGF5QWJpbGl0eVBldE1hcEZyb21Db3VudHMoXG4gIGFiaWxpdHlPd25lckNvdW50czogQWJpbGl0eU93bmVyQ291bnRzLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB7XG4gIGNvbnN0IGFiaWxpdHlQZXRNYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgZm9yIChjb25zdCBbYWJpbGl0eUlkLCBwZXRDb3VudEJ5SWRdIG9mIGFiaWxpdHlPd25lckNvdW50cy5lbnRyaWVzKCkpIHtcbiAgICBjb25zdCBwZXRJZCA9IHBpY2tNb3N0TGlrZWx5UGV0SWQocGV0Q291bnRCeUlkKTtcbiAgICBpZiAocGV0SWQpIHtcbiAgICAgIGFiaWxpdHlQZXRNYXBbYWJpbGl0eUlkXSA9IHBldElkO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYWJpbGl0eVBldE1hcDtcbn1cblxuZnVuY3Rpb24gcGFyc2VKc29uVmFsdWUocmF3OiB1bmtub3duKTogdW5rbm93biB7XG4gIGlmIChpc1JlY29yZChyYXcpIHx8IEFycmF5LmlzQXJyYXkocmF3KSkge1xuICAgIHJldHVybiByYXc7XG4gIH1cbiAgaWYgKHR5cGVvZiByYXcgIT09ICdzdHJpbmcnIHx8IHJhdy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB0cnkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKHJhdykgYXMgdW5rbm93bjtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuaW50ZXJmYWNlIFJlcGxheUZvb2RFbnRyeUpzb24ge1xuICBJZD86IG51bWJlciB8IHN0cmluZyB8IG51bGw7XG4gIE5hbWU/OiBzdHJpbmcgfCBudWxsO1xuICBBYmlsaXR5Pzogc3RyaW5nIHwgbnVsbDtcbn1cblxuY29uc3QgcmVwbGF5Rm9vZEVudHJpZXMgPVxuICAoZm9vZEpzb24gYXMgdW5rbm93biBhcyB7IGRlZmF1bHQ/OiBSZXBsYXlGb29kRW50cnlKc29uW10gfSkuZGVmYXVsdCA/P1xuICAoZm9vZEpzb24gYXMgdW5rbm93biBhcyBSZXBsYXlGb29kRW50cnlKc29uW10pO1xuXG4vLyBUaGUgcmVwbGF5IEFQSSBzdG9yZXMgdGhlIGZvb2QtY2FyZCBlbnVtIGluIGEgc3BlbGwgcmVzcG9uc2UsIHdoaWxlIHRoZVxuLy8gcGV0IHNuYXBzaG90IHN0b3JlcyB0aGUgcmVzdWx0aW5nIHBlcmsgdW5kZXIgYSBzZXBhcmF0ZSBlbnVtLiBSZXNvbHZlIHRoZVxuLy8gZm9ybWVyIGZyb20gY2Fub25pY2FsIGZvb2QgbWV0YWRhdGEgc28gbmV3bHkgYWRkZWQgcGVyayBmb29kcyBkbyBub3QgbmVlZCBhXG4vLyBzZWNvbmQgaGFuZC1tYWludGFpbmVkIHJlcGxheSBtYXBwaW5nLlxuY29uc3QgUkVQTEFZX1BFUktfRk9PRF9OQU1FU19CWV9TUEVMTF9JRCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KFxuICByZXBsYXlGb29kRW50cmllc1xuICAgIC5maWx0ZXIoXG4gICAgICAoZW50cnkpOiBlbnRyeSBpcyBSZXBsYXlGb29kRW50cnlKc29uICYgeyBJZDogbnVtYmVyIHwgc3RyaW5nOyBOYW1lOiBzdHJpbmcgfSA9PlxuICAgICAgICBlbnRyeT8uSWQgIT09IG51bGwgJiZcbiAgICAgICAgZW50cnk/LklkICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgdHlwZW9mIGVudHJ5Py5OYW1lID09PSAnc3RyaW5nJyAmJlxuICAgICAgICAvXkdpdmUgb25lIHBldCB0aGUgLisgcGVya1xcLiQvaS50ZXN0KGVudHJ5Py5BYmlsaXR5ID8/ICcnKSxcbiAgICApXG4gICAgLm1hcCgoZW50cnkpID0+IFtTdHJpbmcoZW50cnkuSWQpLCBlbnRyeS5OYW1lXSksXG4pO1xuXG5mdW5jdGlvbiBnZXRSZXBsYXlFbnRpdHlLZXkodmFsdWU6IHVua25vd24pOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgcmVjb3JkID0gYXNSZWNvcmQodmFsdWUpO1xuICBpZiAoIXJlY29yZCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgYm9hcmRJZCA9IHJlY29yZFsnQm9JZCddID8/IHJlY29yZFsnYm9JZCddO1xuICBjb25zdCB1bmlxdWVJZCA9IHJlY29yZFsnVW5pJ10gPz8gcmVjb3JkWyd1bmknXTtcbiAgaWYgKGJvYXJkSWQgPT09IG51bGwgfHwgYm9hcmRJZCA9PT0gdW5kZWZpbmVkIHx8IHVuaXF1ZUlkID09PSBudWxsIHx8IHVuaXF1ZUlkID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBgJHtTdHJpbmcoYm9hcmRJZCl9OiR7U3RyaW5nKHVuaXF1ZUlkKX1gO1xufVxuXG5mdW5jdGlvbiBidWlsZFJlcGxheVBldElkQnlFbnRpdHlLZXkoXG4gIGJhdHRsZUpzb246IFJlcGxheUJhdHRsZUpzb24sXG4pOiBNYXA8c3RyaW5nLCBzdHJpbmc+IHtcbiAgY29uc3QgcGV0SWRCeUVudGl0eUtleSA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gIGZvciAoY29uc3QgYm9hcmQgb2YgW2JhdHRsZUpzb24uVXNlckJvYXJkLCBiYXR0bGVKc29uLk9wcG9uZW50Qm9hcmRdKSB7XG4gICAgY29uc3QgaXRlbXMgPSBib2FyZD8uTWlucz8uSXRlbXMgPz8gW107XG4gICAgZm9yIChjb25zdCBwZXQgb2YgaXRlbXMpIHtcbiAgICAgIGlmICghcGV0KSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgY29uc3QgcGV0SWQgPSB0b1JlcGxheUlkKHBldC5FbnUpO1xuICAgICAgY29uc3QgZW50aXR5S2V5ID0gZ2V0UmVwbGF5RW50aXR5S2V5KHBldFsnSWQnXSk7XG4gICAgICBpZiAocGV0SWQgJiYgZW50aXR5S2V5KSB7XG4gICAgICAgIHBldElkQnlFbnRpdHlLZXkuc2V0KGVudGl0eUtleSwgcGV0SWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcGV0SWRCeUVudGl0eUtleTtcbn1cblxuZnVuY3Rpb24gZ2V0UmVwbGF5U3BlbGxQZXJrVGFyZ2V0KFxuICBhY3Rpb246IFJlcGxheUFjdGlvbkpzb24sXG4pOiB7IHBlcmtOYW1lOiBzdHJpbmc7IHRhcmdldEtleTogc3RyaW5nIH0gfCBudWxsIHtcbiAgaWYgKGFjdGlvbi5UeXBlICE9PSA4KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCByZXNwb25zZSA9IGFzUmVjb3JkKHBhcnNlSnNvblZhbHVlKGFjdGlvbi5SZXNwb25zZSkpO1xuICBjb25zdCByZXNwb25zZUV2ZW50ID0gYXNSZWNvcmQocmVzcG9uc2U/LlsnRXZlbnQnXSk7XG4gIGNvbnN0IGV2ZW50ID0gYXNSZWNvcmQocmVzcG9uc2VFdmVudD8uWydFdmVudCddKSA/PyByZXNwb25zZUV2ZW50O1xuICBjb25zdCBzcGVsbCA9IGFzUmVjb3JkKGV2ZW50Py5bJ1NwZWxsJ10pO1xuICBjb25zdCB0YXJnZXQgPSBhc1JlY29yZChldmVudD8uWydUYXJnZXQnXSk7XG4gIGNvbnN0IHNwZWxsSWQgPSB0b1JlcGxheUlkKHNwZWxsPy5bJ0VudSddKTtcbiAgY29uc3QgcGVya05hbWUgPSBzcGVsbElkXG4gICAgPyBSRVBMQVlfUEVSS19GT09EX05BTUVTX0JZX1NQRUxMX0lELmdldChzcGVsbElkKVxuICAgIDogdW5kZWZpbmVkO1xuICBjb25zdCB0YXJnZXRLZXkgPSBnZXRSZXBsYXlFbnRpdHlLZXkodGFyZ2V0KTtcblxuICByZXR1cm4gcGVya05hbWUgJiYgdGFyZ2V0S2V5ID8geyBwZXJrTmFtZSwgdGFyZ2V0S2V5IH0gOiBudWxsO1xufVxuXG5mdW5jdGlvbiBwYXJzZUJhdHRsZUFjdGlvbihyYXc6IHVua25vd24pOiBSZXBsYXlCYXR0bGVKc29uIHwgbnVsbCB7XG4gIGNvbnN0IHBhcnNlZCA9IHBhcnNlSnNvblZhbHVlKHJhdyk7XG4gIGlmICghaXNSZWNvcmQocGFyc2VkKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiBwYXJzZWQgYXMgUmVwbGF5QmF0dGxlSnNvbjtcbn1cblxuZnVuY3Rpb24gYnVpbGRQYWNrSWRCeU5hbWVMb29rdXAoKTogTWFwPHN0cmluZywgbnVtYmVyPiB7XG4gIGNvbnN0IGxvb2t1cCA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG4gIE9iamVjdC5lbnRyaWVzKFBBQ0tfTUFQKS5mb3JFYWNoKChbcGFja0lkUmF3LCBwYWNrTmFtZV0pID0+IHtcbiAgICBpZiAodHlwZW9mIHBhY2tOYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBwYWNrSWQgPSBOdW1iZXIocGFja0lkUmF3KTtcbiAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShwYWNrSWQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxvb2t1cC5zZXQocGFja05hbWUudG9Mb3dlckNhc2UoKSwgcGFja0lkKTtcbiAgfSk7XG4gIHJldHVybiBsb29rdXA7XG59XG5cbmNvbnN0IFBBQ0tfSURfQllfTkFNRSA9IGJ1aWxkUGFja0lkQnlOYW1lTG9va3VwKCk7XG5cbmZ1bmN0aW9uIHJlc29sdmVQYWNrSWRGcm9tVW5rbm93bih2YWx1ZTogdW5rbm93bik6IG51bWJlciB8IG51bGwge1xuICBjb25zdCBudW1lcmljID0gdG9GaW5pdGVOdW1iZXIodmFsdWUpO1xuICBpZiAobnVtZXJpYyAhPT0gbnVsbCkge1xuICAgIHJldHVybiBudW1lcmljO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uc3QgYnlOYW1lID0gUEFDS19JRF9CWV9OQU1FLmdldCh2YWx1ZS50b0xvd2VyQ2FzZSgpKTtcbiAgICBpZiAoYnlOYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBieU5hbWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBwYXJzZVR1cm5QZXRUb1JlcGxheVBldChcbiAgcmF3UGV0OiBSZXBsYXlCb3RUdXJuUGV0SnNvbiB8IG51bGwgfCB1bmRlZmluZWQsXG4pOiBSZXBsYXlQZXRKc29uIHwgbnVsbCB7XG4gIGlmICghcmF3UGV0KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBwZXRJZCA9IHRvUmVwbGF5SWQocmF3UGV0LmlkKTtcbiAgaWYgKCFwZXRJZCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3Qgc2xvdCA9IHRvRmluaXRlTnVtYmVyKHJhd1BldC5zbG90KTtcbiAgY29uc3QgYWJpbGl0aWVzID0gKHJhd1BldC5hYmlsaXRpZXMgPz8gW10pXG4gICAgLm1hcCgoYWJpbGl0eSk6IFJlcGxheUFiaWxpdHlKc29uIHwgbnVsbCA9PiB7XG4gICAgICBjb25zdCBhYmlsaXR5SWQgPSB0b1JlcGxheUlkKGFiaWxpdHk/LmlkKTtcbiAgICAgIGlmICghYWJpbGl0eUlkKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgRW51OiBhYmlsaXR5SWQsXG4gICAgICAgIEx2bDogdG9GaW5pdGVOdW1iZXIoYWJpbGl0eT8ubGV2ZWwpLFxuICAgICAgICBHcm9wOiB0b0Zpbml0ZU51bWJlcihhYmlsaXR5Py5ncm91cCksXG4gICAgICAgIFRyQ286IHRvRmluaXRlTnVtYmVyKGFiaWxpdHk/LnRyaWdnZXJzQ29uc3VtZWQpLFxuICAgICAgfTtcbiAgICB9KVxuICAgIC5maWx0ZXIoKGFiaWxpdHkpOiBhYmlsaXR5IGlzIFJlcGxheUFiaWxpdHlKc29uID0+IGFiaWxpdHkgIT09IG51bGwpO1xuXG4gIHJldHVybiB7XG4gICAgRW51OiBwZXRJZCxcbiAgICBMdmw6IHRvRmluaXRlTnVtYmVyKHJhd1BldC5sZXZlbCksXG4gICAgRXhwOiB0b0Zpbml0ZU51bWJlcihyYXdQZXQuZXhwZXJpZW5jZSksXG4gICAgUGVyazogdG9SZXBsYXlJZChyYXdQZXQucGVya0lkKSxcbiAgICBNYW5hOiB0b0Zpbml0ZU51bWJlcihyYXdQZXQubWFuYSksXG4gICAgQXQ6IHtcbiAgICAgIFBlcm06IHRvRmluaXRlTnVtYmVyKHJhd1BldC5hdHRhY2s/LnBlcm1hbmVudCksXG4gICAgICBUZW1wOiB0b0Zpbml0ZU51bWJlcihyYXdQZXQuYXR0YWNrPy50ZW1wb3JhcnkpLFxuICAgIH0sXG4gICAgSHA6IHtcbiAgICAgIFBlcm06IHRvRmluaXRlTnVtYmVyKHJhd1BldC5oZWFsdGg/LnBlcm1hbmVudCksXG4gICAgICBUZW1wOiB0b0Zpbml0ZU51bWJlcihyYXdQZXQuaGVhbHRoPy50ZW1wb3JhcnkpLFxuICAgIH0sXG4gICAgUG9pOiB7XG4gICAgICB4OiBzbG90LFxuICAgIH0sXG4gICAgQWJpbDogYWJpbGl0aWVzLFxuICB9O1xufVxuXG5mdW5jdGlvbiBwYXJzZVR1cm5TaWRlVG9SZXBsYXlCb2FyZChcbiAgc2lkZTogUmVwbGF5Qm90VHVyblNpZGVKc29uIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgZmFsbGJhY2tUdXJuOiBudW1iZXIsXG4gIHBhY2tSYXc/OiB1bmtub3duLFxuKTogUmVwbGF5Qm9hcmRKc29uIHtcbiAgcmV0dXJuIHtcbiAgICBUdXI6IHRvTnVtYmVyT3JGYWxsYmFjayhzaWRlPy5zdGF0cz8udHVybiwgZmFsbGJhY2tUdXJuKSxcbiAgICBHb1NwOiB0b051bWJlck9yRmFsbGJhY2soc2lkZT8uc3RhdHM/LmdvbGRTcGVudCwgMCksXG4gICAgUm9sZDogdG9OdW1iZXJPckZhbGxiYWNrKHNpZGU/LnN0YXRzPy5yb2xscywgMCksXG4gICAgTWlTdTogdG9OdW1iZXJPckZhbGxiYWNrKHNpZGU/LnN0YXRzPy5zdW1tb25zLCAwKSxcbiAgICBNU0ZMOiB0b051bWJlck9yRmFsbGJhY2soc2lkZT8uc3RhdHM/LmxldmVsM1NvbGQsIDApLFxuICAgIFRyVFQ6IHRvTnVtYmVyT3JGYWxsYmFjayhzaWRlPy5zdGF0cz8udHJhbnNmb3JtZWQsIDApLFxuICAgIFBhY2s6IHJlc29sdmVQYWNrSWRGcm9tVW5rbm93bihwYWNrUmF3KSxcbiAgICBNaW5zOiB7XG4gICAgICBJdGVtczogKHNpZGU/LnBldHMgPz8gW10pLm1hcCgocGV0KSA9PiBwYXJzZVR1cm5QZXRUb1JlcGxheVBldChwZXQpKSxcbiAgICB9LFxuICB9O1xufVxuXG5mdW5jdGlvbiBzZWxlY3RSZXBsYXlCYXR0bGVGcm9tVHVybnMoXG4gIHR1cm5zOiBSZWFkb25seUFycmF5PFJlcGxheUJvdFR1cm5Kc29uPiB8IG51bGwgfCB1bmRlZmluZWQsXG4gIHR1cm5OdW1iZXI6IG51bWJlcixcbiAgcmVwbGF5TWV0YT86IFJlcGxheUJvdFJlcGxheU1ldGFKc29uIHwgbnVsbCxcbik6IFJlcGxheUJhdHRsZUpzb24gfCBudWxsIHtcbiAgaWYgKCFOdW1iZXIuaXNGaW5pdGUodHVybk51bWJlcikgfHwgdHVybk51bWJlciA8PSAwKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCB0dXJuRW50cnkgPVxuICAgICh0dXJucyA/PyBbXSkuZmluZCgoZW50cnkpID0+IE51bWJlcihlbnRyeT8udHVybikgPT09IHR1cm5OdW1iZXIpID8/XG4gICAgKHR1cm5zID8/IFtdKVt0dXJuTnVtYmVyIC0gMV0gPz9cbiAgICBudWxsO1xuICBpZiAoIXR1cm5FbnRyeSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgZmFsbGJhY2tUdXJuID0gdG9OdW1iZXJPckZhbGxiYWNrKHR1cm5FbnRyeS50dXJuLCB0dXJuTnVtYmVyKTtcbiAgcmV0dXJuIHtcbiAgICBVc2VyQm9hcmQ6IHBhcnNlVHVyblNpZGVUb1JlcGxheUJvYXJkKFxuICAgICAgdHVybkVudHJ5LnVzZXIsXG4gICAgICBmYWxsYmFja1R1cm4sXG4gICAgICByZXBsYXlNZXRhPy5wYWNrLFxuICAgICksXG4gICAgT3Bwb25lbnRCb2FyZDogcGFyc2VUdXJuU2lkZVRvUmVwbGF5Qm9hcmQoXG4gICAgICB0dXJuRW50cnkub3Bwb25lbnQsXG4gICAgICBmYWxsYmFja1R1cm4sXG4gICAgICByZXBsYXlNZXRhPy5vcHBvbmVudF9wYWNrLFxuICAgICksXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RSZXBsYXlCYXR0bGVGcm9tQWN0aW9ucyhcbiAgYWN0aW9uczogUmVhZG9ubHlBcnJheTxSZXBsYXlBY3Rpb25Kc29uPiB8IG51bGwgfCB1bmRlZmluZWQsXG4gIHR1cm5OdW1iZXI6IG51bWJlcixcbik6IFJlcGxheUJhdHRsZUpzb24gfCBudWxsIHtcbiAgaWYgKCFOdW1iZXIuaXNGaW5pdGUodHVybk51bWJlcikgfHwgdHVybk51bWJlciA8PSAwKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBiYXR0bGVBY3Rpb25zID0gKGFjdGlvbnMgPz8gW10pLmZpbHRlcihcbiAgICAoYWN0aW9uKSA9PlxuICAgICAgQm9vbGVhbihhY3Rpb24/LkJhdHRsZSkgJiZcbiAgICAgIChhY3Rpb24/LlR5cGUgPT09IDAgfHwgYWN0aW9uPy5UeXBlID09PSBudWxsIHx8IGFjdGlvbj8uVHlwZSA9PT0gdW5kZWZpbmVkKSxcbiAgKTtcblxuICBjb25zdCBhY3Rpb25Gb3JUdXJuID1cbiAgICBiYXR0bGVBY3Rpb25zLmZpbmQoKGFjdGlvbikgPT4gTnVtYmVyKGFjdGlvbj8uVHVybikgPT09IHR1cm5OdW1iZXIpID8/XG4gICAgYmF0dGxlQWN0aW9uc1t0dXJuTnVtYmVyIC0gMV0gPz9cbiAgICBudWxsO1xuXG4gIHJldHVybiBwYXJzZUJhdHRsZUFjdGlvbihhY3Rpb25Gb3JUdXJuPy5CYXR0bGUgPz8gbnVsbCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFJlcGxheUFiaWxpdHlQZXRNYXBGcm9tQWN0aW9ucyhcbiAgYWN0aW9uczogUmVhZG9ubHlBcnJheTxSZXBsYXlBY3Rpb25Kc29uPiB8IG51bGwgfCB1bmRlZmluZWQsXG4pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcbiAgY29uc3QgYWJpbGl0eU93bmVyQ291bnRzOiBBYmlsaXR5T3duZXJDb3VudHMgPSBuZXcgTWFwKCk7XG4gIChhY3Rpb25zID8/IFtdKS5mb3JFYWNoKChhY3Rpb24pID0+IHtcbiAgICBjb25zdCBwYXJzZWRCdWlsZCA9IHBhcnNlSnNvblZhbHVlKGFjdGlvbj8uQnVpbGQpO1xuICAgIGNvbnN0IHBhcnNlZEJhdHRsZSA9IHBhcnNlSnNvblZhbHVlKGFjdGlvbj8uQmF0dGxlKTtcbiAgICBjb25zdCBwYXJzZWRNb2RlID0gcGFyc2VKc29uVmFsdWUoYWN0aW9uPy5Nb2RlKTtcbiAgICBjb2xsZWN0QWJpbGl0eU93bmVyQ291bnRzKHBhcnNlZEJ1aWxkLCBhYmlsaXR5T3duZXJDb3VudHMpO1xuICAgIGNvbGxlY3RBYmlsaXR5T3duZXJDb3VudHMocGFyc2VkQmF0dGxlLCBhYmlsaXR5T3duZXJDb3VudHMpO1xuICAgIGNvbGxlY3RBYmlsaXR5T3duZXJDb3VudHMocGFyc2VkTW9kZSwgYWJpbGl0eU93bmVyQ291bnRzKTtcbiAgfSk7XG4gIHJldHVybiBidWlsZFJlcGxheUFiaWxpdHlQZXRNYXBGcm9tQ291bnRzKGFiaWxpdHlPd25lckNvdW50cyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFJlcGxheVBlcmtOYW1lQnlQZXRJZEZyb21BY3Rpb25zKFxuICBhY3Rpb25zOiBSZWFkb25seUFycmF5PFJlcGxheUFjdGlvbkpzb24+IHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgdHVybk51bWJlcjogbnVtYmVyLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB7XG4gIGNvbnN0IGJhdHRsZUpzb24gPSBzZWxlY3RSZXBsYXlCYXR0bGVGcm9tQWN0aW9ucyhhY3Rpb25zLCB0dXJuTnVtYmVyKTtcbiAgaWYgKCFiYXR0bGVKc29uKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgY29uc3QgcGV0SWRCeUVudGl0eUtleSA9IGJ1aWxkUmVwbGF5UGV0SWRCeUVudGl0eUtleShiYXR0bGVKc29uKTtcbiAgY29uc3QgcGVya05hbWVCeVBldElkOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG5cbiAgKGFjdGlvbnMgPz8gW10pLmZvckVhY2goKGFjdGlvbikgPT4ge1xuICAgIGNvbnN0IGFjdGlvblR1cm4gPSB0b0Zpbml0ZU51bWJlcihhY3Rpb24uVHVybik7XG4gICAgaWYgKGFjdGlvblR1cm4gIT09IG51bGwgJiYgYWN0aW9uVHVybiA+IHR1cm5OdW1iZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzcGVsbFBlcmtUYXJnZXQgPSBnZXRSZXBsYXlTcGVsbFBlcmtUYXJnZXQoYWN0aW9uKTtcbiAgICBpZiAoIXNwZWxsUGVya1RhcmdldCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHBldElkID0gcGV0SWRCeUVudGl0eUtleS5nZXQoc3BlbGxQZXJrVGFyZ2V0LnRhcmdldEtleSk7XG4gICAgaWYgKHBldElkKSB7XG4gICAgICBwZXJrTmFtZUJ5UGV0SWRbcGV0SWRdID0gc3BlbGxQZXJrVGFyZ2V0LnBlcmtOYW1lO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHBlcmtOYW1lQnlQZXRJZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlUmVwbGF5Rm9yQ2FsY3VsYXRvckZyb21BY3Rpb25zKFxuICBhY3Rpb25zOiBSZWFkb25seUFycmF5PFJlcGxheUFjdGlvbkpzb24+IHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgdHVybk51bWJlcjogbnVtYmVyLFxuICBidWlsZE1vZGVsPzogUmVwbGF5QnVpbGRNb2RlbEpzb24gfCBudWxsLFxuICBtZXRhQm9hcmRzPzogUmVwbGF5TWV0YUJvYXJkcyxcbiAgb3B0aW9ucz86IFJlcGxheVBhcnNlT3B0aW9ucyxcbik6IFJlcGxheUNhbGN1bGF0b3JTdGF0ZSB8IG51bGwge1xuICBjb25zdCBiYXR0bGVKc29uID0gc2VsZWN0UmVwbGF5QmF0dGxlRnJvbUFjdGlvbnMoYWN0aW9ucywgdHVybk51bWJlcik7XG4gIGlmICghYmF0dGxlSnNvbikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgaW5mZXJyZWRBYmlsaXR5UGV0TWFwID0gYnVpbGRSZXBsYXlBYmlsaXR5UGV0TWFwRnJvbUFjdGlvbnMoYWN0aW9ucyk7XG4gIGNvbnN0IG1lcmdlZEFiaWxpdHlQZXRNYXAgPSB7XG4gICAgLi4uaW5mZXJyZWRBYmlsaXR5UGV0TWFwLFxuICAgIC4uLihvcHRpb25zPy5hYmlsaXR5UGV0TWFwID8/IHt9KSxcbiAgfTtcbiAgY29uc3QgaW5mZXJyZWRQZXJrTmFtZUJ5UGV0SWQgPSBidWlsZFJlcGxheVBlcmtOYW1lQnlQZXRJZEZyb21BY3Rpb25zKFxuICAgIGFjdGlvbnMsXG4gICAgdHVybk51bWJlcixcbiAgKTtcbiAgY29uc3QgbWVyZ2VkUGVya05hbWVCeVBldElkID0ge1xuICAgIC4uLmluZmVycmVkUGVya05hbWVCeVBldElkLFxuICAgIC4uLihvcHRpb25zPy5wZXJrTmFtZUJ5UGV0SWQgPz8ge30pLFxuICB9O1xuXG4gIGNvbnN0IHBhcnNlciA9IG5ldyBSZXBsYXlDYWxjUGFyc2VyKCk7XG4gIHJldHVybiBwYXJzZXIucGFyc2VSZXBsYXlGb3JDYWxjdWxhdG9yKFxuICAgIGJhdHRsZUpzb24sXG4gICAgYnVpbGRNb2RlbCA/PyB1bmRlZmluZWQsXG4gICAgbWV0YUJvYXJkcyxcbiAgICB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgYWJpbGl0eVBldE1hcDogbWVyZ2VkQWJpbGl0eVBldE1hcCxcbiAgICAgIHBlcmtOYW1lQnlQZXRJZDogbWVyZ2VkUGVya05hbWVCeVBldElkLFxuICAgIH0sXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVRlYW13b29kUmVwbGF5Rm9yQ2FsY3VsYXRvcihcbiAgcmVwbGF5OlxuICAgIHwgUmVwbGF5QWN0aW9uc0NvbnRhaW5lckpzb25cbiAgICB8IFJlcGxheUJvdFR1cm5zQ29udGFpbmVySnNvblxuICAgIHwgbnVsbFxuICAgIHwgdW5kZWZpbmVkLFxuICB0dXJuTnVtYmVyOiBudW1iZXIsXG4gIG1ldGFCb2FyZHM/OiBSZXBsYXlNZXRhQm9hcmRzLFxuICBvcHRpb25zPzogUmVwbGF5UGFyc2VPcHRpb25zLFxuKTogUmVwbGF5Q2FsY3VsYXRvclN0YXRlIHwgbnVsbCB7XG4gIGNvbnN0IHJlcGxheVJlY29yZCA9IGFzUmVjb3JkKHJlcGxheSk7XG4gIGNvbnN0IGhhc1R1cm5QYXlsb2FkID0gQXJyYXkuaXNBcnJheShyZXBsYXlSZWNvcmQ/LlsndHVybnMnXSk7XG4gIGlmIChoYXNUdXJuUGF5bG9hZCkge1xuICAgIGNvbnN0IHR1cm5zUmVwbGF5ID0gcmVwbGF5IGFzIFJlcGxheUJvdFR1cm5zQ29udGFpbmVySnNvbjtcbiAgICBjb25zdCBiYXR0bGVKc29uID0gc2VsZWN0UmVwbGF5QmF0dGxlRnJvbVR1cm5zKFxuICAgICAgdHVybnNSZXBsYXkudHVybnMsXG4gICAgICB0dXJuTnVtYmVyLFxuICAgICAgdHVybnNSZXBsYXkucmVwbGF5TWV0YSxcbiAgICApO1xuICAgIGlmICghYmF0dGxlSnNvbikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IG1lcmdlZEFiaWxpdHlQZXRNYXAgPSB7XG4gICAgICAuLi4odHVybnNSZXBsYXkuYWJpbGl0eVBldE1hcCA/PyB7fSksXG4gICAgICAuLi4ob3B0aW9ucz8uYWJpbGl0eVBldE1hcCA/PyB7fSksXG4gICAgfTtcbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgUmVwbGF5Q2FsY1BhcnNlcigpO1xuICAgIHJldHVybiBwYXJzZXIucGFyc2VSZXBsYXlGb3JDYWxjdWxhdG9yKFxuICAgICAgYmF0dGxlSnNvbixcbiAgICAgIHR1cm5zUmVwbGF5LmdlbmVzaXNCdWlsZE1vZGVsID8/IHVuZGVmaW5lZCxcbiAgICAgIG1ldGFCb2FyZHMsXG4gICAgICB7XG4gICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgIGFiaWxpdHlQZXRNYXA6IG1lcmdlZEFiaWxpdHlQZXRNYXAsXG4gICAgICB9LFxuICAgICk7XG4gIH1cblxuICByZXR1cm4gcGFyc2VSZXBsYXlGb3JDYWxjdWxhdG9yRnJvbUFjdGlvbnMoXG4gICAgKHJlcGxheSBhcyBSZXBsYXlBY3Rpb25zQ29udGFpbmVySnNvbiB8IG51bGwgfCB1bmRlZmluZWQpPy5BY3Rpb25zLFxuICAgIHR1cm5OdW1iZXIsXG4gICAgKHJlcGxheSBhcyBSZXBsYXlBY3Rpb25zQ29udGFpbmVySnNvbiB8IG51bGwgfCB1bmRlZmluZWQpPy5HZW5lc2lzQnVpbGRNb2RlbCA/P1xuICAgICAgdW5kZWZpbmVkLFxuICAgIG1ldGFCb2FyZHMsXG4gICAgb3B0aW9ucyxcbiAgKTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdEFib21pbmF0aW9uU3dhbGxvd2VkU3RhdGUoKTogQWJvbWluYXRpb25Td2FsbG93ZWRTdGF0ZSB7XG4gIHJldHVybiB7XG4gICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxOiBudWxsLFxuICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MjogbnVsbCxcbiAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDM6IG51bGwsXG4gICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxQmVsdWdhU3dhbGxvd2VkUGV0OiBudWxsLFxuICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MkJlbHVnYVN3YWxsb3dlZFBldDogbnVsbCxcbiAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDNCZWx1Z2FTd2FsbG93ZWRQZXQ6IG51bGwsXG4gICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxU2FyY2FzdGljRnJpbmdlaGVhZFN3YWxsb3dlZFBldDogbnVsbCxcbiAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDJTYXJjYXN0aWNGcmluZ2VoZWFkU3dhbGxvd2VkUGV0OiBudWxsLFxuICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M1NhcmNhc3RpY0ZyaW5nZWhlYWRTd2FsbG93ZWRQZXQ6IG51bGwsXG4gICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxVGltZXNIdXJ0OiAwLFxuICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MlRpbWVzSHVydDogMCxcbiAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDNUaW1lc0h1cnQ6IDAsXG4gICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxTGV2ZWw6IDEsXG4gICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQyTGV2ZWw6IDEsXG4gICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzTGV2ZWw6IDEsXG4gIH07XG59XG5cbmV4cG9ydCBjbGFzcyBSZXBsYXlDYWxjUGFyc2VyIHtcbiAgcGFyc2VSZXBsYXlGb3JDYWxjdWxhdG9yKFxuICAgIGJhdHRsZUpzb246IFJlcGxheUJhdHRsZUpzb24sXG4gICAgYnVpbGRNb2RlbD86IFJlcGxheUJ1aWxkTW9kZWxKc29uLFxuICAgIG1ldGFCb2FyZHM/OiBSZXBsYXlNZXRhQm9hcmRzLFxuICAgIG9wdGlvbnM/OiBSZXBsYXlQYXJzZU9wdGlvbnMsXG4gICk6IFJlcGxheUNhbGN1bGF0b3JTdGF0ZSB7XG4gICAgY29uc29sZS5sb2coYFtSZXBsYXlDYWxjUGFyc2VyXSBQRVRTX0JZX0lEIHNpemU6ICR7UEVUU19CWV9JRC5zaXplfWApO1xuICAgIGNvbnN0IHVzZXJCb2FyZCA9IGJhdHRsZUpzb24/LlVzZXJCb2FyZCA/PyBtZXRhQm9hcmRzPy51c2VyQm9hcmQ7XG4gICAgY29uc3Qgb3Bwb25lbnRCb2FyZCA9IGJhdHRsZUpzb24/Lk9wcG9uZW50Qm9hcmQgPz8gbWV0YUJvYXJkcz8ub3Bwb25lbnRCb2FyZDtcblxuICAgIGNvbnN0IHJlYWRCb2FyZE51bWJlciA9IChcbiAgICAgIGJvYXJkOiBSZXBsYXlCb2FyZEpzb24gfCBudWxsIHwgdW5kZWZpbmVkLFxuICAgICAga2V5OiBzdHJpbmcsXG4gICAgICBmYWxsYmFjazogbnVtYmVyLFxuICAgICk6IG51bWJlciA9PiB7XG4gICAgICByZXR1cm4gdG9OdW1iZXJPckZhbGxiYWNrKGJvYXJkPy5ba2V5XSwgZmFsbGJhY2spO1xuICAgIH07XG5cbiAgICBjb25zdCBhYmlsaXR5UGV0TmFtZUJ5QWJpbGl0eUlkID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgICBjb25zdCBhYmlsaXR5UGV0SWRCeUFiaWxpdHlJZCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gICAgY29uc3QgYXBwbHlBYmlsaXR5UGV0TWFwID0gKFxuICAgICAgYWJpbGl0eVBldE1hcDogUmVjb3JkPHN0cmluZywgc3RyaW5nIHwgbnVtYmVyPiB8IG51bGwgfCB1bmRlZmluZWQsXG4gICAgKTogdm9pZCA9PiB7XG4gICAgICBpZiAoIWFiaWxpdHlQZXRNYXApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgT2JqZWN0LmVudHJpZXMoYWJpbGl0eVBldE1hcCkuZm9yRWFjaCgoW2FiaWxpdHlJZFJhdywgcGV0SWRPck5hbWVdKSA9PiB7XG4gICAgICAgIGNvbnN0IGFiaWxpdHlJZCA9IHRvUmVwbGF5SWQoYWJpbGl0eUlkUmF3KTtcbiAgICAgICAgaWYgKCFhYmlsaXR5SWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG1hcHBlZFBldElkID1cbiAgICAgICAgICB0eXBlb2YgcGV0SWRPck5hbWUgPT09ICdudW1iZXInIHx8IHR5cGVvZiBwZXRJZE9yTmFtZSA9PT0gJ3N0cmluZydcbiAgICAgICAgICAgID8gU3RyaW5nKHBldElkT3JOYW1lKVxuICAgICAgICAgICAgOiBudWxsO1xuXG4gICAgICAgIC8vIElmIHRoZSBtYXBwZWQgcGV0IGlkIGlzIG51bWVyaWMgYnV0IG5vdCBmb3VuZCBpbiBQRVRTX0JZX0lELFxuICAgICAgICAvLyB0cnkgYSBsZWdhY3kgb2Zmc2V0IGZhbGxiYWNrIChwZXQgaWQgLSAzMCkgd2hpY2ggc29tZSBiYWNrZW5kc1xuICAgICAgICAvLyBlbWl0LiBUaGlzIGVuc3VyZXMgYWJpbGl0eS0+cGV0IG1hcHBpbmdzIHVzaW5nIHRoZSAtMzAgc2NoZW1lXG4gICAgICAgIC8vIHN0aWxsIHJlc29sdmUgdG8ga25vd24gcGV0IGlkcy5cbiAgICAgICAgaWYgKG1hcHBlZFBldElkICYmICFQRVRTX0JZX0lELmhhcyhtYXBwZWRQZXRJZCkpIHtcbiAgICAgICAgICBjb25zdCBhc051bSA9IE51bWJlcihtYXBwZWRQZXRJZCk7XG4gICAgICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIoYXNOdW0pKSB7XG4gICAgICAgICAgICBjb25zdCBmYWxsYmFja051bSA9IGFzTnVtIC0gMzA7XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihmYWxsYmFja051bSkgJiYgZmFsbGJhY2tOdW0gPiAwKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGZhbGxiYWNrSWQgPSBTdHJpbmcoZmFsbGJhY2tOdW0pO1xuICAgICAgICAgICAgICBpZiAoUEVUU19CWV9JRC5oYXMoZmFsbGJhY2tJZCkpIHtcbiAgICAgICAgICAgICAgICBtYXBwZWRQZXRJZCA9IGZhbGxiYWNrSWQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtYXBwZWRQZXROYW1lID1cbiAgICAgICAgICAobWFwcGVkUGV0SWQgPyBQRVRTX0JZX0lELmdldChtYXBwZWRQZXRJZCkgOiBudWxsKSB8fFxuICAgICAgICAgICh0eXBlb2YgcGV0SWRPck5hbWUgPT09ICdzdHJpbmcnID8gcGV0SWRPck5hbWUgOiBudWxsKTtcblxuICAgICAgICBpZiAobWFwcGVkUGV0TmFtZSkge1xuICAgICAgICAgIGFiaWxpdHlQZXROYW1lQnlBYmlsaXR5SWQuc2V0KGFiaWxpdHlJZCwgbWFwcGVkUGV0TmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hcHBlZFBldElkICYmIFBFVFNfQllfSUQuaGFzKG1hcHBlZFBldElkKSkge1xuICAgICAgICAgIGFiaWxpdHlQZXRJZEJ5QWJpbGl0eUlkLnNldChhYmlsaXR5SWQsIG1hcHBlZFBldElkKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGNvbnN0IGluZmVycmVkQWJpbGl0eU93bmVyQ291bnRzOiBBYmlsaXR5T3duZXJDb3VudHMgPSBuZXcgTWFwKCk7XG4gICAgY29sbGVjdEFiaWxpdHlPd25lckNvdW50cyhiYXR0bGVKc29uLCBpbmZlcnJlZEFiaWxpdHlPd25lckNvdW50cyk7XG4gICAgY29sbGVjdEFiaWxpdHlPd25lckNvdW50cyhidWlsZE1vZGVsLCBpbmZlcnJlZEFiaWxpdHlPd25lckNvdW50cyk7XG4gICAgY29sbGVjdEFiaWxpdHlPd25lckNvdW50cyhtZXRhQm9hcmRzLCBpbmZlcnJlZEFiaWxpdHlPd25lckNvdW50cyk7XG4gICAgYXBwbHlBYmlsaXR5UGV0TWFwKFxuICAgICAgYnVpbGRSZXBsYXlBYmlsaXR5UGV0TWFwRnJvbUNvdW50cyhpbmZlcnJlZEFiaWxpdHlPd25lckNvdW50cyksXG4gICAgKTtcbiAgICBhcHBseUFiaWxpdHlQZXRNYXAob3B0aW9ucz8uYWJpbGl0eVBldE1hcCA/PyBudWxsKTtcblxuICAgIGNvbnN0IHJlc29sdmVBYmlsaXR5T3duZXJQZXROYW1lQnlOZWFyYnlNYXAgPSAoXG4gICAgICBhYmlsaXR5SWQ6IHN0cmluZyxcbiAgICApOiBzdHJpbmcgfCBudWxsID0+IHtcbiAgICAgIGNvbnN0IHBhcnNlZEFiaWxpdHlJZCA9IE51bWJlcihhYmlsaXR5SWQpO1xuICAgICAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKHBhcnNlZEFiaWxpdHlJZCkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG9mZnNldENvdW50cyA9IG5ldyBNYXA8bnVtYmVyLCBudW1iZXI+KCk7XG4gICAgICBmb3IgKGNvbnN0IFttYXBwZWRBYmlsaXR5SWQsIG1hcHBlZFBldElkXSBvZiBhYmlsaXR5UGV0SWRCeUFiaWxpdHlJZC5lbnRyaWVzKCkpIHtcbiAgICAgICAgY29uc3QgcGFyc2VkTWFwcGVkQWJpbGl0eUlkID0gTnVtYmVyKG1hcHBlZEFiaWxpdHlJZCk7XG4gICAgICAgIGNvbnN0IHBhcnNlZE1hcHBlZFBldElkID0gTnVtYmVyKG1hcHBlZFBldElkKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICFOdW1iZXIuaXNJbnRlZ2VyKHBhcnNlZE1hcHBlZEFiaWxpdHlJZCkgfHxcbiAgICAgICAgICAhTnVtYmVyLmlzSW50ZWdlcihwYXJzZWRNYXBwZWRQZXRJZClcbiAgICAgICAgKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGguYWJzKHBhcnNlZE1hcHBlZEFiaWxpdHlJZCAtIHBhcnNlZEFiaWxpdHlJZCk7XG4gICAgICAgIGlmIChkaXN0YW5jZSA9PT0gMCB8fCBkaXN0YW5jZSA+IDIpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG9mZnNldCA9IHBhcnNlZE1hcHBlZEFiaWxpdHlJZCAtIHBhcnNlZE1hcHBlZFBldElkO1xuICAgICAgICBvZmZzZXRDb3VudHMuc2V0KG9mZnNldCwgKG9mZnNldENvdW50cy5nZXQob2Zmc2V0KSA/PyAwKSArIDEpO1xuICAgICAgfVxuXG4gICAgICBsZXQgYmVzdE9mZnNldDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG4gICAgICBsZXQgYmVzdE9mZnNldENvdW50ID0gMDtcbiAgICAgIGZvciAoY29uc3QgW29mZnNldCwgY291bnRdIG9mIG9mZnNldENvdW50cy5lbnRyaWVzKCkpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGNvdW50ID4gYmVzdE9mZnNldENvdW50IHx8XG4gICAgICAgICAgKGNvdW50ID09PSBiZXN0T2Zmc2V0Q291bnQgJiZcbiAgICAgICAgICAgIChiZXN0T2Zmc2V0ID09PSBudWxsIHx8IE1hdGguYWJzKG9mZnNldCkgPCBNYXRoLmFicyhiZXN0T2Zmc2V0KSkpXG4gICAgICAgICkge1xuICAgICAgICAgIGJlc3RPZmZzZXQgPSBvZmZzZXQ7XG4gICAgICAgICAgYmVzdE9mZnNldENvdW50ID0gY291bnQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGJlc3RPZmZzZXQgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGluZmVycmVkUGV0SWQgPSBTdHJpbmcocGFyc2VkQWJpbGl0eUlkIC0gYmVzdE9mZnNldCk7XG4gICAgICByZXR1cm4gUEVUU19CWV9JRC5nZXQoaW5mZXJyZWRQZXRJZCkgPz8gbnVsbDtcbiAgICB9O1xuXG4gICAgY29uc3QgcmVzb2x2ZUFiaWxpdHlPd25lclBldE5hbWUgPSAoYWJpbGl0eUlkOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsID0+IHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIGFiaWxpdHlQZXROYW1lQnlBYmlsaXR5SWQuZ2V0KGFiaWxpdHlJZCkgPz9cbiAgICAgICAgcmVzb2x2ZUFiaWxpdHlPd25lclBldE5hbWVCeU5lYXJieU1hcChhYmlsaXR5SWQpXG4gICAgICApO1xuICAgIH07XG5cbiAgICBjb25zdCBnZXRUaW1lc0h1cnQgPSAocGV0SnNvbjogUmVwbGF5UGV0SnNvbik6IG51bWJlciB8IG51bGwgPT4ge1xuICAgICAgcmV0dXJuIGdldFRpbWVzSHVydEZyb21SYXdQZXQocGV0SnNvbik7XG4gICAgfTtcblxuICAgIGNvbnN0IGluZmVyQ29waWVkUGV0TmFtZSA9IChcbiAgICAgIHBldEpzb246IFJlcGxheVBldEpzb24sXG4gICAgICBjb3B5UGV0TmFtZTogc3RyaW5nLFxuICAgICk6IHN0cmluZyB8IG51bGwgPT4ge1xuICAgICAgLy8gU3RvcmVkLWFiaWxpdHkgZW51bXMgYXJlIGRlZmluaXRpdmUuIENoZWNrIGV2ZXJ5IGFiaWxpdHkgZm9yIG9uZSBiZWZvcmVcbiAgICAgIC8vIGF0dGVtcHRpbmcgbmVhcmJ5LW1hcCBpbmZlcmVuY2U7IG90aGVyd2lzZSB0aGUgaG9sZGVyJ3MgbmF0aXZlIGFiaWxpdHlcbiAgICAgIC8vIGNhbiBwcm9kdWNlIGEgcGxhdXNpYmxlIGJ1dCBpbmNvcnJlY3QgcGV0IChmb3IgZXhhbXBsZSBBYXJkdmFyayBiZWZvcmVcbiAgICAgIC8vIHJlYWNoaW5nIEJlbHVnYSdzIHN0b3JlZCBXb2xmIGVudW0pLlxuICAgICAgZm9yIChjb25zdCBhYmlsaXR5IG9mIHBldEpzb24uQWJpbCA/PyBbXSkge1xuICAgICAgICBjb25zdCBhYmlsaXR5SWQgPSB0b1JlcGxheUlkKGFiaWxpdHk/LkVudSk7XG4gICAgICAgIGNvbnN0IHN0b3JlZENvcHlPd25lciA9IGFiaWxpdHlJZFxuICAgICAgICAgID8gU1RPUkVEX0NPUFlfQUJJTElUWV9PV05FUl9CWV9JRC5nZXQoYWJpbGl0eUlkKVxuICAgICAgICAgIDogbnVsbDtcbiAgICAgICAgaWYgKHN0b3JlZENvcHlPd25lcikge1xuICAgICAgICAgIHJldHVybiBzdG9yZWRDb3B5T3duZXI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZm9yIChjb25zdCBhYmlsaXR5IG9mIHBldEpzb24uQWJpbCA/PyBbXSkge1xuICAgICAgICBjb25zdCBhYmlsaXR5SWQgPSB0b1JlcGxheUlkKGFiaWxpdHk/LkVudSk7XG4gICAgICAgIGlmICghYWJpbGl0eUlkKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG93bmVyUGV0TmFtZSA9IHJlc29sdmVBYmlsaXR5T3duZXJQZXROYW1lKGFiaWxpdHlJZCk7XG4gICAgICAgIC8vIFJlcGxheSBpbmRleGVzIGNhbiBhdHRyaWJ1dGUgYSBjb3BpZWQgYWJpbGl0eSB0byBpdHMgY3VycmVudCBob2xkZXIuXG4gICAgICAgIC8vIFdoZW4gdGhhdCBoYXBwZW5zLCB1c2UgdGhlIHN1cnJvdW5kaW5nIGNhbm9uaWNhbCBhYmlsaXR5IG1hcCB0byBmaW5kXG4gICAgICAgIC8vIHRoZSBvcmlnaW5hbCBvd25lciBpbnN0ZWFkLlxuICAgICAgICBpZiAob3duZXJQZXROYW1lID09PSBjb3B5UGV0TmFtZSkge1xuICAgICAgICAgIG93bmVyUGV0TmFtZSA9IHJlc29sdmVBYmlsaXR5T3duZXJQZXROYW1lQnlOZWFyYnlNYXAoYWJpbGl0eUlkKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3duZXJQZXROYW1lICYmIG93bmVyUGV0TmFtZSAhPT0gY29weVBldE5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gb3duZXJQZXROYW1lO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuXG4gICAgY29uc3QgcGFyc2VBYm9taW5hdGlvblN3YWxsb3dlZFN0YXRlID0gKFxuICAgICAgcGV0SnNvbjogUmVwbGF5UGV0SnNvbixcbiAgICApOiBBYm9taW5hdGlvblN3YWxsb3dlZFN0YXRlID0+IHtcbiAgICAgIGNvbnN0IGFib21pbmF0aW9uU3RhdGUgPSBkZWZhdWx0QWJvbWluYXRpb25Td2FsbG93ZWRTdGF0ZSgpO1xuICAgICAgY29uc3QgYXBwbHlOZXN0ZWRNZW1vcnlTdGF0ZSA9IChcbiAgICAgICAgc2xvdEZpZWxkczogKHR5cGVvZiBBQk9NSU5BVElPTl9TTE9UX0ZJRUxEUylbbnVtYmVyXSxcbiAgICAgICAgb3duZXJQZXROYW1lOiBzdHJpbmcsXG4gICAgICAgIGFiaWxpdHk6IFJlcGxheUFiaWxpdHlKc29uLFxuICAgICAgKTogdm9pZCA9PiB7XG4gICAgICAgIGNvbnN0IG1lbW9yeUVudHJ5ID0gZ2V0UmVwbGF5TWVtb3J5RW50cnlCeUFiaWxpdHlJZChwZXRKc29uLCBhYmlsaXR5LkVudSk7XG4gICAgICAgIGNvbnN0IG5lc3RlZFRpbWVzSHVydCA9IGdldFRpbWVzSHVydEZyb21SYXdQZXQobWVtb3J5RW50cnkpO1xuICAgICAgICBpZiAobmVzdGVkVGltZXNIdXJ0ICE9PSBudWxsKSB7XG4gICAgICAgICAgYWJvbWluYXRpb25TdGF0ZVtzbG90RmllbGRzLnRpbWVzSHVydF0gPSBuZXN0ZWRUaW1lc0h1cnQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbmVzdGVkU3dhbGxvd2VkUGV0ID0gcmVzb2x2ZU5lc3RlZFN3YWxsb3dlZFBldE5hbWUobWVtb3J5RW50cnkpO1xuICAgICAgICBpZiAoIW5lc3RlZFN3YWxsb3dlZFBldCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3duZXJQZXROYW1lID09PSAnQmVsdWdhIFdoYWxlJykge1xuICAgICAgICAgIGFib21pbmF0aW9uU3RhdGVbc2xvdEZpZWxkcy5iZWx1Z2FdID0gbmVzdGVkU3dhbGxvd2VkUGV0O1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3duZXJQZXROYW1lID09PSAnU2FyY2FzdGljIEZyaW5nZWhlYWQnKSB7XG4gICAgICAgICAgYWJvbWluYXRpb25TdGF0ZVtzbG90RmllbGRzLnNhcmNhc3RpY0ZyaW5nZWhlYWRdID0gbmVzdGVkU3dhbGxvd2VkUGV0O1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBjb3BpZWRBYmlsaXRpZXMgPSAocGV0SnNvbj8uQWJpbCA/PyBbXSlcbiAgICAgICAgLm1hcCgoYWJpbGl0eSwgaW5kZXgpID0+ICh7IGFiaWxpdHksIGluZGV4IH0pKVxuICAgICAgICAuZmlsdGVyKFxuICAgICAgICAgIChcbiAgICAgICAgICAgIGFiaWxpdHlFbnRyeSxcbiAgICAgICAgICApOiBhYmlsaXR5RW50cnkgaXMgeyBhYmlsaXR5OiBSZXBsYXlBYmlsaXR5SnNvbjsgaW5kZXg6IG51bWJlciB9ID0+XG4gICAgICAgICAgICBhYmlsaXR5RW50cnkuYWJpbGl0eSAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgdG9SZXBsYXlJZChhYmlsaXR5RW50cnkuYWJpbGl0eT8uRW51KSAhPT0gbnVsbCxcbiAgICAgICAgKTtcblxuICAgICAgaWYgKGNvcGllZEFiaWxpdGllcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGFib21pbmF0aW9uU3RhdGU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGdyb3VwZWRBYmlsaXRpZXMgPSBuZXcgTWFwPFxuICAgICAgICBudW1iZXIsXG4gICAgICAgIHsgYWJpbGl0eTogUmVwbGF5QWJpbGl0eUpzb247IGluZGV4OiBudW1iZXIgfVtdXG4gICAgICA+KCk7XG4gICAgICBjb25zdCBvcmRlcmVkR3JvdXBLZXlzOiBudW1iZXJbXSA9IFtdO1xuICAgICAgY29waWVkQWJpbGl0aWVzLmZvckVhY2goKGFiaWxpdHlFbnRyeSkgPT4ge1xuICAgICAgICBjb25zdCBncm91cEtleSA9IHRvRmluaXRlTnVtYmVyKGFiaWxpdHlFbnRyeS5hYmlsaXR5Py5Hcm9wKSA/PyAwO1xuICAgICAgICBpZiAoIWdyb3VwZWRBYmlsaXRpZXMuaGFzKGdyb3VwS2V5KSkge1xuICAgICAgICAgIGdyb3VwZWRBYmlsaXRpZXMuc2V0KGdyb3VwS2V5LCBbXSk7XG4gICAgICAgICAgb3JkZXJlZEdyb3VwS2V5cy5wdXNoKGdyb3VwS2V5KTtcbiAgICAgICAgfVxuICAgICAgICBncm91cGVkQWJpbGl0aWVzLmdldChncm91cEtleSk/LnB1c2goYWJpbGl0eUVudHJ5KTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCB1c2VkQWJpbGl0eUluZGV4ZXMgPSBuZXcgU2V0PG51bWJlcj4oKTtcbiAgICAgIGNvbnN0IHVucmVzb2x2ZWRTbG90SW5kZXhlczogbnVtYmVyW10gPSBbXTtcblxuICAgICAgQUJPTUlOQVRJT05fU0xPVF9GSUVMRFMuZm9yRWFjaCgoc2xvdEZpZWxkcywgc2xvdEluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IGdyb3VwS2V5ID0gb3JkZXJlZEdyb3VwS2V5c1tzbG90SW5kZXhdO1xuICAgICAgICBpZiAoZ3JvdXBLZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHVucmVzb2x2ZWRTbG90SW5kZXhlcy5wdXNoKHNsb3RJbmRleCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGdyb3VwQWJpbGl0aWVzID0gZ3JvdXBlZEFiaWxpdGllcy5nZXQoZ3JvdXBLZXkpO1xuICAgICAgICBpZiAoIWdyb3VwQWJpbGl0aWVzIHx8IGdyb3VwQWJpbGl0aWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHVucmVzb2x2ZWRTbG90SW5kZXhlcy5wdXNoKHNsb3RJbmRleCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlc29sdmVkQWJpbGl0eUVudHJ5OlxuICAgICAgICAgIHwgeyBhYmlsaXR5OiBSZXBsYXlBYmlsaXR5SnNvbjsgaW5kZXg6IG51bWJlciB9XG4gICAgICAgICAgfCBudWxsID0gbnVsbDtcbiAgICAgICAgbGV0IHJlc29sdmVkUGV0TmFtZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgICAgICAgZm9yIChjb25zdCBhYmlsaXR5RW50cnkgb2YgZ3JvdXBBYmlsaXRpZXMpIHtcbiAgICAgICAgICBjb25zdCBhYmlsaXR5SWQgPSB0b1JlcGxheUlkKGFiaWxpdHlFbnRyeS5hYmlsaXR5Py5FbnUpO1xuICAgICAgICAgIGlmICghYWJpbGl0eUlkKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3Qgb3duZXJQZXROYW1lID0gcmVzb2x2ZUFiaWxpdHlPd25lclBldE5hbWUoYWJpbGl0eUlkKTtcbiAgICAgICAgICBpZiAoIW93bmVyUGV0TmFtZSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc29sdmVkQWJpbGl0eUVudHJ5ID0gYWJpbGl0eUVudHJ5O1xuICAgICAgICAgIHJlc29sdmVkUGV0TmFtZSA9IG93bmVyUGV0TmFtZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghcmVzb2x2ZWRBYmlsaXR5RW50cnkgfHwgIXJlc29sdmVkUGV0TmFtZSkge1xuICAgICAgICAgIHVucmVzb2x2ZWRTbG90SW5kZXhlcy5wdXNoKHNsb3RJbmRleCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgYWJvbWluYXRpb25TdGF0ZVtzbG90RmllbGRzLnBldF0gPSByZXNvbHZlZFBldE5hbWU7XG4gICAgICAgIGNvbnN0IGluZmVycmVkTGV2ZWwgPSB0b0Zpbml0ZU51bWJlcihyZXNvbHZlZEFiaWxpdHlFbnRyeS5hYmlsaXR5Py5MdmwpO1xuICAgICAgICBpZiAoaW5mZXJyZWRMZXZlbCAhPT0gbnVsbCkge1xuICAgICAgICAgIGFib21pbmF0aW9uU3RhdGVbc2xvdEZpZWxkcy5sZXZlbF0gPSBpbmZlcnJlZExldmVsO1xuICAgICAgICB9XG4gICAgICAgIGFwcGx5TmVzdGVkTWVtb3J5U3RhdGUoXG4gICAgICAgICAgc2xvdEZpZWxkcyxcbiAgICAgICAgICByZXNvbHZlZFBldE5hbWUsXG4gICAgICAgICAgcmVzb2x2ZWRBYmlsaXR5RW50cnkuYWJpbGl0eSxcbiAgICAgICAgKTtcbiAgICAgICAgdXNlZEFiaWxpdHlJbmRleGVzLmFkZChyZXNvbHZlZEFiaWxpdHlFbnRyeS5pbmRleCk7XG4gICAgICB9KTtcblxuICAgICAgaWYgKHVucmVzb2x2ZWRTbG90SW5kZXhlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGFib21pbmF0aW9uU3RhdGU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZhbGxiYWNrUmVzb2x2ZWRBYmlsaXRpZXMgPSBjb3BpZWRBYmlsaXRpZXNcbiAgICAgICAgLmZpbHRlcigoYWJpbGl0eUVudHJ5KSA9PiAhdXNlZEFiaWxpdHlJbmRleGVzLmhhcyhhYmlsaXR5RW50cnkuaW5kZXgpKVxuICAgICAgICAubWFwKChhYmlsaXR5RW50cnkpID0+IHtcbiAgICAgICAgICBjb25zdCBhYmlsaXR5SWQgPSB0b1JlcGxheUlkKGFiaWxpdHlFbnRyeS5hYmlsaXR5Py5FbnUpO1xuICAgICAgICAgIGlmICghYWJpbGl0eUlkKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3Qgb3duZXJQZXROYW1lID0gcmVzb2x2ZUFiaWxpdHlPd25lclBldE5hbWUoYWJpbGl0eUlkKTtcbiAgICAgICAgICBpZiAoIW93bmVyUGV0TmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvd25lclBldE5hbWUsXG4gICAgICAgICAgICBsZXZlbDogdG9GaW5pdGVOdW1iZXIoYWJpbGl0eUVudHJ5LmFiaWxpdHk/Lkx2bCksXG4gICAgICAgICAgICBhYmlsaXR5OiBhYmlsaXR5RW50cnkuYWJpbGl0eSxcbiAgICAgICAgICB9O1xuICAgICAgICB9KVxuICAgICAgICAuZmlsdGVyKFxuICAgICAgICAgIChcbiAgICAgICAgICAgIGFiaWxpdHlFbnRyeSxcbiAgICAgICAgICApOiBhYmlsaXR5RW50cnkgaXMge1xuICAgICAgICAgICAgb3duZXJQZXROYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICBsZXZlbDogbnVtYmVyIHwgbnVsbDtcbiAgICAgICAgICAgIGFiaWxpdHk6IFJlcGxheUFiaWxpdHlKc29uO1xuICAgICAgICAgIH0gPT5cbiAgICAgICAgICAgIGFiaWxpdHlFbnRyeSAhPT0gbnVsbCxcbiAgICAgICAgKTtcblxuICAgICAgdW5yZXNvbHZlZFNsb3RJbmRleGVzLmZvckVhY2goKHNsb3RJbmRleCwgZmFsbGJhY2tJbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBmYWxsYmFja0FiaWxpdHkgPSBmYWxsYmFja1Jlc29sdmVkQWJpbGl0aWVzW2ZhbGxiYWNrSW5kZXhdO1xuICAgICAgICBpZiAoIWZhbGxiYWNrQWJpbGl0eSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzbG90RmllbGRzID0gQUJPTUlOQVRJT05fU0xPVF9GSUVMRFNbc2xvdEluZGV4XTtcbiAgICAgICAgYWJvbWluYXRpb25TdGF0ZVtzbG90RmllbGRzLnBldF0gPSBmYWxsYmFja0FiaWxpdHkub3duZXJQZXROYW1lO1xuICAgICAgICBpZiAoZmFsbGJhY2tBYmlsaXR5LmxldmVsICE9PSBudWxsKSB7XG4gICAgICAgICAgYWJvbWluYXRpb25TdGF0ZVtzbG90RmllbGRzLmxldmVsXSA9IGZhbGxiYWNrQWJpbGl0eS5sZXZlbDtcbiAgICAgICAgfVxuICAgICAgICBhcHBseU5lc3RlZE1lbW9yeVN0YXRlKFxuICAgICAgICAgIHNsb3RGaWVsZHMsXG4gICAgICAgICAgZmFsbGJhY2tBYmlsaXR5Lm93bmVyUGV0TmFtZSxcbiAgICAgICAgICBmYWxsYmFja0FiaWxpdHkuYWJpbGl0eSxcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gYWJvbWluYXRpb25TdGF0ZTtcbiAgICB9O1xuXG4gICAgY29uc3QgcGFyc2VQZXQgPSAocGV0SnNvbjogUmVwbGF5UGV0SnNvbiB8IG51bGwgfCB1bmRlZmluZWQpOiBQZXRDb25maWcgfCBudWxsID0+IHtcbiAgICAgIGlmICghcGV0SnNvbikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgLy8gQnVpbGQgaGVscGVyIG1hcHMgZm9yIG1vcmUgYWR2YW5jZWQgaW5mZXJlbmNlICh1c2VkIGZvciBBYm9taW5hdGlvbiBtZW1vcnkpXG4gICAgICBjb25zdCBwZXRSZWNvcmQgPSBhc1JlY29yZChwZXRKc29uKTtcbiAgICAgIGNvbnN0IG1hcHM6IFJlcGxheVBhcnNlckxvb2t1cE1hcHMgPSB7IFBFVF9JRFNfQllfTkFNRSB9O1xuXG4gICAgICBjb25zdCByYXdQZXRSZWYgPVxuICAgICAgICBwZXRKc29uLkVudSA/P1xuICAgICAgICBwZXRSZWNvcmQ/LlsnZW51J10gPz9cbiAgICAgICAgcGV0UmVjb3JkPy5bJ0lkJ10gPz9cbiAgICAgICAgcGV0UmVjb3JkPy5bJ2lkJ107XG4gICAgICBjb25zdCByZXNvbHZlZFBldElkID0gcmVzb2x2ZVBldElkRnJvbVVua25vd24ocmF3UGV0UmVmLCBtYXBzKTtcbiAgICAgIGNvbnN0IHBldElkID0gcmVzb2x2ZWRQZXRJZCAhPT0gbnVsbCA/IFN0cmluZyhyZXNvbHZlZFBldElkKSA6IFN0cmluZyhyYXdQZXRSZWYgPz8gMCk7XG5cbiAgICAgIGNvbnN0IHBldE5hbWUgPVxuICAgICAgICBQRVRTX0JZX0lELmdldChwZXRJZCkgfHxcbiAgICAgICAgKHR5cGVvZiBwZXRSZWNvcmQ/LlsnbmFtZSddID09PSAnc3RyaW5nJyA/IHBldFJlY29yZFsnbmFtZSddIDogbnVsbCkgfHxcbiAgICAgICAgKHR5cGVvZiBwZXRSZWNvcmQ/LlsnTmFtZSddID09PSAnc3RyaW5nJyA/IHBldFJlY29yZFsnTmFtZSddIDogbnVsbCkgfHxcbiAgICAgICAgKHR5cGVvZiByYXdQZXRSZWYgPT09ICdzdHJpbmcnICYmIHJhd1BldFJlZi50cmltKCkubGVuZ3RoID4gMFxuICAgICAgICAgID8gcmF3UGV0UmVmLnRyaW0oKVxuICAgICAgICAgIDogYFBldCAjJHtwZXRJZH1gKTtcblxuICAgICAgY29uc29sZS5sb2coYFtSZXBsYXlDYWxjUGFyc2VyXSBQZXQgRW51OiR7cmF3UGV0UmVmfSAtPiBJZDoke3BldElkfSAtPiBOYW1lOiR7cGV0TmFtZX1gKTtcblxuICAgICAgY29uc3QgYXRKc29uID0gcGV0SnNvbi5BdCA/PyBhc1JlY29yZChwZXRSZWNvcmQ/LlsnYXQnXSk7XG4gICAgICBjb25zdCBocEpzb24gPSBwZXRKc29uLkhwID8/IGFzUmVjb3JkKHBldFJlY29yZD8uWydocCddKTtcbiAgICAgIGNvbnN0IGF0SnNvblJlY29yZCA9IGFzUmVjb3JkKGF0SnNvbik7XG4gICAgICBjb25zdCBocEpzb25SZWNvcmQgPSBhc1JlY29yZChocEpzb24pO1xuXG4gICAgICBjb25zdCBwZXRUZW1wQXRrID0gdG9OdW1iZXJPckZhbGxiYWNrKFxuICAgICAgICBhdEpzb24/LlRlbXAgPz8gYXRKc29uUmVjb3JkPy5bJ3RlbXAnXSxcbiAgICAgICAgMCxcbiAgICAgICk7XG4gICAgICBjb25zdCBwZXRUZW1wSHAgPSB0b051bWJlck9yRmFsbGJhY2soXG4gICAgICAgIGhwSnNvbj8uVGVtcCA/PyBocEpzb25SZWNvcmQ/LlsndGVtcCddLFxuICAgICAgICAwLFxuICAgICAgKTtcblxuICAgICAgY29uc3QgYmVsdWdhU3dhbGxvd2VkUGV0ID1cbiAgICAgICAgcGV0SWQgPT09ICcxODInXG4gICAgICAgICAgPyByZXNvbHZlTmVzdGVkU3dhbGxvd2VkUGV0TmFtZShwZXRKc29uKSA/P1xuICAgICAgICAgICAgaW5mZXJDb3BpZWRQZXROYW1lKHBldEpzb24sICdCZWx1Z2EgV2hhbGUnKVxuICAgICAgICAgIDogbnVsbDtcbiAgICAgIGNvbnN0IHNhcmNhc3RpY0ZyaW5nZWhlYWRTd2FsbG93ZWRQZXQgPVxuICAgICAgICBwZXRJZCA9PT0gJzc2MydcbiAgICAgICAgICA/IHJlc29sdmVOZXN0ZWRTd2FsbG93ZWRQZXROYW1lKHBldEpzb24pID8/XG4gICAgICAgICAgICBpbmZlckNvcGllZFBldE5hbWUocGV0SnNvbiwgJ1NhcmNhc3RpYyBGcmluZ2VoZWFkJylcbiAgICAgICAgICA6IG51bGw7XG4gICAgICBjb25zdCBhYm9taW5hdGlvblN3YWxsb3dlZFN0YXRlID1cbiAgICAgICAgcGV0SWQgPT09ICczNzMnXG4gICAgICAgICAgPyBwYXJzZUFib21pbmF0aW9uU3dhbGxvd2VkU3RhdGUocGV0SnNvbilcbiAgICAgICAgICA6IGRlZmF1bHRBYm9taW5hdGlvblN3YWxsb3dlZFN0YXRlKCk7XG5cbiAgICAgIC8vIGFiaWxpdHlQZXRJZEJ5QWJpbGl0eUlkIGlzIGEgTWFwPGFiaWxpdHlJZCwgcGV0SWQ+XG4gICAgICAvLyBXZSBpbnZlcnQgaXQgaW50byBhYmlsaXR5SWRzQnlQZXRJZDogeyBbcGV0SWRdOiBbYWJpbGl0eUlkLCAuLi5dIH1cbiAgICAgIGNvbnN0IGFiaWxpdHlJZHNCeVBldElkOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmdbXT4gPSB7fTtcbiAgICAgIGZvciAoY29uc3QgW2FiaWxpdHlJZCwgbWFwcGVkUGV0SWRdIG9mIGFiaWxpdHlQZXRJZEJ5QWJpbGl0eUlkLmVudHJpZXMoKSkge1xuICAgICAgICBjb25zdCBwaWQgPSBTdHJpbmcobWFwcGVkUGV0SWQpO1xuICAgICAgICBhYmlsaXR5SWRzQnlQZXRJZFtwaWRdID0gYWJpbGl0eUlkc0J5UGV0SWRbcGlkXSB8fCBbXTtcbiAgICAgICAgYWJpbGl0eUlkc0J5UGV0SWRbcGlkXS5wdXNoKFN0cmluZyhhYmlsaXR5SWQpKTtcbiAgICAgIH1cbiAgICAgIG1hcHMuYWJpbGl0eUlkc0J5UGV0SWQgPSBhYmlsaXR5SWRzQnlQZXRJZDtcblxuICAgICAgY29uc3QgdGltZXNIdXJ0ID0gZ2V0VGltZXNIdXJ0KHBldEpzb24pO1xuICAgICAgY29uc3QgYWJpbGl0eVRyaWdnZXJzQ29uc3VtZWQgPSAoKCkgPT4ge1xuICAgICAgICBjb25zdCB2ID0gZ2V0VHJpZ2dlcnNDb25zdW1lZEZyb21SYXdQZXQocGV0SnNvbik7XG4gICAgICAgIHJldHVybiB2ID09PSBudWxsID8gW10gOiBbdl07XG4gICAgICB9KSgpO1xuXG4gICAgICBjb25zdCBwZXJrVmFsdWUgPSBwZXRKc29uLlBlcms7XG4gICAgICBjb25zdCByZXBsYXlQZXJrTmFtZSA9XG4gICAgICAgIHBldElkICE9PSBudWxsXG4gICAgICAgICAgPyBvcHRpb25zPy5wZXJrTmFtZUJ5UGV0SWQ/LltTdHJpbmcocGV0SWQpXSA/PyBudWxsXG4gICAgICAgICAgOiBudWxsO1xuICAgICAgY29uc3QgcGVya05hbWUgPVxuICAgICAgICByZXBsYXlQZXJrTmFtZSA/P1xuICAgICAgICAocGVya1ZhbHVlICE9PSBudWxsICYmIHBlcmtWYWx1ZSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgPyBQRVJLU19CWV9JRC5nZXQoU3RyaW5nKHBlcmtWYWx1ZSkpIHx8XG4gICAgICAgICAgICAodHlwZW9mIHBlcmtWYWx1ZSA9PT0gJ3N0cmluZycgPyBwZXJrVmFsdWUgOiAnVW5rbm93biBQZXJrJylcbiAgICAgICAgICA6IG51bGwpO1xuXG4gICAgICBjb25zdCBwYXJzZWRQZXQ6IFBldENvbmZpZyA9IHtcbiAgICAgICAgbmFtZTogcGV0TmFtZSxcbiAgICAgICAgYXR0YWNrOlxuICAgICAgICAgIHRvTnVtYmVyT3JGYWxsYmFjayhcbiAgICAgICAgICAgIGF0SnNvbj8uUGVybSA/PyBhdEpzb25SZWNvcmQ/LlsncGVybSddID8/IHBldFJlY29yZD8uWydhdHRhY2snXSxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgKSArIHBldFRlbXBBdGssXG4gICAgICAgIGhlYWx0aDpcbiAgICAgICAgICB0b051bWJlck9yRmFsbGJhY2soXG4gICAgICAgICAgICBocEpzb24/LlBlcm0gPz8gaHBKc29uUmVjb3JkPy5bJ3Blcm0nXSA/PyBwZXRSZWNvcmQ/LlsnaGVhbHRoJ10sXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICkgKyBwZXRUZW1wSHAsXG4gICAgICAgIGV4cDogKCgpID0+IHtcbiAgICAgICAgICBjb25zdCBleHAgPSB0b0Zpbml0ZU51bWJlcihwZXRKc29uLkV4cCk7XG4gICAgICAgICAgaWYgKGV4cCAhPT0gbnVsbCAmJiBleHAgPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZXhwO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBsdmwgPSB0b0Zpbml0ZU51bWJlcihwZXRKc29uLkx2bCk7XG4gICAgICAgICAgaWYgKGx2bCA9PT0gMikge1xuICAgICAgICAgICAgcmV0dXJuIDI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChsdmwgPT09IDMpIHtcbiAgICAgICAgICAgIHJldHVybiA1O1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZXhwID8/IDA7XG4gICAgICAgIH0pKCksXG4gICAgICAgIGVxdWlwbWVudDogcGVya05hbWUgPyB7IG5hbWU6IHBlcmtOYW1lIH0gOiBudWxsLFxuICAgICAgICBtYW5hOiB0b051bWJlck9yRmFsbGJhY2socGV0SnNvbi5NYW5hLCAwKSxcbiAgICAgICAgYmVsdWdhU3dhbGxvd2VkUGV0LFxuICAgICAgICBzYXJjYXN0aWNGcmluZ2VoZWFkU3dhbGxvd2VkUGV0LFxuICAgICAgICAuLi5hYm9taW5hdGlvblN3YWxsb3dlZFN0YXRlLFxuICAgICAgICBiYXR0bGVzRm91Z2h0OiAwLFxuICAgICAgICB0cmlnZ2Vyc0NvbnN1bWVkOlxuICAgICAgICAgIGFiaWxpdHlUcmlnZ2Vyc0NvbnN1bWVkLmxlbmd0aCA+IDBcbiAgICAgICAgICAgID8gTWF0aC5tYXgoLi4uYWJpbGl0eVRyaWdnZXJzQ29uc3VtZWQpXG4gICAgICAgICAgICA6IDAsXG4gICAgICB9O1xuXG4gICAgICAvLyBJZiB0aGlzIGlzIGFuIEFib21pbmF0aW9uLCBhdHRlbXB0IHRvIGF0dGFjaCBpbmZlcnJlZCBtZW1vcnkvYWJpbGl0aWVzXG4gICAgICBpZiAoU3RyaW5nKHBldElkKSA9PT0gJzM3MycpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBtZW0gPSBidWlsZEFib21pbmF0aW9uTWVtb3J5KHBldEpzb24sIE51bWJlcihwZXRJZCksIG1hcHMpO1xuICAgICAgICAgIGlmIChtZW0pIHtcbiAgICAgICAgICAgIGNvbnN0IGFib21pbmF0aW9uUGV0ID0gcGFyc2VkUGV0IGFzIFBldENvbmZpZyAmIHtcbiAgICAgICAgICAgICAgYWJvbWluYXRpb25NZW1vcnk/OiB1bmtub3duO1xuICAgICAgICAgICAgICBhYm9taW5hdGlvbkluZmVycmVkQWJpbGl0eUVudW1zPzogbnVtYmVyW107XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYWJvbWluYXRpb25QZXQuYWJvbWluYXRpb25NZW1vcnkgPSBtZW07XG4gICAgICAgICAgICBjb25zdCBpbmZlcnJlZEVudW1zID0gaW5mZXJBYm9taW5hdGlvbkFiaWxpdHlFbnVtc0Zyb21Td2FsbG93ZWRQZXRzKFxuICAgICAgICAgICAgICBwZXRKc29uLFxuICAgICAgICAgICAgICBtYXBzLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGluZmVycmVkRW51bXMpICYmIGluZmVycmVkRW51bXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBhYm9taW5hdGlvblBldC5hYm9taW5hdGlvbkluZmVycmVkQWJpbGl0eUVudW1zID0gaW5mZXJyZWRFbnVtcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgdm9pZCBlcnJvcjtcbiAgICAgICAgICAvKiBiZXN0LWVmZm9ydCBvbmx5ICovXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aW1lc0h1cnQgIT09IG51bGwpIHtcbiAgICAgICAgcGFyc2VkUGV0LnRpbWVzSHVydCA9IHRpbWVzSHVydDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBhcnNlZFBldDtcbiAgICB9O1xuXG4gICAgY29uc3QgcGFyc2VCb2FyZFBldHMgPSAoXG4gICAgICBib2FyZEpzb246IFJlcGxheUJvYXJkSnNvbiB8IG51bGwgfCB1bmRlZmluZWQsXG4gICAgKTogKFBldENvbmZpZyB8IG51bGwpW10gPT4ge1xuICAgICAgY29uc3QgaXRlbXMgPSBib2FyZEpzb24/Lk1pbnM/Lkl0ZW1zID8/IFtdO1xuICAgICAgY29uc3QgcGV0QXJyYXk6IChQZXRDb25maWcgfCBudWxsKVtdID0gQXJyYXkoNSkuZmlsbChudWxsKTtcbiAgICAgIGl0ZW1zLmZvckVhY2goKHBldCwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKCFwZXQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHBvcyA9IHRvTnVtYmVyT3JGYWxsYmFjayhwZXQuUG9pPy54LCAtMSk7XG4gICAgICAgIGlmIChwb3MgPT09IC0xKSB7XG4gICAgICAgICAgcG9zID0gaW5kZXg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvcyA+PSAwICYmIHBvcyA8IDUpIHtcbiAgICAgICAgICBwZXRBcnJheVtwb3NdID0gcGFyc2VQZXQocGV0KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBwZXRBcnJheS5yZXZlcnNlKCk7XG4gICAgfTtcblxuICAgIGNvbnN0IGdldFRveSA9IChib2FyZEpzb246IFJlcGxheUJvYXJkSnNvbiB8IG51bGwgfCB1bmRlZmluZWQpOiBSZXBsYXlQYXJzZWRUb3kgPT4ge1xuICAgICAgY29uc3QgdG95SXRlbSA9IChib2FyZEpzb24/LlJlbD8uSXRlbXMgPz8gW10pLmZpbmQoKGl0ZW0pID0+IEJvb2xlYW4oaXRlbSkpO1xuICAgICAgaWYgKHRveUl0ZW0pIHtcbiAgICAgICAgY29uc3QgdG95UmVjb3JkID0gYXNSZWNvcmQodG95SXRlbSk7XG4gICAgICAgIGNvbnN0IHRveUlkID0gcmVzb2x2ZVRveUlkKHRveUl0ZW0pID8/IG51bGw7XG4gICAgICAgIGNvbnN0IHRveU5hbWUgPSB0b3lJZCA/IFRPWVNfQllfSUQuZ2V0KFN0cmluZyh0b3lJZCkpIDogZ2V0VG95TmFtZSh0b3lJdGVtKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBuYW1lOiB0b3lOYW1lIHx8IG51bGwsXG4gICAgICAgICAgbGV2ZWw6IHRvTnVtYmVyT3JGYWxsYmFjayh0b3lSZWNvcmQ/LlsnTHZsJ10sIDEpLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHsgbmFtZTogbnVsbCwgbGV2ZWw6IDEgfTtcbiAgICB9O1xuXG4gICAgY29uc3QgcGxheWVyVG95ID0gZ2V0VG95KHVzZXJCb2FyZCk7XG4gICAgY29uc3Qgb3Bwb25lbnRUb3kgPSBnZXRUb3kob3Bwb25lbnRCb2FyZCk7XG5cbiAgICBjb25zdCBjdXN0b21QYWNrcyA9IHRoaXMuYnVpbGRDdXN0b21QYWNrc0Zyb21HZW5lc2lzKGJ1aWxkTW9kZWwsIGJhdHRsZUpzb24pO1xuICAgIC8vIEdlbmVzaXNCdWlsZE1vZGVsIGJlbG9uZ3MgdG8gdGhlIHBhcnRpY2lwYXRpb24gSUQgdXNlZCB0byBmZXRjaCB0aGVcbiAgICAvLyByZXBsYXksIHdoaWNoIGlzIHRoZSBwbGF5ZXIgcGVyc3BlY3RpdmUuIFN1bW1hcml6ZWQgcmVwbGF5IGJhdHRsZXMgb2Z0ZW5cbiAgICAvLyBvbWl0IFVzZXJCb2FyZC5EZWNrLCBzbyB1c2UgdGhlIGdlbmVzaXMgZGVjayBhcyB0aGUgcGxheWVyJ3MgZmFsbGJhY2suXG4gICAgLy8gTmV2ZXIgdXNlIGl0IGZvciB0aGUgb3Bwb25lbnQ6IHRoZWlyIGN1c3RvbSBkZWNrIHJlcXVpcmVzIHRoZWlyIG93blxuICAgIC8vIHBhcnRpY2lwYXRpb24gcmVwbGF5LlxuICAgIGNvbnN0IHBsYXllckRlY2sgPSB1c2VyQm9hcmQ/LkRlY2sgPz8gYnVpbGRNb2RlbD8uQm9yPy5EZWNrO1xuICAgIGNvbnN0IHBsYXllckN1c3RvbVBhY2sgPSB0aGlzLmZpbmRDdXN0b21QYWNrRnJvbURlY2soXG4gICAgICBjdXN0b21QYWNrcyxcbiAgICAgIHBsYXllckRlY2ssXG4gICAgKTtcbiAgICBjb25zdCBvcHBvbmVudEN1c3RvbVBhY2sgPSB0aGlzLmZpbmRDdXN0b21QYWNrRnJvbURlY2soXG4gICAgICBjdXN0b21QYWNrcyxcbiAgICAgIG9wcG9uZW50Qm9hcmQ/LkRlY2ssXG4gICAgKTtcbiAgICBjb25zdCBwbGF5ZXJQYWNrSWQgPSByZXNvbHZlUGFja0lkRnJvbVVua25vd24odXNlckJvYXJkPy5QYWNrKTtcbiAgICBjb25zdCBvcHBvbmVudFBhY2tJZCA9IHJlc29sdmVQYWNrSWRGcm9tVW5rbm93bihvcHBvbmVudEJvYXJkPy5QYWNrKTtcbiAgICBjb25zdCBwbGF5ZXJQYWNrTmFtZSA9XG4gICAgICBwbGF5ZXJDdXN0b21QYWNrPy5uYW1lIHx8XG4gICAgICAocGxheWVyUGFja0lkICE9PSBudWxsID8gUEFDS19NQVBbcGxheWVyUGFja0lkXSA6IG51bGwpIHx8XG4gICAgICAnVHVydGxlJztcbiAgICBjb25zdCBvcHBvbmVudFBhY2tOYW1lID1cbiAgICAgIG9wcG9uZW50Q3VzdG9tUGFjaz8ubmFtZSB8fFxuICAgICAgKG9wcG9uZW50UGFja0lkICE9PSBudWxsID8gUEFDS19NQVBbb3Bwb25lbnRQYWNrSWRdIDogbnVsbCkgfHxcbiAgICAgICdUdXJ0bGUnO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHBsYXllclBhY2s6IHBsYXllclBhY2tOYW1lLFxuICAgICAgb3Bwb25lbnRQYWNrOiBvcHBvbmVudFBhY2tOYW1lLFxuICAgICAgcGxheWVyVG95OiBwbGF5ZXJUb3kubmFtZSxcbiAgICAgIHBsYXllclRveUxldmVsOiBTdHJpbmcocGxheWVyVG95LmxldmVsKSxcbiAgICAgIHBsYXllckhhcmRUb3k6IG51bGwsXG4gICAgICBwbGF5ZXJIYXJkVG95TGV2ZWw6IDEsXG4gICAgICBvcHBvbmVudFRveTogb3Bwb25lbnRUb3kubmFtZSxcbiAgICAgIG9wcG9uZW50VG95TGV2ZWw6IFN0cmluZyhvcHBvbmVudFRveS5sZXZlbCksXG4gICAgICBvcHBvbmVudEhhcmRUb3k6IG51bGwsXG4gICAgICBvcHBvbmVudEhhcmRUb3lMZXZlbDogMSxcbiAgICAgIHR1cm46IHJlYWRCb2FyZE51bWJlcih1c2VyQm9hcmQsICdUdXInLCAxKSB8fCAxLFxuICAgICAgcGxheWVyR29sZFNwZW50OiByZWFkQm9hcmROdW1iZXIodXNlckJvYXJkLCAnR29TcCcsIDApIHx8IDAsXG4gICAgICBvcHBvbmVudEdvbGRTcGVudDogcmVhZEJvYXJkTnVtYmVyKG9wcG9uZW50Qm9hcmQsICdHb1NwJywgMCkgfHwgMCxcbiAgICAgIHBsYXllclJvbGxBbW91bnQ6IHJlYWRCb2FyZE51bWJlcih1c2VyQm9hcmQsICdSb2xkJywgMCkgfHwgMCxcbiAgICAgIG9wcG9uZW50Um9sbEFtb3VudDogcmVhZEJvYXJkTnVtYmVyKG9wcG9uZW50Qm9hcmQsICdSb2xkJywgMCkgfHwgMCxcbiAgICAgIHBsYXllclN1bW1vbmVkQW1vdW50OiByZWFkQm9hcmROdW1iZXIodXNlckJvYXJkLCAnTWlTdScsIDApIHx8IDAsXG4gICAgICBvcHBvbmVudFN1bW1vbmVkQW1vdW50OiByZWFkQm9hcmROdW1iZXIob3Bwb25lbnRCb2FyZCwgJ01pU3UnLCAwKSB8fCAwLFxuICAgICAgcGxheWVyTGV2ZWwzU29sZDogcmVhZEJvYXJkTnVtYmVyKHVzZXJCb2FyZCwgJ01TRkwnLCAwKSB8fCAwLFxuICAgICAgb3Bwb25lbnRMZXZlbDNTb2xkOiByZWFkQm9hcmROdW1iZXIob3Bwb25lbnRCb2FyZCwgJ01TRkwnLCAwKSB8fCAwLFxuICAgICAgcGxheWVyVHJhbnNmb3JtYXRpb25BbW91bnQ6IHJlYWRCb2FyZE51bWJlcih1c2VyQm9hcmQsICdUclRUJywgMCkgfHwgMCxcbiAgICAgIG9wcG9uZW50VHJhbnNmb3JtYXRpb25BbW91bnQ6IHJlYWRCb2FyZE51bWJlcihvcHBvbmVudEJvYXJkLCAnVHJUVCcsIDApIHx8IDAsXG4gICAgICBwbGF5ZXJQZXRzOiBwYXJzZUJvYXJkUGV0cyh1c2VyQm9hcmQpLFxuICAgICAgb3Bwb25lbnRQZXRzOiBwYXJzZUJvYXJkUGV0cyhvcHBvbmVudEJvYXJkKSxcbiAgICAgIGFsbFBldHM6IGZhbHNlLFxuICAgICAgbG9nRmlsdGVyOiBudWxsLFxuICAgICAgY3VzdG9tUGFja3MsXG4gICAgICBvbGRTdG9yazogZmFsc2UsXG4gICAgICB0b2tlblBldHM6IGZhbHNlLFxuICAgICAga29tb2RvU2h1ZmZsZTogZmFsc2UsXG4gICAgICBtYW5hOiB0cnVlLFxuICAgICAgc2VlZDogbnVsbCxcbiAgICAgIHRyaWdnZXJzQ29uc3VtZWQ6IHRydWUsXG4gICAgICBzaG93QWR2YW5jZWQ6IHRydWUsXG4gICAgICBzaG93VHJpZ2dlck5hbWVzSW5Mb2dzOiBmYWxzZSxcbiAgICAgIHNob3dQb3NpdGlvbmFsQXJnc0luTG9nczogdHJ1ZSxcbiAgICAgIGFpbG1lbnRFcXVpcG1lbnQ6IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICBidWlsZEN1c3RvbVBhY2tzRnJvbUdlbmVzaXMoXG4gICAgYnVpbGRNb2RlbD86IFJlcGxheUJ1aWxkTW9kZWxKc29uLFxuICAgIGJhdHRsZUpzb24/OiBSZXBsYXlCYXR0bGVKc29uLFxuICApOiBSZXBsYXlDdXN0b21QYWNrW10ge1xuICAgIGNvbnN0IGRlY2tzID0gW1xuICAgICAgYnVpbGRNb2RlbD8uQm9yPy5EZWNrLFxuICAgICAgYmF0dGxlSnNvbj8uVXNlckJvYXJkPy5EZWNrLFxuICAgICAgYmF0dGxlSnNvbj8uT3Bwb25lbnRCb2FyZD8uRGVjayxcbiAgICBdLmZpbHRlcihcbiAgICAgIChkZWNrKTogZGVjayBpcyBSZXBsYXlEZWNrSnNvbiA9PlxuICAgICAgICBkZWNrICE9PSBudWxsICYmIGRlY2sgIT09IHVuZGVmaW5lZCAmJiBBcnJheS5pc0FycmF5KGRlY2suTWluaW9ucyksXG4gICAgKTtcblxuICAgIGNvbnN0IHBhY2tzOiBSZXBsYXlDdXN0b21QYWNrW10gPSBbXTtcbiAgICBjb25zdCBzZWVuRGVja0lkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IHVzZWROYW1lcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG4gICAgZm9yIChjb25zdCBkZWNrIG9mIGRlY2tzKSB7XG4gICAgICBjb25zdCBkZWNrSWQgPSBkZWNrPy5JZCAhPSBudWxsID8gU3RyaW5nKGRlY2suSWQpIDogbnVsbDtcbiAgICAgIGlmIChkZWNrSWQgJiYgc2VlbkRlY2tJZHMuaGFzKGRlY2tJZCkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAoZGVja0lkKSB7XG4gICAgICAgIHNlZW5EZWNrSWRzLmFkZChkZWNrSWQpO1xuICAgICAgfVxuICAgICAgY29uc3QgcGFjayA9IHRoaXMuYnVpbGRDdXN0b21QYWNrRnJvbURlY2soZGVjaywgdXNlZE5hbWVzKTtcbiAgICAgIGlmIChwYWNrKSB7XG4gICAgICAgIHBhY2tzLnB1c2goeyAuLi5wYWNrLCBkZWNrSWQgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhY2tzO1xuICB9XG5cbiAgZ2VuZXJhdGVDYWxjdWxhdG9yTGluayhjYWxjdWxhdG9yU3RhdGU6IFJlcGxheUNhbGN1bGF0b3JTdGF0ZSk6IHN0cmluZyB7XG4gICAgY29uc3QgYmFzZVVybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG4gICAgY29uc3Qgc3RyaXBwZWRTdGF0ZSA9IHRoaXMuc3RyaXBEZWZhdWx0VmFsdWVzKGNhbGN1bGF0b3JTdGF0ZSk7XG4gICAgY29uc3QgdHJ1bmNhdGVkU3RhdGUgPSB0aGlzLnRydW5jYXRlS2V5cyhzdHJpcHBlZFN0YXRlKTtcbiAgICBjb25zdCBzdGF0ZVN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHRydW5jYXRlZFN0YXRlKTtcbiAgICBjb25zdCBiYXNlNjREYXRhID0gZW5jb2RlQmFzZTY0VXJsKHN0YXRlU3RyaW5nKTtcbiAgICByZXR1cm4gYCR7YmFzZVVybH0jYz0ke2Jhc2U2NERhdGF9YDtcbiAgfVxuXG4gIHByaXZhdGUgYnVpbGRDdXN0b21QYWNrRnJvbURlY2soXG4gICAgZGVjazogUmVwbGF5RGVja0pzb24gfCBudWxsIHwgdW5kZWZpbmVkLFxuICAgIHVzZWROYW1lczogU2V0PHN0cmluZz4sXG4gICk6IFJlcGxheUN1c3RvbVBhY2tDb3JlIHwgbnVsbCB7XG4gICAgaWYgKCFkZWNrIHx8ICFBcnJheS5pc0FycmF5KGRlY2suTWluaW9ucykpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IG1pbmlvbnMgPSBkZWNrLk1pbmlvbnMubWFwKChpZCkgPT4gU3RyaW5nKGlkKSk7XG4gICAgLy8gS2VlcCB0aGUgcmVwbGF5J3MgbnVtZXJpYyBzcGVsbCBJRHMgaW50YWN0LiBTQVAgY3VzdG9tLXBhY2sgSlNPTiB1c2VzXG4gICAgLy8gbnVtZXJpYyBJRHMgaGVyZSwgc28gY29lcmNpbmcgdGhlbSB0byBzdHJpbmdzIG1ha2VzIGNvcGllZCBwYWNrIEpTT05cbiAgICAvLyBkaWZmZXIgZnJvbSB0aGUgc291cmNlIGRlY2suXG4gICAgY29uc3Qgc3BlbGxzID0gQXJyYXkuaXNBcnJheShkZWNrLlNwZWxscykgPyBbLi4uZGVjay5TcGVsbHNdIDogW107XG4gICAgY29uc3QgdGllclBldHM6IFJlY29yZDxudW1iZXIsIHN0cmluZ1tdPiA9IHtcbiAgICAgIDE6IFtdLFxuICAgICAgMjogW10sXG4gICAgICAzOiBbXSxcbiAgICAgIDQ6IFtdLFxuICAgICAgNTogW10sXG4gICAgICA2OiBbXSxcbiAgICB9O1xuXG4gICAgZm9yIChjb25zdCBtaW5pb25JZCBvZiBtaW5pb25zKSB7XG4gICAgICBjb25zdCBwZXRNZXRhID0gUEVUU19NRVRBX0JZX0lELmdldChtaW5pb25JZCk7XG4gICAgICBpZiAoIXBldE1ldGEpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodGllclBldHNbcGV0TWV0YS50aWVyXSkge1xuICAgICAgICB0aWVyUGV0c1twZXRNZXRhLnRpZXJdLnB1c2gocGV0TWV0YS5uYW1lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBub3JtYWxpemVUaWVyUGV0cyA9IChwZXRzOiBzdHJpbmdbXSk6IChzdHJpbmcgfCBudWxsKVtdID0+IHtcbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBwZXRzLnNsaWNlKDAsIDEwKTtcbiAgICAgIHdoaWxlIChub3JtYWxpemVkLmxlbmd0aCA8IDEwKSB7XG4gICAgICAgIG5vcm1hbGl6ZWQucHVzaChudWxsKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBub3JtYWxpemVkO1xuICAgIH07XG5cbiAgICBsZXQgZGVja05hbWUgPSBkZWNrLlRpdGxlIHx8ICdDdXN0b20gUGFjayc7XG4gICAgaWYgKHVzZWROYW1lcy5oYXMoZGVja05hbWUpKSB7XG4gICAgICBsZXQgc3VmZml4ID0gMjtcbiAgICAgIHdoaWxlICh1c2VkTmFtZXMuaGFzKGAke2RlY2tOYW1lfSAoJHtzdWZmaXh9KWApKSB7XG4gICAgICAgIHN1ZmZpeCArPSAxO1xuICAgICAgfVxuICAgICAgZGVja05hbWUgPSBgJHtkZWNrTmFtZX0gKCR7c3VmZml4fSlgO1xuICAgIH1cbiAgICB1c2VkTmFtZXMuYWRkKGRlY2tOYW1lKTtcblxuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBkZWNrTmFtZSxcbiAgICAgIHRpZXIxUGV0czogbm9ybWFsaXplVGllclBldHModGllclBldHNbMV0pLFxuICAgICAgdGllcjJQZXRzOiBub3JtYWxpemVUaWVyUGV0cyh0aWVyUGV0c1syXSksXG4gICAgICB0aWVyM1BldHM6IG5vcm1hbGl6ZVRpZXJQZXRzKHRpZXJQZXRzWzNdKSxcbiAgICAgIHRpZXI0UGV0czogbm9ybWFsaXplVGllclBldHModGllclBldHNbNF0pLFxuICAgICAgdGllcjVQZXRzOiBub3JtYWxpemVUaWVyUGV0cyh0aWVyUGV0c1s1XSksXG4gICAgICB0aWVyNlBldHM6IG5vcm1hbGl6ZVRpZXJQZXRzKHRpZXJQZXRzWzZdKSxcbiAgICAgIHNwZWxscyxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBmaW5kQ3VzdG9tUGFja0Zyb21EZWNrKFxuICAgIGN1c3RvbVBhY2tzOiBSZXBsYXlDdXN0b21QYWNrW10sXG4gICAgZGVjazogUmVwbGF5RGVja0pzb24gfCBudWxsIHwgdW5kZWZpbmVkLFxuICApOiBSZXBsYXlDdXN0b21QYWNrIHwgbnVsbCB7XG4gICAgaWYgKCFkZWNrKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgZGVja0lkID0gZGVjaz8uSWQgIT0gbnVsbCA/IFN0cmluZyhkZWNrLklkKSA6IG51bGw7XG4gICAgaWYgKGRlY2tJZCkge1xuICAgICAgY29uc3QgYnlJZCA9IGN1c3RvbVBhY2tzLmZpbmQoKHBhY2spID0+IHBhY2suZGVja0lkID09PSBkZWNrSWQpO1xuICAgICAgaWYgKGJ5SWQpIHtcbiAgICAgICAgcmV0dXJuIGJ5SWQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZGVja0NvbnRlbnRzID0gdGhpcy5idWlsZEN1c3RvbVBhY2tGcm9tRGVjayhkZWNrLCBuZXcgU2V0KCkpO1xuICAgIGlmIChkZWNrQ29udGVudHMpIHtcbiAgICAgIGNvbnN0IGJ5Q29udGVudHMgPSBjdXN0b21QYWNrcy5maW5kKChwYWNrKSA9PlxuICAgICAgICB0aGlzLmN1c3RvbVBhY2tDb250ZW50c01hdGNoKHBhY2ssIGRlY2tDb250ZW50cyksXG4gICAgICApO1xuICAgICAgaWYgKGJ5Q29udGVudHMpIHtcbiAgICAgICAgcmV0dXJuIGJ5Q29udGVudHM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZGVja05hbWUgPSBkZWNrPy5UaXRsZTtcbiAgICBpZiAoZGVja05hbWUpIHtcbiAgICAgIHJldHVybiBjdXN0b21QYWNrcy5maW5kKChwYWNrKSA9PiBwYWNrLm5hbWUgPT09IGRlY2tOYW1lKSB8fCBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgY3VzdG9tUGFja0NvbnRlbnRzTWF0Y2goXG4gICAgcGFjazogUmVwbGF5Q3VzdG9tUGFjayxcbiAgICBkZWNrQ29udGVudHM6IFJlcGxheUN1c3RvbVBhY2tDb3JlLFxuICApOiBib29sZWFuIHtcbiAgICBjb25zdCB0aWVyS2V5cyA9IFtcbiAgICAgICd0aWVyMVBldHMnLFxuICAgICAgJ3RpZXIyUGV0cycsXG4gICAgICAndGllcjNQZXRzJyxcbiAgICAgICd0aWVyNFBldHMnLFxuICAgICAgJ3RpZXI1UGV0cycsXG4gICAgICAndGllcjZQZXRzJyxcbiAgICBdIGFzIGNvbnN0O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIHRpZXJLZXlzLmV2ZXJ5KCh0aWVyS2V5KSA9PlxuICAgICAgICB0aGlzLnN0cmluZ0FycmF5c01hdGNoKHBhY2tbdGllcktleV0sIGRlY2tDb250ZW50c1t0aWVyS2V5XSksXG4gICAgICApICYmIHRoaXMuY3VzdG9tUGFja0l0ZW1zTWF0Y2gocGFjay5zcGVsbHMsIGRlY2tDb250ZW50cy5zcGVsbHMpXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgY3VzdG9tUGFja0l0ZW1zTWF0Y2goXG4gICAgbGVmdDogUmVhZG9ubHlBcnJheTxDdXN0b21QYWNrSXRlbT4sXG4gICAgcmlnaHQ6IFJlYWRvbmx5QXJyYXk8Q3VzdG9tUGFja0l0ZW0+LFxuICApOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgbGVmdC5sZW5ndGggPT09IHJpZ2h0Lmxlbmd0aCAmJlxuICAgICAgbGVmdC5ldmVyeSgodmFsdWUsIGluZGV4KSA9PiB2YWx1ZSA9PT0gcmlnaHRbaW5kZXhdKVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIHN0cmluZ0FycmF5c01hdGNoKFxuICAgIGxlZnQ6IFJlYWRvbmx5QXJyYXk8c3RyaW5nIHwgbnVsbD4sXG4gICAgcmlnaHQ6IFJlYWRvbmx5QXJyYXk8c3RyaW5nIHwgbnVsbD4sXG4gICk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICBsZWZ0Lmxlbmd0aCA9PT0gcmlnaHQubGVuZ3RoICYmXG4gICAgICBsZWZ0LmV2ZXJ5KCh2YWx1ZSwgaW5kZXgpID0+IHZhbHVlID09PSByaWdodFtpbmRleF0pXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RyaXBEZWZhdWx0VmFsdWVzKFxuICAgIHN0YXRlOiBSZXBsYXlDYWxjdWxhdG9yU3RhdGUsXG4gICk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgICBjb25zdCBzdHJpcHBlZFN0YXRlOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHt9O1xuXG4gICAgaWYgKHN0YXRlLnBsYXllclBhY2sgIT09ICdUdXJ0bGUnKSB7XG4gICAgICBzdHJpcHBlZFN0YXRlLnBsYXllclBhY2sgPSBzdGF0ZS5wbGF5ZXJQYWNrO1xuICAgIH1cbiAgICBpZiAoc3RhdGUub3Bwb25lbnRQYWNrICE9PSAnVHVydGxlJykge1xuICAgICAgc3RyaXBwZWRTdGF0ZS5vcHBvbmVudFBhY2sgPSBzdGF0ZS5vcHBvbmVudFBhY2s7XG4gICAgfVxuICAgIGlmIChzdGF0ZS5wbGF5ZXJUb3kpIHtcbiAgICAgIHN0cmlwcGVkU3RhdGUucGxheWVyVG95ID0gc3RhdGUucGxheWVyVG95O1xuICAgIH1cbiAgICBpZiAoc3RhdGUucGxheWVyVG95TGV2ZWwgJiYgc3RhdGUucGxheWVyVG95TGV2ZWwgIT09ICcxJykge1xuICAgICAgc3RyaXBwZWRTdGF0ZS5wbGF5ZXJUb3lMZXZlbCA9IHN0YXRlLnBsYXllclRveUxldmVsO1xuICAgIH1cbiAgICBpZiAoc3RhdGUub3Bwb25lbnRUb3kpIHtcbiAgICAgIHN0cmlwcGVkU3RhdGUub3Bwb25lbnRUb3kgPSBzdGF0ZS5vcHBvbmVudFRveTtcbiAgICB9XG4gICAgaWYgKHN0YXRlLm9wcG9uZW50VG95TGV2ZWwgJiYgc3RhdGUub3Bwb25lbnRUb3lMZXZlbCAhPT0gJzEnKSB7XG4gICAgICBzdHJpcHBlZFN0YXRlLm9wcG9uZW50VG95TGV2ZWwgPSBzdGF0ZS5vcHBvbmVudFRveUxldmVsO1xuICAgIH1cbiAgICBpZiAoc3RhdGUudHVybiAhPT0gMTEpIHtcbiAgICAgIHN0cmlwcGVkU3RhdGUudHVybiA9IHN0YXRlLnR1cm47XG4gICAgfVxuICAgIGlmIChzdGF0ZS5wbGF5ZXJHb2xkU3BlbnQgIT09IDEwKSB7XG4gICAgICBzdHJpcHBlZFN0YXRlLnBsYXllckdvbGRTcGVudCA9IHN0YXRlLnBsYXllckdvbGRTcGVudDtcbiAgICB9XG4gICAgaWYgKHN0YXRlLm9wcG9uZW50R29sZFNwZW50ICE9PSAxMCkge1xuICAgICAgc3RyaXBwZWRTdGF0ZS5vcHBvbmVudEdvbGRTcGVudCA9IHN0YXRlLm9wcG9uZW50R29sZFNwZW50O1xuICAgIH1cbiAgICBpZiAoc3RhdGUucGxheWVyUm9sbEFtb3VudCAhPT0gNCkge1xuICAgICAgc3RyaXBwZWRTdGF0ZS5wbGF5ZXJSb2xsQW1vdW50ID0gc3RhdGUucGxheWVyUm9sbEFtb3VudDtcbiAgICB9XG4gICAgaWYgKHN0YXRlLm9wcG9uZW50Um9sbEFtb3VudCAhPT0gNCkge1xuICAgICAgc3RyaXBwZWRTdGF0ZS5vcHBvbmVudFJvbGxBbW91bnQgPSBzdGF0ZS5vcHBvbmVudFJvbGxBbW91bnQ7XG4gICAgfVxuICAgIGlmIChzdGF0ZS5wbGF5ZXJTdW1tb25lZEFtb3VudCAhPT0gMCkge1xuICAgICAgc3RyaXBwZWRTdGF0ZS5wbGF5ZXJTdW1tb25lZEFtb3VudCA9IHN0YXRlLnBsYXllclN1bW1vbmVkQW1vdW50O1xuICAgIH1cbiAgICBpZiAoc3RhdGUub3Bwb25lbnRTdW1tb25lZEFtb3VudCAhPT0gMCkge1xuICAgICAgc3RyaXBwZWRTdGF0ZS5vcHBvbmVudFN1bW1vbmVkQW1vdW50ID0gc3RhdGUub3Bwb25lbnRTdW1tb25lZEFtb3VudDtcbiAgICB9XG4gICAgaWYgKHN0YXRlLnBsYXllckxldmVsM1NvbGQgIT09IDApIHtcbiAgICAgIHN0cmlwcGVkU3RhdGUucGxheWVyTGV2ZWwzU29sZCA9IHN0YXRlLnBsYXllckxldmVsM1NvbGQ7XG4gICAgfVxuICAgIGlmIChzdGF0ZS5vcHBvbmVudExldmVsM1NvbGQgIT09IDApIHtcbiAgICAgIHN0cmlwcGVkU3RhdGUub3Bwb25lbnRMZXZlbDNTb2xkID0gc3RhdGUub3Bwb25lbnRMZXZlbDNTb2xkO1xuICAgIH1cbiAgICBpZiAoc3RhdGUucGxheWVyVHJhbnNmb3JtYXRpb25BbW91bnQgIT09IDApIHtcbiAgICAgIHN0cmlwcGVkU3RhdGUucGxheWVyVHJhbnNmb3JtYXRpb25BbW91bnQgPSBzdGF0ZS5wbGF5ZXJUcmFuc2Zvcm1hdGlvbkFtb3VudDtcbiAgICB9XG4gICAgaWYgKHN0YXRlLm9wcG9uZW50VHJhbnNmb3JtYXRpb25BbW91bnQgIT09IDApIHtcbiAgICAgIHN0cmlwcGVkU3RhdGUub3Bwb25lbnRUcmFuc2Zvcm1hdGlvbkFtb3VudCA9IHN0YXRlLm9wcG9uZW50VHJhbnNmb3JtYXRpb25BbW91bnQ7XG4gICAgfVxuXG4gICAgaWYgKHN0YXRlLmFsbFBldHMpIHtcbiAgICAgIHN0cmlwcGVkU3RhdGUuYWxsUGV0cyA9IHRydWU7XG4gICAgfVxuICAgIGlmIChzdGF0ZS5vbGRTdG9yaykge1xuICAgICAgc3RyaXBwZWRTdGF0ZS5vbGRTdG9yayA9IHRydWU7XG4gICAgfVxuICAgIGlmIChzdGF0ZS50b2tlblBldHMpIHtcbiAgICAgIHN0cmlwcGVkU3RhdGUudG9rZW5QZXRzID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHN0YXRlLmtvbW9kb1NodWZmbGUpIHtcbiAgICAgIHN0cmlwcGVkU3RhdGUua29tb2RvU2h1ZmZsZSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChzdGF0ZS5tYW5hKSB7XG4gICAgICBzdHJpcHBlZFN0YXRlLm1hbmEgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoc3RhdGUuc2VlZCAhPSBudWxsKSB7XG4gICAgICBzdHJpcHBlZFN0YXRlLnNlZWQgPSBzdGF0ZS5zZWVkO1xuICAgIH1cbiAgICBpZiAoc3RhdGUudHJpZ2dlcnNDb25zdW1lZCkge1xuICAgICAgc3RyaXBwZWRTdGF0ZS50cmlnZ2Vyc0NvbnN1bWVkID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHN0YXRlLmZvb2RzRWF0ZW4pIHtcbiAgICAgIHN0cmlwcGVkU3RhdGUuZm9vZHNFYXRlbiA9IHRydWU7XG4gICAgfVxuICAgIGlmIChzdGF0ZS5zaG93QWR2YW5jZWQpIHtcbiAgICAgIHN0cmlwcGVkU3RhdGUuc2hvd0FkdmFuY2VkID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHN0YXRlLnNob3dUcmlnZ2VyTmFtZXNJbkxvZ3MpIHtcbiAgICAgIHN0cmlwcGVkU3RhdGUuc2hvd1RyaWdnZXJOYW1lc0luTG9ncyA9IHRydWU7XG4gICAgfVxuICAgIGlmIChzdGF0ZS5zaG93UG9zaXRpb25hbEFyZ3NJbkxvZ3MgPT09IGZhbHNlKSB7XG4gICAgICBzdHJpcHBlZFN0YXRlLnNob3dQb3NpdGlvbmFsQXJnc0luTG9ncyA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAoc3RhdGUuYWlsbWVudEVxdWlwbWVudCkge1xuICAgICAgc3RyaXBwZWRTdGF0ZS5haWxtZW50RXF1aXBtZW50ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoc3RhdGUubG9nRmlsdGVyKSB7XG4gICAgICBzdHJpcHBlZFN0YXRlLmxvZ0ZpbHRlciA9IHN0YXRlLmxvZ0ZpbHRlcjtcbiAgICB9XG4gICAgaWYgKHN0YXRlLmN1c3RvbVBhY2tzLmxlbmd0aCA+IDApIHtcbiAgICAgIHN0cmlwcGVkU3RhdGUuY3VzdG9tUGFja3MgPSBzdGF0ZS5jdXN0b21QYWNrcztcbiAgICB9XG5cbiAgICBjb25zdCBzdHJpcFBldERlZmF1bHRzID0gKHBldDogUGV0Q29uZmlnIHwgbnVsbCk6IFN0cmlwcGVkUmVwbGF5UGV0IHwgbnVsbCA9PiB7XG4gICAgICBpZiAoIXBldCB8fCAhcGV0Lm5hbWUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG5ld1BldDogU3RyaXBwZWRSZXBsYXlQZXQgPSB7IG5hbWU6IHBldC5uYW1lIH07XG5cbiAgICAgIGlmICh0eXBlb2YgcGV0LmF0dGFjayA9PT0gJ251bWJlcicgJiYgcGV0LmF0dGFjayAhPT0gMCkge1xuICAgICAgICBuZXdQZXQuYXR0YWNrID0gcGV0LmF0dGFjaztcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgcGV0LmhlYWx0aCA9PT0gJ251bWJlcicgJiYgcGV0LmhlYWx0aCAhPT0gMCkge1xuICAgICAgICBuZXdQZXQuaGVhbHRoID0gcGV0LmhlYWx0aDtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgcGV0LmV4cCA9PT0gJ251bWJlcicgJiYgcGV0LmV4cCAhPT0gMCkge1xuICAgICAgICBuZXdQZXQuZXhwID0gcGV0LmV4cDtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgcGV0Lm1hbmEgPT09ICdudW1iZXInICYmIHBldC5tYW5hICE9PSAwKSB7XG4gICAgICAgIG5ld1BldC5tYW5hID0gcGV0Lm1hbmE7XG4gICAgICB9XG4gICAgICBpZiAocGV0LmVxdWlwbWVudCkge1xuICAgICAgICBuZXdQZXQuZXF1aXBtZW50ID0gcGV0LmVxdWlwbWVudDtcbiAgICAgIH1cbiAgICAgIGlmIChwZXQudHJpZ2dlcnNDb25zdW1lZCkge1xuICAgICAgICBuZXdQZXQudHJpZ2dlcnNDb25zdW1lZCA9IHBldC50cmlnZ2Vyc0NvbnN1bWVkO1xuICAgICAgfVxuICAgICAgaWYgKHBldC5mb29kc0VhdGVuKSB7XG4gICAgICAgIG5ld1BldC5mb29kc0VhdGVuID0gcGV0LmZvb2RzRWF0ZW47XG4gICAgICB9XG4gICAgICBpZiAocGV0LmFpbG1lbnRzQ291bnQpIHtcbiAgICAgICAgbmV3UGV0LmFpbG1lbnRzQ291bnQgPSBwZXQuYWlsbWVudHNDb3VudDtcbiAgICAgIH1cbiAgICAgIGlmIChwZXQuZnJpZW5kc0h1cnRCZWZvcmVCYXR0bGUpIHtcbiAgICAgICAgbmV3UGV0LmZyaWVuZHNIdXJ0QmVmb3JlQmF0dGxlID0gcGV0LmZyaWVuZHNIdXJ0QmVmb3JlQmF0dGxlO1xuICAgICAgfVxuICAgICAgaWYgKHBldC5iZWx1Z2FTd2FsbG93ZWRQZXQgIT0gbnVsbCkge1xuICAgICAgICBuZXdQZXQuYmVsdWdhU3dhbGxvd2VkUGV0ID0gcGV0LmJlbHVnYVN3YWxsb3dlZFBldDtcbiAgICAgIH1cbiAgICAgIEFCT01JTkFUSU9OX1NMT1RfRklFTERTLmZvckVhY2goKHNsb3RGaWVsZHMpID0+IHtcbiAgICAgICAgY29uc3Qgc3dhbGxvd2VkUGV0ID0gcGV0W3Nsb3RGaWVsZHMucGV0XTtcbiAgICAgICAgaWYgKHN3YWxsb3dlZFBldCAhPSBudWxsKSB7XG4gICAgICAgICAgbmV3UGV0W3Nsb3RGaWVsZHMucGV0XSA9IHN3YWxsb3dlZFBldDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzd2FsbG93ZWRMZXZlbCA9IHBldFtzbG90RmllbGRzLmxldmVsXTtcbiAgICAgICAgaWYgKHR5cGVvZiBzd2FsbG93ZWRMZXZlbCA9PT0gJ251bWJlcicgJiYgc3dhbGxvd2VkTGV2ZWwgIT09IDEpIHtcbiAgICAgICAgICBuZXdQZXRbc2xvdEZpZWxkcy5sZXZlbF0gPSBzd2FsbG93ZWRMZXZlbDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAocGV0LnRpbWVzSHVydCkge1xuICAgICAgICBuZXdQZXQudGltZXNIdXJ0ID0gcGV0LnRpbWVzSHVydDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ld1BldDtcbiAgICB9O1xuXG4gICAgY29uc3Qgc3RyaXBwZWRQbGF5ZXJQZXRzID0gc3RhdGUucGxheWVyUGV0cy5tYXAoc3RyaXBQZXREZWZhdWx0cyk7XG4gICAgaWYgKHN0cmlwcGVkUGxheWVyUGV0cy5zb21lKChwZXQpID0+IHBldCAhPT0gbnVsbCkpIHtcbiAgICAgIHN0cmlwcGVkU3RhdGUucGxheWVyUGV0cyA9IHN0cmlwcGVkUGxheWVyUGV0cztcbiAgICB9XG5cbiAgICBjb25zdCBzdHJpcHBlZE9wcG9uZW50UGV0cyA9IHN0YXRlLm9wcG9uZW50UGV0cy5tYXAoc3RyaXBQZXREZWZhdWx0cyk7XG4gICAgaWYgKHN0cmlwcGVkT3Bwb25lbnRQZXRzLnNvbWUoKHBldCkgPT4gcGV0ICE9PSBudWxsKSkge1xuICAgICAgc3RyaXBwZWRTdGF0ZS5vcHBvbmVudFBldHMgPSBzdHJpcHBlZE9wcG9uZW50UGV0cztcbiAgICB9XG5cbiAgICByZXR1cm4gc3RyaXBwZWRTdGF0ZTtcbiAgfVxuXG4gIHByaXZhdGUgdHJ1bmNhdGVLZXlzKGRhdGE6IHVua25vd24pOiB1bmtub3duIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgcmV0dXJuIGRhdGEubWFwKChpdGVtKSA9PiB0aGlzLnRydW5jYXRlS2V5cyhpdGVtKSk7XG4gICAgfVxuICAgIGlmIChpc1JlY29yZChkYXRhKSkge1xuICAgICAgY29uc3QgbmV3T2JqOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHt9O1xuICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoZGF0YSkpIHtcbiAgICAgICAgY29uc3QgbmV3S2V5ID0gS0VZX01BUFtrZXldIHx8IGtleTtcbiAgICAgICAgbmV3T2JqW25ld0tleV0gPSB0aGlzLnRydW5jYXRlS2V5cyhkYXRhW2tleV0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ld09iajtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cbn1cbiIsICJpbXBvcnQgdHlwZSB7IFRlYW1QcmVzZXQgfSBmcm9tICcuL3RlYW0tcHJlc2V0cy5zZXJ2aWNlJztcblxudHlwZSBUZWFtUHJlc2V0UGV0ID0gVGVhbVByZXNldFsncGV0cyddW251bWJlcl07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWZhdWx0VGVhbXMoKTogVGVhbVByZXNldFtdIHtcbiAgcmV0dXJuIFtcbiAgICB7XG4gICAgICBpZDogJ2RlZmF1bHQtbWF4LWRhbWFnZScsXG4gICAgICBuYW1lOiAnMTAwMCBNYW5hJyxcbiAgICAgIGNyZWF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgICAgIHRveU5hbWU6ICdOdXRjcmFja2VyJyxcbiAgICAgIHRveUxldmVsOiAzLFxuICAgICAgcGV0czogQXJyYXkuZnJvbSh7IGxlbmd0aDogNSB9LCAoKTogVGVhbVByZXNldFBldCA9PiAoe1xuICAgICAgICBuYW1lOiAnU2VhIFNlcnBlbnQnLFxuICAgICAgICBhdHRhY2s6IDUwLFxuICAgICAgICBoZWFsdGg6IDUwLFxuICAgICAgICBleHA6IDUsXG4gICAgICAgIGVxdWlwbWVudDogeyBuYW1lOiAnQ29jb251dCcgfSxcbiAgICAgICAgYmVsdWdhU3dhbGxvd2VkUGV0OiBudWxsLFxuICAgICAgICBzYXJjYXN0aWNGcmluZ2VoZWFkU3dhbGxvd2VkUGV0OiBudWxsLFxuICAgICAgICBtYW5hOiA1MCxcbiAgICAgICAgdHJpZ2dlcnNDb25zdW1lZDogMCxcbiAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxOiBudWxsLFxuICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDI6IG51bGwsXG4gICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MzogbnVsbCxcbiAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxVGltZXNIdXJ0OiAwLFxuICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDJUaW1lc0h1cnQ6IDAsXG4gICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M1RpbWVzSHVydDogMCxcbiAgICAgICAgYmF0dGxlc0ZvdWdodDogMCxcbiAgICAgICAgdGltZXNIdXJ0OiAwLFxuICAgICAgICBlcXVpcG1lbnRVc2VzOiBudWxsLFxuICAgICAgfSkpLFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdkZWZhdWx0LWdyZWF0LXNpeCcsXG4gICAgICBuYW1lOiAnVGhlIEdyZWF0IFNpeCcsXG4gICAgICBjcmVhdGVkQXQ6IERhdGUubm93KCksXG4gICAgICB0b3lOYW1lOiAnRXZpbCBCb29rJyxcbiAgICAgIHRveUxldmVsOiAzLFxuICAgICAgcGV0czogQXJyYXkuZnJvbSh7IGxlbmd0aDogNSB9LCAoKTogVGVhbVByZXNldFBldCA9PiAoe1xuICAgICAgICBuYW1lOiAnQmVsdWdhIFdoYWxlJyxcbiAgICAgICAgYXR0YWNrOiA1MCxcbiAgICAgICAgaGVhbHRoOiA1MCxcbiAgICAgICAgZXhwOiA1LFxuICAgICAgICBlcXVpcG1lbnQ6IHsgbmFtZTogJ1doaXRlIE9rcmEnIH0sXG4gICAgICAgIGJlbHVnYVN3YWxsb3dlZFBldDogJ0dyZWF0IE9uZScsXG4gICAgICAgIHNhcmNhc3RpY0ZyaW5nZWhlYWRTd2FsbG93ZWRQZXQ6IG51bGwsXG4gICAgICAgIG1hbmE6IDUwLFxuICAgICAgICB0cmlnZ2Vyc0NvbnN1bWVkOiAwLFxuICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDE6IG51bGwsXG4gICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MjogbnVsbCxcbiAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzOiBudWxsLFxuICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDFUaW1lc0h1cnQ6IDAsXG4gICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MlRpbWVzSHVydDogMCxcbiAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzVGltZXNIdXJ0OiAwLFxuICAgICAgICBiYXR0bGVzRm91Z2h0OiAwLFxuICAgICAgICB0aW1lc0h1cnQ6IDAsXG4gICAgICAgIGVxdWlwbWVudFVzZXM6IG51bGwsXG4gICAgICB9KSksXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ2RlZmF1bHQtYWJpbGl0eS1yZW1vdmFsJyxcbiAgICAgIG5hbWU6ICdPcmNhIFNjYW0nLFxuICAgICAgY3JlYXRlZEF0OiBEYXRlLm5vdygpLFxuICAgICAgcGxheWVyVG95TmFtZTogJ1BhbmRvcmFzIEJveCcsXG4gICAgICBwbGF5ZXJUb3lMZXZlbDogMSxcbiAgICAgIG9wcG9uZW50VG95TmFtZTogbnVsbCxcbiAgICAgIG9wcG9uZW50VG95TGV2ZWw6IDEsXG4gICAgICBwbGF5ZXJIYXJkVG95OiBudWxsLFxuICAgICAgcGxheWVySGFyZFRveUxldmVsOiAxLFxuICAgICAgb3Bwb25lbnRIYXJkVG95OiBudWxsLFxuICAgICAgb3Bwb25lbnRIYXJkVG95TGV2ZWw6IDEsXG4gICAgICB0dXJuOiAxMSxcbiAgICAgIHBsYXllckdvbGRTcGVudDogMTAsXG4gICAgICBvcHBvbmVudEdvbGRTcGVudDogMTAsXG4gICAgICBhbGxQZXRzOiB0cnVlLFxuICAgICAgdG9rZW5QZXRzOiB0cnVlLFxuICAgICAga29tb2RvU2h1ZmZsZTogZmFsc2UsXG4gICAgICBtYW5hOiB0cnVlLFxuICAgICAgcGxhaW5Db3BpZXM6IGZhbHNlLFxuICAgICAgdHJpZ2dlcnNDb25zdW1lZDogZmFsc2UsXG4gICAgICBjaGFuZ2VFcXVpcG1lbnRVc2VzOiBmYWxzZSxcbiAgICAgIHBsYXllclJvbGxBbW91bnQ6IDMsXG4gICAgICBvcHBvbmVudFJvbGxBbW91bnQ6IDEsXG4gICAgICBwbGF5ZXJMZXZlbDNTb2xkOiAwLFxuICAgICAgb3Bwb25lbnRMZXZlbDNTb2xkOiAwLFxuICAgICAgcGxheWVyU3VtbW9uZWRBbW91bnQ6IDAsXG4gICAgICBvcHBvbmVudFN1bW1vbmVkQW1vdW50OiAwLFxuICAgICAgcGxheWVyVHJhbnNmb3JtYXRpb25BbW91bnQ6IDEwMCxcbiAgICAgIG9wcG9uZW50VHJhbnNmb3JtYXRpb25BbW91bnQ6IDEwMCxcbiAgICAgIHBldHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdHaWFudCBQYW5nYXNpdXMnLFxuICAgICAgICAgIGF0dGFjazogNDksXG4gICAgICAgICAgaGVhbHRoOiAxLFxuICAgICAgICAgIGV4cDogMSxcbiAgICAgICAgICBlcXVpcG1lbnQ6IG51bGwsXG4gICAgICAgICAgYmVsdWdhU3dhbGxvd2VkUGV0OiBudWxsLFxuICAgICAgICAgIHNhcmNhc3RpY0ZyaW5nZWhlYWRTd2FsbG93ZWRQZXQ6IG51bGwsXG4gICAgICAgICAgbWFuYTogNTAsXG4gICAgICAgICAgdHJpZ2dlcnNDb25zdW1lZDogMCxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDE6IG51bGwsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQyOiBudWxsLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MzogbnVsbCxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDFMZXZlbDogMSxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDJMZXZlbDogMSxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDNMZXZlbDogMSxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDFUaW1lc0h1cnQ6IDAsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQyVGltZXNIdXJ0OiAwLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M1RpbWVzSHVydDogMCxcbiAgICAgICAgICBiYXR0bGVzRm91Z2h0OiAwLFxuICAgICAgICAgIHRpbWVzSHVydDogMCxcbiAgICAgICAgICBlcXVpcG1lbnRVc2VzOiBudWxsLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ0Fib21pbmF0aW9uJyxcbiAgICAgICAgICBhdHRhY2s6IDEwMCxcbiAgICAgICAgICBoZWFsdGg6IDEsXG4gICAgICAgICAgZXhwOiA1LFxuICAgICAgICAgIGVxdWlwbWVudDogeyBuYW1lOiAnQ2h1cnJvcycgfSxcbiAgICAgICAgICBiZWx1Z2FTd2FsbG93ZWRQZXQ6IG51bGwsXG4gICAgICAgICAgc2FyY2FzdGljRnJpbmdlaGVhZFN3YWxsb3dlZFBldDogbnVsbCxcbiAgICAgICAgICBtYW5hOiA1MCxcbiAgICAgICAgICB0cmlnZ2Vyc0NvbnN1bWVkOiAwLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MTogJ09yY2EnLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MjogJ0JlaGVtb3RoJyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDM6ICdSYXQnLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MUxldmVsOiAzLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MkxldmVsOiAzLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M0xldmVsOiAzLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MVRpbWVzSHVydDogMCxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDJUaW1lc0h1cnQ6IDAsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzVGltZXNIdXJ0OiAwLFxuICAgICAgICAgIGJhdHRsZXNGb3VnaHQ6IDAsXG4gICAgICAgICAgdGltZXNIdXJ0OiAwLFxuICAgICAgICAgIGVxdWlwbWVudFVzZXM6IG51bGwsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnQWJvbWluYXRpb24nLFxuICAgICAgICAgIGF0dGFjazogNTAsXG4gICAgICAgICAgaGVhbHRoOiAxLFxuICAgICAgICAgIGV4cDogNSxcbiAgICAgICAgICBlcXVpcG1lbnQ6IHsgbmFtZTogJ1NpbGx5JyB9LFxuICAgICAgICAgIGJlbHVnYVN3YWxsb3dlZFBldDogbnVsbCxcbiAgICAgICAgICBzYXJjYXN0aWNGcmluZ2VoZWFkU3dhbGxvd2VkUGV0OiBudWxsLFxuICAgICAgICAgIG1hbmE6IDUwLFxuICAgICAgICAgIHRyaWdnZXJzQ29uc3VtZWQ6IDAsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxOiAnUmF0JyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDI6ICdQaG9lbml4JyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDM6ICdHaWFudCBQYW5nYXNpdXMnLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MUxldmVsOiAzLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MkxldmVsOiAzLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M0xldmVsOiAxLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MVRpbWVzSHVydDogMCxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDJUaW1lc0h1cnQ6IDAsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzVGltZXNIdXJ0OiAwLFxuICAgICAgICAgIGJhdHRsZXNGb3VnaHQ6IDAsXG4gICAgICAgICAgdGltZXNIdXJ0OiAwLFxuICAgICAgICAgIGVxdWlwbWVudFVzZXM6IG51bGwsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnQWJvbWluYXRpb24nLFxuICAgICAgICAgIGF0dGFjazogMTAwLFxuICAgICAgICAgIGhlYWx0aDogMSxcbiAgICAgICAgICBleHA6IDUsXG4gICAgICAgICAgZXF1aXBtZW50OiB7IG5hbWU6ICdDaHVycm9zJyB9LFxuICAgICAgICAgIGJlbHVnYVN3YWxsb3dlZFBldDogbnVsbCxcbiAgICAgICAgICBzYXJjYXN0aWNGcmluZ2VoZWFkU3dhbGxvd2VkUGV0OiBudWxsLFxuICAgICAgICAgIG1hbmE6IDUwLFxuICAgICAgICAgIHRyaWdnZXJzQ29uc3VtZWQ6IDAsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxOiAnQmVoZW1vdGgnLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MjogJ1JhdCcsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzOiAnQWxiYXRyb3NzJyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDFMZXZlbDogMyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDJMZXZlbDogMyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDNMZXZlbDogMyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDFUaW1lc0h1cnQ6IDAsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQyVGltZXNIdXJ0OiAwLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M1RpbWVzSHVydDogMCxcbiAgICAgICAgICBiYXR0bGVzRm91Z2h0OiAwLFxuICAgICAgICAgIHRpbWVzSHVydDogMCxcbiAgICAgICAgICBlcXVpcG1lbnRVc2VzOiBudWxsLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ0Fib21pbmF0aW9uJyxcbiAgICAgICAgICBhdHRhY2s6IDEwMCxcbiAgICAgICAgICBoZWFsdGg6IDEwMCxcbiAgICAgICAgICBleHA6IDUsXG4gICAgICAgICAgZXF1aXBtZW50OiB7IG5hbWU6ICdDYXNoZXcgTnV0JyB9LFxuICAgICAgICAgIGJlbHVnYVN3YWxsb3dlZFBldDogbnVsbCxcbiAgICAgICAgICBzYXJjYXN0aWNGcmluZ2VoZWFkU3dhbGxvd2VkUGV0OiBudWxsLFxuICAgICAgICAgIG1hbmE6IDUwLFxuICAgICAgICAgIHRyaWdnZXJzQ29uc3VtZWQ6IDAsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxOiAnQmVoZW1vdGgnLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MjogJ1BhbnRoZXInLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MzogJ0d1aW5lYWZvd2wnLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MUxldmVsOiAxLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MkxldmVsOiAxLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M0xldmVsOiAxLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MVRpbWVzSHVydDogMCxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDJUaW1lc0h1cnQ6IDAsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzVGltZXNIdXJ0OiAwLFxuICAgICAgICAgIGJhdHRsZXNGb3VnaHQ6IDAsXG4gICAgICAgICAgdGltZXNIdXJ0OiAwLFxuICAgICAgICAgIGVxdWlwbWVudFVzZXM6IG51bGwsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdkZWZhdWx0LXNvYi1zbmlwZXMnLFxuICAgICAgbmFtZTogJ1NvQiBTbmlwZXMnLFxuICAgICAgY3JlYXRlZEF0OiBEYXRlLm5vdygpLFxuICAgICAgdG95TmFtZTogJ051dGNyYWNrZXInLFxuICAgICAgdG95TGV2ZWw6IDMsXG4gICAgICBwZXRzOiBBcnJheS5mcm9tKHsgbGVuZ3RoOiA1IH0sICgpOiBUZWFtUHJlc2V0UGV0ID0+ICh7XG4gICAgICAgIG5hbWU6ICdMZW9wYXJkJyxcbiAgICAgICAgYXR0YWNrOiA1MCxcbiAgICAgICAgaGVhbHRoOiA1MCxcbiAgICAgICAgZXhwOiA1LFxuICAgICAgICBlcXVpcG1lbnQ6IHsgbmFtZTogJ0NodXJyb3MnIH0sXG4gICAgICAgIGJlbHVnYVN3YWxsb3dlZFBldDogbnVsbCxcbiAgICAgICAgc2FyY2FzdGljRnJpbmdlaGVhZFN3YWxsb3dlZFBldDogbnVsbCxcbiAgICAgICAgbWFuYTogNTAsXG4gICAgICAgIHRyaWdnZXJzQ29uc3VtZWQ6IDAsXG4gICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MTogbnVsbCxcbiAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQyOiBudWxsLFxuICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDM6IG51bGwsXG4gICAgICAgIGJhdHRsZXNGb3VnaHQ6IDAsXG4gICAgICAgIHRpbWVzSHVydDogMCxcbiAgICAgICAgZXF1aXBtZW50VXNlczogbnVsbCxcbiAgICAgIH0pKSxcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnZGVmYXVsdC1pbmZpbml0ZS1kYW1hZ2UnLFxuICAgICAgbmFtZTogJ0luZmluaXRlIERhbWFnZScsXG4gICAgICBjcmVhdGVkQXQ6IERhdGUubm93KCksXG4gICAgICB0b3lOYW1lOiAnTnV0Y3JhY2tlcicsXG4gICAgICB0b3lMZXZlbDogMSxcbiAgICAgIHJvbGxBbW91bnQ6IDQ3LFxuICAgICAgdHJhbnNmb3JtYXRpb25BbW91bnQ6IDIwMCxcbiAgICAgIHBldHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdHaWFudCBQYW5nYXNpdXMnLFxuICAgICAgICAgIGF0dGFjazogNTAsXG4gICAgICAgICAgaGVhbHRoOiAxLFxuICAgICAgICAgIGV4cDogNSxcbiAgICAgICAgICBlcXVpcG1lbnQ6IHsgbmFtZTogJ011c2hyb29tJyB9LFxuICAgICAgICAgIGJlbHVnYVN3YWxsb3dlZFBldDogbnVsbCxcbiAgICAgICAgICBzYXJjYXN0aWNGcmluZ2VoZWFkU3dhbGxvd2VkUGV0OiBudWxsLFxuICAgICAgICAgIG1hbmE6IDUwLFxuICAgICAgICAgIHRyaWdnZXJzQ29uc3VtZWQ6IDAsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxOiBudWxsLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MjogbnVsbCxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDM6IG51bGwsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxVGltZXNIdXJ0OiAwLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MlRpbWVzSHVydDogMCxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDNUaW1lc0h1cnQ6IDAsXG4gICAgICAgICAgYmF0dGxlc0ZvdWdodDogMCxcbiAgICAgICAgICB0aW1lc0h1cnQ6IDAsXG4gICAgICAgICAgZXF1aXBtZW50VXNlczogbnVsbCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdBYm9taW5hdGlvbicsXG4gICAgICAgICAgYXR0YWNrOiAxMDAsXG4gICAgICAgICAgaGVhbHRoOiAxMDAsXG4gICAgICAgICAgZXhwOiA1LFxuICAgICAgICAgIGVxdWlwbWVudDogeyBuYW1lOiAnQ2h1cnJvcycgfSxcbiAgICAgICAgICBiZWx1Z2FTd2FsbG93ZWRQZXQ6IG51bGwsXG4gICAgICAgICAgc2FyY2FzdGljRnJpbmdlaGVhZFN3YWxsb3dlZFBldDogbnVsbCxcbiAgICAgICAgICBtYW5hOiA1MCxcbiAgICAgICAgICB0cmlnZ2Vyc0NvbnN1bWVkOiAwLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MTogJ0JlaGVtb3RoJyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDFMZXZlbDogMyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDI6ICdMZW9wYXJkJyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDJMZXZlbDogMyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDM6ICdCZWx1Z2EgV2hhbGUnLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M0xldmVsOiAxLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M0JlbHVnYVN3YWxsb3dlZFBldDogJ0dpYW50IFBhbmdhc2l1cycsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxVGltZXNIdXJ0OiAwLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MlRpbWVzSHVydDogMCxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDNUaW1lc0h1cnQ6IDAsXG4gICAgICAgICAgYmF0dGxlc0ZvdWdodDogMCxcbiAgICAgICAgICB0aW1lc0h1cnQ6IDAsXG4gICAgICAgICAgZXF1aXBtZW50VXNlczogbnVsbCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdBYm9taW5hdGlvbicsXG4gICAgICAgICAgYXR0YWNrOiAxMDAsXG4gICAgICAgICAgaGVhbHRoOiAxMDAsXG4gICAgICAgICAgZXhwOiA1LFxuICAgICAgICAgIGVxdWlwbWVudDogeyBuYW1lOiAnQ2FzaGV3IE51dCcgfSxcbiAgICAgICAgICBiZWx1Z2FTd2FsbG93ZWRQZXQ6IG51bGwsXG4gICAgICAgICAgc2FyY2FzdGljRnJpbmdlaGVhZFN3YWxsb3dlZFBldDogbnVsbCxcbiAgICAgICAgICBtYW5hOiA1MCxcbiAgICAgICAgICB0cmlnZ2Vyc0NvbnN1bWVkOiAwLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MTogJ0JlaGVtb3RoJyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDFMZXZlbDogMyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDI6ICdMZW9wYXJkJyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDJMZXZlbDogMyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDM6ICdCZWx1Z2EgV2hhbGUnLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M0xldmVsOiAxLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M0JlbHVnYVN3YWxsb3dlZFBldDogJ05lc3NpZScsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxVGltZXNIdXJ0OiAwLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MlRpbWVzSHVydDogMCxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDNUaW1lc0h1cnQ6IDAsXG4gICAgICAgICAgYmF0dGxlc0ZvdWdodDogMCxcbiAgICAgICAgICB0aW1lc0h1cnQ6IDAsXG4gICAgICAgICAgZXF1aXBtZW50VXNlczogbnVsbCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdBYm9taW5hdGlvbicsXG4gICAgICAgICAgYXR0YWNrOiAxMDAsXG4gICAgICAgICAgaGVhbHRoOiAxMDAsXG4gICAgICAgICAgZXhwOiA1LFxuICAgICAgICAgIGVxdWlwbWVudDogeyBuYW1lOiAnQ2h1cnJvcycgfSxcbiAgICAgICAgICBiZWx1Z2FTd2FsbG93ZWRQZXQ6IG51bGwsXG4gICAgICAgICAgc2FyY2FzdGljRnJpbmdlaGVhZFN3YWxsb3dlZFBldDogbnVsbCxcbiAgICAgICAgICBtYW5hOiA1MCxcbiAgICAgICAgICB0cmlnZ2Vyc0NvbnN1bWVkOiAwLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MTogJ0JlaGVtb3RoJyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDFMZXZlbDogMyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDI6ICdMZW9wYXJkJyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDJMZXZlbDogMyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDM6ICdTYWJlcnRvb3RoIFRpZ2VyJyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDNMZXZlbDogMyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDFUaW1lc0h1cnQ6IDAsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQyVGltZXNIdXJ0OiAwLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M1RpbWVzSHVydDogMjUsXG4gICAgICAgICAgYmF0dGxlc0ZvdWdodDogMCxcbiAgICAgICAgICB0aW1lc0h1cnQ6IDAsXG4gICAgICAgICAgZXF1aXBtZW50VXNlczogbnVsbCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdBYm9taW5hdGlvbicsXG4gICAgICAgICAgYXR0YWNrOiAxMDAsXG4gICAgICAgICAgaGVhbHRoOiAxMDAsXG4gICAgICAgICAgZXhwOiA1LFxuICAgICAgICAgIGVxdWlwbWVudDogeyBuYW1lOiAnQ2h1cnJvcycgfSxcbiAgICAgICAgICBiZWx1Z2FTd2FsbG93ZWRQZXQ6IG51bGwsXG4gICAgICAgICAgc2FyY2FzdGljRnJpbmdlaGVhZFN3YWxsb3dlZFBldDogbnVsbCxcbiAgICAgICAgICBtYW5hOiA1MCxcbiAgICAgICAgICB0cmlnZ2Vyc0NvbnN1bWVkOiAwLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MTogJ0JlaGVtb3RoJyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDFMZXZlbDogMyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDI6ICdMZW9wYXJkJyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDJMZXZlbDogMyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDM6ICdCZWx1Z2EgV2hhbGUnLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M0xldmVsOiAxLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M0JlbHVnYVN3YWxsb3dlZFBldDogJ1NsdWcnLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MVRpbWVzSHVydDogMCxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDJUaW1lc0h1cnQ6IDAsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzVGltZXNIdXJ0OiAwLFxuICAgICAgICAgIGJhdHRsZXNGb3VnaHQ6IDAsXG4gICAgICAgICAgdGltZXNIdXJ0OiAwLFxuICAgICAgICAgIGVxdWlwbWVudFVzZXM6IG51bGwsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdkZWZhdWx0LWxheWVycycsXG4gICAgICBuYW1lOiAnTGF5ZXJzJyxcbiAgICAgIGNyZWF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgICAgIHBsYXllclRveU5hbWU6ICdOdXRjcmFja2VyJyxcbiAgICAgIHBsYXllclRveUxldmVsOiAzLFxuICAgICAgb3Bwb25lbnRUb3lOYW1lOiAnTnV0Y3JhY2tlcicsXG4gICAgICBvcHBvbmVudFRveUxldmVsOiAzLFxuICAgICAgcGxheWVySGFyZFRveTogbnVsbCxcbiAgICAgIHBsYXllckhhcmRUb3lMZXZlbDogMSxcbiAgICAgIG9wcG9uZW50SGFyZFRveTogbnVsbCxcbiAgICAgIG9wcG9uZW50SGFyZFRveUxldmVsOiAxLFxuICAgICAgdHVybjogMTMsXG4gICAgICBwbGF5ZXJHb2xkU3BlbnQ6IDEzLFxuICAgICAgb3Bwb25lbnRHb2xkU3BlbnQ6IDEzLFxuICAgICAgYWxsUGV0czogdHJ1ZSxcbiAgICAgIHRva2VuUGV0czogdHJ1ZSxcbiAgICAgIGtvbW9kb1NodWZmbGU6IGZhbHNlLFxuICAgICAgbWFuYTogdHJ1ZSxcbiAgICAgIHBsYWluQ29waWVzOiBmYWxzZSxcbiAgICAgIHRyaWdnZXJzQ29uc3VtZWQ6IGZhbHNlLFxuICAgICAgY2hhbmdlRXF1aXBtZW50VXNlczogZmFsc2UsXG4gICAgICBwbGF5ZXJSb2xsQW1vdW50OiAxMDAwLFxuICAgICAgb3Bwb25lbnRSb2xsQW1vdW50OiAxMDAwLFxuICAgICAgcGxheWVyTGV2ZWwzU29sZDogMTAwMCxcbiAgICAgIG9wcG9uZW50TGV2ZWwzU29sZDogMTAwMCxcbiAgICAgIHBsYXllclN1bW1vbmVkQW1vdW50OiAxMDAwLFxuICAgICAgb3Bwb25lbnRTdW1tb25lZEFtb3VudDogMTAwMCxcbiAgICAgIHBsYXllclRyYW5zZm9ybWF0aW9uQW1vdW50OiAxMDAwLFxuICAgICAgb3Bwb25lbnRUcmFuc2Zvcm1hdGlvbkFtb3VudDogMTAwMCxcbiAgICAgIHBldHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdHaWFudCBQYW5nYXNpdXMnLFxuICAgICAgICAgIGF0dGFjazogNTAsXG4gICAgICAgICAgaGVhbHRoOiAxLFxuICAgICAgICAgIGV4cDogNSxcbiAgICAgICAgICBlcXVpcG1lbnQ6IHsgbmFtZTogJ011c2hyb29tJyB9LFxuICAgICAgICAgIGJlbHVnYVN3YWxsb3dlZFBldDogbnVsbCxcbiAgICAgICAgICBzYXJjYXN0aWNGcmluZ2VoZWFkU3dhbGxvd2VkUGV0OiBudWxsLFxuICAgICAgICAgIG1hbmE6IDUwLFxuICAgICAgICAgIHRyaWdnZXJzQ29uc3VtZWQ6IDAsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxOiBudWxsLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MjogbnVsbCxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDM6IG51bGwsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxTGV2ZWw6IDEsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQyTGV2ZWw6IDEsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzTGV2ZWw6IDEsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxVGltZXNIdXJ0OiAwLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MlRpbWVzSHVydDogMCxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDNUaW1lc0h1cnQ6IDAsXG4gICAgICAgICAgYmF0dGxlc0ZvdWdodDogMCxcbiAgICAgICAgICB0aW1lc0h1cnQ6IDAsXG4gICAgICAgICAgZXF1aXBtZW50VXNlczogbnVsbCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdBYm9taW5hdGlvbicsXG4gICAgICAgICAgYXR0YWNrOiAxMDAsXG4gICAgICAgICAgaGVhbHRoOiAxMDAsXG4gICAgICAgICAgZXhwOiA1LFxuICAgICAgICAgIGVxdWlwbWVudDogeyBuYW1lOiAnQ2h1cnJvcycgfSxcbiAgICAgICAgICBiZWx1Z2FTd2FsbG93ZWRQZXQ6IG51bGwsXG4gICAgICAgICAgc2FyY2FzdGljRnJpbmdlaGVhZFN3YWxsb3dlZFBldDogbnVsbCxcbiAgICAgICAgICBtYW5hOiA1MCxcbiAgICAgICAgICB0cmlnZ2Vyc0NvbnN1bWVkOiAwLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MTogJ0JlaGVtb3RoJyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDI6ICdSYXQnLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MzogJ1NhYmVydG9vdGggVGlnZXInLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MUxldmVsOiAzLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MkxldmVsOiAzLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M0xldmVsOiAzLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MVRpbWVzSHVydDogMCxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDJUaW1lc0h1cnQ6IDAsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzVGltZXNIdXJ0OiA1MCxcbiAgICAgICAgICBiYXR0bGVzRm91Z2h0OiAwLFxuICAgICAgICAgIHRpbWVzSHVydDogMCxcbiAgICAgICAgICBlcXVpcG1lbnRVc2VzOiBudWxsLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ0Fib21pbmF0aW9uJyxcbiAgICAgICAgICBhdHRhY2s6IDEwMCxcbiAgICAgICAgICBoZWFsdGg6IDEwMCxcbiAgICAgICAgICBleHA6IDUsXG4gICAgICAgICAgZXF1aXBtZW50OiB7IG5hbWU6ICdDYXNoZXcgTnV0JyB9LFxuICAgICAgICAgIGJlbHVnYVN3YWxsb3dlZFBldDogbnVsbCxcbiAgICAgICAgICBzYXJjYXN0aWNGcmluZ2VoZWFkU3dhbGxvd2VkUGV0OiBudWxsLFxuICAgICAgICAgIG1hbmE6IDUwLFxuICAgICAgICAgIHRyaWdnZXJzQ29uc3VtZWQ6IDAsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxOiAnQmVoZW1vdGgnLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MjogJ0d1aW5lYWZvd2wnLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MzogJ1ZhcXVpdGEnLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MUxldmVsOiAzLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MkxldmVsOiAxLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M0xldmVsOiAzLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MVRpbWVzSHVydDogMCxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDJUaW1lc0h1cnQ6IDAsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzVGltZXNIdXJ0OiA1MCxcbiAgICAgICAgICBiYXR0bGVzRm91Z2h0OiAwLFxuICAgICAgICAgIHRpbWVzSHVydDogMCxcbiAgICAgICAgICBlcXVpcG1lbnRVc2VzOiAxLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ0Fib21pbmF0aW9uJyxcbiAgICAgICAgICBhdHRhY2s6IDEwMCxcbiAgICAgICAgICBoZWFsdGg6IDEwMCxcbiAgICAgICAgICBleHA6IDUsXG4gICAgICAgICAgZXF1aXBtZW50OiB7IG5hbWU6ICdDaHVycm9zJyB9LFxuICAgICAgICAgIGJlbHVnYVN3YWxsb3dlZFBldDogbnVsbCxcbiAgICAgICAgICBzYXJjYXN0aWNGcmluZ2VoZWFkU3dhbGxvd2VkUGV0OiBudWxsLFxuICAgICAgICAgIG1hbmE6IDUwLFxuICAgICAgICAgIHRyaWdnZXJzQ29uc3VtZWQ6IDAsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxOiAnQmVoZW1vdGgnLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MjogJ1JhdCcsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzOiAnVmFxdWl0YScsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxTGV2ZWw6IDMsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQyTGV2ZWw6IDMsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzTGV2ZWw6IDMsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxVGltZXNIdXJ0OiAwLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MlRpbWVzSHVydDogMCxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDNUaW1lc0h1cnQ6IDUwLFxuICAgICAgICAgIGJhdHRsZXNGb3VnaHQ6IDAsXG4gICAgICAgICAgdGltZXNIdXJ0OiAwLFxuICAgICAgICAgIGVxdWlwbWVudFVzZXM6IDEsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnQWJvbWluYXRpb24nLFxuICAgICAgICAgIGF0dGFjazogMTAwLFxuICAgICAgICAgIGhlYWx0aDogMTAwLFxuICAgICAgICAgIGV4cDogNSxcbiAgICAgICAgICBlcXVpcG1lbnQ6IHsgbmFtZTogJ0NodXJyb3MnIH0sXG4gICAgICAgICAgYmVsdWdhU3dhbGxvd2VkUGV0OiBudWxsLFxuICAgICAgICAgIHNhcmNhc3RpY0ZyaW5nZWhlYWRTd2FsbG93ZWRQZXQ6IG51bGwsXG4gICAgICAgICAgbWFuYTogNTAsXG4gICAgICAgICAgdHJpZ2dlcnNDb25zdW1lZDogMCxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDE6ICdCZWhlbW90aCcsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQyOiAnUmF0JyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDM6ICdTYWJlcnRvb3RoIFRpZ2VyJyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDFMZXZlbDogMyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDJMZXZlbDogMyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDNMZXZlbDogMyxcbiAgICAgICAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDFUaW1lc0h1cnQ6IDAsXG4gICAgICAgICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQyVGltZXNIdXJ0OiAwLFxuICAgICAgICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M1RpbWVzSHVydDogNTAsXG4gICAgICAgICAgYmF0dGxlc0ZvdWdodDogMCxcbiAgICAgICAgICB0aW1lc0h1cnQ6IDAsXG4gICAgICAgICAgZXF1aXBtZW50VXNlczogbnVsbCxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgXTtcbn1cbiIsICJpbXBvcnQge1xuICBTaW11bGF0aW9uQ29uZmlnLFxuICBTaW11bGF0aW9uUmVzdWx0LFxuICBQZXRDb25maWcsXG59IGZyb20gJy4uL3NyYy9hcHAvZG9tYWluL2ludGVyZmFjZXMvc2ltdWxhdGlvbi1jb25maWcuaW50ZXJmYWNlJztcbmltcG9ydCB7IHJ1bkhlYWRsZXNzU2ltdWxhdGlvbiB9IGZyb20gJy4vc2ltdWxhdGUnO1xuaW1wb3J0IHsgZ2V0RGVmYXVsdFRlYW1zIH0gZnJvbSAnLi4vc3JjL2FwcC9pbnRlZ3JhdGlvbnMvdGVhbS1wcmVzZXRzLmRlZmF1bHRzJztcblxuZXhwb3J0IGludGVyZmFjZSBUZWFtU2lkZUNvbmZpZyB7XG4gIHBhY2s/OiBzdHJpbmc7XG4gIHRveT86IHN0cmluZyB8IG51bGw7XG4gIHRveUxldmVsPzogbnVtYmVyO1xuICBoYXJkVG95Pzogc3RyaW5nIHwgbnVsbDtcbiAgaGFyZFRveUxldmVsPzogbnVtYmVyO1xuICB0dXJuPzogbnVtYmVyO1xuICBnb2xkU3BlbnQ/OiBudW1iZXI7XG4gIHJvbGxBbW91bnQ/OiBudW1iZXI7XG4gIHN1bW1vbmVkQW1vdW50PzogbnVtYmVyO1xuICBsZXZlbDNTb2xkPzogbnVtYmVyO1xuICB0cmFuc2Zvcm1hdGlvbkFtb3VudD86IG51bWJlcjtcbiAgcGV0czogKFBldENvbmZpZyB8IG51bGwpW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXZhbHVhdGVSZXF1ZXN0IHtcbiAgY2FuZGlkYXRlOiBUZWFtU2lkZUNvbmZpZztcbiAgb3Bwb25lbnRzOiBUZWFtU2lkZUNvbmZpZ1tdO1xuICBzaW11bGF0aW9uc1Blck1hdGNodXA/OiBudW1iZXI7XG4gIGJhc2VDb25maWc/OiBQYXJ0aWFsPFNpbXVsYXRpb25Db25maWc+O1xuICBzZWVkPzogbnVtYmVyIHwgbnVsbDtcbiAgdmFyaWFuY2VQZW5hbHR5PzogbnVtYmVyO1xuICBtYXRjaHVwV2VpZ2h0cz86IG51bWJlcltdO1xuICBpbmNsdWRlTWF0Y2h1cHM/OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEV2YWx1YXRlQmF0Y2hSZXF1ZXN0IHtcbiAgY2FuZGlkYXRlczogVGVhbVNpZGVDb25maWdbXTtcbiAgb3Bwb25lbnRzOiBUZWFtU2lkZUNvbmZpZ1tdO1xuICBzaW11bGF0aW9uc1Blck1hdGNodXA/OiBudW1iZXI7XG4gIGJhc2VDb25maWc/OiBQYXJ0aWFsPFNpbXVsYXRpb25Db25maWc+O1xuICBzZWVkPzogbnVtYmVyIHwgbnVsbDtcbiAgdmFyaWFuY2VQZW5hbHR5PzogbnVtYmVyO1xuICBtYXRjaHVwV2VpZ2h0cz86IG51bWJlcltdO1xuICBpbmNsdWRlTWF0Y2h1cHM/OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEV2YWx1YXRlZE1hdGNodXAge1xuICBpbmRleDogbnVtYmVyO1xuICB3aW5zOiBudW1iZXI7XG4gIGxvc3NlczogbnVtYmVyO1xuICBkcmF3czogbnVtYmVyO1xuICB3aW5SYXRlOiBudW1iZXI7XG4gIHdlaWdodGVkV2luUmF0ZTogbnVtYmVyO1xuICB3ZWlnaHQ6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFdmFsdWF0ZVJlc3BvbnNlIHtcbiAgZml0bmVzczogbnVtYmVyO1xuICBtZWFuV2luUmF0ZTogbnVtYmVyO1xuICB3ZWlnaHRlZFdpblJhdGU6IG51bWJlcjtcbiAgc3RkRGV2OiBudW1iZXI7XG4gIHZhcmlhbmNlUGVuYWx0eTogbnVtYmVyO1xuICBjb25maWRlbmNlOTU6IG51bWJlcjtcbiAgc2ltdWxhdGlvbnNQZXJNYXRjaHVwOiBudW1iZXI7XG4gIG9wcG9uZW50Q291bnQ6IG51bWJlcjtcbiAgdG90YWxCYXR0bGVzOiBudW1iZXI7XG4gIG1hdGNodXBzPzogRXZhbHVhdGVkTWF0Y2h1cFtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFByZXNldFBvb2xFbnRyeSB7XG4gIGlkOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgdGVhbTogVGVhbVNpZGVDb25maWc7XG59XG5cbmZ1bmN0aW9uIGlzUmVjb3JkKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4ge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gcGFyc2VOdW1iZXIodmFsdWU6IHVua25vd24sIGZhbGxiYWNrOiBudW1iZXIpOiBudW1iZXIge1xuICBjb25zdCBwYXJzZWQgPSBOdW1iZXIodmFsdWUpO1xuICBpZiAoIU51bWJlci5pc0Zpbml0ZShwYXJzZWQpKSB7XG4gICAgcmV0dXJuIGZhbGxiYWNrO1xuICB9XG4gIHJldHVybiBwYXJzZWQ7XG59XG5cbmZ1bmN0aW9uIGRlZXBDbG9uZTxUPih2YWx1ZTogVCk6IFQge1xuICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh2YWx1ZSkpO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVQZXQocGV0OiB1bmtub3duKTogUGV0Q29uZmlnIHwgbnVsbCB7XG4gIGlmICghaXNSZWNvcmQocGV0KSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGNvbnN0IG5hbWUgPSB0eXBlb2YgcGV0Lm5hbWUgPT09ICdzdHJpbmcnID8gcGV0Lm5hbWUgOiAnJztcbiAgaWYgKCFuYW1lLnRyaW0oKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGNvbnN0IG5vcm1hbGl6ZWQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0geyAuLi5wZXQsIG5hbWUgfTtcbiAgaWYgKCdlcXVpcG1lbnQnIGluIG5vcm1hbGl6ZWQpIHtcbiAgICBjb25zdCByYXdFcXVpcG1lbnQgPSBub3JtYWxpemVkLmVxdWlwbWVudDtcbiAgICBpZiAodHlwZW9mIHJhd0VxdWlwbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIG5vcm1hbGl6ZWQuZXF1aXBtZW50ID0gcmF3RXF1aXBtZW50LnRyaW0oKVxuICAgICAgICA/IHsgbmFtZTogcmF3RXF1aXBtZW50LnRyaW0oKSB9XG4gICAgICAgIDogbnVsbDtcbiAgICB9IGVsc2UgaWYgKGlzUmVjb3JkKHJhd0VxdWlwbWVudCkpIHtcbiAgICAgIGNvbnN0IGVxdWlwbWVudE5hbWUgPVxuICAgICAgICB0eXBlb2YgcmF3RXF1aXBtZW50Lm5hbWUgPT09ICdzdHJpbmcnID8gcmF3RXF1aXBtZW50Lm5hbWUudHJpbSgpIDogJyc7XG4gICAgICBub3JtYWxpemVkLmVxdWlwbWVudCA9IGVxdWlwbWVudE5hbWUgPyB7IG5hbWU6IGVxdWlwbWVudE5hbWUgfSA6IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vcm1hbGl6ZWQuZXF1aXBtZW50ID0gbnVsbDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG5vcm1hbGl6ZWQgYXMgUGV0Q29uZmlnO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVQZXRMaXN0KFxuICBwZXRzOiB1bmtub3duLFxuICB0YXJnZXRMZW5ndGg6IG51bWJlciA9IDUsXG4pOiAoUGV0Q29uZmlnIHwgbnVsbClbXSB7XG4gIGNvbnN0IGxpc3QgPSBBcnJheS5pc0FycmF5KHBldHMpID8gcGV0cyA6IFtdO1xuICBjb25zdCBub3JtYWxpemVkID0gbGlzdC5zbGljZSgwLCB0YXJnZXRMZW5ndGgpLm1hcCgocGV0KSA9PiBub3JtYWxpemVQZXQocGV0KSk7XG4gIHdoaWxlIChub3JtYWxpemVkLmxlbmd0aCA8IHRhcmdldExlbmd0aCkge1xuICAgIG5vcm1hbGl6ZWQucHVzaChudWxsKTtcbiAgfVxuICByZXR1cm4gbm9ybWFsaXplZDtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplVGVhbVNpZGUoaW5wdXQ6IHVua25vd24pOiBUZWFtU2lkZUNvbmZpZyB7XG4gIGNvbnN0IHNpZGUgPSBpc1JlY29yZChpbnB1dCkgPyBpbnB1dCA6IHt9O1xuICByZXR1cm4ge1xuICAgIHBhY2s6IHR5cGVvZiBzaWRlLnBhY2sgPT09ICdzdHJpbmcnICYmIHNpZGUucGFjay50cmltKClcbiAgICAgID8gc2lkZS5wYWNrLnRyaW0oKVxuICAgICAgOiB1bmRlZmluZWQsXG4gICAgdG95OiB0eXBlb2Ygc2lkZS50b3kgPT09ICdzdHJpbmcnID8gc2lkZS50b3kgOiBzaWRlLnRveSA9PT0gbnVsbCA/IG51bGwgOiB1bmRlZmluZWQsXG4gICAgdG95TGV2ZWw6XG4gICAgICBzaWRlLnRveUxldmVsID09IG51bGwgPyB1bmRlZmluZWQgOiBNYXRoLm1heCgxLCBNYXRoLnRydW5jKHBhcnNlTnVtYmVyKHNpZGUudG95TGV2ZWwsIDEpKSksXG4gICAgaGFyZFRveTpcbiAgICAgIHR5cGVvZiBzaWRlLmhhcmRUb3kgPT09ICdzdHJpbmcnXG4gICAgICAgID8gc2lkZS5oYXJkVG95XG4gICAgICAgIDogc2lkZS5oYXJkVG95ID09PSBudWxsXG4gICAgICAgICAgPyBudWxsXG4gICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgaGFyZFRveUxldmVsOlxuICAgICAgc2lkZS5oYXJkVG95TGV2ZWwgPT0gbnVsbFxuICAgICAgICA/IHVuZGVmaW5lZFxuICAgICAgICA6IE1hdGgubWF4KDEsIE1hdGgudHJ1bmMocGFyc2VOdW1iZXIoc2lkZS5oYXJkVG95TGV2ZWwsIDEpKSksXG4gICAgdHVybjpcbiAgICAgIHNpZGUudHVybiA9PSBudWxsXG4gICAgICAgID8gdW5kZWZpbmVkXG4gICAgICAgIDogTWF0aC5tYXgoMSwgTWF0aC50cnVuYyhwYXJzZU51bWJlcihzaWRlLnR1cm4sIDExKSkpLFxuICAgIGdvbGRTcGVudDpcbiAgICAgIHNpZGUuZ29sZFNwZW50ID09IG51bGxcbiAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgOiBNYXRoLm1heCgwLCBNYXRoLnRydW5jKHBhcnNlTnVtYmVyKHNpZGUuZ29sZFNwZW50LCAxMCkpKSxcbiAgICByb2xsQW1vdW50OlxuICAgICAgc2lkZS5yb2xsQW1vdW50ID09IG51bGxcbiAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgOiBNYXRoLm1heCgwLCBNYXRoLnRydW5jKHBhcnNlTnVtYmVyKHNpZGUucm9sbEFtb3VudCwgNCkpKSxcbiAgICBzdW1tb25lZEFtb3VudDpcbiAgICAgIHNpZGUuc3VtbW9uZWRBbW91bnQgPT0gbnVsbFxuICAgICAgICA/IHVuZGVmaW5lZFxuICAgICAgICA6IE1hdGgubWF4KDAsIE1hdGgudHJ1bmMocGFyc2VOdW1iZXIoc2lkZS5zdW1tb25lZEFtb3VudCwgMCkpKSxcbiAgICBsZXZlbDNTb2xkOlxuICAgICAgc2lkZS5sZXZlbDNTb2xkID09IG51bGxcbiAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgOiBNYXRoLm1heCgwLCBNYXRoLnRydW5jKHBhcnNlTnVtYmVyKHNpZGUubGV2ZWwzU29sZCwgMCkpKSxcbiAgICB0cmFuc2Zvcm1hdGlvbkFtb3VudDpcbiAgICAgIHNpZGUudHJhbnNmb3JtYXRpb25BbW91bnQgPT0gbnVsbFxuICAgICAgICA/IHVuZGVmaW5lZFxuICAgICAgICA6IE1hdGgubWF4KDAsIE1hdGgudHJ1bmMocGFyc2VOdW1iZXIoc2lkZS50cmFuc2Zvcm1hdGlvbkFtb3VudCwgMCkpKSxcbiAgICBwZXRzOiBub3JtYWxpemVQZXRMaXN0KHNpZGUucGV0cyksXG4gIH07XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRTaW11bGF0aW9uQ29uZmlnKCk6IFNpbXVsYXRpb25Db25maWcge1xuICByZXR1cm4ge1xuICAgIHBsYXllclBhY2s6ICdUdXJ0bGUnLFxuICAgIG9wcG9uZW50UGFjazogJ1R1cnRsZScsXG4gICAgcGxheWVyVG95OiBudWxsLFxuICAgIHBsYXllclRveUxldmVsOiAxLFxuICAgIHBsYXllckhhcmRUb3k6IG51bGwsXG4gICAgcGxheWVySGFyZFRveUxldmVsOiAxLFxuICAgIG9wcG9uZW50VG95OiBudWxsLFxuICAgIG9wcG9uZW50VG95TGV2ZWw6IDEsXG4gICAgb3Bwb25lbnRIYXJkVG95OiBudWxsLFxuICAgIG9wcG9uZW50SGFyZFRveUxldmVsOiAxLFxuICAgIHR1cm46IDExLFxuICAgIHBsYXllckdvbGRTcGVudDogMTAsXG4gICAgb3Bwb25lbnRHb2xkU3BlbnQ6IDEwLFxuICAgIHBsYXllclJvbGxBbW91bnQ6IDQsXG4gICAgb3Bwb25lbnRSb2xsQW1vdW50OiA0LFxuICAgIHBsYXllclN1bW1vbmVkQW1vdW50OiAwLFxuICAgIG9wcG9uZW50U3VtbW9uZWRBbW91bnQ6IDAsXG4gICAgcGxheWVyTGV2ZWwzU29sZDogMCxcbiAgICBvcHBvbmVudExldmVsM1NvbGQ6IDAsXG4gICAgcGxheWVyVHJhbnNmb3JtYXRpb25BbW91bnQ6IDAsXG4gICAgb3Bwb25lbnRUcmFuc2Zvcm1hdGlvbkFtb3VudDogMCxcbiAgICBwbGF5ZXJQZXRzOiBbbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbF0sXG4gICAgb3Bwb25lbnRQZXRzOiBbbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbF0sXG4gICAgY3VzdG9tUGFja3M6IFtdLFxuICAgIGFsbFBldHM6IGZhbHNlLFxuICAgIG9sZFN0b3JrOiBmYWxzZSxcbiAgICB0b2tlblBldHM6IHRydWUsXG4gICAga29tb2RvU2h1ZmZsZTogZmFsc2UsXG4gICAgbWFuYTogZmFsc2UsXG4gICAgc2VlZDogbnVsbCxcbiAgICBzaW11bGF0aW9uQ291bnQ6IDEwMCxcbiAgICBsb2dzRW5hYmxlZDogZmFsc2UsXG4gICAgbWF4TG9nZ2VkQmF0dGxlczogMCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gbWVyZ2VCYXNlQ29uZmlnKGJhc2VDb25maWc/OiBQYXJ0aWFsPFNpbXVsYXRpb25Db25maWc+KTogU2ltdWxhdGlvbkNvbmZpZyB7XG4gIGNvbnN0IGRlZmF1bHRzID0gZGVmYXVsdFNpbXVsYXRpb25Db25maWcoKTtcbiAgaWYgKCFiYXNlQ29uZmlnKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRzO1xuICB9XG4gIHJldHVybiB7XG4gICAgLi4uZGVmYXVsdHMsXG4gICAgLi4uZGVlcENsb25lKGJhc2VDb25maWcpLFxuICAgIHBsYXllclBldHM6IG5vcm1hbGl6ZVBldExpc3QoYmFzZUNvbmZpZy5wbGF5ZXJQZXRzID8/IGRlZmF1bHRzLnBsYXllclBldHMpLFxuICAgIG9wcG9uZW50UGV0czogbm9ybWFsaXplUGV0TGlzdChiYXNlQ29uZmlnLm9wcG9uZW50UGV0cyA/PyBkZWZhdWx0cy5vcHBvbmVudFBldHMpLFxuICB9O1xufVxuXG5mdW5jdGlvbiBhcHBseVNpZGVUb0NvbmZpZyhcbiAgY29uZmlnOiBTaW11bGF0aW9uQ29uZmlnLFxuICBzaWRlOiBUZWFtU2lkZUNvbmZpZyxcbiAgcGVyc3BlY3RpdmU6ICdwbGF5ZXInIHwgJ29wcG9uZW50Jyxcbik6IHZvaWQge1xuICBpZiAocGVyc3BlY3RpdmUgPT09ICdwbGF5ZXInKSB7XG4gICAgY29uZmlnLnBsYXllclBhY2sgPSBzaWRlLnBhY2sgPz8gY29uZmlnLnBsYXllclBhY2s7XG4gICAgY29uZmlnLnBsYXllclRveSA9IHNpZGUudG95ID09PSB1bmRlZmluZWQgPyBjb25maWcucGxheWVyVG95IDogc2lkZS50b3k7XG4gICAgY29uZmlnLnBsYXllclRveUxldmVsID0gc2lkZS50b3lMZXZlbCA/PyBjb25maWcucGxheWVyVG95TGV2ZWw7XG4gICAgY29uZmlnLnBsYXllckhhcmRUb3kgPVxuICAgICAgc2lkZS5oYXJkVG95ID09PSB1bmRlZmluZWQgPyBjb25maWcucGxheWVySGFyZFRveSA6IHNpZGUuaGFyZFRveTtcbiAgICBjb25maWcucGxheWVySGFyZFRveUxldmVsID0gc2lkZS5oYXJkVG95TGV2ZWwgPz8gY29uZmlnLnBsYXllckhhcmRUb3lMZXZlbDtcbiAgICBjb25maWcucGxheWVyR29sZFNwZW50ID0gc2lkZS5nb2xkU3BlbnQgPz8gY29uZmlnLnBsYXllckdvbGRTcGVudDtcbiAgICBjb25maWcucGxheWVyUm9sbEFtb3VudCA9IHNpZGUucm9sbEFtb3VudCA/PyBjb25maWcucGxheWVyUm9sbEFtb3VudDtcbiAgICBjb25maWcucGxheWVyU3VtbW9uZWRBbW91bnQgPVxuICAgICAgc2lkZS5zdW1tb25lZEFtb3VudCA/PyBjb25maWcucGxheWVyU3VtbW9uZWRBbW91bnQ7XG4gICAgY29uZmlnLnBsYXllckxldmVsM1NvbGQgPSBzaWRlLmxldmVsM1NvbGQgPz8gY29uZmlnLnBsYXllckxldmVsM1NvbGQ7XG4gICAgY29uZmlnLnBsYXllclRyYW5zZm9ybWF0aW9uQW1vdW50ID1cbiAgICAgIHNpZGUudHJhbnNmb3JtYXRpb25BbW91bnQgPz8gY29uZmlnLnBsYXllclRyYW5zZm9ybWF0aW9uQW1vdW50O1xuICAgIGNvbmZpZy5wbGF5ZXJQZXRzID0gbm9ybWFsaXplUGV0TGlzdChzaWRlLnBldHMpO1xuICB9IGVsc2Uge1xuICAgIGNvbmZpZy5vcHBvbmVudFBhY2sgPSBzaWRlLnBhY2sgPz8gY29uZmlnLm9wcG9uZW50UGFjaztcbiAgICBjb25maWcub3Bwb25lbnRUb3kgPSBzaWRlLnRveSA9PT0gdW5kZWZpbmVkID8gY29uZmlnLm9wcG9uZW50VG95IDogc2lkZS50b3k7XG4gICAgY29uZmlnLm9wcG9uZW50VG95TGV2ZWwgPSBzaWRlLnRveUxldmVsID8/IGNvbmZpZy5vcHBvbmVudFRveUxldmVsO1xuICAgIGNvbmZpZy5vcHBvbmVudEhhcmRUb3kgPVxuICAgICAgc2lkZS5oYXJkVG95ID09PSB1bmRlZmluZWQgPyBjb25maWcub3Bwb25lbnRIYXJkVG95IDogc2lkZS5oYXJkVG95O1xuICAgIGNvbmZpZy5vcHBvbmVudEhhcmRUb3lMZXZlbCA9XG4gICAgICBzaWRlLmhhcmRUb3lMZXZlbCA/PyBjb25maWcub3Bwb25lbnRIYXJkVG95TGV2ZWw7XG4gICAgY29uZmlnLm9wcG9uZW50R29sZFNwZW50ID0gc2lkZS5nb2xkU3BlbnQgPz8gY29uZmlnLm9wcG9uZW50R29sZFNwZW50O1xuICAgIGNvbmZpZy5vcHBvbmVudFJvbGxBbW91bnQgPSBzaWRlLnJvbGxBbW91bnQgPz8gY29uZmlnLm9wcG9uZW50Um9sbEFtb3VudDtcbiAgICBjb25maWcub3Bwb25lbnRTdW1tb25lZEFtb3VudCA9XG4gICAgICBzaWRlLnN1bW1vbmVkQW1vdW50ID8/IGNvbmZpZy5vcHBvbmVudFN1bW1vbmVkQW1vdW50O1xuICAgIGNvbmZpZy5vcHBvbmVudExldmVsM1NvbGQgPSBzaWRlLmxldmVsM1NvbGQgPz8gY29uZmlnLm9wcG9uZW50TGV2ZWwzU29sZDtcbiAgICBjb25maWcub3Bwb25lbnRUcmFuc2Zvcm1hdGlvbkFtb3VudCA9XG4gICAgICBzaWRlLnRyYW5zZm9ybWF0aW9uQW1vdW50ID8/IGNvbmZpZy5vcHBvbmVudFRyYW5zZm9ybWF0aW9uQW1vdW50O1xuICAgIGNvbmZpZy5vcHBvbmVudFBldHMgPSBub3JtYWxpemVQZXRMaXN0KHNpZGUucGV0cyk7XG4gIH1cblxuICBpZiAoc2lkZS50dXJuICE9IG51bGwpIHtcbiAgICBjb25maWcudHVybiA9IHNpZGUudHVybjtcbiAgfVxufVxuXG5mdW5jdGlvbiBidWlsZE1hdGNoQ29uZmlnKFxuICBiYXNlQ29uZmlnOiBTaW11bGF0aW9uQ29uZmlnLFxuICBjYW5kaWRhdGU6IFRlYW1TaWRlQ29uZmlnLFxuICBvcHBvbmVudDogVGVhbVNpZGVDb25maWcsXG4gIHNpbXVsYXRpb25zUGVyTWF0Y2h1cDogbnVtYmVyLFxuICBzZWVkOiBudW1iZXIgfCBudWxsLFxuKTogU2ltdWxhdGlvbkNvbmZpZyB7XG4gIGNvbnN0IGNvbmZpZyA9IGRlZXBDbG9uZShiYXNlQ29uZmlnKTtcbiAgYXBwbHlTaWRlVG9Db25maWcoY29uZmlnLCBjYW5kaWRhdGUsICdwbGF5ZXInKTtcbiAgYXBwbHlTaWRlVG9Db25maWcoY29uZmlnLCBvcHBvbmVudCwgJ29wcG9uZW50Jyk7XG4gIGNvbmZpZy5zaW11bGF0aW9uQ291bnQgPSBzaW11bGF0aW9uc1Blck1hdGNodXA7XG4gIGNvbmZpZy5zZWVkID0gc2VlZDtcbiAgY29uZmlnLmxvZ3NFbmFibGVkID0gZmFsc2U7XG4gIGNvbmZpZy5tYXhMb2dnZWRCYXR0bGVzID0gMDtcbiAgY29uZmlnLmNhcHR1cmVSYW5kb21EZWNpc2lvbnMgPSBmYWxzZTtcbiAgcmV0dXJuIGNvbmZpZztcbn1cblxuZnVuY3Rpb24gcnVuTWF0Y2goY29uZmlnOiBTaW11bGF0aW9uQ29uZmlnKTogU2ltdWxhdGlvblJlc3VsdCB7XG4gIHJldHVybiBydW5IZWFkbGVzc1NpbXVsYXRpb24oY29uZmlnLCB7XG4gICAgaW5jbHVkZUJhdHRsZXM6IGZhbHNlLFxuICAgIGVuYWJsZUxvZ3M6IGZhbHNlLFxuICB9KTtcbn1cblxuZnVuY3Rpb24gY29tcHV0ZVN0ZERldih2YWx1ZXM6IG51bWJlcltdKTogbnVtYmVyIHtcbiAgaWYgKHZhbHVlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICBjb25zdCBtZWFuID0gdmFsdWVzLnJlZHVjZSgoc3VtLCB2YWx1ZSkgPT4gc3VtICsgdmFsdWUsIDApIC8gdmFsdWVzLmxlbmd0aDtcbiAgY29uc3QgdmFyaWFuY2UgPVxuICAgIHZhbHVlcy5yZWR1Y2UoKHN1bSwgdmFsdWUpID0+IHN1bSArICh2YWx1ZSAtIG1lYW4pICoqIDIsIDApIC8gdmFsdWVzLmxlbmd0aDtcbiAgcmV0dXJuIE1hdGguc3FydChNYXRoLm1heCgwLCB2YXJpYW5jZSkpO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVXZWlnaHRzKGNvdW50OiBudW1iZXIsIHdlaWdodHM/OiBudW1iZXJbXSk6IG51bWJlcltdIHtcbiAgaWYgKCF3ZWlnaHRzIHx8IHdlaWdodHMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20oeyBsZW5ndGg6IGNvdW50IH0sICgpID0+IDEgLyBNYXRoLm1heCgxLCBjb3VudCkpO1xuICB9XG4gIGNvbnN0IG5vcm1hbGl6ZWQgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiBjb3VudCB9LCAoXywgaW5kZXgpID0+IHtcbiAgICBjb25zdCB2YWx1ZSA9IE51bWJlcih3ZWlnaHRzW2luZGV4XSk7XG4gICAgcmV0dXJuIE51bWJlci5pc0Zpbml0ZSh2YWx1ZSkgJiYgdmFsdWUgPiAwID8gdmFsdWUgOiAwO1xuICB9KTtcbiAgY29uc3Qgc3VtID0gbm9ybWFsaXplZC5yZWR1Y2UoKGFjYywgdmFsdWUpID0+IGFjYyArIHZhbHVlLCAwKTtcbiAgaWYgKHN1bSA8PSAwKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20oeyBsZW5ndGg6IGNvdW50IH0sICgpID0+IDEgLyBNYXRoLm1heCgxLCBjb3VudCkpO1xuICB9XG4gIHJldHVybiBub3JtYWxpemVkLm1hcCgodmFsdWUpID0+IHZhbHVlIC8gc3VtKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV2YWx1YXRlQ2FuZGlkYXRlVnNQb29sKGlucHV0OiBFdmFsdWF0ZVJlcXVlc3QpOiBFdmFsdWF0ZVJlc3BvbnNlIHtcbiAgY29uc3QgY2FuZGlkYXRlID0gbm9ybWFsaXplVGVhbVNpZGUoaW5wdXQuY2FuZGlkYXRlKTtcbiAgY29uc3Qgb3Bwb25lbnRzID0gQXJyYXkuaXNBcnJheShpbnB1dC5vcHBvbmVudHMpXG4gICAgPyBpbnB1dC5vcHBvbmVudHMubWFwKChvcHBvbmVudCkgPT4gbm9ybWFsaXplVGVhbVNpZGUob3Bwb25lbnQpKVxuICAgIDogW107XG5cbiAgaWYgKG9wcG9uZW50cy5sZW5ndGggPT09IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0V2YWx1YXRpb24gcmVxdWlyZXMgYXQgbGVhc3Qgb25lIG9wcG9uZW50IHRlYW0uJyk7XG4gIH1cblxuICBjb25zdCBzaW11bGF0aW9uc1Blck1hdGNodXAgPSBNYXRoLm1heChcbiAgICAxLFxuICAgIE1hdGgudHJ1bmMocGFyc2VOdW1iZXIoaW5wdXQuc2ltdWxhdGlvbnNQZXJNYXRjaHVwLCAxMDApKSxcbiAgKTtcbiAgY29uc3QgdmFyaWFuY2VQZW5hbHR5ID0gTWF0aC5tYXgoMCwgcGFyc2VOdW1iZXIoaW5wdXQudmFyaWFuY2VQZW5hbHR5LCAwLjEpKTtcbiAgY29uc3QgYmFzZUNvbmZpZyA9IG1lcmdlQmFzZUNvbmZpZyhpbnB1dC5iYXNlQ29uZmlnKTtcbiAgY29uc3Qgd2VpZ2h0cyA9IG5vcm1hbGl6ZVdlaWdodHMob3Bwb25lbnRzLmxlbmd0aCwgaW5wdXQubWF0Y2h1cFdlaWdodHMpO1xuICBjb25zdCBtYXRjaHVwczogRXZhbHVhdGVkTWF0Y2h1cFtdID0gW107XG4gIGNvbnN0IHdpblJhdGVzOiBudW1iZXJbXSA9IFtdO1xuXG4gIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBvcHBvbmVudHMubGVuZ3RoOyBpbmRleCArPSAxKSB7XG4gICAgY29uc3Qgb3Bwb25lbnQgPSBvcHBvbmVudHNbaW5kZXhdO1xuICAgIGNvbnN0IG1hdGNodXBTZWVkID1cbiAgICAgIGlucHV0LnNlZWQgPT0gbnVsbCA/IG51bGwgOiBNYXRoLnRydW5jKHBhcnNlTnVtYmVyKGlucHV0LnNlZWQsIDApKSArIGluZGV4O1xuICAgIGNvbnN0IGNvbmZpZyA9IGJ1aWxkTWF0Y2hDb25maWcoXG4gICAgICBiYXNlQ29uZmlnLFxuICAgICAgY2FuZGlkYXRlLFxuICAgICAgb3Bwb25lbnQsXG4gICAgICBzaW11bGF0aW9uc1Blck1hdGNodXAsXG4gICAgICBtYXRjaHVwU2VlZCxcbiAgICApO1xuICAgIGNvbnN0IHJlc3VsdCA9IHJ1bk1hdGNoKGNvbmZpZyk7XG4gICAgY29uc3QgdG90YWwgPSBNYXRoLm1heChcbiAgICAgIDEsXG4gICAgICByZXN1bHQucGxheWVyV2lucyArIHJlc3VsdC5vcHBvbmVudFdpbnMgKyByZXN1bHQuZHJhd3MsXG4gICAgKTtcbiAgICBjb25zdCB3aW5SYXRlID0gcmVzdWx0LnBsYXllcldpbnMgLyB0b3RhbDtcbiAgICB3aW5SYXRlcy5wdXNoKHdpblJhdGUpO1xuICAgIG1hdGNodXBzLnB1c2goe1xuICAgICAgaW5kZXgsXG4gICAgICB3aW5zOiByZXN1bHQucGxheWVyV2lucyxcbiAgICAgIGxvc3NlczogcmVzdWx0Lm9wcG9uZW50V2lucyxcbiAgICAgIGRyYXdzOiByZXN1bHQuZHJhd3MsXG4gICAgICB3aW5SYXRlLFxuICAgICAgd2VpZ2h0ZWRXaW5SYXRlOiB3aW5SYXRlICogd2VpZ2h0c1tpbmRleF0sXG4gICAgICB3ZWlnaHQ6IHdlaWdodHNbaW5kZXhdLFxuICAgIH0pO1xuICB9XG5cbiAgY29uc3QgbWVhbldpblJhdGUgPVxuICAgIHdpblJhdGVzLnJlZHVjZSgoc3VtLCB2YWx1ZSkgPT4gc3VtICsgdmFsdWUsIDApIC8gTWF0aC5tYXgoMSwgd2luUmF0ZXMubGVuZ3RoKTtcbiAgY29uc3Qgd2VpZ2h0ZWRXaW5SYXRlID0gbWF0Y2h1cHMucmVkdWNlKFxuICAgIChzdW0sIG1hdGNodXApID0+IHN1bSArIG1hdGNodXAud2VpZ2h0ZWRXaW5SYXRlLFxuICAgIDAsXG4gICk7XG4gIGNvbnN0IHN0ZERldiA9IGNvbXB1dGVTdGREZXYod2luUmF0ZXMpO1xuICBjb25zdCBmaXRuZXNzID0gd2VpZ2h0ZWRXaW5SYXRlIC0gdmFyaWFuY2VQZW5hbHR5ICogc3RkRGV2O1xuICBjb25zdCB0b3RhbEJhdHRsZXMgPSBzaW11bGF0aW9uc1Blck1hdGNodXAgKiBvcHBvbmVudHMubGVuZ3RoO1xuICBjb25zdCBjb25maWRlbmNlOTUgPVxuICAgIDEuOTYgKiBNYXRoLnNxcnQoKG1lYW5XaW5SYXRlICogKDEgLSBtZWFuV2luUmF0ZSkpIC8gTWF0aC5tYXgoMSwgdG90YWxCYXR0bGVzKSk7XG5cbiAgcmV0dXJuIHtcbiAgICBmaXRuZXNzLFxuICAgIG1lYW5XaW5SYXRlLFxuICAgIHdlaWdodGVkV2luUmF0ZSxcbiAgICBzdGREZXYsXG4gICAgdmFyaWFuY2VQZW5hbHR5LFxuICAgIGNvbmZpZGVuY2U5NSxcbiAgICBzaW11bGF0aW9uc1Blck1hdGNodXAsXG4gICAgb3Bwb25lbnRDb3VudDogb3Bwb25lbnRzLmxlbmd0aCxcbiAgICB0b3RhbEJhdHRsZXMsXG4gICAgLi4uKGlucHV0LmluY2x1ZGVNYXRjaHVwcyA/IHsgbWF0Y2h1cHMgfSA6IHt9KSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV2YWx1YXRlQ2FuZGlkYXRlQmF0Y2goaW5wdXQ6IEV2YWx1YXRlQmF0Y2hSZXF1ZXN0KTogRXZhbHVhdGVSZXNwb25zZVtdIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGlucHV0LmNhbmRpZGF0ZXMpIHx8IGlucHV0LmNhbmRpZGF0ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIHJldHVybiBpbnB1dC5jYW5kaWRhdGVzLm1hcCgoY2FuZGlkYXRlLCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IHNlZWQgPVxuICAgICAgaW5wdXQuc2VlZCA9PSBudWxsXG4gICAgICAgID8gbnVsbFxuICAgICAgICA6IE1hdGgudHJ1bmMocGFyc2VOdW1iZXIoaW5wdXQuc2VlZCwgMCkpICsgaW5kZXggKiAxMDAwMDA7XG4gICAgcmV0dXJuIGV2YWx1YXRlQ2FuZGlkYXRlVnNQb29sKHtcbiAgICAgIGNhbmRpZGF0ZSxcbiAgICAgIG9wcG9uZW50czogaW5wdXQub3Bwb25lbnRzLFxuICAgICAgc2ltdWxhdGlvbnNQZXJNYXRjaHVwOiBpbnB1dC5zaW11bGF0aW9uc1Blck1hdGNodXAsXG4gICAgICBiYXNlQ29uZmlnOiBpbnB1dC5iYXNlQ29uZmlnLFxuICAgICAgc2VlZCxcbiAgICAgIHZhcmlhbmNlUGVuYWx0eTogaW5wdXQudmFyaWFuY2VQZW5hbHR5LFxuICAgICAgbWF0Y2h1cFdlaWdodHM6IGlucHV0Lm1hdGNodXBXZWlnaHRzLFxuICAgICAgaW5jbHVkZU1hdGNodXBzOiBpbnB1dC5pbmNsdWRlTWF0Y2h1cHMsXG4gICAgfSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVmYXVsdFByZXNldFBvb2woKTogUHJlc2V0UG9vbEVudHJ5W10ge1xuICBjb25zdCB0ZWFtcyA9IGdldERlZmF1bHRUZWFtcygpO1xuICByZXR1cm4gdGVhbXMubWFwKCh0ZWFtKSA9PiB7XG4gICAgY29uc3Qgc2lkZTogVGVhbVNpZGVDb25maWcgPSB7XG4gICAgICBwYWNrOiAnVHVydGxlJyxcbiAgICAgIHRveTpcbiAgICAgICAgdGVhbS5wbGF5ZXJUb3lOYW1lID8/IHRlYW0udG95TmFtZSA/PyB0ZWFtLm9wcG9uZW50VG95TmFtZSA/PyBudWxsLFxuICAgICAgdG95TGV2ZWw6XG4gICAgICAgIHRlYW0ucGxheWVyVG95TGV2ZWwgPz8gdGVhbS50b3lMZXZlbCA/PyB0ZWFtLm9wcG9uZW50VG95TGV2ZWwgPz8gMSxcbiAgICAgIGhhcmRUb3k6IHRlYW0ucGxheWVySGFyZFRveSA/PyB0ZWFtLm9wcG9uZW50SGFyZFRveSA/PyBudWxsLFxuICAgICAgaGFyZFRveUxldmVsOlxuICAgICAgICB0ZWFtLnBsYXllckhhcmRUb3lMZXZlbCA/PyB0ZWFtLm9wcG9uZW50SGFyZFRveUxldmVsID8/IDEsXG4gICAgICB0dXJuOiB0ZWFtLnR1cm4gPz8gMTEsXG4gICAgICBnb2xkU3BlbnQ6IHRlYW0ucGxheWVyR29sZFNwZW50ID8/IHRlYW0ub3Bwb25lbnRHb2xkU3BlbnQgPz8gMTAsXG4gICAgICByb2xsQW1vdW50OiB0ZWFtLnBsYXllclJvbGxBbW91bnQgPz8gdGVhbS5vcHBvbmVudFJvbGxBbW91bnQgPz8gNCxcbiAgICAgIHN1bW1vbmVkQW1vdW50OlxuICAgICAgICB0ZWFtLnBsYXllclN1bW1vbmVkQW1vdW50ID8/IHRlYW0ub3Bwb25lbnRTdW1tb25lZEFtb3VudCA/PyAwLFxuICAgICAgbGV2ZWwzU29sZDogdGVhbS5wbGF5ZXJMZXZlbDNTb2xkID8/IHRlYW0ub3Bwb25lbnRMZXZlbDNTb2xkID8/IDAsXG4gICAgICB0cmFuc2Zvcm1hdGlvbkFtb3VudDpcbiAgICAgICAgdGVhbS5wbGF5ZXJUcmFuc2Zvcm1hdGlvbkFtb3VudCA/PyB0ZWFtLm9wcG9uZW50VHJhbnNmb3JtYXRpb25BbW91bnQgPz8gMCxcbiAgICAgIHBldHM6IG5vcm1hbGl6ZVBldExpc3QodGVhbS5wZXRzKSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiB0ZWFtLmlkLFxuICAgICAgbmFtZTogdGVhbS5uYW1lLFxuICAgICAgdGVhbTogc2lkZSxcbiAgICB9O1xuICB9KTtcbn0iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxnQkFBZTs7O0FDRGYsSUFBQUEsNEJBQXdHOzs7QUNDakcsU0FBUyxXQUFXLE9BQWE7QUFDdEMsU0FBTyxTQUFVLFFBQWE7QUFBQSxFQUFDO0FBQ2pDOzs7QUNIQSwrQkFBeUI7QUFHbEIsSUFBTSxPQUFPLGdCQUFnQixrQ0FBUyxJQUFJO0FBQzFDLElBQU0sT0FBTyxnQkFBZ0Isa0NBQVMsSUFBSTtBQUMxQyxJQUFNLE9BQU8sZ0JBQWdCLGtDQUFTLElBQUk7QUFDMUMsSUFBTSxRQUFRLGdC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QUM5QyxZQUFVLFFBQVEsUUFBUSxNQUFNO0FBQ2xDO0FBRUEsU0FBUyxpQkFBaUIsTUFBc0I7QUFDOUMsUUFBTSxVQUFVLFVBQVUsSUFBSTtBQUM5QixRQUFNLFFBQVEsVUFBVSxPQUFPO0FBQy9CLFFBQU0sVUFBVSxLQUFLLE1BQU0sS0FBSztBQUNoQyxRQUFNLFNBQVMsdUJBQXVCLE9BQU87QUFDN0MsWUFBVSxRQUFRLFFBQVEsTUFBTTtBQUNsQztBQUVBLFNBQVMsWUFBWSxNQUFzQjtBQUN6QyxRQUFNLFVBQVUsVUFBVSxJQUFJO0FBQzlCLFFBQU0sUUFBUSxVQUFVLE9BQU87QUFDL0IsUUFBTSxTQUFTLEtBQUssTUFBTSxLQUFLO0FBQy9CLFFBQU0sYUFBUywwQkFBQUMsdUJBQXNCLFFBQVE7QUFBQSxJQUMzQyxnQkFBZ0IsUUFBUTtBQUFBLElBQ3hCLFlBQVksUUFBUTtBQUFBLEVBQ3RCLENBQUM7QUFDRCxZQUFVLFFBQVEsUUFBUSxNQUFNO0FBQ2xDO0FBRUEsU0FBUyxNQUFNO0FBQ2IsUUFBTSxPQUFPLFFBQVEsS0FBSyxNQUFNLENBQUM7QUFDakMsTUFBSSxLQUFLLFdBQVcsR0FBRztBQUNyQixnQkFBWSxJQUFJO0FBQ2hCO0FBQUEsRUFDRjtBQUVBLFFBQU0sVUFBVSxLQUFLLENBQUM7QUFDdEIsTUFBSSxZQUFZLFlBQVksWUFBWSxNQUFNO0FBQzVDLGNBQVU7QUFDVjtBQUFBLEVBQ0Y7QUFFQSxNQUFJLFlBQVksZUFBZTtBQUM3QixrQkFBYyxLQUFLLE1BQU0sQ0FBQyxDQUFDO0FBQzNCO0FBQUEsRUFDRjtBQUVBLE1BQUksWUFBWSxZQUFZO0FBQzFCLGdCQUFZLEtBQUssTUFBTSxDQUFDLENBQUM7QUFDekI7QUFBQSxFQUNGO0FBRUEsTUFBSSxZQUFZLGtCQUFrQjtBQUNoQyxxQkFBaUIsS0FBSyxNQUFNLENBQUMsQ0FBQztBQUM5QjtBQUFBLEVBQ0Y7QUFFQSxNQUFJLFlBQVksWUFBWTtBQUMxQixnQkFBWSxLQUFLLE1BQU0sQ0FBQyxDQUFDO0FBQ3pCO0FBQUEsRUFDRjtBQUVBLGNBQVksSUFBSTtBQUNsQjtBQUVBLElBQUk7IiwKICAibmFtZXMiOiBbImltcG9ydF9zYXBfYmF0dGxlX2VuZ2luZSIsICJwZXROYW1lcyIsICJ0b3lOYW1lcyIsICJlcXVpcG1lbnROYW1lcyIsICJyZWdleCIsICJtYXRjaCIsICJwZXROYW1lcyIsICJ0b3lOYW1lcyIsICJlcXVpcG1lbnROYW1lcyIsICJwZXRzIiwgImltcG9ydF9zYXBfYmF0dGxlX2VuZ2luZSIsICJpbXBvcnRfc2FwX2JhdHRsZV9lbmdpbmUiLCAicGV0cyIsICJlbmdpbmVIZWFkbGVzc1NpbXVsYXRpb24iLCAiZnMiLCAiZW5naW5lSGVhZGxlc3NTaW11bGF0aW9uIl0KfQo=
