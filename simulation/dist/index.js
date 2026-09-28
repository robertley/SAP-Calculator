var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __knownSymbol = (name, symbol) => (symbol = Symbol[name]) ? symbol : /* @__PURE__ */ Symbol.for("Symbol." + name);
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
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

// simulation/simulate.ts
var simulate_exports = {};
__export(simulate_exports, {
  ReplayCalcParser: () => ReplayCalcParser,
  buildReplayAbilityPetMapFromActions: () => buildReplayAbilityPetMapFromActions,
  buildReplayPerkNameByPetIdFromActions: () => buildReplayPerkNameByPetIdFromActions,
  catalogs: () => import_sap_battle_engine4.catalogs,
  createBattleEngine: () => import_sap_battle_engine4.createBattleEngine,
  createBoardStrengthFingerprint: () => createBoardStrengthFingerprint,
  createBoardStrengthMatchConfig: () => createBoardStrengthMatchConfig,
  createSimulationConfigFromCalculatorState: () => createSimulationConfigFromCalculatorState,
  generateReplayCalculatorLink: () => generateReplayCalculatorLink,
  getBoardStrengthPrecisionProfile: () => getBoardStrengthPrecisionProfile,
  getPositioningSimulationCount: () => getPositioningSimulationCount,
  optimizeFight: () => import_sap_battle_engine4.optimizeFight,
  parseReplayCalculatorState: () => parseReplayCalculatorState,
  parseReplayForCalculatorFromActions: () => parseReplayForCalculatorFromActions,
  parseTeamwoodReplayForCalculator: () => parseTeamwoodReplayForCalculator,
  runBoardStrengthEvaluation: () => runBoardStrengthEvaluation,
  runHeadlessSimulation: () => import_sap_battle_engine3.runHeadlessSimulation,
  runPositioningOptimization: () => runPositioningOptimization,
  runReplayOddsFromCalculatorState: () => runReplayOddsFromCalculatorState,
  runReplayPositioningFromCalculatorState: () => runReplayPositioningFromCalculatorState,
  runReplayStrengthFromCalculatorState: () => runReplayStrengthFromCalculatorState,
  runSimulation: () => runSimulation,
  selectReplayBattleFromActions: () => selectReplayBattleFromActions
});
module.exports = __toCommonJS(simulate_exports);

// src/app/integrations/simulation/battle-engine.ts
var import_sap_battle_engine2 = require("sap-battle-engine");

// src/app/domain/entities/player.class.ts
var Player = class {
  constructor() {
    this.pack = "Turtle";
    this.toy = null;
    this.hardToy = null;
    this.originalToy = null;
    this.isOpponent = false;
    this.allPets = false;
    this.tokenPets = false;
  }
  getPet(index) {
    return [this.pet0, this.pet1, this.pet2, this.pet3, this.pet4][index] ?? null;
  }
  setPet(index, pet, _init2 = false) {
    switch (index) {
      case 0:
        this.pet0 = pet;
        break;
      case 1:
        this.pet1 = pet;
        break;
      case 2:
        this.pet2 = pet;
        break;
      case 3:
        this.pet3 = pet;
        break;
      case 4:
        this.pet4 = pet;
        break;
      default:
        return;
    }
    if (pet) {
      pet.parent = this;
      pet.savedPosition = index;
    }
  }
  get petArray() {
    return [this.pet0, this.pet1, this.pet2, this.pet3, this.pet4].filter((pet) => pet != null);
  }
};

// src/app/domain/entities/pet.class.ts
var Pet = class {
  constructor() {
    this.exp = 0;
    this.mana = 0;
    this.equipment = null;
    this.plainCopy = false;
    this.triggersConsumed = 0;
    this.foodsEaten = 0;
    this.timesGaveHealth = 0;
    this.battlesFought = 0;
    this.timesHurt = 0;
    this.friendsDiedBeforeBattle = 0;
    this.friendsHurtBeforeBattle = 0;
    this.ailmentsCount = 0;
    this.savedPosition = 0;
  }
  get level() {
    return this.exp >= 5 ? 3 : this.exp >= 2 ? 2 : 1;
  }
};

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
function sampleBattlesByOutcome(battles, limitPerOutcome) {
  const limit = Math.max(0, Math.trunc(limitPerOutcome));
  const counts = {
    player: 0,
    opponent: 0,
    draw: 0
  };
  return battles.filter((battle) => {
    if (counts[battle.winner] >= limit) {
      return false;
    }
    counts[battle.winner] += 1;
    return true;
  });
}
function displayPet(snapshot) {
  const parent = new Player();
  parent.isOpponent = snapshot.side === "opponent";
  return Object.assign(new Pet(), snapshot, {
    parent,
    savedPosition: snapshot.position - 1,
    equipment: snapshot.equipment ? { name: snapshot.equipment, uses: snapshot.equipmentUses } : null
  });
}
function displayBoard(board, config) {
  const sides = ["player", "opponent"].map((side) => {
    const player = new Player();
    player.isOpponent = side === "opponent";
    board[side].forEach((pet, index) => player.setPet(index, pet ? displayPet(pet) : null));
    const toy = side === "player" ? config.playerToy : config.opponentToy;
    const hardToy = side === "player" ? config.playerHardToy : config.opponentHardToy;
    player.toy = toy ? { name: toy, level: 1 } : null;
    player.hardToy = hardToy ? { name: hardToy, level: 1 } : null;
    return player;
  });
  return buildBoardStateMessage(sides[0], sides[1], (pet) => pet.savedPosition + 1, (name) => ailments.has(name));
}
var CalculatorBattleEngine = class {
  constructor(settings) {
    this.engine = (0, import_sap_battle_engine2.createBattleEngine)();
    this.logService = new LogService();
    this.logService.setShowTriggerNamesInLogs(settings?.isShowTriggerNamesInLogs() ?? false);
  }
  run(config, hooks, maxBattlesPerOutcome) {
    const result = this.engine.runSimulation(config, hooks);
    const battles = result.battles && maxBattlesPerOutcome != null ? sampleBattlesByOutcome(result.battles, maxBattlesPerOutcome) : result.battles;
    return {
      ...result,
      ...battles ? { battles: battles.map((battle) => ({
        ...battle,
        logs: this.formatEvents(battle.logs, config)
      })) } : {}
    };
  }
  projectLineupAfterEndTurn(config, side, lineup) {
    return this.engine.projectLineupAfterEndTurn(config, side, lineup);
  }
  formatEvents(events, config) {
    this.logService.reset();
    this.logService.setEnabled(true);
    this.logService.setDeferDecorations(true);
    for (const event of events) {
      this.logService.createLog({
        ...event,
        message: event.type === "board" && !event.message ? displayBoard(event.board, config) : event.message,
        playerIsOpponent: event.side == null ? void 0 : event.side === "opponent",
        targetIsOpponent: event.targetSide == null ? void 0 : event.targetSide === "opponent",
        sourcePet: event.source ? displayPet(event.source) : void 0,
        targetPet: event.target ? displayPet(event.target) : void 0,
        // Keep snapshot events separate so their identities and board states remain meaningful.
        noCollapse: true
      });
    }
    return this.logService.getLogs();
  }
};

// simulation/simulate.ts
var import_sap_battle_engine3 = require("sap-battle-engine");

// src/app/runtime/base64-url.ts
var BYTE_CHUNK_SIZE = 32768;
function encodeBase64Url(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (let index = 0; index < bytes.length; index += BYTE_CHUNK_SIZE) {
    binary += String.fromCharCode(
      ...bytes.subarray(index, index + BYTE_CHUNK_SIZE)
    );
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

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
var FALLBACK_ABILITY_IDS_BY_PET_ID = {
  "338": [368],
  "373": [403],
  "635": [669],
  // Sarcastic Fringehead observed multiple ability enums in payloads
  "763": [853, 970]
};
var FALLBACK_TOY_IDS_BY_NAME = {
  actionfigure: 294,
  airpalmtree: 511,
  balloon: 479,
  boot: 299,
  bowlingball: 300,
  brokenpiggybank: 310,
  broom: 301,
  cardboardbox: 302,
  // (trimmed list - include common fallbacks used in live payloads)
  television: 491,
  toymouse: 327
};
function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function getRecord(value) {
  return isPlainObject(value) ? value : null;
}
function getByNameLookup(lookup, key) {
  if (!lookup) {
    return void 0;
  }
  if (lookup instanceof Map) {
    return lookup.get(key);
  }
  return lookup[key];
}
function toIntOrNull(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function toNullableNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
function toFiniteNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}
function resolvePetIdFromUnknown(value, maps) {
  if (value === null || value === void 0) {
    return null;
  }
  if (isPlainObject(value)) {
    const directIdCandidates = [
      value["id"],
      value["Id"],
      value["petId"],
      value["PetId"],
      value["enum"],
      value["Enum"],
      value["Enu"],
      value["enu"]
    ];
    for (const candidate of directIdCandidates) {
      if (candidate === void 0 || candidate === null) {
        continue;
      }
      const numeric2 = toFiniteNumber(candidate, NaN);
      if (Number.isFinite(numeric2)) {
        return Math.trunc(numeric2);
      }
    }
    const nameRaw = value["name"] ?? value["Name"];
    if (typeof nameRaw === "string") {
      const key = nameRaw.toLowerCase().replace(/[^a-z0-9]/g, "");
      const petIdsByName = maps?.petIdsByName ?? maps?.PET_IDS_BY_NAME;
      const id = getByNameLookup(petIdsByName, key);
      const numeric2 = toIntOrNull(id);
      if (numeric2 !== null) {
        return numeric2;
      }
    }
    return null;
  }
  if (typeof value === "string") {
    const s = value.trim();
    if (s === "") {
      return null;
    }
    const numeric2 = toFiniteNumber(s, NaN);
    if (Number.isFinite(numeric2)) {
      return Math.trunc(numeric2);
    }
    const key = s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const petIdsByName = maps?.petIdsByName ?? maps?.PET_IDS_BY_NAME;
    const id = getByNameLookup(petIdsByName, key);
    const mapped = toIntOrNull(id);
    if (mapped !== null) {
      return mapped;
    }
    return null;
  }
  const numeric = toFiniteNumber(value, NaN);
  if (Number.isFinite(numeric)) {
    return Math.trunc(numeric);
  }
  return null;
}
function uniqueNumbers(values) {
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (const v of values) {
    if (v === null || v === void 0) {
      continue;
    }
    const n = Number(v);
    if (!Number.isFinite(n)) {
      continue;
    }
    const normalized = Math.trunc(n);
    if (seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    out.push(normalized);
  }
  return out;
}
function getAbilityEnumsForPet(petId, maps) {
  const abilityMap = maps?.abilityIdsByPetId ?? {};
  const key = String(petId);
  const mapped = Array.isArray(abilityMap[key]) ? abilityMap[key] ?? [] : [];
  const fallback = Array.isArray(FALLBACK_ABILITY_IDS_BY_PET_ID[key]) ? FALLBACK_ABILITY_IDS_BY_PET_ID[key] : [];
  return uniqueNumbers([...mapped, ...fallback]);
}
function buildBelugaSwallowedEntry(swallowedRaw) {
  const swallowedPetId = resolvePetIdFromUnknown(swallowedRaw);
  if (!Number.isFinite(swallowedPetId)) {
    return null;
  }
  const entry = { Enu: swallowedPetId };
  const swallowed = getRecord(swallowedRaw);
  if (!swallowed) {
    return entry;
  }
  const attack = toFiniteNumber(
    swallowed["attack"] ?? swallowed["At"] ?? swallowed["at"],
    NaN
  );
  if (Number.isFinite(attack)) {
    entry.At = Math.max(0, Math.round(attack));
  }
  const health = toFiniteNumber(
    swallowed["health"] ?? swallowed["Hp"] ?? swallowed["hp"],
    NaN
  );
  if (Number.isFinite(health)) {
    entry.Hp = Math.max(1, Math.round(health));
  }
  const mana = toFiniteNumber(swallowed["mana"] ?? swallowed["Mana"], NaN);
  if (Number.isFinite(mana)) {
    entry.Mana = Math.max(0, Math.round(mana));
  }
  const level = toFiniteNumber(
    swallowed["level"] ?? swallowed["lvl"] ?? swallowed["Lvl"],
    NaN
  );
  if (Number.isFinite(level)) {
    entry.Lvl = Math.max(1, Math.min(3, Math.round(level)));
  }
  const exp = toFiniteNumber(swallowed["exp"] ?? swallowed["Exp"], NaN);
  if (Number.isFinite(exp)) {
    entry.Exp = Math.max(0, Math.round(exp));
  }
  const perk = swallowed["perk"] ?? swallowed["Perk"];
  const perkNumber = toNullableNumber(perk);
  if (perkNumber !== null) {
    entry.Perk = perkNumber;
  }
  const timesHurt = toFiniteNumber(
    swallowed["timesHurt"] ?? swallowed["TimesHurt"] ?? swallowed["HrtC"],
    NaN
  );
  if (Number.isFinite(timesHurt)) {
    entry.HrtC = Math.max(0, Math.round(timesHurt));
  }
  return entry;
}
function collectAbominationSwallowedEntries(rawPet, maps) {
  const slotConfigs = [
    {
      petKey: "abominationSwallowedPet1",
      levelKey: "abominationSwallowedPet1Level",
      belugaKey: "abominationSwallowedPet1BelugaSwallowedPet",
      sfsKey: "abominationSwallowedPet1SarcasticFringeheadSwallowedPet"
    },
    {
      petKey: "abominationSwallowedPet2",
      levelKey: "abominationSwallowedPet2Level",
      belugaKey: "abominationSwallowedPet2BelugaSwallowedPet",
      sfsKey: "abominationSwallowedPet2SarcasticFringeheadSwallowedPet"
    },
    {
      petKey: "abominationSwallowedPet3",
      levelKey: "abominationSwallowedPet3Level",
      belugaKey: "abominationSwallowedPet3BelugaSwallowedPet",
      sfsKey: "abominationSwallowedPet3SarcasticFringeheadSwallowedPet"
    }
  ];
  const root = getRecord(rawPet);
  const entries = [];
  for (const slotConfig of slotConfigs) {
    const swallowedRaw = root?.[slotConfig.petKey];
    const swallowedPetId = resolvePetIdFromUnknown(swallowedRaw, maps);
    if (!Number.isFinite(swallowedPetId)) {
      continue;
    }
    const swallowedRecord = getRecord(swallowedRaw);
    const swallowedAbilityEnums = getAbilityEnumsForPet(swallowedPetId, maps);
    const memoryEntry = buildBelugaSwallowedEntry(swallowedRaw) ?? { Enu: swallowedPetId };
    const swallowedLevel = toFiniteNumber(root?.[slotConfig.levelKey], NaN);
    if (Number.isFinite(swallowedLevel)) {
      memoryEntry.Lvl = Math.max(1, Math.min(3, Math.round(swallowedLevel)));
    }
    if (swallowedPetId === 182) {
      const belugaRaw = root?.[slotConfig.belugaKey] ?? swallowedRecord?.["belugaSwallowedPet"] ?? null;
      const belugaEntry = buildBelugaSwallowedEntry(belugaRaw);
      if (belugaEntry) {
        const belugaAbilityEnums = getAbilityEnumsForPet(182, maps);
        const belugaLists = {
          WhiteWhaleAbility: [{ ...belugaEntry }]
        };
        for (const abilityEnum of belugaAbilityEnums) {
          belugaLists[String(abilityEnum)] = [{ ...belugaEntry }];
        }
        memoryEntry.MiMs = { Lsts: belugaLists };
      }
    }
    if (swallowedPetId === 763) {
      const sfsRaw = root?.[slotConfig.sfsKey] ?? swallowedRecord?.["sarcasticFringeheadSwallowedPet"] ?? null;
      const sfsEntry = buildBelugaSwallowedEntry(sfsRaw);
      if (sfsEntry) {
        const sfsLists = {
          SarcasticFringeheadAbility: [{ ...sfsEntry }]
        };
        memoryEntry.MiMs = { Lsts: sfsLists };
      }
    }
    entries.push({
      swallowedPetId,
      swallowedAbilityEnums,
      memoryEntry,
      belugaSwallowedEntry: memoryEntry.MiMs ?? null
    });
  }
  const swallowedCandidates = Array.isArray(root?.["abominationSwallowedPets"]) ? root?.["abominationSwallowedPets"] : [];
  for (const swallowed of swallowedCandidates) {
    const swallowedPetId = resolvePetIdFromUnknown(swallowed, maps);
    if (!Number.isFinite(swallowedPetId)) {
      continue;
    }
    const swallowedAbilityEnums = getAbilityEnumsForPet(swallowedPetId, maps);
    entries.push({
      swallowedPetId,
      swallowedAbilityEnums,
      memoryEntry: buildBelugaSwallowedEntry(swallowed) ?? { Enu: swallowedPetId },
      belugaSwallowedEntry: null
    });
  }
  return entries;
}
function inferAbominationAbilityEnumsFromSwallowedPets(rawPet, maps) {
  const entries = collectAbominationSwallowedEntries(rawPet, maps);
  const abilityEnums = [];
  for (const entry of entries) {
    if (Array.isArray(entry.swallowedAbilityEnums)) {
      abilityEnums.push(...entry.swallowedAbilityEnums);
    }
  }
  return uniqueNumbers(abilityEnums);
}
function inferAbominationAbilityEnumFromSwallowedPets(rawPet, maps) {
  const inferred = inferAbominationAbilityEnumsFromSwallowedPets(rawPet, maps);
  return inferred.length > 0 ? inferred[0] : null;
}
function getPrimaryAbilityEnumForMemory(rawPet, petId, maps) {
  const pet = getRecord(rawPet);
  const abil = Array.isArray(pet?.["Abil"]) ? pet?.["Abil"] : [];
  const abilities = Array.isArray(pet?.["abilities"]) ? pet?.["abilities"] : [];
  const directCandidates = [
    pet?.["abilityEnum"],
    pet?.["abilityId"],
    getRecord(abil[0])?.["Enu"],
    getRecord(abilities[0])?.["Enu"]
  ];
  for (const candidate of directCandidates) {
    const num = toFiniteNumber(candidate, NaN);
    if (Number.isFinite(num)) {
      return Math.trunc(num);
    }
  }
  if (petId === 373 || petId === 338) {
    const inferred = inferAbominationAbilityEnumFromSwallowedPets(rawPet, maps);
    if (Number.isFinite(inferred)) {
      return Math.trunc(inferred);
    }
  }
  const mapped = getAbilityEnumsForPet(petId, maps);
  return mapped.length > 0 ? mapped[0] : null;
}
function buildAbominationMemory(rawPet, petId, maps) {
  const swallowedEntries = collectAbominationSwallowedEntries(rawPet, maps);
  if (swallowedEntries.length === 0) {
    return null;
  }
  const fallbackAbilityEnum = getPrimaryAbilityEnumForMemory(rawPet, petId, maps);
  const fallbackList = fallbackAbilityEnum !== null ? [Math.trunc(fallbackAbilityEnum)] : [];
  const lists = {};
  for (const entry of swallowedEntries) {
    const ownEnums = uniqueNumbers(
      Array.isArray(entry.swallowedAbilityEnums) ? entry.swallowedAbilityEnums : []
    );
    const keyEnums = ownEnums.length > 0 ? ownEnums : fallbackList;
    if (keyEnums.length === 0) {
      continue;
    }
    for (const abilityEnum of keyEnums) {
      const key = String(abilityEnum);
      if (!Array.isArray(lists[key])) {
        lists[key] = [];
      }
      const useBeluga = entry.swallowedPetId === 182 && Array.isArray(entry.swallowedAbilityEnums) && entry.swallowedAbilityEnums.includes(abilityEnum) && entry.belugaSwallowedEntry;
      const payload = useBeluga ? entry.belugaSwallowedEntry : entry.memoryEntry;
      lists[key].push(payload);
    }
  }
  if (Object.keys(lists).length === 0) {
    return null;
  }
  return { Lsts: lists };
}
function findFiniteNumberByKeyPredicate(source, keyPredicate) {
  const record = getRecord(source);
  if (!record) {
    return null;
  }
  for (const [key, value] of Object.entries(record)) {
    if (!keyPredicate(key)) {
      continue;
    }
    const n = toFiniteNumber(value, NaN);
    if (Number.isFinite(n)) {
      return n;
    }
  }
  return null;
}
function getTriggersConsumedFromRawPet(rawPet) {
  const pet = getRecord(rawPet);
  const direct = [
    pet?.["triggersConsumed"],
    pet?.["TrCo"],
    pet?.["trco"],
    pet?.["triggerConsumed"]
  ];
  for (const candidate of direct) {
    const n = toFiniteNumber(candidate, NaN);
    if (Number.isFinite(n)) {
      return Math.max(0, Math.round(n));
    }
  }
  const predicate = (key) => {
    const normalized = key.toLowerCase();
    const hasTrigger = normalized.includes("trigger") || normalized.includes("trig");
    const hasConsumed = normalized.includes("consum");
    const isAbbrev = ["trgc", "trgcn", "trc", "trcn", "trco"].includes(normalized);
    return hasTrigger && hasConsumed || isAbbrev;
  };
  const objectCandidates = [pet, getRecord(pet?.["pow"]), getRecord(pet?.["Pow"])];
  for (const candidate of objectCandidates) {
    const n = findFiniteNumberByKeyPredicate(candidate, predicate);
    if (Number.isFinite(n)) {
      return Math.max(0, Math.round(n));
    }
  }
  const abilities = Array.isArray(pet?.["abilities"]) ? pet?.["abilities"] : [];
  const abil = Array.isArray(pet?.["Abil"]) ? pet?.["Abil"] : [];
  const abilityValues = [];
  for (const abilityArray of [abilities, abil]) {
    for (const ability of abilityArray) {
      const n = findFiniteNumberByKeyPredicate(ability, predicate);
      if (Number.isFinite(n)) {
        abilityValues.push(n);
      }
    }
  }
  if (abilityValues.length > 0) {
    return Math.max(0, Math.round(Math.max(...abilityValues)));
  }
  return null;
}
function getTimesHurtFromRawPet(rawPet) {
  const pet = getRecord(rawPet);
  const pow = getRecord(pet?.["Pow"]);
  const powLower = getRecord(pet?.["pow"]);
  const direct = [
    pet?.["timesHurt"],
    pet?.["TimesHurt"],
    pet?.["HrtC"],
    pet?.["hrtc"],
    pow?.["SabertoothTigerAbility"],
    powLower?.["SabertoothTigerAbility"]
  ];
  for (const candidate of direct) {
    const n = toFiniteNumber(candidate, NaN);
    if (Number.isFinite(n)) {
      return Math.max(0, Math.round(n));
    }
  }
  return null;
}
function getToyName(rawToy) {
  if (typeof rawToy === "string") {
    return rawToy;
  }
  const toy = getRecord(rawToy);
  return typeof toy?.["name"] === "string" ? toy["name"] : null;
}
function resolveToyId(rawToy, maps) {
  if (rawToy === null || rawToy === void 0) {
    return null;
  }
  const toy = getRecord(rawToy);
  if (toy) {
    const direct = [
      toy["id"],
      toy["Id"],
      toy["toyId"],
      toy["toyID"],
      toy["enum"],
      toy["Enu"]
    ];
    for (const candidate of direct) {
      const n = toFiniteNumber(candidate, NaN);
      if (Number.isFinite(n)) {
        return Math.trunc(n);
      }
    }
  }
  const toyName = getToyName(rawToy) ?? rawToy;
  const lookupKey = typeof toyName === "string" ? toyName.toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  if (!lookupKey) {
    return null;
  }
  const mapped = toIntOrNull(maps?.toyIdsByName?.[lookupKey]);
  if (mapped !== null) {
    return mapped;
  }
  const fallback = FALLBACK_TOY_IDS_BY_NAME[lookupKey];
  return Number.isFinite(fallback) ? fallback : null;
}
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
function toFiniteNumber2(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}
function toNumberOrFallback(value, fallback) {
  const parsed = toFiniteNumber2(value);
  return parsed ?? fallback;
}
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function asRecord(value) {
  return isRecord(value) ? value : null;
}
function asReplayMemoryEntry(value) {
  return isRecord(value) ? value : null;
}
function getReplayMemoryLists(value) {
  const lists = value?.MiMs?.Lsts;
  return isRecord(lists) ? lists : null;
}
function getFirstReplayMemoryEntry(value) {
  const lists = getReplayMemoryLists(value);
  if (!lists) {
    return null;
  }
  for (const entries of Object.values(lists)) {
    if (!Array.isArray(entries)) {
      continue;
    }
    for (const entry of entries) {
      const memoryEntry = asReplayMemoryEntry(entry);
      if (memoryEntry) {
        return memoryEntry;
      }
    }
  }
  return null;
}
function getReplayMemoryEntryByAbilityId(value, abilityId) {
  const key = toReplayId(abilityId);
  if (!key) {
    return null;
  }
  const entries = getReplayMemoryLists(value)?.[key];
  if (!Array.isArray(entries)) {
    return null;
  }
  for (const entry of entries) {
    const memoryEntry = asReplayMemoryEntry(entry);
    if (memoryEntry) {
      return memoryEntry;
    }
  }
  return null;
}
function resolveReplayMemoryPetName(value) {
  const rawPetRef = value?.Enu ?? value?.enu ?? value?.Id ?? value?.id;
  const resolvedPetId = resolvePetIdFromUnknown(rawPetRef, { PET_IDS_BY_NAME });
  if (resolvedPetId === null) {
    return null;
  }
  return PETS_BY_ID.get(String(resolvedPetId)) ?? `Pet #${resolvedPetId}`;
}
function resolveNestedSwallowedPetName(value) {
  const nestedEntry = getFirstReplayMemoryEntry(value);
  if (nestedEntry) {
    return resolveReplayMemoryPetName(nestedEntry);
  }
  if (Array.isArray(value?.Abil)) {
    return null;
  }
  return resolveReplayMemoryPetName(asReplayMemoryEntry(value));
}
var COPY_SOURCE_PET_IDS = /* @__PURE__ */ new Set([
  "53",
  // Parrot
  "182",
  // Beluga Whale
  "373",
  // Abomination
  "763"
  // Sarcastic Fringehead
]);
var STORED_COPY_ABILITY_OWNER_BY_ID = /* @__PURE__ */ new Map([
  ["296", "Wolf"]
]);
var ABOMINATION_SLOT_FIELDS = [
  {
    pet: "abominationSwallowedPet1",
    level: "abominationSwallowedPet1Level",
    timesHurt: "abominationSwallowedPet1TimesHurt",
    beluga: "abominationSwallowedPet1BelugaSwallowedPet",
    sarcasticFringehead: "abominationSwallowedPet1SarcasticFringeheadSwallowedPet"
  },
  {
    pet: "abominationSwallowedPet2",
    level: "abominationSwallowedPet2Level",
    timesHurt: "abominationSwallowedPet2TimesHurt",
    beluga: "abominationSwallowedPet2BelugaSwallowedPet",
    sarcasticFringehead: "abominationSwallowedPet2SarcasticFringeheadSwallowedPet"
  },
  {
    pet: "abominationSwallowedPet3",
    level: "abominationSwallowedPet3Level",
    timesHurt: "abominationSwallowedPet3TimesHurt",
    beluga: "abominationSwallowedPet3BelugaSwallowedPet",
    sarcasticFringehead: "abominationSwallowedPet3SarcasticFringeheadSwallowedPet"
  }
];
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
    petCountById = /* @__PURE__ */ new Map();
    abilityOwnerCounts.set(abilityId, petCountById);
  }
  petCountById.set(petId, (petCountById.get(petId) ?? 0) + 1);
}
function collectAbilityOwnerCounts(value, abilityOwnerCounts) {
  if (Array.isArray(value)) {
    value.forEach((entry) => collectAbilityOwnerCounts(entry, abilityOwnerCounts));
    return;
  }
  if (!isRecord(value)) {
    return;
  }
  const petId = toReplayId(value.Enu);
  const abilities = value.Abil;
  if (petId && Array.isArray(abilities) && !COPY_SOURCE_PET_IDS.has(petId)) {
    abilities.forEach((ability) => {
      if (!isRecord(ability)) {
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
    if (count > bestCount || count === bestCount && (bestPetId === null || petId < bestPetId)) {
      bestPetId = petId;
      bestCount = count;
    }
  }
  return bestPetId;
}
function buildReplayAbilityPetMapFromCounts(abilityOwnerCounts) {
  const abilityPetMap = {};
  for (const [abilityId, petCountById] of abilityOwnerCounts.entries()) {
    const petId = pickMostLikelyPetId(petCountById);
    if (petId) {
      abilityPetMap[abilityId] = petId;
    }
  }
  return abilityPetMap;
}
function parseJsonValue(raw) {
  if (isRecord(raw) || Array.isArray(raw)) {
    return raw;
  }
  if (typeof raw !== "string" || raw.length === 0) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
var replayFoodEntries = food.default ?? food;
var REPLAY_PERK_FOOD_NAMES_BY_SPELL_ID = new Map(
  replayFoodEntries.filter(
    (entry) => entry?.Id !== null && entry?.Id !== void 0 && typeof entry?.Name === "string" && /^Give one pet the .+ perk\.$/i.test(entry?.Ability ?? "")
  ).map((entry) => [String(entry.Id), entry.Name])
);
function getReplayEntityKey(value) {
  const record = asRecord(value);
  if (!record) {
    return null;
  }
  const boardId = record["BoId"] ?? record["boId"];
  const uniqueId = record["Uni"] ?? record["uni"];
  if (boardId === null || boardId === void 0 || uniqueId === null || uniqueId === void 0) {
    return null;
  }
  return `${String(boardId)}:${String(uniqueId)}`;
}
function buildReplayPetIdByEntityKey(battleJson) {
  const petIdByEntityKey = /* @__PURE__ */ new Map();
  for (const board of [battleJson.UserBoard, battleJson.OpponentBoard]) {
    const items = board?.Mins?.Items ?? [];
    for (const pet of items) {
      if (!pet) {
        continue;
      }
      const petId = toReplayId(pet.Enu);
      const entityKey = getReplayEntityKey(pet["Id"]);
      if (petId && entityKey) {
        petIdByEntityKey.set(entityKey, petId);
      }
    }
  }
  return petIdByEntityKey;
}
function getReplaySpellPerkTarget(action) {
  if (action.Type !== 8) {
    return null;
  }
  const response = asRecord(parseJsonValue(action.Response));
  const responseEvent = asRecord(response?.["Event"]);
  const event = asRecord(responseEvent?.["Event"]) ?? responseEvent;
  const spell = asRecord(event?.["Spell"]);
  const target = asRecord(event?.["Target"]);
  const spellId = toReplayId(spell?.["Enu"]);
  const perkName = spellId ? REPLAY_PERK_FOOD_NAMES_BY_SPELL_ID.get(spellId) : void 0;
  const targetKey = getReplayEntityKey(target);
  return perkName && targetKey ? { perkName, targetKey } : null;
}
function parseBattleAction(raw) {
  const parsed = parseJsonValue(raw);
  if (!isRecord(parsed)) {
    return null;
  }
  return parsed;
}
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
function resolvePackIdFromUnknown(value) {
  const numeric = toFiniteNumber2(value);
  if (numeric !== null) {
    return numeric;
  }
  if (typeof value === "string") {
    const byName = PACK_ID_BY_NAME.get(value.toLowerCase());
    if (byName !== void 0) {
      return byName;
    }
  }
  return null;
}
function parseTurnPetToReplayPet(rawPet) {
  if (!rawPet) {
    return null;
  }
  const petId = toReplayId(rawPet.id);
  if (!petId) {
    return null;
  }
  const slot = toFiniteNumber2(rawPet.slot);
  const abilities = (rawPet.abilities ?? []).map((ability) => {
    const abilityId = toReplayId(ability?.id);
    if (!abilityId) {
      return null;
    }
    return {
      Enu: abilityId,
      Lvl: toFiniteNumber2(ability?.level),
      Grop: toFiniteNumber2(ability?.group),
      TrCo: toFiniteNumber2(ability?.triggersConsumed)
    };
  }).filter((ability) => ability !== null);
  return {
    Enu: petId,
    Lvl: toFiniteNumber2(rawPet.level),
    Exp: toFiniteNumber2(rawPet.experience),
    Perk: toReplayId(rawPet.perkId),
    Mana: toFiniteNumber2(rawPet.mana),
    At: {
      Perm: toFiniteNumber2(rawPet.attack?.permanent),
      Temp: toFiniteNumber2(rawPet.attack?.temporary)
    },
    Hp: {
      Perm: toFiniteNumber2(rawPet.health?.permanent),
      Temp: toFiniteNumber2(rawPet.health?.temporary)
    },
    Poi: {
      x: slot
    },
    Abil: abilities
  };
}
function parseTurnSideToReplayBoard(side, fallbackTurn, packRaw) {
  return {
    Tur: toNumberOrFallback(side?.stats?.turn, fallbackTurn),
    GoSp: toNumberOrFallback(side?.stats?.goldSpent, 0),
    Rold: toNumberOrFallback(side?.stats?.rolls, 0),
    MiSu: toNumberOrFallback(side?.stats?.summons, 0),
    MSFL: toNumberOrFallback(side?.stats?.level3Sold, 0),
    TrTT: toNumberOrFallback(side?.stats?.transformed, 0),
    Pack: resolvePackIdFromUnknown(packRaw),
    Mins: {
      Items: (side?.pets ?? []).map((pet) => parseTurnPetToReplayPet(pet))
    }
  };
}
function selectReplayBattleFromTurns(turns, turnNumber, replayMeta) {
  if (!Number.isFinite(turnNumber) || turnNumber <= 0) {
    return null;
  }
  const turnEntry = (turns ?? []).find((entry) => Number(entry?.turn) === turnNumber) ?? (turns ?? [])[turnNumber - 1] ?? null;
  if (!turnEntry) {
    return null;
  }
  const fallbackTurn = toNumberOrFallback(turnEntry.turn, turnNumber);
  return {
    UserBoard: parseTurnSideToReplayBoard(
      turnEntry.user,
      fallbackTurn,
      replayMeta?.pack
    ),
    OpponentBoard: parseTurnSideToReplayBoard(
      turnEntry.opponent,
      fallbackTurn,
      replayMeta?.opponent_pack
    )
  };
}
function selectReplayBattleFromActions(actions, turnNumber) {
  if (!Number.isFinite(turnNumber) || turnNumber <= 0) {
    return null;
  }
  const battleActions = (actions ?? []).filter(
    (action) => Boolean(action?.Battle) && (action?.Type === 0 || action?.Type === null || action?.Type === void 0)
  );
  const actionForTurn = battleActions.find((action) => Number(action?.Turn) === turnNumber) ?? battleActions[turnNumber - 1] ?? null;
  return parseBattleAction(actionForTurn?.Battle ?? null);
}
function buildReplayAbilityPetMapFromActions(actions) {
  const abilityOwnerCounts = /* @__PURE__ */ new Map();
  (actions ?? []).forEach((action) => {
    const parsedBuild = parseJsonValue(action?.Build);
    const parsedBattle = parseJsonValue(action?.Battle);
    const parsedMode = parseJsonValue(action?.Mode);
    collectAbilityOwnerCounts(parsedBuild, abilityOwnerCounts);
    collectAbilityOwnerCounts(parsedBattle, abilityOwnerCounts);
    collectAbilityOwnerCounts(parsedMode, abilityOwnerCounts);
  });
  return buildReplayAbilityPetMapFromCounts(abilityOwnerCounts);
}
function buildReplayPerkNameByPetIdFromActions(actions, turnNumber) {
  const battleJson = selectReplayBattleFromActions(actions, turnNumber);
  if (!battleJson) {
    return {};
  }
  const petIdByEntityKey = buildReplayPetIdByEntityKey(battleJson);
  const perkNameByPetId = {};
  (actions ?? []).forEach((action) => {
    const actionTurn = toFiniteNumber2(action.Turn);
    if (actionTurn !== null && actionTurn > turnNumber) {
      return;
    }
    const spellPerkTarget = getReplaySpellPerkTarget(action);
    if (!spellPerkTarget) {
      return;
    }
    const petId = petIdByEntityKey.get(spellPerkTarget.targetKey);
    if (petId) {
      perkNameByPetId[petId] = spellPerkTarget.perkName;
    }
  });
  return perkNameByPetId;
}
function parseReplayForCalculatorFromActions(actions, turnNumber, buildModel, metaBoards, options) {
  const battleJson = selectReplayBattleFromActions(actions, turnNumber);
  if (!battleJson) {
    return null;
  }
  const inferredAbilityPetMap = buildReplayAbilityPetMapFromActions(actions);
  const mergedAbilityPetMap = {
    ...inferredAbilityPetMap,
    ...options?.abilityPetMap ?? {}
  };
  const inferredPerkNameByPetId = buildReplayPerkNameByPetIdFromActions(
    actions,
    turnNumber
  );
  const mergedPerkNameByPetId = {
    ...inferredPerkNameByPetId,
    ...options?.perkNameByPetId ?? {}
  };
  const parser = new ReplayCalcParser();
  return parser.parseReplayForCalculator(
    battleJson,
    buildModel ?? void 0,
    metaBoards,
    {
      ...options,
      abilityPetMap: mergedAbilityPetMap,
      perkNameByPetId: mergedPerkNameByPetId
    }
  );
}
function parseTeamwoodReplayForCalculator(replay, turnNumber, metaBoards, options) {
  const replayRecord = asRecord(replay);
  const hasTurnPayload = Array.isArray(replayRecord?.["turns"]);
  if (hasTurnPayload) {
    const turnsReplay = replay;
    const battleJson = selectReplayBattleFromTurns(
      turnsReplay.turns,
      turnNumber,
      turnsReplay.replayMeta
    );
    if (!battleJson) {
      return null;
    }
    const mergedAbilityPetMap = {
      ...turnsReplay.abilityPetMap ?? {},
      ...options?.abilityPetMap ?? {}
    };
    const parser = new ReplayCalcParser();
    return parser.parseReplayForCalculator(
      battleJson,
      turnsReplay.genesisBuildModel ?? void 0,
      metaBoards,
      {
        ...options,
        abilityPetMap: mergedAbilityPetMap
      }
    );
  }
  return parseReplayForCalculatorFromActions(
    replay?.Actions,
    turnNumber,
    replay?.GenesisBuildModel ?? void 0,
    metaBoards,
    options
  );
}
function defaultAbominationSwallowedState() {
  return {
    abominationSwallowedPet1: null,
    abominationSwallowedPet2: null,
    abominationSwallowedPet3: null,
    abominationSwallowedPet1BelugaSwallowedPet: null,
    abominationSwallowedPet2BelugaSwallowedPet: null,
    abominationSwallowedPet3BelugaSwallowedPet: null,
    abominationSwallowedPet1SarcasticFringeheadSwallowedPet: null,
    abominationSwallowedPet2SarcasticFringeheadSwallowedPet: null,
    abominationSwallowedPet3SarcasticFringeheadSwallowedPet: null,
    abominationSwallowedPet1TimesHurt: 0,
    abominationSwallowedPet2TimesHurt: 0,
    abominationSwallowedPet3TimesHurt: 0,
    abominationSwallowedPet1Level: 1,
    abominationSwallowedPet2Level: 1,
    abominationSwallowedPet3Level: 1
  };
}
var ReplayCalcParser = class {
  parseReplayForCalculator(battleJson, buildModel, metaBoards, options) {
    console.log(`[ReplayCalcParser] PETS_BY_ID size: ${PETS_BY_ID.size}`);
    const userBoard = battleJson?.UserBoard ?? metaBoards?.userBoard;
    const opponentBoard = battleJson?.OpponentBoard ?? metaBoards?.opponentBoard;
    const readBoardNumber = (board, key, fallback) => {
      return toNumberOrFallback(board?.[key], fallback);
    };
    const abilityPetNameByAbilityId = /* @__PURE__ */ new Map();
    const abilityPetIdByAbilityId = /* @__PURE__ */ new Map();
    const applyAbilityPetMap = (abilityPetMap) => {
      if (!abilityPetMap) {
        return;
      }
      Object.entries(abilityPetMap).forEach(([abilityIdRaw, petIdOrName]) => {
        const abilityId = toReplayId(abilityIdRaw);
        if (!abilityId) {
          return;
        }
        let mappedPetId = typeof petIdOrName === "number" || typeof petIdOrName === "string" ? String(petIdOrName) : null;
        if (mappedPetId && !PETS_BY_ID.has(mappedPetId)) {
          const asNum = Number(mappedPetId);
          if (Number.isInteger(asNum)) {
            const fallbackNum = asNum - 30;
            if (Number.isInteger(fallbackNum) && fallbackNum > 0) {
              const fallbackId = String(fallbackNum);
              if (PETS_BY_ID.has(fallbackId)) {
                mappedPetId = fallbackId;
              }
            }
          }
        }
        const mappedPetName = (mappedPetId ? PETS_BY_ID.get(mappedPetId) : null) || (typeof petIdOrName === "string" ? petIdOrName : null);
        if (mappedPetName) {
          abilityPetNameByAbilityId.set(abilityId, mappedPetName);
        }
        if (mappedPetId && PETS_BY_ID.has(mappedPetId)) {
          abilityPetIdByAbilityId.set(abilityId, mappedPetId);
        }
      });
    };
    const inferredAbilityOwnerCounts = /* @__PURE__ */ new Map();
    collectAbilityOwnerCounts(battleJson, inferredAbilityOwnerCounts);
    collectAbilityOwnerCounts(buildModel, inferredAbilityOwnerCounts);
    collectAbilityOwnerCounts(metaBoards, inferredAbilityOwnerCounts);
    applyAbilityPetMap(
      buildReplayAbilityPetMapFromCounts(inferredAbilityOwnerCounts)
    );
    applyAbilityPetMap(options?.abilityPetMap ?? null);
    const resolveAbilityOwnerPetNameByNearbyMap = (abilityId) => {
      const parsedAbilityId = Number(abilityId);
      if (!Number.isInteger(parsedAbilityId)) {
        return null;
      }
      const offsetCounts = /* @__PURE__ */ new Map();
      for (const [mappedAbilityId, mappedPetId] of abilityPetIdByAbilityId.entries()) {
        const parsedMappedAbilityId = Number(mappedAbilityId);
        const parsedMappedPetId = Number(mappedPetId);
        if (!Number.isInteger(parsedMappedAbilityId) || !Number.isInteger(parsedMappedPetId)) {
          continue;
        }
        const distance = Math.abs(parsedMappedAbilityId - parsedAbilityId);
        if (distance === 0 || distance > 2) {
          continue;
        }
        const offset = parsedMappedAbilityId - parsedMappedPetId;
        offsetCounts.set(offset, (offsetCounts.get(offset) ?? 0) + 1);
      }
      let bestOffset = null;
      let bestOffsetCount = 0;
      for (const [offset, count] of offsetCounts.entries()) {
        if (count > bestOffsetCount || count === bestOffsetCount && (bestOffset === null || Math.abs(offset) < Math.abs(bestOffset))) {
          bestOffset = offset;
          bestOffsetCount = count;
        }
      }
      if (bestOffset === null) {
        return null;
      }
      const inferredPetId = String(parsedAbilityId - bestOffset);
      return PETS_BY_ID.get(inferredPetId) ?? null;
    };
    const resolveAbilityOwnerPetName = (abilityId) => {
      return abilityPetNameByAbilityId.get(abilityId) ?? resolveAbilityOwnerPetNameByNearbyMap(abilityId);
    };
    const getTimesHurt = (petJson) => {
      return getTimesHurtFromRawPet(petJson);
    };
    const inferCopiedPetName = (petJson, copyPetName) => {
      for (const ability of petJson.Abil ?? []) {
        const abilityId = toReplayId(ability?.Enu);
        const storedCopyOwner = abilityId ? STORED_COPY_ABILITY_OWNER_BY_ID.get(abilityId) : null;
        if (storedCopyOwner) {
          return storedCopyOwner;
        }
      }
      for (const ability of petJson.Abil ?? []) {
        const abilityId = toReplayId(ability?.Enu);
        if (!abilityId) {
          continue;
        }
        let ownerPetName = resolveAbilityOwnerPetName(abilityId);
        if (ownerPetName === copyPetName) {
          ownerPetName = resolveAbilityOwnerPetNameByNearbyMap(abilityId);
        }
        if (ownerPetName && ownerPetName !== copyPetName) {
          return ownerPetName;
        }
      }
      return null;
    };
    const parseAbominationSwallowedState = (petJson) => {
      const abominationState = defaultAbominationSwallowedState();
      const applyNestedMemoryState = (slotFields, ownerPetName, ability) => {
        const memoryEntry = getReplayMemoryEntryByAbilityId(petJson, ability.Enu);
        const nestedTimesHurt = getTimesHurtFromRawPet(memoryEntry);
        if (nestedTimesHurt !== null) {
          abominationState[slotFields.timesHurt] = nestedTimesHurt;
        }
        const nestedSwallowedPet = resolveNestedSwallowedPetName(memoryEntry);
        if (!nestedSwallowedPet) {
          return;
        }
        if (ownerPetName === "Beluga Whale") {
          abominationState[slotFields.beluga] = nestedSwallowedPet;
          return;
        }
        if (ownerPetName === "Sarcastic Fringehead") {
          abominationState[slotFields.sarcasticFringehead] = nestedSwallowedPet;
        }
      };
      const copiedAbilities = (petJson?.Abil ?? []).map((ability, index) => ({ ability, index })).filter(
        (abilityEntry) => abilityEntry.ability !== null && toReplayId(abilityEntry.ability?.Enu) !== null
      );
      if (copiedAbilities.length === 0) {
        return abominationState;
      }
      const groupedAbilities = /* @__PURE__ */ new Map();
      const orderedGroupKeys = [];
      copiedAbilities.forEach((abilityEntry) => {
        const groupKey = toFiniteNumber2(abilityEntry.ability?.Grop) ?? 0;
        if (!groupedAbilities.has(groupKey)) {
          groupedAbilities.set(groupKey, []);
          orderedGroupKeys.push(groupKey);
        }
        groupedAbilities.get(groupKey)?.push(abilityEntry);
      });
      const usedAbilityIndexes = /* @__PURE__ */ new Set();
      const unresolvedSlotIndexes = [];
      ABOMINATION_SLOT_FIELDS.forEach((slotFields, slotIndex) => {
        const groupKey = orderedGroupKeys[slotIndex];
        if (groupKey === void 0) {
          unresolvedSlotIndexes.push(slotIndex);
          return;
        }
        const groupAbilities = groupedAbilities.get(groupKey);
        if (!groupAbilities || groupAbilities.length === 0) {
          unresolvedSlotIndexes.push(slotIndex);
          return;
        }
        let resolvedAbilityEntry = null;
        let resolvedPetName = null;
        for (const abilityEntry of groupAbilities) {
          const abilityId = toReplayId(abilityEntry.ability?.Enu);
          if (!abilityId) {
            continue;
          }
          const ownerPetName = resolveAbilityOwnerPetName(abilityId);
          if (!ownerPetName) {
            continue;
          }
          resolvedAbilityEntry = abilityEntry;
          resolvedPetName = ownerPetName;
          break;
        }
        if (!resolvedAbilityEntry || !resolvedPetName) {
          unresolvedSlotIndexes.push(slotIndex);
          return;
        }
        abominationState[slotFields.pet] = resolvedPetName;
        const inferredLevel = toFiniteNumber2(resolvedAbilityEntry.ability?.Lvl);
        if (inferredLevel !== null) {
          abominationState[slotFields.level] = inferredLevel;
        }
        applyNestedMemoryState(
          slotFields,
          resolvedPetName,
          resolvedAbilityEntry.ability
        );
        usedAbilityIndexes.add(resolvedAbilityEntry.index);
      });
      if (unresolvedSlotIndexes.length === 0) {
        return abominationState;
      }
      const fallbackResolvedAbilities = copiedAbilities.filter((abilityEntry) => !usedAbilityIndexes.has(abilityEntry.index)).map((abilityEntry) => {
        const abilityId = toReplayId(abilityEntry.ability?.Enu);
        if (!abilityId) {
          return null;
        }
        const ownerPetName = resolveAbilityOwnerPetName(abilityId);
        if (!ownerPetName) {
          return null;
        }
        return {
          ownerPetName,
          level: toFiniteNumber2(abilityEntry.ability?.Lvl),
          ability: abilityEntry.ability
        };
      }).filter(
        (abilityEntry) => abilityEntry !== null
      );
      unresolvedSlotIndexes.forEach((slotIndex, fallbackIndex) => {
        const fallbackAbility = fallbackResolvedAbilities[fallbackIndex];
        if (!fallbackAbility) {
          return;
        }
        const slotFields = ABOMINATION_SLOT_FIELDS[slotIndex];
        abominationState[slotFields.pet] = fallbackAbility.ownerPetName;
        if (fallbackAbility.level !== null) {
          abominationState[slotFields.level] = fallbackAbility.level;
        }
        applyNestedMemoryState(
          slotFields,
          fallbackAbility.ownerPetName,
          fallbackAbility.ability
        );
      });
      return abominationState;
    };
    const parsePet = (petJson) => {
      if (!petJson) {
        return null;
      }
      const petRecord = asRecord(petJson);
      const maps = { PET_IDS_BY_NAME };
      const rawPetRef = petJson.Enu ?? petRecord?.["enu"] ?? petRecord?.["Id"] ?? petRecord?.["id"];
      const resolvedPetId = resolvePetIdFromUnknown(rawPetRef, maps);
      const petId = resolvedPetId !== null ? String(resolvedPetId) : String(rawPetRef ?? 0);
      const petName = PETS_BY_ID.get(petId) || (typeof petRecord?.["name"] === "string" ? petRecord["name"] : null) || (typeof petRecord?.["Name"] === "string" ? petRecord["Name"] : null) || (typeof rawPetRef === "string" && rawPetRef.trim().length > 0 ? rawPetRef.trim() : `Pet #${petId}`);
      console.log(`[ReplayCalcParser] Pet Enu:${rawPetRef} -> Id:${petId} -> Name:${petName}`);
      const atJson = petJson.At ?? asRecord(petRecord?.["at"]);
      const hpJson = petJson.Hp ?? asRecord(petRecord?.["hp"]);
      const atJsonRecord = asRecord(atJson);
      const hpJsonRecord = asRecord(hpJson);
      const petTempAtk = toNumberOrFallback(
        atJson?.Temp ?? atJsonRecord?.["temp"],
        0
      );
      const petTempHp = toNumberOrFallback(
        hpJson?.Temp ?? hpJsonRecord?.["temp"],
        0
      );
      const belugaSwallowedPet = petId === "182" ? resolveNestedSwallowedPetName(petJson) ?? inferCopiedPetName(petJson, "Beluga Whale") : null;
      const sarcasticFringeheadSwallowedPet = petId === "763" ? resolveNestedSwallowedPetName(petJson) ?? inferCopiedPetName(petJson, "Sarcastic Fringehead") : null;
      const abominationSwallowedState = petId === "373" ? parseAbominationSwallowedState(petJson) : defaultAbominationSwallowedState();
      const abilityIdsByPetId = {};
      for (const [abilityId, mappedPetId] of abilityPetIdByAbilityId.entries()) {
        const pid = String(mappedPetId);
        abilityIdsByPetId[pid] = abilityIdsByPetId[pid] || [];
        abilityIdsByPetId[pid].push(String(abilityId));
      }
      maps.abilityIdsByPetId = abilityIdsByPetId;
      const timesHurt = getTimesHurt(petJson);
      const abilityTriggersConsumed = (() => {
        const v = getTriggersConsumedFromRawPet(petJson);
        return v === null ? [] : [v];
      })();
      const perkValue = petJson.Perk;
      const replayPerkName = petId !== null ? options?.perkNameByPetId?.[String(petId)] ?? null : null;
      const perkName = replayPerkName ?? (perkValue !== null && perkValue !== void 0 ? PERKS_BY_ID.get(String(perkValue)) || (typeof perkValue === "string" ? perkValue : "Unknown Perk") : null);
      const parsedPet = {
        name: petName,
        attack: toNumberOrFallback(
          atJson?.Perm ?? atJsonRecord?.["perm"] ?? petRecord?.["attack"],
          0
        ) + petTempAtk,
        health: toNumberOrFallback(
          hpJson?.Perm ?? hpJsonRecord?.["perm"] ?? petRecord?.["health"],
          0
        ) + petTempHp,
        exp: (() => {
          const exp = toFiniteNumber2(petJson.Exp);
          if (exp !== null && exp > 0) {
            return exp;
          }
          const lvl = toFiniteNumber2(petJson.Lvl);
          if (lvl === 2) {
            return 2;
          }
          if (lvl === 3) {
            return 5;
          }
          return exp ?? 0;
        })(),
        equipment: perkName ? { name: perkName } : null,
        mana: toNumberOrFallback(petJson.Mana, 0),
        belugaSwallowedPet,
        sarcasticFringeheadSwallowedPet,
        ...abominationSwallowedState,
        battlesFought: 0,
        triggersConsumed: abilityTriggersConsumed.length > 0 ? Math.max(...abilityTriggersConsumed) : 0
      };
      if (String(petId) === "373") {
        try {
          const mem = buildAbominationMemory(petJson, Number(petId), maps);
          if (mem) {
            const abominationPet = parsedPet;
            abominationPet.abominationMemory = mem;
            const inferredEnums = inferAbominationAbilityEnumsFromSwallowedPets(
              petJson,
              maps
            );
            if (Array.isArray(inferredEnums) && inferredEnums.length > 0) {
              abominationPet.abominationInferredAbilityEnums = inferredEnums;
            }
          }
        } catch (error) {
          void error;
        }
      }
      if (timesHurt !== null) {
        parsedPet.timesHurt = timesHurt;
      }
      return parsedPet;
    };
    const parseBoardPets = (boardJson) => {
      const items = boardJson?.Mins?.Items ?? [];
      const petArray = Array(5).fill(null);
      items.forEach((pet, index) => {
        if (!pet) {
          return;
        }
        let pos = toNumberOrFallback(pet.Poi?.x, -1);
        if (pos === -1) {
          pos = index;
        }
        if (pos >= 0 && pos < 5) {
          petArray[pos] = parsePet(pet);
        }
      });
      return petArray.reverse();
    };
    const getToy = (boardJson) => {
      const toyItem = (boardJson?.Rel?.Items ?? []).find((item) => Boolean(item));
      if (toyItem) {
        const toyRecord = asRecord(toyItem);
        const toyId = resolveToyId(toyItem) ?? null;
        const toyName = toyId ? TOYS_BY_ID.get(String(toyId)) : getToyName(toyItem);
        return {
          name: toyName || null,
          level: toNumberOrFallback(toyRecord?.["Lvl"], 1)
        };
      }
      return { name: null, level: 1 };
    };
    const playerToy = getToy(userBoard);
    const opponentToy = getToy(opponentBoard);
    const customPacks = this.buildCustomPacksFromGenesis(buildModel, battleJson);
    const playerDeck = userBoard?.Deck ?? buildModel?.Bor?.Deck;
    const playerCustomPack = this.findCustomPackFromDeck(
      customPacks,
      playerDeck
    );
    const opponentCustomPack = this.findCustomPackFromDeck(
      customPacks,
      opponentBoard?.Deck
    );
    const playerPackId = resolvePackIdFromUnknown(userBoard?.Pack);
    const opponentPackId = resolvePackIdFromUnknown(opponentBoard?.Pack);
    const playerPackName = playerCustomPack?.name || (playerPackId !== null ? PACK_MAP[playerPackId] : null) || "Turtle";
    const opponentPackName = opponentCustomPack?.name || (opponentPackId !== null ? PACK_MAP[opponentPackId] : null) || "Turtle";
    return {
      playerPack: playerPackName,
      opponentPack: opponentPackName,
      playerToy: playerToy.name,
      playerToyLevel: String(playerToy.level),
      playerHardToy: null,
      playerHardToyLevel: 1,
      opponentToy: opponentToy.name,
      opponentToyLevel: String(opponentToy.level),
      opponentHardToy: null,
      opponentHardToyLevel: 1,
      turn: readBoardNumber(userBoard, "Tur", 1) || 1,
      playerGoldSpent: readBoardNumber(userBoard, "GoSp", 0) || 0,
      opponentGoldSpent: readBoardNumber(opponentBoard, "GoSp", 0) || 0,
      playerRollAmount: readBoardNumber(userBoard, "Rold", 0) || 0,
      opponentRollAmount: readBoardNumber(opponentBoard, "Rold", 0) || 0,
      playerSummonedAmount: readBoardNumber(userBoard, "MiSu", 0) || 0,
      opponentSummonedAmount: readBoardNumber(opponentBoard, "MiSu", 0) || 0,
      playerLevel3Sold: readBoardNumber(userBoard, "MSFL", 0) || 0,
      opponentLevel3Sold: readBoardNumber(opponentBoard, "MSFL", 0) || 0,
      playerTransformationAmount: readBoardNumber(userBoard, "TrTT", 0) || 0,
      opponentTransformationAmount: readBoardNumber(opponentBoard, "TrTT", 0) || 0,
      playerPets: parseBoardPets(userBoard),
      opponentPets: parseBoardPets(opponentBoard),
      allPets: false,
      logFilter: null,
      customPacks,
      oldStork: false,
      tokenPets: false,
      komodoShuffle: false,
      mana: true,
      seed: null,
      triggersConsumed: true,
      showAdvanced: true,
      showTriggerNamesInLogs: false,
      showPositionalArgsInLogs: true,
      ailmentEquipment: false
    };
  }
  buildCustomPacksFromGenesis(buildModel, battleJson) {
    const decks = [
      buildModel?.Bor?.Deck,
      battleJson?.UserBoard?.Deck,
      battleJson?.OpponentBoard?.Deck
    ].filter(
      (deck) => deck !== null && deck !== void 0 && Array.isArray(deck.Minions)
    );
    const packs = [];
    const seenDeckIds = /* @__PURE__ */ new Set();
    const usedNames = /* @__PURE__ */ new Set();
    for (const deck of decks) {
      const deckId = deck?.Id != null ? String(deck.Id) : null;
      if (deckId && seenDeckIds.has(deckId)) {
        continue;
      }
      if (deckId) {
        seenDeckIds.add(deckId);
      }
      const pack = this.buildCustomPackFromDeck(deck, usedNames);
      if (pack) {
        packs.push({ ...pack, deckId });
      }
    }
    return packs;
  }
  generateCalculatorLink(calculatorState) {
    const baseUrl = window.location.origin + window.location.pathname;
    const strippedState = this.stripDefaultValues(calculatorState);
    const truncatedState = this.truncateKeys(strippedState);
    const stateString = JSON.stringify(truncatedState);
    const base64Data = encodeBase64Url(stateString);
    return `${baseUrl}#c=${base64Data}`;
  }
  buildCustomPackFromDeck(deck, usedNames) {
    if (!deck || !Array.isArray(deck.Minions)) {
      return null;
    }
    const minions = deck.Minions.map((id) => String(id));
    const spells = Array.isArray(deck.Spells) ? [...deck.Spells] : [];
    const tierPets = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: []
    };
    for (const minionId of minions) {
      const petMeta = PETS_META_BY_ID.get(minionId);
      if (!petMeta) {
        continue;
      }
      if (tierPets[petMeta.tier]) {
        tierPets[petMeta.tier].push(petMeta.name);
      }
    }
    const normalizeTierPets = (pets2) => {
      const normalized = pets2.slice(0, 10);
      while (normalized.length < 10) {
        normalized.push(null);
      }
      return normalized;
    };
    let deckName = deck.Title || "Custom Pack";
    if (usedNames.has(deckName)) {
      let suffix = 2;
      while (usedNames.has(`${deckName} (${suffix})`)) {
        suffix += 1;
      }
      deckName = `${deckName} (${suffix})`;
    }
    usedNames.add(deckName);
    return {
      name: deckName,
      tier1Pets: normalizeTierPets(tierPets[1]),
      tier2Pets: normalizeTierPets(tierPets[2]),
      tier3Pets: normalizeTierPets(tierPets[3]),
      tier4Pets: normalizeTierPets(tierPets[4]),
      tier5Pets: normalizeTierPets(tierPets[5]),
      tier6Pets: normalizeTierPets(tierPets[6]),
      spells
    };
  }
  findCustomPackFromDeck(customPacks, deck) {
    if (!deck) {
      return null;
    }
    const deckId = deck?.Id != null ? String(deck.Id) : null;
    if (deckId) {
      const byId = customPacks.find((pack) => pack.deckId === deckId);
      if (byId) {
        return byId;
      }
    }
    const deckContents = this.buildCustomPackFromDeck(deck, /* @__PURE__ */ new Set());
    if (deckContents) {
      const byContents = customPacks.find(
        (pack) => this.customPackContentsMatch(pack, deckContents)
      );
      if (byContents) {
        return byContents;
      }
    }
    const deckName = deck?.Title;
    if (deckName) {
      return customPacks.find((pack) => pack.name === deckName) || null;
    }
    return null;
  }
  customPackContentsMatch(pack, deckContents) {
    const tierKeys = [
      "tier1Pets",
      "tier2Pets",
      "tier3Pets",
      "tier4Pets",
      "tier5Pets",
      "tier6Pets"
    ];
    return tierKeys.every(
      (tierKey) => this.stringArraysMatch(pack[tierKey], deckContents[tierKey])
    ) && this.customPackItemsMatch(pack.spells, deckContents.spells);
  }
  customPackItemsMatch(left, right) {
    return left.length === right.length && left.every((value, index) => value === right[index]);
  }
  stringArraysMatch(left, right) {
    return left.length === right.length && left.every((value, index) => value === right[index]);
  }
  stripDefaultValues(state) {
    const strippedState = {};
    if (state.playerPack !== "Turtle") {
      strippedState.playerPack = state.playerPack;
    }
    if (state.opponentPack !== "Turtle") {
      strippedState.opponentPack = state.opponentPack;
    }
    if (state.playerToy) {
      strippedState.playerToy = state.playerToy;
    }
    if (state.playerToyLevel && state.playerToyLevel !== "1") {
      strippedState.playerToyLevel = state.playerToyLevel;
    }
    if (state.opponentToy) {
      strippedState.opponentToy = state.opponentToy;
    }
    if (state.opponentToyLevel && state.opponentToyLevel !== "1") {
      strippedState.opponentToyLevel = state.opponentToyLevel;
    }
    if (state.turn !== 11) {
      strippedState.turn = state.turn;
    }
    if (state.playerGoldSpent !== 10) {
      strippedState.playerGoldSpent = state.playerGoldSpent;
    }
    if (state.opponentGoldSpent !== 10) {
      strippedState.opponentGoldSpent = state.opponentGoldSpent;
    }
    if (state.playerRollAmount !== 4) {
      strippedState.playerRollAmount = state.playerRollAmount;
    }
    if (state.opponentRollAmount !== 4) {
      strippedState.opponentRollAmount = state.opponentRollAmount;
    }
    if (state.playerSummonedAmount !== 0) {
      strippedState.playerSummonedAmount = state.playerSummonedAmount;
    }
    if (state.opponentSummonedAmount !== 0) {
      strippedState.opponentSummonedAmount = state.opponentSummonedAmount;
    }
    if (state.playerLevel3Sold !== 0) {
      strippedState.playerLevel3Sold = state.playerLevel3Sold;
    }
    if (state.opponentLevel3Sold !== 0) {
      strippedState.opponentLevel3Sold = state.opponentLevel3Sold;
    }
    if (state.playerTransformationAmount !== 0) {
      strippedState.playerTransformationAmount = state.playerTransformationAmount;
    }
    if (state.opponentTransformationAmount !== 0) {
      strippedState.opponentTransformationAmount = state.opponentTransformationAmount;
    }
    if (state.allPets) {
      strippedState.allPets = true;
    }
    if (state.oldStork) {
      strippedState.oldStork = true;
    }
    if (state.tokenPets) {
      strippedState.tokenPets = true;
    }
    if (state.komodoShuffle) {
      strippedState.komodoShuffle = true;
    }
    if (state.mana) {
      strippedState.mana = true;
    }
    if (state.seed != null) {
      strippedState.seed = state.seed;
    }
    if (state.triggersConsumed) {
      strippedState.triggersConsumed = true;
    }
    if (state.foodsEaten) {
      strippedState.foodsEaten = true;
    }
    if (state.showAdvanced) {
      strippedState.showAdvanced = true;
    }
    if (state.showTriggerNamesInLogs) {
      strippedState.showTriggerNamesInLogs = true;
    }
    if (state.showPositionalArgsInLogs === false) {
      strippedState.showPositionalArgsInLogs = false;
    }
    if (state.ailmentEquipment) {
      strippedState.ailmentEquipment = true;
    }
    if (state.logFilter) {
      strippedState.logFilter = state.logFilter;
    }
    if (state.customPacks.length > 0) {
      strippedState.customPacks = state.customPacks;
    }
    const stripPetDefaults = (pet) => {
      if (!pet || !pet.name) {
        return null;
      }
      const newPet = { name: pet.name };
      if (typeof pet.attack === "number" && pet.attack !== 0) {
        newPet.attack = pet.attack;
      }
      if (typeof pet.health === "number" && pet.health !== 0) {
        newPet.health = pet.health;
      }
      if (typeof pet.exp === "number" && pet.exp !== 0) {
        newPet.exp = pet.exp;
      }
      if (typeof pet.mana === "number" && pet.mana !== 0) {
        newPet.mana = pet.mana;
      }
      if (pet.equipment) {
        newPet.equipment = pet.equipment;
      }
      if (pet.triggersConsumed) {
        newPet.triggersConsumed = pet.triggersConsumed;
      }
      if (pet.foodsEaten) {
        newPet.foodsEaten = pet.foodsEaten;
      }
      if (pet.ailmentsCount) {
        newPet.ailmentsCount = pet.ailmentsCount;
      }
      if (pet.friendsHurtBeforeBattle) {
        newPet.friendsHurtBeforeBattle = pet.friendsHurtBeforeBattle;
      }
      if (pet.belugaSwallowedPet != null) {
        newPet.belugaSwallowedPet = pet.belugaSwallowedPet;
      }
      ABOMINATION_SLOT_FIELDS.forEach((slotFields) => {
        const swallowedPet = pet[slotFields.pet];
        if (swallowedPet != null) {
          newPet[slotFields.pet] = swallowedPet;
        }
        const swallowedLevel = pet[slotFields.level];
        if (typeof swallowedLevel === "number" && swallowedLevel !== 1) {
          newPet[slotFields.level] = swallowedLevel;
        }
      });
      if (pet.timesHurt) {
        newPet.timesHurt = pet.timesHurt;
      }
      return newPet;
    };
    const strippedPlayerPets = state.playerPets.map(stripPetDefaults);
    if (strippedPlayerPets.some((pet) => pet !== null)) {
      strippedState.playerPets = strippedPlayerPets;
    }
    const strippedOpponentPets = state.opponentPets.map(stripPetDefaults);
    if (strippedOpponentPets.some((pet) => pet !== null)) {
      strippedState.opponentPets = strippedOpponentPets;
    }
    return strippedState;
  }
  truncateKeys(data) {
    if (Array.isArray(data)) {
      return data.map((item) => this.truncateKeys(item));
    }
    if (isRecord(data)) {
      const newObj = {};
      for (const key of Object.keys(data)) {
        const newKey = KEY_MAP[key] || key;
        newObj[newKey] = this.truncateKeys(data[key]);
      }
      return newObj;
    }
    return data;
  }
};

// src/app/integrations/equipment/pet-config-equipment.ts
function clonePetConfigEquipment(equipment) {
  if (!equipment) {
    return null;
  }
  return typeof equipment === "string" ? { name: equipment } : { ...equipment };
}

// src/app/integrations/simulation/positioning-lineup-memory.ts
var PARROT_MEMORY_PREFIX = "parrotCopyPet";
var ABOMINATION_MEMORY_PREFIX = "abominationSwallowedPet";
function clonePet(pet) {
  if (!pet) {
    return null;
  }
  return {
    ...pet,
    equipment: clonePetConfigEquipment(pet.equipment)
  };
}
function clearParrotMemory(pet) {
  Object.keys(pet).forEach((key) => {
    if (key.startsWith(PARROT_MEMORY_PREFIX)) {
      delete pet[key];
    }
  });
  pet.parrotCopyPet = null;
}
function copyResolvedParrotMemory(target, parrot) {
  Object.entries(target).forEach(([key, value]) => {
    if (key.startsWith(PARROT_MEMORY_PREFIX)) {
      parrot[key] = value;
    }
  });
}
function copyTargetMemory(target, parrot) {
  parrot.parrotCopyPet = target.name ?? null;
  if (target.name === "Beluga Whale") {
    parrot.parrotCopyPetBelugaSwallowedPet = target.belugaSwallowedPet ?? null;
  }
  if (target.name !== "Abomination") {
    return;
  }
  Object.entries(target).forEach(([key, value]) => {
    if (!key.startsWith(ABOMINATION_MEMORY_PREFIX)) {
      return;
    }
    parrot[`${PARROT_MEMORY_PREFIX}${key[0].toUpperCase()}${key.slice(1)}`] = value;
  });
}
function findNearestPetAhead(lineup, index) {
  for (let aheadIndex = index - 1; aheadIndex >= 0; aheadIndex -= 1) {
    const candidate = lineup[aheadIndex];
    if (candidate?.name) {
      return candidate;
    }
  }
  return null;
}
function refreshPositioningLineupMemory(lineup) {
  const refreshed = lineup.map(clonePet);
  for (let index = 0; index < refreshed.length; index += 1) {
    const pet = refreshed[index];
    if (pet?.name !== "Parrot") {
      continue;
    }
    const petRecord = pet;
    clearParrotMemory(petRecord);
    const target = findNearestPetAhead(refreshed, index);
    if (!target) {
      continue;
    }
    const targetRecord = target;
    if (target.name === "Parrot") {
      copyResolvedParrotMemory(targetRecord, petRecord);
    } else {
      copyTargetMemory(targetRecord, petRecord);
    }
  }
  return refreshed;
}

// src/app/integrations/simulation/positioning-optimizer.ts
var POSITIONING_SIMULATION_BUDGETS = {
  quick: { total: 12e3, maximum: 1e3 },
  extended: { total: 6e4, maximum: 5e3 }
};
function getPositioningSimulationCount(lineup, precision = "quick") {
  const occupiedSlots = Math.min(
    5,
    lineup.reduce((count, pet) => count + (pet ? 1 : 0), 0)
  );
  const meaningfulOrders = permutationCount(5, occupiedSlots);
  const profile = POSITIONING_SIMULATION_BUDGETS[precision];
  return Math.max(
    25,
    Math.min(profile.maximum, Math.floor(profile.total / meaningfulOrders))
  );
}
function permutationCount(slotCount, occupiedSlots) {
  let result = 1;
  for (let index = 0; index < occupiedSlots; index += 1) {
    result *= slotCount - index;
  }
  return result;
}
var DEFAULT_MAX_SIMULATIONS_PER_PERMUTATION = 250;
var DEFAULT_BATCH_SIZE = 25;
var DEFAULT_CONFIDENCE_Z = 1.96;
var DEFAULT_MIN_SAMPLES_BEFORE_ELIMINATION = 50;
var DEFAULT_BASE_SEED = 123456789;
function runPositioningOptimization(params) {
  const {
    baseConfig,
    simulateBatch,
    shouldAbort,
    onProgress,
    projectEndTurnLineup
  } = params;
  const side = params.options.side;
  const keepSameBuffTargets = params.options.keepSameBuffTargets === true;
  const recomputeParrotCopies = params.options.recomputeParrotCopies !== false;
  const successiveHalving = params.options.successiveHalving === true;
  const successiveHalvingRate = Math.min(
    0.9,
    Math.max(0.1, params.options.successiveHalvingRate ?? 0.5)
  );
  const projectedLineupCache = /* @__PURE__ */ new Map();
  const maxSimulationsPerPermutation = Math.max(
    1,
    Math.trunc(
      params.options.maxSimulationsPerPermutation ?? baseConfig.simulationCount ?? DEFAULT_MAX_SIMULATIONS_PER_PERMUTATION
    )
  );
  const batchSize = Math.max(
    1,
    Math.trunc(params.options.batchSize ?? DEFAULT_BATCH_SIZE)
  );
  const confidenceZ = params.options.confidenceZ != null && Number.isFinite(params.options.confidenceZ) ? Math.max(0, params.options.confidenceZ) : DEFAULT_CONFIDENCE_Z;
  const minSamplesBeforeElimination = Math.max(
    1,
    Math.trunc(
      params.options.minSamplesBeforeElimination ?? DEFAULT_MIN_SAMPLES_BEFORE_ELIMINATION
    )
  );
  const baseSeed = params.options.baseSeed != null && Number.isFinite(params.options.baseSeed) ? Math.trunc(params.options.baseSeed) : baseConfig.seed != null && Number.isFinite(baseConfig.seed) ? Math.trunc(baseConfig.seed) : DEFAULT_BASE_SEED;
  const petsKey = side === "player" ? "playerPets" : "opponentPets";
  const sidePets = (baseConfig[petsKey] ?? []).slice();
  const baselineLineupDeltas = projectEndTurnLineup && !keepSameBuffTargets ? computeLineupNumericDeltas(
    sidePets,
    normalizeLineupLength(
      projectEndTurnLineup({
        baseConfig,
        side,
        lineup: sidePets
      }),
      sidePets.length
    )
  ) : null;
  const permutations = generateIndexPermutations(sidePets);
  const candidates = permutations.map((order) => {
    const lineup = applyOrder(sidePets, order);
    return {
      order: [...order],
      lineup,
      simulations: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      score: 0,
      lowerBound: 0,
      upperBound: 1,
      eliminated: false,
      rounds: 0,
      simulationLineup: keepSameBuffTargets ? recomputeParrotCopies ? refreshPositioningLineupMemory(lineup) : lineup : null,
      lineupSignature: ""
    };
  });
  candidates.forEach((candidate) => {
    candidate.lineupSignature = buildLineupSignature(candidate.lineup);
  });
  let completedBattles = 0;
  const totalBattlesEstimate = permutations.length * maxSimulationsPerPermutation;
  let round = 0;
  let aborted = false;
  if (candidates.length === 0) {
    throw new Error("Could not generate any board permutations.");
  }
  while (true) {
    if (shouldAbort?.()) {
      aborted = true;
      break;
    }
    const activeCandidates = candidates.filter((candidate) => !candidate.eliminated);
    if (activeCandidates.length <= 1) {
      break;
    }
    const seedForRound = baseSeed + round;
    let ranAnyBatch = false;
    for (const candidate of activeCandidates) {
      if (shouldAbort?.()) {
        aborted = true;
        break;
      }
      if (candidate.simulations >= maxSimulationsPerPermutation) {
        continue;
      }
      const remaining = maxSimulationsPerPermutation - candidate.simulations;
      const simulationsToRun = Math.min(batchSize, remaining);
      if (simulationsToRun <= 0) {
        continue;
      }
      ranAnyBatch = true;
      const simulationLineup = getCandidateSimulationLineup(
        candidate,
        {
          keepSameBuffTargets,
          recomputeParrotCopies,
          baseConfig,
          side,
          sidePets,
          baselineLineupDeltas,
          projectEndTurnLineup
        },
        projectedLineupCache
      );
      const batchConfig = {
        ...baseConfig,
        [petsKey]: simulationLineup,
        simulationCount: simulationsToRun,
        logsEnabled: false,
        maxLoggedBattles: 0,
        captureRandomDecisions: false,
        randomDecisionOverrides: [],
        seed: seedForRound
      };
      const result = simulateBatch(batchConfig);
      const objectiveWins = side === "player" ? result.playerWins : result.opponentWins;
      const objectiveLosses = side === "player" ? result.opponentWins : result.playerWins;
      candidate.simulations += simulationsToRun;
      candidate.rounds += 1;
      candidate.wins += objectiveWins;
      candidate.draws += result.draws;
      candidate.losses += objectiveLosses;
      updateCandidateStats(candidate, confidenceZ);
      completedBattles += simulationsToRun;
      const testedPermutations = candidates.filter((entry) => entry.simulations > 0).length;
      const bestScore = Math.max(...candidates.map((entry) => entry.score));
      onProgress?.({
        completedBattles,
        totalBattlesEstimate,
        testedPermutations,
        activePermutations: candidates.filter((entry) => !entry.eliminated).length,
        bestScore
      });
    }
    if (aborted) {
      break;
    }
    if (!ranAnyBatch) {
      break;
    }
    const activeAfterRound = candidates.filter((candidate) => !candidate.eliminated);
    for (const candidate of activeAfterRound) {
      updateCandidateStats(candidate, confidenceZ);
    }
    const eligibleForElimination = activeAfterRound.filter(
      (candidate) => candidate.simulations >= minSamplesBeforeElimination
    );
    if (eligibleForElimination.length > 1) {
      const bestLowerBound = Math.max(
        ...eligibleForElimination.map((candidate) => candidate.lowerBound)
      );
      for (const candidate of eligibleForElimination) {
        if (candidate.upperBound < bestLowerBound) {
          candidate.eliminated = true;
        }
      }
    }
    if (successiveHalving) {
      const halvingCandidates = candidates.filter(
        (candidate) => !candidate.eliminated
      );
      if (halvingCandidates.length > 1) {
        const survivors = Math.max(
          1,
          Math.ceil(halvingCandidates.length * successiveHalvingRate)
        );
        const rankedForScreening = [...halvingCandidates].sort(
          (left, right) => right.score - left.score || right.lowerBound - left.lowerBound || right.wins - left.wins || left.losses - right.losses
        );
        rankedForScreening.slice(survivors).forEach((candidate) => {
          candidate.eliminated = true;
        });
      }
    }
    round += 1;
  }
  for (const candidate of candidates) {
    updateCandidateStats(candidate, confidenceZ);
  }
  const rankedPermutations = [...candidates].sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }
    if (right.lowerBound !== left.lowerBound) {
      return right.lowerBound - left.lowerBound;
    }
    if (right.simulations !== left.simulations) {
      return right.simulations - left.simulations;
    }
    return 0;
  });
  const bestPermutation = rankedPermutations[0];
  if (!bestPermutation) {
    throw new Error("Positioning optimization failed to rank candidates.");
  }
  return {
    side,
    totalPermutations: candidates.length,
    prunedPermutations: candidates.filter((candidate) => candidate.eliminated).length,
    simulatedBattles: completedBattles,
    aborted,
    bestPermutation: cloneCandidateStats(bestPermutation, recomputeParrotCopies),
    rankedPermutations: rankedPermutations.map(
      (candidate) => cloneCandidateStats(candidate, recomputeParrotCopies)
    )
  };
}
function cloneCandidateStats(candidate, recomputeParrotCopies) {
  return {
    order: [...candidate.order],
    lineup: [...candidate.lineup],
    simulationLineup: [
      ...candidate.simulationLineup ?? (recomputeParrotCopies ? refreshPositioningLineupMemory(candidate.lineup) : candidate.lineup)
    ],
    simulations: candidate.simulations,
    wins: candidate.wins,
    draws: candidate.draws,
    losses: candidate.losses,
    score: candidate.score,
    lowerBound: candidate.lowerBound,
    upperBound: candidate.upperBound,
    eliminated: candidate.eliminated
  };
}
function updateCandidateStats(candidate, zScore) {
  const simulations = candidate.simulations;
  if (simulations <= 0) {
    candidate.score = 0;
    candidate.lowerBound = 0;
    candidate.upperBound = 1;
    return;
  }
  const score = scoreFromTallies(candidate.wins, candidate.draws, simulations);
  const variance = Math.max(0, score * (1 - score));
  const margin = zScore * Math.sqrt(variance / simulations);
  candidate.score = score;
  candidate.lowerBound = Math.max(0, score - margin);
  candidate.upperBound = Math.min(1, score + margin);
}
function scoreFromTallies(wins, draws, simulations) {
  if (simulations <= 0) {
    return 0;
  }
  return (wins + draws * 0.5) / simulations;
}
function applyOrder(source, order) {
  return order.map((index) => source[index]);
}
function buildProjectedCandidateLineup(baseConfig, side, sidePets, order, baselineLineupDeltas, projectEndTurnLineup) {
  const candidateLineup = applyOrder(sidePets, order);
  const projectedCandidateLineup = normalizeLineupLength(
    projectEndTurnLineup({
      baseConfig,
      side,
      lineup: candidateLineup
    }),
    candidateLineup.length
  );
  const candidateLineupDeltas = computeLineupNumericDeltas(
    candidateLineup,
    projectedCandidateLineup
  );
  return candidateLineup.map((pet, targetIndex) => {
    if (!pet) {
      return null;
    }
    const sourceIndex = order[targetIndex] ?? targetIndex;
    const baselineDelta = baselineLineupDeltas[sourceIndex] ?? {};
    const candidateDelta = candidateLineupDeltas[targetIndex] ?? {};
    const numericKeys = /* @__PURE__ */ new Set([
      ...Object.keys(candidateDelta),
      ...Object.keys(baselineDelta)
    ]);
    if (numericKeys.size <= 0) {
      return pet;
    }
    const petRecord = pet;
    const projectedPet = {
      ...petRecord,
      equipment: petRecord.equipment && typeof petRecord.equipment === "object" ? { ...petRecord.equipment } : petRecord.equipment ?? null
    };
    for (const key of numericKeys) {
      const currentValue = toFiniteNumber3(petRecord[key]) ?? 0;
      const projectedValue = currentValue + (candidateDelta[key] ?? 0) - (baselineDelta[key] ?? 0);
      projectedPet[key] = projectedValue;
    }
    return projectedPet;
  });
}
function computeLineupNumericDeltas(beforeLineup, afterLineup) {
  const maxLength = Math.max(beforeLineup.length, afterLineup.length);
  const deltas = [];
  for (let index = 0; index < maxLength; index += 1) {
    deltas.push(
      computePetNumericDelta(
        beforeLineup[index] ?? null,
        afterLineup[index] ?? null
      )
    );
  }
  return deltas;
}
function computePetNumericDelta(beforePet, afterPet) {
  if (!beforePet || !afterPet) {
    return {};
  }
  const beforeRecord = beforePet;
  const afterRecord = afterPet;
  const numericKeys = /* @__PURE__ */ new Set();
  Object.entries(beforeRecord).forEach(([key, value]) => {
    if (toFiniteNumber3(value) != null) {
      numericKeys.add(key);
    }
  });
  Object.entries(afterRecord).forEach(([key, value]) => {
    if (toFiniteNumber3(value) != null) {
      numericKeys.add(key);
    }
  });
  const delta = {};
  for (const key of numericKeys) {
    const beforeValue = toFiniteNumber3(beforeRecord[key]) ?? 0;
    const afterValue = toFiniteNumber3(afterRecord[key]) ?? 0;
    const difference = afterValue - beforeValue;
    if (difference !== 0) {
      delta[key] = difference;
    }
  }
  return delta;
}
function normalizeLineupLength(lineup, length) {
  const normalized = lineup.slice(0, length);
  while (normalized.length < length) {
    normalized.push(null);
  }
  return normalized;
}
function toFiniteNumber3(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function generateIndexPermutations(source) {
  const size = source.length;
  if (size <= 0) {
    return [[]];
  }
  const groups = groupEquivalentValues(source);
  const remainingCounts = groups.map((group) => group.indices.length);
  const groupOrder = new Array(size);
  const groupPermutations = [];
  generateGroupOrderPermutations(
    0,
    groupOrder,
    remainingCounts,
    groupPermutations
  );
  return groupPermutations.map(
    (permutation) => materializeIndexPermutation(permutation, groups)
  );
}
function groupEquivalentValues(source) {
  const groupsBySignature = /* @__PURE__ */ new Map();
  for (let index = 0; index < source.length; index += 1) {
    const value = source[index];
    const signature = buildValueSignature(value);
    const existingGroup = groupsBySignature.get(signature);
    if (existingGroup) {
      existingGroup.indices.push(index);
      continue;
    }
    groupsBySignature.set(signature, {
      representative: value,
      indices: [index]
    });
  }
  return Array.from(groupsBySignature.values());
}
function generateGroupOrderPermutations(depth, groupOrder, remainingCounts, output) {
  if (depth >= groupOrder.length) {
    output.push(groupOrder.slice());
    return;
  }
  for (let groupIndex = 0; groupIndex < remainingCounts.length; groupIndex += 1) {
    if (remainingCounts[groupIndex] <= 0) {
      continue;
    }
    groupOrder[depth] = groupIndex;
    remainingCounts[groupIndex] -= 1;
    generateGroupOrderPermutations(
      depth + 1,
      groupOrder,
      remainingCounts,
      output
    );
    remainingCounts[groupIndex] += 1;
  }
}
function materializeIndexPermutation(groupOrder, groups) {
  const groupOffsets = groups.map(() => 0);
  return groupOrder.map((groupIndex) => {
    const offset = groupOffsets[groupIndex];
    groupOffsets[groupIndex] += 1;
    const index = groups[groupIndex].indices[offset];
    if (index == null) {
      throw new Error("Failed to map grouped permutation to index permutation.");
    }
    return index;
  });
}
function getCandidateSimulationLineup(candidate, context, projectedLineupCache) {
  if (candidate.simulationLineup) {
    return candidate.simulationLineup;
  }
  const cached = projectedLineupCache.get(candidate.lineupSignature);
  if (cached) {
    candidate.simulationLineup = cached;
    return cached;
  }
  const projectedOrRawLineup = context.keepSameBuffTargets || !context.baselineLineupDeltas || !context.projectEndTurnLineup ? candidate.lineup : buildProjectedCandidateLineup(
    context.baseConfig,
    context.side,
    context.sidePets,
    candidate.order,
    context.baselineLineupDeltas,
    context.projectEndTurnLineup
  );
  const simulationLineup = context.recomputeParrotCopies ? refreshPositioningLineupMemory(projectedOrRawLineup) : projectedOrRawLineup;
  projectedLineupCache.set(candidate.lineupSignature, simulationLineup);
  candidate.simulationLineup = simulationLineup;
  return simulationLineup;
}
var objectSignatureCache = /* @__PURE__ */ new WeakMap();
function buildLineupSignature(lineup) {
  return lineup.map((pet) => buildValueSignature(pet)).join("|");
}
function buildValueSignature(value) {
  if (value == null) {
    return `${value}`;
  }
  if (typeof value === "string") {
    return `s:${value}`;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return `${typeof value}:${value}`;
  }
  if (Array.isArray(value)) {
    return `[${value.map((entry) => buildValueSignature(entry)).join(",")}]`;
  }
  if (typeof value !== "object") {
    return `${typeof value}:${String(value)}`;
  }
  const cached = objectSignatureCache.get(value);
  if (cached) {
    return cached;
  }
  const record = value;
  const keys = Object.keys(record).sort();
  const signature = `{${keys.map((key) => `${key}:${buildValueSignature(record[key])}`).join(",")}}`;
  objectSignatureCache.set(value, signature);
  return signature;
}

// src/app/integrations/simulation/board-strength-evaluator.ts
var DEFAULT_SEED = 730241;
var AUTO_INITIAL_MAX_STAT = 100;
var AUTO_MAX_STAT = 5e3;
var AUTO_SIGNAL_THRESHOLD = 5e-3;
var PRECISION_PROFILES = {
  quick: {
    initialBattles: 25,
    batchSize: 25,
    maxBattlesPerStat: 100,
    targetStandardError: 0.055
  },
  standard: {
    initialBattles: 50,
    batchSize: 50,
    maxBattlesPerStat: 200,
    targetStandardError: 0.04
  },
  high: {
    initialBattles: 100,
    batchSize: 100,
    maxBattlesPerStat: 400,
    targetStandardError: 0.025
  }
};
function getBoardStrengthPrecisionProfile(precision) {
  return PRECISION_PROFILES[precision];
}
function runBoardStrengthEvaluation(context) {
  const precision = context.options.precision ?? "standard";
  const profile = PRECISION_PROFILES[precision];
  const minStat = normalizePositiveInteger(context.options.minStat ?? 1);
  const explicitMaxStat = context.options.maxStat === void 0 ? null : Math.max(minStat, normalizePositiveInteger(context.options.maxStat));
  const pointsByStat = /* @__PURE__ */ new Map();
  let battlesCompleted = 0;
  let completedStats = 0;
  let refinementRound = 0;
  let rangeTruncated = false;
  const getPoint = (stat) => {
    const existing = pointsByStat.get(stat);
    if (existing) {
      return existing;
    }
    const point = { stat, wins: 0, draws: 0, losses: 0, battles: 0 };
    pointsByStat.set(stat, point);
    return point;
  };
  const simulatePoint = (point, count) => {
    const config = createBoardStrengthMatchConfig(
      context.baseConfig,
      context.options.side,
      point.stat,
      count,
      (context.options.seed ?? context.baseConfig.seed ?? DEFAULT_SEED) + point.stat * 1e4 + point.battles
    );
    const result = context.simulateBatch(config);
    const candidateWins = context.options.side === "player" ? result.playerWins : result.opponentWins;
    const candidateLosses = context.options.side === "player" ? result.opponentWins : result.playerWins;
    const completed = candidateWins + candidateLosses + result.draws;
    point.wins += candidateWins;
    point.losses += candidateLosses;
    point.draws += result.draws;
    point.battles += completed;
    battlesCompleted += completed;
  };
  let maxStat = explicitMaxStat ?? Math.max(minStat, AUTO_INITIAL_MAX_STAT);
  if (explicitMaxStat === null) {
    let probeStat = maxStat;
    let consecutiveMisses = 0;
    let sawSignal = false;
    let coverageBoundary = maxStat;
    while (true) {
      if (context.shouldAbort?.()) {
        const partial = [...pointsByStat.values()].sort((a, b) => a.stat - b.stat);
        return buildResult(partial, context.options.side, precision, minStat, probeStat, true, false);
      }
      const point = getPoint(probeStat);
      simulatePoint(point, profile.initialBattles);
      const hasSignal = getExpectedScore(point) > AUTO_SIGNAL_THRESHOLD;
      if (hasSignal) {
        sawSignal = true;
        consecutiveMisses = 0;
      } else {
        consecutiveMisses += 1;
        if (sawSignal && consecutiveMisses === 1) {
          coverageBoundary = probeStat;
        }
      }
      context.onProgress?.({
        phase: "scout",
        completedStats: 0,
        totalStats: 0,
        currentStat: probeStat,
        battlesCompleted,
        maximumBattles: 0,
        refinementRound
      });
      if (probeStat >= AUTO_MAX_STAT) {
        rangeTruncated = hasSignal;
        maxStat = rangeTruncated ? AUTO_MAX_STAT : coverageBoundary;
        break;
      }
      probeStat = Math.min(
        AUTO_MAX_STAT,
        probeStat < 1e3 ? probeStat + 100 : probeStat * 2
      );
    }
  }
  const stats = Array.from({ length: maxStat - minStat + 1 }, (_, index) => minStat + index);
  const points = stats.map(getPoint);
  const maximumBattles = stats.length * profile.maxBattlesPerStat;
  for (const point of points) {
    if (context.shouldAbort?.()) {
      return buildResult(points, context.options.side, precision, minStat, maxStat, true, rangeTruncated);
    }
    if (point.battles === 0) {
      simulatePoint(point, profile.initialBattles);
    }
    completedStats += 1;
    context.onProgress?.({
      phase: "scan",
      completedStats,
      totalStats: stats.length,
      currentStat: point.stat,
      battlesCompleted,
      maximumBattles,
      refinementRound
    });
  }
  while (true) {
    const candidates = points.filter(
      (point) => point.battles < profile.maxBattlesPerStat && estimateStandardError(point) > profile.targetStandardError
    );
    if (candidates.length === 0) {
      break;
    }
    refinementRound += 1;
    for (const point of candidates) {
      if (context.shouldAbort?.()) {
        return buildResult(points, context.options.side, precision, minStat, maxStat, true, rangeTruncated);
      }
      const remaining = profile.maxBattlesPerStat - point.battles;
      simulatePoint(point, Math.min(profile.batchSize, remaining));
      context.onProgress?.({
        phase: "refine",
        completedStats,
        totalStats: stats.length,
        currentStat: point.stat,
        battlesCompleted,
        maximumBattles,
        refinementRound
      });
    }
  }
  context.onProgress?.({
    phase: "complete",
    completedStats: stats.length,
    totalStats: stats.length,
    currentStat: maxStat,
    battlesCompleted,
    maximumBattles,
    refinementRound
  });
  return buildResult(
    points,
    context.options.side,
    precision,
    minStat,
    maxStat,
    false,
    rangeTruncated
  );
}
function createBoardStrengthMatchConfig(baseConfig, side, stat, simulationCount, seed) {
  const config = deepClone(baseConfig);
  const benchmarkPets = createBenchmarkPets(stat);
  const candidatePack = side === "player" ? config.playerPack : config.opponentPack;
  if (side === "player") {
    config.opponentPets = benchmarkPets;
    config.opponentPack = candidatePack;
    config.opponentToy = null;
    config.opponentHardToy = null;
    config.opponentGoldSpent = 0;
    config.opponentRollAmount = 0;
    config.opponentSummonedAmount = 0;
    config.opponentLevel3Sold = 0;
    config.opponentTransformationAmount = 0;
    config.opponentLostLastBattle = false;
  } else {
    config.playerPets = benchmarkPets;
    config.playerPack = candidatePack;
    config.playerToy = null;
    config.playerHardToy = null;
    config.playerGoldSpent = 0;
    config.playerRollAmount = 0;
    config.playerSummonedAmount = 0;
    config.playerLevel3Sold = 0;
    config.playerTransformationAmount = 0;
    config.playerLostLastBattle = false;
  }
  config.simulationCount = simulationCount;
  config.seed = Math.trunc(seed);
  config.logsEnabled = false;
  config.maxLoggedBattles = 0;
  config.captureRandomDecisions = false;
  config.randomDecisionOverrides = [];
  config.optimizeDeterministicSimulations = false;
  return config;
}
function createBoardStrengthFingerprint(baseConfig, side) {
  const normalized = createBoardStrengthMatchConfig(
    baseConfig,
    side,
    1,
    1,
    DEFAULT_SEED
  );
  normalized.seed = null;
  normalized.simulationCount = 1;
  return JSON.stringify(normalized);
}
function createBenchmarkPets(stat) {
  const normalizedStat = normalizePositiveInteger(stat);
  return Array.from({ length: 5 }, () => {
    const pet = {
      name: "Benchmark Pet",
      benchmark: true,
      attack: normalizedStat,
      health: normalizedStat,
      exp: 0,
      equipment: null,
      mana: 0
    };
    return pet;
  });
}
function buildResult(mutablePoints, side, precision, minStat, maxStat, aborted, rangeTruncated) {
  const rawScores = mutablePoints.map((point) => getExpectedScore(point));
  const points = mutablePoints.map((point, index) => ({
    ...point,
    expectedScore: rawScores[index],
    smoothedScore: rawScores[index]
  }));
  const score = rawScores.reduce((sum, value) => sum + value, 0);
  const varianceOfScore = mutablePoints.reduce((sum, point) => {
    const standardError = estimateStandardError(point);
    return sum + standardError * standardError;
  }, 0);
  return {
    version: "BS1",
    side,
    precision,
    score,
    benchmark50: findBenchmark50(points),
    estimatedPrecision95: 1.96 * Math.sqrt(varianceOfScore),
    totalBattles: mutablePoints.reduce(
      (sum, point) => sum + point.battles,
      0
    ),
    minStat,
    maxStat,
    points,
    aborted,
    rangeTruncated
  };
}
function getExpectedScore(point) {
  if (point.battles === 0) {
    return 0;
  }
  return (point.wins + point.draws * 0.5) / point.battles;
}
function estimateStandardError(point) {
  if (point.battles === 0) {
    return Number.POSITIVE_INFINITY;
  }
  const mean = getExpectedScore(point);
  const secondMoment = (point.wins + point.draws * 0.25) / point.battles;
  const empiricalVariance = Math.max(0, secondMoment - mean * mean);
  const smoothedMean = (point.wins + point.draws * 0.5 + 1) / (point.battles + 2);
  const conservativeVariance = Math.max(
    empiricalVariance,
    smoothedMean * (1 - smoothedMean)
  );
  return Math.sqrt(conservativeVariance / point.battles);
}
function findBenchmark50(points) {
  let highestPassingStat = null;
  for (const point of points) {
    if (point.expectedScore >= 0.5) {
      highestPassingStat = point.stat;
    }
  }
  return highestPassingStat;
}
function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}
function normalizePositiveInteger(value) {
  const normalized = Number.isFinite(value) ? Math.trunc(value) : 1;
  return Math.max(1, normalized);
}

// simulation/simulate.ts
var import_sap_battle_engine4 = require("sap-battle-engine");
function runSimulation(config) {
  return new CalculatorBattleEngine().run(config);
}
function toNumberOrFallback2(value, fallback) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}
function normalizeCalculatorBaseUrl(baseUrl) {
  const fallbackUrl = "https://sap-calculator.com/";
  const candidate = typeof baseUrl === "string" && baseUrl.trim().length > 0 ? baseUrl.trim() : fallbackUrl;
  try {
    return new URL(candidate);
  } catch {
    return new URL(fallbackUrl);
  }
}
function parseReplayCalculatorState(replay, turnNumber, metaBoards, options) {
  return parseTeamwoodReplayForCalculator(
    replay,
    turnNumber,
    metaBoards,
    options
  );
}
function createSimulationConfigFromCalculatorState(calculatorState, simulationCount) {
  return {
    playerPack: calculatorState.playerPack,
    opponentPack: calculatorState.opponentPack,
    playerToy: calculatorState.playerToy,
    playerToyLevel: toNumberOrFallback2(calculatorState.playerToyLevel, 1),
    playerHardToy: calculatorState.playerHardToy,
    playerHardToyLevel: calculatorState.playerHardToyLevel,
    opponentToy: calculatorState.opponentToy,
    opponentToyLevel: toNumberOrFallback2(calculatorState.opponentToyLevel, 1),
    opponentHardToy: calculatorState.opponentHardToy,
    opponentHardToyLevel: calculatorState.opponentHardToyLevel,
    turn: calculatorState.turn,
    playerGoldSpent: calculatorState.playerGoldSpent,
    opponentGoldSpent: calculatorState.opponentGoldSpent,
    playerRollAmount: calculatorState.playerRollAmount,
    opponentRollAmount: calculatorState.opponentRollAmount,
    playerSummonedAmount: calculatorState.playerSummonedAmount,
    opponentSummonedAmount: calculatorState.opponentSummonedAmount,
    playerLevel3Sold: calculatorState.playerLevel3Sold,
    opponentLevel3Sold: calculatorState.opponentLevel3Sold,
    playerTransformationAmount: calculatorState.playerTransformationAmount,
    opponentTransformationAmount: calculatorState.opponentTransformationAmount,
    playerPets: calculatorState.playerPets,
    opponentPets: calculatorState.opponentPets,
    customPacks: calculatorState.customPacks,
    allPets: calculatorState.allPets,
    oldStork: calculatorState.oldStork,
    tokenPets: calculatorState.tokenPets,
    komodoShuffle: calculatorState.komodoShuffle,
    mana: calculatorState.mana,
    seed: calculatorState.seed,
    simulationCount,
    logsEnabled: false,
    maxLoggedBattles: 0
  };
}
function runReplayOddsFromCalculatorState(calculatorState, simulationCount) {
  const config = createSimulationConfigFromCalculatorState(
    calculatorState,
    simulationCount
  );
  return runSimulation(config);
}
var POSITIONING_SIMULATIONS = {
  quick: 100,
  standard: 250,
  high: 500
};
function normalizeSimulationCount(value, fallback) {
  if (value == null || !Number.isFinite(value)) {
    return fallback;
  }
  return Math.max(1, Math.trunc(value));
}
function clonePetLineup(lineup) {
  return (lineup ?? []).map(
    (pet) => pet ? {
      ...pet,
      equipment: pet.equipment ? { ...pet.equipment } : null
    } : null
  );
}
function runReplayPositioningFromCalculatorState(calculatorState, options) {
  const precision = options.precision ?? "quick";
  const simulationCount = normalizeSimulationCount(
    options.simulationCount,
    POSITIONING_SIMULATIONS[precision]
  );
  const baseConfig = createSimulationConfigFromCalculatorState(
    calculatorState,
    simulationCount
  );
  const runner = new CalculatorBattleEngine();
  const projectionRunner = new CalculatorBattleEngine();
  const baseline = runner.run(baseConfig);
  const projectEndTurnEffects = options.projectEndTurnEffects !== false;
  const recomputeParrotCopies = options.recomputeParrotCopies !== false;
  const optimization = runPositioningOptimization({
    baseConfig,
    options: {
      side: options.side,
      maxSimulationsPerPermutation: simulationCount,
      batchSize: Math.min(25, simulationCount),
      minSamplesBeforeElimination: Math.min(50, simulationCount),
      confidenceZ: 1.96,
      keepSameBuffTargets: !projectEndTurnEffects,
      recomputeParrotCopies
    },
    simulateBatch: (config) => runner.run(config),
    projectEndTurnLineup: projectEndTurnEffects ? ({ baseConfig: projectionConfig, side, lineup }) => projectionRunner.projectLineupAfterEndTurn(
      projectionConfig,
      side,
      lineup
    ) : void 0
  });
  const optimizedLineup = optimization.bestPermutation.simulationLineup.length > 0 ? optimization.bestPermutation.simulationLineup : optimization.bestPermutation.lineup;
  const optimizedCalculatorState = {
    ...calculatorState,
    playerPets: clonePetLineup(
      optimization.side === "player" ? optimizedLineup : calculatorState.playerPets
    ),
    opponentPets: clonePetLineup(
      optimization.side === "opponent" ? optimizedLineup : calculatorState.opponentPets
    )
  };
  const optimized = runner.run(
    createSimulationConfigFromCalculatorState(
      optimizedCalculatorState,
      simulationCount
    )
  );
  return {
    precision,
    simulationCount,
    baseline,
    optimized,
    optimization,
    optimizedCalculatorState
  };
}
function runReplayStrengthFromCalculatorState(calculatorState, precision = "quick", range = {}) {
  const baseConfig = createSimulationConfigFromCalculatorState(calculatorState, 1);
  const runner = new CalculatorBattleEngine();
  const evaluate = (side) => runBoardStrengthEvaluation({
    baseConfig,
    options: {
      side,
      precision,
      minStat: range.minStat,
      maxStat: range.maxStat
    },
    simulateBatch: (config) => runner.run(config)
  });
  return {
    precision,
    player: evaluate("player"),
    opponent: evaluate("opponent")
  };
}
function generateReplayCalculatorLink(calculatorState, baseUrl) {
  const parser = new ReplayCalcParser();
  const normalizedBaseUrl = normalizeCalculatorBaseUrl(baseUrl);
  const globalWithWindow = globalThis;
  const previousWindow = globalWithWindow.window;
  const hadWindow = Object.prototype.hasOwnProperty.call(globalWithWindow, "window");
  globalWithWindow.window = {
    location: {
      origin: normalizedBaseUrl.origin,
      pathname: normalizedBaseUrl.pathname
    }
  };
  try {
    const hashLink = parser.generateCalculatorLink(calculatorState);
    return hashLink.replace("#c=", "?c=");
  } finally {
    if (hadWindow) {
      globalWithWindow.window = previousWindow;
    } else {
      delete globalWithWindow.window;
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ReplayCalcParser,
  buildReplayAbilityPetMapFromActions,
  buildReplayPerkNameByPetIdFromActions,
  catalogs,
  createBattleEngine,
  createBoardStrengthFingerprint,
  createBoardStrengthMatchConfig,
  createSimulationConfigFromCalculatorState,
  generateReplayCalculatorLink,
  getBoardStrengthPrecisionProfile,
  getPositioningSimulationCount,
  optimizeFight,
  parseReplayCalculatorState,
  parseReplayForCalculatorFromActions,
  parseTeamwoodReplayForCalculator,
  runBoardStrengthEvaluation,
  runHeadlessSimulation,
  runPositioningOptimization,
  runReplayOddsFromCalculatorState,
  runReplayPositioningFromCalculatorState,
  runReplayStrengthFromCalculatorState,
  runSimulation,
  selectReplayBattleFromActions
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc2ltdWxhdGUudHMiLCAiLi4vLi4vc3JjL2FwcC9pbnRlZ3JhdGlvbnMvc2ltdWxhdGlvbi9iYXR0bGUtZW5naW5lLnRzIiwgIi4uLy4uL3NyYy9hcHAvZG9tYWluL2VudGl0aWVzL3BsYXllci5jbGFzcy50cyIsICIuLi8uLi9zcmMvYXBwL2RvbWFpbi9lbnRpdGllcy9wZXQuY2xhc3MudHMiLCAiLi4vc2hpbXMudHMiLCAiLi4vLi4vc3JjL2FwcC9ydW50aW1lL2NvbnRlbnQtY2F0YWxvZ3MudHMiLCAiLi4vLi4vc3JjL2FwcC9ydW50aW1lL2Fzc2V0LWNhdGFsb2cudHMiLCAiLi4vLi4vc3JjL2FwcC9pbnRlZ3JhdGlvbnMvZXF1aXBtZW50L2VxdWlwbWVudC1jYXRlZ29yaWVzLnRzIiwgIi4uLy4uL3NyYy9hcHAvaW50ZWdyYXRpb25zL2xvZy9sb2ctaW5saW5lLWljb25zLnRzIiwgIi4uLy4uL3NyYy9hcHAvaW50ZWdyYXRpb25zL2xvZy9sb2ctbWVyZ2UtdXRpbHMudHMiLCAiLi4vLi4vc3JjL2FwcC9pbnRlZ3JhdGlvbnMvbG9nL2xvZy1ib2FyZC1yZW5kZXIudHMiLCAiLi4vLi4vc3JjL2FwcC9pbnRlZ3JhdGlvbnMvbG9nLnNlcnZpY2UudHMiLCAiLi4vLi4vc3JjL2FwcC9ydW50aW1lL2Jhc2U2NC11cmwudHMiLCAiLi4vLi4vc3JjL2FwcC9pbnRlZ3JhdGlvbnMvcmVwbGF5L3JlcGxheS1jYWxjLXNjaGVtYS50cyIsICIuLi8uLi9zcmMvYXBwL2ludGVncmF0aW9ucy9yZXBsYXkvcmVwbGF5LWNhbGMtcGFyc2VyLXV0aWxzLnRzIiwgIi4uLy4uL3NyYy9hcHAvaW50ZWdyYXRpb25zL3JlcGxheS9yZXBsYXktY2FsYy1wYXJzZXIudHMiLCAiLi4vLi4vc3JjL2FwcC9pbnRlZ3JhdGlvbnMvZXF1aXBtZW50L3BldC1jb25maWctZXF1aXBtZW50LnRzIiwgIi4uLy4uL3NyYy9hcHAvaW50ZWdyYXRpb25zL3NpbXVsYXRpb24vcG9zaXRpb25pbmctbGluZXVwLW1lbW9yeS50cyIsICIuLi8uLi9zcmMvYXBwL2ludGVncmF0aW9ucy9zaW11bGF0aW9uL3Bvc2l0aW9uaW5nLW9wdGltaXplci50cyIsICIuLi8uLi9zcmMvYXBwL2ludGVncmF0aW9ucy9zaW11bGF0aW9uL2JvYXJkLXN0cmVuZ3RoLWV2YWx1YXRvci50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgQ2FsY3VsYXRvckJhdHRsZUVuZ2luZSB9IGZyb20gJy4uL3NyYy9hcHAvaW50ZWdyYXRpb25zL3NpbXVsYXRpb24vYmF0dGxlLWVuZ2luZSc7XG5pbXBvcnQgeyBydW5IZWFkbGVzc1NpbXVsYXRpb24gYXMgZW5naW5lSGVhZGxlc3NTaW11bGF0aW9uIH0gZnJvbSAnc2FwLWJhdHRsZS1lbmdpbmUnO1xuaW1wb3J0IHtcbiAgU2ltdWxhdGlvbkNvbmZpZyxcbiAgU2ltdWxhdGlvblJlc3VsdCxcbn0gZnJvbSAnLi4vc3JjL2FwcC9kb21haW4vaW50ZXJmYWNlcy9zaW11bGF0aW9uLWNvbmZpZy5pbnRlcmZhY2UnO1xuaW1wb3J0IHtcbiAgcGFyc2VUZWFtd29vZFJlcGxheUZvckNhbGN1bGF0b3IsXG4gIFJlcGxheUFjdGlvbnNDb250YWluZXJKc29uLFxuICBSZXBsYXlCb3RUdXJuc0NvbnRhaW5lckpzb24sXG4gIFJlcGxheUNhbGN1bGF0b3JTdGF0ZSxcbiAgUmVwbGF5TWV0YUJvYXJkcyxcbiAgUmVwbGF5UGFyc2VPcHRpb25zLFxuICBSZXBsYXlDYWxjUGFyc2VyLFxufSBmcm9tICcuLi9zcmMvYXBwL2ludGVncmF0aW9ucy9yZXBsYXkvcmVwbGF5LWNhbGMtcGFyc2VyJztcbmltcG9ydCB7XG4gIFBvc2l0aW9uaW5nT3B0aW1pemF0aW9uUmVzdWx0LFxuICBQb3NpdGlvbmluZ09wdGltaXphdGlvblNpZGUsXG4gIHJ1blBvc2l0aW9uaW5nT3B0aW1pemF0aW9uLFxufSBmcm9tICcuLi9zcmMvYXBwL2ludGVncmF0aW9ucy9zaW11bGF0aW9uL3Bvc2l0aW9uaW5nLW9wdGltaXplcic7XG5pbXBvcnQge1xuICBCb2FyZFN0cmVuZ3RoUHJlY2lzaW9uLFxuICBCb2FyZFN0cmVuZ3RoUmVzdWx0LFxuICBydW5Cb2FyZFN0cmVuZ3RoRXZhbHVhdGlvbixcbn0gZnJvbSAnLi4vc3JjL2FwcC9pbnRlZ3JhdGlvbnMvc2ltdWxhdGlvbi9ib2FyZC1zdHJlbmd0aC1ldmFsdWF0b3InO1xuXG5leHBvcnQgZnVuY3Rpb24gcnVuU2ltdWxhdGlvbihjb25maWc6IFNpbXVsYXRpb25Db25maWcpOiBTaW11bGF0aW9uUmVzdWx0IHtcbiAgcmV0dXJuIG5ldyBDYWxjdWxhdG9yQmF0dGxlRW5naW5lKCkucnVuKGNvbmZpZyk7XG59XG5leHBvcnQgeyBlbmdpbmVIZWFkbGVzc1NpbXVsYXRpb24gYXMgcnVuSGVhZGxlc3NTaW11bGF0aW9uIH07XG5leHBvcnQgdHlwZSB7IEhlYWRsZXNzU2ltdWxhdGlvbk9wdGlvbnMgfSBmcm9tICdzYXAtYmF0dGxlLWVuZ2luZSc7XG5cbmV4cG9ydCB0eXBlIFJlcGxheVBheWxvYWRKc29uID1cbiAgfCBSZXBsYXlBY3Rpb25zQ29udGFpbmVySnNvblxuICB8IFJlcGxheUJvdFR1cm5zQ29udGFpbmVySnNvbjtcblxuZnVuY3Rpb24gdG9OdW1iZXJPckZhbGxiYWNrKHZhbHVlOiB1bmtub3duLCBmYWxsYmFjazogbnVtYmVyKTogbnVtYmVyIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgTnVtYmVyLmlzRmluaXRlKHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS50cmltKCkubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IHBhcnNlZCA9IE51bWJlcih2YWx1ZSk7XG4gICAgaWYgKE51bWJlci5pc0Zpbml0ZShwYXJzZWQpKSB7XG4gICAgICByZXR1cm4gcGFyc2VkO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsbGJhY2s7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUNhbGN1bGF0b3JCYXNlVXJsKGJhc2VVcmw/OiBzdHJpbmcpOiBVUkwge1xuICBjb25zdCBmYWxsYmFja1VybCA9ICdodHRwczovL3NhcC1jYWxjdWxhdG9yLmNvbS8nO1xuICBjb25zdCBjYW5kaWRhdGUgPSB0eXBlb2YgYmFzZVVybCA9PT0gJ3N0cmluZycgJiYgYmFzZVVybC50cmltKCkubGVuZ3RoID4gMFxuICAgID8gYmFzZVVybC50cmltKClcbiAgICA6IGZhbGxiYWNrVXJsO1xuICB0cnkge1xuICAgIHJldHVybiBuZXcgVVJMKGNhbmRpZGF0ZSk7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBuZXcgVVJMKGZhbGxiYWNrVXJsKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VSZXBsYXlDYWxjdWxhdG9yU3RhdGUoXG4gIHJlcGxheTogUmVwbGF5UGF5bG9hZEpzb24sXG4gIHR1cm5OdW1iZXI6IG51bWJlcixcbiAgbWV0YUJvYXJkcz86IFJlcGxheU1ldGFCb2FyZHMsXG4gIG9wdGlvbnM/OiBSZXBsYXlQYXJzZU9wdGlvbnMsXG4pOiBSZXBsYXlDYWxjdWxhdG9yU3RhdGUgfCBudWxsIHtcbiAgcmV0dXJuIHBhcnNlVGVhbXdvb2RSZXBsYXlGb3JDYWxjdWxhdG9yKFxuICAgIHJlcGxheSxcbiAgICB0dXJuTnVtYmVyLFxuICAgIG1ldGFCb2FyZHMsXG4gICAgb3B0aW9ucyxcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNpbXVsYXRpb25Db25maWdGcm9tQ2FsY3VsYXRvclN0YXRlKFxuICBjYWxjdWxhdG9yU3RhdGU6IFJlcGxheUNhbGN1bGF0b3JTdGF0ZSxcbiAgc2ltdWxhdGlvbkNvdW50OiBudW1iZXIsXG4pOiBTaW11bGF0aW9uQ29uZmlnIHtcbiAgcmV0dXJuIHtcbiAgICBwbGF5ZXJQYWNrOiBjYWxjdWxhdG9yU3RhdGUucGxheWVyUGFjayxcbiAgICBvcHBvbmVudFBhY2s6IGNhbGN1bGF0b3JTdGF0ZS5vcHBvbmVudFBhY2ssXG4gICAgcGxheWVyVG95OiBjYWxjdWxhdG9yU3RhdGUucGxheWVyVG95LFxuICAgIHBsYXllclRveUxldmVsOiB0b051bWJlck9yRmFsbGJhY2soY2FsY3VsYXRvclN0YXRlLnBsYXllclRveUxldmVsLCAxKSxcbiAgICBwbGF5ZXJIYXJkVG95OiBjYWxjdWxhdG9yU3RhdGUucGxheWVySGFyZFRveSxcbiAgICBwbGF5ZXJIYXJkVG95TGV2ZWw6IGNhbGN1bGF0b3JTdGF0ZS5wbGF5ZXJIYXJkVG95TGV2ZWwsXG4gICAgb3Bwb25lbnRUb3k6IGNhbGN1bGF0b3JTdGF0ZS5vcHBvbmVudFRveSxcbiAgICBvcHBvbmVudFRveUxldmVsOiB0b051bWJlck9yRmFsbGJhY2soY2FsY3VsYXRvclN0YXRlLm9wcG9uZW50VG95TGV2ZWwsIDEpLFxuICAgIG9wcG9uZW50SGFyZFRveTogY2FsY3VsYXRvclN0YXRlLm9wcG9uZW50SGFyZFRveSxcbiAgICBvcHBvbmVudEhhcmRUb3lMZXZlbDogY2FsY3VsYXRvclN0YXRlLm9wcG9uZW50SGFyZFRveUxldmVsLFxuICAgIHR1cm46IGNhbGN1bGF0b3JTdGF0ZS50dXJuLFxuICAgIHBsYXllckdvbGRTcGVudDogY2FsY3VsYXRvclN0YXRlLnBsYXllckdvbGRTcGVudCxcbiAgICBvcHBvbmVudEdvbGRTcGVudDogY2FsY3VsYXRvclN0YXRlLm9wcG9uZW50R29sZFNwZW50LFxuICAgIHBsYXllclJvbGxBbW91bnQ6IGNhbGN1bGF0b3JTdGF0ZS5wbGF5ZXJSb2xsQW1vdW50LFxuICAgIG9wcG9uZW50Um9sbEFtb3VudDogY2FsY3VsYXRvclN0YXRlLm9wcG9uZW50Um9sbEFtb3VudCxcbiAgICBwbGF5ZXJTdW1tb25lZEFtb3VudDogY2FsY3VsYXRvclN0YXRlLnBsYXllclN1bW1vbmVkQW1vdW50LFxuICAgIG9wcG9uZW50U3VtbW9uZWRBbW91bnQ6IGNhbGN1bGF0b3JTdGF0ZS5vcHBvbmVudFN1bW1vbmVkQW1vdW50LFxuICAgIHBsYXllckxldmVsM1NvbGQ6IGNhbGN1bGF0b3JTdGF0ZS5wbGF5ZXJMZXZlbDNTb2xkLFxuICAgIG9wcG9uZW50TGV2ZWwzU29sZDogY2FsY3VsYXRvclN0YXRlLm9wcG9uZW50TGV2ZWwzU29sZCxcbiAgICBwbGF5ZXJUcmFuc2Zvcm1hdGlvbkFtb3VudDogY2FsY3VsYXRvclN0YXRlLnBsYXllclRyYW5zZm9ybWF0aW9uQW1vdW50LFxuICAgIG9wcG9uZW50VHJhbnNmb3JtYXRpb25BbW91bnQ6IGNhbGN1bGF0b3JTdGF0ZS5vcHBvbmVudFRyYW5zZm9ybWF0aW9uQW1vdW50LFxuICAgIHBsYXllclBldHM6IGNhbGN1bGF0b3JTdGF0ZS5wbGF5ZXJQZXRzLFxuICAgIG9wcG9uZW50UGV0czogY2FsY3VsYXRvclN0YXRlLm9wcG9uZW50UGV0cyxcbiAgICBjdXN0b21QYWNrczogY2FsY3VsYXRvclN0YXRlLmN1c3RvbVBhY2tzLFxuICAgIGFsbFBldHM6IGNhbGN1bGF0b3JTdGF0ZS5hbGxQZXRzLFxuICAgIG9sZFN0b3JrOiBjYWxjdWxhdG9yU3RhdGUub2xkU3RvcmssXG4gICAgdG9rZW5QZXRzOiBjYWxjdWxhdG9yU3RhdGUudG9rZW5QZXRzLFxuICAgIGtvbW9kb1NodWZmbGU6IGNhbGN1bGF0b3JTdGF0ZS5rb21vZG9TaHVmZmxlLFxuICAgIG1hbmE6IGNhbGN1bGF0b3JTdGF0ZS5tYW5hLFxuICAgIHNlZWQ6IGNhbGN1bGF0b3JTdGF0ZS5zZWVkLFxuICAgIHNpbXVsYXRpb25Db3VudCxcbiAgICBsb2dzRW5hYmxlZDogZmFsc2UsXG4gICAgbWF4TG9nZ2VkQmF0dGxlczogMCxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJ1blJlcGxheU9kZHNGcm9tQ2FsY3VsYXRvclN0YXRlKFxuICBjYWxjdWxhdG9yU3RhdGU6IFJlcGxheUNhbGN1bGF0b3JTdGF0ZSxcbiAgc2ltdWxhdGlvbkNvdW50OiBudW1iZXIsXG4pOiBTaW11bGF0aW9uUmVzdWx0IHtcbiAgY29uc3QgY29uZmlnID0gY3JlYXRlU2ltdWxhdGlvbkNvbmZpZ0Zyb21DYWxjdWxhdG9yU3RhdGUoXG4gICAgY2FsY3VsYXRvclN0YXRlLFxuICAgIHNpbXVsYXRpb25Db3VudCxcbiAgKTtcbiAgcmV0dXJuIHJ1blNpbXVsYXRpb24oY29uZmlnKTtcbn1cblxuZXhwb3J0IHR5cGUgUmVwbGF5QW5hbHlzaXNQcmVjaXNpb24gPSAncXVpY2snIHwgJ3N0YW5kYXJkJyB8ICdoaWdoJztcblxuZXhwb3J0IGludGVyZmFjZSBSZXBsYXlQb3NpdGlvbmluZ09wdGlvbnMge1xuICBzaWRlOiBQb3NpdGlvbmluZ09wdGltaXphdGlvblNpZGU7XG4gIHByZWNpc2lvbj86IFJlcGxheUFuYWx5c2lzUHJlY2lzaW9uO1xuICBzaW11bGF0aW9uQ291bnQ/OiBudW1iZXI7XG4gIHByb2plY3RFbmRUdXJuRWZmZWN0cz86IGJvb2xlYW47XG4gIHJlY29tcHV0ZVBhcnJvdENvcGllcz86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVwbGF5UG9zaXRpb25pbmdSZXN1bHQge1xuICBwcmVjaXNpb246IFJlcGxheUFuYWx5c2lzUHJlY2lzaW9uO1xuICBzaW11bGF0aW9uQ291bnQ6IG51bWJlcjtcbiAgYmFzZWxpbmU6IFNpbXVsYXRpb25SZXN1bHQ7XG4gIG9wdGltaXplZDogU2ltdWxhdGlvblJlc3VsdDtcbiAgb3B0aW1pemF0aW9uOiBQb3NpdGlvbmluZ09wdGltaXphdGlvblJlc3VsdDtcbiAgb3B0aW1pemVkQ2FsY3VsYXRvclN0YXRlOiBSZXBsYXlDYWxjdWxhdG9yU3RhdGU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVwbGF5U3RyZW5ndGhSZXN1bHQge1xuICBwcmVjaXNpb246IEJvYXJkU3RyZW5ndGhQcmVjaXNpb247XG4gIHBsYXllcjogQm9hcmRTdHJlbmd0aFJlc3VsdDtcbiAgb3Bwb25lbnQ6IEJvYXJkU3RyZW5ndGhSZXN1bHQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVwbGF5U3RyZW5ndGhSYW5nZSB7XG4gIG1pblN0YXQ/OiBudW1iZXI7XG4gIG1heFN0YXQ/OiBudW1iZXI7XG59XG5cbmNvbnN0IFBPU0lUSU9OSU5HX1NJTVVMQVRJT05TOiBSZWFkb25seTxSZWNvcmQ8UmVwbGF5QW5hbHlzaXNQcmVjaXNpb24sIG51bWJlcj4+ID0ge1xuICBxdWljazogMTAwLFxuICBzdGFuZGFyZDogMjUwLFxuICBoaWdoOiA1MDAsXG59O1xuXG5mdW5jdGlvbiBub3JtYWxpemVTaW11bGF0aW9uQ291bnQodmFsdWU6IG51bWJlciB8IHVuZGVmaW5lZCwgZmFsbGJhY2s6IG51bWJlcik6IG51bWJlciB7XG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8ICFOdW1iZXIuaXNGaW5pdGUodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbGxiYWNrO1xuICB9XG4gIHJldHVybiBNYXRoLm1heCgxLCBNYXRoLnRydW5jKHZhbHVlKSk7XG59XG5cbmZ1bmN0aW9uIGNsb25lUGV0TGluZXVwKFxuICBsaW5ldXA6IFJlcGxheUNhbGN1bGF0b3JTdGF0ZVsncGxheWVyUGV0cyddLFxuKTogUmVwbGF5Q2FsY3VsYXRvclN0YXRlWydwbGF5ZXJQZXRzJ10ge1xuICByZXR1cm4gKGxpbmV1cCA/PyBbXSkubWFwKChwZXQpID0+XG4gICAgcGV0XG4gICAgICA/IHtcbiAgICAgICAgICAuLi5wZXQsXG4gICAgICAgICAgZXF1aXBtZW50OiBwZXQuZXF1aXBtZW50ID8geyAuLi5wZXQuZXF1aXBtZW50IH0gOiBudWxsLFxuICAgICAgICB9XG4gICAgICA6IG51bGwsXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBydW5SZXBsYXlQb3NpdGlvbmluZ0Zyb21DYWxjdWxhdG9yU3RhdGUoXG4gIGNhbGN1bGF0b3JTdGF0ZTogUmVwbGF5Q2FsY3VsYXRvclN0YXRlLFxuICBvcHRpb25zOiBSZXBsYXlQb3NpdGlvbmluZ09wdGlvbnMsXG4pOiBSZXBsYXlQb3NpdGlvbmluZ1Jlc3VsdCB7XG4gIGNvbnN0IHByZWNpc2lvbiA9IG9wdGlvbnMucHJlY2lzaW9uID8/ICdxdWljayc7XG4gIGNvbnN0IHNpbXVsYXRpb25Db3VudCA9IG5vcm1hbGl6ZVNpbXVsYXRpb25Db3VudChcbiAgICBvcHRpb25zLnNpbXVsYXRpb25Db3VudCxcbiAgICBQT1NJVElPTklOR19TSU1VTEFUSU9OU1twcmVjaXNpb25dLFxuICApO1xuICBjb25zdCBiYXNlQ29uZmlnID0gY3JlYXRlU2ltdWxhdGlvbkNvbmZpZ0Zyb21DYWxjdWxhdG9yU3RhdGUoXG4gICAgY2FsY3VsYXRvclN0YXRlLFxuICAgIHNpbXVsYXRpb25Db3VudCxcbiAgKTtcbiAgY29uc3QgcnVubmVyID0gbmV3IENhbGN1bGF0b3JCYXR0bGVFbmdpbmUoKTtcbiAgY29uc3QgcHJvamVjdGlvblJ1bm5lciA9IG5ldyBDYWxjdWxhdG9yQmF0dGxlRW5naW5lKCk7XG4gIGNvbnN0IGJhc2VsaW5lID0gcnVubmVyLnJ1bihiYXNlQ29uZmlnKTtcbiAgY29uc3QgcHJvamVjdEVuZFR1cm5FZmZlY3RzID0gb3B0aW9ucy5wcm9qZWN0RW5kVHVybkVmZmVjdHMgIT09IGZhbHNlO1xuICBjb25zdCByZWNvbXB1dGVQYXJyb3RDb3BpZXMgPSBvcHRpb25zLnJlY29tcHV0ZVBhcnJvdENvcGllcyAhPT0gZmFsc2U7XG4gIGNvbnN0IG9wdGltaXphdGlvbiA9IHJ1blBvc2l0aW9uaW5nT3B0aW1pemF0aW9uKHtcbiAgICBiYXNlQ29uZmlnLFxuICAgIG9wdGlvbnM6IHtcbiAgICAgIHNpZGU6IG9wdGlvbnMuc2lkZSxcbiAgICAgIG1heFNpbXVsYXRpb25zUGVyUGVybXV0YXRpb246IHNpbXVsYXRpb25Db3VudCxcbiAgICAgIGJhdGNoU2l6ZTogTWF0aC5taW4oMjUsIHNpbXVsYXRpb25Db3VudCksXG4gICAgICBtaW5TYW1wbGVzQmVmb3JlRWxpbWluYXRpb246IE1hdGgubWluKDUwLCBzaW11bGF0aW9uQ291bnQpLFxuICAgICAgY29uZmlkZW5jZVo6IDEuOTYsXG4gICAgICBrZWVwU2FtZUJ1ZmZUYXJnZXRzOiAhcHJvamVjdEVuZFR1cm5FZmZlY3RzLFxuICAgICAgcmVjb21wdXRlUGFycm90Q29waWVzLFxuICAgIH0sXG4gICAgc2ltdWxhdGVCYXRjaDogKGNvbmZpZykgPT4gcnVubmVyLnJ1bihjb25maWcpLFxuICAgIHByb2plY3RFbmRUdXJuTGluZXVwOiBwcm9qZWN0RW5kVHVybkVmZmVjdHNcbiAgICAgID8gKHsgYmFzZUNvbmZpZzogcHJvamVjdGlvbkNvbmZpZywgc2lkZSwgbGluZXVwIH0pID0+XG4gICAgICAgICAgcHJvamVjdGlvblJ1bm5lci5wcm9qZWN0TGluZXVwQWZ0ZXJFbmRUdXJuKFxuICAgICAgICAgICAgcHJvamVjdGlvbkNvbmZpZyxcbiAgICAgICAgICAgIHNpZGUsXG4gICAgICAgICAgICBsaW5ldXAsXG4gICAgICAgICAgKVxuICAgICAgOiB1bmRlZmluZWQsXG4gIH0pO1xuICBjb25zdCBvcHRpbWl6ZWRMaW5ldXAgPVxuICAgIG9wdGltaXphdGlvbi5iZXN0UGVybXV0YXRpb24uc2ltdWxhdGlvbkxpbmV1cC5sZW5ndGggPiAwXG4gICAgICA/IG9wdGltaXphdGlvbi5iZXN0UGVybXV0YXRpb24uc2ltdWxhdGlvbkxpbmV1cFxuICAgICAgOiBvcHRpbWl6YXRpb24uYmVzdFBlcm11dGF0aW9uLmxpbmV1cDtcbiAgY29uc3Qgb3B0aW1pemVkQ2FsY3VsYXRvclN0YXRlOiBSZXBsYXlDYWxjdWxhdG9yU3RhdGUgPSB7XG4gICAgLi4uY2FsY3VsYXRvclN0YXRlLFxuICAgIHBsYXllclBldHM6IGNsb25lUGV0TGluZXVwKFxuICAgICAgb3B0aW1pemF0aW9uLnNpZGUgPT09ICdwbGF5ZXInXG4gICAgICAgID8gb3B0aW1pemVkTGluZXVwXG4gICAgICAgIDogY2FsY3VsYXRvclN0YXRlLnBsYXllclBldHMsXG4gICAgKSxcbiAgICBvcHBvbmVudFBldHM6IGNsb25lUGV0TGluZXVwKFxuICAgICAgb3B0aW1pemF0aW9uLnNpZGUgPT09ICdvcHBvbmVudCdcbiAgICAgICAgPyBvcHRpbWl6ZWRMaW5ldXBcbiAgICAgICAgOiBjYWxjdWxhdG9yU3RhdGUub3Bwb25lbnRQZXRzLFxuICAgICksXG4gIH07XG4gIGNvbnN0IG9wdGltaXplZCA9IHJ1bm5lci5ydW4oXG4gICAgY3JlYXRlU2ltdWxhdGlvbkNvbmZpZ0Zyb21DYWxjdWxhdG9yU3RhdGUoXG4gICAgICBvcHRpbWl6ZWRDYWxjdWxhdG9yU3RhdGUsXG4gICAgICBzaW11bGF0aW9uQ291bnQsXG4gICAgKSxcbiAgKTtcblxuICByZXR1cm4ge1xuICAgIHByZWNpc2lvbixcbiAgICBzaW11bGF0aW9uQ291bnQsXG4gICAgYmFzZWxpbmUsXG4gICAgb3B0aW1pemVkLFxuICAgIG9wdGltaXphdGlvbixcbiAgICBvcHRpbWl6ZWRDYWxjdWxhdG9yU3RhdGUsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBydW5SZXBsYXlTdHJlbmd0aEZyb21DYWxjdWxhdG9yU3RhdGUoXG4gIGNhbGN1bGF0b3JTdGF0ZTogUmVwbGF5Q2FsY3VsYXRvclN0YXRlLFxuICBwcmVjaXNpb246IEJvYXJkU3RyZW5ndGhQcmVjaXNpb24gPSAncXVpY2snLFxuICByYW5nZTogUmVwbGF5U3RyZW5ndGhSYW5nZSA9IHt9LFxuKTogUmVwbGF5U3RyZW5ndGhSZXN1bHQge1xuICBjb25zdCBiYXNlQ29uZmlnID0gY3JlYXRlU2ltdWxhdGlvbkNvbmZpZ0Zyb21DYWxjdWxhdG9yU3RhdGUoY2FsY3VsYXRvclN0YXRlLCAxKTtcbiAgY29uc3QgcnVubmVyID0gbmV3IENhbGN1bGF0b3JCYXR0bGVFbmdpbmUoKTtcbiAgY29uc3QgZXZhbHVhdGUgPSAoc2lkZTogJ3BsYXllcicgfCAnb3Bwb25lbnQnKTogQm9hcmRTdHJlbmd0aFJlc3VsdCA9PlxuICAgIHJ1bkJvYXJkU3RyZW5ndGhFdmFsdWF0aW9uKHtcbiAgICAgIGJhc2VDb25maWcsXG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIHNpZGUsXG4gICAgICAgIHByZWNpc2lvbixcbiAgICAgICAgbWluU3RhdDogcmFuZ2UubWluU3RhdCxcbiAgICAgICAgbWF4U3RhdDogcmFuZ2UubWF4U3RhdCxcbiAgICAgIH0sXG4gICAgICBzaW11bGF0ZUJhdGNoOiAoY29uZmlnKSA9PiBydW5uZXIucnVuKGNvbmZpZyksXG4gICAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICBwcmVjaXNpb24sXG4gICAgcGxheWVyOiBldmFsdWF0ZSgncGxheWVyJyksXG4gICAgb3Bwb25lbnQ6IGV2YWx1YXRlKCdvcHBvbmVudCcpLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVSZXBsYXlDYWxjdWxhdG9yTGluayhcbiAgY2FsY3VsYXRvclN0YXRlOiBSZXBsYXlDYWxjdWxhdG9yU3RhdGUsXG4gIGJhc2VVcmw/OiBzdHJpbmcsXG4pOiBzdHJpbmcge1xuICBjb25zdCBwYXJzZXIgPSBuZXcgUmVwbGF5Q2FsY1BhcnNlcigpO1xuICBjb25zdCBub3JtYWxpemVkQmFzZVVybCA9IG5vcm1hbGl6ZUNhbGN1bGF0b3JCYXNlVXJsKGJhc2VVcmwpO1xuXG4gIGNvbnN0IGdsb2JhbFdpdGhXaW5kb3cgPSBnbG9iYWxUaGlzIGFzIHR5cGVvZiBnbG9iYWxUaGlzICYge1xuICAgIHdpbmRvdz86IFdpbmRvdyAmIHR5cGVvZiBnbG9iYWxUaGlzO1xuICB9O1xuXG4gIGNvbnN0IHByZXZpb3VzV2luZG93ID0gZ2xvYmFsV2l0aFdpbmRvdy53aW5kb3c7XG4gIGNvbnN0IGhhZFdpbmRvdyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChnbG9iYWxXaXRoV2luZG93LCAnd2luZG93Jyk7XG5cbiAgZ2xvYmFsV2l0aFdpbmRvdy53aW5kb3cgPSB7XG4gICAgbG9jYXRpb246IHtcbiAgICAgIG9yaWdpbjogbm9ybWFsaXplZEJhc2VVcmwub3JpZ2luLFxuICAgICAgcGF0aG5hbWU6IG5vcm1hbGl6ZWRCYXNlVXJsLnBhdGhuYW1lLFxuICAgIH0sXG4gIH0gYXMgV2luZG93ICYgdHlwZW9mIGdsb2JhbFRoaXM7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBoYXNoTGluayA9IHBhcnNlci5nZW5lcmF0ZUNhbGN1bGF0b3JMaW5rKGNhbGN1bGF0b3JTdGF0ZSk7XG4gICAgcmV0dXJuIGhhc2hMaW5rLnJlcGxhY2UoJyNjPScsICc/Yz0nKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBpZiAoaGFkV2luZG93KSB7XG4gICAgICBnbG9iYWxXaXRoV2luZG93LndpbmRvdyA9IHByZXZpb3VzV2luZG93O1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgZ2xvYmFsV2l0aFdpbmRvdy53aW5kb3c7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCAqIGZyb20gJy4uL3NyYy9hcHAvZG9tYWluL2ludGVyZmFjZXMvc2ltdWxhdGlvbi1jb25maWcuaW50ZXJmYWNlJztcbmV4cG9ydCAqIGZyb20gJy4uL3NyYy9hcHAvaW50ZWdyYXRpb25zL3JlcGxheS9yZXBsYXktY2FsYy1wYXJzZXInO1xuZXhwb3J0ICogZnJvbSAnLi4vc3JjL2FwcC9pbnRlZ3JhdGlvbnMvc2ltdWxhdGlvbi9wb3NpdGlvbmluZy1vcHRpbWl6ZXInO1xuZXhwb3J0ICogZnJvbSAnLi4vc3JjL2FwcC9pbnRlZ3JhdGlvbnMvc2ltdWxhdGlvbi9ib2FyZC1zdHJlbmd0aC1ldmFsdWF0b3InO1xuXG5cblxuXG5leHBvcnQgeyBjcmVhdGVCYXR0bGVFbmdpbmUsIGNhdGFsb2dzLCBvcHRpbWl6ZUZpZ2h0IH0gZnJvbSAnc2FwLWJhdHRsZS1lbmdpbmUnO1xuIiwgImltcG9ydCB7IGNyZWF0ZUJhdHRsZUVuZ2luZSwgQmF0dGxlLCBCYXR0bGVFdmVudCwgQm9hcmRTbmFwc2hvdCwgUGV0U25hcHNob3QsIFNpbXVsYXRpb25SdW5Ib29rcyB9IGZyb20gJ3NhcC1iYXR0bGUtZW5naW5lJztcbmltcG9ydCB7IFNpbXVsYXRpb25Db25maWcsIFNpbXVsYXRpb25SZXN1bHQsIFBldENvbmZpZyB9IGZyb20gJ2FwcC9kb21haW4vaW50ZXJmYWNlcy9zaW11bGF0aW9uLWNvbmZpZy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgTG9nIH0gZnJvbSAnYXBwL2RvbWFpbi9pbnRlcmZhY2VzL2xvZy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnYXBwL2RvbWFpbi9lbnRpdGllcy9wbGF5ZXIuY2xhc3MnO1xuaW1wb3J0IHsgUGV0IH0gZnJvbSAnYXBwL2RvbWFpbi9lbnRpdGllcy9wZXQuY2xhc3MnO1xuaW1wb3J0IHsgTG9nU2VydmljZSB9IGZyb20gJy4uL2xvZy5zZXJ2aWNlJztcbmltcG9ydCB7IGJ1aWxkQm9hcmRTdGF0ZU1lc3NhZ2UgfSBmcm9tICcuLi9sb2cvbG9nLWJvYXJkLXJlbmRlcic7XG5pbXBvcnQgeyBBSUxNRU5UX0NBVEVHT1JJRVMgfSBmcm9tICcuLi9lcXVpcG1lbnQvZXF1aXBtZW50LWNhdGVnb3JpZXMnO1xuXG5jb25zdCBhaWxtZW50cyA9IG5ldyBTZXQoT2JqZWN0LnZhbHVlcyhBSUxNRU5UX0NBVEVHT1JJRVMpLmZsYXQoKSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBzYW1wbGVCYXR0bGVzQnlPdXRjb21lKFxuICBiYXR0bGVzOiBCYXR0bGVbXSxcbiAgbGltaXRQZXJPdXRjb21lOiBudW1iZXIsXG4pOiBCYXR0bGVbXSB7XG4gIGNvbnN0IGxpbWl0ID0gTWF0aC5tYXgoMCwgTWF0aC50cnVuYyhsaW1pdFBlck91dGNvbWUpKTtcbiAgY29uc3QgY291bnRzOiBSZWNvcmQ8QmF0dGxlWyd3aW5uZXInXSwgbnVtYmVyPiA9IHtcbiAgICBwbGF5ZXI6IDAsXG4gICAgb3Bwb25lbnQ6IDAsXG4gICAgZHJhdzogMCxcbiAgfTtcbiAgcmV0dXJuIGJhdHRsZXMuZmlsdGVyKChiYXR0bGUpID0+IHtcbiAgICBpZiAoY291bnRzW2JhdHRsZS53aW5uZXJdID49IGxpbWl0KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvdW50c1tiYXR0bGUud2lubmVyXSArPSAxO1xuICAgIHJldHVybiB0cnVlO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZGlzcGxheVBldChzbmFwc2hvdDogUGV0U25hcHNob3QpOiBQZXQge1xuICBjb25zdCBwYXJlbnQgPSBuZXcgUGxheWVyKCk7XG4gIHBhcmVudC5pc09wcG9uZW50ID0gc25hcHNob3Quc2lkZSA9PT0gJ29wcG9uZW50JztcbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24obmV3IFBldCgpLCBzbmFwc2hvdCwge1xuICAgIHBhcmVudCwgc2F2ZWRQb3NpdGlvbjogc25hcHNob3QucG9zaXRpb24gLSAxLFxuICAgIGVxdWlwbWVudDogc25hcHNob3QuZXF1aXBtZW50ID8geyBuYW1lOiBzbmFwc2hvdC5lcXVpcG1lbnQsIHVzZXM6IHNuYXBzaG90LmVxdWlwbWVudFVzZXMgfSA6IG51bGwsXG4gIH0pO1xufVxuZnVuY3Rpb24gZGlzcGxheUJvYXJkKGJvYXJkOiBCb2FyZFNuYXBzaG90LCBjb25maWc6IFNpbXVsYXRpb25Db25maWcpOiBzdHJpbmcge1xuICBjb25zdCBzaWRlcyA9IChbJ3BsYXllcicsICdvcHBvbmVudCddIGFzIGNvbnN0KS5tYXAoKHNpZGUpID0+IHtcbiAgICBjb25zdCBwbGF5ZXIgPSBuZXcgUGxheWVyKCk7XG4gICAgcGxheWVyLmlzT3Bwb25lbnQgPSBzaWRlID09PSAnb3Bwb25lbnQnO1xuICAgIGJvYXJkW3NpZGVdLmZvckVhY2goKHBldCwgaW5kZXgpID0+IHBsYXllci5zZXRQZXQoaW5kZXgsIHBldCA/IGRpc3BsYXlQZXQocGV0KSA6IG51bGwpKTtcbiAgICBjb25zdCB0b3kgPSBzaWRlID09PSAncGxheWVyJyA/IGNvbmZpZy5wbGF5ZXJUb3kgOiBjb25maWcub3Bwb25lbnRUb3k7XG4gICAgY29uc3QgaGFyZFRveSA9IHNpZGUgPT09ICdwbGF5ZXInID8gY29uZmlnLnBsYXllckhhcmRUb3kgOiBjb25maWcub3Bwb25lbnRIYXJkVG95O1xuICAgIHBsYXllci50b3kgPSB0b3kgPyB7IG5hbWU6IHRveSwgbGV2ZWw6IDEgfSA6IG51bGw7XG4gICAgcGxheWVyLmhhcmRUb3kgPSBoYXJkVG95ID8geyBuYW1lOiBoYXJkVG95LCBsZXZlbDogMSB9IDogbnVsbDtcbiAgICByZXR1cm4gcGxheWVyO1xuICB9KTtcbiAgcmV0dXJuIGJ1aWxkQm9hcmRTdGF0ZU1lc3NhZ2Uoc2lkZXNbMF0sIHNpZGVzWzFdLCAocGV0KSA9PiBwZXQuc2F2ZWRQb3NpdGlvbiArIDEsIChuYW1lKSA9PiBhaWxtZW50cy5oYXMobmFtZSkpO1xufVxuXG4vKiogVGhlIG9ubHkgYnJpZGdlIGJldHdlZW4gYmF0dGxlIGV4ZWN1dGlvbiBhbmQgY2FsY3VsYXRvciBwcmVzZW50YXRpb24uICovXG5leHBvcnQgY2xhc3MgQ2FsY3VsYXRvckJhdHRsZUVuZ2luZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgZW5naW5lID0gY3JlYXRlQmF0dGxlRW5naW5lKCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgbG9nU2VydmljZSA9IG5ldyBMb2dTZXJ2aWNlKCk7XG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzPzogTG9nU2VydmljZSkge1xuICAgIHRoaXMubG9nU2VydmljZS5zZXRTaG93VHJpZ2dlck5hbWVzSW5Mb2dzKHNldHRpbmdzPy5pc1Nob3dUcmlnZ2VyTmFtZXNJbkxvZ3MoKSA/PyBmYWxzZSk7XG4gIH1cbiAgcnVuKFxuICAgIGNvbmZpZzogU2ltdWxhdGlvbkNvbmZpZyxcbiAgICBob29rcz86IFNpbXVsYXRpb25SdW5Ib29rcyxcbiAgICBtYXhCYXR0bGVzUGVyT3V0Y29tZT86IG51bWJlcixcbiAgKTogU2ltdWxhdGlvblJlc3VsdCB7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5lbmdpbmUucnVuU2ltdWxhdGlvbihjb25maWcsIGhvb2tzKTtcbiAgICAvLyBSZWR1Y2UgdGhlIGV4cGVuc2l2ZSBmb3JtYXR0ZWQvc3RydWN0dXJlZC1jbG9uZWQgcmVzdWx0IHdpdGhvdXQgc3RhcnZpbmdcbiAgICAvLyBhbnkgd2lubmVyIGZpbHRlciB3aGVuIG9uZSBvdXRjb21lIGFwcGVhcnMgbGF0ZSBpbiB0aGUgc2ltdWxhdGlvbi5cbiAgICBjb25zdCBiYXR0bGVzID1cbiAgICAgIHJlc3VsdC5iYXR0bGVzICYmIG1heEJhdHRsZXNQZXJPdXRjb21lICE9IG51bGxcbiAgICAgICAgPyBzYW1wbGVCYXR0bGVzQnlPdXRjb21lKHJlc3VsdC5iYXR0bGVzLCBtYXhCYXR0bGVzUGVyT3V0Y29tZSlcbiAgICAgICAgOiByZXN1bHQuYmF0dGxlcztcbiAgICByZXR1cm4ge1xuICAgICAgLi4ucmVzdWx0LFxuICAgICAgLi4uKGJhdHRsZXMgPyB7IGJhdHRsZXM6IGJhdHRsZXMubWFwKChiYXR0bGUpID0+ICh7XG4gICAgICAgIC4uLmJhdHRsZSxcbiAgICAgICAgbG9nczogdGhpcy5mb3JtYXRFdmVudHMoYmF0dGxlLmxvZ3MsIGNvbmZpZyksXG4gICAgICB9KSkgfSA6IHt9KSxcbiAgICB9O1xuICB9XG4gIHByb2plY3RMaW5ldXBBZnRlckVuZFR1cm4oY29uZmlnOiBTaW11bGF0aW9uQ29uZmlnLCBzaWRlOiAncGxheWVyJyB8ICdvcHBvbmVudCcsIGxpbmV1cDogKFBldENvbmZpZyB8IG51bGwpW10pOiAoUGV0Q29uZmlnIHwgbnVsbClbXSB7XG4gICAgcmV0dXJuIHRoaXMuZW5naW5lLnByb2plY3RMaW5ldXBBZnRlckVuZFR1cm4oY29uZmlnLCBzaWRlLCBsaW5ldXApO1xuICB9XG4gIHByaXZhdGUgZm9ybWF0RXZlbnRzKGV2ZW50czogQmF0dGxlRXZlbnRbXSwgY29uZmlnOiBTaW11bGF0aW9uQ29uZmlnKTogTG9nW10ge1xuICAgIHRoaXMubG9nU2VydmljZS5yZXNldCgpO1xuICAgIHRoaXMubG9nU2VydmljZS5zZXRFbmFibGVkKHRydWUpO1xuICAgIHRoaXMubG9nU2VydmljZS5zZXREZWZlckRlY29yYXRpb25zKHRydWUpO1xuICAgIGZvciAoY29uc3QgZXZlbnQgb2YgZXZlbnRzKSB7XG4gICAgICB0aGlzLmxvZ1NlcnZpY2UuY3JlYXRlTG9nKHtcbiAgICAgICAgLi4uZXZlbnQsXG4gICAgICAgIG1lc3NhZ2U6IGV2ZW50LnR5cGUgPT09ICdib2FyZCcgJiYgIWV2ZW50Lm1lc3NhZ2UgPyBkaXNwbGF5Qm9hcmQoZXZlbnQuYm9hcmQsIGNvbmZpZykgOiBldmVudC5tZXNzYWdlLFxuICAgICAgICBwbGF5ZXJJc09wcG9uZW50OiBldmVudC5zaWRlID09IG51bGwgPyB1bmRlZmluZWQgOiBldmVudC5zaWRlID09PSAnb3Bwb25lbnQnLFxuICAgICAgICB0YXJnZXRJc09wcG9uZW50OiBldmVudC50YXJnZXRTaWRlID09IG51bGwgPyB1bmRlZmluZWQgOiBldmVudC50YXJnZXRTaWRlID09PSAnb3Bwb25lbnQnLFxuICAgICAgICBzb3VyY2VQZXQ6IGV2ZW50LnNvdXJjZSA/IGRpc3BsYXlQZXQoZXZlbnQuc291cmNlKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgdGFyZ2V0UGV0OiBldmVudC50YXJnZXQgPyBkaXNwbGF5UGV0KGV2ZW50LnRhcmdldCkgOiB1bmRlZmluZWQsXG4gICAgICAgIC8vIEtlZXAgc25hcHNob3QgZXZlbnRzIHNlcGFyYXRlIHNvIHRoZWlyIGlkZW50aXRpZXMgYW5kIGJvYXJkIHN0YXRlcyByZW1haW4gbWVhbmluZ2Z1bC5cbiAgICAgICAgbm9Db2xsYXBzZTogdHJ1ZSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5sb2dTZXJ2aWNlLmdldExvZ3MoKTtcbiAgfVxufVxuIiwgImltcG9ydCB7IFBldCB9IGZyb20gJy4vcGV0LmNsYXNzJztcbmltcG9ydCB7IFRveSB9IGZyb20gJy4vdG95LmNsYXNzJztcblxuLyoqIE11dGFibGUgYm9hcmQtZWRpdG9yIHN0YXRlLiBCYXR0bGVzIG9wZXJhdGUgb24gc2VyaWFsaXplZCBjb25maWdzIGluIHNhcC1iYXR0bGUtZW5naW5lLiAqL1xuZXhwb3J0IGNsYXNzIFBsYXllciB7XG4gIG9wcG9uZW50PzogUGxheWVyO1xuICBwZXQwPzogUGV0OyBwZXQxPzogUGV0OyBwZXQyPzogUGV0OyBwZXQzPzogUGV0OyBwZXQ0PzogUGV0O1xuICBwYWNrOiBzdHJpbmcgPSAnVHVydGxlJztcbiAgdG95OiBUb3kgfCBudWxsID0gbnVsbDtcbiAgaGFyZFRveTogVG95IHwgbnVsbCA9IG51bGw7XG4gIG9yaWdpbmFsVG95OiBUb3kgfCBudWxsID0gbnVsbDtcbiAgaXNPcHBvbmVudCA9IGZhbHNlO1xuICBhbGxQZXRzID0gZmFsc2U7XG4gIHRva2VuUGV0cyA9IGZhbHNlO1xuICBnZXRQZXQoaW5kZXg6IG51bWJlcik6IFBldCB8IG51bGwge1xuICAgIHJldHVybiBbdGhpcy5wZXQwLCB0aGlzLnBldDEsIHRoaXMucGV0MiwgdGhpcy5wZXQzLCB0aGlzLnBldDRdW2luZGV4XSA/PyBudWxsO1xuICB9XG4gIHNldFBldChpbmRleDogbnVtYmVyLCBwZXQ6IFBldCB8IG51bGwsIF9pbml0ID0gZmFsc2UpOiB2b2lkIHtcbiAgICBzd2l0Y2ggKGluZGV4KSB7XG4gICAgICBjYXNlIDA6IHRoaXMucGV0MCA9IHBldDsgYnJlYWs7XG4gICAgICBjYXNlIDE6IHRoaXMucGV0MSA9IHBldDsgYnJlYWs7XG4gICAgICBjYXNlIDI6IHRoaXMucGV0MiA9IHBldDsgYnJlYWs7XG4gICAgICBjYXNlIDM6IHRoaXMucGV0MyA9IHBldDsgYnJlYWs7XG4gICAgICBjYXNlIDQ6IHRoaXMucGV0NCA9IHBldDsgYnJlYWs7XG4gICAgICBkZWZhdWx0OiByZXR1cm47XG4gICAgfVxuICAgIGlmIChwZXQpIHsgcGV0LnBhcmVudCA9IHRoaXM7IHBldC5zYXZlZFBvc2l0aW9uID0gaW5kZXg7IH1cbiAgfVxuICBnZXQgcGV0QXJyYXkoKTogUGV0W10ge1xuICAgIHJldHVybiBbdGhpcy5wZXQwLCB0aGlzLnBldDEsIHRoaXMucGV0MiwgdGhpcy5wZXQzLCB0aGlzLnBldDRdLmZpbHRlcigocGV0KTogcGV0IGlzIFBldCA9PiBwZXQgIT0gbnVsbCk7XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICcuL3BsYXllci5jbGFzcyc7XG5pbXBvcnQgeyBFcXVpcG1lbnQgfSBmcm9tICcuL2VxdWlwbWVudC5jbGFzcyc7XG5pbXBvcnQgeyBQZXRNZW1vcnlTdGF0ZSB9IGZyb20gJy4uL2ludGVyZmFjZXMvcGV0LW1lbW9yeS5pbnRlcmZhY2UnO1xuXG4vKiogRGlzcGxheSBhbmQgZm9ybSBzdGF0ZSBvbmx5OyBubyBiYXR0bGUgYWJpbGl0aWVzIG9yIG11dGFibGUgY29tYmF0IHJ1bnRpbWUuICovXG4vLyBUaGUgaW50ZXJmYWNlIGFkZHMgb25seSBvcHRpb25hbCBmb3JtLW1lbW9yeSBmaWVsZHMgdG8gdGhpcyBkYXRhIG1vZGVsLlxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnNhZmUtZGVjbGFyYXRpb24tbWVyZ2luZ1xuZXhwb3J0IGNsYXNzIFBldCB7XG4gIG5hbWU6IHN0cmluZztcbiAgdGllcjogbnVtYmVyO1xuICBwYXJlbnQ6IFBsYXllcjtcbiAgYXR0YWNrOiBudW1iZXI7XG4gIGhlYWx0aDogbnVtYmVyO1xuICBleHAgPSAwO1xuICBtYW5hID0gMDtcbiAgZXF1aXBtZW50OiBFcXVpcG1lbnQgfCBudWxsID0gbnVsbDtcbiAgZXF1aXBtZW50VXNlc092ZXJyaWRlPzogbnVtYmVyIHwgbnVsbDtcbiAgcGxhaW5Db3B5ID0gZmFsc2U7XG4gIHRyaWdnZXJzQ29uc3VtZWQgPSAwO1xuICBmb29kc0VhdGVuID0gMDtcbiAgdGltZXNHYXZlSGVhbHRoID0gMDtcbiAgYmF0dGxlc0ZvdWdodCA9IDA7XG4gIHRpbWVzSHVydCA9IDA7XG4gIGZyaWVuZHNEaWVkQmVmb3JlQmF0dGxlID0gMDtcbiAgZnJpZW5kc0h1cnRCZWZvcmVCYXR0bGUgPSAwO1xuICBhaWxtZW50c0NvdW50ID0gMDtcbiAgc2F2ZWRQb3NpdGlvbiA9IDA7XG4gIGdldCBsZXZlbCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5leHAgPj0gNSA/IDMgOiB0aGlzLmV4cCA+PSAyID8gMiA6IDE7IH1cbn1cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLWRlY2xhcmF0aW9uLW1lcmdpbmcsIG5vLXJlZGVjbGFyZVxuZXhwb3J0IGludGVyZmFjZSBQZXQgZXh0ZW5kcyBQZXRNZW1vcnlTdGF0ZSB7fVxuIiwgIi8vIE1vY2sgQW5ndWxhciBEZWNvcmF0b3JzXG5leHBvcnQgZnVuY3Rpb24gSW5qZWN0YWJsZShfYXJncz86IGFueSkge1xuICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldDogYW55KSB7fTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENvbXBvbmVudChhcmdzOiBhbnkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQ6IGFueSkge307XG59XG5cbmV4cG9ydCBjbGFzcyBJbmplY3RvciB7fVxuXG4vLyBNb2NrIEFuZ3VsYXIgRm9ybXNcbmV4cG9ydCBjbGFzcyBBYnN0cmFjdENvbnRyb2wge1xuICB2YWx1ZTogYW55O1xuICBjb25zdHJ1Y3Rvcih2YWx1ZTogYW55KSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICB9XG4gIGdldChwYXRoOiBzdHJpbmcgfCAoc3RyaW5nIHwgbnVtYmVyKVtdKTogQWJzdHJhY3RDb250cm9sIHwgbnVsbCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEZvcm1Db250cm9sIGV4dGVuZHMgQWJzdHJhY3RDb250cm9sIHtcbiAgY29uc3RydWN0b3IodmFsdWU6IGFueSwgX3ZhbGlkYXRvck9yT3B0cz86IGFueSkge1xuICAgIHN1cGVyKHZhbHVlKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRm9ybUdyb3VwIGV4dGVuZHMgQWJzdHJhY3RDb250cm9sIHtcbiAgY29udHJvbHM6IHsgW2tleTogc3RyaW5nXTogQWJzdHJhY3RDb250cm9sIH07XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2xzOiB7IFtrZXk6IHN0cmluZ106IEFic3RyYWN0Q29udHJvbCB9KSB7XG4gICAgc3VwZXIoY29udHJvbHMpO1xuICAgIHRoaXMuY29udHJvbHMgPSBjb250cm9scztcbiAgfVxuICBvdmVycmlkZSBnZXQocGF0aDogc3RyaW5nKTogQWJzdHJhY3RDb250cm9sIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbHNbcGF0aF0gfHwgbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRm9ybUFycmF5IGV4dGVuZHMgQWJzdHJhY3RDb250cm9sIHtcbiAgY29udHJvbHM6IEFic3RyYWN0Q29udHJvbFtdO1xuICBjb25zdHJ1Y3Rvcihjb250cm9sczogQWJzdHJhY3RDb250cm9sW10pIHtcbiAgICBzdXBlcihjb250cm9scyk7XG4gICAgdGhpcy5jb250cm9scyA9IGNvbnRyb2xzO1xuICB9XG4gIG92ZXJyaWRlIGdldChpbmRleDogYW55KTogQWJzdHJhY3RDb250cm9sIHwgbnVsbCB7XG4gICAgaWYgKHR5cGVvZiBpbmRleCA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRyb2xzW2luZGV4XSB8fCBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVmFsaWRhdG9ycyB7XG4gIHN0YXRpYyByZXF1aXJlZChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgdHlwZSBWYWxpZGF0aW9uRXJyb3JzID0ge1xuICBba2V5OiBzdHJpbmddOiBhbnk7XG59IHwgbnVsbDtcblxuZXhwb3J0IHR5cGUgVmFsaWRhdG9yRm4gPSAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbDtcbiIsICJpbXBvcnQgeyBjYXRhbG9ncyB9IGZyb20gJ3NhcC1iYXR0bGUtZW5naW5lJztcbi8vIENvbnN1bWVycyByZWNlaXZlIG11dGFibGUgbWV0YWRhdGEgY29waWVzIGZvciBleGlzdGluZyBmb3JtIGFuZCBwYXJzZXIgQVBJcy5cbnR5cGUgTXV0YWJsZTxUPiA9IFQgZXh0ZW5kcyBvYmplY3QgPyB7IC1yZWFkb25seSBbSyBpbiBrZXlvZiBUXTogTXV0YWJsZTxUW0tdPiB9IDogVDtcbmV4cG9ydCBjb25zdCBwZXRzID0gc3RydWN0dXJlZENsb25lKGNhdGFsb2dzLnBldHMpIGFzIE11dGFibGU8dHlwZW9mIGNhdGFsb2dzLnBldHM+O1xuZXhwb3J0IGNvbnN0IHRveXMgPSBzdHJ1Y3R1cmVkQ2xvbmUoY2F0YWxvZ3MudG95cykgYXMgTXV0YWJsZTx0eXBlb2YgY2F0YWxvZ3MudG95cz47XG5leHBvcnQgY29uc3QgZm9vZCA9IHN0cnVjdHVyZWRDbG9uZShjYXRhbG9ncy5mb29kKSBhcyBNdXRhYmxlPHR5cGVvZiBjYXRhbG9ncy5mb29kPjtcbmV4cG9ydCBjb25zdCBwZXJrcyA9IHN0cnVjdHVyZWRDbG9uZShjYXRhbG9ncy5wZXJrcykgYXMgTXV0YWJsZTx0eXBlb2YgY2F0YWxvZ3MucGVya3M+O1xuIiwgImltcG9ydCB7IHBldHMgYXMgcGV0c0pzb24gfSBmcm9tICdhcHAvcnVudGltZS9jb250ZW50LWNhdGFsb2dzJztcbmltcG9ydCB7IHRveXMgYXMgdG95c0pzb24gfSBmcm9tICdhcHAvcnVudGltZS9jb250ZW50LWNhdGFsb2dzJztcbmltcG9ydCB7IHBlcmtzIGFzIHBlcmtzSnNvbiB9IGZyb20gJ2FwcC9ydW50aW1lL2NvbnRlbnQtY2F0YWxvZ3MnO1xuXG5pbnRlcmZhY2UgTmFtZUlkRW50cnkge1xuICBOYW1lPzogc3RyaW5nO1xuICBOYW1lSWQ/OiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBBYmlsaXR5RW50cnkge1xuICBMZXZlbD86IG51bWJlcjtcbiAgQWJvdXQ/OiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBQZXRBYmlsaXR5RW50cnkgZXh0ZW5kcyBOYW1lSWRFbnRyeSB7XG4gIEFiaWxpdGllcz86IEFiaWxpdHlFbnRyeVtdO1xuICBQZXJrTm90ZT86IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIFRveUFiaWxpdHlFbnRyeSBleHRlbmRzIE5hbWVJZEVudHJ5IHtcbiAgQWJpbGl0aWVzPzogQWJpbGl0eUVudHJ5W107XG59XG5cbmludGVyZmFjZSBFcXVpcG1lbnRBYmlsaXR5RW50cnkgZXh0ZW5kcyBOYW1lSWRFbnRyeSB7XG4gIEFiaWxpdHk/OiBzdHJpbmc7XG59XG5cbmNvbnN0IGdldE5hbWVMaXN0ID0gKGVudHJpZXM6IE5hbWVJZEVudHJ5W10pOiBzdHJpbmdbXSA9PlxuICBlbnRyaWVzXG4gICAgLm1hcCgoZW50cnkpID0+IGVudHJ5Py5OYW1lKVxuICAgIC5maWx0ZXIoKG5hbWUpOiBuYW1lIGlzIHN0cmluZyA9PiBCb29sZWFuKG5hbWUpKTtcblxuY29uc3QgcGV0TmFtZU92ZXJyaWRlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgJ0JlbHVnYSBXaGFsZSc6ICdXaGl0ZVdoYWxlJyxcbiAgJ0dyZWF0IE9uZSc6ICdDdGh1bHUnLFxuICAnU21hbGwgT25lJzogJ0JhYnlDdGh1bGh1JyxcbiAgQWJvbWluYXRpb246ICdTaG9nZ290aCcsXG4gIFZpc2l0b3I6ICdYZW5vbW9ycGgnLFxuICBTd29yZGZpc2g6ICdTd29yZEZpc2gnLFxuICBEb2Jlcm1hbjogJ0RvYmVybWFuRG9nJyxcbiAgJ0hpZ2hsYW5kIENvdyc6ICdIaWdobGFuZENvdycsXG4gICdTYWJlcnRvb3RoIFRpZ2VyJzogJ1NhYmVyVG9vdGhUaWdlcicsXG4gICdNb2J5IERpY2snOiAnTW9jaGFEaWNrJyxcbiAgJ0NoaW1lcmEgR29hdCc6ICdDaGltZXJhR29hdCcsXG4gICdDaGltZXJhIExpb24nOiAnQ2hpbWVyYUxpb24nLFxuICAnQ2hpbWVyYSBTbmFrZSc6ICdDaGltZXJhU25ha2UnLFxuICBDcmFja2VkRWdnOiAnRWdnTGFkQ3JhY2tlZCcsXG4gICdGYWtlIE5lc3NpZSc6ICdGYWtlTmVzc2llJyxcbiAgJ1RhbmQgYW5kIFRhbmQnOiAnVGhvckdvYXRzJyxcbn07XG5cbmV4cG9ydCBjb25zdCBwZXJrTmFtZU92ZXJyaWRlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgQ29ybmNvYjogJ0Nvcm4nLFxuICAnQ2FrZSBTbGljZSc6ICdCaXJ0aGRheUNha2VTbGljZScsXG4gICdQZWFudXQgQnV0dGVyJzogJ1BlYW51dEJ1dHRlcicsXG4gICdNYW5hIFBvdGlvbic6ICdNYW5hUG90aW9uJyxcbiAgJ0ZhaW50IEJyZWFkJzogJ0RlYWRCcmVhZCcsXG4gIEtpd2lmcnVpdDogJ0tpd2knLFxuICBFZ2dwbGFudDogJ0VnZ1BsYW50JyxcbiAgUmljZTogJ1JpY2VCYWxsJyxcbiAgRG9udXQ6ICdEb3VnaG51dCcsXG4gIENoZXJyeTogJ0NoZXJyaWVzJyxcbiAgJ01lbG9uIFNsaWNlJzogJ1dhdGVyTWVsb24nLFxuICBDb2xkOiAnRnJvemVuJyxcbiAgQ3Jpc3A6ICdCdXJuJyxcbiAgRGF6ZWQ6ICdEZWFmJyxcbiAgSWNreTogJ0FjaWQnLFxuICBJbmtlZDogJ0luaycsXG4gIFNwb29rZWQ6ICdTY2FyZWQnLFxuICBTbGVlcHk6ICdEcm93c3knLFxuICBXZWJiZWQ6ICdXZWInLFxuICBDdXJzZWQ6ICdDdXJzZScsXG4gIFNpbGx5OiAnU2lsbHknLFxuICBCbG9hdGVkOiAnQmxvYXRlZCcsXG59O1xuY29uc3QgcGVya05hbWVPdmVycmlkZXNMb3dlciA9IE9iamVjdC5mcm9tRW50cmllcyhcbiAgT2JqZWN0LmVudHJpZXMocGVya05hbWVPdmVycmlkZXMpLm1hcCgoW2tleSwgdmFsdWVdKSA9PiBbXG4gICAga2V5LnRvTG93ZXJDYXNlKCksXG4gICAgdmFsdWUsXG4gIF0pLFxuKTtcblxuY29uc3Qgbm9ybWFsaXplID0gKG5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gIGlmICghbmFtZSkge1xuICAgIHJldHVybiAnJztcbiAgfVxuICByZXR1cm4gbmFtZS5yZXBsYWNlKC9bXmEtekEtWjAtOV0vZywgJycpO1xufTtcblxuY29uc3QgYnVpbGROYW1lSWRNYXAgPSAoZW50cmllczogTmFtZUlkRW50cnlbXSk6IE1hcDxzdHJpbmcsIHN0cmluZz4gPT4ge1xuICBjb25zdCBtYXAgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICBmb3IgKGNvbnN0IGVudHJ5IG9mIGVudHJpZXMpIHtcbiAgICBpZiAoZW50cnk/Lk5hbWUgJiYgZW50cnk/Lk5hbWVJZCkge1xuICAgICAgbWFwLnNldChlbnRyeS5OYW1lLCBlbnRyeS5OYW1lSWQpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbWFwO1xufTtcblxuY29uc3QgZm9ybWF0QWJpbGl0eVRleHQgPSAoXG4gIGFiaWxpdGllcz86IEFiaWxpdHlFbnRyeVtdLFxuICBwZXJrTm90ZT86IHN0cmluZyxcbik6IHN0cmluZyB8IG51bGwgPT4ge1xuICBjb25zdCBpc05vQWJpbGl0eVRleHQgPSAodGV4dD86IHN0cmluZyk6IGJvb2xlYW4gPT5cbiAgICAhdGV4dCB8fCAvXm5vIGFiaWxpdHlcXC4/JC9pLnRlc3QodGV4dC50cmltKCkpO1xuXG4gIGNvbnN0IGxpbmVzOiBzdHJpbmdbXSA9IFtdO1xuICBpZiAoQXJyYXkuaXNBcnJheShhYmlsaXRpZXMpKSB7XG4gICAgZm9yIChjb25zdCBhYmlsaXR5IG9mIGFiaWxpdGllcykge1xuICAgICAgaWYgKCFhYmlsaXR5Py5BYm91dCB8fCBpc05vQWJpbGl0eVRleHQoYWJpbGl0eS5BYm91dCkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAoYWJpbGl0eS5MZXZlbCAhPSBudWxsKSB7XG4gICAgICAgIGxpbmVzLnB1c2goYEx2JHthYmlsaXR5LkxldmVsfTogJHthYmlsaXR5LkFib3V0fWApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGluZXMucHVzaChhYmlsaXR5LkFib3V0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKHBlcmtOb3RlKSB7XG4gICAgbGluZXMucHVzaChwZXJrTm90ZSk7XG4gIH1cbiAgcmV0dXJuIGxpbmVzLmxlbmd0aCA/IGxpbmVzLmpvaW4oJ1xcbicpIDogbnVsbDtcbn07XG5cbmNvbnN0IHBldE5hbWVJZHMgPSBidWlsZE5hbWVJZE1hcChcbiAgKHBldHNKc29uIGFzIHVua25vd24gYXMgeyBkZWZhdWx0PzogTmFtZUlkRW50cnlbXSB9KS5kZWZhdWx0ID8/XG4gICAgKHBldHNKc29uIGFzIHVua25vd24gYXMgTmFtZUlkRW50cnlbXSkgPz9cbiAgICBbXSxcbik7XG5jb25zdCBwZXRJZEJ5TmFtZSA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG5jb25zdCBwZXRJZEVudHJpZXMgPVxuICAocGV0c0pzb24gYXMgdW5rbm93biBhcyB7IGRlZmF1bHQ/OiBBcnJheTxOYW1lSWRFbnRyeSAmIHsgSWQ/OiBzdHJpbmcgfT4gfSlcbiAgICAuZGVmYXVsdCA/P1xuICAocGV0c0pzb24gYXMgdW5rbm93biBhcyBBcnJheTxOYW1lSWRFbnRyeSAmIHsgSWQ/OiBzdHJpbmcgfT4pID8/XG4gIFtdO1xuZm9yIChjb25zdCBlbnRyeSBvZiBwZXRJZEVudHJpZXMpIHtcbiAgaWYgKCFlbnRyeT8uTmFtZSB8fCAhZW50cnk/LklkKSB7XG4gICAgY29udGludWU7XG4gIH1cbiAgcGV0SWRCeU5hbWUuc2V0KGVudHJ5Lk5hbWUsIGVudHJ5LklkKTtcbn1cbmNvbnN0IHBldEFiaWxpdHlNYXAgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuY29uc3QgcGV0QWJpbGl0eUVudHJpZXMgPVxuICAocGV0c0pzb24gYXMgdW5rbm93biBhcyB7IGRlZmF1bHQ/OiBQZXRBYmlsaXR5RW50cnlbXSB9KS5kZWZhdWx0ID8/XG4gIChwZXRzSnNvbiBhcyB1bmtub3duIGFzIFBldEFiaWxpdHlFbnRyeVtdKSA/P1xuICBbXTtcbmZvciAoY29uc3QgZW50cnkgb2YgcGV0QWJpbGl0eUVudHJpZXMpIHtcbiAgaWYgKCFlbnRyeT8uTmFtZSkge1xuICAgIGNvbnRpbnVlO1xuICB9XG4gIGNvbnN0IGFiaWxpdHlUZXh0ID0gZm9ybWF0QWJpbGl0eVRleHQoZW50cnkuQWJpbGl0aWVzLCBlbnRyeS5QZXJrTm90ZSk7XG4gIGlmIChhYmlsaXR5VGV4dCkge1xuICAgIHBldEFiaWxpdHlNYXAuc2V0KGVudHJ5Lk5hbWUsIGFiaWxpdHlUZXh0KTtcbiAgfVxufVxuY29uc3QgcGV0TmFtZXMgPSBnZXROYW1lTGlzdChcbiAgKHBldHNKc29uIGFzIHVua25vd24gYXMgeyBkZWZhdWx0PzogTmFtZUlkRW50cnlbXSB9KS5kZWZhdWx0ID8/XG4gICAgKHBldHNKc29uIGFzIHVua25vd24gYXMgTmFtZUlkRW50cnlbXSkgPz9cbiAgICBbXSxcbik7XG5jb25zdCB0b3lOYW1lSWRzID0gYnVpbGROYW1lSWRNYXAoXG4gICh0b3lzSnNvbiBhcyB1bmtub3duIGFzIHsgZGVmYXVsdD86IE5hbWVJZEVudHJ5W10gfSkuZGVmYXVsdCA/P1xuICAgICh0b3lzSnNvbiBhcyB1bmtub3duIGFzIE5hbWVJZEVudHJ5W10pID8/XG4gICAgW10sXG4pO1xuY29uc3QgdG95QWJpbGl0eU1hcCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG5jb25zdCB0b3lBYmlsaXR5RW50cmllcyA9XG4gICh0b3lzSnNvbiBhcyB1bmtub3duIGFzIHsgZGVmYXVsdD86IFRveUFiaWxpdHlFbnRyeVtdIH0pLmRlZmF1bHQgPz9cbiAgKHRveXNKc29uIGFzIHVua25vd24gYXMgVG95QWJpbGl0eUVudHJ5W10pID8/XG4gIFtdO1xuZm9yIChjb25zdCBlbnRyeSBvZiB0b3lBYmlsaXR5RW50cmllcykge1xuICBpZiAoIWVudHJ5Py5OYW1lKSB7XG4gICAgY29udGludWU7XG4gIH1cbiAgY29uc3QgYWJpbGl0eVRleHQgPSBmb3JtYXRBYmlsaXR5VGV4dChlbnRyeS5BYmlsaXRpZXMpO1xuICBpZiAoYWJpbGl0eVRleHQpIHtcbiAgICB0b3lBYmlsaXR5TWFwLnNldChlbnRyeS5OYW1lLCBhYmlsaXR5VGV4dCk7XG4gIH1cbn1cbmNvbnN0IHRveU5hbWVzID0gZ2V0TmFtZUxpc3QoXG4gICh0b3lzSnNvbiBhcyB1bmtub3duIGFzIHsgZGVmYXVsdD86IE5hbWVJZEVudHJ5W10gfSkuZGVmYXVsdCA/P1xuICAgICh0b3lzSnNvbiBhcyB1bmtub3duIGFzIE5hbWVJZEVudHJ5W10pID8/XG4gICAgW10sXG4pO1xuY29uc3QgZXF1aXBtZW50TmFtZUlkcyA9IGJ1aWxkTmFtZUlkTWFwKFxuICAocGVya3NKc29uIGFzIHVua25vd24gYXMgeyBkZWZhdWx0PzogTmFtZUlkRW50cnlbXSB9KS5kZWZhdWx0ID8/XG4gICAgKHBlcmtzSnNvbiBhcyB1bmtub3duIGFzIE5hbWVJZEVudHJ5W10pID8/XG4gICAgW10sXG4pO1xuY29uc3QgZXF1aXBtZW50TmFtZUlkc0xvd2VyID0gbmV3IE1hcChcbiAgQXJyYXkuZnJvbShlcXVpcG1lbnROYW1lSWRzLmVudHJpZXMoKSkubWFwKChba2V5LCB2YWx1ZV0pID0+IFtcbiAgICBrZXkudG9Mb3dlckNhc2UoKSxcbiAgICB2YWx1ZSxcbiAgXSksXG4pO1xuY29uc3QgZXF1aXBtZW50TmFtZUlkc05vcm1hbGl6ZWQgPSBuZXcgTWFwKFxuICBBcnJheS5mcm9tKGVxdWlwbWVudE5hbWVJZHMuZW50cmllcygpKS5tYXAoKFtrZXksIHZhbHVlXSkgPT4gW1xuICAgIG5vcm1hbGl6ZShrZXkpLFxuICAgIHZhbHVlLFxuICBdKSxcbik7XG5jb25zdCBlcXVpcG1lbnRBYmlsaXR5TWFwID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbmNvbnN0IGVxdWlwbWVudEFiaWxpdHlFbnRyaWVzID1cbiAgKHBlcmtzSnNvbiBhcyB1bmtub3duIGFzIHsgZGVmYXVsdD86IEVxdWlwbWVudEFiaWxpdHlFbnRyeVtdIH0pLmRlZmF1bHQgPz9cbiAgKHBlcmtzSnNvbiBhcyB1bmtub3duIGFzIEVxdWlwbWVudEFiaWxpdHlFbnRyeVtdKSA/P1xuICBbXTtcbmZvciAoY29uc3QgZW50cnkgb2YgZXF1aXBtZW50QWJpbGl0eUVudHJpZXMpIHtcbiAgaWYgKCFlbnRyeT8uTmFtZSkge1xuICAgIGNvbnRpbnVlO1xuICB9XG4gIGlmIChlbnRyeS5BYmlsaXR5KSB7XG4gICAgZXF1aXBtZW50QWJpbGl0eU1hcC5zZXQoZW50cnkuTmFtZSwgZW50cnkuQWJpbGl0eSk7XG4gIH1cbn1cbmNvbnN0IGVxdWlwbWVudE5hbWVzID0gZ2V0TmFtZUxpc3QoXG4gIChwZXJrc0pzb24gYXMgdW5rbm93biBhcyB7IGRlZmF1bHQ/OiBOYW1lSWRFbnRyeVtdIH0pLmRlZmF1bHQgPz9cbiAgICAocGVya3NKc29uIGFzIHVua25vd24gYXMgTmFtZUlkRW50cnlbXSkgPz9cbiAgICBbXSxcbik7XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0Fzc2V0RmlsZU5hbWUobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIG5vcm1hbGl6ZShuYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBldEljb25GaWxlTmFtZShwZXROYW1lPzogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gIGlmICghcGV0TmFtZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGNvbnN0IG5hbWVJZCA9IHBldE5hbWVJZHMuZ2V0KHBldE5hbWUpO1xuICBpZiAobmFtZUlkKSB7XG4gICAgcmV0dXJuIG5hbWVJZDtcbiAgfVxuICBjb25zdCBtYXBwZWQgPSBwZXROYW1lT3ZlcnJpZGVzW3BldE5hbWVdO1xuICBpZiAobWFwcGVkKSB7XG4gICAgcmV0dXJuIG1hcHBlZDtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBldEljb25QYXRoKHBldE5hbWU/OiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgZmlsZU5hbWUgPSBnZXRQZXRJY29uRmlsZU5hbWUocGV0TmFtZSk7XG4gIGlmICghZmlsZU5hbWUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gYGFzc2V0cy9hcnQvUHVibGljL1B1YmxpYy9QZXRzLyR7ZmlsZU5hbWV9LnBuZ2A7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQZXRBYmlsaXR5VGV4dChwZXROYW1lPzogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gIGlmICghcGV0TmFtZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiBwZXRBYmlsaXR5TWFwLmdldChwZXROYW1lKSA/PyBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGV0U291bmRMb29rdXBJbmZvKFxuICBwZXROYW1lPzogc3RyaW5nLFxuKTogeyBuYW1lSWQ6IHN0cmluZyB8IG51bGw7IHBldElkOiBzdHJpbmcgfCBudWxsIH0gfCBudWxsIHtcbiAgaWYgKCFwZXROYW1lKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBuYW1lSWQ6IHBldE5hbWVJZHMuZ2V0KHBldE5hbWUpID8/IG51bGwsXG4gICAgcGV0SWQ6IHBldElkQnlOYW1lLmdldChwZXROYW1lKSA/PyBudWxsLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsUGV0TmFtZXMoKTogc3RyaW5nW10ge1xuICByZXR1cm4gWy4uLnBldE5hbWVzXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRveUljb25QYXRoKHRveU5hbWU/OiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgaWYgKCF0b3lOYW1lKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgY29uc3QgbmFtZUlkID0gdG95TmFtZUlkcy5nZXQodG95TmFtZSk7XG4gIGNvbnN0IGZpbGVOYW1lID0gbmFtZUlkID8/IG5vcm1hbGl6ZSh0b3lOYW1lKTtcbiAgaWYgKCFmaWxlTmFtZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiBgYXNzZXRzL2FydC9QdWJsaWMvUHVibGljL1RveXMvJHtmaWxlTmFtZX0ucG5nYDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRveUFiaWxpdHlUZXh0KHRveU5hbWU/OiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgaWYgKCF0b3lOYW1lKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHRveUFiaWxpdHlNYXAuZ2V0KHRveU5hbWUpID8/IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBbGxUb3lOYW1lcygpOiBzdHJpbmdbXSB7XG4gIHJldHVybiBbLi4udG95TmFtZXNdO1xufVxuXG5jb25zdCBnZXRFcXVpcG1lbnRGaWxlTmFtZSA9IChlcXVpcG1lbnROYW1lPzogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCA9PiB7XG4gIGlmICghZXF1aXBtZW50TmFtZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemUoZXF1aXBtZW50TmFtZSk7XG4gIGNvbnN0IG5hbWVJZCA9XG4gICAgZXF1aXBtZW50TmFtZUlkcy5nZXQoZXF1aXBtZW50TmFtZSkgPz9cbiAgICBlcXVpcG1lbnROYW1lSWRzTG93ZXIuZ2V0KGVxdWlwbWVudE5hbWUudG9Mb3dlckNhc2UoKSkgPz9cbiAgICBlcXVpcG1lbnROYW1lSWRzTm9ybWFsaXplZC5nZXQobm9ybWFsaXplZCk7XG4gIGNvbnN0IG92ZXJyaWRlID1cbiAgICBwZXJrTmFtZU92ZXJyaWRlc1tlcXVpcG1lbnROYW1lXSA/P1xuICAgIHBlcmtOYW1lT3ZlcnJpZGVzTG93ZXJbZXF1aXBtZW50TmFtZS50b0xvd2VyQ2FzZSgpXTtcbiAgY29uc3QgZmlsZU5hbWUgPSBuYW1lSWQgPz8gb3ZlcnJpZGUgPz8gbm9ybWFsaXplZDtcbiAgcmV0dXJuIGZpbGVOYW1lIHx8IG51bGw7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RXF1aXBtZW50SWNvblBhdGgoXG4gIGVxdWlwbWVudE5hbWU/OiBzdHJpbmcsXG4gIGlzQWlsbWVudCA9IGZhbHNlLFxuKTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IGZpbGVOYW1lID0gZ2V0RXF1aXBtZW50RmlsZU5hbWUoZXF1aXBtZW50TmFtZSk7XG4gIGlmICghZmlsZU5hbWUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBpZiAoaXNBaWxtZW50KSB7XG4gICAgcmV0dXJuIGBhc3NldHMvYXJ0L0FpbG1lbnRzL0FpbG1lbnRzLyR7ZmlsZU5hbWV9LnBuZ2A7XG4gIH1cbiAgcmV0dXJuIGBhc3NldHMvYXJ0L1B1YmxpYy9QdWJsaWMvRm9vZC8ke2ZpbGVOYW1lfS5wbmdgO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RXF1aXBtZW50QWJpbGl0eVRleHQoZXF1aXBtZW50TmFtZT86IHN0cmluZyk6IHN0cmluZyB8IG51bGwge1xuICBpZiAoIWVxdWlwbWVudE5hbWUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gZXF1aXBtZW50QWJpbGl0eU1hcC5nZXQoZXF1aXBtZW50TmFtZSkgPz8gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFsbEVxdWlwbWVudE5hbWVzKCk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIFsuLi5lcXVpcG1lbnROYW1lc107XG59XG5cbmNvbnN0IHBhY2tOYW1lVG9QZXRNYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIFR1cnRsZTogJ1R1cnRsZScsXG4gIEdvbGRlbjogJ0dvbGRlbiBSZXRyaWV2ZXInLFxuICBQdXBweTogJ1B1cHB5JyxcbiAgU3RhcjogJ1N0YXJmaXNoJyxcbiAgVW5pY29ybjogJ1VuaWNvcm4nLFxuICBEYW5nZXI6ICdCbHVlIFdoYWxlJyxcbiAgQ3VzdG9tOiAnV2hpdGUgVGlnZXInLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhY2tJY29uUGF0aChwYWNrTmFtZT86IHN0cmluZyk6IHN0cmluZyB8IG51bGwge1xuICBpZiAoIXBhY2tOYW1lIHx8IHBhY2tOYW1lID09PSAnQWRkIEN1c3RvbSBQYWNrJykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGNvbnN0IHBldE5hbWUgPSBwYWNrTmFtZVRvUGV0TWFwW3BhY2tOYW1lXTtcbiAgaWYgKHBldE5hbWUpIHtcbiAgICByZXR1cm4gZ2V0UGV0SWNvblBhdGgocGV0TmFtZSk7XG4gIH1cbiAgLy8gRm9yIGN1c3RvbSBwYWNrcyAodXNlci1jcmVhdGVkKSwgdXNlIFdoaXRlIFRpZ2VyIGFzIGRlZmF1bHRcbiAgcmV0dXJuIGdldFBldEljb25QYXRoKCdXaGl0ZSBUaWdlcicpO1xufVxuIiwgImV4cG9ydCBjb25zdCBFUVVJUE1FTlRfQ0FURUdPUklFUzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmdbXSB9ID0ge1xuICBUdXJ0bGU6IFtcbiAgICAnQnJlYWQnLFxuICAgICdDYWtlJyxcbiAgICAnQ2hpbGknLFxuICAgICdDb2NvbnV0JyxcbiAgICAnR2FybGljJyxcbiAgICAnSG9uZXknLFxuICAgICdNZWF0IEJvbmUnLFxuICAgICdNZWxvbicsXG4gICAgJ011c2hyb29tJyxcbiAgICAnUGVhbnV0JyxcbiAgICAnU3RlYWsnLFxuICBdLFxuICBQdXBweTogW1xuICAgICdCbGFja2JlcnJ5JyxcbiAgICAnQ3JvaXNzYW50JyxcbiAgICAnRWdnJyxcbiAgICAnRXVjYWx5cHR1cycsXG4gICAgJ0xlbW9uJyxcbiAgICAnTGltZScsXG4gICAgJ01pbGQgQ2hpbGknLFxuICAgICdQYW5jYWtlcycsXG4gICAgJ1BpZScsXG4gICAgJ1JpY2UnLFxuICAgICdTYWx0JyxcbiAgICAnU2tld2VyJyxcbiAgICAnU3F1YXNoJyxcbiAgICAnV2FsbnV0JyxcbiAgXSxcbiAgU3RhcjogW1xuICAgICdCYWd1ZXR0ZScsXG4gICAgJ0NhcmFtZWwnLFxuICAgICdDYXJyb3QnLFxuICAgICdDaGVlc2UnLFxuICAgICdDdWN1bWJlcicsXG4gICAgJ0dyYXBlcycsXG4gICAgJ1BlcHBlcicsXG4gICAgJ1BvcGNvcm4nLFxuICAgICdTZWF3ZWVkJyxcbiAgICAnU3RyYXdiZXJyeScsXG4gIF0sXG4gIEdvbGRlbjogW1xuICAgICdCYW5hbmEnLFxuICAgICdCb2sgQ2hveScsXG4gICAgJ0NoZXJyeScsXG4gICAgJ0Nob2NvbGF0ZSBDYWtlJyxcbiAgICAnRHVyaWFuJyxcbiAgICAnRWdncGxhbnQnLFxuICAgICdGaWcnLFxuICAgICdIb25leWRldyBNZWxvbicsXG4gICAgJ01hcGxlIFN5cnVwJyxcbiAgICAnT25pb24nLFxuICAgICdQaXRhIEJyZWFkJyxcbiAgICAnUG90YXRvJyxcbiAgICAnVG9tYXRvJyxcbiAgXSxcbiAgVW5pY29ybjogW1xuICAgICdBbWJyb3NpYScsXG4gICAgJ0Vhc3RlciBFZ2cnLFxuICAgICdGYWludCBCcmVhZCcsXG4gICAgJ0ZhaXJ5IER1c3QnLFxuICAgICdHaW5nZXJicmVhZCBNYW4nLFxuICAgICdHb2xkZW4gRWdnJyxcbiAgICAnSGVhbHRoIFBvdGlvbicsXG4gICAgJ0xvdmUgUG90aW9uJyxcbiAgICAnTWFnaWMgQmVhbnMnLFxuICAgICdSYW1idXRhbicsXG4gICAgJ1lnZ2RyYXNpbCBGcnVpdCcsXG4gIF0sXG4gIERhbmdlcjogW1xuICAgICdDb2NvYSBCZWFuJyxcbiAgICAnQ29kIFJvZScsXG4gICAgJ0dyb3MgTWljaGVsIEJhbmFuYScsXG4gICAgJ0dlZWNoZWUgUmVkIFBlYScsXG4gICAgJ1N1ZGR1dGggVG9tYXRvJyxcbiAgICAnV2hpdGUgT2tyYScsXG4gICAgJ1doaXRlIFRydWZmbGUnLFxuICBdLFxuICBDdXN0b206IFtcbiAgICAnQmx1ZWJlcnJ5JyxcbiAgICAnQnJ1c3NlbHMgU3Byb3V0JyxcbiAgICAnQ2FzaGV3IE51dCcsXG4gICAgJ0NhdWxpZmxvd2VyJyxcbiAgICAnQ2h1cnJvcycsXG4gICAgJ0RvbnV0JyxcbiAgICAnRm9ydHVuZSBDb29raWUnLFxuICAgICdHdWF2YScsXG4gICAgJ0tpd2FubycsXG4gICAgJ0tpd2lmcnVpdCcsXG4gICAgJ01hY2Fyb24nLFxuICAgICdNZWxvbiBTbGljZScsXG4gICAgJ05hY2hvcycsXG4gICAgJ095c3RlciBNdXNocm9vbScsXG4gICAgJ1BpbmVhcHBsZScsXG4gICAgJ1JhZGlzaCcsXG4gICAgJ1NhcmRpbmlhbiBDdXJyYW50JyxcbiAgICAnU2F1c2FnZScsXG4gICAgJ1VuYWdpJyxcbiAgXSxcbiAgSGlkZGVuOiBbJ0Nha2UgU2xpY2UnLCAnUGVhbnV0IEJ1dHRlciddLFxufTtcblxuZXhwb3J0IGNvbnN0IEFJTE1FTlRfQ0FURUdPUklFUzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmdbXSB9ID0ge1xuICBBaWxtZW50czogW1xuICAgICdCbG9hdGVkJyxcbiAgICAnQ29sZCcsXG4gICAgJ0NvbmZ1c2VkJyxcbiAgICAnQ293YXJkbHknLFxuICAgICdDcmlzcCcsXG4gICAgJ0N1cnNlZCcsXG4gICAgJ0RhemVkJyxcbiAgICAnSWNreScsXG4gICAgJ0lua2VkJyxcbiAgICAnU2FkJyxcbiAgICAnU2lsbHknLFxuICAgICdTbGVlcHknLFxuICAgICdTcG9va2VkJyxcbiAgICAnVGFzdHknLFxuICAgICdUb2FzdHknLFxuICAgICdXZWFrJyxcbiAgICAnV2ViYmVkJyxcbiAgXSxcbn07XG4iLCAiaW1wb3J0IHtcbiAgZ2V0RXF1aXBtZW50SWNvblBhdGgsXG4gIGdldFBldEljb25QYXRoLFxuICBnZXRUb3lJY29uUGF0aCxcbn0gZnJvbSAnYXBwL3J1bnRpbWUvYXNzZXQtY2F0YWxvZyc7XG5cbmV4cG9ydCB0eXBlIElubGluZUljb25UeXBlID0gJ3BldCcgfCAndG95JyB8ICdlcXVpcG1lbnQnO1xuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGROYW1lUmVnZXgobmFtZXM6IHN0cmluZ1tdKTogUmVnRXhwIHwgbnVsbCB7XG4gIGNvbnN0IGVzY2FwZWQgPSBuYW1lc1xuICAgIC5maWx0ZXIoKG5hbWUpID0+IEJvb2xlYW4obmFtZSkpXG4gICAgLnNvcnQoKGEsIGIpID0+IGIubGVuZ3RoIC0gYS5sZW5ndGgpXG4gICAgLm1hcCgobmFtZSkgPT4gZXNjYXBlUmVnRXhwKG5hbWUpKTtcbiAgaWYgKCFlc2NhcGVkLmxlbmd0aCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiBuZXcgUmVnRXhwKFxuICAgIGAoPzwhW0EtWmEtejAtOV0pKCR7ZXNjYXBlZC5qb2luKCd8Jyl9KSg/IVtBLVphLXowLTldKWAsXG4gICAgJ2cnLFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRJbmxpbmVOYW1lVHlwZU1hcChcbiAgcGV0TmFtZXM6IHN0cmluZ1tdLFxuICB0b3lOYW1lczogc3RyaW5nW10sXG4gIGVxdWlwbWVudE5hbWVzOiBzdHJpbmdbXSxcbik6IE1hcDxzdHJpbmcsIElubGluZUljb25UeXBlPiB7XG4gIGNvbnN0IG1hcCA9IG5ldyBNYXA8c3RyaW5nLCBJbmxpbmVJY29uVHlwZT4oKTtcbiAgZm9yIChjb25zdCBuYW1lIG9mIGVxdWlwbWVudE5hbWVzKSB7XG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIG1hcC5zZXQobmFtZSwgJ2VxdWlwbWVudCcpO1xuICAgIH1cbiAgfVxuICBmb3IgKGNvbnN0IG5hbWUgb2YgdG95TmFtZXMpIHtcbiAgICBpZiAobmFtZSkge1xuICAgICAgbWFwLnNldChuYW1lLCAndG95Jyk7XG4gICAgfVxuICB9XG4gIGZvciAoY29uc3QgbmFtZSBvZiBwZXROYW1lcykge1xuICAgIGlmIChuYW1lKSB7XG4gICAgICBtYXAuc2V0KG5hbWUsICdwZXQnKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG1hcDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkSW5saW5lTmFtZVJlZ2V4KFxuICBwZXROYW1lczogc3RyaW5nW10sXG4gIHRveU5hbWVzOiBzdHJpbmdbXSxcbiAgZXF1aXBtZW50TmFtZXM6IHN0cmluZ1tdLFxuKTogUmVnRXhwIHwgbnVsbCB7XG4gIGNvbnN0IGNvbWJpbmVkID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIHBldE5hbWVzLmZvckVhY2goKG5hbWUpID0+IG5hbWUgJiYgY29tYmluZWQuYWRkKG5hbWUpKTtcbiAgdG95TmFtZXMuZm9yRWFjaCgobmFtZSkgPT4gbmFtZSAmJiBjb21iaW5lZC5hZGQobmFtZSkpO1xuICBlcXVpcG1lbnROYW1lcy5mb3JFYWNoKChuYW1lKSA9PiBuYW1lICYmIGNvbWJpbmVkLmFkZChuYW1lKSk7XG4gIHJldHVybiBidWlsZE5hbWVSZWdleChBcnJheS5mcm9tKGNvbWJpbmVkKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWNvcmF0ZUlubGluZUljb25zKFxuICBtZXNzYWdlOiBzdHJpbmcsXG4gIGlubGluZU5hbWVSZWdleDogUmVnRXhwIHwgbnVsbCxcbiAgaW5saW5lTmFtZVR5cGVNYXA6IE1hcDxzdHJpbmcsIElubGluZUljb25UeXBlPixcbiAgYWlsbWVudE5hbWVzOiBTZXQ8c3RyaW5nPixcbik6IHN0cmluZyB7XG4gIGlmICghbWVzc2FnZSB8fCBtZXNzYWdlLmluY2x1ZGVzKCc8aW1nJykgfHwgIWlubGluZU5hbWVSZWdleCkge1xuICAgIHJldHVybiBtZXNzYWdlO1xuICB9XG4gIGxldCB1cGRhdGVkID0gcmVwbGFjZU1hdGNoZXNXaXRoSWNvbnNPdXRzaWRlVGFncyhcbiAgICBtZXNzYWdlLFxuICAgIGlubGluZU5hbWVSZWdleCxcbiAgICAobmFtZSkgPT4gZ2V0SW5saW5lSWNvblBhdGgobmFtZSwgaW5saW5lTmFtZVR5cGVNYXAsIGFpbG1lbnROYW1lcyksXG4gICAgKG5hbWUpID0+IGdldElubGluZUljb25IdG1sKG5hbWUsIGlubGluZU5hbWVUeXBlTWFwLCBhaWxtZW50TmFtZXMpLFxuICApO1xuICBjb25zdCBtYW5hSWNvbiA9XG4gICAgJ2Fzc2V0cy9hcnQvUHVibGljL1B1YmxpYy9JY29ucy9UZXh0TWFwLXJlc291cmNlcy5hc3NldHMtMzEtc3BsaXQvbWFuYS5wbmcnO1xuICBjb25zdCBtYW5hUmVnZXggPSAvKD88IVtBLVphLXowLTldKW1hbmEoPyFbQS1aYS16MC05XSkoPyFcXHMrUG90aW9uKS9naTtcbiAgdXBkYXRlZCA9IHJlcGxhY2VNYXRjaGVzV2l0aEljb25zT3V0c2lkZVRhZ3ModXBkYXRlZCwgbWFuYVJlZ2V4LCAoKSA9PiBtYW5hSWNvbik7XG4gIGNvbnN0IGV4cEljb24gPVxuICAgICdhc3NldHMvYXJ0L1B1YmxpYy9QdWJsaWMvSWNvbnMvVGV4dE1hcC1yZXNvdXJjZXMuYXNzZXRzLTMxLXNwbGl0L3hwLnBuZyc7XG4gIGNvbnN0IGV4cFJlZ2V4ID0gLyg/PCFbQS1aYS16MC05XSkoPzp4cHxleHApKD8hW0EtWmEtejAtOV0pL2dpO1xuICB1cGRhdGVkID0gcmVwbGFjZU1hdGNoZXNXaXRoSWNvbnNPdXRzaWRlVGFncyh1cGRhdGVkLCBleHBSZWdleCwgKCkgPT4gZXhwSWNvbik7XG4gIGNvbnN0IGdvbGRJY29uID1cbiAgICAnYXNzZXRzL2FydC9QdWJsaWMvUHVibGljL0ljb25zL1RleHRNYXAtcmVzb3VyY2VzLmFzc2V0cy0zMS1zcGxpdC9nb2xkLnBuZyc7XG4gIGNvbnN0IGdvbGRSZWdleCA9IC8oPzwhW0EtWmEtejAtOV0pZ29sZCg/IVtBLVphLXowLTldKS9naTtcbiAgdXBkYXRlZCA9IHJlcGxhY2VNYXRjaGVzV2l0aEljb25zT3V0c2lkZVRhZ3ModXBkYXRlZCwgZ29sZFJlZ2V4LCAoKSA9PiBnb2xkSWNvbik7XG4gIGNvbnN0IHRydW1wZXRJY29uID1cbiAgICAnYXNzZXRzL2FydC9QdWJsaWMvUHVibGljL0ljb25zL1RleHRNYXAtcmVzb3VyY2VzLmFzc2V0cy0zMS1zcGxpdC90cnVtcGV0LnBuZyc7XG4gIGNvbnN0IHRydW1wZXRSZWdleCA9IC8oPzwhW0EtWmEtejAtOV0pdHJ1bXBldHM/KD8hW0EtWmEtejAtOV0pL2dpO1xuICB1cGRhdGVkID0gcmVwbGFjZU1hdGNoZXNXaXRoSWNvbnNPdXRzaWRlVGFncyhcbiAgICB1cGRhdGVkLFxuICAgIHRydW1wZXRSZWdleCxcbiAgICAoKSA9PiB0cnVtcGV0SWNvbixcbiAgKTtcbiAgcmV0dXJuIHVwZGF0ZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbmxpbmVJY29uUGF0aChcbiAgbmFtZTogc3RyaW5nLFxuICBpbmxpbmVOYW1lVHlwZU1hcDogTWFwPHN0cmluZywgSW5saW5lSWNvblR5cGU+LFxuICBhaWxtZW50TmFtZXM6IFNldDxzdHJpbmc+LFxuKTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IHR5cGUgPSBpbmxpbmVOYW1lVHlwZU1hcC5nZXQobmFtZSkgPz8gbnVsbDtcbiAgaWYgKHR5cGUgPT09ICdwZXQnKSB7XG4gICAgcmV0dXJuIGdldFBldEljb25QYXRoKG5hbWUpO1xuICB9XG4gIGlmICh0eXBlID09PSAndG95Jykge1xuICAgIHJldHVybiBnZXRUb3lJY29uUGF0aChuYW1lKTtcbiAgfVxuICBpZiAodHlwZSA9PT0gJ2VxdWlwbWVudCcpIHtcbiAgICBjb25zdCBpc0FpbG1lbnQgPSBhaWxtZW50TmFtZXMuaGFzKG5hbWUpO1xuICAgIHJldHVybiAoXG4gICAgICBnZXRFcXVpcG1lbnRJY29uUGF0aChuYW1lLCBpc0FpbG1lbnQpID8/IGdldEVxdWlwbWVudEljb25QYXRoKG5hbWUsICFpc0FpbG1lbnQpXG4gICAgKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldElubGluZUljb25IdG1sKFxuICBuYW1lOiBzdHJpbmcsXG4gIGlubGluZU5hbWVUeXBlTWFwOiBNYXA8c3RyaW5nLCBJbmxpbmVJY29uVHlwZT4sXG4gIGFpbG1lbnROYW1lczogU2V0PHN0cmluZz4sXG4pOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgdHlwZSA9IGlubGluZU5hbWVUeXBlTWFwLmdldChuYW1lKSA/PyBudWxsO1xuICBpZiAodHlwZSAhPT0gJ2VxdWlwbWVudCcpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBjb25zdCBpc0FpbG1lbnQgPSBhaWxtZW50TmFtZXMuaGFzKG5hbWUpO1xuICBjb25zdCBwcmltYXJ5ID0gZ2V0RXF1aXBtZW50SWNvblBhdGgobmFtZSwgaXNBaWxtZW50KTtcbiAgaWYgKCFwcmltYXJ5KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgY29uc3Qgc2Vjb25kYXJ5ID0gZ2V0RXF1aXBtZW50SWNvblBhdGgobmFtZSwgIWlzQWlsbWVudCk7XG4gIGNvbnN0IHNlY29uZGFyeUF0dHIgPSBzZWNvbmRhcnlcbiAgICA/IGB0aGlzLmRhdGFzZXQuc3RlcD0nMSc7dGhpcy5zcmM9JyR7c2Vjb25kYXJ5fSc7YFxuICAgIDogYHRoaXMuZGF0YXNldC5zdGVwPScxJztgO1xuICByZXR1cm4gYDxpbWcgc3JjPVwiJHtwcmltYXJ5fVwiIGNsYXNzPVwibG9nLWlubGluZS1pY29uXCIgYWx0PVwiJHtuYW1lfVwiIG9uZXJyb3I9XCJpZighdGhpcy5kYXRhc2V0LnN0ZXApeyR7c2Vjb25kYXJ5QXR0cn1yZXR1cm47fXRoaXMucmVtb3ZlKCk7XCI+ICR7bmFtZX1gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVwbGFjZU1hdGNoZXNXaXRoSWNvbnNPdXRzaWRlVGFncyhcbiAgbWVzc2FnZTogc3RyaW5nLFxuICByZWdleDogUmVnRXhwLFxuICBnZXRJY29uOiAobmFtZTogc3RyaW5nKSA9PiBzdHJpbmcgfCBudWxsLFxuICBnZXRIdG1sPzogKG5hbWU6IHN0cmluZywgaWNvbjogc3RyaW5nIHwgbnVsbCkgPT4gc3RyaW5nIHwgbnVsbCxcbik6IHN0cmluZyB7XG4gIHJldHVybiBtZXNzYWdlXG4gICAgLnNwbGl0KC8oPFtePl0rPikvZylcbiAgICAubWFwKChzZWdtZW50KSA9PlxuICAgICAgc2VnbWVudC5zdGFydHNXaXRoKCc8JylcbiAgICAgICAgPyBzZWdtZW50XG4gICAgICAgIDogcmVwbGFjZU1hdGNoZXNXaXRoSWNvbnMoc2VnbWVudCwgcmVnZXgsIGdldEljb24sIGdldEh0bWwpLFxuICAgIClcbiAgICAuam9pbignJyk7XG59XG5cbmZ1bmN0aW9uIHJlcGxhY2VNYXRjaGVzV2l0aEljb25zKFxuICBtZXNzYWdlOiBzdHJpbmcsXG4gIHJlZ2V4OiBSZWdFeHAsXG4gIGdldEljb246IChuYW1lOiBzdHJpbmcpID0+IHN0cmluZyB8IG51bGwsXG4gIGdldEh0bWw/OiAobmFtZTogc3RyaW5nLCBpY29uOiBzdHJpbmcgfCBudWxsKSA9PiBzdHJpbmcgfCBudWxsLFxuKTogc3RyaW5nIHtcbiAgaWYgKCFyZWdleCkge1xuICAgIHJldHVybiBtZXNzYWdlO1xuICB9XG4gIHJldHVybiBtZXNzYWdlLnJlcGxhY2UocmVnZXgsIChtYXRjaCkgPT4ge1xuICAgIGNvbnN0IGljb24gPSBnZXRJY29uKG1hdGNoKTtcbiAgICBpZiAoZ2V0SHRtbCkge1xuICAgICAgY29uc3QgaHRtbCA9IGdldEh0bWwobWF0Y2gsIGljb24pO1xuICAgICAgaWYgKGh0bWwpIHtcbiAgICAgICAgcmV0dXJuIGh0bWw7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghaWNvbikge1xuICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH1cbiAgICByZXR1cm4gYDxpbWcgc3JjPVwiJHtpY29ufVwiIGNsYXNzPVwibG9nLWlubGluZS1pY29uXCIgYWx0PVwiJHttYXRjaH1cIiBvbmVycm9yPVwidGhpcy5yZW1vdmUoKVwiPiAke21hdGNofWA7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBlc2NhcGVSZWdFeHAodmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiB2YWx1ZS5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgJ1xcXFwkJicpO1xufVxuIiwgImltcG9ydCB7IExvZyB9IGZyb20gJ2FwcC9kb21haW4vaW50ZXJmYWNlcy9sb2cuaW50ZXJmYWNlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1lcmdlZEF0dGFja0hlYWx0aE1lc3NhZ2UoXG4gIGxhc3RMb2c6IExvZyB8IHVuZGVmaW5lZCxcbiAgbmV4dExvZzogTG9nLFxuKTogc3RyaW5nIHwgbnVsbCB7XG4gIGlmICghbGFzdExvZyB8fCAhbmV4dExvZykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGlmIChsYXN0TG9nLm5vQ29sbGFwc2UgfHwgbmV4dExvZy5ub0NvbGxhcHNlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgaWYgKGxhc3RMb2cucGxheWVyICE9PSBuZXh0TG9nLnBsYXllcikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGlmIChsYXN0TG9nLnR5cGUgIT09IG5leHRMb2cudHlwZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGlmIChsYXN0TG9nLnJhbmRvbUV2ZW50ICE9PSBuZXh0TG9nLnJhbmRvbUV2ZW50KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgaWYgKGxhc3RMb2cucmFuZG9tRXZlbnRSZWFzb24gIT09IG5leHRMb2cucmFuZG9tRXZlbnRSZWFzb24pIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBpZiAoXG4gICAgbGFzdExvZy5zb3VyY2VQZXQgIT09IG5leHRMb2cuc291cmNlUGV0IHx8XG4gICAgbGFzdExvZy5zb3VyY2VJbmRleCAhPT0gbmV4dExvZy5zb3VyY2VJbmRleFxuICApIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBpZiAoXG4gICAgbGFzdExvZy50YXJnZXRQZXQgIT09IG5leHRMb2cudGFyZ2V0UGV0IHx8XG4gICAgbGFzdExvZy50YXJnZXRJbmRleCAhPT0gbmV4dExvZy50YXJnZXRJbmRleFxuICApIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBpZiAobGFzdExvZy50aWdlciAhPT0gbmV4dExvZy50aWdlcikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGlmIChsYXN0TG9nLnB1bWEgIT09IG5leHRMb2cucHVtYSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGlmIChsYXN0TG9nLnB0ZXJhbm9kb24gIT09IG5leHRMb2cucHRlcmFub2Rvbikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGNvbnN0IGxhc3RQYW50aGVyID0gbGFzdExvZy5wYW50aGVyTXVsdGlwbGllciA/PyBudWxsO1xuICBjb25zdCBuZXh0UGFudGhlciA9IG5leHRMb2cucGFudGhlck11bHRpcGxpZXIgPz8gbnVsbDtcbiAgaWYgKGxhc3RQYW50aGVyICE9PSBuZXh0UGFudGhlcikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgbGFzdFRleHQgPSBzdHJpcFRhZ3MobGFzdExvZy5yYXdNZXNzYWdlID8/IGxhc3RMb2cubWVzc2FnZSA/PyAnJyk7XG4gIGNvbnN0IG5leHRUZXh0ID0gc3RyaXBUYWdzKG5leHRMb2cucmF3TWVzc2FnZSA/PyBuZXh0TG9nLm1lc3NhZ2UgPz8gJycpO1xuICBpZiAoIWxhc3RUZXh0IHx8ICFuZXh0VGV4dCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGlmIChcbiAgICBsYXN0VGV4dC5pbmNsdWRlcygnIGF0dGFjayBhbmQgJykgfHxcbiAgICBsYXN0VGV4dC5pbmNsdWRlcygnIGhlYWx0aCBhbmQgJykgfHxcbiAgICBuZXh0VGV4dC5pbmNsdWRlcygnIGF0dGFjayBhbmQgJykgfHxcbiAgICBuZXh0VGV4dC5pbmNsdWRlcygnIGhlYWx0aCBhbmQgJylcbiAgKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIGNvbWJpbmVBdHRhY2tIZWFsdGhMb2dzKGxhc3RUZXh0LCBuZXh0VGV4dCkgPz9cbiAgICBjb21iaW5lQXR0YWNrSGVhbHRoTG9ncyhuZXh0VGV4dCwgbGFzdFRleHQpXG4gICk7XG59XG5cbmZ1bmN0aW9uIGNvbWJpbmVBdHRhY2tIZWFsdGhMb2dzKFxuICBhdHRhY2tMb2c6IHN0cmluZyxcbiAgaGVhbHRoTG9nOiBzdHJpbmcsXG4pOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgbG9zc0F0dGFjayA9IHBhcnNlU3RhdExvZyhhdHRhY2tMb2csICdsb3N0JywgJ2F0dGFjaycpO1xuICBjb25zdCBsb3NzSGVhbHRoID0gcGFyc2VTdGF0TG9nKGhlYWx0aExvZywgJ2xvc3QnLCAnaGVhbHRoJyk7XG4gIGlmIChsb3NzQXR0YWNrICYmIGxvc3NIZWFsdGgpIHtcbiAgICBpZiAoXG4gICAgICBsb3NzQXR0YWNrLnByZWZpeCA9PT0gbG9zc0hlYWx0aC5wcmVmaXggJiZcbiAgICAgIGxvc3NBdHRhY2suc3VmZml4ID09PSBsb3NzSGVhbHRoLnN1ZmZpeFxuICAgICkge1xuICAgICAgcmV0dXJuIGAke2xvc3NBdHRhY2sucHJlZml4fSR7bG9zc0F0dGFjay52YWx1ZX0gYXR0YWNrIGFuZCAke2xvc3NIZWFsdGgudmFsdWV9IGhlYWx0aCR7bG9zc0F0dGFjay5zdWZmaXh9YDtcbiAgICB9XG4gIH1cblxuICBjb25zdCBnYWluQXR0YWNrID0gcGFyc2VTdGF0TG9nKGF0dGFja0xvZywgJ2dhdmUnLCAnYXR0YWNrJyk7XG4gIGNvbnN0IGdhaW5IZWFsdGggPSBwYXJzZVN0YXRMb2coaGVhbHRoTG9nLCAnZ2F2ZScsICdoZWFsdGgnKTtcbiAgaWYgKGdhaW5BdHRhY2sgJiYgZ2FpbkhlYWx0aCkge1xuICAgIGlmIChcbiAgICAgIGdhaW5BdHRhY2sucHJlZml4ID09PSBnYWluSGVhbHRoLnByZWZpeCAmJlxuICAgICAgZ2FpbkF0dGFjay5zdWZmaXggPT09IGdhaW5IZWFsdGguc3VmZml4XG4gICAgKSB7XG4gICAgICByZXR1cm4gYCR7Z2FpbkF0dGFjay5wcmVmaXh9JHtnYWluQXR0YWNrLnBsdXN9JHtnYWluQXR0YWNrLnZhbHVlfSBhdHRhY2sgYW5kICR7Z2FpbkhlYWx0aC5wbHVzfSR7Z2FpbkhlYWx0aC52YWx1ZX0gaGVhbHRoJHtnYWluQXR0YWNrLnN1ZmZpeH1gO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBwYXJzZVN0YXRMb2coXG4gIG1lc3NhZ2U6IHN0cmluZyxcbiAgdmVyYjogJ2xvc3QnIHwgJ2dhdmUnLFxuICBzdGF0OiAnYXR0YWNrJyB8ICdoZWFsdGgnLFxuKTogeyBwcmVmaXg6IHN0cmluZzsgcGx1czogc3RyaW5nOyB2YWx1ZTogc3RyaW5nOyBzdWZmaXg6IHN0cmluZyB9IHwgbnVsbCB7XG4gIGlmICh2ZXJiID09PSAnbG9zdCcpIHtcbiAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoYF4oLipcXFxcYmxvc3RcXFxccyspKFxcXFxkKylcXFxccyske3N0YXR9XFxcXGIoLiopJGAsICdpJyk7XG4gICAgY29uc3QgbWF0Y2ggPSBtZXNzYWdlLm1hdGNoKHJlZ2V4KTtcbiAgICBpZiAoIW1hdGNoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHByZWZpeDogbWF0Y2hbMV0sXG4gICAgICBwbHVzOiAnJyxcbiAgICAgIHZhbHVlOiBtYXRjaFsyXSxcbiAgICAgIHN1ZmZpeDogbWF0Y2hbM10sXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChcbiAgICBgXiguKlxcXFxiKD86Z2F2ZXxnaXZlfGdpdmVzKVxcXFxiLio/XFxcXHMrKShcXFxcKz8pKFxcXFxkKylcXFxccyske3N0YXR9XFxcXGIoLiopJGAsXG4gICAgJ2knLFxuICApO1xuICBjb25zdCBtYXRjaCA9IG1lc3NhZ2UubWF0Y2gocmVnZXgpO1xuICBpZiAoIW1hdGNoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBwcmVmaXg6IG1hdGNoWzFdLFxuICAgIHBsdXM6IG1hdGNoWzJdID8/ICcnLFxuICAgIHZhbHVlOiBtYXRjaFszXSxcbiAgICBzdWZmaXg6IG1hdGNoWzRdLFxuICB9O1xufVxuXG5mdW5jdGlvbiBzdHJpcFRhZ3MobWVzc2FnZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIG1lc3NhZ2UucmVwbGFjZSgvPFtePl0rPi9nLCAnJykudHJpbSgpO1xufVxuIiwgImltcG9ydCB7IFBldCB9IGZyb20gJ2FwcC9kb21haW4vZW50aXRpZXMvcGV0LmNsYXNzJztcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJ2FwcC9kb21haW4vZW50aXRpZXMvcGxheWVyLmNsYXNzJztcbmltcG9ydCB7IGdldEVxdWlwbWVudEljb25QYXRoLCBnZXRQZXRJY29uUGF0aCB9IGZyb20gJ2FwcC9ydW50aW1lL2Fzc2V0LWNhdGFsb2cnO1xuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRCb2FyZFN0YXRlTWVzc2FnZShcbiAgcGxheWVyOiBQbGF5ZXIsXG4gIG9wcG9uZW50OiBQbGF5ZXIsXG4gIGdldEZyb250SW5kZXg6IChwZXQ6IFBldCkgPT4gbnVtYmVyIHwgbnVsbCxcbiAgaXNBaWxtZW50TmFtZTogKG5hbWU6IHN0cmluZykgPT4gYm9vbGVhbixcbik6IHN0cmluZyB7XG4gIGxldCBwbGF5ZXJTdGF0ZSA9ICcnO1xuICBpZiAocGxheWVyLnRveSkge1xuICAgIHBsYXllclN0YXRlICs9IGB7e3RveToke3BsYXllci50b3kubmFtZX19fSBgO1xuICB9XG4gIGlmIChwbGF5ZXIuaGFyZFRveSkge1xuICAgIHBsYXllclN0YXRlICs9IGB7e2hhcmR0b3k6JHtwbGF5ZXIuaGFyZFRveS5uYW1lfX19IGA7XG4gIH1cbiAgcGxheWVyU3RhdGUgKz0gcmVuZGVyUGV0VGV4dChwbGF5ZXIucGV0NCwgZ2V0RnJvbnRJbmRleCwgaXNBaWxtZW50TmFtZSk7XG4gIHBsYXllclN0YXRlICs9IHJlbmRlclBldFRleHQocGxheWVyLnBldDMsIGdldEZyb250SW5kZXgsIGlzQWlsbWVudE5hbWUpO1xuICBwbGF5ZXJTdGF0ZSArPSByZW5kZXJQZXRUZXh0KHBsYXllci5wZXQyLCBnZXRGcm9udEluZGV4LCBpc0FpbG1lbnROYW1lKTtcbiAgcGxheWVyU3RhdGUgKz0gcmVuZGVyUGV0VGV4dChwbGF5ZXIucGV0MSwgZ2V0RnJvbnRJbmRleCwgaXNBaWxtZW50TmFtZSk7XG4gIHBsYXllclN0YXRlICs9IHJlbmRlclBldFRleHQocGxheWVyLnBldDAsIGdldEZyb250SW5kZXgsIGlzQWlsbWVudE5hbWUpO1xuXG4gIGxldCBvcHBvbmVudFN0YXRlID0gJyc7XG4gIG9wcG9uZW50U3RhdGUgKz0gcmVuZGVyUGV0VGV4dChvcHBvbmVudC5wZXQwLCBnZXRGcm9udEluZGV4LCBpc0FpbG1lbnROYW1lKTtcbiAgb3Bwb25lbnRTdGF0ZSArPSByZW5kZXJQZXRUZXh0KG9wcG9uZW50LnBldDEsIGdldEZyb250SW5kZXgsIGlzQWlsbWVudE5hbWUpO1xuICBvcHBvbmVudFN0YXRlICs9IHJlbmRlclBldFRleHQob3Bwb25lbnQucGV0MiwgZ2V0RnJvbnRJbmRleCwgaXNBaWxtZW50TmFtZSk7XG4gIG9wcG9uZW50U3RhdGUgKz0gcmVuZGVyUGV0VGV4dChvcHBvbmVudC5wZXQzLCBnZXRGcm9udEluZGV4LCBpc0FpbG1lbnROYW1lKTtcbiAgb3Bwb25lbnRTdGF0ZSArPSByZW5kZXJQZXRUZXh0KG9wcG9uZW50LnBldDQsIGdldEZyb250SW5kZXgsIGlzQWlsbWVudE5hbWUpO1xuICBpZiAob3Bwb25lbnQudG95KSB7XG4gICAgb3Bwb25lbnRTdGF0ZSArPSBge3t0b3k6JHtvcHBvbmVudC50b3kubmFtZX19fSBgO1xuICB9XG4gIGlmIChvcHBvbmVudC5oYXJkVG95KSB7XG4gICAgb3Bwb25lbnRTdGF0ZSArPSBge3toYXJkdG95OiR7b3Bwb25lbnQuaGFyZFRveS5uYW1lfX19IGA7XG4gIH1cblxuICByZXR1cm4gYCR7cGxheWVyU3RhdGV9fCAke29wcG9uZW50U3RhdGV9YDtcbn1cblxuZnVuY3Rpb24gcmVuZGVyUGV0VGV4dChcbiAgcGV0OiBQZXQgfCB1bmRlZmluZWQsXG4gIGdldEZyb250SW5kZXg6IChwZXQ6IFBldCkgPT4gbnVtYmVyIHwgbnVsbCxcbiAgaXNBaWxtZW50TmFtZTogKG5hbWU6IHN0cmluZykgPT4gYm9vbGVhbixcbik6IHN0cmluZyB7XG4gIGlmIChwZXQgPT0gbnVsbCkge1xuICAgIHJldHVybiAnX19fICgtLy0pICc7XG4gIH1cbiAgY29uc3QgaW5kZXggPSBnZXRGcm9udEluZGV4KHBldCk7XG4gIGNvbnN0IGxhYmVsID0gaW5kZXggIT0gbnVsbCA/IGAke3BldC5wYXJlbnQ/LmlzT3Bwb25lbnQgPyAnTycgOiAnUCd9JHtpbmRleH0gYCA6ICcnO1xuICBjb25zdCBpY29uUGF0aCA9IGdldFBldEljb25QYXRoKHBldC5uYW1lKTtcbiAgY29uc3QgcGV0RGlzcGxheSA9IGljb25QYXRoXG4gICAgPyBgPGltZyBzcmM9XCIke2ljb25QYXRofVwiIGNsYXNzPVwibG9nLXBldC1pY29uXCIgYWx0PVwiJHtwZXQubmFtZX1cIj5gXG4gICAgOiAnJztcbiAgY29uc3QgZXF1aXBtZW50TmFtZSA9XG4gICAgdHlwZW9mIChwZXQuZXF1aXBtZW50IGFzIHsgbmFtZT86IHN0cmluZyB9KT8ubmFtZSA9PT0gJ3N0cmluZydcbiAgICAgID8gKHBldC5lcXVpcG1lbnQgYXMgeyBuYW1lPzogc3RyaW5nIH0pLm5hbWVcbiAgICAgIDogbnVsbDtcbiAgY29uc3QgZXF1aXBtZW50RGlzcGxheSA9IGVxdWlwbWVudE5hbWVcbiAgICA/ICgoKSA9PiB7XG4gICAgICBjb25zdCBpc0FpbG1lbnQgPSBpc0FpbG1lbnROYW1lKGVxdWlwbWVudE5hbWUpO1xuICAgICAgY29uc3QgcHJpbWFyeSA9XG4gICAgICAgIGdldEVxdWlwbWVudEljb25QYXRoKGVxdWlwbWVudE5hbWUsIGlzQWlsbWVudCkgPz9cbiAgICAgICAgZ2V0RXF1aXBtZW50SWNvblBhdGgoZXF1aXBtZW50TmFtZSwgIWlzQWlsbWVudCk7XG4gICAgICBpZiAoIXByaW1hcnkpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuICAgICAgY29uc3Qgc2Vjb25kYXJ5ID0gZ2V0RXF1aXBtZW50SWNvblBhdGgoZXF1aXBtZW50TmFtZSwgIWlzQWlsbWVudCk7XG4gICAgICBjb25zdCBzZWNvbmRhcnlBdHRyID0gc2Vjb25kYXJ5XG4gICAgICAgID8gYHRoaXMuZGF0YXNldC5zdGVwPScxJzt0aGlzLnNyYz0nJHtzZWNvbmRhcnl9JztgXG4gICAgICAgIDogYHRoaXMuZGF0YXNldC5zdGVwPScxJztgO1xuICAgICAgcmV0dXJuIGA8aW1nIHNyYz1cIiR7cHJpbWFyeX1cIiBjbGFzcz1cImxvZy1pbmxpbmUtaWNvblwiIGFsdD1cIiR7ZXF1aXBtZW50TmFtZX1cIiBvbmVycm9yPVwiaWYoIXRoaXMuZGF0YXNldC5zdGVwKXske3NlY29uZGFyeUF0dHJ9cmV0dXJuO310aGlzLnJlbW92ZSgpXCI+YDtcbiAgICB9KSgpXG4gICAgOiAnJztcbiAgY29uc3QgbWFuYVZhbHVlID0gTnVtYmVyLmlzRmluaXRlKHBldC5tYW5hKSA/IE1hdGgubWF4KDAsIE1hdGgudHJ1bmMocGV0Lm1hbmEpKSA6IDA7XG4gIGNvbnN0IG1hbmFTdWZmaXggPSBtYW5hVmFsdWUgPiAwID8gYC8ke21hbmFWYWx1ZX1tYW5hYCA6ICcnO1xuXG4gIHJldHVybiBgJHtsYWJlbH0ke3BldERpc3BsYXl9JHtlcXVpcG1lbnREaXNwbGF5fSgke3BldC5hdHRhY2t9LyR7cGV0LmhlYWx0aH0vJHtwZXQuZXhwfXhwJHttYW5hU3VmZml4fSkgYDtcbn1cbiIsICJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMb2cgfSBmcm9tICdhcHAvZG9tYWluL2ludGVyZmFjZXMvbG9nLmludGVyZmFjZSc7XG5pbXBvcnQge1xuICBnZXRBbGxFcXVpcG1lbnROYW1lcyxcbiAgZ2V0QWxsUGV0TmFtZXMsXG4gIGdldEFsbFRveU5hbWVzLFxufSBmcm9tICdhcHAvcnVudGltZS9hc3NldC1jYXRhbG9nJztcbmltcG9ydCB7IFBldCB9IGZyb20gJ2FwcC9kb21haW4vZW50aXRpZXMvcGV0LmNsYXNzJztcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJ2FwcC9kb21haW4vZW50aXRpZXMvcGxheWVyLmNsYXNzJztcbmltcG9ydCB7IEFJTE1FTlRfQ0FURUdPUklFUyB9IGZyb20gJy4vZXF1aXBtZW50L2VxdWlwbWVudC1jYXRlZ29yaWVzJztcbmltcG9ydCB7XG4gIGJ1aWxkSW5saW5lTmFtZVJlZ2V4LFxuICBidWlsZElubGluZU5hbWVUeXBlTWFwLFxuICBidWlsZE5hbWVSZWdleCxcbiAgZGVjb3JhdGVJbmxpbmVJY29ucyxcbn0gZnJvbSAnLi9sb2cvbG9nLWlubGluZS1pY29ucyc7XG5pbXBvcnQgeyBnZXRNZXJnZWRBdHRhY2tIZWFsdGhNZXNzYWdlIH0gZnJvbSAnLi9sb2cvbG9nLW1lcmdlLXV0aWxzJztcbmltcG9ydCB7IGJ1aWxkQm9hcmRTdGF0ZU1lc3NhZ2UgfSBmcm9tICcuL2xvZy9sb2ctYm9hcmQtcmVuZGVyJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIExvZ1NlcnZpY2Uge1xuICBwcml2YXRlIGxvZ3M6IExvZ1tdID0gW107XG4gIHByaXZhdGUgcGV0TmFtZVJlZ2V4OiBSZWdFeHA7XG4gIHByaXZhdGUgdG95TmFtZVJlZ2V4OiBSZWdFeHA7XG4gIHByaXZhdGUgZXF1aXBtZW50TmFtZVJlZ2V4OiBSZWdFeHA7XG4gIHByaXZhdGUgaW5saW5lTmFtZVJlZ2V4OiBSZWdFeHA7XG4gIHByaXZhdGUgaW5saW5lTmFtZVR5cGVNYXA6IE1hcDxzdHJpbmcsICdwZXQnIHwgJ3RveScgfCAnZXF1aXBtZW50Jz47XG4gIHByaXZhdGUgYWlsbWVudE5hbWVzOiBTZXQ8c3RyaW5nPjtcbiAgcHJpdmF0ZSBlbmFibGVkID0gdHJ1ZTtcbiAgcHJpdmF0ZSBkZWZlckRlY29yYXRpb25zID0gZmFsc2U7XG4gIHByaXZhdGUgc2hvd1RyaWdnZXJOYW1lc0luTG9ncyA9IGZhbHNlO1xuICBwcml2YXRlIGRlYnVnU3VtbW9uQm9hcmRTdGF0ZUxvZ3MgPSBmYWxzZTtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgY29uc3QgcGV0TmFtZXMgPSBnZXRBbGxQZXROYW1lcygpO1xuICAgIGNvbnN0IHRveU5hbWVzID0gZ2V0QWxsVG95TmFtZXMoKTtcbiAgICBjb25zdCBlcXVpcG1lbnROYW1lcyA9IGdldEFsbEVxdWlwbWVudE5hbWVzKCk7XG4gICAgdGhpcy5wZXROYW1lUmVnZXggPSBidWlsZE5hbWVSZWdleChwZXROYW1lcyk7XG4gICAgdGhpcy50b3lOYW1lUmVnZXggPSBidWlsZE5hbWVSZWdleCh0b3lOYW1lcyk7XG4gICAgdGhpcy5lcXVpcG1lbnROYW1lUmVnZXggPSBidWlsZE5hbWVSZWdleChlcXVpcG1lbnROYW1lcyk7XG4gICAgdGhpcy5pbmxpbmVOYW1lVHlwZU1hcCA9IGJ1aWxkSW5saW5lTmFtZVR5cGVNYXAoXG4gICAgICBwZXROYW1lcyxcbiAgICAgIHRveU5hbWVzLFxuICAgICAgZXF1aXBtZW50TmFtZXMsXG4gICAgKTtcbiAgICB0aGlzLmlubGluZU5hbWVSZWdleCA9IGJ1aWxkSW5saW5lTmFtZVJlZ2V4KFxuICAgICAgcGV0TmFtZXMsXG4gICAgICB0b3lOYW1lcyxcbiAgICAgIGVxdWlwbWVudE5hbWVzLFxuICAgICk7XG4gICAgdGhpcy5haWxtZW50TmFtZXMgPSBuZXcgU2V0KFxuICAgICAgT2JqZWN0LnZhbHVlcyhBSUxNRU5UX0NBVEVHT1JJRVMpLmZsYXQoKS5maWx0ZXIoQm9vbGVhbiksXG4gICAgKTtcbiAgfVxuXG4gIHNldEVuYWJsZWQoZW5hYmxlZDogYm9vbGVhbikge1xuICAgIHRoaXMuZW5hYmxlZCA9IEJvb2xlYW4oZW5hYmxlZCk7XG4gICAgaWYgKCF0aGlzLmVuYWJsZWQpIHtcbiAgICAgIHRoaXMubG9ncyA9IFtdO1xuICAgIH1cbiAgfVxuXG4gIGlzRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5lbmFibGVkO1xuICB9XG5cbiAgc2V0RGVmZXJEZWNvcmF0aW9ucyhlbmFibGVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5kZWZlckRlY29yYXRpb25zID0gQm9vbGVhbihlbmFibGVkKTtcbiAgfVxuXG4gIGlzRGVmZXJEZWNvcmF0aW9ucygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5kZWZlckRlY29yYXRpb25zO1xuICB9XG5cbiAgc2V0U2hvd1RyaWdnZXJOYW1lc0luTG9ncyhlbmFibGVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5zaG93VHJpZ2dlck5hbWVzSW5Mb2dzID0gQm9vbGVhbihlbmFibGVkKTtcbiAgfVxuXG4gIGlzU2hvd1RyaWdnZXJOYW1lc0luTG9ncygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zaG93VHJpZ2dlck5hbWVzSW5Mb2dzO1xuICB9XG5cbiAgc2V0RGVidWdTdW1tb25Cb2FyZFN0YXRlTG9ncyhlbmFibGVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5kZWJ1Z1N1bW1vbkJvYXJkU3RhdGVMb2dzID0gQm9vbGVhbihlbmFibGVkKTtcbiAgfVxuXG4gIGlzRGVidWdTdW1tb25Cb2FyZFN0YXRlTG9ncygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5kZWJ1Z1N1bW1vbkJvYXJkU3RhdGVMb2dzO1xuICB9XG5cbiAgZGVjb3JhdGVMb2dJZk5lZWRlZChsb2c6IExvZykge1xuICAgIGlmICghbG9nIHx8IGxvZy5kZWNvcmF0ZWQgfHwgIWxvZy5yYXdNZXNzYWdlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG1lc3NhZ2UgPSB0aGlzLmRlY29yYXRlTWVzc2FnZVdpdGhOYW1lcyhcbiAgICAgIGxvZy5yYXdNZXNzYWdlLFxuICAgICAgbG9nLnNvdXJjZVBldCxcbiAgICAgIGxvZy50YXJnZXRQZXQsXG4gICAgICBsb2cuc291cmNlSW5kZXgsXG4gICAgICBsb2cudGFyZ2V0SW5kZXgsXG4gICAgKTtcbiAgICBsb2cubWVzc2FnZSA9IGRlY29yYXRlSW5saW5lSWNvbnMoXG4gICAgICBtZXNzYWdlLFxuICAgICAgdGhpcy5pbmxpbmVOYW1lUmVnZXgsXG4gICAgICB0aGlzLmlubGluZU5hbWVUeXBlTWFwLFxuICAgICAgdGhpcy5haWxtZW50TmFtZXMsXG4gICAgKTtcbiAgICBsb2cuZGVjb3JhdGVkID0gdHJ1ZTtcbiAgfVxuXG4gIGNyZWF0ZUxvZyhsb2c6IExvZykge1xuICAgIGlmICghdGhpcy5lbmFibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChsb2cubWVzc2FnZT8uc3RhcnRzV2l0aCgnUGhhc2UgJykpIHtcbiAgICAgIGxvZy5ib2xkID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy5yZXNvbHZlTG9nTWV0YWRhdGEobG9nKTtcblxuICAgIGxldCBtZXNzYWdlID0gdGhpcy5kZWNvcmF0ZUxvZ01lc3NhZ2UobG9nKTtcbiAgICBtZXNzYWdlID0gdGhpcy5hcHBlbmRUYWdTdWZmaXhlcyhtZXNzYWdlLCBsb2cpO1xuICAgIHRoaXMucGVyc2lzdERlY29yYXRlZE1lc3NhZ2UobG9nLCBtZXNzYWdlKTtcblxuICAgIGNvbnN0IGxhc3RMb2cgPSB0aGlzLmxvZ3NbdGhpcy5sb2dzLmxlbmd0aCAtIDFdO1xuICAgIGNvbnN0IHNob3VsZEFwcGVuZFN1bW1vbkJvYXJkID0gdGhpcy5zaG91bGRBcHBlbmRTdW1tb25Cb2FyZFN0YXRlKGxvZyk7XG4gICAgaWYgKHRoaXMudHJ5TWVyZ2VBdHRhY2tIZWFsdGhMb2dzKGxhc3RMb2csIGxvZykpIHtcbiAgICAgIGlmIChzaG91bGRBcHBlbmRTdW1tb25Cb2FyZCkge1xuICAgICAgICB0aGlzLmFwcGVuZFN1bW1vbkJvYXJkU3RhdGVMb2cobG9nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2hvdWxkQ29sbGFwc2VMb2cobGFzdExvZywgbG9nKSkge1xuICAgICAgbGFzdExvZy5jb3VudCA9IChsYXN0TG9nLmNvdW50ID8/IDEpICsgMTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sb2dzLnB1c2gobG9nKTtcbiAgICB9XG5cbiAgICBpZiAoc2hvdWxkQXBwZW5kU3VtbW9uQm9hcmQpIHtcbiAgICAgIHRoaXMuYXBwZW5kU3VtbW9uQm9hcmRTdGF0ZUxvZyhsb2cpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVzb2x2ZUxvZ01ldGFkYXRhKGxvZzogTG9nKTogdm9pZCB7XG4gICAgaWYgKCFsb2cuc291cmNlUGV0ICYmIGxvZy5wbGF5ZXIgJiYgbG9nLm1lc3NhZ2UpIHtcbiAgICAgIGNvbnN0IHBvc3NpYmxlUGV0cyA9IGxvZy5wbGF5ZXIucGV0QXJyYXkuZmlsdGVyKFxuICAgICAgICAocCkgPT4gcCAmJiBsb2cubWVzc2FnZS5zdGFydHNXaXRoKHAubmFtZSksXG4gICAgICApO1xuICAgICAgaWYgKHBvc3NpYmxlUGV0cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgbG9nLnNvdXJjZVBldCA9IHBvc3NpYmxlUGV0c1swXSBhcyBQZXQ7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChsb2cudHlwZSA9PT0gJ2F0dGFjaycgJiYgbG9nLnBsYXllciAmJiBsb2cubWVzc2FnZSkge1xuICAgICAgdGhpcy5yZXNvbHZlQXR0YWNrUGV0c0Zyb21NZXNzYWdlKGxvZyk7XG4gICAgfVxuICAgIGlmICghbG9nLnJhbmRvbUV2ZW50UmVhc29uICYmIGxvZy5yYW5kb21FdmVudCA9PT0gdHJ1ZSkge1xuICAgICAgbG9nLnJhbmRvbUV2ZW50UmVhc29uID0gJ3RydWUtcmFuZG9tJztcbiAgICB9XG4gICAgaWYgKGxvZy5wbGF5ZXIgJiYgbG9nLm1lc3NhZ2UpIHtcbiAgICAgIHRoaXMucmVzb2x2ZVNvdXJjZVRhcmdldEZyb21NZXNzYWdlKGxvZyk7XG4gICAgfVxuICAgIGlmIChsb2cuc291cmNlUGV0ICYmIGxvZy5zb3VyY2VJbmRleCA9PSBudWxsKSB7XG4gICAgICBsb2cuc291cmNlSW5kZXggPSB0aGlzLmdldEZyb250SW5kZXgobG9nLnNvdXJjZVBldCkgPz8gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAobG9nLnRhcmdldFBldCAmJiBsb2cudGFyZ2V0SW5kZXggPT0gbnVsbCkge1xuICAgICAgbG9nLnRhcmdldEluZGV4ID0gdGhpcy5nZXRGcm9udEluZGV4KGxvZy50YXJnZXRQZXQpID8/IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGRlY29yYXRlTG9nTWVzc2FnZShsb2c6IExvZyk6IHN0cmluZyB7XG4gICAgY29uc3QgbWVzc2FnZSA9IGxvZy5tZXNzYWdlID8/ICcnO1xuICAgIGlmICh0aGlzLmRlZmVyRGVjb3JhdGlvbnMpIHtcbiAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZU1lc3NhZ2VXaXRoTmFtZXMoXG4gICAgICBtZXNzYWdlLFxuICAgICAgbG9nLnNvdXJjZVBldCxcbiAgICAgIGxvZy50YXJnZXRQZXQsXG4gICAgICBsb2cuc291cmNlSW5kZXgsXG4gICAgICBsb2cudGFyZ2V0SW5kZXgsXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgYXBwZW5kVGFnU3VmZml4ZXMobWVzc2FnZTogc3RyaW5nLCBsb2c6IExvZyk6IHN0cmluZyB7XG4gICAgbGV0IHVwZGF0ZWQgPSBtZXNzYWdlO1xuICAgIGlmIChsb2cudGlnZXIpIHtcbiAgICAgIHVwZGF0ZWQgKz0gJyAoVGlnZXIpJztcbiAgICB9XG4gICAgaWYgKGxvZy5wdW1hKSB7XG4gICAgICB1cGRhdGVkICs9ICcgKFB1bWEpJztcbiAgICB9XG4gICAgaWYgKGxvZy5wdGVyYW5vZG9uKSB7XG4gICAgICB1cGRhdGVkICs9ICcgKFB0ZXJhbm9kb24pJztcbiAgICB9XG4gICAgaWYgKGxvZy5wYW50aGVyTXVsdGlwbGllciAhPSBudWxsICYmIGxvZy5wYW50aGVyTXVsdGlwbGllciA+IDEpIHtcbiAgICAgIHVwZGF0ZWQgKz0gYCB4JHtsb2cucGFudGhlck11bHRpcGxpZXJ9IChQYW50aGVyKWA7XG4gICAgfVxuICAgIHJldHVybiB1cGRhdGVkO1xuICB9XG5cbiAgcHJpdmF0ZSBwZXJzaXN0RGVjb3JhdGVkTWVzc2FnZShsb2c6IExvZywgbWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKCFtZXNzYWdlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZGVmZXJEZWNvcmF0aW9ucykge1xuICAgICAgbG9nLnJhd01lc3NhZ2UgPSBtZXNzYWdlO1xuICAgICAgbG9nLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgICAgbG9nLmRlY29yYXRlZCA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxvZy5tZXNzYWdlID0gZGVjb3JhdGVJbmxpbmVJY29ucyhcbiAgICAgIG1lc3NhZ2UsXG4gICAgICB0aGlzLmlubGluZU5hbWVSZWdleCxcbiAgICAgIHRoaXMuaW5saW5lTmFtZVR5cGVNYXAsXG4gICAgICB0aGlzLmFpbG1lbnROYW1lcyxcbiAgICApO1xuICAgIGxvZy5kZWNvcmF0ZWQgPSB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSBzaG91bGRDb2xsYXBzZUxvZyhsYXN0TG9nOiBMb2cgfCB1bmRlZmluZWQsIGxvZzogTG9nKTogbGFzdExvZyBpcyBMb2cge1xuICAgIGlmICghbGFzdExvZykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAobGFzdExvZy5ub0NvbGxhcHNlIHx8IGxvZy5ub0NvbGxhcHNlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3Qgc2FtZVBsYXllciA9IGxhc3RMb2cucGxheWVyID09PSBsb2cucGxheWVyO1xuICAgIGNvbnN0IHNhbWVNZXNzYWdlID0gbGFzdExvZy5tZXNzYWdlPy50cmltKCkgPT09IGxvZy5tZXNzYWdlPy50cmltKCk7XG4gICAgY29uc3Qgc2FtZVJhbmRvbSA9IGxhc3RMb2cucmFuZG9tRXZlbnQgPT09IGxvZy5yYW5kb21FdmVudDtcbiAgICBjb25zdCBzYW1lUmFuZG9tUmVhc29uID1cbiAgICAgIGxhc3RMb2cucmFuZG9tRXZlbnRSZWFzb24gPT09IGxvZy5yYW5kb21FdmVudFJlYXNvbjtcbiAgICBjb25zdCBzYW1lU291cmNlID1cbiAgICAgIGxhc3RMb2cuc291cmNlUGV0ID09PSBsb2cuc291cmNlUGV0ICYmXG4gICAgICBsYXN0TG9nLnNvdXJjZUluZGV4ID09PSBsb2cuc291cmNlSW5kZXg7XG4gICAgY29uc3Qgc2FtZVRhcmdldCA9XG4gICAgICBsYXN0TG9nLnRhcmdldFBldCA9PT0gbG9nLnRhcmdldFBldCAmJlxuICAgICAgbGFzdExvZy50YXJnZXRJbmRleCA9PT0gbG9nLnRhcmdldEluZGV4O1xuICAgIGNvbnN0IGhhc1NvdXJjZU9yVGFyZ2V0ID1cbiAgICAgIGxvZy5zb3VyY2VQZXQgIT0gbnVsbCB8fFxuICAgICAgbG9nLnRhcmdldFBldCAhPSBudWxsIHx8XG4gICAgICBsb2cuc291cmNlSW5kZXggIT0gbnVsbCB8fFxuICAgICAgbG9nLnRhcmdldEluZGV4ICE9IG51bGw7XG5cbiAgICByZXR1cm4gKFxuICAgICAgc2FtZU1lc3NhZ2UgJiZcbiAgICAgIHNhbWVQbGF5ZXIgJiZcbiAgICAgIHNhbWVSYW5kb20gJiZcbiAgICAgIHNhbWVSYW5kb21SZWFzb24gJiZcbiAgICAgICghaGFzU291cmNlT3JUYXJnZXQgfHwgKHNhbWVTb3VyY2UgJiYgc2FtZVRhcmdldCkpXG4gICAgKTtcbiAgfVxuXG4gIGdldExvZ3MoKSB7XG4gICAgcmV0dXJuIHRoaXMubG9ncztcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMubG9ncyA9IFtdO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRGcm9udEluZGV4KHBldDogUGV0KTogbnVtYmVyIHwgbnVsbCB7XG4gICAgY29uc3QgcGFyZW50ID0gcGV0Py5wYXJlbnQ7XG4gICAgaWYgKCFwYXJlbnQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAocGFyZW50LnBldDAgPT09IHBldCkge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfVxuICAgIGlmIChwYXJlbnQucGV0MSA9PT0gcGV0KSB7XG4gICAgICByZXR1cm4gMjtcbiAgICB9XG4gICAgaWYgKHBhcmVudC5wZXQyID09PSBwZXQpIHtcbiAgICAgIHJldHVybiAzO1xuICAgIH1cbiAgICBpZiAocGFyZW50LnBldDMgPT09IHBldCkge1xuICAgICAgcmV0dXJuIDQ7XG4gICAgfVxuICAgIGlmIChwYXJlbnQucGV0NCA9PT0gcGV0KSB7XG4gICAgICByZXR1cm4gNTtcbiAgICB9XG4gICAgaWYgKE51bWJlci5pc0Zpbml0ZShwZXQuc2F2ZWRQb3NpdGlvbikpIHtcbiAgICAgIHJldHVybiBwZXQuc2F2ZWRQb3NpdGlvbiArIDE7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBkZWNvcmF0ZU1lc3NhZ2UobWVzc2FnZTogc3RyaW5nLCBwZXQ6IFBldCk6IHN0cmluZyB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmdldEZyb250SW5kZXgocGV0KTtcbiAgICBpZiAoaW5kZXggPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgfVxuICAgIGNvbnN0IGxhYmVsID0gcGV0LnBhcmVudD8uaXNPcHBvbmVudCA/ICdPJyA6ICdQJztcbiAgICBjb25zdCBmdWxsTGFiZWwgPSBgJHtsYWJlbH0ke2luZGV4fSAke3BldC5uYW1lfWA7XG4gICAgcmV0dXJuIHRoaXMucmVwbGFjZUZpcnN0KG1lc3NhZ2UsIHBldC5uYW1lLCBmdWxsTGFiZWwpO1xuICB9XG5cbiAgcHJpdmF0ZSBkZWNvcmF0ZUF0dGFja01lc3NhZ2UoXG4gICAgbWVzc2FnZTogc3RyaW5nLFxuICAgIHNvdXJjZVBldDogUGV0LFxuICAgIHRhcmdldFBldDogUGV0LFxuICAgIHNvdXJjZUluZGV4T3ZlcnJpZGU/OiBudW1iZXIsXG4gICAgdGFyZ2V0SW5kZXhPdmVycmlkZT86IG51bWJlcixcbiAgKTogc3RyaW5nIHtcbiAgICBjb25zdCBzb3VyY2VJbmRleCA9XG4gICAgICBzb3VyY2VJbmRleE92ZXJyaWRlID8/IHRoaXMuZ2V0RnJvbnRJbmRleChzb3VyY2VQZXQpO1xuICAgIGNvbnN0IHRhcmdldEluZGV4ID1cbiAgICAgIHRhcmdldEluZGV4T3ZlcnJpZGUgPz8gdGhpcy5nZXRGcm9udEluZGV4KHRhcmdldFBldCk7XG4gICAgaWYgKHNvdXJjZUluZGV4ID09IG51bGwgfHwgdGFyZ2V0SW5kZXggPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgfVxuXG4gICAgY29uc3Qgc291cmNlTGFiZWwgPSBzb3VyY2VQZXQucGFyZW50Py5pc09wcG9uZW50ID8gJ08nIDogJ1AnO1xuICAgIGNvbnN0IHRhcmdldExhYmVsID0gdGFyZ2V0UGV0LnBhcmVudD8uaXNPcHBvbmVudCA/ICdPJyA6ICdQJztcblxuICAgIGNvbnN0IHNvdXJjZUZ1bGxMYWJlbCA9IGAke3NvdXJjZUxhYmVsfSR7c291cmNlSW5kZXh9ICR7c291cmNlUGV0Lm5hbWV9YDtcbiAgICBjb25zdCB0YXJnZXRGdWxsTGFiZWwgPSBgJHt0YXJnZXRMYWJlbH0ke3RhcmdldEluZGV4fSAke3RhcmdldFBldC5uYW1lfWA7XG5cbiAgICAvLyBJZiBuYW1lcyBhcmUgdGhlIHNhbWUsIHdlIG11c3QgdXNlIHVuaXF1ZSB0b2tlbnMgZHVyaW5nIHJlcGxhY2VtZW50IHRvIGF2b2lkIHJlY3Vyc2lvbi9jbG9iYmVyaW5nXG4gICAgY29uc3QgU09VUkNFX0hPTERFUiA9ICdfX19TT1VSQ0VfSE9MREVSX19fJztcbiAgICBjb25zdCBUQVJHRVRfSE9MREVSID0gJ19fX1RBUkdFVF9IT0xERVJfX18nO1xuXG4gICAgbGV0IHVwZGF0ZWQgPSB0aGlzLnJlcGxhY2VGaXJzdChtZXNzYWdlLCBzb3VyY2VQZXQubmFtZSwgU09VUkNFX0hPTERFUik7XG4gICAgdXBkYXRlZCA9IHRoaXMucmVwbGFjZUZpcnN0KHVwZGF0ZWQsIHRhcmdldFBldC5uYW1lLCBUQVJHRVRfSE9MREVSKTtcblxuICAgIHVwZGF0ZWQgPSB1cGRhdGVkLnJlcGxhY2UoU09VUkNFX0hPTERFUiwgc291cmNlRnVsbExhYmVsKTtcbiAgICB1cGRhdGVkID0gdXBkYXRlZC5yZXBsYWNlKFRBUkdFVF9IT0xERVIsIHRhcmdldEZ1bGxMYWJlbCk7XG5cbiAgICByZXR1cm4gdXBkYXRlZDtcbiAgfVxuXG4gIHByaXZhdGUgZGVjb3JhdGVNZXNzYWdlV2l0aE5hbWVzKFxuICAgIG1lc3NhZ2U6IHN0cmluZyxcbiAgICBzb3VyY2VQZXQ/OiBQZXQsXG4gICAgdGFyZ2V0UGV0PzogUGV0LFxuICAgIHNvdXJjZUluZGV4PzogbnVtYmVyLFxuICAgIHRhcmdldEluZGV4PzogbnVtYmVyLFxuICApOiBzdHJpbmcge1xuICAgIGlmICghbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgfVxuICAgIGlmIChzb3VyY2VQZXQgJiYgdGFyZ2V0UGV0KSB7XG4gICAgICByZXR1cm4gdGhpcy5kZWNvcmF0ZUF0dGFja01lc3NhZ2UoXG4gICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIHNvdXJjZVBldCxcbiAgICAgICAgdGFyZ2V0UGV0LFxuICAgICAgICBzb3VyY2VJbmRleCxcbiAgICAgICAgdGFyZ2V0SW5kZXgsXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoc291cmNlUGV0KSB7XG4gICAgICBpZiAoc291cmNlSW5kZXggIT0gbnVsbCkge1xuICAgICAgICBjb25zdCBsYWJlbCA9IHNvdXJjZVBldC5wYXJlbnQ/LmlzT3Bwb25lbnQgPyAnTycgOiAnUCc7XG4gICAgICAgIGNvbnN0IGZ1bGxMYWJlbCA9IGAke2xhYmVsfSR7c291cmNlSW5kZXh9ICR7c291cmNlUGV0Lm5hbWV9YDtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZUZpcnN0KG1lc3NhZ2UsIHNvdXJjZVBldC5uYW1lLCBmdWxsTGFiZWwpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZGVjb3JhdGVNZXNzYWdlKG1lc3NhZ2UsIHNvdXJjZVBldCk7XG4gICAgfVxuICAgIHJldHVybiBtZXNzYWdlO1xuICB9XG5cbiAgcHJpdmF0ZSByZXBsYWNlRmlyc3QoXG4gICAgc291cmNlOiBzdHJpbmcsXG4gICAgc2VhcmNoOiBzdHJpbmcsXG4gICAgcmVwbGFjZW1lbnQ6IHN0cmluZyxcbiAgKTogc3RyaW5nIHtcbiAgICBjb25zdCBpbmRleCA9IHNvdXJjZS5pbmRleE9mKHNlYXJjaCk7XG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIHNvdXJjZS5zbGljZSgwLCBpbmRleCkgKyByZXBsYWNlbWVudCArIHNvdXJjZS5zbGljZShpbmRleCArIHNlYXJjaC5sZW5ndGgpXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVzb2x2ZUF0dGFja1BldHNGcm9tTWVzc2FnZShsb2c6IExvZyk6IHZvaWQge1xuICAgIGlmICghbG9nPy5tZXNzYWdlIHx8ICFsb2cucGxheWVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChsb2cuc291cmNlUGV0ICYmIGxvZy50YXJnZXRQZXQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbWVzc2FnZSA9IGxvZy5tZXNzYWdlO1xuICAgIGNvbnN0IHNuaXBlZE1hdGNoID0gL14oLis/KVxccytzbmlwZWRcXHMrKC4rPylcXHMrZm9yXFxzKy9pLmV4ZWMobWVzc2FnZSk7XG4gICAgY29uc3QgYXR0YWNrTWF0Y2ggPVxuICAgICAgL14oLis/KVxccysoPzpqdW1wLSk/YXR0YWNrcz9cXHMrKC4rPylcXHMrZm9yXFxzKy9pLmV4ZWMobWVzc2FnZSk7XG4gICAgY29uc3QgbWF0Y2ggPSBzbmlwZWRNYXRjaCA/PyBhdHRhY2tNYXRjaDtcbiAgICBpZiAoIW1hdGNoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHNvdXJjZU5hbWUgPSBtYXRjaFsxXS50cmltKCk7XG4gICAgY29uc3QgdGFyZ2V0TmFtZSA9IG1hdGNoWzJdLnRyaW0oKTtcbiAgICBjb25zdCBwbGF5ZXJQZXRzID0gbG9nLnBsYXllci5wZXRBcnJheSA/PyBbXTtcbiAgICBjb25zdCBvcHBvbmVudFBldHMgPSBsb2cucGxheWVyLm9wcG9uZW50Py5wZXRBcnJheSA/PyBbXTtcblxuICAgIGlmICghbG9nLnNvdXJjZVBldCkge1xuICAgICAgbG9nLnNvdXJjZVBldCA9XG4gICAgICAgIHBsYXllclBldHMuZmluZCgocGV0KSA9PiBwZXQ/Lm5hbWUgPT09IHNvdXJjZU5hbWUpID8/IG51bGw7XG4gICAgfVxuICAgIGlmICghbG9nLnRhcmdldFBldCkge1xuICAgICAgbG9nLnRhcmdldFBldCA9XG4gICAgICAgIG9wcG9uZW50UGV0cy5maW5kKChwZXQpID0+IHBldD8ubmFtZSA9PT0gdGFyZ2V0TmFtZSkgPz9cbiAgICAgICAgcGxheWVyUGV0cy5maW5kKChwZXQpID0+IHBldD8ubmFtZSA9PT0gdGFyZ2V0TmFtZSkgPz9cbiAgICAgICAgbnVsbDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGlzQWlsbWVudE5hbWUobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuYWlsbWVudE5hbWVzLmhhcyhuYW1lKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVzb2x2ZVNvdXJjZVRhcmdldEZyb21NZXNzYWdlKGxvZzogTG9nKTogdm9pZCB7XG4gICAgaWYgKGxvZy5zb3VyY2VQZXQgJiYgbG9nLnRhcmdldFBldCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBtZXNzYWdlID0gbG9nLm1lc3NhZ2U7XG4gICAgaWYgKCFtZXNzYWdlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG5hbWVzID0gdGhpcy5leHRyYWN0UGV0TmFtZXMobWVzc2FnZSk7XG4gICAgaWYgKG5hbWVzLmxlbmd0aCA8IDIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwbGF5ZXJQZXRzID0gbG9nLnBsYXllcj8ucGV0QXJyYXkgPz8gW107XG4gICAgY29uc3Qgb3Bwb25lbnRQZXRzID0gbG9nLnBsYXllcj8ub3Bwb25lbnQ/LnBldEFycmF5ID8/IFtdO1xuXG4gICAgY29uc3QgZmluZFBldCA9IChcbiAgICAgIHBldHM6IFBldFtdLFxuICAgICAgbmFtZTogc3RyaW5nLFxuICAgICAgZXhjbHVkZT86IFBldCB8IG51bGwsXG4gICAgKTogUGV0IHwgbnVsbCA9PlxuICAgICAgcGV0cy5maW5kKChwZXQpID0+IHBldD8ubmFtZSA9PT0gbmFtZSAmJiBwZXQgIT09IGV4Y2x1ZGUpID8/IG51bGw7XG5cbiAgICBpZiAoIWxvZy5zb3VyY2VQZXQpIHtcbiAgICAgIGxvZy5zb3VyY2VQZXQgPVxuICAgICAgICBmaW5kUGV0KHBsYXllclBldHMsIG5hbWVzWzBdKSA/PyBmaW5kUGV0KG9wcG9uZW50UGV0cywgbmFtZXNbMF0pO1xuICAgIH1cblxuICAgIGlmICghbG9nLnRhcmdldFBldCkge1xuICAgICAgaWYgKG5hbWVzWzFdID09PSBuYW1lc1swXSkge1xuICAgICAgICBjb25zdCBtZXNzYWdlU3RhcnRzV2l0aFNvdXJjZSA9XG4gICAgICAgICAgbG9nLnNvdXJjZVBldCAmJiBtZXNzYWdlLnN0YXJ0c1dpdGgobG9nLnNvdXJjZVBldC5uYW1lKTtcbiAgICAgICAgaWYgKG1lc3NhZ2VTdGFydHNXaXRoU291cmNlICYmIGxvZy5zb3VyY2VQZXQpIHtcbiAgICAgICAgICAvLyBQcmVmZXIgc2VsZi10YXJnZXQgd2hlbiB0aGUgbWVzc2FnZSBiZWdpbnMgd2l0aCB0aGUgc291cmNlIG5hbWUgYW5kIHRoZSBuYW1lcyBtYXRjaC5cbiAgICAgICAgICBsb2cudGFyZ2V0UGV0ID0gbG9nLnNvdXJjZVBldDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2cudGFyZ2V0UGV0ID1cbiAgICAgICAgICAgIGZpbmRQZXQocGxheWVyUGV0cywgbmFtZXNbMV0sIGxvZy5zb3VyY2VQZXQpID8/XG4gICAgICAgICAgICBmaW5kUGV0KG9wcG9uZW50UGV0cywgbmFtZXNbMV0sIGxvZy5zb3VyY2VQZXQpID8/XG4gICAgICAgICAgICBsb2cuc291cmNlUGV0ID8/XG4gICAgICAgICAgICBudWxsO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2cudGFyZ2V0UGV0ID1cbiAgICAgICAgICBmaW5kUGV0KG9wcG9uZW50UGV0cywgbmFtZXNbMV0pID8/IGZpbmRQZXQocGxheWVyUGV0cywgbmFtZXNbMV0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZXh0cmFjdFBldE5hbWVzKG1lc3NhZ2U6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICBpZiAoIXRoaXMucGV0TmFtZVJlZ2V4IHx8ICFtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGNvbnN0IG1hdGNoZXMgPSBtZXNzYWdlLm1hdGNoKHRoaXMucGV0TmFtZVJlZ2V4KTtcbiAgICByZXR1cm4gbWF0Y2hlcyA/PyBbXTtcbiAgfVxuXG4gIHByaXZhdGUgdHJ5TWVyZ2VBdHRhY2tIZWFsdGhMb2dzKFxuICAgIGxhc3RMb2c6IExvZyB8IHVuZGVmaW5lZCxcbiAgICBuZXh0TG9nOiBMb2csXG4gICk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGNvbWJpbmVkID0gZ2V0TWVyZ2VkQXR0YWNrSGVhbHRoTWVzc2FnZShsYXN0TG9nLCBuZXh0TG9nKTtcbiAgICBpZiAoIWNvbWJpbmVkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZGVmZXJEZWNvcmF0aW9ucykge1xuICAgICAgbGFzdExvZy5yYXdNZXNzYWdlID0gY29tYmluZWQ7XG4gICAgICBsYXN0TG9nLm1lc3NhZ2UgPSBjb21iaW5lZDtcbiAgICAgIGxhc3RMb2cuZGVjb3JhdGVkID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGRlY29yYXRlZCA9IHRoaXMuZGVjb3JhdGVNZXNzYWdlV2l0aE5hbWVzKFxuICAgICAgICBjb21iaW5lZCxcbiAgICAgICAgbGFzdExvZy5zb3VyY2VQZXQsXG4gICAgICAgIGxhc3RMb2cudGFyZ2V0UGV0LFxuICAgICAgICBsYXN0TG9nLnNvdXJjZUluZGV4LFxuICAgICAgICBsYXN0TG9nLnRhcmdldEluZGV4LFxuICAgICAgKTtcbiAgICAgIGxhc3RMb2cubWVzc2FnZSA9IGRlY29yYXRlSW5saW5lSWNvbnMoXG4gICAgICAgIGRlY29yYXRlZCxcbiAgICAgICAgdGhpcy5pbmxpbmVOYW1lUmVnZXgsXG4gICAgICAgIHRoaXMuaW5saW5lTmFtZVR5cGVNYXAsXG4gICAgICAgIHRoaXMuYWlsbWVudE5hbWVzLFxuICAgICAgKTtcbiAgICAgIGxhc3RMb2cuZGVjb3JhdGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgc2hvdWxkQXBwZW5kU3VtbW9uQm9hcmRTdGF0ZShsb2c6IExvZyk6IGJvb2xlYW4ge1xuICAgIGlmICghdGhpcy5kZWJ1Z1N1bW1vbkJvYXJkU3RhdGVMb2dzKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICghbG9nPy5tZXNzYWdlIHx8IGxvZy50eXBlID09PSAnYm9hcmQnKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICghbG9nLnBsYXllciB8fCAhbG9nLnBsYXllci5vcHBvbmVudCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gL1xcYihzdW1tb25lZHxzcGF3bmVkKVxcYnxeTm8gcm9vbSB0byBzcGF3blxcYi9pLnRlc3QobG9nLm1lc3NhZ2UpO1xuICB9XG5cbiAgcHJpdmF0ZSBhcHBlbmRTdW1tb25Cb2FyZFN0YXRlTG9nKGxvZzogTG9nKTogdm9pZCB7XG4gICAgY29uc3QgcGxheWVyID0gbG9nLnBsYXllcjtcbiAgICBjb25zdCBvcHBvbmVudCA9IGxvZy5wbGF5ZXI/Lm9wcG9uZW50O1xuICAgIGlmICghcGxheWVyIHx8ICFvcHBvbmVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubG9ncy5wdXNoKHtcbiAgICAgIG1lc3NhZ2U6IHRoaXMuYnVpbGRQbGFpbkJvYXJkU3RhdGVNZXNzYWdlKHBsYXllciwgb3Bwb25lbnQpLFxuICAgICAgdHlwZTogJ2JvYXJkJyxcbiAgICAgIHBsYXllcixcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYnVpbGRQbGFpbkJvYXJkU3RhdGVNZXNzYWdlKHBsYXllcjogUGxheWVyLCBvcHBvbmVudDogUGxheWVyKTogc3RyaW5nIHtcbiAgICBjb25zdCBwbGF5ZXJTdGF0ZSA9IFtcbiAgICAgIHBsYXllci5wZXQ0LFxuICAgICAgcGxheWVyLnBldDMsXG4gICAgICBwbGF5ZXIucGV0MixcbiAgICAgIHBsYXllci5wZXQxLFxuICAgICAgcGxheWVyLnBldDAsXG4gICAgXVxuICAgICAgLm1hcCgocGV0KSA9PiB0aGlzLnJlbmRlclBsYWluUGV0VGV4dChwZXQpKVxuICAgICAgLmpvaW4oJyAnKTtcblxuICAgIGNvbnN0IG9wcG9uZW50U3RhdGUgPSBbXG4gICAgICBvcHBvbmVudC5wZXQwLFxuICAgICAgb3Bwb25lbnQucGV0MSxcbiAgICAgIG9wcG9uZW50LnBldDIsXG4gICAgICBvcHBvbmVudC5wZXQzLFxuICAgICAgb3Bwb25lbnQucGV0NCxcbiAgICBdXG4gICAgICAubWFwKChwZXQpID0+IHRoaXMucmVuZGVyUGxhaW5QZXRUZXh0KHBldCkpXG4gICAgICAuam9pbignICcpO1xuXG4gICAgcmV0dXJuIGAke3BsYXllclN0YXRlfSB8ICR7b3Bwb25lbnRTdGF0ZX1gO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJQbGFpblBldFRleHQocGV0OiBQZXQgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgICBpZiAoIXBldCkge1xuICAgICAgcmV0dXJuICdfX18gKC0vLSknO1xuICAgIH1cbiAgICBjb25zdCBpbmRleCA9IHRoaXMuZ2V0RnJvbnRJbmRleChwZXQpO1xuICAgIGNvbnN0IGxhYmVsID0gaW5kZXggIT0gbnVsbCA/IGAke3BldC5wYXJlbnQ/LmlzT3Bwb25lbnQgPyAnTycgOiAnUCd9JHtpbmRleH1gIDogJ1A/JztcbiAgICByZXR1cm4gYCR7bGFiZWx9ICR7cGV0Lm5hbWV9KCR7cGV0LmF0dGFja30vJHtwZXQuaGVhbHRofS8ke3BldC5leHB9eHApYDtcbiAgfVxuXG4gIHByaW50U3RhdGUocGxheWVyOiBQbGF5ZXIsIG9wcG9uZW50OiBQbGF5ZXIsIG1lc3NhZ2U/OiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMuZW5hYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAobWVzc2FnZSkge1xuICAgICAgdGhpcy5jcmVhdGVMb2coe1xuICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgICAgICB0eXBlOiAnYm9hcmQnLFxuICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnN0IGJvYXJkTWVzc2FnZSA9IGJ1aWxkQm9hcmRTdGF0ZU1lc3NhZ2UoXG4gICAgICBwbGF5ZXIsXG4gICAgICBvcHBvbmVudCxcbiAgICAgIChwZXQpID0+IHRoaXMuZ2V0RnJvbnRJbmRleChwZXQpLFxuICAgICAgKG5hbWUpID0+IHRoaXMuaXNBaWxtZW50TmFtZShuYW1lKSxcbiAgICApO1xuXG4gICAgdGhpcy5jcmVhdGVMb2coe1xuICAgICAgbWVzc2FnZTogYm9hcmRNZXNzYWdlLFxuICAgICAgdHlwZTogJ2JvYXJkJyxcbiAgICB9KTtcbiAgfVxufVxuXG5cblxuIiwgImNvbnN0IEJZVEVfQ0hVTktfU0laRSA9IDB4ODAwMDtcblxuZnVuY3Rpb24gbm9ybWFsaXplQmFzZTY0VXJsKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBiYXNlNjQgPSB2YWx1ZVxuICAgIC5yZXBsYWNlKC9cXHMvZywgJysnKVxuICAgIC5yZXBsYWNlKC8tL2csICcrJylcbiAgICAucmVwbGFjZSgvXy9nLCAnLycpO1xuICBjb25zdCBwYWRMZW5ndGggPSAoNCAtIChiYXNlNjQubGVuZ3RoICUgNCkpICUgNDtcbiAgcmV0dXJuIGAke2Jhc2U2NH0keyc9Jy5yZXBlYXQocGFkTGVuZ3RoKX1gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5jb2RlQmFzZTY0VXJsKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBieXRlcyA9IG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZSh2YWx1ZSk7XG4gIGxldCBiaW5hcnkgPSAnJztcbiAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGJ5dGVzLmxlbmd0aDsgaW5kZXggKz0gQllURV9DSFVOS19TSVpFKSB7XG4gICAgYmluYXJ5ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoXG4gICAgICAuLi5ieXRlcy5zdWJhcnJheShpbmRleCwgaW5kZXggKyBCWVRFX0NIVU5LX1NJWkUpLFxuICAgICk7XG4gIH1cbiAgcmV0dXJuIGJ0b2EoYmluYXJ5KVxuICAgIC5yZXBsYWNlKC9cXCsvZywgJy0nKVxuICAgIC5yZXBsYWNlKC9cXC8vZywgJ18nKVxuICAgIC5yZXBsYWNlKC89KyQvZywgJycpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVjb2RlQmFzZTY0VXJsKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBiaW5hcnkgPSBhdG9iKG5vcm1hbGl6ZUJhc2U2NFVybCh2YWx1ZSkpO1xuICBjb25zdCBieXRlcyA9IFVpbnQ4QXJyYXkuZnJvbShiaW5hcnksIChjaGFyYWN0ZXIpID0+XG4gICAgY2hhcmFjdGVyLmNoYXJDb2RlQXQoMCksXG4gICk7XG4gIHJldHVybiBuZXcgVGV4dERlY29kZXIoKS5kZWNvZGUoYnl0ZXMpO1xufVxuIiwgImltcG9ydCB7IHBlcmtzIGFzIHBlcmtzIH0gZnJvbSAnYXBwL3J1bnRpbWUvY29udGVudC1jYXRhbG9ncyc7XG5pbXBvcnQgeyB0b3lzIGFzIHRveXMgfSBmcm9tICdhcHAvcnVudGltZS9jb250ZW50LWNhdGFsb2dzJztcbmltcG9ydCB7IHBldHMgYXMgcGV0c0J5VGllciB9IGZyb20gJ2FwcC9ydW50aW1lL2NvbnRlbnQtY2F0YWxvZ3MnO1xuXG5leHBvcnQgY29uc3QgUEVUU19CWV9JRCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG5leHBvcnQgY29uc3QgUEVUU19NRVRBX0JZX0lEID0gbmV3IE1hcDxcbiAgc3RyaW5nLFxuICB7IG5hbWU6IHN0cmluZzsgdGllcjogbnVtYmVyIH1cbj4oKTtcblxuZXhwb3J0IGNvbnN0IFBFVF9JRFNfQllfTkFNRSA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG5cbnR5cGUgUmVwbGF5RGF0YVBldCA9IHtcbiAgSWQ/OiBzdHJpbmcgfCBudW1iZXI7XG4gIGlkPzogc3RyaW5nIHwgbnVtYmVyO1xuICBUaWVyPzogbnVtYmVyIHwgc3RyaW5nO1xuICB0aWVyPzogbnVtYmVyIHwgc3RyaW5nO1xuICBOYW1lPzogc3RyaW5nO1xuICBuYW1lPzogc3RyaW5nO1xufTtcblxudHlwZSBSZXBsYXlEYXRhQ29udGFpbmVyPFQ+ID0ge1xuICBkZWZhdWx0PzogVDtcbn07XG5cbmZ1bmN0aW9uIGlzT2JqZWN0UmVjb3JkKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4ge1xuICByZXR1cm4gdmFsdWUgIT09IG51bGwgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jztcbn1cblxuY29uc3QgcGV0c01vZHVsZSA9IHBldHNCeVRpZXIgYXMgdW5rbm93biBhcyBSZXBsYXlEYXRhQ29udGFpbmVyPHVua25vd24+O1xuY29uc3QgcGV0TGlzdFJhdyA9IHBldHNNb2R1bGUuZGVmYXVsdCA/PyBwZXRzQnlUaWVyO1xuY29uc3QgcGV0TGlzdCA9IEFycmF5LmlzQXJyYXkocGV0TGlzdFJhdylcbiAgPyBwZXRMaXN0UmF3XG4gIDogaXNPYmplY3RSZWNvcmQocGV0TGlzdFJhdylcbiAgICA/IE9iamVjdC52YWx1ZXMocGV0TGlzdFJhdykuZmlsdGVyKHYgPT4gdHlwZW9mIHYgPT09ICdvYmplY3QnICYmIHYgIT09IG51bGwgJiYgKCdJZCcgaW4gdiB8fCAnaWQnIGluIHYpKVxuICAgIDogW107XG5cbnBldExpc3QuZm9yRWFjaCgocGV0VW5rbm93bikgPT4ge1xuICBpZiAoIWlzT2JqZWN0UmVjb3JkKHBldFVua25vd24pKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IHBldCA9IHBldFVua25vd24gYXMgUmVwbGF5RGF0YVBldDtcbiAgY29uc3QgcGV0SWQgPSBTdHJpbmcocGV0LklkID8/IHBldC5pZCk7XG4gIGNvbnN0IHRpZXJWYWx1ZSA9IE51bWJlcihwZXQuVGllciA/PyBwZXQudGllcik7XG4gIGNvbnN0IG5hbWUgPSBwZXQuTmFtZSA/PyBwZXQubmFtZTtcblxuICBpZiAobmFtZSkge1xuICAgIFBFVFNfQllfSUQuc2V0KHBldElkLCBuYW1lKTtcbiAgICBjb25zdCBub3JtYWxpemVkTmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9bXmEtejAtOV0vZywgJycpO1xuICAgIFBFVF9JRFNfQllfTkFNRS5zZXQobm9ybWFsaXplZE5hbWUsIHBldElkKTtcbiAgfVxuXG4gIGlmIChOdW1iZXIuaXNGaW5pdGUodGllclZhbHVlKSAmJiBuYW1lKSB7XG4gICAgUEVUU19NRVRBX0JZX0lELnNldChwZXRJZCwgeyBuYW1lLCB0aWVyOiB0aWVyVmFsdWUgfSk7XG4gIH1cbn0pO1xuXG5jb25zdCBwZXJrTGlzdCA9XG4gIChwZXJrcyBhcyB1bmtub3duIGFzIHsgZGVmYXVsdD86IEFycmF5PHsgSWQ6IHN0cmluZzsgTmFtZTogc3RyaW5nIH0+IH0pXG4gICAgLmRlZmF1bHQgPz8gKHBlcmtzIGFzIHVua25vd24gYXMgQXJyYXk8eyBJZDogc3RyaW5nOyBOYW1lOiBzdHJpbmcgfT4pO1xuY29uc3QgdG95TGlzdCA9XG4gICh0b3lzIGFzIHVua25vd24gYXMgeyBkZWZhdWx0PzogQXJyYXk8eyBJZDogc3RyaW5nOyBOYW1lOiBzdHJpbmcgfT4gfSlcbiAgICAuZGVmYXVsdCA/PyAodG95cyBhcyB1bmtub3duIGFzIEFycmF5PHsgSWQ6IHN0cmluZzsgTmFtZTogc3RyaW5nIH0+KTtcblxuZXhwb3J0IGNvbnN0IFBFUktTX0JZX0lEID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oXG4gIHBlcmtMaXN0Lm1hcCgocGVyaykgPT4gW1N0cmluZyhwZXJrLklkKSwgcGVyay5OYW1lXSksXG4pO1xuZXhwb3J0IGNvbnN0IFRPWVNfQllfSUQgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPihcbiAgdG95TGlzdC5tYXAoKHRveSkgPT4gW1N0cmluZyh0b3kuSWQpLCB0b3kuTmFtZV0pLFxuKTtcblxuZXhwb3J0IGNvbnN0IFBBQ0tfTUFQOiBSZWNvcmQ8bnVtYmVyLCBzdHJpbmc+ID0ge1xuICAwOiAnVHVydGxlJyxcbiAgMTogJ1B1cHB5JyxcbiAgMjogJ1N0YXInLFxuICA1OiAnR29sZGVuJyxcbiAgNjogJ1VuaWNvcm4nLFxuICA3OiAnRGFuZ2VyJyxcbn07XG5cbmNvbnN0IFBBUlJPVF9DT1BZX1BFVF9BQk9NSU5BVElPTl9LRVlfTUFQOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0gKCgpID0+IHtcbiAgY29uc3QgbWFwOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGZvciAobGV0IG91dGVyID0gMTsgb3V0ZXIgPD0gMzsgb3V0ZXIrKykge1xuICAgIGNvbnN0IGJhc2UgPSBgcGFycm90Q29weVBldEFib21pbmF0aW9uU3dhbGxvd2VkUGV0JHtvdXRlcn1gO1xuICAgIGNvbnN0IG91dGVyUHJlZml4ID0gYHBDUEFTJHtvdXRlcn1gO1xuICAgIG1hcFtiYXNlXSA9IG91dGVyUHJlZml4O1xuICAgIG1hcFtgJHtiYXNlfUJlbHVnYVN3YWxsb3dlZFBldGBdID0gYCR7b3V0ZXJQcmVmaXh9QmA7XG4gICAgbWFwW2Ake2Jhc2V9TGV2ZWxgXSA9IGAke291dGVyUHJlZml4fUxgO1xuICAgIG1hcFtgJHtiYXNlfVRpbWVzSHVydGBdID0gYCR7b3V0ZXJQcmVmaXh9VGA7XG4gICAgbWFwW2Ake2Jhc2V9UGFycm90Q29weVBldGBdID0gYCR7b3V0ZXJQcmVmaXh9UENQYDtcbiAgICBtYXBbYCR7YmFzZX1QYXJyb3RDb3B5UGV0QmVsdWdhU3dhbGxvd2VkUGV0YF0gPSBgJHtvdXRlclByZWZpeH1QQ1BCYDtcbiAgICBmb3IgKGxldCBpbm5lciA9IDE7IGlubmVyIDw9IDM7IGlubmVyKyspIHtcbiAgICAgIGNvbnN0IGlubmVyQmFzZSA9IGAke2Jhc2V9UGFycm90Q29weVBldEFib21pbmF0aW9uU3dhbGxvd2VkUGV0JHtpbm5lcn1gO1xuICAgICAgY29uc3QgaW5uZXJQcmVmaXggPSBgJHtvdXRlclByZWZpeH1QQ1BBUyR7aW5uZXJ9YDtcbiAgICAgIG1hcFtpbm5lckJhc2VdID0gaW5uZXJQcmVmaXg7XG4gICAgICBtYXBbYCR7aW5uZXJCYXNlfUJlbHVnYVN3YWxsb3dlZFBldGBdID0gYCR7aW5uZXJQcmVmaXh9QmA7XG4gICAgICBtYXBbYCR7aW5uZXJCYXNlfUxldmVsYF0gPSBgJHtpbm5lclByZWZpeH1MYDtcbiAgICAgIG1hcFtgJHtpbm5lckJhc2V9VGltZXNIdXJ0YF0gPSBgJHtpbm5lclByZWZpeH1UYDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG1hcDtcbn0pKCk7XG5cbmV4cG9ydCBjb25zdCBLRVlfTUFQOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICBwbGF5ZXJQYWNrOiAncFAnLFxuICBvcHBvbmVudFBhY2s6ICdvUCcsXG4gIHBsYXllclRveTogJ3BUJyxcbiAgcGxheWVyVG95TGV2ZWw6ICdwVEwnLFxuICBwbGF5ZXJIYXJkVG95OiAncEhUJyxcbiAgcGxheWVySGFyZFRveUxldmVsOiAncEhUTCcsXG4gIG9wcG9uZW50VG95OiAnb1QnLFxuICBvcHBvbmVudFRveUxldmVsOiAnb1RMJyxcbiAgb3Bwb25lbnRIYXJkVG95OiAnb0hUJyxcbiAgb3Bwb25lbnRIYXJkVG95TGV2ZWw6ICdvSFRMJyxcbiAgdHVybjogJ3QnLFxuICBwbGF5ZXJHb2xkU3BlbnQ6ICdwR1MnLFxuICBvcHBvbmVudEdvbGRTcGVudDogJ29HUycsXG4gIHBsYXllclJvbGxBbW91bnQ6ICdwUkEnLFxuICBvcHBvbmVudFJvbGxBbW91bnQ6ICdvUkEnLFxuICBwbGF5ZXJTdW1tb25lZEFtb3VudDogJ3BTQScsXG4gIG9wcG9uZW50U3VtbW9uZWRBbW91bnQ6ICdvU0EnLFxuICBwbGF5ZXJMZXZlbDNTb2xkOiAncEwzJyxcbiAgb3Bwb25lbnRMZXZlbDNTb2xkOiAnb0wzJyxcbiAgcGxheWVyVHJhbnNmb3JtYXRpb25BbW91bnQ6ICdwVEEnLFxuICBvcHBvbmVudFRyYW5zZm9ybWF0aW9uQW1vdW50OiAnb1RBJyxcbiAgcGxheWVyUGV0czogJ3AnLFxuICBvcHBvbmVudFBldHM6ICdvJyxcbiAgYWxsUGV0czogJ2FwJyxcbiAgbG9nRmlsdGVyOiAnbGYnLFxuICBjdXN0b21QYWNrczogJ2NwJyxcbiAgb2xkU3Rvcms6ICdvcycsXG4gIHRva2VuUGV0czogJ3RwJyxcbiAga29tb2RvU2h1ZmZsZTogJ2tzJyxcbiAgbWFuYTogJ20nLFxuICBzZWVkOiAnc2QnLFxuICB0cmlnZ2Vyc0NvbnN1bWVkOiAndGMnLFxuICBzaG93QWR2YW5jZWQ6ICdzYScsXG4gIHNob3dUcmlnZ2VyTmFtZXNJbkxvZ3M6ICdzdG4nLFxuICBzaG93UG9zaXRpb25hbEFyZ3NJbkxvZ3M6ICdzcGEnLFxuICBhaWxtZW50RXF1aXBtZW50OiAnYWUnLFxuICBuYW1lOiAnbicsXG4gIGF0dGFjazogJ2EnLFxuICBoZWFsdGg6ICdoJyxcbiAgZXhwOiAnZScsXG4gIGVxdWlwbWVudDogJ2VxJyxcbiAgYmVsdWdhU3dhbGxvd2VkUGV0OiAnYlNQJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxOiAnYVNQMScsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MjogJ2FTUDInLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDM6ICdhU1AzJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxQmVsdWdhU3dhbGxvd2VkUGV0OiAnYVNQMUInLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDJCZWx1Z2FTd2FsbG93ZWRQZXQ6ICdhU1AyQicsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M0JlbHVnYVN3YWxsb3dlZFBldDogJ2FTUDNCJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxU2FyY2FzdGljRnJpbmdlaGVhZFN3YWxsb3dlZFBldDogJ2FTUDFTRlMnLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDJTYXJjYXN0aWNGcmluZ2VoZWFkU3dhbGxvd2VkUGV0OiAnYVNQMlNGUycsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M1NhcmNhc3RpY0ZyaW5nZWhlYWRTd2FsbG93ZWRQZXQ6ICdhU1AzU0ZTJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxTGV2ZWw6ICdhU1AxTCcsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MkxldmVsOiAnYVNQMkwnLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDNMZXZlbDogJ2FTUDNMJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxVGltZXNIdXJ0OiAnYVNQMVQnLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDJUaW1lc0h1cnQ6ICdhU1AyVCcsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M1RpbWVzSHVydDogJ2FTUDNUJyxcbiAgcGFycm90Q29weVBldDogJ3BDUCcsXG4gIHBhcnJvdENvcHlQZXRCZWx1Z2FTd2FsbG93ZWRQZXQ6ICdwQ1BCJyxcbiAgLi4uUEFSUk9UX0NPUFlfUEVUX0FCT01JTkFUSU9OX0tFWV9NQVAsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MVBhcnJvdENvcHlQZXQ6ICdhU1AxUENQJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQyUGFycm90Q29weVBldDogJ2FTUDJQQ1AnLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDNQYXJyb3RDb3B5UGV0OiAnYVNQM1BDUCcsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MVBhcnJvdENvcHlQZXRCZWx1Z2FTd2FsbG93ZWRQZXQ6ICdhU1AxUENQQicsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MlBhcnJvdENvcHlQZXRCZWx1Z2FTd2FsbG93ZWRQZXQ6ICdhU1AyUENQQicsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M1BhcnJvdENvcHlQZXRCZWx1Z2FTd2FsbG93ZWRQZXQ6ICdhU1AzUENQQicsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MVBhcnJvdENvcHlQZXRBYm9taW5hdGlvblN3YWxsb3dlZFBldDE6ICdhU1AxUENQQVMxJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxUGFycm90Q29weVBldEFib21pbmF0aW9uU3dhbGxvd2VkUGV0MjogJ2FTUDFQQ1BBUzInLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDFQYXJyb3RDb3B5UGV0QWJvbWluYXRpb25Td2FsbG93ZWRQZXQzOiAnYVNQMVBDUEFTMycsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MlBhcnJvdENvcHlQZXRBYm9taW5hdGlvblN3YWxsb3dlZFBldDE6ICdhU1AyUENQQVMxJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQyUGFycm90Q29weVBldEFib21pbmF0aW9uU3dhbGxvd2VkUGV0MjogJ2FTUDJQQ1BBUzInLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDJQYXJyb3RDb3B5UGV0QWJvbWluYXRpb25Td2FsbG93ZWRQZXQzOiAnYVNQMlBDUEFTMycsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M1BhcnJvdENvcHlQZXRBYm9taW5hdGlvblN3YWxsb3dlZFBldDE6ICdhU1AzUENQQVMxJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzUGFycm90Q29weVBldEFib21pbmF0aW9uU3dhbGxvd2VkUGV0MjogJ2FTUDNQQ1BBUzInLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDNQYXJyb3RDb3B5UGV0QWJvbWluYXRpb25Td2FsbG93ZWRQZXQzOiAnYVNQM1BDUEFTMycsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MVBhcnJvdENvcHlQZXRBYm9taW5hdGlvblN3YWxsb3dlZFBldDFCZWx1Z2FTd2FsbG93ZWRQZXQ6XG4gICAgJ2FTUDFQQ1BBUzFCJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxUGFycm90Q29weVBldEFib21pbmF0aW9uU3dhbGxvd2VkUGV0MkJlbHVnYVN3YWxsb3dlZFBldDpcbiAgICAnYVNQMVBDUEFTMkInLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDFQYXJyb3RDb3B5UGV0QWJvbWluYXRpb25Td2FsbG93ZWRQZXQzQmVsdWdhU3dhbGxvd2VkUGV0OlxuICAgICdhU1AxUENQQVMzQicsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MlBhcnJvdENvcHlQZXRBYm9taW5hdGlvblN3YWxsb3dlZFBldDFCZWx1Z2FTd2FsbG93ZWRQZXQ6XG4gICAgJ2FTUDJQQ1BBUzFCJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQyUGFycm90Q29weVBldEFib21pbmF0aW9uU3dhbGxvd2VkUGV0MkJlbHVnYVN3YWxsb3dlZFBldDpcbiAgICAnYVNQMlBDUEFTMkInLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDJQYXJyb3RDb3B5UGV0QWJvbWluYXRpb25Td2FsbG93ZWRQZXQzQmVsdWdhU3dhbGxvd2VkUGV0OlxuICAgICdhU1AyUENQQVMzQicsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M1BhcnJvdENvcHlQZXRBYm9taW5hdGlvblN3YWxsb3dlZFBldDFCZWx1Z2FTd2FsbG93ZWRQZXQ6XG4gICAgJ2FTUDNQQ1BBUzFCJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzUGFycm90Q29weVBldEFib21pbmF0aW9uU3dhbGxvd2VkUGV0MkJlbHVnYVN3YWxsb3dlZFBldDpcbiAgICAnYVNQM1BDUEFTMkInLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDNQYXJyb3RDb3B5UGV0QWJvbWluYXRpb25Td2FsbG93ZWRQZXQzQmVsdWdhU3dhbGxvd2VkUGV0OlxuICAgICdhU1AzUENQQVMzQicsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MVBhcnJvdENvcHlQZXRBYm9taW5hdGlvblN3YWxsb3dlZFBldDFMZXZlbDpcbiAgICAnYVNQMVBDUEFTMUwnLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDFQYXJyb3RDb3B5UGV0QWJvbWluYXRpb25Td2FsbG93ZWRQZXQyTGV2ZWw6XG4gICAgJ2FTUDFQQ1BBUzJMJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxUGFycm90Q29weVBldEFib21pbmF0aW9uU3dhbGxvd2VkUGV0M0xldmVsOlxuICAgICdhU1AxUENQQVMzTCcsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MlBhcnJvdENvcHlQZXRBYm9taW5hdGlvblN3YWxsb3dlZFBldDFMZXZlbDpcbiAgICAnYVNQMlBDUEFTMUwnLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDJQYXJyb3RDb3B5UGV0QWJvbWluYXRpb25Td2FsbG93ZWRQZXQyTGV2ZWw6XG4gICAgJ2FTUDJQQ1BBUzJMJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQyUGFycm90Q29weVBldEFib21pbmF0aW9uU3dhbGxvd2VkUGV0M0xldmVsOlxuICAgICdhU1AyUENQQVMzTCcsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M1BhcnJvdENvcHlQZXRBYm9taW5hdGlvblN3YWxsb3dlZFBldDFMZXZlbDpcbiAgICAnYVNQM1BDUEFTMUwnLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDNQYXJyb3RDb3B5UGV0QWJvbWluYXRpb25Td2FsbG93ZWRQZXQyTGV2ZWw6XG4gICAgJ2FTUDNQQ1BBUzJMJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzUGFycm90Q29weVBldEFib21pbmF0aW9uU3dhbGxvd2VkUGV0M0xldmVsOlxuICAgICdhU1AzUENQQVMzTCcsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MVBhcnJvdENvcHlQZXRBYm9taW5hdGlvblN3YWxsb3dlZFBldDFUaW1lc0h1cnQ6XG4gICAgJ2FTUDFQQ1BBUzFUJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxUGFycm90Q29weVBldEFib21pbmF0aW9uU3dhbGxvd2VkUGV0MlRpbWVzSHVydDpcbiAgICAnYVNQMVBDUEFTMlQnLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDFQYXJyb3RDb3B5UGV0QWJvbWluYXRpb25Td2FsbG93ZWRQZXQzVGltZXNIdXJ0OlxuICAgICdhU1AxUENQQVMzVCcsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MlBhcnJvdENvcHlQZXRBYm9taW5hdGlvblN3YWxsb3dlZFBldDFUaW1lc0h1cnQ6XG4gICAgJ2FTUDJQQ1BBUzFUJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQyUGFycm90Q29weVBldEFib21pbmF0aW9uU3dhbGxvd2VkUGV0MlRpbWVzSHVydDpcbiAgICAnYVNQMlBDUEFTMlQnLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDJQYXJyb3RDb3B5UGV0QWJvbWluYXRpb25Td2FsbG93ZWRQZXQzVGltZXNIdXJ0OlxuICAgICdhU1AyUENQQVMzVCcsXG4gIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M1BhcnJvdENvcHlQZXRBYm9taW5hdGlvblN3YWxsb3dlZFBldDFUaW1lc0h1cnQ6XG4gICAgJ2FTUDNQQ1BBUzFUJyxcbiAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzUGFycm90Q29weVBldEFib21pbmF0aW9uU3dhbGxvd2VkUGV0MlRpbWVzSHVydDpcbiAgICAnYVNQM1BDUEFTMlQnLFxuICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDNQYXJyb3RDb3B5UGV0QWJvbWluYXRpb25Td2FsbG93ZWRQZXQzVGltZXNIdXJ0OlxuICAgICdhU1AzUENQQVMzVCcsXG4gIHRpbWVzSHVydDogJ3RIJyxcbiAgYWlsbWVudHNDb3VudDogJ2FDJyxcbiAgZnJpZW5kc0h1cnRCZWZvcmVCYXR0bGU6ICdmSEJCJyxcbn07XG4iLCAiLyogVXRpbGl0aWVzIHBvcnRlZC9hZGFwdGVkIGZyb20gcmVwbGF5IHBhcml0eSBmaXhlcyBQUi5cbiAgIFB1cnBvc2U6IHJvYnVzdCBwZXQvdG95IGlkIHJlc29sdXRpb24sIGFiaWxpdHkgZmFsbGJhY2tzLCBhYm9taW5hdGlvblxuICAgc3dhbGxvd2VkLXBldCBpbmZlcmVuY2UsIGFuZCBzbWFsbCBoZWxwZXJzIHVzZWQgYnkgdGhlIHJlcGxheSBwYXJzZXIuXG4qL1xuXG50eXBlIFJlcGxheVVua25vd25SZWNvcmQgPSBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbnR5cGUgUmVwbGF5TmFtZUxvb2t1cCA9XG4gIHwgTWFwPHN0cmluZywgc3RyaW5nIHwgbnVtYmVyPlxuICB8IFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IG51bWJlciB8IHVuZGVmaW5lZD47XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVwbGF5UGFyc2VyTG9va3VwTWFwcyB7XG4gIHBldElkc0J5TmFtZT86IFJlcGxheU5hbWVMb29rdXA7XG4gIFBFVF9JRFNfQllfTkFNRT86IFJlcGxheU5hbWVMb29rdXA7XG4gIGFiaWxpdHlJZHNCeVBldElkPzogUmVjb3JkPHN0cmluZywgQXJyYXk8c3RyaW5nIHwgbnVtYmVyPiB8IHVuZGVmaW5lZD47XG4gIHRveUlkc0J5TmFtZT86IFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IG51bWJlciB8IHVuZGVmaW5lZD47XG59XG5cbmludGVyZmFjZSBSZXBsYXlNZW1vcnlQYXlsb2FkIHtcbiAgTHN0czogUmVjb3JkPHN0cmluZywgUmVwbGF5VW5rbm93blJlY29yZFtdPjtcbn1cblxuaW50ZXJmYWNlIFJlcGxheU1lbW9yeUVudHJ5IGV4dGVuZHMgUmVwbGF5VW5rbm93blJlY29yZCB7XG4gIEVudTogbnVtYmVyO1xuICBBdD86IG51bWJlcjtcbiAgSHA/OiBudW1iZXI7XG4gIE1hbmE/OiBudW1iZXIgfCBudWxsO1xuICBMdmw/OiBudW1iZXI7XG4gIEV4cD86IG51bWJlciB8IG51bGw7XG4gIFBlcms/OiBudW1iZXIgfCBudWxsO1xuICBQb3dhPzogbnVtYmVyIHwgbnVsbDtcbiAgSHJ0Qz86IG51bWJlciB8IG51bGw7XG4gIE1pTXM/OiBSZXBsYXlNZW1vcnlQYXlsb2FkO1xufVxuXG5pbnRlcmZhY2UgQWJvbWluYXRpb25TbG90Q29uZmlnIHtcbiAgcGV0S2V5OiBzdHJpbmc7XG4gIGxldmVsS2V5OiBzdHJpbmc7XG4gIGJlbHVnYUtleTogc3RyaW5nO1xuICBzZnNLZXk6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIEFib21pbmF0aW9uU3dhbGxvd2VkRW50cnkge1xuICBzd2FsbG93ZWRQZXRJZDogbnVtYmVyO1xuICBzd2FsbG93ZWRBYmlsaXR5RW51bXM6IG51bWJlcltdO1xuICBtZW1vcnlFbnRyeTogUmVwbGF5TWVtb3J5RW50cnk7XG4gIGJlbHVnYVN3YWxsb3dlZEVudHJ5PzogUmVwbGF5TWVtb3J5UGF5bG9hZCB8IG51bGw7XG59XG5cbmludGVyZmFjZSBSZXBsYXlXYXJuaW5nQmFnIHtcbiAgdW5rbm93blRveXM6IHN0cmluZ1tdO1xufVxuXG5pbnRlcmZhY2UgUmVwbGF5QWJpbGl0eUVudHJ5IHtcbiAgRW51OiBudW1iZXI7XG4gIEx2bDogbnVtYmVyO1xuICBOYXQ6IGJvb2xlYW47XG4gIER1cjogbnVtYmVyO1xuICBUckNvOiBudW1iZXI7XG4gIENoYXI6IG51bGw7XG4gIERpczogYm9vbGVhbjtcbiAgQUlNTDogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIFJlcGxheVJlbGljSXRlbSB7XG4gIE93bjogbnVtYmVyO1xuICBFbnU6IG51bWJlcjtcbiAgTG9jOiBudW1iZXI7XG4gIFBvaTogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9O1xuICBFeHA6IG51bWJlcjtcbiAgTHZsOiBudW1iZXI7XG4gIEhwOiB7IFBlcm06IG51bWJlcjsgVGVtcDogbnVtYmVyOyBNYXg6IG51bWJlciB8IG51bGwgfTtcbiAgQXQ6IHsgUGVybTogbnVtYmVyOyBUZW1wOiBudW1iZXI7IE1heDogbnVtYmVyIHwgbnVsbCB9O1xuICBNYW5hOiBudW1iZXI7XG4gIENvdTogbnVtYmVyO1xuICBQZUJvOiBib29sZWFuO1xuICBQZUR1OiBudWxsO1xuICBQZURNOiBudWxsO1xuICBQZU11OiBudWxsO1xuICBQZURyOiBudW1iZXI7XG4gIEFiaWw6IFJlcGxheUFiaWxpdHlFbnRyeVtdO1xuICBBYkRpOiBib29sZWFuO1xuICBDb3NtOiBudW1iZXI7XG4gIERlYWQ6IGJvb2xlYW47XG4gIERlc3Q6IGJvb2xlYW47XG4gIERlQnk6IG51bGw7XG4gIExpbms6IG51bGw7XG4gIFBvdzogbnVsbDtcbiAgU2VWOiBudWxsO1xuICBSd2RzOiBudW1iZXI7XG4gIFJ3cmQ6IGJvb2xlYW47XG4gIE1pTXM6IG51bGw7XG4gIFNwTWU6IG51bGw7XG4gIFRyaTogbnVsbDtcbiAgQXRrQzogbnVtYmVyO1xuICBIcnRDOiBudW1iZXI7XG4gIFNwQ1Q6IG51bWJlcjtcbiAgT2xUczogbnVsbDtcbiAgTGFzdFRhcmdldHNUaGlzVHVybjogbnVsbDtcbiAgSWQ6IHsgQm9JZDogc3RyaW5nOyBVbmk6IG51bWJlciB9O1xuICBQcmk6IG51bWJlcjtcbiAgRnJvOiBib29sZWFuO1xuICBXRnJvOiBib29sZWFuO1xuICBBRnJvOiBib29sZWFuO1xufVxuXG5leHBvcnQgY29uc3QgRkFMTEJBQ0tfQUJJTElUWV9JRFNfQllfUEVUX0lEOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXJbXT4gPSB7XG4gICczMzgnOiBbMzY4XSxcbiAgJzM3Myc6IFs0MDNdLFxuICAnNjM1JzogWzY2OV0sXG4gIC8vIFNhcmNhc3RpYyBGcmluZ2VoZWFkIG9ic2VydmVkIG11bHRpcGxlIGFiaWxpdHkgZW51bXMgaW4gcGF5bG9hZHNcbiAgJzc2Myc6IFs4NTMsIDk3MF0sXG59O1xuXG5leHBvcnQgY29uc3QgRkFMTEJBQ0tfVE9ZX0lEU19CWV9OQU1FOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+ID0ge1xuICBhY3Rpb25maWd1cmU6IDI5NCxcbiAgYWlycGFsbXRyZWU6IDUxMSxcbiAgYmFsbG9vbjogNDc5LFxuICBib290OiAyOTksXG4gIGJvd2xpbmdiYWxsOiAzMDAsXG4gIGJyb2tlbnBpZ2d5YmFuazogMzEwLFxuICBicm9vbTogMzAxLFxuICBjYXJkYm9hcmRib3g6IDMwMixcbiAgLy8gKHRyaW1tZWQgbGlzdCAtIGluY2x1ZGUgY29tbW9uIGZhbGxiYWNrcyB1c2VkIGluIGxpdmUgcGF5bG9hZHMpXG4gIHRlbGV2aXNpb246IDQ5MSxcbiAgdG95bW91c2U6IDMyNyxcbn07XG5cbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3QodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBSZXBsYXlVbmtub3duUmVjb3JkIHtcbiAgcmV0dXJuIEJvb2xlYW4odmFsdWUpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpO1xufVxuXG5mdW5jdGlvbiBnZXRSZWNvcmQodmFsdWU6IHVua25vd24pOiBSZXBsYXlVbmtub3duUmVjb3JkIHwgbnVsbCB7XG4gIHJldHVybiBpc1BsYWluT2JqZWN0KHZhbHVlKSA/IHZhbHVlIDogbnVsbDtcbn1cblxuZnVuY3Rpb24gZ2V0QnlOYW1lTG9va3VwKFxuICBsb29rdXA6IFJlcGxheU5hbWVMb29rdXAgfCB1bmRlZmluZWQsXG4gIGtleTogc3RyaW5nLFxuKTogc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkIHtcbiAgaWYgKCFsb29rdXApIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGlmIChsb29rdXAgaW5zdGFuY2VvZiBNYXApIHtcbiAgICByZXR1cm4gbG9va3VwLmdldChrZXkpO1xuICB9XG4gIHJldHVybiBsb29rdXBba2V5XTtcbn1cblxuZnVuY3Rpb24gdG9JbnRPck51bGwodmFsdWU6IHVua25vd24pOiBudW1iZXIgfCBudWxsIHtcbiAgY29uc3QgbiA9IE51bWJlcih2YWx1ZSk7XG4gIHJldHVybiBOdW1iZXIuaXNGaW5pdGUobikgPyBNYXRoLnRydW5jKG4pIDogbnVsbDtcbn1cblxuZnVuY3Rpb24gdG9OdWxsYWJsZU51bWJlcih2YWx1ZTogdW5rbm93bik6IG51bWJlciB8IG51bGwge1xuICBjb25zdCBuID0gTnVtYmVyKHZhbHVlKTtcbiAgcmV0dXJuIE51bWJlci5pc0Zpbml0ZShuKSA/IG4gOiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9GaW5pdGVOdW1iZXIodmFsdWU6IHVua25vd24sIGZhbGxiYWNrID0gMCk6IG51bWJlciB7XG4gIGNvbnN0IG51bWVyaWMgPSBOdW1iZXIodmFsdWUpO1xuICByZXR1cm4gTnVtYmVyLmlzRmluaXRlKG51bWVyaWMpID8gbnVtZXJpYyA6IGZhbGxiYWNrO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVBldElkRnJvbVVua25vd24oXG4gIHZhbHVlOiB1bmtub3duLFxuICBtYXBzPzogUmVwbGF5UGFyc2VyTG9va3VwTWFwcyxcbik6IG51bWJlciB8IG51bGwge1xuICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGlmIChpc1BsYWluT2JqZWN0KHZhbHVlKSkge1xuICAgIGNvbnN0IGRpcmVjdElkQ2FuZGlkYXRlcyA9IFtcbiAgICAgIHZhbHVlWydpZCddLFxuICAgICAgdmFsdWVbJ0lkJ10sXG4gICAgICB2YWx1ZVsncGV0SWQnXSxcbiAgICAgIHZhbHVlWydQZXRJZCddLFxuICAgICAgdmFsdWVbJ2VudW0nXSxcbiAgICAgIHZhbHVlWydFbnVtJ10sXG4gICAgICB2YWx1ZVsnRW51J10sXG4gICAgICB2YWx1ZVsnZW51J10sXG4gICAgXTtcbiAgICBmb3IgKGNvbnN0IGNhbmRpZGF0ZSBvZiBkaXJlY3RJZENhbmRpZGF0ZXMpIHtcbiAgICAgIGlmIChjYW5kaWRhdGUgPT09IHVuZGVmaW5lZCB8fCBjYW5kaWRhdGUgPT09IG51bGwpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBjb25zdCBudW1lcmljID0gdG9GaW5pdGVOdW1iZXIoY2FuZGlkYXRlLCBOYU4pO1xuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShudW1lcmljKSkge1xuICAgICAgICByZXR1cm4gTWF0aC50cnVuYyhudW1lcmljKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBuYW1lUmF3ID0gdmFsdWVbJ25hbWUnXSA/PyB2YWx1ZVsnTmFtZSddO1xuICAgIGlmICh0eXBlb2YgbmFtZVJhdyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IGtleSA9IG5hbWVSYXcudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9bXmEtejAtOV0vZywgJycpO1xuICAgICAgY29uc3QgcGV0SWRzQnlOYW1lID0gbWFwcz8ucGV0SWRzQnlOYW1lID8/IG1hcHM/LlBFVF9JRFNfQllfTkFNRTtcbiAgICAgIGNvbnN0IGlkID0gZ2V0QnlOYW1lTG9va3VwKHBldElkc0J5TmFtZSwga2V5KTtcbiAgICAgIGNvbnN0IG51bWVyaWMgPSB0b0ludE9yTnVsbChpZCk7XG4gICAgICBpZiAobnVtZXJpYyAhPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbnVtZXJpYztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIGNvbnN0IHMgPSB2YWx1ZS50cmltKCk7XG4gICAgaWYgKHMgPT09ICcnKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgbnVtZXJpYyA9IHRvRmluaXRlTnVtYmVyKHMsIE5hTik7XG4gICAgaWYgKE51bWJlci5pc0Zpbml0ZShudW1lcmljKSkge1xuICAgICAgcmV0dXJuIE1hdGgudHJ1bmMobnVtZXJpYyk7XG4gICAgfVxuICAgIGNvbnN0IGtleSA9IHMudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9bXmEtejAtOV0vZywgJycpO1xuICAgIGNvbnN0IHBldElkc0J5TmFtZSA9IG1hcHM/LnBldElkc0J5TmFtZSA/PyBtYXBzPy5QRVRfSURTX0JZX05BTUU7XG4gICAgY29uc3QgaWQgPSBnZXRCeU5hbWVMb29rdXAocGV0SWRzQnlOYW1lLCBrZXkpO1xuICAgIGNvbnN0IG1hcHBlZCA9IHRvSW50T3JOdWxsKGlkKTtcbiAgICBpZiAobWFwcGVkICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbWFwcGVkO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IG51bWVyaWMgPSB0b0Zpbml0ZU51bWJlcih2YWx1ZSwgTmFOKTtcbiAgaWYgKE51bWJlci5pc0Zpbml0ZShudW1lcmljKSkge1xuICAgIHJldHVybiBNYXRoLnRydW5jKG51bWVyaWMpO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5pcXVlTnVtYmVycyh2YWx1ZXM6IHVua25vd25bXSk6IG51bWJlcltdIHtcbiAgY29uc3Qgb3V0OiBudW1iZXJbXSA9IFtdO1xuICBjb25zdCBzZWVuID0gbmV3IFNldDxudW1iZXI+KCk7XG4gIGZvciAoY29uc3QgdiBvZiB2YWx1ZXMpIHtcbiAgICBpZiAodiA9PT0gbnVsbCB8fCB2ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCBuID0gTnVtYmVyKHYpO1xuICAgIGlmICghTnVtYmVyLmlzRmluaXRlKG4pKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgY29uc3Qgbm9ybWFsaXplZCA9IE1hdGgudHJ1bmMobik7XG4gICAgaWYgKHNlZW4uaGFzKG5vcm1hbGl6ZWQpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgc2Vlbi5hZGQobm9ybWFsaXplZCk7XG4gICAgb3V0LnB1c2gobm9ybWFsaXplZCk7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFiaWxpdHlFbnVtc0ZvclBldChcbiAgcGV0SWQ6IG51bWJlcixcbiAgbWFwcz86IFJlcGxheVBhcnNlckxvb2t1cE1hcHMsXG4pOiBudW1iZXJbXSB7XG4gIGNvbnN0IGFiaWxpdHlNYXAgPSBtYXBzPy5hYmlsaXR5SWRzQnlQZXRJZCA/PyB7fTtcbiAgY29uc3Qga2V5ID0gU3RyaW5nKHBldElkKTtcbiAgY29uc3QgbWFwcGVkID0gQXJyYXkuaXNBcnJheShhYmlsaXR5TWFwW2tleV0pID8gYWJpbGl0eU1hcFtrZXldID8/IFtdIDogW107XG4gIGNvbnN0IGZhbGxiYWNrID0gQXJyYXkuaXNBcnJheShGQUxMQkFDS19BQklMSVRZX0lEU19CWV9QRVRfSURba2V5XSlcbiAgICA/IEZBTExCQUNLX0FCSUxJVFlfSURTX0JZX1BFVF9JRFtrZXldXG4gICAgOiBbXTtcbiAgcmV0dXJuIHVuaXF1ZU51bWJlcnMoWy4uLm1hcHBlZCwgLi4uZmFsbGJhY2tdKTtcbn1cblxuZnVuY3Rpb24gYnVpbGRCZWx1Z2FTd2FsbG93ZWRFbnRyeShzd2FsbG93ZWRSYXc6IHVua25vd24pOiBSZXBsYXlNZW1vcnlFbnRyeSB8IG51bGwge1xuICBjb25zdCBzd2FsbG93ZWRQZXRJZCA9IHJlc29sdmVQZXRJZEZyb21Vbmtub3duKHN3YWxsb3dlZFJhdyk7XG4gIGlmICghTnVtYmVyLmlzRmluaXRlKHN3YWxsb3dlZFBldElkKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGNvbnN0IGVudHJ5OiBSZXBsYXlNZW1vcnlFbnRyeSA9IHsgRW51OiBzd2FsbG93ZWRQZXRJZCB9O1xuICBjb25zdCBzd2FsbG93ZWQgPSBnZXRSZWNvcmQoc3dhbGxvd2VkUmF3KTtcbiAgaWYgKCFzd2FsbG93ZWQpIHtcbiAgICByZXR1cm4gZW50cnk7XG4gIH1cbiAgY29uc3QgYXR0YWNrID0gdG9GaW5pdGVOdW1iZXIoXG4gICAgc3dhbGxvd2VkWydhdHRhY2snXSA/PyBzd2FsbG93ZWRbJ0F0J10gPz8gc3dhbGxvd2VkWydhdCddLFxuICAgIE5hTixcbiAgKTtcbiAgaWYgKE51bWJlci5pc0Zpbml0ZShhdHRhY2spKSB7XG4gICAgZW50cnkuQXQgPSBNYXRoLm1heCgwLCBNYXRoLnJvdW5kKGF0dGFjaykpO1xuICB9XG4gIGNvbnN0IGhlYWx0aCA9IHRvRmluaXRlTnVtYmVyKFxuICAgIHN3YWxsb3dlZFsnaGVhbHRoJ10gPz8gc3dhbGxvd2VkWydIcCddID8/IHN3YWxsb3dlZFsnaHAnXSxcbiAgICBOYU4sXG4gICk7XG4gIGlmIChOdW1iZXIuaXNGaW5pdGUoaGVhbHRoKSkge1xuICAgIGVudHJ5LkhwID0gTWF0aC5tYXgoMSwgTWF0aC5yb3VuZChoZWFsdGgpKTtcbiAgfVxuICBjb25zdCBtYW5hID0gdG9GaW5pdGVOdW1iZXIoc3dhbGxvd2VkWydtYW5hJ10gPz8gc3dhbGxvd2VkWydNYW5hJ10sIE5hTik7XG4gIGlmIChOdW1iZXIuaXNGaW5pdGUobWFuYSkpIHtcbiAgICBlbnRyeS5NYW5hID0gTWF0aC5tYXgoMCwgTWF0aC5yb3VuZChtYW5hKSk7XG4gIH1cbiAgY29uc3QgbGV2ZWwgPSB0b0Zpbml0ZU51bWJlcihcbiAgICBzd2FsbG93ZWRbJ2xldmVsJ10gPz8gc3dhbGxvd2VkWydsdmwnXSA/PyBzd2FsbG93ZWRbJ0x2bCddLFxuICAgIE5hTixcbiAgKTtcbiAgaWYgKE51bWJlci5pc0Zpbml0ZShsZXZlbCkpIHtcbiAgICBlbnRyeS5MdmwgPSBNYXRoLm1heCgxLCBNYXRoLm1pbigzLCBNYXRoLnJvdW5kKGxldmVsKSkpO1xuICB9XG4gIGNvbnN0IGV4cCA9IHRvRmluaXRlTnVtYmVyKHN3YWxsb3dlZFsnZXhwJ10gPz8gc3dhbGxvd2VkWydFeHAnXSwgTmFOKTtcbiAgaWYgKE51bWJlci5pc0Zpbml0ZShleHApKSB7XG4gICAgZW50cnkuRXhwID0gTWF0aC5tYXgoMCwgTWF0aC5yb3VuZChleHApKTtcbiAgfVxuICBjb25zdCBwZXJrID0gc3dhbGxvd2VkWydwZXJrJ10gPz8gc3dhbGxvd2VkWydQZXJrJ107XG4gIGNvbnN0IHBlcmtOdW1iZXIgPSB0b051bGxhYmxlTnVtYmVyKHBlcmspO1xuICBpZiAocGVya051bWJlciAhPT0gbnVsbCkge1xuICAgIGVudHJ5LlBlcmsgPSBwZXJrTnVtYmVyO1xuICB9XG4gIGNvbnN0IHRpbWVzSHVydCA9IHRvRmluaXRlTnVtYmVyKFxuICAgIHN3YWxsb3dlZFsndGltZXNIdXJ0J10gPz8gc3dhbGxvd2VkWydUaW1lc0h1cnQnXSA/PyBzd2FsbG93ZWRbJ0hydEMnXSxcbiAgICBOYU4sXG4gICk7XG4gIGlmIChOdW1iZXIuaXNGaW5pdGUodGltZXNIdXJ0KSkge1xuICAgIGVudHJ5LkhydEMgPSBNYXRoLm1heCgwLCBNYXRoLnJvdW5kKHRpbWVzSHVydCkpO1xuICB9XG4gIHJldHVybiBlbnRyeTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbGxlY3RBYm9taW5hdGlvblN3YWxsb3dlZEVudHJpZXMoXG4gIHJhd1BldDogdW5rbm93bixcbiAgbWFwcz86IFJlcGxheVBhcnNlckxvb2t1cE1hcHMsXG4pOiBBYm9taW5hdGlvblN3YWxsb3dlZEVudHJ5W10ge1xuICBjb25zdCBzbG90Q29uZmlnczogQWJvbWluYXRpb25TbG90Q29uZmlnW10gPSBbXG4gICAge1xuICAgICAgcGV0S2V5OiAnYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxJyxcbiAgICAgIGxldmVsS2V5OiAnYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxTGV2ZWwnLFxuICAgICAgYmVsdWdhS2V5OiAnYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxQmVsdWdhU3dhbGxvd2VkUGV0JyxcbiAgICAgIHNmc0tleTogJ2Fib21pbmF0aW9uU3dhbGxvd2VkUGV0MVNhcmNhc3RpY0ZyaW5nZWhlYWRTd2FsbG93ZWRQZXQnLFxuICAgIH0sXG4gICAge1xuICAgICAgcGV0S2V5OiAnYWJvbWluYXRpb25Td2FsbG93ZWRQZXQyJyxcbiAgICAgIGxldmVsS2V5OiAnYWJvbWluYXRpb25Td2FsbG93ZWRQZXQyTGV2ZWwnLFxuICAgICAgYmVsdWdhS2V5OiAnYWJvbWluYXRpb25Td2FsbG93ZWRQZXQyQmVsdWdhU3dhbGxvd2VkUGV0JyxcbiAgICAgIHNmc0tleTogJ2Fib21pbmF0aW9uU3dhbGxvd2VkUGV0MlNhcmNhc3RpY0ZyaW5nZWhlYWRTd2FsbG93ZWRQZXQnLFxuICAgIH0sXG4gICAge1xuICAgICAgcGV0S2V5OiAnYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzJyxcbiAgICAgIGxldmVsS2V5OiAnYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzTGV2ZWwnLFxuICAgICAgYmVsdWdhS2V5OiAnYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzQmVsdWdhU3dhbGxvd2VkUGV0JyxcbiAgICAgIHNmc0tleTogJ2Fib21pbmF0aW9uU3dhbGxvd2VkUGV0M1NhcmNhc3RpY0ZyaW5nZWhlYWRTd2FsbG93ZWRQZXQnLFxuICAgIH0sXG4gIF07XG4gIGNvbnN0IHJvb3QgPSBnZXRSZWNvcmQocmF3UGV0KTtcbiAgY29uc3QgZW50cmllczogQWJvbWluYXRpb25Td2FsbG93ZWRFbnRyeVtdID0gW107XG4gIGZvciAoY29uc3Qgc2xvdENvbmZpZyBvZiBzbG90Q29uZmlncykge1xuICAgIGNvbnN0IHN3YWxsb3dlZFJhdyA9IHJvb3Q/LltzbG90Q29uZmlnLnBldEtleV07XG4gICAgY29uc3Qgc3dhbGxvd2VkUGV0SWQgPSByZXNvbHZlUGV0SWRGcm9tVW5rbm93bihzd2FsbG93ZWRSYXcsIG1hcHMpO1xuICAgIGlmICghTnVtYmVyLmlzRmluaXRlKHN3YWxsb3dlZFBldElkKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IHN3YWxsb3dlZFJlY29yZCA9IGdldFJlY29yZChzd2FsbG93ZWRSYXcpO1xuICAgIGNvbnN0IHN3YWxsb3dlZEFiaWxpdHlFbnVtcyA9IGdldEFiaWxpdHlFbnVtc0ZvclBldChzd2FsbG93ZWRQZXRJZCwgbWFwcyk7XG4gICAgY29uc3QgbWVtb3J5RW50cnkgPVxuICAgICAgYnVpbGRCZWx1Z2FTd2FsbG93ZWRFbnRyeShzd2FsbG93ZWRSYXcpID8/ICh7IEVudTogc3dhbGxvd2VkUGV0SWQgfSBhcyBSZXBsYXlNZW1vcnlFbnRyeSk7XG4gICAgY29uc3Qgc3dhbGxvd2VkTGV2ZWwgPSB0b0Zpbml0ZU51bWJlcihyb290Py5bc2xvdENvbmZpZy5sZXZlbEtleV0sIE5hTik7XG4gICAgaWYgKE51bWJlci5pc0Zpbml0ZShzd2FsbG93ZWRMZXZlbCkpIHtcbiAgICAgIG1lbW9yeUVudHJ5Lkx2bCA9IE1hdGgubWF4KDEsIE1hdGgubWluKDMsIE1hdGgucm91bmQoc3dhbGxvd2VkTGV2ZWwpKSk7XG4gICAgfVxuXG4gICAgaWYgKHN3YWxsb3dlZFBldElkID09PSAxODIpIHtcbiAgICAgIGNvbnN0IGJlbHVnYVJhdyA9XG4gICAgICAgIHJvb3Q/LltzbG90Q29uZmlnLmJlbHVnYUtleV0gPz8gc3dhbGxvd2VkUmVjb3JkPy5bJ2JlbHVnYVN3YWxsb3dlZFBldCddID8/IG51bGw7XG4gICAgICBjb25zdCBiZWx1Z2FFbnRyeSA9IGJ1aWxkQmVsdWdhU3dhbGxvd2VkRW50cnkoYmVsdWdhUmF3KTtcbiAgICAgIGlmIChiZWx1Z2FFbnRyeSkge1xuICAgICAgICBjb25zdCBiZWx1Z2FBYmlsaXR5RW51bXMgPSBnZXRBYmlsaXR5RW51bXNGb3JQZXQoMTgyLCBtYXBzKTtcbiAgICAgICAgY29uc3QgYmVsdWdhTGlzdHM6IFJlY29yZDxzdHJpbmcsIFJlcGxheVVua25vd25SZWNvcmRbXT4gPSB7XG4gICAgICAgICAgV2hpdGVXaGFsZUFiaWxpdHk6IFt7IC4uLmJlbHVnYUVudHJ5IH1dLFxuICAgICAgICB9O1xuICAgICAgICBmb3IgKGNvbnN0IGFiaWxpdHlFbnVtIG9mIGJlbHVnYUFiaWxpdHlFbnVtcykge1xuICAgICAgICAgIGJlbHVnYUxpc3RzW1N0cmluZyhhYmlsaXR5RW51bSldID0gW3sgLi4uYmVsdWdhRW50cnkgfV07XG4gICAgICAgIH1cbiAgICAgICAgbWVtb3J5RW50cnkuTWlNcyA9IHsgTHN0czogYmVsdWdhTGlzdHMgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3dhbGxvd2VkUGV0SWQgPT09IDc2Mykge1xuICAgICAgY29uc3Qgc2ZzUmF3ID1cbiAgICAgICAgcm9vdD8uW3Nsb3RDb25maWcuc2ZzS2V5XSA/P1xuICAgICAgICBzd2FsbG93ZWRSZWNvcmQ/Llsnc2FyY2FzdGljRnJpbmdlaGVhZFN3YWxsb3dlZFBldCddID8/XG4gICAgICAgIG51bGw7XG4gICAgICBjb25zdCBzZnNFbnRyeSA9IGJ1aWxkQmVsdWdhU3dhbGxvd2VkRW50cnkoc2ZzUmF3KTtcbiAgICAgIGlmIChzZnNFbnRyeSkge1xuICAgICAgICBjb25zdCBzZnNMaXN0czogUmVjb3JkPHN0cmluZywgUmVwbGF5VW5rbm93blJlY29yZFtdPiA9IHtcbiAgICAgICAgICBTYXJjYXN0aWNGcmluZ2VoZWFkQWJpbGl0eTogW3sgLi4uc2ZzRW50cnkgfV0sXG4gICAgICAgIH07XG4gICAgICAgIG1lbW9yeUVudHJ5Lk1pTXMgPSB7IExzdHM6IHNmc0xpc3RzIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgZW50cmllcy5wdXNoKHtcbiAgICAgIHN3YWxsb3dlZFBldElkLFxuICAgICAgc3dhbGxvd2VkQWJpbGl0eUVudW1zLFxuICAgICAgbWVtb3J5RW50cnksXG4gICAgICBiZWx1Z2FTd2FsbG93ZWRFbnRyeTogbWVtb3J5RW50cnkuTWlNcyA/PyBudWxsLFxuICAgIH0pO1xuICB9XG5cbiAgY29uc3Qgc3dhbGxvd2VkQ2FuZGlkYXRlcyA9IEFycmF5LmlzQXJyYXkocm9vdD8uWydhYm9taW5hdGlvblN3YWxsb3dlZFBldHMnXSlcbiAgICA/IChyb290Py5bJ2Fib21pbmF0aW9uU3dhbGxvd2VkUGV0cyddIGFzIHVua25vd25bXSlcbiAgICA6IFtdO1xuICBmb3IgKGNvbnN0IHN3YWxsb3dlZCBvZiBzd2FsbG93ZWRDYW5kaWRhdGVzKSB7XG4gICAgY29uc3Qgc3dhbGxvd2VkUGV0SWQgPSByZXNvbHZlUGV0SWRGcm9tVW5rbm93bihzd2FsbG93ZWQsIG1hcHMpO1xuICAgIGlmICghTnVtYmVyLmlzRmluaXRlKHN3YWxsb3dlZFBldElkKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IHN3YWxsb3dlZEFiaWxpdHlFbnVtcyA9IGdldEFiaWxpdHlFbnVtc0ZvclBldChzd2FsbG93ZWRQZXRJZCwgbWFwcyk7XG4gICAgZW50cmllcy5wdXNoKHtcbiAgICAgIHN3YWxsb3dlZFBldElkLFxuICAgICAgc3dhbGxvd2VkQWJpbGl0eUVudW1zLFxuICAgICAgbWVtb3J5RW50cnk6XG4gICAgICAgIGJ1aWxkQmVsdWdhU3dhbGxvd2VkRW50cnkoc3dhbGxvd2VkKSA/P1xuICAgICAgICAoeyBFbnU6IHN3YWxsb3dlZFBldElkIH0gYXMgUmVwbGF5TWVtb3J5RW50cnkpLFxuICAgICAgYmVsdWdhU3dhbGxvd2VkRW50cnk6IG51bGwsXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gZW50cmllcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluZmVyQWJvbWluYXRpb25BYmlsaXR5RW51bXNGcm9tU3dhbGxvd2VkUGV0cyhcbiAgcmF3UGV0OiB1bmtub3duLFxuICBtYXBzPzogUmVwbGF5UGFyc2VyTG9va3VwTWFwcyxcbik6IG51bWJlcltdIHtcbiAgY29uc3QgZW50cmllcyA9IGNvbGxlY3RBYm9taW5hdGlvblN3YWxsb3dlZEVudHJpZXMocmF3UGV0LCBtYXBzKTtcbiAgY29uc3QgYWJpbGl0eUVudW1zOiBudW1iZXJbXSA9IFtdO1xuICBmb3IgKGNvbnN0IGVudHJ5IG9mIGVudHJpZXMpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShlbnRyeS5zd2FsbG93ZWRBYmlsaXR5RW51bXMpKSB7XG4gICAgICBhYmlsaXR5RW51bXMucHVzaCguLi5lbnRyeS5zd2FsbG93ZWRBYmlsaXR5RW51bXMpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdW5pcXVlTnVtYmVycyhhYmlsaXR5RW51bXMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5mZXJBYm9taW5hdGlvbkFiaWxpdHlMZXZlbHNGcm9tU3dhbGxvd2VkUGV0cyhcbiAgcmF3UGV0OiB1bmtub3duLFxuICBtYXBzPzogUmVwbGF5UGFyc2VyTG9va3VwTWFwcyxcbik6IFJlY29yZDxzdHJpbmcsIG51bWJlcj4ge1xuICBjb25zdCBlbnRyaWVzID0gY29sbGVjdEFib21pbmF0aW9uU3dhbGxvd2VkRW50cmllcyhyYXdQZXQsIG1hcHMpO1xuICBjb25zdCBsZXZlbEJ5QWJpbGl0eTogUmVjb3JkPHN0cmluZywgbnVtYmVyPiA9IHt9O1xuICBjb25zdCBmYWxsYmFja0xldmVsID0gMTtcbiAgZm9yIChjb25zdCBlbnRyeSBvZiBlbnRyaWVzKSB7XG4gICAgY29uc3Qgc3dhbGxvd2VkTGV2ZWwgPSB0b0Zpbml0ZU51bWJlcihlbnRyeS5tZW1vcnlFbnRyeT8uTHZsLCBOYU4pO1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRMZXZlbCA9IE51bWJlci5pc0Zpbml0ZShzd2FsbG93ZWRMZXZlbClcbiAgICAgID8gTWF0aC5tYXgoMSwgTWF0aC5taW4oMywgTWF0aC5yb3VuZChzd2FsbG93ZWRMZXZlbCkpKVxuICAgICAgOiBmYWxsYmFja0xldmVsO1xuICAgIGNvbnN0IHN3YWxsb3dlZEFiaWxpdHlFbnVtcyA9IHVuaXF1ZU51bWJlcnMoXG4gICAgICBBcnJheS5pc0FycmF5KGVudHJ5LnN3YWxsb3dlZEFiaWxpdHlFbnVtcylcbiAgICAgICAgPyBlbnRyeS5zd2FsbG93ZWRBYmlsaXR5RW51bXNcbiAgICAgICAgOiBbXSxcbiAgICApO1xuICAgIGZvciAoY29uc3QgYWJpbGl0eUVudW0gb2Ygc3dhbGxvd2VkQWJpbGl0eUVudW1zKSB7XG4gICAgICBjb25zdCBrZXkgPSBTdHJpbmcoYWJpbGl0eUVudW0pO1xuICAgICAgY29uc3QgZXhpc3RpbmcgPSB0b0Zpbml0ZU51bWJlcihsZXZlbEJ5QWJpbGl0eVtrZXldLCBOYU4pO1xuICAgICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUoZXhpc3RpbmcpIHx8IG5vcm1hbGl6ZWRMZXZlbCA+IGV4aXN0aW5nKSB7XG4gICAgICAgIGxldmVsQnlBYmlsaXR5W2tleV0gPSBub3JtYWxpemVkTGV2ZWw7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBsZXZlbEJ5QWJpbGl0eTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluZmVyQWJvbWluYXRpb25BYmlsaXR5RW51bUZyb21Td2FsbG93ZWRQZXRzKFxuICByYXdQZXQ6IHVua25vd24sXG4gIG1hcHM/OiBSZXBsYXlQYXJzZXJMb29rdXBNYXBzLFxuKTogbnVtYmVyIHwgbnVsbCB7XG4gIGNvbnN0IGluZmVycmVkID0gaW5mZXJBYm9taW5hdGlvbkFiaWxpdHlFbnVtc0Zyb21Td2FsbG93ZWRQZXRzKHJhd1BldCwgbWFwcyk7XG4gIHJldHVybiBpbmZlcnJlZC5sZW5ndGggPiAwID8gaW5mZXJyZWRbMF0gOiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJpbWFyeUFiaWxpdHlFbnVtRm9yTWVtb3J5KFxuICByYXdQZXQ6IHVua25vd24sXG4gIHBldElkOiBudW1iZXIsXG4gIG1hcHM/OiBSZXBsYXlQYXJzZXJMb29rdXBNYXBzLFxuKTogbnVtYmVyIHwgbnVsbCB7XG4gIGNvbnN0IHBldCA9IGdldFJlY29yZChyYXdQZXQpO1xuICBjb25zdCBhYmlsID0gQXJyYXkuaXNBcnJheShwZXQ/LlsnQWJpbCddKSA/IChwZXQ/LlsnQWJpbCddIGFzIHVua25vd25bXSkgOiBbXTtcbiAgY29uc3QgYWJpbGl0aWVzID0gQXJyYXkuaXNBcnJheShwZXQ/LlsnYWJpbGl0aWVzJ10pXG4gICAgPyAocGV0Py5bJ2FiaWxpdGllcyddIGFzIHVua25vd25bXSlcbiAgICA6IFtdO1xuICBjb25zdCBkaXJlY3RDYW5kaWRhdGVzID0gW1xuICAgIHBldD8uWydhYmlsaXR5RW51bSddLFxuICAgIHBldD8uWydhYmlsaXR5SWQnXSxcbiAgICBnZXRSZWNvcmQoYWJpbFswXSk/LlsnRW51J10sXG4gICAgZ2V0UmVjb3JkKGFiaWxpdGllc1swXSk/LlsnRW51J10sXG4gIF07XG4gIGZvciAoY29uc3QgY2FuZGlkYXRlIG9mIGRpcmVjdENhbmRpZGF0ZXMpIHtcbiAgICBjb25zdCBudW0gPSB0b0Zpbml0ZU51bWJlcihjYW5kaWRhdGUsIE5hTik7XG4gICAgaWYgKE51bWJlci5pc0Zpbml0ZShudW0pKSB7XG4gICAgICByZXR1cm4gTWF0aC50cnVuYyhudW0pO1xuICAgIH1cbiAgfVxuXG4gIGlmIChwZXRJZCA9PT0gMzczIHx8IHBldElkID09PSAzMzgpIHtcbiAgICBjb25zdCBpbmZlcnJlZCA9IGluZmVyQWJvbWluYXRpb25BYmlsaXR5RW51bUZyb21Td2FsbG93ZWRQZXRzKHJhd1BldCwgbWFwcyk7XG4gICAgaWYgKE51bWJlci5pc0Zpbml0ZShpbmZlcnJlZCkpIHtcbiAgICAgIHJldHVybiBNYXRoLnRydW5jKGluZmVycmVkKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBtYXBwZWQgPSBnZXRBYmlsaXR5RW51bXNGb3JQZXQocGV0SWQsIG1hcHMpO1xuICByZXR1cm4gbWFwcGVkLmxlbmd0aCA+IDAgPyBtYXBwZWRbMF0gOiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRBYm9taW5hdGlvbk1lbW9yeShcbiAgcmF3UGV0OiB1bmtub3duLFxuICBwZXRJZDogbnVtYmVyLFxuICBtYXBzPzogUmVwbGF5UGFyc2VyTG9va3VwTWFwcyxcbik6IFJlcGxheU1lbW9yeVBheWxvYWQgfCBudWxsIHtcbiAgY29uc3Qgc3dhbGxvd2VkRW50cmllcyA9IGNvbGxlY3RBYm9taW5hdGlvblN3YWxsb3dlZEVudHJpZXMocmF3UGV0LCBtYXBzKTtcbiAgaWYgKHN3YWxsb3dlZEVudHJpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgY29uc3QgZmFsbGJhY2tBYmlsaXR5RW51bSA9IGdldFByaW1hcnlBYmlsaXR5RW51bUZvck1lbW9yeShyYXdQZXQsIHBldElkLCBtYXBzKTtcbiAgY29uc3QgZmFsbGJhY2tMaXN0ID1cbiAgICBmYWxsYmFja0FiaWxpdHlFbnVtICE9PSBudWxsID8gW01hdGgudHJ1bmMoZmFsbGJhY2tBYmlsaXR5RW51bSldIDogW107XG4gIGNvbnN0IGxpc3RzOiBSZWNvcmQ8c3RyaW5nLCBSZXBsYXlVbmtub3duUmVjb3JkW10+ID0ge307XG4gIGZvciAoY29uc3QgZW50cnkgb2Ygc3dhbGxvd2VkRW50cmllcykge1xuICAgIGNvbnN0IG93bkVudW1zID0gdW5pcXVlTnVtYmVycyhcbiAgICAgIEFycmF5LmlzQXJyYXkoZW50cnkuc3dhbGxvd2VkQWJpbGl0eUVudW1zKSA/IGVudHJ5LnN3YWxsb3dlZEFiaWxpdHlFbnVtcyA6IFtdLFxuICAgICk7XG4gICAgY29uc3Qga2V5RW51bXMgPSBvd25FbnVtcy5sZW5ndGggPiAwID8gb3duRW51bXMgOiBmYWxsYmFja0xpc3Q7XG4gICAgaWYgKGtleUVudW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGZvciAoY29uc3QgYWJpbGl0eUVudW0gb2Yga2V5RW51bXMpIHtcbiAgICAgIGNvbnN0IGtleSA9IFN0cmluZyhhYmlsaXR5RW51bSk7XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkobGlzdHNba2V5XSkpIHtcbiAgICAgICAgbGlzdHNba2V5XSA9IFtdO1xuICAgICAgfVxuICAgICAgY29uc3QgdXNlQmVsdWdhID1cbiAgICAgICAgZW50cnkuc3dhbGxvd2VkUGV0SWQgPT09IDE4MiAmJlxuICAgICAgICBBcnJheS5pc0FycmF5KGVudHJ5LnN3YWxsb3dlZEFiaWxpdHlFbnVtcykgJiZcbiAgICAgICAgZW50cnkuc3dhbGxvd2VkQWJpbGl0eUVudW1zLmluY2x1ZGVzKGFiaWxpdHlFbnVtKSAmJlxuICAgICAgICBlbnRyeS5iZWx1Z2FTd2FsbG93ZWRFbnRyeTtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSB1c2VCZWx1Z2FcbiAgICAgICAgPyAoZW50cnkuYmVsdWdhU3dhbGxvd2VkRW50cnkgYXMgdW5rbm93biBhcyBSZXBsYXlVbmtub3duUmVjb3JkKVxuICAgICAgICA6IChlbnRyeS5tZW1vcnlFbnRyeSBhcyBSZXBsYXlVbmtub3duUmVjb3JkKTtcbiAgICAgIGxpc3RzW2tleV0ucHVzaChwYXlsb2FkKTtcbiAgICB9XG4gIH1cbiAgaWYgKE9iamVjdC5rZXlzKGxpc3RzKS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4geyBMc3RzOiBsaXN0cyB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRCZWx1Z2FNZW1vcnkoXG4gIHJhd1BldDogdW5rbm93bixcbiAgcGV0SWQ6IG51bWJlcixcbiAgbWFwcz86IFJlcGxheVBhcnNlckxvb2t1cE1hcHMsXG4pOiBSZXBsYXlNZW1vcnlQYXlsb2FkIHwgbnVsbCB7XG4gIGNvbnN0IHBldCA9IGdldFJlY29yZChyYXdQZXQpO1xuICBjb25zdCBzd2FsbG93ZWRSYXcgPSBwZXQ/LlsnYmVsdWdhU3dhbGxvd2VkUGV0J10gPz8gcGV0Py5bJ3N3YWxsb3dlZFBldCddID8/IG51bGw7XG4gIGNvbnN0IHN3YWxsb3dlZEVudHJ5ID0gYnVpbGRCZWx1Z2FTd2FsbG93ZWRFbnRyeShzd2FsbG93ZWRSYXcpO1xuICBpZiAoIXN3YWxsb3dlZEVudHJ5KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgY29uc3QgbWFwcGVkID0gZ2V0QWJpbGl0eUVudW1zRm9yUGV0KHBldElkLCBtYXBzKTtcbiAgY29uc3QgcHJpbWFyeSA9IGdldFByaW1hcnlBYmlsaXR5RW51bUZvck1lbW9yeShyYXdQZXQsIHBldElkLCBtYXBzKTtcbiAgY29uc3QgYmVsdWdhQWJpbGl0eUVudW1zID1cbiAgICBtYXBwZWQubGVuZ3RoID4gMFxuICAgICAgPyBtYXBwZWRcbiAgICAgIDogcHJpbWFyeSAhPT0gbnVsbFxuICAgICAgICA/IFtNYXRoLnRydW5jKHByaW1hcnkpXVxuICAgICAgICA6IFtdO1xuICBpZiAoYmVsdWdhQWJpbGl0eUVudW1zLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGNvbnN0IGxpc3RzOiBSZWNvcmQ8c3RyaW5nLCBSZXBsYXlVbmtub3duUmVjb3JkW10+ID0ge1xuICAgIFdoaXRlV2hhbGVBYmlsaXR5OiBbeyAuLi5zd2FsbG93ZWRFbnRyeSB9XSxcbiAgfTtcbiAgZm9yIChjb25zdCBhYmlsaXR5RW51bSBvZiBiZWx1Z2FBYmlsaXR5RW51bXMpIHtcbiAgICBsaXN0c1tTdHJpbmcoYWJpbGl0eUVudW0pXSA9IFt7IC4uLnN3YWxsb3dlZEVudHJ5IH1dO1xuICB9XG4gIHJldHVybiB7IExzdHM6IGxpc3RzIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFNhcmNhc3RpY0ZyaW5nZWhlYWRNZW1vcnkoXG4gIHJhd1BldDogdW5rbm93bixcbiAgX3BldElkOiBudW1iZXIsXG4gIF9tYXBzPzogUmVwbGF5UGFyc2VyTG9va3VwTWFwcyxcbik6IFJlcGxheU1lbW9yeVBheWxvYWQgfCBudWxsIHtcbiAgY29uc3QgcGV0ID0gZ2V0UmVjb3JkKHJhd1BldCk7XG4gIGNvbnN0IHN3YWxsb3dlZFJhdyA9IHBldD8uWydzYXJjYXN0aWNGcmluZ2VoZWFkU3dhbGxvd2VkUGV0J10gPz8gbnVsbDtcbiAgY29uc3Qgc3dhbGxvd2VkRW50cnkgPSBidWlsZEJlbHVnYVN3YWxsb3dlZEVudHJ5KHN3YWxsb3dlZFJhdyk7XG4gIGlmICghc3dhbGxvd2VkRW50cnkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBpZiAoIU51bWJlci5pc0Zpbml0ZSh0b0Zpbml0ZU51bWJlcihzd2FsbG93ZWRFbnRyeS5MdmwsIE5hTikpKSB7XG4gICAgc3dhbGxvd2VkRW50cnkuTHZsID0gMTtcbiAgfVxuICBpZiAoIU51bWJlci5pc0Zpbml0ZSh0b0Zpbml0ZU51bWJlcihzd2FsbG93ZWRFbnRyeS5BdCwgTmFOKSkpIHtcbiAgICBzd2FsbG93ZWRFbnRyeS5BdCA9IDE7XG4gIH1cbiAgaWYgKCFOdW1iZXIuaXNGaW5pdGUodG9GaW5pdGVOdW1iZXIoc3dhbGxvd2VkRW50cnkuSHAsIE5hTikpKSB7XG4gICAgc3dhbGxvd2VkRW50cnkuSHAgPSAxO1xuICB9XG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHN3YWxsb3dlZEVudHJ5LCAnTWFuYScpKSB7XG4gICAgc3dhbGxvd2VkRW50cnkuTWFuYSA9IG51bGw7XG4gIH1cbiAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc3dhbGxvd2VkRW50cnksICdQZXJrJykpIHtcbiAgICBzd2FsbG93ZWRFbnRyeS5QZXJrID0gbnVsbDtcbiAgfVxuICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzd2FsbG93ZWRFbnRyeSwgJ0V4cCcpKSB7XG4gICAgc3dhbGxvd2VkRW50cnkuRXhwID0gbnVsbDtcbiAgfVxuICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzd2FsbG93ZWRFbnRyeSwgJ1Bvd2EnKSkge1xuICAgIHN3YWxsb3dlZEVudHJ5LlBvd2EgPSBudWxsO1xuICB9XG4gIHJldHVybiB7IExzdHM6IHsgU2FyY2FzdGljRnJpbmdlaGVhZEFiaWxpdHk6IFt7IC4uLnN3YWxsb3dlZEVudHJ5IH1dIH0gfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkQWJpbGl0eUVudHJ5KFxuICBhYmlsaXR5RW51bTogbnVtYmVyLFxuICBsZXZlbDogbnVtYmVyLFxuICB0cmlnZ2Vyc0NvbnN1bWVkID0gMCxcbik6IFJlcGxheUFiaWxpdHlFbnRyeSB7XG4gIGNvbnN0IG5vcm1hbGl6ZWRUcmlnZ2VycyA9IE51bWJlci5pc0Zpbml0ZSh0cmlnZ2Vyc0NvbnN1bWVkKVxuICAgID8gTWF0aC5tYXgoMCwgTWF0aC5yb3VuZCh0cmlnZ2Vyc0NvbnN1bWVkKSlcbiAgICA6IDA7XG4gIHJldHVybiB7XG4gICAgRW51OiBhYmlsaXR5RW51bSxcbiAgICBMdmw6IGxldmVsLFxuICAgIE5hdDogdHJ1ZSxcbiAgICBEdXI6IDAsXG4gICAgVHJDbzogbm9ybWFsaXplZFRyaWdnZXJzLFxuICAgIENoYXI6IG51bGwsXG4gICAgRGlzOiBmYWxzZSxcbiAgICBBSU1MOiBmYWxzZSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gZmluZEZpbml0ZU51bWJlckJ5S2V5UHJlZGljYXRlKFxuICBzb3VyY2U6IHVua25vd24sXG4gIGtleVByZWRpY2F0ZTogKGs6IHN0cmluZykgPT4gYm9vbGVhbixcbik6IG51bWJlciB8IG51bGwge1xuICBjb25zdCByZWNvcmQgPSBnZXRSZWNvcmQoc291cmNlKTtcbiAgaWYgKCFyZWNvcmQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhyZWNvcmQpKSB7XG4gICAgaWYgKCFrZXlQcmVkaWNhdGUoa2V5KSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IG4gPSB0b0Zpbml0ZU51bWJlcih2YWx1ZSwgTmFOKTtcbiAgICBpZiAoTnVtYmVyLmlzRmluaXRlKG4pKSB7XG4gICAgICByZXR1cm4gbjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUcmlnZ2Vyc0NvbnN1bWVkRnJvbVJhd1BldChyYXdQZXQ6IHVua25vd24pOiBudW1iZXIgfCBudWxsIHtcbiAgY29uc3QgcGV0ID0gZ2V0UmVjb3JkKHJhd1BldCk7XG4gIGNvbnN0IGRpcmVjdCA9IFtcbiAgICBwZXQ/LlsndHJpZ2dlcnNDb25zdW1lZCddLFxuICAgIHBldD8uWydUckNvJ10sXG4gICAgcGV0Py5bJ3RyY28nXSxcbiAgICBwZXQ/LlsndHJpZ2dlckNvbnN1bWVkJ10sXG4gIF07XG4gIGZvciAoY29uc3QgY2FuZGlkYXRlIG9mIGRpcmVjdCkge1xuICAgIGNvbnN0IG4gPSB0b0Zpbml0ZU51bWJlcihjYW5kaWRhdGUsIE5hTik7XG4gICAgaWYgKE51bWJlci5pc0Zpbml0ZShuKSkge1xuICAgICAgcmV0dXJuIE1hdGgubWF4KDAsIE1hdGgucm91bmQobikpO1xuICAgIH1cbiAgfVxuICBjb25zdCBwcmVkaWNhdGUgPSAoa2V5OiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCBub3JtYWxpemVkID0ga2V5LnRvTG93ZXJDYXNlKCk7XG4gICAgY29uc3QgaGFzVHJpZ2dlciA9XG4gICAgICBub3JtYWxpemVkLmluY2x1ZGVzKCd0cmlnZ2VyJykgfHwgbm9ybWFsaXplZC5pbmNsdWRlcygndHJpZycpO1xuICAgIGNvbnN0IGhhc0NvbnN1bWVkID0gbm9ybWFsaXplZC5pbmNsdWRlcygnY29uc3VtJyk7XG4gICAgY29uc3QgaXNBYmJyZXYgPSBbJ3RyZ2MnLCAndHJnY24nLCAndHJjJywgJ3RyY24nLCAndHJjbyddLmluY2x1ZGVzKG5vcm1hbGl6ZWQpO1xuICAgIHJldHVybiAoaGFzVHJpZ2dlciAmJiBoYXNDb25zdW1lZCkgfHwgaXNBYmJyZXY7XG4gIH07XG4gIGNvbnN0IG9iamVjdENhbmRpZGF0ZXMgPSBbcGV0LCBnZXRSZWNvcmQocGV0Py5bJ3BvdyddKSwgZ2V0UmVjb3JkKHBldD8uWydQb3cnXSldO1xuICBmb3IgKGNvbnN0IGNhbmRpZGF0ZSBvZiBvYmplY3RDYW5kaWRhdGVzKSB7XG4gICAgY29uc3QgbiA9IGZpbmRGaW5pdGVOdW1iZXJCeUtleVByZWRpY2F0ZShjYW5kaWRhdGUsIHByZWRpY2F0ZSk7XG4gICAgaWYgKE51bWJlci5pc0Zpbml0ZShuKSkge1xuICAgICAgcmV0dXJuIE1hdGgubWF4KDAsIE1hdGgucm91bmQobikpO1xuICAgIH1cbiAgfVxuICBjb25zdCBhYmlsaXRpZXMgPSBBcnJheS5pc0FycmF5KHBldD8uWydhYmlsaXRpZXMnXSlcbiAgICA/IChwZXQ/LlsnYWJpbGl0aWVzJ10gYXMgdW5rbm93bltdKVxuICAgIDogW107XG4gIGNvbnN0IGFiaWwgPSBBcnJheS5pc0FycmF5KHBldD8uWydBYmlsJ10pID8gKHBldD8uWydBYmlsJ10gYXMgdW5rbm93bltdKSA6IFtdO1xuICBjb25zdCBhYmlsaXR5VmFsdWVzOiBudW1iZXJbXSA9IFtdO1xuICBmb3IgKGNvbnN0IGFiaWxpdHlBcnJheSBvZiBbYWJpbGl0aWVzLCBhYmlsXSkge1xuICAgIGZvciAoY29uc3QgYWJpbGl0eSBvZiBhYmlsaXR5QXJyYXkpIHtcbiAgICAgIGNvbnN0IG4gPSBmaW5kRmluaXRlTnVtYmVyQnlLZXlQcmVkaWNhdGUoYWJpbGl0eSwgcHJlZGljYXRlKTtcbiAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUobikpIHtcbiAgICAgICAgYWJpbGl0eVZhbHVlcy5wdXNoKG4pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoYWJpbGl0eVZhbHVlcy5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KDAsIE1hdGgucm91bmQoTWF0aC5tYXgoLi4uYWJpbGl0eVZhbHVlcykpKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRpbWVzSHVydEZyb21SYXdQZXQocmF3UGV0OiB1bmtub3duKTogbnVtYmVyIHwgbnVsbCB7XG4gIGNvbnN0IHBldCA9IGdldFJlY29yZChyYXdQZXQpO1xuICBjb25zdCBwb3cgPSBnZXRSZWNvcmQocGV0Py5bJ1BvdyddKTtcbiAgY29uc3QgcG93TG93ZXIgPSBnZXRSZWNvcmQocGV0Py5bJ3BvdyddKTtcbiAgY29uc3QgZGlyZWN0ID0gW1xuICAgIHBldD8uWyd0aW1lc0h1cnQnXSxcbiAgICBwZXQ/LlsnVGltZXNIdXJ0J10sXG4gICAgcGV0Py5bJ0hydEMnXSxcbiAgICBwZXQ/LlsnaHJ0YyddLFxuICAgIHBvdz8uWydTYWJlcnRvb3RoVGlnZXJBYmlsaXR5J10sXG4gICAgcG93TG93ZXI/LlsnU2FiZXJ0b290aFRpZ2VyQWJpbGl0eSddLFxuICBdO1xuICBmb3IgKGNvbnN0IGNhbmRpZGF0ZSBvZiBkaXJlY3QpIHtcbiAgICBjb25zdCBuID0gdG9GaW5pdGVOdW1iZXIoY2FuZGlkYXRlLCBOYU4pO1xuICAgIGlmIChOdW1iZXIuaXNGaW5pdGUobikpIHtcbiAgICAgIHJldHVybiBNYXRoLm1heCgwLCBNYXRoLnJvdW5kKG4pKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTcGVsbENvdW50RnJvbVJhd1BldChyYXdQZXQ6IHVua25vd24pOiBudW1iZXIge1xuICBjb25zdCBwZXQgPSBnZXRSZWNvcmQocmF3UGV0KTtcbiAgY29uc3QgZGlyZWN0ID0gW1xuICAgIHBldD8uWydzcGVsbENvdW50J10sXG4gICAgcGV0Py5bJ3NwZWxsc0Nhc3QnXSxcbiAgICBwZXQ/Llsnc3BlbGxzQ2FzdFRoaXNUdXJuJ10sXG4gICAgcGV0Py5bJ1NwQ1QnXSxcbiAgXTtcbiAgZm9yIChjb25zdCBjYW5kaWRhdGUgb2YgZGlyZWN0KSB7XG4gICAgY29uc3QgbiA9IHRvRmluaXRlTnVtYmVyKGNhbmRpZGF0ZSwgTmFOKTtcbiAgICBpZiAoTnVtYmVyLmlzRmluaXRlKG4pKSB7XG4gICAgICByZXR1cm4gTWF0aC5tYXgoMCwgTWF0aC5yb3VuZChuKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiAwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VG95TmFtZShyYXdUb3k6IHVua25vd24pOiBzdHJpbmcgfCBudWxsIHtcbiAgaWYgKHR5cGVvZiByYXdUb3kgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHJhd1RveTtcbiAgfVxuICBjb25zdCB0b3kgPSBnZXRSZWNvcmQocmF3VG95KTtcbiAgcmV0dXJuIHR5cGVvZiB0b3k/LlsnbmFtZSddID09PSAnc3RyaW5nJyA/IHRveVsnbmFtZSddIDogbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVUb3lJZChcbiAgcmF3VG95OiB1bmtub3duLFxuICBtYXBzPzogUmVwbGF5UGFyc2VyTG9va3VwTWFwcyxcbik6IG51bWJlciB8IG51bGwge1xuICBpZiAocmF3VG95ID09PSBudWxsIHx8IHJhd1RveSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgY29uc3QgdG95ID0gZ2V0UmVjb3JkKHJhd1RveSk7XG4gIGlmICh0b3kpIHtcbiAgICBjb25zdCBkaXJlY3QgPSBbXG4gICAgICB0b3lbJ2lkJ10sXG4gICAgICB0b3lbJ0lkJ10sXG4gICAgICB0b3lbJ3RveUlkJ10sXG4gICAgICB0b3lbJ3RveUlEJ10sXG4gICAgICB0b3lbJ2VudW0nXSxcbiAgICAgIHRveVsnRW51J10sXG4gICAgXTtcbiAgICBmb3IgKGNvbnN0IGNhbmRpZGF0ZSBvZiBkaXJlY3QpIHtcbiAgICAgIGNvbnN0IG4gPSB0b0Zpbml0ZU51bWJlcihjYW5kaWRhdGUsIE5hTik7XG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKG4pKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnRydW5jKG4pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBjb25zdCB0b3lOYW1lID0gZ2V0VG95TmFtZShyYXdUb3kpID8/IHJhd1RveTtcbiAgY29uc3QgbG9va3VwS2V5ID1cbiAgICB0eXBlb2YgdG95TmFtZSA9PT0gJ3N0cmluZydcbiAgICAgID8gdG95TmFtZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1teYS16MC05XS9nLCAnJylcbiAgICAgIDogJyc7XG4gIGlmICghbG9va3VwS2V5KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgY29uc3QgbWFwcGVkID0gdG9JbnRPck51bGwobWFwcz8udG95SWRzQnlOYW1lPy5bbG9va3VwS2V5XSk7XG4gIGlmIChtYXBwZWQgIT09IG51bGwpIHtcbiAgICByZXR1cm4gbWFwcGVkO1xuICB9XG4gIGNvbnN0IGZhbGxiYWNrID0gRkFMTEJBQ0tfVE9ZX0lEU19CWV9OQU1FW2xvb2t1cEtleV07XG4gIHJldHVybiBOdW1iZXIuaXNGaW5pdGUoZmFsbGJhY2spID8gZmFsbGJhY2sgOiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVRveUFiaWxpdHlFbnVtKFxuICByYXdUb3k6IHVua25vd24sXG4gIHRveUlkOiBudW1iZXIgfCBudWxsLFxuKTogbnVtYmVyIHwgbnVsbCB7XG4gIGNvbnN0IHRveSA9IGdldFJlY29yZChyYXdUb3kpO1xuICBpZiAodG95KSB7XG4gICAgY29uc3QgYWJpbCA9IEFycmF5LmlzQXJyYXkodG95WydBYmlsJ10pID8gKHRveVsnQWJpbCddIGFzIHVua25vd25bXSkgOiBbXTtcbiAgICBjb25zdCBhYmlsaXRpZXMgPSBBcnJheS5pc0FycmF5KHRveVsnYWJpbGl0aWVzJ10pXG4gICAgICA/ICh0b3lbJ2FiaWxpdGllcyddIGFzIHVua25vd25bXSlcbiAgICAgIDogW107XG4gICAgY29uc3QgZGlyZWN0ID0gW1xuICAgICAgdG95WydhYmlsaXR5RW51bSddLFxuICAgICAgdG95WydhYmlsaXR5SWQnXSxcbiAgICAgIGdldFJlY29yZChhYmlsWzBdKT8uWydFbnUnXSxcbiAgICAgIGdldFJlY29yZChhYmlsaXRpZXNbMF0pPy5bJ0VudSddLFxuICAgIF07XG4gICAgZm9yIChjb25zdCBjYW5kaWRhdGUgb2YgZGlyZWN0KSB7XG4gICAgICBjb25zdCBuID0gdG9GaW5pdGVOdW1iZXIoY2FuZGlkYXRlLCBOYU4pO1xuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShuKSkge1xuICAgICAgICByZXR1cm4gTWF0aC50cnVuYyhuKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKE51bWJlci5pc0Zpbml0ZShOdW1iZXIodG95SWQpKSkge1xuICAgIHJldHVybiBNYXRoLnRydW5jKE51bWJlcih0b3lJZCkgKyAzMik7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlVG95VXNlc0xlZnQocmF3VG95OiB1bmtub3duLCB0b3lMZXZlbDogbnVtYmVyKTogbnVtYmVyIHtcbiAgY29uc3QgdG95ID0gZ2V0UmVjb3JkKHJhd1RveSk7XG4gIGlmICh0b3kpIHtcbiAgICBjb25zdCBkaXJlY3QgPSBbdG95Wydjb3UnXSwgdG95WydDb3UnXSwgdG95Wyd1c2VzTGVmdCddLCB0b3lbJ2NoYXJnZXMnXV07XG4gICAgZm9yIChjb25zdCBjYW5kaWRhdGUgb2YgZGlyZWN0KSB7XG4gICAgICBjb25zdCBuID0gdG9GaW5pdGVOdW1iZXIoY2FuZGlkYXRlLCBOYU4pO1xuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShuKSkge1xuICAgICAgICByZXR1cm4gTWF0aC5tYXgoMCwgTWF0aC5yb3VuZChuKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBNYXRoLm1heCgxLCAzIC0gdG95TGV2ZWwpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVRveUhlYWx0aFBlcm0ocmF3VG95OiB1bmtub3duLCB0b3lMZXZlbDogbnVtYmVyKTogbnVtYmVyIHtcbiAgY29uc3QgdG95ID0gZ2V0UmVjb3JkKHJhd1RveSk7XG4gIGlmICh0b3kpIHtcbiAgICBjb25zdCBocCA9IGdldFJlY29yZCh0b3lbJ0hwJ10pO1xuICAgIGNvbnN0IGRpcmVjdCA9IFt0b3lbJ2hwJ10sIHRveVsnaGVhbHRoJ10sIGhwPy5bJ1Blcm0nXV07XG4gICAgZm9yIChjb25zdCBjYW5kaWRhdGUgb2YgZGlyZWN0KSB7XG4gICAgICBjb25zdCBuID0gdG9GaW5pdGVOdW1iZXIoY2FuZGlkYXRlLCBOYU4pO1xuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShuKSkge1xuICAgICAgICByZXR1cm4gTWF0aC5tYXgoMSwgTWF0aC5yb3VuZChuKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBNYXRoLm1heCgxLCAzICsgKHRveUxldmVsIC0gMSkgKiA0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkUmVsaWNJdGVtcyhcbiAgYm9hcmRJZDogc3RyaW5nLFxuICByYXdUb3k6IHVua25vd24sXG4gIHJhd1RveUxldmVsOiB1bmtub3duLFxuICB3YXJuaW5nQmFnOiBSZXBsYXlXYXJuaW5nQmFnLFxuICBtYXBzPzogUmVwbGF5UGFyc2VyTG9va3VwTWFwcyxcbik6IFtudWxsLCBSZXBsYXlSZWxpY0l0ZW0gfCBudWxsXSB7XG4gIGNvbnN0IHRveUlkID0gcmVzb2x2ZVRveUlkKHJhd1RveSwgbWFwcyk7XG4gIGNvbnN0IHRveU5hbWUgPSBnZXRUb3lOYW1lKHJhd1RveSkgPz8gKHR5cGVvZiByYXdUb3kgPT09ICdzdHJpbmcnID8gcmF3VG95IDogJycpO1xuICBpZiAoIU51bWJlci5pc0Zpbml0ZShOdW1iZXIodG95SWQpKSkge1xuICAgIGlmICh0b3lOYW1lKSB7XG4gICAgICB3YXJuaW5nQmFnLnVua25vd25Ub3lzLnB1c2goU3RyaW5nKHRveU5hbWUpKTtcbiAgICB9XG4gICAgcmV0dXJuIFtudWxsLCBudWxsXTtcbiAgfVxuICBjb25zdCB0b3lMZXZlbCA9IE1hdGgubWF4KDEsIE1hdGgucm91bmQodG9GaW5pdGVOdW1iZXIocmF3VG95TGV2ZWwsIDEpKSk7XG4gIGNvbnN0IHRveUFiaWxpdHlFbnVtID0gcmVzb2x2ZVRveUFiaWxpdHlFbnVtKHJhd1RveSwgdG95SWQpO1xuICBjb25zdCB0b3lVc2VzTGVmdCA9IHJlc29sdmVUb3lVc2VzTGVmdChyYXdUb3ksIHRveUxldmVsKTtcbiAgY29uc3QgdG95SGVhbHRoUGVybSA9IHJlc29sdmVUb3lIZWFsdGhQZXJtKHJhd1RveSwgdG95TGV2ZWwpO1xuICBjb25zdCB0b3lSZWxpYzogUmVwbGF5UmVsaWNJdGVtID0ge1xuICAgIE93bjogMSxcbiAgICBFbnU6IHRveUlkLFxuICAgIExvYzogNCxcbiAgICBQb2k6IHsgeDogMSwgeTogMCB9LFxuICAgIEV4cDogMCxcbiAgICBMdmw6IHRveUxldmVsLFxuICAgIEhwOiB7IFBlcm06IHRveUhlYWx0aFBlcm0sIFRlbXA6IDAsIE1heDogbnVsbCB9LFxuICAgIEF0OiB7IFBlcm06IDEwMDAsIFRlbXA6IDAsIE1heDogMTAwMCB9LFxuICAgIE1hbmE6IDAsXG4gICAgQ291OiB0b3lVc2VzTGVmdCxcbiAgICBQZUJvOiBmYWxzZSxcbiAgICBQZUR1OiBudWxsLFxuICAgIFBlRE06IG51bGwsXG4gICAgUGVNdTogbnVsbCxcbiAgICBQZURyOiAwLFxuICAgIEFiaWw6XG4gICAgICB0b3lBYmlsaXR5RW51bSAhPT0gbnVsbCA/IFtidWlsZEFiaWxpdHlFbnRyeSh0b3lBYmlsaXR5RW51bSwgdG95TGV2ZWwsIDApXSA6IFtdLFxuICAgIEFiRGk6IGZhbHNlLFxuICAgIENvc206IDAsXG4gICAgRGVhZDogZmFsc2UsXG4gICAgRGVzdDogZmFsc2UsXG4gICAgRGVCeTogbnVsbCxcbiAgICBMaW5rOiBudWxsLFxuICAgIFBvdzogbnVsbCxcbiAgICBTZVY6IG51bGwsXG4gICAgUndkczogMCxcbiAgICBSd3JkOiBmYWxzZSxcbiAgICBNaU1zOiBudWxsLFxuICAgIFNwTWU6IG51bGwsXG4gICAgVHJpOiBudWxsLFxuICAgIEF0a0M6IDAsXG4gICAgSHJ0QzogMCxcbiAgICBTcENUOiAwLFxuICAgIE9sVHM6IG51bGwsXG4gICAgTGFzdFRhcmdldHNUaGlzVHVybjogbnVsbCxcbiAgICBJZDogeyBCb0lkOiBib2FyZElkLCBVbmk6IDkwMCB9LFxuICAgIFByaTogMyxcbiAgICBGcm86IGZhbHNlLFxuICAgIFdGcm86IGZhbHNlLFxuICAgIEFGcm86IGZhbHNlLFxuICB9O1xuICByZXR1cm4gW251bGwsIHRveVJlbGljXTtcbn1cblxuZXhwb3J0IGNvbnN0IFJFUExBWV9ERUJVR19FTkFCTEVEID0gKCgpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBmcm9tU3RvcmFnZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzYXBSZXBsYXlEZWJ1ZycpO1xuICAgIGlmIChmcm9tU3RvcmFnZSA9PT0gJzEnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB0cnkge1xuICAgIHJldHVybiBuZXcgVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKS5zZWFyY2hQYXJhbXMuZ2V0KCdzYXBSZXBsYXlEZWJ1ZycpID09PSAnMSc7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufSkoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlcGxheURlYnVnKC4uLmFyZ3M6IHVua25vd25bXSk6IHZvaWQge1xuICBpZiAoIVJFUExBWV9ERUJVR19FTkFCTEVEKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnNvbGUubG9nKCdbU0FQIFJlcGxheSBEZWJ1Z10nLCAuLi5hcmdzKTtcbn1cbiIsICJpbXBvcnQge1xuICBDdXN0b21QYWNrSXRlbSxcbiAgQ3VzdG9tUGFja0NvbmZpZyxcbiAgUGV0Q29uZmlnLFxufSBmcm9tICdhcHAvZG9tYWluL2ludGVyZmFjZXMvc2ltdWxhdGlvbi1jb25maWcuaW50ZXJmYWNlJztcbmltcG9ydCB7IGVuY29kZUJhc2U2NFVybCB9IGZyb20gJ2FwcC9ydW50aW1lL2Jhc2U2NC11cmwnO1xuaW1wb3J0IHsgZm9vZCBhcyBmb29kSnNvbiB9IGZyb20gJ2FwcC9ydW50aW1lL2NvbnRlbnQtY2F0YWxvZ3MnO1xuaW1wb3J0IHtcbiAgS0VZX01BUCxcbiAgUEFDS19NQVAsXG4gIFBFUktTX0JZX0lELFxuICBQRVRTX0JZX0lELFxuICBQRVRfSURTX0JZX05BTUUsXG4gIFBFVFNfTUVUQV9CWV9JRCxcbiAgVE9ZU19CWV9JRCxcbn0gZnJvbSAnLi9yZXBsYXktY2FsYy1zY2hlbWEnO1xuaW1wb3J0IHtcbiAgcmVzb2x2ZVBldElkRnJvbVVua25vd24sXG4gIGdldFRpbWVzSHVydEZyb21SYXdQZXQsXG4gIGdldFRyaWdnZXJzQ29uc3VtZWRGcm9tUmF3UGV0LFxuICAvLyBvdGhlciBoZWxwZXJzIGF2YWlsYWJsZSBmb3IgZnV0dXJlIHdpcmluZ1xuICByZXNvbHZlVG95SWQsXG4gIGdldFRveU5hbWUsXG4gIGJ1aWxkQWJvbWluYXRpb25NZW1vcnksXG4gIGluZmVyQWJvbWluYXRpb25BYmlsaXR5RW51bXNGcm9tU3dhbGxvd2VkUGV0cyxcbiAgUmVwbGF5UGFyc2VyTG9va3VwTWFwcyxcbn0gZnJvbSAnLi9yZXBsYXktY2FsYy1wYXJzZXItdXRpbHMnO1xuXG5pbnRlcmZhY2UgUmVwbGF5QWJpbGl0eUpzb24ge1xuICBFbnU/OiBudW1iZXIgfCBzdHJpbmcgfCBudWxsO1xuICBMdmw/OiBudW1iZXIgfCBudWxsO1xuICBHcm9wPzogbnVtYmVyIHwgbnVsbDtcbiAgVHJDbz86IG51bWJlciB8IG51bGw7XG59XG5cbmludGVyZmFjZSBSZXBsYXlQZXRTdGF0c0pzb24ge1xuICBUZW1wPzogbnVtYmVyIHwgbnVsbDtcbiAgUGVybT86IG51bWJlciB8IG51bGw7XG59XG5cbmludGVyZmFjZSBSZXBsYXlQZXRKc29uIHtcbiAgRW51PzogbnVtYmVyIHwgc3RyaW5nIHwgbnVsbDtcbiAgQXQ/OiBSZXBsYXlQZXRTdGF0c0pzb24gfCBudWxsO1xuICBIcD86IFJlcGxheVBldFN0YXRzSnNvbiB8IG51bGw7XG4gIEV4cD86IG51bWJlciB8IG51bGw7XG4gIEx2bD86IG51bWJlciB8IG51bGw7XG4gIFBlcms/OiBudW1iZXIgfCBzdHJpbmcgfCBudWxsO1xuICBNYW5hPzogbnVtYmVyIHwgbnVsbDtcbiAgUG93Pzoge1xuICAgIFNhYmVydG9vdGhUaWdlckFiaWxpdHk/OiBudW1iZXIgfCBudWxsO1xuICB9IHwgbnVsbDtcbiAgQWJpbD86IFJlcGxheUFiaWxpdHlKc29uW10gfCBudWxsO1xuICBQb2k/OiB7XG4gICAgeD86IG51bWJlciB8IG51bGw7XG4gIH0gfCBudWxsO1xuICBNaU1zPzoge1xuICAgIExzdHM/OiB7XG4gICAgICBXaGl0ZVdoYWxlQWJpbGl0eT86IFJlcGxheVBldEpzb25bXSB8IG51bGw7XG4gICAgfSB8IG51bGw7XG4gIH0gfCBudWxsO1xuICBba2V5OiBzdHJpbmddOiB1bmtub3duO1xufVxuXG5pbnRlcmZhY2UgUmVwbGF5TWVtb3J5RW50cnlKc29uIHtcbiAgRW51PzogbnVtYmVyIHwgc3RyaW5nIHwgbnVsbDtcbiAgTHZsPzogbnVtYmVyIHwgbnVsbDtcbiAgSWQ/OiBudW1iZXIgfCBzdHJpbmcgfCBudWxsO1xuICBpZD86IG51bWJlciB8IHN0cmluZyB8IG51bGw7XG4gIGVudT86IG51bWJlciB8IHN0cmluZyB8IG51bGw7XG4gIE1pTXM/OiB7XG4gICAgTHN0cz86IFJlY29yZDxzdHJpbmcsIEFycmF5PFJlcGxheU1lbW9yeUVudHJ5SnNvbiB8IG51bGw+IHwgbnVsbD4gfCBudWxsO1xuICB9IHwgbnVsbDtcbiAgW2tleTogc3RyaW5nXTogdW5rbm93bjtcbn1cblxuaW50ZXJmYWNlIFJlcGxheVRveUpzb24ge1xuICBFbnU/OiBudW1iZXIgfCBzdHJpbmcgfCBudWxsO1xuICBMdmw/OiBudW1iZXIgfCBudWxsO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlcGxheURlY2tKc29uIHtcbiAgSWQ/OiBudW1iZXIgfCBzdHJpbmcgfCBudWxsO1xuICBUaXRsZT86IHN0cmluZyB8IG51bGw7XG4gIE1pbmlvbnM/OiBBcnJheTxudW1iZXIgfCBzdHJpbmc+IHwgbnVsbDtcbiAgU3BlbGxzPzogQXJyYXk8c3RyaW5nIHwgbnVtYmVyPiB8IG51bGw7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVwbGF5Qm9hcmRKc29uIHtcbiAgW2tleTogc3RyaW5nXTogdW5rbm93bjtcbiAgTWlucz86IHtcbiAgICBJdGVtcz86IEFycmF5PFJlcGxheVBldEpzb24gfCBudWxsPiB8IG51bGw7XG4gIH0gfCBudWxsO1xuICBSZWw/OiB7XG4gICAgSXRlbXM/OiBBcnJheTxSZXBsYXlUb3lKc29uIHwgbnVsbD4gfCBudWxsO1xuICB9IHwgbnVsbDtcbiAgRGVjaz86IFJlcGxheURlY2tKc29uIHwgbnVsbDtcbiAgUGFjaz86IG51bWJlciB8IG51bGw7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVwbGF5QmF0dGxlSnNvbiB7XG4gIFVzZXJCb2FyZD86IFJlcGxheUJvYXJkSnNvbiB8IG51bGw7XG4gIE9wcG9uZW50Qm9hcmQ/OiBSZXBsYXlCb2FyZEpzb24gfCBudWxsO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlcGxheUJ1aWxkTW9kZWxKc29uIHtcbiAgW2tleTogc3RyaW5nXTogdW5rbm93bjtcbiAgQm9yPzoge1xuICAgIERlY2s/OiBSZXBsYXlEZWNrSnNvbiB8IG51bGw7XG4gIH0gfCBudWxsO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlcGxheU1ldGFCb2FyZHMge1xuICB1c2VyQm9hcmQ/OiBSZXBsYXlCb2FyZEpzb24gfCBudWxsO1xuICBvcHBvbmVudEJvYXJkPzogUmVwbGF5Qm9hcmRKc29uIHwgbnVsbDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZXBsYXlQYXJzZU9wdGlvbnMge1xuICBhYmlsaXR5UGV0TWFwPzogUmVjb3JkPHN0cmluZywgc3RyaW5nIHwgbnVtYmVyPiB8IG51bGw7XG4gIC8qKiBSZXBsYXktZGVyaXZlZCBwZXJrIG5hbWVzIGtleWVkIGJ5IHRoZSByYXcgcGV0IGVudW0uICovXG4gIHBlcmtOYW1lQnlQZXRJZD86IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfCBudWxsO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlcGxheUFjdGlvbkpzb24ge1xuICBUeXBlPzogbnVtYmVyIHwgbnVsbDtcbiAgVHVybj86IG51bWJlciB8IHN0cmluZyB8IG51bGw7XG4gIEJ1aWxkPzogc3RyaW5nIHwgUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsO1xuICBCYXR0bGU/OiBzdHJpbmcgfCBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGw7XG4gIE1vZGU/OiBzdHJpbmcgfCBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGw7XG4gIFJlc3BvbnNlPzogc3RyaW5nIHwgUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlcGxheUFjdGlvbnNDb250YWluZXJKc29uIHtcbiAgQWN0aW9ucz86IFJlYWRvbmx5QXJyYXk8UmVwbGF5QWN0aW9uSnNvbj4gfCBudWxsO1xuICBHZW5lc2lzQnVpbGRNb2RlbD86IFJlcGxheUJ1aWxkTW9kZWxKc29uIHwgbnVsbDtcbn1cblxuaW50ZXJmYWNlIFJlcGxheUJvdFR1cm5BYmlsaXR5SnNvbiB7XG4gIGlkPzogbnVtYmVyIHwgc3RyaW5nIHwgbnVsbDtcbiAgbGV2ZWw/OiBudW1iZXIgfCBudWxsO1xuICBncm91cD86IG51bWJlciB8IG51bGw7XG4gIHRyaWdnZXJzQ29uc3VtZWQ/OiBudW1iZXIgfCBudWxsO1xufVxuXG5pbnRlcmZhY2UgUmVwbGF5Qm90VHVyblN0YXRCbG9ja0pzb24ge1xuICBwZXJtYW5lbnQ/OiBudW1iZXIgfCBudWxsO1xuICB0ZW1wb3Jhcnk/OiBudW1iZXIgfCBudWxsO1xufVxuXG5pbnRlcmZhY2UgUmVwbGF5Qm90VHVyblBldEpzb24ge1xuICBzbG90PzogbnVtYmVyIHwgbnVsbDtcbiAgaWQ/OiBudW1iZXIgfCBzdHJpbmcgfCBudWxsO1xuICBsZXZlbD86IG51bWJlciB8IG51bGw7XG4gIGV4cGVyaWVuY2U/OiBudW1iZXIgfCBudWxsO1xuICBwZXJrSWQ/OiBudW1iZXIgfCBzdHJpbmcgfCBudWxsO1xuICBhdHRhY2s/OiBSZXBsYXlCb3RUdXJuU3RhdEJsb2NrSnNvbiB8IG51bGw7XG4gIGhlYWx0aD86IFJlcGxheUJvdFR1cm5TdGF0QmxvY2tKc29uIHwgbnVsbDtcbiAgbWFuYT86IG51bWJlciB8IG51bGw7XG4gIGFiaWxpdGllcz86IFJlcGxheUJvdFR1cm5BYmlsaXR5SnNvbltdIHwgbnVsbDtcbn1cblxuaW50ZXJmYWNlIFJlcGxheUJvdFR1cm5TdGF0c0pzb24ge1xuICB0dXJuPzogbnVtYmVyIHwgbnVsbDtcbiAgZ29sZFNwZW50PzogbnVtYmVyIHwgbnVsbDtcbiAgcm9sbHM/OiBudW1iZXIgfCBudWxsO1xuICBzdW1tb25zPzogbnVtYmVyIHwgbnVsbDtcbiAgbGV2ZWwzU29sZD86IG51bWJlciB8IG51bGw7XG4gIHRyYW5zZm9ybWVkPzogbnVtYmVyIHwgbnVsbDtcbn1cblxuaW50ZXJmYWNlIFJlcGxheUJvdFR1cm5TaWRlSnNvbiB7XG4gIHN0YXRzPzogUmVwbGF5Qm90VHVyblN0YXRzSnNvbiB8IG51bGw7XG4gIHBldHM/OiBSZXBsYXlCb3RUdXJuUGV0SnNvbltdIHwgbnVsbDtcbn1cblxuaW50ZXJmYWNlIFJlcGxheUJvdFR1cm5Kc29uIHtcbiAgdHVybj86IG51bWJlciB8IHN0cmluZyB8IG51bGw7XG4gIHVzZXI/OiBSZXBsYXlCb3RUdXJuU2lkZUpzb24gfCBudWxsO1xuICBvcHBvbmVudD86IFJlcGxheUJvdFR1cm5TaWRlSnNvbiB8IG51bGw7XG59XG5cbmludGVyZmFjZSBSZXBsYXlCb3RSZXBsYXlNZXRhSnNvbiB7XG4gIHBhY2s/OiBudW1iZXIgfCBzdHJpbmcgfCBudWxsO1xuICBvcHBvbmVudF9wYWNrPzogbnVtYmVyIHwgc3RyaW5nIHwgbnVsbDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZXBsYXlCb3RUdXJuc0NvbnRhaW5lckpzb24ge1xuICB0dXJucz86IFJlYWRvbmx5QXJyYXk8UmVwbGF5Qm90VHVybkpzb24+IHwgbnVsbDtcbiAgZ2VuZXNpc0J1aWxkTW9kZWw/OiBSZXBsYXlCdWlsZE1vZGVsSnNvbiB8IG51bGw7XG4gIGFiaWxpdHlQZXRNYXA/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmcgfCBudW1iZXI+IHwgbnVsbDtcbiAgcmVwbGF5TWV0YT86IFJlcGxheUJvdFJlcGxheU1ldGFKc29uIHwgbnVsbDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZXBsYXlDdXN0b21QYWNrIGV4dGVuZHMgQ3VzdG9tUGFja0NvbmZpZyB7XG4gIG5hbWU6IHN0cmluZztcbiAgZGVja0lkPzogc3RyaW5nIHwgbnVsbDtcbiAgdGllcjFQZXRzOiAoc3RyaW5nIHwgbnVsbClbXTtcbiAgdGllcjJQZXRzOiAoc3RyaW5nIHwgbnVsbClbXTtcbiAgdGllcjNQZXRzOiAoc3RyaW5nIHwgbnVsbClbXTtcbiAgdGllcjRQZXRzOiAoc3RyaW5nIHwgbnVsbClbXTtcbiAgdGllcjVQZXRzOiAoc3RyaW5nIHwgbnVsbClbXTtcbiAgdGllcjZQZXRzOiAoc3RyaW5nIHwgbnVsbClbXTtcbiAgc3BlbGxzOiBDdXN0b21QYWNrSXRlbVtdO1xufVxuXG5pbnRlcmZhY2UgUmVwbGF5UGFyc2VkVG95IHtcbiAgbmFtZTogc3RyaW5nIHwgbnVsbDtcbiAgbGV2ZWw6IG51bWJlcjtcbn1cblxudHlwZSBTdHJpcHBlZFJlcGxheVBldCA9IFBpY2s8UGV0Q29uZmlnLCAnbmFtZSc+ICYgUGFydGlhbDxPbWl0PFBldENvbmZpZywgJ25hbWUnPj47XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVwbGF5Q2FsY3VsYXRvclN0YXRlIHtcbiAgcGxheWVyUGFjazogc3RyaW5nO1xuICBvcHBvbmVudFBhY2s6IHN0cmluZztcbiAgcGxheWVyVG95OiBzdHJpbmcgfCBudWxsO1xuICBwbGF5ZXJUb3lMZXZlbDogc3RyaW5nO1xuICBwbGF5ZXJIYXJkVG95OiBudWxsO1xuICBwbGF5ZXJIYXJkVG95TGV2ZWw6IG51bWJlcjtcbiAgb3Bwb25lbnRUb3k6IHN0cmluZyB8IG51bGw7XG4gIG9wcG9uZW50VG95TGV2ZWw6IHN0cmluZztcbiAgb3Bwb25lbnRIYXJkVG95OiBudWxsO1xuICBvcHBvbmVudEhhcmRUb3lMZXZlbDogbnVtYmVyO1xuICB0dXJuOiBudW1iZXI7XG4gIHBsYXllckdvbGRTcGVudDogbnVtYmVyO1xuICBvcHBvbmVudEdvbGRTcGVudDogbnVtYmVyO1xuICBwbGF5ZXJSb2xsQW1vdW50OiBudW1iZXI7XG4gIG9wcG9uZW50Um9sbEFtb3VudDogbnVtYmVyO1xuICBwbGF5ZXJTdW1tb25lZEFtb3VudDogbnVtYmVyO1xuICBvcHBvbmVudFN1bW1vbmVkQW1vdW50OiBudW1iZXI7XG4gIHBsYXllckxldmVsM1NvbGQ6IG51bWJlcjtcbiAgb3Bwb25lbnRMZXZlbDNTb2xkOiBudW1iZXI7XG4gIHBsYXllclRyYW5zZm9ybWF0aW9uQW1vdW50OiBudW1iZXI7XG4gIG9wcG9uZW50VHJhbnNmb3JtYXRpb25BbW91bnQ6IG51bWJlcjtcbiAgcGxheWVyUGV0czogKFBldENvbmZpZyB8IG51bGwpW107XG4gIG9wcG9uZW50UGV0czogKFBldENvbmZpZyB8IG51bGwpW107XG4gIGFsbFBldHM6IGJvb2xlYW47XG4gIGxvZ0ZpbHRlcjogc3RyaW5nIHwgbnVsbDtcbiAgY3VzdG9tUGFja3M6IFJlcGxheUN1c3RvbVBhY2tbXTtcbiAgb2xkU3Rvcms6IGJvb2xlYW47XG4gIHRva2VuUGV0czogYm9vbGVhbjtcbiAga29tb2RvU2h1ZmZsZTogYm9vbGVhbjtcbiAgbWFuYTogYm9vbGVhbjtcbiAgc2VlZDogbnVtYmVyIHwgbnVsbDtcbiAgdHJpZ2dlcnNDb25zdW1lZDogYm9vbGVhbjtcbiAgZm9vZHNFYXRlbj86IGJvb2xlYW47XG4gIHNob3dBZHZhbmNlZDogYm9vbGVhbjtcbiAgc2hvd1RyaWdnZXJOYW1lc0luTG9nczogYm9vbGVhbjtcbiAgc2hvd1Bvc2l0aW9uYWxBcmdzSW5Mb2dzOiBib29sZWFuO1xuICBhaWxtZW50RXF1aXBtZW50OiBib29sZWFuO1xufVxuXG50eXBlIFJlcGxheUN1c3RvbVBhY2tDb3JlID0gT21pdDxSZXBsYXlDdXN0b21QYWNrLCAnZGVja0lkJz47XG5cbmZ1bmN0aW9uIHRvRmluaXRlTnVtYmVyKHZhbHVlOiB1bmtub3duKTogbnVtYmVyIHwgbnVsbCB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIE51bWJlci5pc0Zpbml0ZSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUudHJpbSgpLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBwYXJzZWQgPSBOdW1iZXIodmFsdWUpO1xuICAgIHJldHVybiBOdW1iZXIuaXNGaW5pdGUocGFyc2VkKSA/IHBhcnNlZCA6IG51bGw7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIHRvTnVtYmVyT3JGYWxsYmFjayh2YWx1ZTogdW5rbm93biwgZmFsbGJhY2s6IG51bWJlcik6IG51bWJlciB7XG4gIGNvbnN0IHBhcnNlZCA9IHRvRmluaXRlTnVtYmVyKHZhbHVlKTtcbiAgcmV0dXJuIHBhcnNlZCA/PyBmYWxsYmFjaztcbn1cblxuZnVuY3Rpb24gaXNSZWNvcmQodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB7XG4gIHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gYXNSZWNvcmQodmFsdWU6IHVua25vd24pOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGwge1xuICByZXR1cm4gaXNSZWNvcmQodmFsdWUpID8gdmFsdWUgOiBudWxsO1xufVxuXG5mdW5jdGlvbiBhc1JlcGxheU1lbW9yeUVudHJ5KFxuICB2YWx1ZTogdW5rbm93bixcbik6IFJlcGxheU1lbW9yeUVudHJ5SnNvbiB8IG51bGwge1xuICByZXR1cm4gaXNSZWNvcmQodmFsdWUpID8gKHZhbHVlIGFzIFJlcGxheU1lbW9yeUVudHJ5SnNvbikgOiBudWxsO1xufVxuXG5mdW5jdGlvbiBnZXRSZXBsYXlNZW1vcnlMaXN0cyhcbiAgdmFsdWU6IFJlcGxheVBldEpzb24gfCBSZXBsYXlNZW1vcnlFbnRyeUpzb24gfCBudWxsIHwgdW5kZWZpbmVkLFxuKTogUmVjb3JkPHN0cmluZywgQXJyYXk8UmVwbGF5TWVtb3J5RW50cnlKc29uIHwgbnVsbD4gfCBudWxsPiB8IG51bGwge1xuICBjb25zdCBsaXN0cyA9IHZhbHVlPy5NaU1zPy5Mc3RzO1xuICByZXR1cm4gaXNSZWNvcmQobGlzdHMpXG4gICAgPyAobGlzdHMgYXMgUmVjb3JkPHN0cmluZywgQXJyYXk8UmVwbGF5TWVtb3J5RW50cnlKc29uIHwgbnVsbD4gfCBudWxsPilcbiAgICA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIGdldEZpcnN0UmVwbGF5TWVtb3J5RW50cnkoXG4gIHZhbHVlOiBSZXBsYXlQZXRKc29uIHwgUmVwbGF5TWVtb3J5RW50cnlKc29uIHwgbnVsbCB8IHVuZGVmaW5lZCxcbik6IFJlcGxheU1lbW9yeUVudHJ5SnNvbiB8IG51bGwge1xuICBjb25zdCBsaXN0cyA9IGdldFJlcGxheU1lbW9yeUxpc3RzKHZhbHVlKTtcbiAgaWYgKCFsaXN0cykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZm9yIChjb25zdCBlbnRyaWVzIG9mIE9iamVjdC52YWx1ZXMobGlzdHMpKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGVudHJpZXMpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiBlbnRyaWVzKSB7XG4gICAgICBjb25zdCBtZW1vcnlFbnRyeSA9IGFzUmVwbGF5TWVtb3J5RW50cnkoZW50cnkpO1xuICAgICAgaWYgKG1lbW9yeUVudHJ5KSB7XG4gICAgICAgIHJldHVybiBtZW1vcnlFbnRyeTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gZ2V0UmVwbGF5TWVtb3J5RW50cnlCeUFiaWxpdHlJZChcbiAgdmFsdWU6IFJlcGxheVBldEpzb24gfCBSZXBsYXlNZW1vcnlFbnRyeUpzb24gfCBudWxsIHwgdW5kZWZpbmVkLFxuICBhYmlsaXR5SWQ6IHVua25vd24sXG4pOiBSZXBsYXlNZW1vcnlFbnRyeUpzb24gfCBudWxsIHtcbiAgY29uc3Qga2V5ID0gdG9SZXBsYXlJZChhYmlsaXR5SWQpO1xuICBpZiAoIWtleSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgZW50cmllcyA9IGdldFJlcGxheU1lbW9yeUxpc3RzKHZhbHVlKT8uW2tleV07XG4gIGlmICghQXJyYXkuaXNBcnJheShlbnRyaWVzKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZm9yIChjb25zdCBlbnRyeSBvZiBlbnRyaWVzKSB7XG4gICAgY29uc3QgbWVtb3J5RW50cnkgPSBhc1JlcGxheU1lbW9yeUVudHJ5KGVudHJ5KTtcbiAgICBpZiAobWVtb3J5RW50cnkpIHtcbiAgICAgIHJldHVybiBtZW1vcnlFbnRyeTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVJlcGxheU1lbW9yeVBldE5hbWUoXG4gIHZhbHVlOiBSZXBsYXlNZW1vcnlFbnRyeUpzb24gfCBudWxsIHwgdW5kZWZpbmVkLFxuKTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IHJhd1BldFJlZiA9XG4gICAgdmFsdWU/LkVudSA/P1xuICAgIHZhbHVlPy5lbnUgPz9cbiAgICB2YWx1ZT8uSWQgPz9cbiAgICB2YWx1ZT8uaWQ7XG4gIGNvbnN0IHJlc29sdmVkUGV0SWQgPSByZXNvbHZlUGV0SWRGcm9tVW5rbm93bihyYXdQZXRSZWYsIHsgUEVUX0lEU19CWV9OQU1FIH0pO1xuICBpZiAocmVzb2x2ZWRQZXRJZCA9PT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIFBFVFNfQllfSUQuZ2V0KFN0cmluZyhyZXNvbHZlZFBldElkKSkgPz8gYFBldCAjJHtyZXNvbHZlZFBldElkfWA7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVOZXN0ZWRTd2FsbG93ZWRQZXROYW1lKFxuICB2YWx1ZTogUmVwbGF5UGV0SnNvbiB8IFJlcGxheU1lbW9yeUVudHJ5SnNvbiB8IG51bGwgfCB1bmRlZmluZWQsXG4pOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgbmVzdGVkRW50cnkgPSBnZXRGaXJzdFJlcGxheU1lbW9yeUVudHJ5KHZhbHVlKTtcbiAgaWYgKG5lc3RlZEVudHJ5KSB7XG4gICAgcmV0dXJuIHJlc29sdmVSZXBsYXlNZW1vcnlQZXROYW1lKG5lc3RlZEVudHJ5KTtcbiAgfVxuXG4gIC8vIEEgZnVsbCBwZXQgaXMgbm90IGl0cyBvd24gc3dhbGxvd2VkLW1lbW9yeSBlbnRyeS4gVGhpcyBtYXR0ZXJzIHdoZW4gdGhlXG4gIC8vIHJlcGxheSBzdW1tYXJ5IG9taXRzIE1pTXM6IHRyZWF0aW5nIHRoZSByb290IEVudSBhcyBtZW1vcnkgbWFkZSBCZWx1Z2FcbiAgLy8gc3dhbGxvdyBhbm90aGVyIEJlbHVnYSAoYW5kIGRpZCB0aGUgc2FtZSBmb3IgU2FyY2FzdGljIEZyaW5nZWhlYWQpLlxuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZT8uQWJpbCkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiByZXNvbHZlUmVwbGF5TWVtb3J5UGV0TmFtZShhc1JlcGxheU1lbW9yeUVudHJ5KHZhbHVlKSk7XG59XG5cbmNvbnN0IENPUFlfU09VUkNFX1BFVF9JRFMgPSBuZXcgU2V0PHN0cmluZz4oW1xuICAnNTMnLCAvLyBQYXJyb3RcbiAgJzE4MicsIC8vIEJlbHVnYSBXaGFsZVxuICAnMzczJywgLy8gQWJvbWluYXRpb25cbiAgJzc2MycsIC8vIFNhcmNhc3RpYyBGcmluZ2VoZWFkXG5dKTtcblxuLy8gU29tZSBzdG9yZWQvY29weSBhYmlsaXRpZXMgaGF2ZSB0aGVpciBvd24gZW51bSBhbmQgdGhlcmVmb3JlIGNhbm5vdCBiZVxuLy8gcmVjb3ZlcmVkIGZyb20gdGhlIGhvbGRlci1iYXNlZCBhYmlsaXR5UGV0TWFwIGVtaXR0ZWQgYnkgcmVwbGF5IGluZGV4aW5nLlxuLy8gS2VlcCB0aGVzZSBleHBsaWNpdCBzbyBhIGNvcGllZCBhYmlsaXR5IGlzIG5ldmVyIGd1ZXNzZWQgZnJvbSBhbiB1bnJlbGF0ZWRcbi8vIG5laWdoYm9yaW5nIHBhY2sncyBlbnVtIG9mZnNldC5cbmNvbnN0IFNUT1JFRF9DT1BZX0FCSUxJVFlfT1dORVJfQllfSUQgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPihbXG4gIFsnMjk2JywgJ1dvbGYnXSxcbl0pO1xuXG5jb25zdCBBQk9NSU5BVElPTl9TTE9UX0ZJRUxEUyA9IFtcbiAge1xuICAgIHBldDogJ2Fib21pbmF0aW9uU3dhbGxvd2VkUGV0MScsXG4gICAgbGV2ZWw6ICdhYm9taW5hdGlvblN3YWxsb3dlZFBldDFMZXZlbCcsXG4gICAgdGltZXNIdXJ0OiAnYWJvbWluYXRpb25Td2FsbG93ZWRQZXQxVGltZXNIdXJ0JyxcbiAgICBiZWx1Z2E6ICdhYm9taW5hdGlvblN3YWxsb3dlZFBldDFCZWx1Z2FTd2FsbG93ZWRQZXQnLFxuICAgIHNhcmNhc3RpY0ZyaW5nZWhlYWQ6ICdhYm9taW5hdGlvblN3YWxsb3dlZFBldDFTYXJjYXN0aWNGcmluZ2VoZWFkU3dhbGxvd2VkUGV0JyxcbiAgfSxcbiAge1xuICAgIHBldDogJ2Fib21pbmF0aW9uU3dhbGxvd2VkUGV0MicsXG4gICAgbGV2ZWw6ICdhYm9taW5hdGlvblN3YWxsb3dlZFBldDJMZXZlbCcsXG4gICAgdGltZXNIdXJ0OiAnYWJvbWluYXRpb25Td2FsbG93ZWRQZXQyVGltZXNIdXJ0JyxcbiAgICBiZWx1Z2E6ICdhYm9taW5hdGlvblN3YWxsb3dlZFBldDJCZWx1Z2FTd2FsbG93ZWRQZXQnLFxuICAgIHNhcmNhc3RpY0ZyaW5nZWhlYWQ6ICdhYm9taW5hdGlvblN3YWxsb3dlZFBldDJTYXJjYXN0aWNGcmluZ2VoZWFkU3dhbGxvd2VkUGV0JyxcbiAgfSxcbiAge1xuICAgIHBldDogJ2Fib21pbmF0aW9uU3dhbGxvd2VkUGV0MycsXG4gICAgbGV2ZWw6ICdhYm9taW5hdGlvblN3YWxsb3dlZFBldDNMZXZlbCcsXG4gICAgdGltZXNIdXJ0OiAnYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzVGltZXNIdXJ0JyxcbiAgICBiZWx1Z2E6ICdhYm9taW5hdGlvblN3YWxsb3dlZFBldDNCZWx1Z2FTd2FsbG93ZWRQZXQnLFxuICAgIHNhcmNhc3RpY0ZyaW5nZWhlYWQ6ICdhYm9taW5hdGlvblN3YWxsb3dlZFBldDNTYXJjYXN0aWNGcmluZ2VoZWFkU3dhbGxvd2VkUGV0JyxcbiAgfSxcbl0gYXMgY29uc3Q7XG5cbnR5cGUgQWJpbGl0eU93bmVyQ291bnRzID0gTWFwPHN0cmluZywgTWFwPHN0cmluZywgbnVtYmVyPj47XG5cbnR5cGUgQWJvbWluYXRpb25Td2FsbG93ZWRQZXRGaWVsZCA9ICh0eXBlb2YgQUJPTUlOQVRJT05fU0xPVF9GSUVMRFMpW251bWJlcl1bJ3BldCddO1xudHlwZSBBYm9taW5hdGlvblN3YWxsb3dlZFBldExldmVsRmllbGQgPVxuICAodHlwZW9mIEFCT01JTkFUSU9OX1NMT1RfRklFTERTKVtudW1iZXJdWydsZXZlbCddO1xudHlwZSBBYm9taW5hdGlvblN3YWxsb3dlZFBldFRpbWVzSHVydEZpZWxkID1cbiAgKHR5cGVvZiBBQk9NSU5BVElPTl9TTE9UX0ZJRUxEUylbbnVtYmVyXVsndGltZXNIdXJ0J107XG50eXBlIEFib21pbmF0aW9uU3dhbGxvd2VkUGV0TmVzdGVkRmllbGQgPVxuICAodHlwZW9mIEFCT01JTkFUSU9OX1NMT1RfRklFTERTKVtudW1iZXJdWydiZWx1Z2EnXSB8XG4gICh0eXBlb2YgQUJPTUlOQVRJT05fU0xPVF9GSUVMRFMpW251bWJlcl1bJ3NhcmNhc3RpY0ZyaW5nZWhlYWQnXTtcblxudHlwZSBBYm9taW5hdGlvblN3YWxsb3dlZFN0YXRlID0gUGljazxcbiAgUGV0Q29uZmlnLFxuICBBYm9taW5hdGlvblN3YWxsb3dlZFBldEZpZWxkIHxcbiAgQWJvbWluYXRpb25Td2FsbG93ZWRQZXRMZXZlbEZpZWxkIHxcbiAgQWJvbWluYXRpb25Td2FsbG93ZWRQZXRUaW1lc0h1cnRGaWVsZCB8XG4gIEFib21pbmF0aW9uU3dhbGxvd2VkUGV0TmVzdGVkRmllbGRcbj47XG5cbmZ1bmN0aW9uIHRvUmVwbGF5SWQodmFsdWU6IHVua25vd24pOiBzdHJpbmcgfCBudWxsIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgTnVtYmVyLmlzRmluaXRlKHZhbHVlKSkge1xuICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIGluY3JlbWVudEFiaWxpdHlPd25lckNvdW50KFxuICBhYmlsaXR5T3duZXJDb3VudHM6IEFiaWxpdHlPd25lckNvdW50cyxcbiAgYWJpbGl0eUlkOiBzdHJpbmcsXG4gIHBldElkOiBzdHJpbmcsXG4pOiB2b2lkIHtcbiAgbGV0IHBldENvdW50QnlJZCA9IGFiaWxpdHlPd25lckNvdW50cy5nZXQoYWJpbGl0eUlkKTtcbiAgaWYgKCFwZXRDb3VudEJ5SWQpIHtcbiAgICBwZXRDb3VudEJ5SWQgPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpO1xuICAgIGFiaWxpdHlPd25lckNvdW50cy5zZXQoYWJpbGl0eUlkLCBwZXRDb3VudEJ5SWQpO1xuICB9XG4gIHBldENvdW50QnlJZC5zZXQocGV0SWQsIChwZXRDb3VudEJ5SWQuZ2V0KHBldElkKSA/PyAwKSArIDEpO1xufVxuXG5mdW5jdGlvbiBjb2xsZWN0QWJpbGl0eU93bmVyQ291bnRzKFxuICB2YWx1ZTogdW5rbm93bixcbiAgYWJpbGl0eU93bmVyQ291bnRzOiBBYmlsaXR5T3duZXJDb3VudHMsXG4pOiB2b2lkIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgdmFsdWUuZm9yRWFjaCgoZW50cnkpID0+IGNvbGxlY3RBYmlsaXR5T3duZXJDb3VudHMoZW50cnksIGFiaWxpdHlPd25lckNvdW50cykpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICghaXNSZWNvcmQodmFsdWUpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgcGV0SWQgPSB0b1JlcGxheUlkKHZhbHVlLkVudSk7XG4gIGNvbnN0IGFiaWxpdGllcyA9IHZhbHVlLkFiaWw7XG4gIGlmIChwZXRJZCAmJiBBcnJheS5pc0FycmF5KGFiaWxpdGllcykgJiYgIUNPUFlfU09VUkNFX1BFVF9JRFMuaGFzKHBldElkKSkge1xuICAgIGFiaWxpdGllcy5mb3JFYWNoKChhYmlsaXR5KSA9PiB7XG4gICAgICBpZiAoIWlzUmVjb3JkKGFiaWxpdHkpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGFiaWxpdHlJZCA9IHRvUmVwbGF5SWQoYWJpbGl0eS5FbnUpO1xuICAgICAgaWYgKCFhYmlsaXR5SWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaW5jcmVtZW50QWJpbGl0eU93bmVyQ291bnQoYWJpbGl0eU93bmVyQ291bnRzLCBhYmlsaXR5SWQsIHBldElkKTtcbiAgICB9KTtcbiAgfVxuXG4gIE9iamVjdC52YWx1ZXModmFsdWUpLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgY29sbGVjdEFiaWxpdHlPd25lckNvdW50cyhlbnRyeSwgYWJpbGl0eU93bmVyQ291bnRzKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHBpY2tNb3N0TGlrZWx5UGV0SWQocGV0Q291bnRCeUlkOiBNYXA8c3RyaW5nLCBudW1iZXI+KTogc3RyaW5nIHwgbnVsbCB7XG4gIGxldCBiZXN0UGV0SWQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBsZXQgYmVzdENvdW50ID0gLTE7XG5cbiAgZm9yIChjb25zdCBbcGV0SWQsIGNvdW50XSBvZiBwZXRDb3VudEJ5SWQuZW50cmllcygpKSB7XG4gICAgaWYgKFxuICAgICAgY291bnQgPiBiZXN0Q291bnQgfHxcbiAgICAgIChjb3VudCA9PT0gYmVzdENvdW50ICYmIChiZXN0UGV0SWQgPT09IG51bGwgfHwgcGV0SWQgPCBiZXN0UGV0SWQpKVxuICAgICkge1xuICAgICAgYmVzdFBldElkID0gcGV0SWQ7XG4gICAgICBiZXN0Q291bnQgPSBjb3VudDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYmVzdFBldElkO1xufVxuXG5mdW5jdGlvbiBidWlsZFJlcGxheUFiaWxpdHlQZXRNYXBGcm9tQ291bnRzKFxuICBhYmlsaXR5T3duZXJDb3VudHM6IEFiaWxpdHlPd25lckNvdW50cyxcbik6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4ge1xuICBjb25zdCBhYmlsaXR5UGV0TWFwOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGZvciAoY29uc3QgW2FiaWxpdHlJZCwgcGV0Q291bnRCeUlkXSBvZiBhYmlsaXR5T3duZXJDb3VudHMuZW50cmllcygpKSB7XG4gICAgY29uc3QgcGV0SWQgPSBwaWNrTW9zdExpa2VseVBldElkKHBldENvdW50QnlJZCk7XG4gICAgaWYgKHBldElkKSB7XG4gICAgICBhYmlsaXR5UGV0TWFwW2FiaWxpdHlJZF0gPSBwZXRJZDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFiaWxpdHlQZXRNYXA7XG59XG5cbmZ1bmN0aW9uIHBhcnNlSnNvblZhbHVlKHJhdzogdW5rbm93bik6IHVua25vd24ge1xuICBpZiAoaXNSZWNvcmQocmF3KSB8fCBBcnJheS5pc0FycmF5KHJhdykpIHtcbiAgICByZXR1cm4gcmF3O1xuICB9XG4gIGlmICh0eXBlb2YgcmF3ICE9PSAnc3RyaW5nJyB8fCByYXcubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdHJ5IHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShyYXcpIGFzIHVua25vd247XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmludGVyZmFjZSBSZXBsYXlGb29kRW50cnlKc29uIHtcbiAgSWQ/OiBudW1iZXIgfCBzdHJpbmcgfCBudWxsO1xuICBOYW1lPzogc3RyaW5nIHwgbnVsbDtcbiAgQWJpbGl0eT86IHN0cmluZyB8IG51bGw7XG59XG5cbmNvbnN0IHJlcGxheUZvb2RFbnRyaWVzID1cbiAgKGZvb2RKc29uIGFzIHVua25vd24gYXMgeyBkZWZhdWx0PzogUmVwbGF5Rm9vZEVudHJ5SnNvbltdIH0pLmRlZmF1bHQgPz9cbiAgKGZvb2RKc29uIGFzIHVua25vd24gYXMgUmVwbGF5Rm9vZEVudHJ5SnNvbltdKTtcblxuLy8gVGhlIHJlcGxheSBBUEkgc3RvcmVzIHRoZSBmb29kLWNhcmQgZW51bSBpbiBhIHNwZWxsIHJlc3BvbnNlLCB3aGlsZSB0aGVcbi8vIHBldCBzbmFwc2hvdCBzdG9yZXMgdGhlIHJlc3VsdGluZyBwZXJrIHVuZGVyIGEgc2VwYXJhdGUgZW51bS4gUmVzb2x2ZSB0aGVcbi8vIGZvcm1lciBmcm9tIGNhbm9uaWNhbCBmb29kIG1ldGFkYXRhIHNvIG5ld2x5IGFkZGVkIHBlcmsgZm9vZHMgZG8gbm90IG5lZWQgYVxuLy8gc2Vjb25kIGhhbmQtbWFpbnRhaW5lZCByZXBsYXkgbWFwcGluZy5cbmNvbnN0IFJFUExBWV9QRVJLX0ZPT0RfTkFNRVNfQllfU1BFTExfSUQgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPihcbiAgcmVwbGF5Rm9vZEVudHJpZXNcbiAgICAuZmlsdGVyKFxuICAgICAgKGVudHJ5KTogZW50cnkgaXMgUmVwbGF5Rm9vZEVudHJ5SnNvbiAmIHsgSWQ6IG51bWJlciB8IHN0cmluZzsgTmFtZTogc3RyaW5nIH0gPT5cbiAgICAgICAgZW50cnk/LklkICE9PSBudWxsICYmXG4gICAgICAgIGVudHJ5Py5JZCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgIHR5cGVvZiBlbnRyeT8uTmFtZSA9PT0gJ3N0cmluZycgJiZcbiAgICAgICAgL15HaXZlIG9uZSBwZXQgdGhlIC4rIHBlcmtcXC4kL2kudGVzdChlbnRyeT8uQWJpbGl0eSA/PyAnJyksXG4gICAgKVxuICAgIC5tYXAoKGVudHJ5KSA9PiBbU3RyaW5nKGVudHJ5LklkKSwgZW50cnkuTmFtZV0pLFxuKTtcblxuZnVuY3Rpb24gZ2V0UmVwbGF5RW50aXR5S2V5KHZhbHVlOiB1bmtub3duKTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IHJlY29yZCA9IGFzUmVjb3JkKHZhbHVlKTtcbiAgaWYgKCFyZWNvcmQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGJvYXJkSWQgPSByZWNvcmRbJ0JvSWQnXSA/PyByZWNvcmRbJ2JvSWQnXTtcbiAgY29uc3QgdW5pcXVlSWQgPSByZWNvcmRbJ1VuaSddID8/IHJlY29yZFsndW5pJ107XG4gIGlmIChib2FyZElkID09PSBudWxsIHx8IGJvYXJkSWQgPT09IHVuZGVmaW5lZCB8fCB1bmlxdWVJZCA9PT0gbnVsbCB8fCB1bmlxdWVJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gYCR7U3RyaW5nKGJvYXJkSWQpfToke1N0cmluZyh1bmlxdWVJZCl9YDtcbn1cblxuZnVuY3Rpb24gYnVpbGRSZXBsYXlQZXRJZEJ5RW50aXR5S2V5KFxuICBiYXR0bGVKc29uOiBSZXBsYXlCYXR0bGVKc29uLFxuKTogTWFwPHN0cmluZywgc3RyaW5nPiB7XG4gIGNvbnN0IHBldElkQnlFbnRpdHlLZXkgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICBmb3IgKGNvbnN0IGJvYXJkIG9mIFtiYXR0bGVKc29uLlVzZXJCb2FyZCwgYmF0dGxlSnNvbi5PcHBvbmVudEJvYXJkXSkge1xuICAgIGNvbnN0IGl0ZW1zID0gYm9hcmQ/Lk1pbnM/Lkl0ZW1zID8/IFtdO1xuICAgIGZvciAoY29uc3QgcGV0IG9mIGl0ZW1zKSB7XG4gICAgICBpZiAoIXBldCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBldElkID0gdG9SZXBsYXlJZChwZXQuRW51KTtcbiAgICAgIGNvbnN0IGVudGl0eUtleSA9IGdldFJlcGxheUVudGl0eUtleShwZXRbJ0lkJ10pO1xuICAgICAgaWYgKHBldElkICYmIGVudGl0eUtleSkge1xuICAgICAgICBwZXRJZEJ5RW50aXR5S2V5LnNldChlbnRpdHlLZXksIHBldElkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBldElkQnlFbnRpdHlLZXk7XG59XG5cbmZ1bmN0aW9uIGdldFJlcGxheVNwZWxsUGVya1RhcmdldChcbiAgYWN0aW9uOiBSZXBsYXlBY3Rpb25Kc29uLFxuKTogeyBwZXJrTmFtZTogc3RyaW5nOyB0YXJnZXRLZXk6IHN0cmluZyB9IHwgbnVsbCB7XG4gIGlmIChhY3Rpb24uVHlwZSAhPT0gOCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhc1JlY29yZChwYXJzZUpzb25WYWx1ZShhY3Rpb24uUmVzcG9uc2UpKTtcbiAgY29uc3QgcmVzcG9uc2VFdmVudCA9IGFzUmVjb3JkKHJlc3BvbnNlPy5bJ0V2ZW50J10pO1xuICBjb25zdCBldmVudCA9IGFzUmVjb3JkKHJlc3BvbnNlRXZlbnQ/LlsnRXZlbnQnXSkgPz8gcmVzcG9uc2VFdmVudDtcbiAgY29uc3Qgc3BlbGwgPSBhc1JlY29yZChldmVudD8uWydTcGVsbCddKTtcbiAgY29uc3QgdGFyZ2V0ID0gYXNSZWNvcmQoZXZlbnQ/LlsnVGFyZ2V0J10pO1xuICBjb25zdCBzcGVsbElkID0gdG9SZXBsYXlJZChzcGVsbD8uWydFbnUnXSk7XG4gIGNvbnN0IHBlcmtOYW1lID0gc3BlbGxJZFxuICAgID8gUkVQTEFZX1BFUktfRk9PRF9OQU1FU19CWV9TUEVMTF9JRC5nZXQoc3BlbGxJZClcbiAgICA6IHVuZGVmaW5lZDtcbiAgY29uc3QgdGFyZ2V0S2V5ID0gZ2V0UmVwbGF5RW50aXR5S2V5KHRhcmdldCk7XG5cbiAgcmV0dXJuIHBlcmtOYW1lICYmIHRhcmdldEtleSA/IHsgcGVya05hbWUsIHRhcmdldEtleSB9IDogbnVsbDtcbn1cblxuZnVuY3Rpb24gcGFyc2VCYXR0bGVBY3Rpb24ocmF3OiB1bmtub3duKTogUmVwbGF5QmF0dGxlSnNvbiB8IG51bGwge1xuICBjb25zdCBwYXJzZWQgPSBwYXJzZUpzb25WYWx1ZShyYXcpO1xuICBpZiAoIWlzUmVjb3JkKHBhcnNlZCkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gcGFyc2VkIGFzIFJlcGxheUJhdHRsZUpzb247XG59XG5cbmZ1bmN0aW9uIGJ1aWxkUGFja0lkQnlOYW1lTG9va3VwKCk6IE1hcDxzdHJpbmcsIG51bWJlcj4ge1xuICBjb25zdCBsb29rdXAgPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpO1xuICBPYmplY3QuZW50cmllcyhQQUNLX01BUCkuZm9yRWFjaCgoW3BhY2tJZFJhdywgcGFja05hbWVdKSA9PiB7XG4gICAgaWYgKHR5cGVvZiBwYWNrTmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgcGFja0lkID0gTnVtYmVyKHBhY2tJZFJhdyk7XG4gICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUocGFja0lkKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsb29rdXAuc2V0KHBhY2tOYW1lLnRvTG93ZXJDYXNlKCksIHBhY2tJZCk7XG4gIH0pO1xuICByZXR1cm4gbG9va3VwO1xufVxuXG5jb25zdCBQQUNLX0lEX0JZX05BTUUgPSBidWlsZFBhY2tJZEJ5TmFtZUxvb2t1cCgpO1xuXG5mdW5jdGlvbiByZXNvbHZlUGFja0lkRnJvbVVua25vd24odmFsdWU6IHVua25vd24pOiBudW1iZXIgfCBudWxsIHtcbiAgY29uc3QgbnVtZXJpYyA9IHRvRmluaXRlTnVtYmVyKHZhbHVlKTtcbiAgaWYgKG51bWVyaWMgIT09IG51bGwpIHtcbiAgICByZXR1cm4gbnVtZXJpYztcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIGNvbnN0IGJ5TmFtZSA9IFBBQ0tfSURfQllfTkFNRS5nZXQodmFsdWUudG9Mb3dlckNhc2UoKSk7XG4gICAgaWYgKGJ5TmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gYnlOYW1lO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gcGFyc2VUdXJuUGV0VG9SZXBsYXlQZXQoXG4gIHJhd1BldDogUmVwbGF5Qm90VHVyblBldEpzb24gfCBudWxsIHwgdW5kZWZpbmVkLFxuKTogUmVwbGF5UGV0SnNvbiB8IG51bGwge1xuICBpZiAoIXJhd1BldCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgcGV0SWQgPSB0b1JlcGxheUlkKHJhd1BldC5pZCk7XG4gIGlmICghcGV0SWQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IHNsb3QgPSB0b0Zpbml0ZU51bWJlcihyYXdQZXQuc2xvdCk7XG4gIGNvbnN0IGFiaWxpdGllcyA9IChyYXdQZXQuYWJpbGl0aWVzID8/IFtdKVxuICAgIC5tYXAoKGFiaWxpdHkpOiBSZXBsYXlBYmlsaXR5SnNvbiB8IG51bGwgPT4ge1xuICAgICAgY29uc3QgYWJpbGl0eUlkID0gdG9SZXBsYXlJZChhYmlsaXR5Py5pZCk7XG4gICAgICBpZiAoIWFiaWxpdHlJZCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIEVudTogYWJpbGl0eUlkLFxuICAgICAgICBMdmw6IHRvRmluaXRlTnVtYmVyKGFiaWxpdHk/LmxldmVsKSxcbiAgICAgICAgR3JvcDogdG9GaW5pdGVOdW1iZXIoYWJpbGl0eT8uZ3JvdXApLFxuICAgICAgICBUckNvOiB0b0Zpbml0ZU51bWJlcihhYmlsaXR5Py50cmlnZ2Vyc0NvbnN1bWVkKSxcbiAgICAgIH07XG4gICAgfSlcbiAgICAuZmlsdGVyKChhYmlsaXR5KTogYWJpbGl0eSBpcyBSZXBsYXlBYmlsaXR5SnNvbiA9PiBhYmlsaXR5ICE9PSBudWxsKTtcblxuICByZXR1cm4ge1xuICAgIEVudTogcGV0SWQsXG4gICAgTHZsOiB0b0Zpbml0ZU51bWJlcihyYXdQZXQubGV2ZWwpLFxuICAgIEV4cDogdG9GaW5pdGVOdW1iZXIocmF3UGV0LmV4cGVyaWVuY2UpLFxuICAgIFBlcms6IHRvUmVwbGF5SWQocmF3UGV0LnBlcmtJZCksXG4gICAgTWFuYTogdG9GaW5pdGVOdW1iZXIocmF3UGV0Lm1hbmEpLFxuICAgIEF0OiB7XG4gICAgICBQZXJtOiB0b0Zpbml0ZU51bWJlcihyYXdQZXQuYXR0YWNrPy5wZXJtYW5lbnQpLFxuICAgICAgVGVtcDogdG9GaW5pdGVOdW1iZXIocmF3UGV0LmF0dGFjaz8udGVtcG9yYXJ5KSxcbiAgICB9LFxuICAgIEhwOiB7XG4gICAgICBQZXJtOiB0b0Zpbml0ZU51bWJlcihyYXdQZXQuaGVhbHRoPy5wZXJtYW5lbnQpLFxuICAgICAgVGVtcDogdG9GaW5pdGVOdW1iZXIocmF3UGV0LmhlYWx0aD8udGVtcG9yYXJ5KSxcbiAgICB9LFxuICAgIFBvaToge1xuICAgICAgeDogc2xvdCxcbiAgICB9LFxuICAgIEFiaWw6IGFiaWxpdGllcyxcbiAgfTtcbn1cblxuZnVuY3Rpb24gcGFyc2VUdXJuU2lkZVRvUmVwbGF5Qm9hcmQoXG4gIHNpZGU6IFJlcGxheUJvdFR1cm5TaWRlSnNvbiB8IG51bGwgfCB1bmRlZmluZWQsXG4gIGZhbGxiYWNrVHVybjogbnVtYmVyLFxuICBwYWNrUmF3PzogdW5rbm93bixcbik6IFJlcGxheUJvYXJkSnNvbiB7XG4gIHJldHVybiB7XG4gICAgVHVyOiB0b051bWJlck9yRmFsbGJhY2soc2lkZT8uc3RhdHM/LnR1cm4sIGZhbGxiYWNrVHVybiksXG4gICAgR29TcDogdG9OdW1iZXJPckZhbGxiYWNrKHNpZGU/LnN0YXRzPy5nb2xkU3BlbnQsIDApLFxuICAgIFJvbGQ6IHRvTnVtYmVyT3JGYWxsYmFjayhzaWRlPy5zdGF0cz8ucm9sbHMsIDApLFxuICAgIE1pU3U6IHRvTnVtYmVyT3JGYWxsYmFjayhzaWRlPy5zdGF0cz8uc3VtbW9ucywgMCksXG4gICAgTVNGTDogdG9OdW1iZXJPckZhbGxiYWNrKHNpZGU/LnN0YXRzPy5sZXZlbDNTb2xkLCAwKSxcbiAgICBUclRUOiB0b051bWJlck9yRmFsbGJhY2soc2lkZT8uc3RhdHM/LnRyYW5zZm9ybWVkLCAwKSxcbiAgICBQYWNrOiByZXNvbHZlUGFja0lkRnJvbVVua25vd24ocGFja1JhdyksXG4gICAgTWluczoge1xuICAgICAgSXRlbXM6IChzaWRlPy5wZXRzID8/IFtdKS5tYXAoKHBldCkgPT4gcGFyc2VUdXJuUGV0VG9SZXBsYXlQZXQocGV0KSksXG4gICAgfSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0UmVwbGF5QmF0dGxlRnJvbVR1cm5zKFxuICB0dXJuczogUmVhZG9ubHlBcnJheTxSZXBsYXlCb3RUdXJuSnNvbj4gfCBudWxsIHwgdW5kZWZpbmVkLFxuICB0dXJuTnVtYmVyOiBudW1iZXIsXG4gIHJlcGxheU1ldGE/OiBSZXBsYXlCb3RSZXBsYXlNZXRhSnNvbiB8IG51bGwsXG4pOiBSZXBsYXlCYXR0bGVKc29uIHwgbnVsbCB7XG4gIGlmICghTnVtYmVyLmlzRmluaXRlKHR1cm5OdW1iZXIpIHx8IHR1cm5OdW1iZXIgPD0gMCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgdHVybkVudHJ5ID1cbiAgICAodHVybnMgPz8gW10pLmZpbmQoKGVudHJ5KSA9PiBOdW1iZXIoZW50cnk/LnR1cm4pID09PSB0dXJuTnVtYmVyKSA/P1xuICAgICh0dXJucyA/PyBbXSlbdHVybk51bWJlciAtIDFdID8/XG4gICAgbnVsbDtcbiAgaWYgKCF0dXJuRW50cnkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGZhbGxiYWNrVHVybiA9IHRvTnVtYmVyT3JGYWxsYmFjayh0dXJuRW50cnkudHVybiwgdHVybk51bWJlcik7XG4gIHJldHVybiB7XG4gICAgVXNlckJvYXJkOiBwYXJzZVR1cm5TaWRlVG9SZXBsYXlCb2FyZChcbiAgICAgIHR1cm5FbnRyeS51c2VyLFxuICAgICAgZmFsbGJhY2tUdXJuLFxuICAgICAgcmVwbGF5TWV0YT8ucGFjayxcbiAgICApLFxuICAgIE9wcG9uZW50Qm9hcmQ6IHBhcnNlVHVyblNpZGVUb1JlcGxheUJvYXJkKFxuICAgICAgdHVybkVudHJ5Lm9wcG9uZW50LFxuICAgICAgZmFsbGJhY2tUdXJuLFxuICAgICAgcmVwbGF5TWV0YT8ub3Bwb25lbnRfcGFjayxcbiAgICApLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0UmVwbGF5QmF0dGxlRnJvbUFjdGlvbnMoXG4gIGFjdGlvbnM6IFJlYWRvbmx5QXJyYXk8UmVwbGF5QWN0aW9uSnNvbj4gfCBudWxsIHwgdW5kZWZpbmVkLFxuICB0dXJuTnVtYmVyOiBudW1iZXIsXG4pOiBSZXBsYXlCYXR0bGVKc29uIHwgbnVsbCB7XG4gIGlmICghTnVtYmVyLmlzRmluaXRlKHR1cm5OdW1iZXIpIHx8IHR1cm5OdW1iZXIgPD0gMCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgYmF0dGxlQWN0aW9ucyA9IChhY3Rpb25zID8/IFtdKS5maWx0ZXIoXG4gICAgKGFjdGlvbikgPT5cbiAgICAgIEJvb2xlYW4oYWN0aW9uPy5CYXR0bGUpICYmXG4gICAgICAoYWN0aW9uPy5UeXBlID09PSAwIHx8IGFjdGlvbj8uVHlwZSA9PT0gbnVsbCB8fCBhY3Rpb24/LlR5cGUgPT09IHVuZGVmaW5lZCksXG4gICk7XG5cbiAgY29uc3QgYWN0aW9uRm9yVHVybiA9XG4gICAgYmF0dGxlQWN0aW9ucy5maW5kKChhY3Rpb24pID0+IE51bWJlcihhY3Rpb24/LlR1cm4pID09PSB0dXJuTnVtYmVyKSA/P1xuICAgIGJhdHRsZUFjdGlvbnNbdHVybk51bWJlciAtIDFdID8/XG4gICAgbnVsbDtcblxuICByZXR1cm4gcGFyc2VCYXR0bGVBY3Rpb24oYWN0aW9uRm9yVHVybj8uQmF0dGxlID8/IG51bGwpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRSZXBsYXlBYmlsaXR5UGV0TWFwRnJvbUFjdGlvbnMoXG4gIGFjdGlvbnM6IFJlYWRvbmx5QXJyYXk8UmVwbGF5QWN0aW9uSnNvbj4gfCBudWxsIHwgdW5kZWZpbmVkLFxuKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB7XG4gIGNvbnN0IGFiaWxpdHlPd25lckNvdW50czogQWJpbGl0eU93bmVyQ291bnRzID0gbmV3IE1hcCgpO1xuICAoYWN0aW9ucyA/PyBbXSkuZm9yRWFjaCgoYWN0aW9uKSA9PiB7XG4gICAgY29uc3QgcGFyc2VkQnVpbGQgPSBwYXJzZUpzb25WYWx1ZShhY3Rpb24/LkJ1aWxkKTtcbiAgICBjb25zdCBwYXJzZWRCYXR0bGUgPSBwYXJzZUpzb25WYWx1ZShhY3Rpb24/LkJhdHRsZSk7XG4gICAgY29uc3QgcGFyc2VkTW9kZSA9IHBhcnNlSnNvblZhbHVlKGFjdGlvbj8uTW9kZSk7XG4gICAgY29sbGVjdEFiaWxpdHlPd25lckNvdW50cyhwYXJzZWRCdWlsZCwgYWJpbGl0eU93bmVyQ291bnRzKTtcbiAgICBjb2xsZWN0QWJpbGl0eU93bmVyQ291bnRzKHBhcnNlZEJhdHRsZSwgYWJpbGl0eU93bmVyQ291bnRzKTtcbiAgICBjb2xsZWN0QWJpbGl0eU93bmVyQ291bnRzKHBhcnNlZE1vZGUsIGFiaWxpdHlPd25lckNvdW50cyk7XG4gIH0pO1xuICByZXR1cm4gYnVpbGRSZXBsYXlBYmlsaXR5UGV0TWFwRnJvbUNvdW50cyhhYmlsaXR5T3duZXJDb3VudHMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRSZXBsYXlQZXJrTmFtZUJ5UGV0SWRGcm9tQWN0aW9ucyhcbiAgYWN0aW9uczogUmVhZG9ubHlBcnJheTxSZXBsYXlBY3Rpb25Kc29uPiB8IG51bGwgfCB1bmRlZmluZWQsXG4gIHR1cm5OdW1iZXI6IG51bWJlcixcbik6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4ge1xuICBjb25zdCBiYXR0bGVKc29uID0gc2VsZWN0UmVwbGF5QmF0dGxlRnJvbUFjdGlvbnMoYWN0aW9ucywgdHVybk51bWJlcik7XG4gIGlmICghYmF0dGxlSnNvbikge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIGNvbnN0IHBldElkQnlFbnRpdHlLZXkgPSBidWlsZFJlcGxheVBldElkQnlFbnRpdHlLZXkoYmF0dGxlSnNvbik7XG4gIGNvbnN0IHBlcmtOYW1lQnlQZXRJZDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuXG4gIChhY3Rpb25zID8/IFtdKS5mb3JFYWNoKChhY3Rpb24pID0+IHtcbiAgICBjb25zdCBhY3Rpb25UdXJuID0gdG9GaW5pdGVOdW1iZXIoYWN0aW9uLlR1cm4pO1xuICAgIGlmIChhY3Rpb25UdXJuICE9PSBudWxsICYmIGFjdGlvblR1cm4gPiB0dXJuTnVtYmVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc3BlbGxQZXJrVGFyZ2V0ID0gZ2V0UmVwbGF5U3BlbGxQZXJrVGFyZ2V0KGFjdGlvbik7XG4gICAgaWYgKCFzcGVsbFBlcmtUYXJnZXQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwZXRJZCA9IHBldElkQnlFbnRpdHlLZXkuZ2V0KHNwZWxsUGVya1RhcmdldC50YXJnZXRLZXkpO1xuICAgIGlmIChwZXRJZCkge1xuICAgICAgcGVya05hbWVCeVBldElkW3BldElkXSA9IHNwZWxsUGVya1RhcmdldC5wZXJrTmFtZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBwZXJrTmFtZUJ5UGV0SWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVJlcGxheUZvckNhbGN1bGF0b3JGcm9tQWN0aW9ucyhcbiAgYWN0aW9uczogUmVhZG9ubHlBcnJheTxSZXBsYXlBY3Rpb25Kc29uPiB8IG51bGwgfCB1bmRlZmluZWQsXG4gIHR1cm5OdW1iZXI6IG51bWJlcixcbiAgYnVpbGRNb2RlbD86IFJlcGxheUJ1aWxkTW9kZWxKc29uIHwgbnVsbCxcbiAgbWV0YUJvYXJkcz86IFJlcGxheU1ldGFCb2FyZHMsXG4gIG9wdGlvbnM/OiBSZXBsYXlQYXJzZU9wdGlvbnMsXG4pOiBSZXBsYXlDYWxjdWxhdG9yU3RhdGUgfCBudWxsIHtcbiAgY29uc3QgYmF0dGxlSnNvbiA9IHNlbGVjdFJlcGxheUJhdHRsZUZyb21BY3Rpb25zKGFjdGlvbnMsIHR1cm5OdW1iZXIpO1xuICBpZiAoIWJhdHRsZUpzb24pIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGluZmVycmVkQWJpbGl0eVBldE1hcCA9IGJ1aWxkUmVwbGF5QWJpbGl0eVBldE1hcEZyb21BY3Rpb25zKGFjdGlvbnMpO1xuICBjb25zdCBtZXJnZWRBYmlsaXR5UGV0TWFwID0ge1xuICAgIC4uLmluZmVycmVkQWJpbGl0eVBldE1hcCxcbiAgICAuLi4ob3B0aW9ucz8uYWJpbGl0eVBldE1hcCA/PyB7fSksXG4gIH07XG4gIGNvbnN0IGluZmVycmVkUGVya05hbWVCeVBldElkID0gYnVpbGRSZXBsYXlQZXJrTmFtZUJ5UGV0SWRGcm9tQWN0aW9ucyhcbiAgICBhY3Rpb25zLFxuICAgIHR1cm5OdW1iZXIsXG4gICk7XG4gIGNvbnN0IG1lcmdlZFBlcmtOYW1lQnlQZXRJZCA9IHtcbiAgICAuLi5pbmZlcnJlZFBlcmtOYW1lQnlQZXRJZCxcbiAgICAuLi4ob3B0aW9ucz8ucGVya05hbWVCeVBldElkID8/IHt9KSxcbiAgfTtcblxuICBjb25zdCBwYXJzZXIgPSBuZXcgUmVwbGF5Q2FsY1BhcnNlcigpO1xuICByZXR1cm4gcGFyc2VyLnBhcnNlUmVwbGF5Rm9yQ2FsY3VsYXRvcihcbiAgICBiYXR0bGVKc29uLFxuICAgIGJ1aWxkTW9kZWwgPz8gdW5kZWZpbmVkLFxuICAgIG1ldGFCb2FyZHMsXG4gICAge1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIGFiaWxpdHlQZXRNYXA6IG1lcmdlZEFiaWxpdHlQZXRNYXAsXG4gICAgICBwZXJrTmFtZUJ5UGV0SWQ6IG1lcmdlZFBlcmtOYW1lQnlQZXRJZCxcbiAgICB9LFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VUZWFtd29vZFJlcGxheUZvckNhbGN1bGF0b3IoXG4gIHJlcGxheTpcbiAgICB8IFJlcGxheUFjdGlvbnNDb250YWluZXJKc29uXG4gICAgfCBSZXBsYXlCb3RUdXJuc0NvbnRhaW5lckpzb25cbiAgICB8IG51bGxcbiAgICB8IHVuZGVmaW5lZCxcbiAgdHVybk51bWJlcjogbnVtYmVyLFxuICBtZXRhQm9hcmRzPzogUmVwbGF5TWV0YUJvYXJkcyxcbiAgb3B0aW9ucz86IFJlcGxheVBhcnNlT3B0aW9ucyxcbik6IFJlcGxheUNhbGN1bGF0b3JTdGF0ZSB8IG51bGwge1xuICBjb25zdCByZXBsYXlSZWNvcmQgPSBhc1JlY29yZChyZXBsYXkpO1xuICBjb25zdCBoYXNUdXJuUGF5bG9hZCA9IEFycmF5LmlzQXJyYXkocmVwbGF5UmVjb3JkPy5bJ3R1cm5zJ10pO1xuICBpZiAoaGFzVHVyblBheWxvYWQpIHtcbiAgICBjb25zdCB0dXJuc1JlcGxheSA9IHJlcGxheSBhcyBSZXBsYXlCb3RUdXJuc0NvbnRhaW5lckpzb247XG4gICAgY29uc3QgYmF0dGxlSnNvbiA9IHNlbGVjdFJlcGxheUJhdHRsZUZyb21UdXJucyhcbiAgICAgIHR1cm5zUmVwbGF5LnR1cm5zLFxuICAgICAgdHVybk51bWJlcixcbiAgICAgIHR1cm5zUmVwbGF5LnJlcGxheU1ldGEsXG4gICAgKTtcbiAgICBpZiAoIWJhdHRsZUpzb24pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBtZXJnZWRBYmlsaXR5UGV0TWFwID0ge1xuICAgICAgLi4uKHR1cm5zUmVwbGF5LmFiaWxpdHlQZXRNYXAgPz8ge30pLFxuICAgICAgLi4uKG9wdGlvbnM/LmFiaWxpdHlQZXRNYXAgPz8ge30pLFxuICAgIH07XG4gICAgY29uc3QgcGFyc2VyID0gbmV3IFJlcGxheUNhbGNQYXJzZXIoKTtcbiAgICByZXR1cm4gcGFyc2VyLnBhcnNlUmVwbGF5Rm9yQ2FsY3VsYXRvcihcbiAgICAgIGJhdHRsZUpzb24sXG4gICAgICB0dXJuc1JlcGxheS5nZW5lc2lzQnVpbGRNb2RlbCA/PyB1bmRlZmluZWQsXG4gICAgICBtZXRhQm9hcmRzLFxuICAgICAge1xuICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICBhYmlsaXR5UGV0TWFwOiBtZXJnZWRBYmlsaXR5UGV0TWFwLFxuICAgICAgfSxcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIHBhcnNlUmVwbGF5Rm9yQ2FsY3VsYXRvckZyb21BY3Rpb25zKFxuICAgIChyZXBsYXkgYXMgUmVwbGF5QWN0aW9uc0NvbnRhaW5lckpzb24gfCBudWxsIHwgdW5kZWZpbmVkKT8uQWN0aW9ucyxcbiAgICB0dXJuTnVtYmVyLFxuICAgIChyZXBsYXkgYXMgUmVwbGF5QWN0aW9uc0NvbnRhaW5lckpzb24gfCBudWxsIHwgdW5kZWZpbmVkKT8uR2VuZXNpc0J1aWxkTW9kZWwgPz9cbiAgICAgIHVuZGVmaW5lZCxcbiAgICBtZXRhQm9hcmRzLFxuICAgIG9wdGlvbnMsXG4gICk7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRBYm9taW5hdGlvblN3YWxsb3dlZFN0YXRlKCk6IEFib21pbmF0aW9uU3dhbGxvd2VkU3RhdGUge1xuICByZXR1cm4ge1xuICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MTogbnVsbCxcbiAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDI6IG51bGwsXG4gICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzOiBudWxsLFxuICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MUJlbHVnYVN3YWxsb3dlZFBldDogbnVsbCxcbiAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDJCZWx1Z2FTd2FsbG93ZWRQZXQ6IG51bGwsXG4gICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzQmVsdWdhU3dhbGxvd2VkUGV0OiBudWxsLFxuICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MVNhcmNhc3RpY0ZyaW5nZWhlYWRTd2FsbG93ZWRQZXQ6IG51bGwsXG4gICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQyU2FyY2FzdGljRnJpbmdlaGVhZFN3YWxsb3dlZFBldDogbnVsbCxcbiAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDNTYXJjYXN0aWNGcmluZ2VoZWFkU3dhbGxvd2VkUGV0OiBudWxsLFxuICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MVRpbWVzSHVydDogMCxcbiAgICBhYm9taW5hdGlvblN3YWxsb3dlZFBldDJUaW1lc0h1cnQ6IDAsXG4gICAgYWJvbWluYXRpb25Td2FsbG93ZWRQZXQzVGltZXNIdXJ0OiAwLFxuICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MUxldmVsOiAxLFxuICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0MkxldmVsOiAxLFxuICAgIGFib21pbmF0aW9uU3dhbGxvd2VkUGV0M0xldmVsOiAxLFxuICB9O1xufVxuXG5leHBvcnQgY2xhc3MgUmVwbGF5Q2FsY1BhcnNlciB7XG4gIHBhcnNlUmVwbGF5Rm9yQ2FsY3VsYXRvcihcbiAgICBiYXR0bGVKc29uOiBSZXBsYXlCYXR0bGVKc29uLFxuICAgIGJ1aWxkTW9kZWw/OiBSZXBsYXlCdWlsZE1vZGVsSnNvbixcbiAgICBtZXRhQm9hcmRzPzogUmVwbGF5TWV0YUJvYXJkcyxcbiAgICBvcHRpb25zPzogUmVwbGF5UGFyc2VPcHRpb25zLFxuICApOiBSZXBsYXlDYWxjdWxhdG9yU3RhdGUge1xuICAgIGNvbnNvbGUubG9nKGBbUmVwbGF5Q2FsY1BhcnNlcl0gUEVUU19CWV9JRCBzaXplOiAke1BFVFNfQllfSUQuc2l6ZX1gKTtcbiAgICBjb25zdCB1c2VyQm9hcmQgPSBiYXR0bGVKc29uPy5Vc2VyQm9hcmQgPz8gbWV0YUJvYXJkcz8udXNlckJvYXJkO1xuICAgIGNvbnN0IG9wcG9uZW50Qm9hcmQgPSBiYXR0bGVKc29uPy5PcHBvbmVudEJvYXJkID8/IG1ldGFCb2FyZHM/Lm9wcG9uZW50Qm9hcmQ7XG5cbiAgICBjb25zdCByZWFkQm9hcmROdW1iZXIgPSAoXG4gICAgICBib2FyZDogUmVwbGF5Qm9hcmRKc29uIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgICAgIGtleTogc3RyaW5nLFxuICAgICAgZmFsbGJhY2s6IG51bWJlcixcbiAgICApOiBudW1iZXIgPT4ge1xuICAgICAgcmV0dXJuIHRvTnVtYmVyT3JGYWxsYmFjayhib2FyZD8uW2tleV0sIGZhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgY29uc3QgYWJpbGl0eVBldE5hbWVCeUFiaWxpdHlJZCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gICAgY29uc3QgYWJpbGl0eVBldElkQnlBYmlsaXR5SWQgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICAgIGNvbnN0IGFwcGx5QWJpbGl0eVBldE1hcCA9IChcbiAgICAgIGFiaWxpdHlQZXRNYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IG51bWJlcj4gfCBudWxsIHwgdW5kZWZpbmVkLFxuICAgICk6IHZvaWQgPT4ge1xuICAgICAgaWYgKCFhYmlsaXR5UGV0TWFwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIE9iamVjdC5lbnRyaWVzKGFiaWxpdHlQZXRNYXApLmZvckVhY2goKFthYmlsaXR5SWRSYXcsIHBldElkT3JOYW1lXSkgPT4ge1xuICAgICAgICBjb25zdCBhYmlsaXR5SWQgPSB0b1JlcGxheUlkKGFiaWxpdHlJZFJhdyk7XG4gICAgICAgIGlmICghYWJpbGl0eUlkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBtYXBwZWRQZXRJZCA9XG4gICAgICAgICAgdHlwZW9mIHBldElkT3JOYW1lID09PSAnbnVtYmVyJyB8fCB0eXBlb2YgcGV0SWRPck5hbWUgPT09ICdzdHJpbmcnXG4gICAgICAgICAgICA/IFN0cmluZyhwZXRJZE9yTmFtZSlcbiAgICAgICAgICAgIDogbnVsbDtcblxuICAgICAgICAvLyBJZiB0aGUgbWFwcGVkIHBldCBpZCBpcyBudW1lcmljIGJ1dCBub3QgZm91bmQgaW4gUEVUU19CWV9JRCxcbiAgICAgICAgLy8gdHJ5IGEgbGVnYWN5IG9mZnNldCBmYWxsYmFjayAocGV0IGlkIC0gMzApIHdoaWNoIHNvbWUgYmFja2VuZHNcbiAgICAgICAgLy8gZW1pdC4gVGhpcyBlbnN1cmVzIGFiaWxpdHktPnBldCBtYXBwaW5ncyB1c2luZyB0aGUgLTMwIHNjaGVtZVxuICAgICAgICAvLyBzdGlsbCByZXNvbHZlIHRvIGtub3duIHBldCBpZHMuXG4gICAgICAgIGlmIChtYXBwZWRQZXRJZCAmJiAhUEVUU19CWV9JRC5oYXMobWFwcGVkUGV0SWQpKSB7XG4gICAgICAgICAgY29uc3QgYXNOdW0gPSBOdW1iZXIobWFwcGVkUGV0SWQpO1xuICAgICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKGFzTnVtKSkge1xuICAgICAgICAgICAgY29uc3QgZmFsbGJhY2tOdW0gPSBhc051bSAtIDMwO1xuICAgICAgICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIoZmFsbGJhY2tOdW0pICYmIGZhbGxiYWNrTnVtID4gMCkge1xuICAgICAgICAgICAgICBjb25zdCBmYWxsYmFja0lkID0gU3RyaW5nKGZhbGxiYWNrTnVtKTtcbiAgICAgICAgICAgICAgaWYgKFBFVFNfQllfSUQuaGFzKGZhbGxiYWNrSWQpKSB7XG4gICAgICAgICAgICAgICAgbWFwcGVkUGV0SWQgPSBmYWxsYmFja0lkO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWFwcGVkUGV0TmFtZSA9XG4gICAgICAgICAgKG1hcHBlZFBldElkID8gUEVUU19CWV9JRC5nZXQobWFwcGVkUGV0SWQpIDogbnVsbCkgfHxcbiAgICAgICAgICAodHlwZW9mIHBldElkT3JOYW1lID09PSAnc3RyaW5nJyA/IHBldElkT3JOYW1lIDogbnVsbCk7XG5cbiAgICAgICAgaWYgKG1hcHBlZFBldE5hbWUpIHtcbiAgICAgICAgICBhYmlsaXR5UGV0TmFtZUJ5QWJpbGl0eUlkLnNldChhYmlsaXR5SWQsIG1hcHBlZFBldE5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXBwZWRQZXRJZCAmJiBQRVRTX0JZX0lELmhhcyhtYXBwZWRQZXRJZCkpIHtcbiAgICAgICAgICBhYmlsaXR5UGV0SWRCeUFiaWxpdHlJZC5zZXQoYWJpbGl0eUlkLCBtYXBwZWRQZXRJZCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBjb25zdCBpbmZlcnJlZEFiaWxpdHlPd25lckNvdW50czogQWJpbGl0eU93bmVyQ291bnRzID0gbmV3IE1hcCgpO1xuICAgIGNvbGxlY3RBYmlsaXR5T3duZXJDb3VudHMoYmF0dGxlSnNvbiwgaW5mZXJyZWRBYmlsaXR5T3duZXJDb3VudHMpO1xuICAgIGNvbGxlY3RBYmlsaXR5T3duZXJDb3VudHMoYnVpbGRNb2RlbCwgaW5mZXJyZWRBYmlsaXR5T3duZXJDb3VudHMpO1xuICAgIGNvbGxlY3RBYmlsaXR5T3duZXJDb3VudHMobWV0YUJvYXJkcywgaW5mZXJyZWRBYmlsaXR5T3duZXJDb3VudHMpO1xuICAgIGFwcGx5QWJpbGl0eVBldE1hcChcbiAgICAgIGJ1aWxkUmVwbGF5QWJpbGl0eVBldE1hcEZyb21Db3VudHMoaW5mZXJyZWRBYmlsaXR5T3duZXJDb3VudHMpLFxuICAgICk7XG4gICAgYXBwbHlBYmlsaXR5UGV0TWFwKG9wdGlvbnM/LmFiaWxpdHlQZXRNYXAgPz8gbnVsbCk7XG5cbiAgICBjb25zdCByZXNvbHZlQWJpbGl0eU93bmVyUGV0TmFtZUJ5TmVhcmJ5TWFwID0gKFxuICAgICAgYWJpbGl0eUlkOiBzdHJpbmcsXG4gICAgKTogc3RyaW5nIHwgbnVsbCA9PiB7XG4gICAgICBjb25zdCBwYXJzZWRBYmlsaXR5SWQgPSBOdW1iZXIoYWJpbGl0eUlkKTtcbiAgICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcihwYXJzZWRBYmlsaXR5SWQpKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBvZmZzZXRDb3VudHMgPSBuZXcgTWFwPG51bWJlciwgbnVtYmVyPigpO1xuICAgICAgZm9yIChjb25zdCBbbWFwcGVkQWJpbGl0eUlkLCBtYXBwZWRQZXRJZF0gb2YgYWJpbGl0eVBldElkQnlBYmlsaXR5SWQuZW50cmllcygpKSB7XG4gICAgICAgIGNvbnN0IHBhcnNlZE1hcHBlZEFiaWxpdHlJZCA9IE51bWJlcihtYXBwZWRBYmlsaXR5SWQpO1xuICAgICAgICBjb25zdCBwYXJzZWRNYXBwZWRQZXRJZCA9IE51bWJlcihtYXBwZWRQZXRJZCk7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAhTnVtYmVyLmlzSW50ZWdlcihwYXJzZWRNYXBwZWRBYmlsaXR5SWQpIHx8XG4gICAgICAgICAgIU51bWJlci5pc0ludGVnZXIocGFyc2VkTWFwcGVkUGV0SWQpXG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLmFicyhwYXJzZWRNYXBwZWRBYmlsaXR5SWQgLSBwYXJzZWRBYmlsaXR5SWQpO1xuICAgICAgICBpZiAoZGlzdGFuY2UgPT09IDAgfHwgZGlzdGFuY2UgPiAyKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvZmZzZXQgPSBwYXJzZWRNYXBwZWRBYmlsaXR5SWQgLSBwYXJzZWRNYXBwZWRQZXRJZDtcbiAgICAgICAgb2Zmc2V0Q291bnRzLnNldChvZmZzZXQsIChvZmZzZXRDb3VudHMuZ2V0KG9mZnNldCkgPz8gMCkgKyAxKTtcbiAgICAgIH1cblxuICAgICAgbGV0IGJlc3RPZmZzZXQ6IG51bWJlciB8IG51bGwgPSBudWxsO1xuICAgICAgbGV0IGJlc3RPZmZzZXRDb3VudCA9IDA7XG4gICAgICBmb3IgKGNvbnN0IFtvZmZzZXQsIGNvdW50XSBvZiBvZmZzZXRDb3VudHMuZW50cmllcygpKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBjb3VudCA+IGJlc3RPZmZzZXRDb3VudCB8fFxuICAgICAgICAgIChjb3VudCA9PT0gYmVzdE9mZnNldENvdW50ICYmXG4gICAgICAgICAgICAoYmVzdE9mZnNldCA9PT0gbnVsbCB8fCBNYXRoLmFicyhvZmZzZXQpIDwgTWF0aC5hYnMoYmVzdE9mZnNldCkpKVxuICAgICAgICApIHtcbiAgICAgICAgICBiZXN0T2Zmc2V0ID0gb2Zmc2V0O1xuICAgICAgICAgIGJlc3RPZmZzZXRDb3VudCA9IGNvdW50O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChiZXN0T2Zmc2V0ID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpbmZlcnJlZFBldElkID0gU3RyaW5nKHBhcnNlZEFiaWxpdHlJZCAtIGJlc3RPZmZzZXQpO1xuICAgICAgcmV0dXJuIFBFVFNfQllfSUQuZ2V0KGluZmVycmVkUGV0SWQpID8/IG51bGw7XG4gICAgfTtcblxuICAgIGNvbnN0IHJlc29sdmVBYmlsaXR5T3duZXJQZXROYW1lID0gKGFiaWxpdHlJZDogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCA9PiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBhYmlsaXR5UGV0TmFtZUJ5QWJpbGl0eUlkLmdldChhYmlsaXR5SWQpID8/XG4gICAgICAgIHJlc29sdmVBYmlsaXR5T3duZXJQZXROYW1lQnlOZWFyYnlNYXAoYWJpbGl0eUlkKVxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgY29uc3QgZ2V0VGltZXNIdXJ0ID0gKHBldEpzb246IFJlcGxheVBldEpzb24pOiBudW1iZXIgfCBudWxsID0+IHtcbiAgICAgIHJldHVybiBnZXRUaW1lc0h1cnRGcm9tUmF3UGV0KHBldEpzb24pO1xuICAgIH07XG5cbiAgICBjb25zdCBpbmZlckNvcGllZFBldE5hbWUgPSAoXG4gICAgICBwZXRKc29uOiBSZXBsYXlQZXRKc29uLFxuICAgICAgY29weVBldE5hbWU6IHN0cmluZyxcbiAgICApOiBzdHJpbmcgfCBudWxsID0+IHtcbiAgICAgIC8vIFN0b3JlZC1hYmlsaXR5IGVudW1zIGFyZSBkZWZpbml0aXZlLiBDaGVjayBldmVyeSBhYmlsaXR5IGZvciBvbmUgYmVmb3JlXG4gICAgICAvLyBhdHRlbXB0aW5nIG5lYXJieS1tYXAgaW5mZXJlbmNlOyBvdGhlcndpc2UgdGhlIGhvbGRlcidzIG5hdGl2ZSBhYmlsaXR5XG4gICAgICAvLyBjYW4gcHJvZHVjZSBhIHBsYXVzaWJsZSBidXQgaW5jb3JyZWN0IHBldCAoZm9yIGV4YW1wbGUgQWFyZHZhcmsgYmVmb3JlXG4gICAgICAvLyByZWFjaGluZyBCZWx1Z2EncyBzdG9yZWQgV29sZiBlbnVtKS5cbiAgICAgIGZvciAoY29uc3QgYWJpbGl0eSBvZiBwZXRKc29uLkFiaWwgPz8gW10pIHtcbiAgICAgICAgY29uc3QgYWJpbGl0eUlkID0gdG9SZXBsYXlJZChhYmlsaXR5Py5FbnUpO1xuICAgICAgICBjb25zdCBzdG9yZWRDb3B5T3duZXIgPSBhYmlsaXR5SWRcbiAgICAgICAgICA/IFNUT1JFRF9DT1BZX0FCSUxJVFlfT1dORVJfQllfSUQuZ2V0KGFiaWxpdHlJZClcbiAgICAgICAgICA6IG51bGw7XG4gICAgICAgIGlmIChzdG9yZWRDb3B5T3duZXIpIHtcbiAgICAgICAgICByZXR1cm4gc3RvcmVkQ29weU93bmVyO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZvciAoY29uc3QgYWJpbGl0eSBvZiBwZXRKc29uLkFiaWwgPz8gW10pIHtcbiAgICAgICAgY29uc3QgYWJpbGl0eUlkID0gdG9SZXBsYXlJZChhYmlsaXR5Py5FbnUpO1xuICAgICAgICBpZiAoIWFiaWxpdHlJZCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBvd25lclBldE5hbWUgPSByZXNvbHZlQWJpbGl0eU93bmVyUGV0TmFtZShhYmlsaXR5SWQpO1xuICAgICAgICAvLyBSZXBsYXkgaW5kZXhlcyBjYW4gYXR0cmlidXRlIGEgY29waWVkIGFiaWxpdHkgdG8gaXRzIGN1cnJlbnQgaG9sZGVyLlxuICAgICAgICAvLyBXaGVuIHRoYXQgaGFwcGVucywgdXNlIHRoZSBzdXJyb3VuZGluZyBjYW5vbmljYWwgYWJpbGl0eSBtYXAgdG8gZmluZFxuICAgICAgICAvLyB0aGUgb3JpZ2luYWwgb3duZXIgaW5zdGVhZC5cbiAgICAgICAgaWYgKG93bmVyUGV0TmFtZSA9PT0gY29weVBldE5hbWUpIHtcbiAgICAgICAgICBvd25lclBldE5hbWUgPSByZXNvbHZlQWJpbGl0eU93bmVyUGV0TmFtZUJ5TmVhcmJ5TWFwKGFiaWxpdHlJZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG93bmVyUGV0TmFtZSAmJiBvd25lclBldE5hbWUgIT09IGNvcHlQZXROYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIG93bmVyUGV0TmFtZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcblxuICAgIGNvbnN0IHBhcnNlQWJvbWluYXRpb25Td2FsbG93ZWRTdGF0ZSA9IChcbiAgICAgIHBldEpzb246IFJlcGxheVBldEpzb24sXG4gICAgKTogQWJvbWluYXRpb25Td2FsbG93ZWRTdGF0ZSA9PiB7XG4gICAgICBjb25zdCBhYm9taW5hdGlvblN0YXRlID0gZGVmYXVsdEFib21pbmF0aW9uU3dhbGxvd2VkU3RhdGUoKTtcbiAgICAgIGNvbnN0IGFwcGx5TmVzdGVkTWVtb3J5U3RhdGUgPSAoXG4gICAgICAgIHNsb3RGaWVsZHM6ICh0eXBlb2YgQUJPTUlOQVRJT05fU0xPVF9GSUVMRFMpW251bWJlcl0sXG4gICAgICAgIG93bmVyUGV0TmFtZTogc3RyaW5nLFxuICAgICAgICBhYmlsaXR5OiBSZXBsYXlBYmlsaXR5SnNvbixcbiAgICAgICk6IHZvaWQgPT4ge1xuICAgICAgICBjb25zdCBtZW1vcnlFbnRyeSA9IGdldFJlcGxheU1lbW9yeUVudHJ5QnlBYmlsaXR5SWQocGV0SnNvbiwgYWJpbGl0eS5FbnUpO1xuICAgICAgICBjb25zdCBuZXN0ZWRUaW1lc0h1cnQgPSBnZXRUaW1lc0h1cnRGcm9tUmF3UGV0KG1lbW9yeUVudHJ5KTtcbiAgICAgICAgaWYgKG5lc3RlZFRpbWVzSHVydCAhPT0gbnVsbCkge1xuICAgICAgICAgIGFib21pbmF0aW9uU3RhdGVbc2xvdEZpZWxkcy50aW1lc0h1cnRdID0gbmVzdGVkVGltZXNIdXJ0O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5lc3RlZFN3YWxsb3dlZFBldCA9IHJlc29sdmVOZXN0ZWRTd2FsbG93ZWRQZXROYW1lKG1lbW9yeUVudHJ5KTtcbiAgICAgICAgaWYgKCFuZXN0ZWRTd2FsbG93ZWRQZXQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG93bmVyUGV0TmFtZSA9PT0gJ0JlbHVnYSBXaGFsZScpIHtcbiAgICAgICAgICBhYm9taW5hdGlvblN0YXRlW3Nsb3RGaWVsZHMuYmVsdWdhXSA9IG5lc3RlZFN3YWxsb3dlZFBldDtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG93bmVyUGV0TmFtZSA9PT0gJ1NhcmNhc3RpYyBGcmluZ2VoZWFkJykge1xuICAgICAgICAgIGFib21pbmF0aW9uU3RhdGVbc2xvdEZpZWxkcy5zYXJjYXN0aWNGcmluZ2VoZWFkXSA9IG5lc3RlZFN3YWxsb3dlZFBldDtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgY29uc3QgY29waWVkQWJpbGl0aWVzID0gKHBldEpzb24/LkFiaWwgPz8gW10pXG4gICAgICAgIC5tYXAoKGFiaWxpdHksIGluZGV4KSA9PiAoeyBhYmlsaXR5LCBpbmRleCB9KSlcbiAgICAgICAgLmZpbHRlcihcbiAgICAgICAgICAoXG4gICAgICAgICAgICBhYmlsaXR5RW50cnksXG4gICAgICAgICAgKTogYWJpbGl0eUVudHJ5IGlzIHsgYWJpbGl0eTogUmVwbGF5QWJpbGl0eUpzb247IGluZGV4OiBudW1iZXIgfSA9PlxuICAgICAgICAgICAgYWJpbGl0eUVudHJ5LmFiaWxpdHkgIT09IG51bGwgJiZcbiAgICAgICAgICAgIHRvUmVwbGF5SWQoYWJpbGl0eUVudHJ5LmFiaWxpdHk/LkVudSkgIT09IG51bGwsXG4gICAgICAgICk7XG5cbiAgICAgIGlmIChjb3BpZWRBYmlsaXRpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBhYm9taW5hdGlvblN0YXRlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBncm91cGVkQWJpbGl0aWVzID0gbmV3IE1hcDxcbiAgICAgICAgbnVtYmVyLFxuICAgICAgICB7IGFiaWxpdHk6IFJlcGxheUFiaWxpdHlKc29uOyBpbmRleDogbnVtYmVyIH1bXVxuICAgICAgPigpO1xuICAgICAgY29uc3Qgb3JkZXJlZEdyb3VwS2V5czogbnVtYmVyW10gPSBbXTtcbiAgICAgIGNvcGllZEFiaWxpdGllcy5mb3JFYWNoKChhYmlsaXR5RW50cnkpID0+IHtcbiAgICAgICAgY29uc3QgZ3JvdXBLZXkgPSB0b0Zpbml0ZU51bWJlcihhYmlsaXR5RW50cnkuYWJpbGl0eT8uR3JvcCkgPz8gMDtcbiAgICAgICAgaWYgKCFncm91cGVkQWJpbGl0aWVzLmhhcyhncm91cEtleSkpIHtcbiAgICAgICAgICBncm91cGVkQWJpbGl0aWVzLnNldChncm91cEtleSwgW10pO1xuICAgICAgICAgIG9yZGVyZWRHcm91cEtleXMucHVzaChncm91cEtleSk7XG4gICAgICAgIH1cbiAgICAgICAgZ3JvdXBlZEFiaWxpdGllcy5nZXQoZ3JvdXBLZXkpPy5wdXNoKGFiaWxpdHlFbnRyeSk7XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgdXNlZEFiaWxpdHlJbmRleGVzID0gbmV3IFNldDxudW1iZXI+KCk7XG4gICAgICBjb25zdCB1bnJlc29sdmVkU2xvdEluZGV4ZXM6IG51bWJlcltdID0gW107XG5cbiAgICAgIEFCT01JTkFUSU9OX1NMT1RfRklFTERTLmZvckVhY2goKHNsb3RGaWVsZHMsIHNsb3RJbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBncm91cEtleSA9IG9yZGVyZWRHcm91cEtleXNbc2xvdEluZGV4XTtcbiAgICAgICAgaWYgKGdyb3VwS2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB1bnJlc29sdmVkU2xvdEluZGV4ZXMucHVzaChzbG90SW5kZXgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBncm91cEFiaWxpdGllcyA9IGdyb3VwZWRBYmlsaXRpZXMuZ2V0KGdyb3VwS2V5KTtcbiAgICAgICAgaWYgKCFncm91cEFiaWxpdGllcyB8fCBncm91cEFiaWxpdGllcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICB1bnJlc29sdmVkU2xvdEluZGV4ZXMucHVzaChzbG90SW5kZXgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByZXNvbHZlZEFiaWxpdHlFbnRyeTpcbiAgICAgICAgICB8IHsgYWJpbGl0eTogUmVwbGF5QWJpbGl0eUpzb247IGluZGV4OiBudW1iZXIgfVxuICAgICAgICAgIHwgbnVsbCA9IG51bGw7XG4gICAgICAgIGxldCByZXNvbHZlZFBldE5hbWU6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gICAgICAgIGZvciAoY29uc3QgYWJpbGl0eUVudHJ5IG9mIGdyb3VwQWJpbGl0aWVzKSB7XG4gICAgICAgICAgY29uc3QgYWJpbGl0eUlkID0gdG9SZXBsYXlJZChhYmlsaXR5RW50cnkuYWJpbGl0eT8uRW51KTtcbiAgICAgICAgICBpZiAoIWFiaWxpdHlJZCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IG93bmVyUGV0TmFtZSA9IHJlc29sdmVBYmlsaXR5T3duZXJQZXROYW1lKGFiaWxpdHlJZCk7XG4gICAgICAgICAgaWYgKCFvd25lclBldE5hbWUpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXNvbHZlZEFiaWxpdHlFbnRyeSA9IGFiaWxpdHlFbnRyeTtcbiAgICAgICAgICByZXNvbHZlZFBldE5hbWUgPSBvd25lclBldE5hbWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXJlc29sdmVkQWJpbGl0eUVudHJ5IHx8ICFyZXNvbHZlZFBldE5hbWUpIHtcbiAgICAgICAgICB1bnJlc29sdmVkU2xvdEluZGV4ZXMucHVzaChzbG90SW5kZXgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGFib21pbmF0aW9uU3RhdGVbc2xvdEZpZWxkcy5wZXRdID0gcmVzb2x2ZWRQZXROYW1lO1xuICAgICAgICBjb25zdCBpbmZlcnJlZExldmVsID0gdG9GaW5pdGVOdW1iZXIocmVzb2x2ZWRBYmlsaXR5RW50cnkuYWJpbGl0eT8uTHZsKTtcbiAgICAgICAgaWYgKGluZmVycmVkTGV2ZWwgIT09IG51bGwpIHtcbiAgICAgICAgICBhYm9taW5hdGlvblN0YXRlW3Nsb3RGaWVsZHMubGV2ZWxdID0gaW5mZXJyZWRMZXZlbDtcbiAgICAgICAgfVxuICAgICAgICBhcHBseU5lc3RlZE1lbW9yeVN0YXRlKFxuICAgICAgICAgIHNsb3RGaWVsZHMsXG4gICAgICAgICAgcmVzb2x2ZWRQZXROYW1lLFxuICAgICAgICAgIHJlc29sdmVkQWJpbGl0eUVudHJ5LmFiaWxpdHksXG4gICAgICAgICk7XG4gICAgICAgIHVzZWRBYmlsaXR5SW5kZXhlcy5hZGQocmVzb2x2ZWRBYmlsaXR5RW50cnkuaW5kZXgpO1xuICAgICAgfSk7XG5cbiAgICAgIGlmICh1bnJlc29sdmVkU2xvdEluZGV4ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBhYm9taW5hdGlvblN0YXRlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmYWxsYmFja1Jlc29sdmVkQWJpbGl0aWVzID0gY29waWVkQWJpbGl0aWVzXG4gICAgICAgIC5maWx0ZXIoKGFiaWxpdHlFbnRyeSkgPT4gIXVzZWRBYmlsaXR5SW5kZXhlcy5oYXMoYWJpbGl0eUVudHJ5LmluZGV4KSlcbiAgICAgICAgLm1hcCgoYWJpbGl0eUVudHJ5KSA9PiB7XG4gICAgICAgICAgY29uc3QgYWJpbGl0eUlkID0gdG9SZXBsYXlJZChhYmlsaXR5RW50cnkuYWJpbGl0eT8uRW51KTtcbiAgICAgICAgICBpZiAoIWFiaWxpdHlJZCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IG93bmVyUGV0TmFtZSA9IHJlc29sdmVBYmlsaXR5T3duZXJQZXROYW1lKGFiaWxpdHlJZCk7XG4gICAgICAgICAgaWYgKCFvd25lclBldE5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb3duZXJQZXROYW1lLFxuICAgICAgICAgICAgbGV2ZWw6IHRvRmluaXRlTnVtYmVyKGFiaWxpdHlFbnRyeS5hYmlsaXR5Py5MdmwpLFxuICAgICAgICAgICAgYWJpbGl0eTogYWJpbGl0eUVudHJ5LmFiaWxpdHksXG4gICAgICAgICAgfTtcbiAgICAgICAgfSlcbiAgICAgICAgLmZpbHRlcihcbiAgICAgICAgICAoXG4gICAgICAgICAgICBhYmlsaXR5RW50cnksXG4gICAgICAgICAgKTogYWJpbGl0eUVudHJ5IGlzIHtcbiAgICAgICAgICAgIG93bmVyUGV0TmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgbGV2ZWw6IG51bWJlciB8IG51bGw7XG4gICAgICAgICAgICBhYmlsaXR5OiBSZXBsYXlBYmlsaXR5SnNvbjtcbiAgICAgICAgICB9ID0+XG4gICAgICAgICAgICBhYmlsaXR5RW50cnkgIT09IG51bGwsXG4gICAgICAgICk7XG5cbiAgICAgIHVucmVzb2x2ZWRTbG90SW5kZXhlcy5mb3JFYWNoKChzbG90SW5kZXgsIGZhbGxiYWNrSW5kZXgpID0+IHtcbiAgICAgICAgY29uc3QgZmFsbGJhY2tBYmlsaXR5ID0gZmFsbGJhY2tSZXNvbHZlZEFiaWxpdGllc1tmYWxsYmFja0luZGV4XTtcbiAgICAgICAgaWYgKCFmYWxsYmFja0FiaWxpdHkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2xvdEZpZWxkcyA9IEFCT01JTkFUSU9OX1NMT1RfRklFTERTW3Nsb3RJbmRleF07XG4gICAgICAgIGFib21pbmF0aW9uU3RhdGVbc2xvdEZpZWxkcy5wZXRdID0gZmFsbGJhY2tBYmlsaXR5Lm93bmVyUGV0TmFtZTtcbiAgICAgICAgaWYgKGZhbGxiYWNrQWJpbGl0eS5sZXZlbCAhPT0gbnVsbCkge1xuICAgICAgICAgIGFib21pbmF0aW9uU3RhdGVbc2xvdEZpZWxkcy5sZXZlbF0gPSBmYWxsYmFja0FiaWxpdHkubGV2ZWw7XG4gICAgICAgIH1cbiAgICAgICAgYXBwbHlOZXN0ZWRNZW1vcnlTdGF0ZShcbiAgICAgICAgICBzbG90RmllbGRzLFxuICAgICAgICAgIGZhbGxiYWNrQWJpbGl0eS5vd25lclBldE5hbWUsXG4gICAgICAgICAgZmFsbGJhY2tBYmlsaXR5LmFiaWxpdHksXG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGFib21pbmF0aW9uU3RhdGU7XG4gICAgfTtcblxuICAgIGNvbnN0IHBhcnNlUGV0ID0gKHBldEpzb246IFJlcGxheVBldEpzb24gfCBudWxsIHwgdW5kZWZpbmVkKTogUGV0Q29uZmlnIHwgbnVsbCA9PiB7XG4gICAgICBpZiAoIXBldEpzb24pIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIC8vIEJ1aWxkIGhlbHBlciBtYXBzIGZvciBtb3JlIGFkdmFuY2VkIGluZmVyZW5jZSAodXNlZCBmb3IgQWJvbWluYXRpb24gbWVtb3J5KVxuICAgICAgY29uc3QgcGV0UmVjb3JkID0gYXNSZWNvcmQocGV0SnNvbik7XG4gICAgICBjb25zdCBtYXBzOiBSZXBsYXlQYXJzZXJMb29rdXBNYXBzID0geyBQRVRfSURTX0JZX05BTUUgfTtcblxuICAgICAgY29uc3QgcmF3UGV0UmVmID1cbiAgICAgICAgcGV0SnNvbi5FbnUgPz9cbiAgICAgICAgcGV0UmVjb3JkPy5bJ2VudSddID8/XG4gICAgICAgIHBldFJlY29yZD8uWydJZCddID8/XG4gICAgICAgIHBldFJlY29yZD8uWydpZCddO1xuICAgICAgY29uc3QgcmVzb2x2ZWRQZXRJZCA9IHJlc29sdmVQZXRJZEZyb21Vbmtub3duKHJhd1BldFJlZiwgbWFwcyk7XG4gICAgICBjb25zdCBwZXRJZCA9IHJlc29sdmVkUGV0SWQgIT09IG51bGwgPyBTdHJpbmcocmVzb2x2ZWRQZXRJZCkgOiBTdHJpbmcocmF3UGV0UmVmID8/IDApO1xuXG4gICAgICBjb25zdCBwZXROYW1lID1cbiAgICAgICAgUEVUU19CWV9JRC5nZXQocGV0SWQpIHx8XG4gICAgICAgICh0eXBlb2YgcGV0UmVjb3JkPy5bJ25hbWUnXSA9PT0gJ3N0cmluZycgPyBwZXRSZWNvcmRbJ25hbWUnXSA6IG51bGwpIHx8XG4gICAgICAgICh0eXBlb2YgcGV0UmVjb3JkPy5bJ05hbWUnXSA9PT0gJ3N0cmluZycgPyBwZXRSZWNvcmRbJ05hbWUnXSA6IG51bGwpIHx8XG4gICAgICAgICh0eXBlb2YgcmF3UGV0UmVmID09PSAnc3RyaW5nJyAmJiByYXdQZXRSZWYudHJpbSgpLmxlbmd0aCA+IDBcbiAgICAgICAgICA/IHJhd1BldFJlZi50cmltKClcbiAgICAgICAgICA6IGBQZXQgIyR7cGV0SWR9YCk7XG5cbiAgICAgIGNvbnNvbGUubG9nKGBbUmVwbGF5Q2FsY1BhcnNlcl0gUGV0IEVudToke3Jhd1BldFJlZn0gLT4gSWQ6JHtwZXRJZH0gLT4gTmFtZToke3BldE5hbWV9YCk7XG5cbiAgICAgIGNvbnN0IGF0SnNvbiA9IHBldEpzb24uQXQgPz8gYXNSZWNvcmQocGV0UmVjb3JkPy5bJ2F0J10pO1xuICAgICAgY29uc3QgaHBKc29uID0gcGV0SnNvbi5IcCA/PyBhc1JlY29yZChwZXRSZWNvcmQ/LlsnaHAnXSk7XG4gICAgICBjb25zdCBhdEpzb25SZWNvcmQgPSBhc1JlY29yZChhdEpzb24pO1xuICAgICAgY29uc3QgaHBKc29uUmVjb3JkID0gYXNSZWNvcmQoaHBKc29uKTtcblxuICAgICAgY29uc3QgcGV0VGVtcEF0ayA9IHRvTnVtYmVyT3JGYWxsYmFjayhcbiAgICAgICAgYXRKc29uPy5UZW1wID8/IGF0SnNvblJlY29yZD8uWyd0ZW1wJ10sXG4gICAgICAgIDAsXG4gICAgICApO1xuICAgICAgY29uc3QgcGV0VGVtcEhwID0gdG9OdW1iZXJPckZhbGxiYWNrKFxuICAgICAgICBocEpzb24/LlRlbXAgPz8gaHBKc29uUmVjb3JkPy5bJ3RlbXAnXSxcbiAgICAgICAgMCxcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IGJlbHVnYVN3YWxsb3dlZFBldCA9XG4gICAgICAgIHBldElkID09PSAnMTgyJ1xuICAgICAgICAgID8gcmVzb2x2ZU5lc3RlZFN3YWxsb3dlZFBldE5hbWUocGV0SnNvbikgPz9cbiAgICAgICAgICAgIGluZmVyQ29waWVkUGV0TmFtZShwZXRKc29uLCAnQmVsdWdhIFdoYWxlJylcbiAgICAgICAgICA6IG51bGw7XG4gICAgICBjb25zdCBzYXJjYXN0aWNGcmluZ2VoZWFkU3dhbGxvd2VkUGV0ID1cbiAgICAgICAgcGV0SWQgPT09ICc3NjMnXG4gICAgICAgICAgPyByZXNvbHZlTmVzdGVkU3dhbGxvd2VkUGV0TmFtZShwZXRKc29uKSA/P1xuICAgICAgICAgICAgaW5mZXJDb3BpZWRQZXROYW1lKHBldEpzb24sICdTYXJjYXN0aWMgRnJpbmdlaGVhZCcpXG4gICAgICAgICAgOiBudWxsO1xuICAgICAgY29uc3QgYWJvbWluYXRpb25Td2FsbG93ZWRTdGF0ZSA9XG4gICAgICAgIHBldElkID09PSAnMzczJ1xuICAgICAgICAgID8gcGFyc2VBYm9taW5hdGlvblN3YWxsb3dlZFN0YXRlKHBldEpzb24pXG4gICAgICAgICAgOiBkZWZhdWx0QWJvbWluYXRpb25Td2FsbG93ZWRTdGF0ZSgpO1xuXG4gICAgICAvLyBhYmlsaXR5UGV0SWRCeUFiaWxpdHlJZCBpcyBhIE1hcDxhYmlsaXR5SWQsIHBldElkPlxuICAgICAgLy8gV2UgaW52ZXJ0IGl0IGludG8gYWJpbGl0eUlkc0J5UGV0SWQ6IHsgW3BldElkXTogW2FiaWxpdHlJZCwgLi4uXSB9XG4gICAgICBjb25zdCBhYmlsaXR5SWRzQnlQZXRJZDogUmVjb3JkPHN0cmluZywgc3RyaW5nW10+ID0ge307XG4gICAgICBmb3IgKGNvbnN0IFthYmlsaXR5SWQsIG1hcHBlZFBldElkXSBvZiBhYmlsaXR5UGV0SWRCeUFiaWxpdHlJZC5lbnRyaWVzKCkpIHtcbiAgICAgICAgY29uc3QgcGlkID0gU3RyaW5nKG1hcHBlZFBldElkKTtcbiAgICAgICAgYWJpbGl0eUlkc0J5UGV0SWRbcGlkXSA9IGFiaWxpdHlJZHNCeVBldElkW3BpZF0gfHwgW107XG4gICAgICAgIGFiaWxpdHlJZHNCeVBldElkW3BpZF0ucHVzaChTdHJpbmcoYWJpbGl0eUlkKSk7XG4gICAgICB9XG4gICAgICBtYXBzLmFiaWxpdHlJZHNCeVBldElkID0gYWJpbGl0eUlkc0J5UGV0SWQ7XG5cbiAgICAgIGNvbnN0IHRpbWVzSHVydCA9IGdldFRpbWVzSHVydChwZXRKc29uKTtcbiAgICAgIGNvbnN0IGFiaWxpdHlUcmlnZ2Vyc0NvbnN1bWVkID0gKCgpID0+IHtcbiAgICAgICAgY29uc3QgdiA9IGdldFRyaWdnZXJzQ29uc3VtZWRGcm9tUmF3UGV0KHBldEpzb24pO1xuICAgICAgICByZXR1cm4gdiA9PT0gbnVsbCA/IFtdIDogW3ZdO1xuICAgICAgfSkoKTtcblxuICAgICAgY29uc3QgcGVya1ZhbHVlID0gcGV0SnNvbi5QZXJrO1xuICAgICAgY29uc3QgcmVwbGF5UGVya05hbWUgPVxuICAgICAgICBwZXRJZCAhPT0gbnVsbFxuICAgICAgICAgID8gb3B0aW9ucz8ucGVya05hbWVCeVBldElkPy5bU3RyaW5nKHBldElkKV0gPz8gbnVsbFxuICAgICAgICAgIDogbnVsbDtcbiAgICAgIGNvbnN0IHBlcmtOYW1lID1cbiAgICAgICAgcmVwbGF5UGVya05hbWUgPz9cbiAgICAgICAgKHBlcmtWYWx1ZSAhPT0gbnVsbCAmJiBwZXJrVmFsdWUgIT09IHVuZGVmaW5lZFxuICAgICAgICAgID8gUEVSS1NfQllfSUQuZ2V0KFN0cmluZyhwZXJrVmFsdWUpKSB8fFxuICAgICAgICAgICAgKHR5cGVvZiBwZXJrVmFsdWUgPT09ICdzdHJpbmcnID8gcGVya1ZhbHVlIDogJ1Vua25vd24gUGVyaycpXG4gICAgICAgICAgOiBudWxsKTtcblxuICAgICAgY29uc3QgcGFyc2VkUGV0OiBQZXRDb25maWcgPSB7XG4gICAgICAgIG5hbWU6IHBldE5hbWUsXG4gICAgICAgIGF0dGFjazpcbiAgICAgICAgICB0b051bWJlck9yRmFsbGJhY2soXG4gICAgICAgICAgICBhdEpzb24/LlBlcm0gPz8gYXRKc29uUmVjb3JkPy5bJ3Blcm0nXSA/PyBwZXRSZWNvcmQ/LlsnYXR0YWNrJ10sXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICkgKyBwZXRUZW1wQXRrLFxuICAgICAgICBoZWFsdGg6XG4gICAgICAgICAgdG9OdW1iZXJPckZhbGxiYWNrKFxuICAgICAgICAgICAgaHBKc29uPy5QZXJtID8/IGhwSnNvblJlY29yZD8uWydwZXJtJ10gPz8gcGV0UmVjb3JkPy5bJ2hlYWx0aCddLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICApICsgcGV0VGVtcEhwLFxuICAgICAgICBleHA6ICgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgZXhwID0gdG9GaW5pdGVOdW1iZXIocGV0SnNvbi5FeHApO1xuICAgICAgICAgIGlmIChleHAgIT09IG51bGwgJiYgZXhwID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGV4cDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgbHZsID0gdG9GaW5pdGVOdW1iZXIocGV0SnNvbi5MdmwpO1xuICAgICAgICAgIGlmIChsdmwgPT09IDIpIHtcbiAgICAgICAgICAgIHJldHVybiAyO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobHZsID09PSAzKSB7XG4gICAgICAgICAgICByZXR1cm4gNTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGV4cCA/PyAwO1xuICAgICAgICB9KSgpLFxuICAgICAgICBlcXVpcG1lbnQ6IHBlcmtOYW1lID8geyBuYW1lOiBwZXJrTmFtZSB9IDogbnVsbCxcbiAgICAgICAgbWFuYTogdG9OdW1iZXJPckZhbGxiYWNrKHBldEpzb24uTWFuYSwgMCksXG4gICAgICAgIGJlbHVnYVN3YWxsb3dlZFBldCxcbiAgICAgICAgc2FyY2FzdGljRnJpbmdlaGVhZFN3YWxsb3dlZFBldCxcbiAgICAgICAgLi4uYWJvbWluYXRpb25Td2FsbG93ZWRTdGF0ZSxcbiAgICAgICAgYmF0dGxlc0ZvdWdodDogMCxcbiAgICAgICAgdHJpZ2dlcnNDb25zdW1lZDpcbiAgICAgICAgICBhYmlsaXR5VHJpZ2dlcnNDb25zdW1lZC5sZW5ndGggPiAwXG4gICAgICAgICAgICA/IE1hdGgubWF4KC4uLmFiaWxpdHlUcmlnZ2Vyc0NvbnN1bWVkKVxuICAgICAgICAgICAgOiAwLFxuICAgICAgfTtcblxuICAgICAgLy8gSWYgdGhpcyBpcyBhbiBBYm9taW5hdGlvbiwgYXR0ZW1wdCB0byBhdHRhY2ggaW5mZXJyZWQgbWVtb3J5L2FiaWxpdGllc1xuICAgICAgaWYgKFN0cmluZyhwZXRJZCkgPT09ICczNzMnKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgbWVtID0gYnVpbGRBYm9taW5hdGlvbk1lbW9yeShwZXRKc29uLCBOdW1iZXIocGV0SWQpLCBtYXBzKTtcbiAgICAgICAgICBpZiAobWVtKSB7XG4gICAgICAgICAgICBjb25zdCBhYm9taW5hdGlvblBldCA9IHBhcnNlZFBldCBhcyBQZXRDb25maWcgJiB7XG4gICAgICAgICAgICAgIGFib21pbmF0aW9uTWVtb3J5PzogdW5rbm93bjtcbiAgICAgICAgICAgICAgYWJvbWluYXRpb25JbmZlcnJlZEFiaWxpdHlFbnVtcz86IG51bWJlcltdO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGFib21pbmF0aW9uUGV0LmFib21pbmF0aW9uTWVtb3J5ID0gbWVtO1xuICAgICAgICAgICAgY29uc3QgaW5mZXJyZWRFbnVtcyA9IGluZmVyQWJvbWluYXRpb25BYmlsaXR5RW51bXNGcm9tU3dhbGxvd2VkUGV0cyhcbiAgICAgICAgICAgICAgcGV0SnNvbixcbiAgICAgICAgICAgICAgbWFwcyxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbmZlcnJlZEVudW1zKSAmJiBpbmZlcnJlZEVudW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgYWJvbWluYXRpb25QZXQuYWJvbWluYXRpb25JbmZlcnJlZEFiaWxpdHlFbnVtcyA9IGluZmVycmVkRW51bXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHZvaWQgZXJyb3I7XG4gICAgICAgICAgLyogYmVzdC1lZmZvcnQgb25seSAqL1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGltZXNIdXJ0ICE9PSBudWxsKSB7XG4gICAgICAgIHBhcnNlZFBldC50aW1lc0h1cnQgPSB0aW1lc0h1cnQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwYXJzZWRQZXQ7XG4gICAgfTtcblxuICAgIGNvbnN0IHBhcnNlQm9hcmRQZXRzID0gKFxuICAgICAgYm9hcmRKc29uOiBSZXBsYXlCb2FyZEpzb24gfCBudWxsIHwgdW5kZWZpbmVkLFxuICAgICk6IChQZXRDb25maWcgfCBudWxsKVtdID0+IHtcbiAgICAgIGNvbnN0IGl0ZW1zID0gYm9hcmRKc29uPy5NaW5zPy5JdGVtcyA/PyBbXTtcbiAgICAgIGNvbnN0IHBldEFycmF5OiAoUGV0Q29uZmlnIHwgbnVsbClbXSA9IEFycmF5KDUpLmZpbGwobnVsbCk7XG4gICAgICBpdGVtcy5mb3JFYWNoKChwZXQsIGluZGV4KSA9PiB7XG4gICAgICAgIGlmICghcGV0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBwb3MgPSB0b051bWJlck9yRmFsbGJhY2socGV0LlBvaT8ueCwgLTEpO1xuICAgICAgICBpZiAocG9zID09PSAtMSkge1xuICAgICAgICAgIHBvcyA9IGluZGV4O1xuICAgICAgICB9XG4gICAgICAgIGlmIChwb3MgPj0gMCAmJiBwb3MgPCA1KSB7XG4gICAgICAgICAgcGV0QXJyYXlbcG9zXSA9IHBhcnNlUGV0KHBldCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcGV0QXJyYXkucmV2ZXJzZSgpO1xuICAgIH07XG5cbiAgICBjb25zdCBnZXRUb3kgPSAoYm9hcmRKc29uOiBSZXBsYXlCb2FyZEpzb24gfCBudWxsIHwgdW5kZWZpbmVkKTogUmVwbGF5UGFyc2VkVG95ID0+IHtcbiAgICAgIGNvbnN0IHRveUl0ZW0gPSAoYm9hcmRKc29uPy5SZWw/Lkl0ZW1zID8/IFtdKS5maW5kKChpdGVtKSA9PiBCb29sZWFuKGl0ZW0pKTtcbiAgICAgIGlmICh0b3lJdGVtKSB7XG4gICAgICAgIGNvbnN0IHRveVJlY29yZCA9IGFzUmVjb3JkKHRveUl0ZW0pO1xuICAgICAgICBjb25zdCB0b3lJZCA9IHJlc29sdmVUb3lJZCh0b3lJdGVtKSA/PyBudWxsO1xuICAgICAgICBjb25zdCB0b3lOYW1lID0gdG95SWQgPyBUT1lTX0JZX0lELmdldChTdHJpbmcodG95SWQpKSA6IGdldFRveU5hbWUodG95SXRlbSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbmFtZTogdG95TmFtZSB8fCBudWxsLFxuICAgICAgICAgIGxldmVsOiB0b051bWJlck9yRmFsbGJhY2sodG95UmVjb3JkPy5bJ0x2bCddLCAxKSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7IG5hbWU6IG51bGwsIGxldmVsOiAxIH07XG4gICAgfTtcblxuICAgIGNvbnN0IHBsYXllclRveSA9IGdldFRveSh1c2VyQm9hcmQpO1xuICAgIGNvbnN0IG9wcG9uZW50VG95ID0gZ2V0VG95KG9wcG9uZW50Qm9hcmQpO1xuXG4gICAgY29uc3QgY3VzdG9tUGFja3MgPSB0aGlzLmJ1aWxkQ3VzdG9tUGFja3NGcm9tR2VuZXNpcyhidWlsZE1vZGVsLCBiYXR0bGVKc29uKTtcbiAgICAvLyBHZW5lc2lzQnVpbGRNb2RlbCBiZWxvbmdzIHRvIHRoZSBwYXJ0aWNpcGF0aW9uIElEIHVzZWQgdG8gZmV0Y2ggdGhlXG4gICAgLy8gcmVwbGF5LCB3aGljaCBpcyB0aGUgcGxheWVyIHBlcnNwZWN0aXZlLiBTdW1tYXJpemVkIHJlcGxheSBiYXR0bGVzIG9mdGVuXG4gICAgLy8gb21pdCBVc2VyQm9hcmQuRGVjaywgc28gdXNlIHRoZSBnZW5lc2lzIGRlY2sgYXMgdGhlIHBsYXllcidzIGZhbGxiYWNrLlxuICAgIC8vIE5ldmVyIHVzZSBpdCBmb3IgdGhlIG9wcG9uZW50OiB0aGVpciBjdXN0b20gZGVjayByZXF1aXJlcyB0aGVpciBvd25cbiAgICAvLyBwYXJ0aWNpcGF0aW9uIHJlcGxheS5cbiAgICBjb25zdCBwbGF5ZXJEZWNrID0gdXNlckJvYXJkPy5EZWNrID8/IGJ1aWxkTW9kZWw/LkJvcj8uRGVjaztcbiAgICBjb25zdCBwbGF5ZXJDdXN0b21QYWNrID0gdGhpcy5maW5kQ3VzdG9tUGFja0Zyb21EZWNrKFxuICAgICAgY3VzdG9tUGFja3MsXG4gICAgICBwbGF5ZXJEZWNrLFxuICAgICk7XG4gICAgY29uc3Qgb3Bwb25lbnRDdXN0b21QYWNrID0gdGhpcy5maW5kQ3VzdG9tUGFja0Zyb21EZWNrKFxuICAgICAgY3VzdG9tUGFja3MsXG4gICAgICBvcHBvbmVudEJvYXJkPy5EZWNrLFxuICAgICk7XG4gICAgY29uc3QgcGxheWVyUGFja0lkID0gcmVzb2x2ZVBhY2tJZEZyb21Vbmtub3duKHVzZXJCb2FyZD8uUGFjayk7XG4gICAgY29uc3Qgb3Bwb25lbnRQYWNrSWQgPSByZXNvbHZlUGFja0lkRnJvbVVua25vd24ob3Bwb25lbnRCb2FyZD8uUGFjayk7XG4gICAgY29uc3QgcGxheWVyUGFja05hbWUgPVxuICAgICAgcGxheWVyQ3VzdG9tUGFjaz8ubmFtZSB8fFxuICAgICAgKHBsYXllclBhY2tJZCAhPT0gbnVsbCA/IFBBQ0tfTUFQW3BsYXllclBhY2tJZF0gOiBudWxsKSB8fFxuICAgICAgJ1R1cnRsZSc7XG4gICAgY29uc3Qgb3Bwb25lbnRQYWNrTmFtZSA9XG4gICAgICBvcHBvbmVudEN1c3RvbVBhY2s/Lm5hbWUgfHxcbiAgICAgIChvcHBvbmVudFBhY2tJZCAhPT0gbnVsbCA/IFBBQ0tfTUFQW29wcG9uZW50UGFja0lkXSA6IG51bGwpIHx8XG4gICAgICAnVHVydGxlJztcblxuICAgIHJldHVybiB7XG4gICAgICBwbGF5ZXJQYWNrOiBwbGF5ZXJQYWNrTmFtZSxcbiAgICAgIG9wcG9uZW50UGFjazogb3Bwb25lbnRQYWNrTmFtZSxcbiAgICAgIHBsYXllclRveTogcGxheWVyVG95Lm5hbWUsXG4gICAgICBwbGF5ZXJUb3lMZXZlbDogU3RyaW5nKHBsYXllclRveS5sZXZlbCksXG4gICAgICBwbGF5ZXJIYXJkVG95OiBudWxsLFxuICAgICAgcGxheWVySGFyZFRveUxldmVsOiAxLFxuICAgICAgb3Bwb25lbnRUb3k6IG9wcG9uZW50VG95Lm5hbWUsXG4gICAgICBvcHBvbmVudFRveUxldmVsOiBTdHJpbmcob3Bwb25lbnRUb3kubGV2ZWwpLFxuICAgICAgb3Bwb25lbnRIYXJkVG95OiBudWxsLFxuICAgICAgb3Bwb25lbnRIYXJkVG95TGV2ZWw6IDEsXG4gICAgICB0dXJuOiByZWFkQm9hcmROdW1iZXIodXNlckJvYXJkLCAnVHVyJywgMSkgfHwgMSxcbiAgICAgIHBsYXllckdvbGRTcGVudDogcmVhZEJvYXJkTnVtYmVyKHVzZXJCb2FyZCwgJ0dvU3AnLCAwKSB8fCAwLFxuICAgICAgb3Bwb25lbnRHb2xkU3BlbnQ6IHJlYWRCb2FyZE51bWJlcihvcHBvbmVudEJvYXJkLCAnR29TcCcsIDApIHx8IDAsXG4gICAgICBwbGF5ZXJSb2xsQW1vdW50OiByZWFkQm9hcmROdW1iZXIodXNlckJvYXJkLCAnUm9sZCcsIDApIHx8IDAsXG4gICAgICBvcHBvbmVudFJvbGxBbW91bnQ6IHJlYWRCb2FyZE51bWJlcihvcHBvbmVudEJvYXJkLCAnUm9sZCcsIDApIHx8IDAsXG4gICAgICBwbGF5ZXJTdW1tb25lZEFtb3VudDogcmVhZEJvYXJkTnVtYmVyKHVzZXJCb2FyZCwgJ01pU3UnLCAwKSB8fCAwLFxuICAgICAgb3Bwb25lbnRTdW1tb25lZEFtb3VudDogcmVhZEJvYXJkTnVtYmVyKG9wcG9uZW50Qm9hcmQsICdNaVN1JywgMCkgfHwgMCxcbiAgICAgIHBsYXllckxldmVsM1NvbGQ6IHJlYWRCb2FyZE51bWJlcih1c2VyQm9hcmQsICdNU0ZMJywgMCkgfHwgMCxcbiAgICAgIG9wcG9uZW50TGV2ZWwzU29sZDogcmVhZEJvYXJkTnVtYmVyKG9wcG9uZW50Qm9hcmQsICdNU0ZMJywgMCkgfHwgMCxcbiAgICAgIHBsYXllclRyYW5zZm9ybWF0aW9uQW1vdW50OiByZWFkQm9hcmROdW1iZXIodXNlckJvYXJkLCAnVHJUVCcsIDApIHx8IDAsXG4gICAgICBvcHBvbmVudFRyYW5zZm9ybWF0aW9uQW1vdW50OiByZWFkQm9hcmROdW1iZXIob3Bwb25lbnRCb2FyZCwgJ1RyVFQnLCAwKSB8fCAwLFxuICAgICAgcGxheWVyUGV0czogcGFyc2VCb2FyZFBldHModXNlckJvYXJkKSxcbiAgICAgIG9wcG9uZW50UGV0czogcGFyc2VCb2FyZFBldHMob3Bwb25lbnRCb2FyZCksXG4gICAgICBhbGxQZXRzOiBmYWxzZSxcbiAgICAgIGxvZ0ZpbHRlcjogbnVsbCxcbiAgICAgIGN1c3RvbVBhY2tzLFxuICAgICAgb2xkU3Rvcms6IGZhbHNlLFxuICAgICAgdG9rZW5QZXRzOiBmYWxzZSxcbiAgICAgIGtvbW9kb1NodWZmbGU6IGZhbHNlLFxuICAgICAgbWFuYTogdHJ1ZSxcbiAgICAgIHNlZWQ6IG51bGwsXG4gICAgICB0cmlnZ2Vyc0NvbnN1bWVkOiB0cnVlLFxuICAgICAgc2hvd0FkdmFuY2VkOiB0cnVlLFxuICAgICAgc2hvd1RyaWdnZXJOYW1lc0luTG9nczogZmFsc2UsXG4gICAgICBzaG93UG9zaXRpb25hbEFyZ3NJbkxvZ3M6IHRydWUsXG4gICAgICBhaWxtZW50RXF1aXBtZW50OiBmYWxzZSxcbiAgICB9O1xuICB9XG5cbiAgYnVpbGRDdXN0b21QYWNrc0Zyb21HZW5lc2lzKFxuICAgIGJ1aWxkTW9kZWw/OiBSZXBsYXlCdWlsZE1vZGVsSnNvbixcbiAgICBiYXR0bGVKc29uPzogUmVwbGF5QmF0dGxlSnNvbixcbiAgKTogUmVwbGF5Q3VzdG9tUGFja1tdIHtcbiAgICBjb25zdCBkZWNrcyA9IFtcbiAgICAgIGJ1aWxkTW9kZWw/LkJvcj8uRGVjayxcbiAgICAgIGJhdHRsZUpzb24/LlVzZXJCb2FyZD8uRGVjayxcbiAgICAgIGJhdHRsZUpzb24/Lk9wcG9uZW50Qm9hcmQ/LkRlY2ssXG4gICAgXS5maWx0ZXIoXG4gICAgICAoZGVjayk6IGRlY2sgaXMgUmVwbGF5RGVja0pzb24gPT5cbiAgICAgICAgZGVjayAhPT0gbnVsbCAmJiBkZWNrICE9PSB1bmRlZmluZWQgJiYgQXJyYXkuaXNBcnJheShkZWNrLk1pbmlvbnMpLFxuICAgICk7XG5cbiAgICBjb25zdCBwYWNrczogUmVwbGF5Q3VzdG9tUGFja1tdID0gW107XG4gICAgY29uc3Qgc2VlbkRlY2tJZHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBjb25zdCB1c2VkTmFtZXMgPSBuZXcgU2V0PHN0cmluZz4oKTtcblxuICAgIGZvciAoY29uc3QgZGVjayBvZiBkZWNrcykge1xuICAgICAgY29uc3QgZGVja0lkID0gZGVjaz8uSWQgIT0gbnVsbCA/IFN0cmluZyhkZWNrLklkKSA6IG51bGw7XG4gICAgICBpZiAoZGVja0lkICYmIHNlZW5EZWNrSWRzLmhhcyhkZWNrSWQpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKGRlY2tJZCkge1xuICAgICAgICBzZWVuRGVja0lkcy5hZGQoZGVja0lkKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBhY2sgPSB0aGlzLmJ1aWxkQ3VzdG9tUGFja0Zyb21EZWNrKGRlY2ssIHVzZWROYW1lcyk7XG4gICAgICBpZiAocGFjaykge1xuICAgICAgICBwYWNrcy5wdXNoKHsgLi4ucGFjaywgZGVja0lkIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBwYWNrcztcbiAgfVxuXG4gIGdlbmVyYXRlQ2FsY3VsYXRvckxpbmsoY2FsY3VsYXRvclN0YXRlOiBSZXBsYXlDYWxjdWxhdG9yU3RhdGUpOiBzdHJpbmcge1xuICAgIGNvbnN0IGJhc2VVcmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuICAgIGNvbnN0IHN0cmlwcGVkU3RhdGUgPSB0aGlzLnN0cmlwRGVmYXVsdFZhbHVlcyhjYWxjdWxhdG9yU3RhdGUpO1xuICAgIGNvbnN0IHRydW5jYXRlZFN0YXRlID0gdGhpcy50cnVuY2F0ZUtleXMoc3RyaXBwZWRTdGF0ZSk7XG4gICAgY29uc3Qgc3RhdGVTdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0cnVuY2F0ZWRTdGF0ZSk7XG4gICAgY29uc3QgYmFzZTY0RGF0YSA9IGVuY29kZUJhc2U2NFVybChzdGF0ZVN0cmluZyk7XG4gICAgcmV0dXJuIGAke2Jhc2VVcmx9I2M9JHtiYXNlNjREYXRhfWA7XG4gIH1cblxuICBwcml2YXRlIGJ1aWxkQ3VzdG9tUGFja0Zyb21EZWNrKFxuICAgIGRlY2s6IFJlcGxheURlY2tKc29uIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgICB1c2VkTmFtZXM6IFNldDxzdHJpbmc+LFxuICApOiBSZXBsYXlDdXN0b21QYWNrQ29yZSB8IG51bGwge1xuICAgIGlmICghZGVjayB8fCAhQXJyYXkuaXNBcnJheShkZWNrLk1pbmlvbnMpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBtaW5pb25zID0gZGVjay5NaW5pb25zLm1hcCgoaWQpID0+IFN0cmluZyhpZCkpO1xuICAgIC8vIEtlZXAgdGhlIHJlcGxheSdzIG51bWVyaWMgc3BlbGwgSURzIGludGFjdC4gU0FQIGN1c3RvbS1wYWNrIEpTT04gdXNlc1xuICAgIC8vIG51bWVyaWMgSURzIGhlcmUsIHNvIGNvZXJjaW5nIHRoZW0gdG8gc3RyaW5ncyBtYWtlcyBjb3BpZWQgcGFjayBKU09OXG4gICAgLy8gZGlmZmVyIGZyb20gdGhlIHNvdXJjZSBkZWNrLlxuICAgIGNvbnN0IHNwZWxscyA9IEFycmF5LmlzQXJyYXkoZGVjay5TcGVsbHMpID8gWy4uLmRlY2suU3BlbGxzXSA6IFtdO1xuICAgIGNvbnN0IHRpZXJQZXRzOiBSZWNvcmQ8bnVtYmVyLCBzdHJpbmdbXT4gPSB7XG4gICAgICAxOiBbXSxcbiAgICAgIDI6IFtdLFxuICAgICAgMzogW10sXG4gICAgICA0OiBbXSxcbiAgICAgIDU6IFtdLFxuICAgICAgNjogW10sXG4gICAgfTtcblxuICAgIGZvciAoY29uc3QgbWluaW9uSWQgb2YgbWluaW9ucykge1xuICAgICAgY29uc3QgcGV0TWV0YSA9IFBFVFNfTUVUQV9CWV9JRC5nZXQobWluaW9uSWQpO1xuICAgICAgaWYgKCFwZXRNZXRhKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHRpZXJQZXRzW3BldE1ldGEudGllcl0pIHtcbiAgICAgICAgdGllclBldHNbcGV0TWV0YS50aWVyXS5wdXNoKHBldE1ldGEubmFtZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgbm9ybWFsaXplVGllclBldHMgPSAocGV0czogc3RyaW5nW10pOiAoc3RyaW5nIHwgbnVsbClbXSA9PiB7XG4gICAgICBjb25zdCBub3JtYWxpemVkID0gcGV0cy5zbGljZSgwLCAxMCk7XG4gICAgICB3aGlsZSAobm9ybWFsaXplZC5sZW5ndGggPCAxMCkge1xuICAgICAgICBub3JtYWxpemVkLnB1c2gobnVsbCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbm9ybWFsaXplZDtcbiAgICB9O1xuXG4gICAgbGV0IGRlY2tOYW1lID0gZGVjay5UaXRsZSB8fCAnQ3VzdG9tIFBhY2snO1xuICAgIGlmICh1c2VkTmFtZXMuaGFzKGRlY2tOYW1lKSkge1xuICAgICAgbGV0IHN1ZmZpeCA9IDI7XG4gICAgICB3aGlsZSAodXNlZE5hbWVzLmhhcyhgJHtkZWNrTmFtZX0gKCR7c3VmZml4fSlgKSkge1xuICAgICAgICBzdWZmaXggKz0gMTtcbiAgICAgIH1cbiAgICAgIGRlY2tOYW1lID0gYCR7ZGVja05hbWV9ICgke3N1ZmZpeH0pYDtcbiAgICB9XG4gICAgdXNlZE5hbWVzLmFkZChkZWNrTmFtZSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogZGVja05hbWUsXG4gICAgICB0aWVyMVBldHM6IG5vcm1hbGl6ZVRpZXJQZXRzKHRpZXJQZXRzWzFdKSxcbiAgICAgIHRpZXIyUGV0czogbm9ybWFsaXplVGllclBldHModGllclBldHNbMl0pLFxuICAgICAgdGllcjNQZXRzOiBub3JtYWxpemVUaWVyUGV0cyh0aWVyUGV0c1szXSksXG4gICAgICB0aWVyNFBldHM6IG5vcm1hbGl6ZVRpZXJQZXRzKHRpZXJQZXRzWzRdKSxcbiAgICAgIHRpZXI1UGV0czogbm9ybWFsaXplVGllclBldHModGllclBldHNbNV0pLFxuICAgICAgdGllcjZQZXRzOiBub3JtYWxpemVUaWVyUGV0cyh0aWVyUGV0c1s2XSksXG4gICAgICBzcGVsbHMsXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgZmluZEN1c3RvbVBhY2tGcm9tRGVjayhcbiAgICBjdXN0b21QYWNrczogUmVwbGF5Q3VzdG9tUGFja1tdLFxuICAgIGRlY2s6IFJlcGxheURlY2tKc29uIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgKTogUmVwbGF5Q3VzdG9tUGFjayB8IG51bGwge1xuICAgIGlmICghZGVjaykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IGRlY2tJZCA9IGRlY2s/LklkICE9IG51bGwgPyBTdHJpbmcoZGVjay5JZCkgOiBudWxsO1xuICAgIGlmIChkZWNrSWQpIHtcbiAgICAgIGNvbnN0IGJ5SWQgPSBjdXN0b21QYWNrcy5maW5kKChwYWNrKSA9PiBwYWNrLmRlY2tJZCA9PT0gZGVja0lkKTtcbiAgICAgIGlmIChieUlkKSB7XG4gICAgICAgIHJldHVybiBieUlkO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGRlY2tDb250ZW50cyA9IHRoaXMuYnVpbGRDdXN0b21QYWNrRnJvbURlY2soZGVjaywgbmV3IFNldCgpKTtcbiAgICBpZiAoZGVja0NvbnRlbnRzKSB7XG4gICAgICBjb25zdCBieUNvbnRlbnRzID0gY3VzdG9tUGFja3MuZmluZCgocGFjaykgPT5cbiAgICAgICAgdGhpcy5jdXN0b21QYWNrQ29udGVudHNNYXRjaChwYWNrLCBkZWNrQ29udGVudHMpLFxuICAgICAgKTtcbiAgICAgIGlmIChieUNvbnRlbnRzKSB7XG4gICAgICAgIHJldHVybiBieUNvbnRlbnRzO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGRlY2tOYW1lID0gZGVjaz8uVGl0bGU7XG4gICAgaWYgKGRlY2tOYW1lKSB7XG4gICAgICByZXR1cm4gY3VzdG9tUGFja3MuZmluZCgocGFjaykgPT4gcGFjay5uYW1lID09PSBkZWNrTmFtZSkgfHwgbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwcml2YXRlIGN1c3RvbVBhY2tDb250ZW50c01hdGNoKFxuICAgIHBhY2s6IFJlcGxheUN1c3RvbVBhY2ssXG4gICAgZGVja0NvbnRlbnRzOiBSZXBsYXlDdXN0b21QYWNrQ29yZSxcbiAgKTogYm9vbGVhbiB7XG4gICAgY29uc3QgdGllcktleXMgPSBbXG4gICAgICAndGllcjFQZXRzJyxcbiAgICAgICd0aWVyMlBldHMnLFxuICAgICAgJ3RpZXIzUGV0cycsXG4gICAgICAndGllcjRQZXRzJyxcbiAgICAgICd0aWVyNVBldHMnLFxuICAgICAgJ3RpZXI2UGV0cycsXG4gICAgXSBhcyBjb25zdDtcblxuICAgIHJldHVybiAoXG4gICAgICB0aWVyS2V5cy5ldmVyeSgodGllcktleSkgPT5cbiAgICAgICAgdGhpcy5zdHJpbmdBcnJheXNNYXRjaChwYWNrW3RpZXJLZXldLCBkZWNrQ29udGVudHNbdGllcktleV0pLFxuICAgICAgKSAmJiB0aGlzLmN1c3RvbVBhY2tJdGVtc01hdGNoKHBhY2suc3BlbGxzLCBkZWNrQ29udGVudHMuc3BlbGxzKVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGN1c3RvbVBhY2tJdGVtc01hdGNoKFxuICAgIGxlZnQ6IFJlYWRvbmx5QXJyYXk8Q3VzdG9tUGFja0l0ZW0+LFxuICAgIHJpZ2h0OiBSZWFkb25seUFycmF5PEN1c3RvbVBhY2tJdGVtPixcbiAgKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChcbiAgICAgIGxlZnQubGVuZ3RoID09PSByaWdodC5sZW5ndGggJiZcbiAgICAgIGxlZnQuZXZlcnkoKHZhbHVlLCBpbmRleCkgPT4gdmFsdWUgPT09IHJpZ2h0W2luZGV4XSlcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBzdHJpbmdBcnJheXNNYXRjaChcbiAgICBsZWZ0OiBSZWFkb25seUFycmF5PHN0cmluZyB8IG51bGw+LFxuICAgIHJpZ2h0OiBSZWFkb25seUFycmF5PHN0cmluZyB8IG51bGw+LFxuICApOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgbGVmdC5sZW5ndGggPT09IHJpZ2h0Lmxlbmd0aCAmJlxuICAgICAgbGVmdC5ldmVyeSgodmFsdWUsIGluZGV4KSA9PiB2YWx1ZSA9PT0gcmlnaHRbaW5kZXhdKVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIHN0cmlwRGVmYXVsdFZhbHVlcyhcbiAgICBzdGF0ZTogUmVwbGF5Q2FsY3VsYXRvclN0YXRlLFxuICApOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB7XG4gICAgY29uc3Qgc3RyaXBwZWRTdGF0ZTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPSB7fTtcblxuICAgIGlmIChzdGF0ZS5wbGF5ZXJQYWNrICE9PSAnVHVydGxlJykge1xuICAgICAgc3RyaXBwZWRTdGF0ZS5wbGF5ZXJQYWNrID0gc3RhdGUucGxheWVyUGFjaztcbiAgICB9XG4gICAgaWYgKHN0YXRlLm9wcG9uZW50UGFjayAhPT0gJ1R1cnRsZScpIHtcbiAgICAgIHN0cmlwcGVkU3RhdGUub3Bwb25lbnRQYWNrID0gc3RhdGUub3Bwb25lbnRQYWNrO1xuICAgIH1cbiAgICBpZiAoc3RhdGUucGxheWVyVG95KSB7XG4gICAgICBzdHJpcHBlZFN0YXRlLnBsYXllclRveSA9IHN0YXRlLnBsYXllclRveTtcbiAgICB9XG4gICAgaWYgKHN0YXRlLnBsYXllclRveUxldmVsICYmIHN0YXRlLnBsYXllclRveUxldmVsICE9PSAnMScpIHtcbiAgICAgIHN0cmlwcGVkU3RhdGUucGxheWVyVG95TGV2ZWwgPSBzdGF0ZS5wbGF5ZXJUb3lMZXZlbDtcbiAgICB9XG4gICAgaWYgKHN0YXRlLm9wcG9uZW50VG95KSB7XG4gICAgICBzdHJpcHBlZFN0YXRlLm9wcG9uZW50VG95ID0gc3RhdGUub3Bwb25lbnRUb3k7XG4gICAgfVxuICAgIGlmIChzdGF0ZS5vcHBvbmVudFRveUxldmVsICYmIHN0YXRlLm9wcG9uZW50VG95TGV2ZWwgIT09ICcxJykge1xuICAgICAgc3RyaXBwZWRTdGF0ZS5vcHBvbmVudFRveUxldmVsID0gc3RhdGUub3Bwb25lbnRUb3lMZXZlbDtcbiAgICB9XG4gICAgaWYgKHN0YXRlLnR1cm4gIT09IDExKSB7XG4gICAgICBzdHJpcHBlZFN0YXRlLnR1cm4gPSBzdGF0ZS50dXJuO1xuICAgIH1cbiAgICBpZiAoc3RhdGUucGxheWVyR29sZFNwZW50ICE9PSAxMCkge1xuICAgICAgc3RyaXBwZWRTdGF0ZS5wbGF5ZXJHb2xkU3BlbnQgPSBzdGF0ZS5wbGF5ZXJHb2xkU3BlbnQ7XG4gICAgfVxuICAgIGlmIChzdGF0ZS5vcHBvbmVudEdvbGRTcGVudCAhPT0gMTApIHtcbiAgICAgIHN0cmlwcGVkU3RhdGUub3Bwb25lbnRHb2xkU3BlbnQgPSBzdGF0ZS5vcHBvbmVudEdvbGRTcGVudDtcbiAgICB9XG4gICAgaWYgKHN0YXRlLnBsYXllclJvbGxBbW91bnQgIT09IDQpIHtcbiAgICAgIHN0cmlwcGVkU3RhdGUucGxheWVyUm9sbEFtb3VudCA9IHN0YXRlLnBsYXllclJvbGxBbW91bnQ7XG4gICAgfVxuICAgIGlmIChzdGF0ZS5vcHBvbmVudFJvbGxBbW91bnQgIT09IDQpIHtcbiAgICAgIHN0cmlwcGVkU3RhdGUub3Bwb25lbnRSb2xsQW1vdW50ID0gc3RhdGUub3Bwb25lbnRSb2xsQW1vdW50O1xuICAgIH1cbiAgICBpZiAoc3RhdGUucGxheWVyU3VtbW9uZWRBbW91bnQgIT09IDApIHtcbiAgICAgIHN0cmlwcGVkU3RhdGUucGxheWVyU3VtbW9uZWRBbW91bnQgPSBzdGF0ZS5wbGF5ZXJTdW1tb25lZEFtb3VudDtcbiAgICB9XG4gICAgaWYgKHN0YXRlLm9wcG9uZW50U3VtbW9uZWRBbW91bnQgIT09IDApIHtcbiAgICAgIHN0cmlwcGVkU3RhdGUub3Bwb25lbnRTdW1tb25lZEFtb3VudCA9IHN0YXRlLm9wcG9uZW50U3VtbW9uZWRBbW91bnQ7XG4gICAgfVxuICAgIGlmIChzdGF0ZS5wbGF5ZXJMZXZlbDNTb2xkICE9PSAwKSB7XG4gICAgICBzdHJpcHBlZFN0YXRlLnBsYXllckxldmVsM1NvbGQgPSBzdGF0ZS5wbGF5ZXJMZXZlbDNTb2xkO1xuICAgIH1cbiAgICBpZiAoc3RhdGUub3Bwb25lbnRMZXZlbDNTb2xkICE9PSAwKSB7XG4gICAgICBzdHJpcHBlZFN0YXRlLm9wcG9uZW50TGV2ZWwzU29sZCA9IHN0YXRlLm9wcG9uZW50TGV2ZWwzU29sZDtcbiAgICB9XG4gICAgaWYgKHN0YXRlLnBsYXllclRyYW5zZm9ybWF0aW9uQW1vdW50ICE9PSAwKSB7XG4gICAgICBzdHJpcHBlZFN0YXRlLnBsYXllclRyYW5zZm9ybWF0aW9uQW1vdW50ID0gc3RhdGUucGxheWVyVHJhbnNmb3JtYXRpb25BbW91bnQ7XG4gICAgfVxuICAgIGlmIChzdGF0ZS5vcHBvbmVudFRyYW5zZm9ybWF0aW9uQW1vdW50ICE9PSAwKSB7XG4gICAgICBzdHJpcHBlZFN0YXRlLm9wcG9uZW50VHJhbnNmb3JtYXRpb25BbW91bnQgPSBzdGF0ZS5vcHBvbmVudFRyYW5zZm9ybWF0aW9uQW1vdW50O1xuICAgIH1cblxuICAgIGlmIChzdGF0ZS5hbGxQZXRzKSB7XG4gICAgICBzdHJpcHBlZFN0YXRlLmFsbFBldHMgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoc3RhdGUub2xkU3RvcmspIHtcbiAgICAgIHN0cmlwcGVkU3RhdGUub2xkU3RvcmsgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoc3RhdGUudG9rZW5QZXRzKSB7XG4gICAgICBzdHJpcHBlZFN0YXRlLnRva2VuUGV0cyA9IHRydWU7XG4gICAgfVxuICAgIGlmIChzdGF0ZS5rb21vZG9TaHVmZmxlKSB7XG4gICAgICBzdHJpcHBlZFN0YXRlLmtvbW9kb1NodWZmbGUgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoc3RhdGUubWFuYSkge1xuICAgICAgc3RyaXBwZWRTdGF0ZS5tYW5hID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHN0YXRlLnNlZWQgIT0gbnVsbCkge1xuICAgICAgc3RyaXBwZWRTdGF0ZS5zZWVkID0gc3RhdGUuc2VlZDtcbiAgICB9XG4gICAgaWYgKHN0YXRlLnRyaWdnZXJzQ29uc3VtZWQpIHtcbiAgICAgIHN0cmlwcGVkU3RhdGUudHJpZ2dlcnNDb25zdW1lZCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChzdGF0ZS5mb29kc0VhdGVuKSB7XG4gICAgICBzdHJpcHBlZFN0YXRlLmZvb2RzRWF0ZW4gPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoc3RhdGUuc2hvd0FkdmFuY2VkKSB7XG4gICAgICBzdHJpcHBlZFN0YXRlLnNob3dBZHZhbmNlZCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChzdGF0ZS5zaG93VHJpZ2dlck5hbWVzSW5Mb2dzKSB7XG4gICAgICBzdHJpcHBlZFN0YXRlLnNob3dUcmlnZ2VyTmFtZXNJbkxvZ3MgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoc3RhdGUuc2hvd1Bvc2l0aW9uYWxBcmdzSW5Mb2dzID09PSBmYWxzZSkge1xuICAgICAgc3RyaXBwZWRTdGF0ZS5zaG93UG9zaXRpb25hbEFyZ3NJbkxvZ3MgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHN0YXRlLmFpbG1lbnRFcXVpcG1lbnQpIHtcbiAgICAgIHN0cmlwcGVkU3RhdGUuYWlsbWVudEVxdWlwbWVudCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHN0YXRlLmxvZ0ZpbHRlcikge1xuICAgICAgc3RyaXBwZWRTdGF0ZS5sb2dGaWx0ZXIgPSBzdGF0ZS5sb2dGaWx0ZXI7XG4gICAgfVxuICAgIGlmIChzdGF0ZS5jdXN0b21QYWNrcy5sZW5ndGggPiAwKSB7XG4gICAgICBzdHJpcHBlZFN0YXRlLmN1c3RvbVBhY2tzID0gc3RhdGUuY3VzdG9tUGFja3M7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RyaXBQZXREZWZhdWx0cyA9IChwZXQ6IFBldENvbmZpZyB8IG51bGwpOiBTdHJpcHBlZFJlcGxheVBldCB8IG51bGwgPT4ge1xuICAgICAgaWYgKCFwZXQgfHwgIXBldC5uYW1lKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBuZXdQZXQ6IFN0cmlwcGVkUmVwbGF5UGV0ID0geyBuYW1lOiBwZXQubmFtZSB9O1xuXG4gICAgICBpZiAodHlwZW9mIHBldC5hdHRhY2sgPT09ICdudW1iZXInICYmIHBldC5hdHRhY2sgIT09IDApIHtcbiAgICAgICAgbmV3UGV0LmF0dGFjayA9IHBldC5hdHRhY2s7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHBldC5oZWFsdGggPT09ICdudW1iZXInICYmIHBldC5oZWFsdGggIT09IDApIHtcbiAgICAgICAgbmV3UGV0LmhlYWx0aCA9IHBldC5oZWFsdGg7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHBldC5leHAgPT09ICdudW1iZXInICYmIHBldC5leHAgIT09IDApIHtcbiAgICAgICAgbmV3UGV0LmV4cCA9IHBldC5leHA7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHBldC5tYW5hID09PSAnbnVtYmVyJyAmJiBwZXQubWFuYSAhPT0gMCkge1xuICAgICAgICBuZXdQZXQubWFuYSA9IHBldC5tYW5hO1xuICAgICAgfVxuICAgICAgaWYgKHBldC5lcXVpcG1lbnQpIHtcbiAgICAgICAgbmV3UGV0LmVxdWlwbWVudCA9IHBldC5lcXVpcG1lbnQ7XG4gICAgICB9XG4gICAgICBpZiAocGV0LnRyaWdnZXJzQ29uc3VtZWQpIHtcbiAgICAgICAgbmV3UGV0LnRyaWdnZXJzQ29uc3VtZWQgPSBwZXQudHJpZ2dlcnNDb25zdW1lZDtcbiAgICAgIH1cbiAgICAgIGlmIChwZXQuZm9vZHNFYXRlbikge1xuICAgICAgICBuZXdQZXQuZm9vZHNFYXRlbiA9IHBldC5mb29kc0VhdGVuO1xuICAgICAgfVxuICAgICAgaWYgKHBldC5haWxtZW50c0NvdW50KSB7XG4gICAgICAgIG5ld1BldC5haWxtZW50c0NvdW50ID0gcGV0LmFpbG1lbnRzQ291bnQ7XG4gICAgICB9XG4gICAgICBpZiAocGV0LmZyaWVuZHNIdXJ0QmVmb3JlQmF0dGxlKSB7XG4gICAgICAgIG5ld1BldC5mcmllbmRzSHVydEJlZm9yZUJhdHRsZSA9IHBldC5mcmllbmRzSHVydEJlZm9yZUJhdHRsZTtcbiAgICAgIH1cbiAgICAgIGlmIChwZXQuYmVsdWdhU3dhbGxvd2VkUGV0ICE9IG51bGwpIHtcbiAgICAgICAgbmV3UGV0LmJlbHVnYVN3YWxsb3dlZFBldCA9IHBldC5iZWx1Z2FTd2FsbG93ZWRQZXQ7XG4gICAgICB9XG4gICAgICBBQk9NSU5BVElPTl9TTE9UX0ZJRUxEUy5mb3JFYWNoKChzbG90RmllbGRzKSA9PiB7XG4gICAgICAgIGNvbnN0IHN3YWxsb3dlZFBldCA9IHBldFtzbG90RmllbGRzLnBldF07XG4gICAgICAgIGlmIChzd2FsbG93ZWRQZXQgIT0gbnVsbCkge1xuICAgICAgICAgIG5ld1BldFtzbG90RmllbGRzLnBldF0gPSBzd2FsbG93ZWRQZXQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3dhbGxvd2VkTGV2ZWwgPSBwZXRbc2xvdEZpZWxkcy5sZXZlbF07XG4gICAgICAgIGlmICh0eXBlb2Ygc3dhbGxvd2VkTGV2ZWwgPT09ICdudW1iZXInICYmIHN3YWxsb3dlZExldmVsICE9PSAxKSB7XG4gICAgICAgICAgbmV3UGV0W3Nsb3RGaWVsZHMubGV2ZWxdID0gc3dhbGxvd2VkTGV2ZWw7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYgKHBldC50aW1lc0h1cnQpIHtcbiAgICAgICAgbmV3UGV0LnRpbWVzSHVydCA9IHBldC50aW1lc0h1cnQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXdQZXQ7XG4gICAgfTtcblxuICAgIGNvbnN0IHN0cmlwcGVkUGxheWVyUGV0cyA9IHN0YXRlLnBsYXllclBldHMubWFwKHN0cmlwUGV0RGVmYXVsdHMpO1xuICAgIGlmIChzdHJpcHBlZFBsYXllclBldHMuc29tZSgocGV0KSA9PiBwZXQgIT09IG51bGwpKSB7XG4gICAgICBzdHJpcHBlZFN0YXRlLnBsYXllclBldHMgPSBzdHJpcHBlZFBsYXllclBldHM7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RyaXBwZWRPcHBvbmVudFBldHMgPSBzdGF0ZS5vcHBvbmVudFBldHMubWFwKHN0cmlwUGV0RGVmYXVsdHMpO1xuICAgIGlmIChzdHJpcHBlZE9wcG9uZW50UGV0cy5zb21lKChwZXQpID0+IHBldCAhPT0gbnVsbCkpIHtcbiAgICAgIHN0cmlwcGVkU3RhdGUub3Bwb25lbnRQZXRzID0gc3RyaXBwZWRPcHBvbmVudFBldHM7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0cmlwcGVkU3RhdGU7XG4gIH1cblxuICBwcml2YXRlIHRydW5jYXRlS2V5cyhkYXRhOiB1bmtub3duKTogdW5rbm93biB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIHJldHVybiBkYXRhLm1hcCgoaXRlbSkgPT4gdGhpcy50cnVuY2F0ZUtleXMoaXRlbSkpO1xuICAgIH1cbiAgICBpZiAoaXNSZWNvcmQoZGF0YSkpIHtcbiAgICAgIGNvbnN0IG5ld09iajogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPSB7fTtcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGRhdGEpKSB7XG4gICAgICAgIGNvbnN0IG5ld0tleSA9IEtFWV9NQVBba2V5XSB8fCBrZXk7XG4gICAgICAgIG5ld09ialtuZXdLZXldID0gdGhpcy50cnVuY2F0ZUtleXMoZGF0YVtrZXldKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXdPYmo7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBQZXRDb25maWcgfSBmcm9tICdhcHAvZG9tYWluL2ludGVyZmFjZXMvc2ltdWxhdGlvbi1jb25maWcuaW50ZXJmYWNlJztcblxudHlwZSBFcXVpcG1lbnRPYmplY3QgPSBFeGNsdWRlPFxuICBQZXRDb25maWdbJ2VxdWlwbWVudCddLFxuICBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkXG4+O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGV0Q29uZmlnRXF1aXBtZW50TmFtZShcbiAgZXF1aXBtZW50OiBQZXRDb25maWdbJ2VxdWlwbWVudCddLFxuKTogc3RyaW5nIHwgbnVsbCB7XG4gIHJldHVybiB0eXBlb2YgZXF1aXBtZW50ID09PSAnc3RyaW5nJyA/IGVxdWlwbWVudCA6IChlcXVpcG1lbnQ/Lm5hbWUgPz8gbnVsbCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9uZVBldENvbmZpZ0VxdWlwbWVudChcbiAgZXF1aXBtZW50OiBQZXRDb25maWdbJ2VxdWlwbWVudCddLFxuKTogRXF1aXBtZW50T2JqZWN0IHwgbnVsbCB7XG4gIGlmICghZXF1aXBtZW50KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHR5cGVvZiBlcXVpcG1lbnQgPT09ICdzdHJpbmcnID8geyBuYW1lOiBlcXVpcG1lbnQgfSA6IHsgLi4uZXF1aXBtZW50IH07XG59XG4iLCAiaW1wb3J0IHsgUGV0Q29uZmlnIH0gZnJvbSAnYXBwL2RvbWFpbi9pbnRlcmZhY2VzL3NpbXVsYXRpb24tY29uZmlnLmludGVyZmFjZSc7XG5pbXBvcnQgeyBjbG9uZVBldENvbmZpZ0VxdWlwbWVudCB9IGZyb20gJy4uL2VxdWlwbWVudC9wZXQtY29uZmlnLWVxdWlwbWVudCc7XG5cbmNvbnN0IFBBUlJPVF9NRU1PUllfUFJFRklYID0gJ3BhcnJvdENvcHlQZXQnO1xuY29uc3QgQUJPTUlOQVRJT05fTUVNT1JZX1BSRUZJWCA9ICdhYm9taW5hdGlvblN3YWxsb3dlZFBldCc7XG5cbmZ1bmN0aW9uIGNsb25lUGV0KHBldDogUGV0Q29uZmlnIHwgbnVsbCk6IFBldENvbmZpZyB8IG51bGwge1xuICBpZiAoIXBldCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiB7XG4gICAgLi4ucGV0LFxuICAgIGVxdWlwbWVudDogY2xvbmVQZXRDb25maWdFcXVpcG1lbnQocGV0LmVxdWlwbWVudCksXG4gIH07XG59XG5cbmZ1bmN0aW9uIGNsZWFyUGFycm90TWVtb3J5KHBldDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pOiB2b2lkIHtcbiAgT2JqZWN0LmtleXMocGV0KS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoUEFSUk9UX01FTU9SWV9QUkVGSVgpKSB7XG4gICAgICBkZWxldGUgcGV0W2tleV07XG4gICAgfVxuICB9KTtcbiAgcGV0LnBhcnJvdENvcHlQZXQgPSBudWxsO1xufVxuXG5mdW5jdGlvbiBjb3B5UmVzb2x2ZWRQYXJyb3RNZW1vcnkoXG4gIHRhcmdldDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4gIHBhcnJvdDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4pOiB2b2lkIHtcbiAgT2JqZWN0LmVudHJpZXModGFyZ2V0KS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoUEFSUk9UX01FTU9SWV9QUkVGSVgpKSB7XG4gICAgICBwYXJyb3Rba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNvcHlUYXJnZXRNZW1vcnkoXG4gIHRhcmdldDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4gIHBhcnJvdDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4pOiB2b2lkIHtcbiAgcGFycm90LnBhcnJvdENvcHlQZXQgPSB0YXJnZXQubmFtZSA/PyBudWxsO1xuICBpZiAodGFyZ2V0Lm5hbWUgPT09ICdCZWx1Z2EgV2hhbGUnKSB7XG4gICAgcGFycm90LnBhcnJvdENvcHlQZXRCZWx1Z2FTd2FsbG93ZWRQZXQgPVxuICAgICAgdGFyZ2V0LmJlbHVnYVN3YWxsb3dlZFBldCA/PyBudWxsO1xuICB9XG4gIGlmICh0YXJnZXQubmFtZSAhPT0gJ0Fib21pbmF0aW9uJykge1xuICAgIHJldHVybjtcbiAgfVxuICBPYmplY3QuZW50cmllcyh0YXJnZXQpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgIGlmICgha2V5LnN0YXJ0c1dpdGgoQUJPTUlOQVRJT05fTUVNT1JZX1BSRUZJWCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcGFycm90W2Ake1BBUlJPVF9NRU1PUllfUFJFRklYfSR7a2V5WzBdLnRvVXBwZXJDYXNlKCl9JHtrZXkuc2xpY2UoMSl9YF0gPVxuICAgICAgdmFsdWU7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBmaW5kTmVhcmVzdFBldEFoZWFkKFxuICBsaW5ldXA6IChQZXRDb25maWcgfCBudWxsKVtdLFxuICBpbmRleDogbnVtYmVyLFxuKTogUGV0Q29uZmlnIHwgbnVsbCB7XG4gIGZvciAobGV0IGFoZWFkSW5kZXggPSBpbmRleCAtIDE7IGFoZWFkSW5kZXggPj0gMDsgYWhlYWRJbmRleCAtPSAxKSB7XG4gICAgY29uc3QgY2FuZGlkYXRlID0gbGluZXVwW2FoZWFkSW5kZXhdO1xuICAgIGlmIChjYW5kaWRhdGU/Lm5hbWUpIHtcbiAgICAgIHJldHVybiBjYW5kaWRhdGU7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIFJlZnJlc2hlcyBtZW1vcnkgdGhhdCBpcyBkZXRlcm1pbmVkIGJ5IHRoZSBjYW5kaWRhdGUncyBwb3NpdGlvbnMgcmF0aGVyXG4gKiB0aGFuIGJ5IHRoZSBwZXQgaWRlbnRpdHkgdGhhdCBtb3ZlZCBpbnRvIHRoYXQgcG9zaXRpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWZyZXNoUG9zaXRpb25pbmdMaW5ldXBNZW1vcnkoXG4gIGxpbmV1cDogKFBldENvbmZpZyB8IG51bGwpW10sXG4pOiAoUGV0Q29uZmlnIHwgbnVsbClbXSB7XG4gIGNvbnN0IHJlZnJlc2hlZCA9IGxpbmV1cC5tYXAoY2xvbmVQZXQpO1xuICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgcmVmcmVzaGVkLmxlbmd0aDsgaW5kZXggKz0gMSkge1xuICAgIGNvbnN0IHBldCA9IHJlZnJlc2hlZFtpbmRleF07XG4gICAgaWYgKHBldD8ubmFtZSAhPT0gJ1BhcnJvdCcpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCBwZXRSZWNvcmQgPSBwZXQgYXMgdW5rbm93biBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbiAgICBjbGVhclBhcnJvdE1lbW9yeShwZXRSZWNvcmQpO1xuICAgIGNvbnN0IHRhcmdldCA9IGZpbmROZWFyZXN0UGV0QWhlYWQocmVmcmVzaGVkLCBpbmRleCk7XG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCB0YXJnZXRSZWNvcmQgPSB0YXJnZXQgYXMgdW5rbm93biBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbiAgICBpZiAodGFyZ2V0Lm5hbWUgPT09ICdQYXJyb3QnKSB7XG4gICAgICBjb3B5UmVzb2x2ZWRQYXJyb3RNZW1vcnkodGFyZ2V0UmVjb3JkLCBwZXRSZWNvcmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb3B5VGFyZ2V0TWVtb3J5KHRhcmdldFJlY29yZCwgcGV0UmVjb3JkKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlZnJlc2hlZDtcbn1cbiIsICJpbXBvcnQge1xuICBQZXRDb25maWcsXG4gIFNpbXVsYXRpb25Db25maWcsXG4gIFNpbXVsYXRpb25SZXN1bHQsXG59IGZyb20gJ2FwcC9kb21haW4vaW50ZXJmYWNlcy9zaW11bGF0aW9uLWNvbmZpZy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgcmVmcmVzaFBvc2l0aW9uaW5nTGluZXVwTWVtb3J5IH0gZnJvbSAnLi9wb3NpdGlvbmluZy1saW5ldXAtbWVtb3J5JztcblxuZXhwb3J0IHR5cGUgUG9zaXRpb25pbmdPcHRpbWl6YXRpb25TaWRlID0gJ3BsYXllcicgfCAnb3Bwb25lbnQnO1xuZXhwb3J0IHR5cGUgUG9zaXRpb25pbmdPcHRpbWl6YXRpb25QcmVjaXNpb24gPSAncXVpY2snIHwgJ2V4dGVuZGVkJztcblxuY29uc3QgUE9TSVRJT05JTkdfU0lNVUxBVElPTl9CVURHRVRTOiBSZWFkb25seTxcbiAgUmVjb3JkPFBvc2l0aW9uaW5nT3B0aW1pemF0aW9uUHJlY2lzaW9uLCB7IHRvdGFsOiBudW1iZXI7IG1heGltdW06IG51bWJlciB9PlxuPiA9IHtcbiAgcXVpY2s6IHsgdG90YWw6IDEyXzAwMCwgbWF4aW11bTogMV8wMDAgfSxcbiAgZXh0ZW5kZWQ6IHsgdG90YWw6IDYwXzAwMCwgbWF4aW11bTogNV8wMDAgfSxcbn07XG5cbi8qKlxuICogS2VlcHMgb3B0aW1pemVyIHdvcmsgcHJlZGljdGFibGUgYXMgdGhlIG51bWJlciBvZiBtZWFuaW5nZnVsIGJvYXJkIG9yZGVyc1xuICogZ3Jvd3MuIEVtcHR5IHNsb3RzIHN0aWxsIG1hdHRlciBiZWNhdXNlIHBldHMgY2FuIGJlIG1vdmVkIGludG8gdGhlbS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFBvc2l0aW9uaW5nU2ltdWxhdGlvbkNvdW50KFxuICBsaW5ldXA6IHJlYWRvbmx5IChQZXRDb25maWcgfCBudWxsIHwgdW5kZWZpbmVkKVtdLFxuICBwcmVjaXNpb246IFBvc2l0aW9uaW5nT3B0aW1pemF0aW9uUHJlY2lzaW9uID0gJ3F1aWNrJyxcbik6IG51bWJlciB7XG4gIGNvbnN0IG9jY3VwaWVkU2xvdHMgPSBNYXRoLm1pbihcbiAgICA1LFxuICAgIGxpbmV1cC5yZWR1Y2UoKGNvdW50LCBwZXQpID0+IGNvdW50ICsgKHBldCA/IDEgOiAwKSwgMCksXG4gICk7XG4gIGNvbnN0IG1lYW5pbmdmdWxPcmRlcnMgPSBwZXJtdXRhdGlvbkNvdW50KDUsIG9jY3VwaWVkU2xvdHMpO1xuICBjb25zdCBwcm9maWxlID0gUE9TSVRJT05JTkdfU0lNVUxBVElPTl9CVURHRVRTW3ByZWNpc2lvbl07XG4gIHJldHVybiBNYXRoLm1heChcbiAgICAyNSxcbiAgICBNYXRoLm1pbihwcm9maWxlLm1heGltdW0sIE1hdGguZmxvb3IocHJvZmlsZS50b3RhbCAvIG1lYW5pbmdmdWxPcmRlcnMpKSxcbiAgKTtcbn1cblxuZnVuY3Rpb24gcGVybXV0YXRpb25Db3VudChzbG90Q291bnQ6IG51bWJlciwgb2NjdXBpZWRTbG90czogbnVtYmVyKTogbnVtYmVyIHtcbiAgbGV0IHJlc3VsdCA9IDE7XG4gIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBvY2N1cGllZFNsb3RzOyBpbmRleCArPSAxKSB7XG4gICAgcmVzdWx0ICo9IHNsb3RDb3VudCAtIGluZGV4O1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUG9zaXRpb25pbmdPcHRpbWl6ZXJPcHRpb25zIHtcbiAgc2lkZTogUG9zaXRpb25pbmdPcHRpbWl6YXRpb25TaWRlO1xuICBtYXhTaW11bGF0aW9uc1BlclBlcm11dGF0aW9uOiBudW1iZXI7XG4gIGJhdGNoU2l6ZTogbnVtYmVyO1xuICBjb25maWRlbmNlWjogbnVtYmVyO1xuICBtaW5TYW1wbGVzQmVmb3JlRWxpbWluYXRpb246IG51bWJlcjtcbiAgYmFzZVNlZWQ6IG51bWJlcjtcbiAga2VlcFNhbWVCdWZmVGFyZ2V0czogYm9vbGVhbjtcbiAgcmVjb21wdXRlUGFycm90Q29waWVzOiBib29sZWFuO1xuICBzdWNjZXNzaXZlSGFsdmluZzogYm9vbGVhbjtcbiAgc3VjY2Vzc2l2ZUhhbHZpbmdSYXRlOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUG9zaXRpb25pbmdPcHRpbWl6ZXJQcm9ncmVzcyB7XG4gIGNvbXBsZXRlZEJhdHRsZXM6IG51bWJlcjtcbiAgdG90YWxCYXR0bGVzRXN0aW1hdGU6IG51bWJlcjtcbiAgdGVzdGVkUGVybXV0YXRpb25zOiBudW1iZXI7XG4gIGFjdGl2ZVBlcm11dGF0aW9uczogbnVtYmVyO1xuICBiZXN0U2NvcmU6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQb3NpdGlvbmluZ1Blcm11dGF0aW9uU3RhdHMge1xuICBvcmRlcjogbnVtYmVyW107XG4gIGxpbmV1cDogKFBldENvbmZpZyB8IG51bGwpW107XG4gIHNpbXVsYXRpb25MaW5ldXA6IChQZXRDb25maWcgfCBudWxsKVtdO1xuICBzaW11bGF0aW9uczogbnVtYmVyO1xuICB3aW5zOiBudW1iZXI7XG4gIGRyYXdzOiBudW1iZXI7XG4gIGxvc3NlczogbnVtYmVyO1xuICBzY29yZTogbnVtYmVyO1xuICBsb3dlckJvdW5kOiBudW1iZXI7XG4gIHVwcGVyQm91bmQ6IG51bWJlcjtcbiAgZWxpbWluYXRlZDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQb3NpdGlvbmluZ09wdGltaXphdGlvblJlc3VsdCB7XG4gIHNpZGU6IFBvc2l0aW9uaW5nT3B0aW1pemF0aW9uU2lkZTtcbiAgdG90YWxQZXJtdXRhdGlvbnM6IG51bWJlcjtcbiAgcHJ1bmVkUGVybXV0YXRpb25zOiBudW1iZXI7XG4gIHNpbXVsYXRlZEJhdHRsZXM6IG51bWJlcjtcbiAgYWJvcnRlZDogYm9vbGVhbjtcbiAgYmVzdFBlcm11dGF0aW9uOiBQb3NpdGlvbmluZ1Blcm11dGF0aW9uU3RhdHM7XG4gIHJhbmtlZFBlcm11dGF0aW9uczogUG9zaXRpb25pbmdQZXJtdXRhdGlvblN0YXRzW107XG59XG5cbmludGVyZmFjZSBDYW5kaWRhdGVTdGF0ZSBleHRlbmRzIFBvc2l0aW9uaW5nUGVybXV0YXRpb25TdGF0cyB7XG4gIHJvdW5kczogbnVtYmVyO1xuICBzaW11bGF0aW9uTGluZXVwOiAoUGV0Q29uZmlnIHwgbnVsbClbXSB8IG51bGw7XG4gIGxpbmV1cFNpZ25hdHVyZTogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgUnVuUG9zaXRpb25pbmdPcHRpbWl6YXRpb25QYXJhbXMge1xuICBiYXNlQ29uZmlnOiBTaW11bGF0aW9uQ29uZmlnO1xuICBvcHRpb25zOiBQYXJ0aWFsPFBvc2l0aW9uaW5nT3B0aW1pemVyT3B0aW9ucz4gJiB7XG4gICAgc2lkZTogUG9zaXRpb25pbmdPcHRpbWl6YXRpb25TaWRlO1xuICB9O1xuICBzaG91bGRBYm9ydD86ICgpID0+IGJvb2xlYW47XG4gIG9uUHJvZ3Jlc3M/OiAocHJvZ3Jlc3M6IFBvc2l0aW9uaW5nT3B0aW1pemVyUHJvZ3Jlc3MpID0+IHZvaWQ7XG4gIHNpbXVsYXRlQmF0Y2g6IChjb25maWc6IFNpbXVsYXRpb25Db25maWcpID0+IFNpbXVsYXRpb25SZXN1bHQ7XG4gIHByb2plY3RFbmRUdXJuTGluZXVwPzogKHBhcmFtczoge1xuICAgIGJhc2VDb25maWc6IFNpbXVsYXRpb25Db25maWc7XG4gICAgc2lkZTogUG9zaXRpb25pbmdPcHRpbWl6YXRpb25TaWRlO1xuICAgIGxpbmV1cDogKFBldENvbmZpZyB8IG51bGwpW107XG4gIH0pID0+IChQZXRDb25maWcgfCBudWxsKVtdO1xufVxuXG5jb25zdCBERUZBVUxUX01BWF9TSU1VTEFUSU9OU19QRVJfUEVSTVVUQVRJT04gPSAyNTA7XG5jb25zdCBERUZBVUxUX0JBVENIX1NJWkUgPSAyNTtcbmNvbnN0IERFRkFVTFRfQ09ORklERU5DRV9aID0gMS45NjtcbmNvbnN0IERFRkFVTFRfTUlOX1NBTVBMRVNfQkVGT1JFX0VMSU1JTkFUSU9OID0gNTA7XG5jb25zdCBERUZBVUxUX0JBU0VfU0VFRCA9IDEyMzQ1Njc4OTtcblxuZXhwb3J0IGZ1bmN0aW9uIHJ1blBvc2l0aW9uaW5nT3B0aW1pemF0aW9uKFxuICBwYXJhbXM6IFJ1blBvc2l0aW9uaW5nT3B0aW1pemF0aW9uUGFyYW1zLFxuKTogUG9zaXRpb25pbmdPcHRpbWl6YXRpb25SZXN1bHQge1xuICBjb25zdCB7XG4gICAgYmFzZUNvbmZpZyxcbiAgICBzaW11bGF0ZUJhdGNoLFxuICAgIHNob3VsZEFib3J0LFxuICAgIG9uUHJvZ3Jlc3MsXG4gICAgcHJvamVjdEVuZFR1cm5MaW5ldXAsXG4gIH0gPSBwYXJhbXM7XG4gIGNvbnN0IHNpZGUgPSBwYXJhbXMub3B0aW9ucy5zaWRlO1xuICBjb25zdCBrZWVwU2FtZUJ1ZmZUYXJnZXRzID0gcGFyYW1zLm9wdGlvbnMua2VlcFNhbWVCdWZmVGFyZ2V0cyA9PT0gdHJ1ZTtcbiAgY29uc3QgcmVjb21wdXRlUGFycm90Q29waWVzID1cbiAgICBwYXJhbXMub3B0aW9ucy5yZWNvbXB1dGVQYXJyb3RDb3BpZXMgIT09IGZhbHNlO1xuICBjb25zdCBzdWNjZXNzaXZlSGFsdmluZyA9IHBhcmFtcy5vcHRpb25zLnN1Y2Nlc3NpdmVIYWx2aW5nID09PSB0cnVlO1xuICBjb25zdCBzdWNjZXNzaXZlSGFsdmluZ1JhdGUgPSBNYXRoLm1pbihcbiAgICAwLjksXG4gICAgTWF0aC5tYXgoMC4xLCBwYXJhbXMub3B0aW9ucy5zdWNjZXNzaXZlSGFsdmluZ1JhdGUgPz8gMC41KSxcbiAgKTtcbiAgY29uc3QgcHJvamVjdGVkTGluZXVwQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywgKFBldENvbmZpZyB8IG51bGwpW10+KCk7XG5cbiAgY29uc3QgbWF4U2ltdWxhdGlvbnNQZXJQZXJtdXRhdGlvbiA9IE1hdGgubWF4KFxuICAgIDEsXG4gICAgTWF0aC50cnVuYyhcbiAgICAgIHBhcmFtcy5vcHRpb25zLm1heFNpbXVsYXRpb25zUGVyUGVybXV0YXRpb24gPz9cbiAgICAgICAgYmFzZUNvbmZpZy5zaW11bGF0aW9uQ291bnQgPz9cbiAgICAgICAgREVGQVVMVF9NQVhfU0lNVUxBVElPTlNfUEVSX1BFUk1VVEFUSU9OLFxuICAgICksXG4gICk7XG4gIGNvbnN0IGJhdGNoU2l6ZSA9IE1hdGgubWF4KFxuICAgIDEsXG4gICAgTWF0aC50cnVuYyhwYXJhbXMub3B0aW9ucy5iYXRjaFNpemUgPz8gREVGQVVMVF9CQVRDSF9TSVpFKSxcbiAgKTtcbiAgY29uc3QgY29uZmlkZW5jZVogPVxuICAgIHBhcmFtcy5vcHRpb25zLmNvbmZpZGVuY2VaICE9IG51bGwgJiZcbiAgICBOdW1iZXIuaXNGaW5pdGUocGFyYW1zLm9wdGlvbnMuY29uZmlkZW5jZVopXG4gICAgICA/IE1hdGgubWF4KDAsIHBhcmFtcy5vcHRpb25zLmNvbmZpZGVuY2VaKVxuICAgICAgOiBERUZBVUxUX0NPTkZJREVOQ0VfWjtcbiAgY29uc3QgbWluU2FtcGxlc0JlZm9yZUVsaW1pbmF0aW9uID0gTWF0aC5tYXgoXG4gICAgMSxcbiAgICBNYXRoLnRydW5jKFxuICAgICAgcGFyYW1zLm9wdGlvbnMubWluU2FtcGxlc0JlZm9yZUVsaW1pbmF0aW9uID8/XG4gICAgICAgIERFRkFVTFRfTUlOX1NBTVBMRVNfQkVGT1JFX0VMSU1JTkFUSU9OLFxuICAgICksXG4gICk7XG4gIGNvbnN0IGJhc2VTZWVkID1cbiAgICBwYXJhbXMub3B0aW9ucy5iYXNlU2VlZCAhPSBudWxsICYmIE51bWJlci5pc0Zpbml0ZShwYXJhbXMub3B0aW9ucy5iYXNlU2VlZClcbiAgICAgID8gTWF0aC50cnVuYyhwYXJhbXMub3B0aW9ucy5iYXNlU2VlZClcbiAgICAgIDogYmFzZUNvbmZpZy5zZWVkICE9IG51bGwgJiYgTnVtYmVyLmlzRmluaXRlKGJhc2VDb25maWcuc2VlZClcbiAgICAgICAgPyBNYXRoLnRydW5jKGJhc2VDb25maWcuc2VlZClcbiAgICAgICAgOiBERUZBVUxUX0JBU0VfU0VFRDtcblxuICBjb25zdCBwZXRzS2V5ID0gc2lkZSA9PT0gJ3BsYXllcicgPyAncGxheWVyUGV0cycgOiAnb3Bwb25lbnRQZXRzJztcbiAgY29uc3Qgc2lkZVBldHMgPSAoYmFzZUNvbmZpZ1twZXRzS2V5XSA/PyBbXSkuc2xpY2UoKTtcbiAgY29uc3QgYmFzZWxpbmVMaW5ldXBEZWx0YXMgPSBwcm9qZWN0RW5kVHVybkxpbmV1cCAmJiAha2VlcFNhbWVCdWZmVGFyZ2V0c1xuICAgID8gY29tcHV0ZUxpbmV1cE51bWVyaWNEZWx0YXMoXG4gICAgICAgIHNpZGVQZXRzLFxuICAgICAgICBub3JtYWxpemVMaW5ldXBMZW5ndGgoXG4gICAgICAgICAgcHJvamVjdEVuZFR1cm5MaW5ldXAoe1xuICAgICAgICAgICAgYmFzZUNvbmZpZyxcbiAgICAgICAgICAgIHNpZGUsXG4gICAgICAgICAgICBsaW5ldXA6IHNpZGVQZXRzLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIHNpZGVQZXRzLmxlbmd0aCxcbiAgICAgICAgKSxcbiAgICAgIClcbiAgICA6IG51bGw7XG4gIGNvbnN0IHBlcm11dGF0aW9ucyA9IGdlbmVyYXRlSW5kZXhQZXJtdXRhdGlvbnMoc2lkZVBldHMpO1xuICBjb25zdCBjYW5kaWRhdGVzOiBDYW5kaWRhdGVTdGF0ZVtdID0gcGVybXV0YXRpb25zLm1hcCgob3JkZXIpID0+IHtcbiAgICBjb25zdCBsaW5ldXAgPSBhcHBseU9yZGVyKHNpZGVQZXRzLCBvcmRlcik7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9yZGVyOiBbLi4ub3JkZXJdLFxuICAgICAgbGluZXVwLFxuICAgICAgc2ltdWxhdGlvbnM6IDAsXG4gICAgICB3aW5zOiAwLFxuICAgICAgZHJhd3M6IDAsXG4gICAgICBsb3NzZXM6IDAsXG4gICAgICBzY29yZTogMCxcbiAgICAgIGxvd2VyQm91bmQ6IDAsXG4gICAgICB1cHBlckJvdW5kOiAxLFxuICAgICAgZWxpbWluYXRlZDogZmFsc2UsXG4gICAgICByb3VuZHM6IDAsXG4gICAgICBzaW11bGF0aW9uTGluZXVwOiBrZWVwU2FtZUJ1ZmZUYXJnZXRzXG4gICAgICAgID8gcmVjb21wdXRlUGFycm90Q29waWVzXG4gICAgICAgICAgPyByZWZyZXNoUG9zaXRpb25pbmdMaW5ldXBNZW1vcnkobGluZXVwKVxuICAgICAgICAgIDogbGluZXVwXG4gICAgICAgIDogbnVsbCxcbiAgICAgIGxpbmV1cFNpZ25hdHVyZTogJycsXG4gICAgfTtcbiAgfSk7XG4gIGNhbmRpZGF0ZXMuZm9yRWFjaCgoY2FuZGlkYXRlKSA9PiB7XG4gICAgY2FuZGlkYXRlLmxpbmV1cFNpZ25hdHVyZSA9IGJ1aWxkTGluZXVwU2lnbmF0dXJlKGNhbmRpZGF0ZS5saW5ldXApO1xuICB9KTtcblxuICBsZXQgY29tcGxldGVkQmF0dGxlcyA9IDA7XG4gIGNvbnN0IHRvdGFsQmF0dGxlc0VzdGltYXRlID0gcGVybXV0YXRpb25zLmxlbmd0aCAqIG1heFNpbXVsYXRpb25zUGVyUGVybXV0YXRpb247XG4gIGxldCByb3VuZCA9IDA7XG4gIGxldCBhYm9ydGVkID0gZmFsc2U7XG5cbiAgaWYgKGNhbmRpZGF0ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgZ2VuZXJhdGUgYW55IGJvYXJkIHBlcm11dGF0aW9ucy4nKTtcbiAgfVxuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgaWYgKHNob3VsZEFib3J0Py4oKSkge1xuICAgICAgYWJvcnRlZCA9IHRydWU7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBjb25zdCBhY3RpdmVDYW5kaWRhdGVzID0gY2FuZGlkYXRlcy5maWx0ZXIoKGNhbmRpZGF0ZSkgPT4gIWNhbmRpZGF0ZS5lbGltaW5hdGVkKTtcbiAgICBpZiAoYWN0aXZlQ2FuZGlkYXRlcy5sZW5ndGggPD0gMSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VlZEZvclJvdW5kID0gYmFzZVNlZWQgKyByb3VuZDtcbiAgICBsZXQgcmFuQW55QmF0Y2ggPSBmYWxzZTtcblxuICAgIGZvciAoY29uc3QgY2FuZGlkYXRlIG9mIGFjdGl2ZUNhbmRpZGF0ZXMpIHtcbiAgICAgIGlmIChzaG91bGRBYm9ydD8uKCkpIHtcbiAgICAgICAgYWJvcnRlZCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2FuZGlkYXRlLnNpbXVsYXRpb25zID49IG1heFNpbXVsYXRpb25zUGVyUGVybXV0YXRpb24pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlbWFpbmluZyA9IG1heFNpbXVsYXRpb25zUGVyUGVybXV0YXRpb24gLSBjYW5kaWRhdGUuc2ltdWxhdGlvbnM7XG4gICAgICBjb25zdCBzaW11bGF0aW9uc1RvUnVuID0gTWF0aC5taW4oYmF0Y2hTaXplLCByZW1haW5pbmcpO1xuICAgICAgaWYgKHNpbXVsYXRpb25zVG9SdW4gPD0gMCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgcmFuQW55QmF0Y2ggPSB0cnVlO1xuICAgICAgY29uc3Qgc2ltdWxhdGlvbkxpbmV1cCA9IGdldENhbmRpZGF0ZVNpbXVsYXRpb25MaW5ldXAoXG4gICAgICAgIGNhbmRpZGF0ZSxcbiAgICAgICAge1xuICAgICAgICAgIGtlZXBTYW1lQnVmZlRhcmdldHMsXG4gICAgICAgICAgcmVjb21wdXRlUGFycm90Q29waWVzLFxuICAgICAgICAgIGJhc2VDb25maWcsXG4gICAgICAgICAgc2lkZSxcbiAgICAgICAgICBzaWRlUGV0cyxcbiAgICAgICAgICBiYXNlbGluZUxpbmV1cERlbHRhcyxcbiAgICAgICAgICBwcm9qZWN0RW5kVHVybkxpbmV1cCxcbiAgICAgICAgfSxcbiAgICAgICAgcHJvamVjdGVkTGluZXVwQ2FjaGUsXG4gICAgICApO1xuICAgICAgY29uc3QgYmF0Y2hDb25maWcgPSB7XG4gICAgICAgIC4uLmJhc2VDb25maWcsXG4gICAgICAgIFtwZXRzS2V5XTogc2ltdWxhdGlvbkxpbmV1cCxcbiAgICAgICAgc2ltdWxhdGlvbkNvdW50OiBzaW11bGF0aW9uc1RvUnVuLFxuICAgICAgICBsb2dzRW5hYmxlZDogZmFsc2UsXG4gICAgICAgIG1heExvZ2dlZEJhdHRsZXM6IDAsXG4gICAgICAgIGNhcHR1cmVSYW5kb21EZWNpc2lvbnM6IGZhbHNlLFxuICAgICAgICByYW5kb21EZWNpc2lvbk92ZXJyaWRlczogW10sXG4gICAgICAgIHNlZWQ6IHNlZWRGb3JSb3VuZCxcbiAgICAgIH0gYXMgU2ltdWxhdGlvbkNvbmZpZztcblxuICAgICAgY29uc3QgcmVzdWx0ID0gc2ltdWxhdGVCYXRjaChiYXRjaENvbmZpZyk7XG4gICAgICBjb25zdCBvYmplY3RpdmVXaW5zID1cbiAgICAgICAgc2lkZSA9PT0gJ3BsYXllcicgPyByZXN1bHQucGxheWVyV2lucyA6IHJlc3VsdC5vcHBvbmVudFdpbnM7XG4gICAgICBjb25zdCBvYmplY3RpdmVMb3NzZXMgPVxuICAgICAgICBzaWRlID09PSAncGxheWVyJyA/IHJlc3VsdC5vcHBvbmVudFdpbnMgOiByZXN1bHQucGxheWVyV2lucztcbiAgICAgIGNhbmRpZGF0ZS5zaW11bGF0aW9ucyArPSBzaW11bGF0aW9uc1RvUnVuO1xuICAgICAgY2FuZGlkYXRlLnJvdW5kcyArPSAxO1xuICAgICAgY2FuZGlkYXRlLndpbnMgKz0gb2JqZWN0aXZlV2lucztcbiAgICAgIGNhbmRpZGF0ZS5kcmF3cyArPSByZXN1bHQuZHJhd3M7XG4gICAgICBjYW5kaWRhdGUubG9zc2VzICs9IG9iamVjdGl2ZUxvc3NlcztcbiAgICAgIHVwZGF0ZUNhbmRpZGF0ZVN0YXRzKGNhbmRpZGF0ZSwgY29uZmlkZW5jZVopO1xuICAgICAgY29tcGxldGVkQmF0dGxlcyArPSBzaW11bGF0aW9uc1RvUnVuO1xuXG4gICAgICBjb25zdCB0ZXN0ZWRQZXJtdXRhdGlvbnMgPSBjYW5kaWRhdGVzLmZpbHRlcigoZW50cnkpID0+IGVudHJ5LnNpbXVsYXRpb25zID4gMClcbiAgICAgICAgLmxlbmd0aDtcbiAgICAgIGNvbnN0IGJlc3RTY29yZSA9IE1hdGgubWF4KC4uLmNhbmRpZGF0ZXMubWFwKChlbnRyeSkgPT4gZW50cnkuc2NvcmUpKTtcbiAgICAgIG9uUHJvZ3Jlc3M/Lih7XG4gICAgICAgIGNvbXBsZXRlZEJhdHRsZXMsXG4gICAgICAgIHRvdGFsQmF0dGxlc0VzdGltYXRlLFxuICAgICAgICB0ZXN0ZWRQZXJtdXRhdGlvbnMsXG4gICAgICAgIGFjdGl2ZVBlcm11dGF0aW9uczogY2FuZGlkYXRlcy5maWx0ZXIoKGVudHJ5KSA9PiAhZW50cnkuZWxpbWluYXRlZCkubGVuZ3RoLFxuICAgICAgICBiZXN0U2NvcmUsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoYWJvcnRlZCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKCFyYW5BbnlCYXRjaCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY29uc3QgYWN0aXZlQWZ0ZXJSb3VuZCA9IGNhbmRpZGF0ZXMuZmlsdGVyKChjYW5kaWRhdGUpID0+ICFjYW5kaWRhdGUuZWxpbWluYXRlZCk7XG4gICAgZm9yIChjb25zdCBjYW5kaWRhdGUgb2YgYWN0aXZlQWZ0ZXJSb3VuZCkge1xuICAgICAgdXBkYXRlQ2FuZGlkYXRlU3RhdHMoY2FuZGlkYXRlLCBjb25maWRlbmNlWik7XG4gICAgfVxuXG4gICAgY29uc3QgZWxpZ2libGVGb3JFbGltaW5hdGlvbiA9IGFjdGl2ZUFmdGVyUm91bmQuZmlsdGVyKFxuICAgICAgKGNhbmRpZGF0ZSkgPT4gY2FuZGlkYXRlLnNpbXVsYXRpb25zID49IG1pblNhbXBsZXNCZWZvcmVFbGltaW5hdGlvbixcbiAgICApO1xuICAgIGlmIChlbGlnaWJsZUZvckVsaW1pbmF0aW9uLmxlbmd0aCA+IDEpIHtcbiAgICAgIGNvbnN0IGJlc3RMb3dlckJvdW5kID0gTWF0aC5tYXgoXG4gICAgICAgIC4uLmVsaWdpYmxlRm9yRWxpbWluYXRpb24ubWFwKChjYW5kaWRhdGUpID0+IGNhbmRpZGF0ZS5sb3dlckJvdW5kKSxcbiAgICAgICk7XG4gICAgICBmb3IgKGNvbnN0IGNhbmRpZGF0ZSBvZiBlbGlnaWJsZUZvckVsaW1pbmF0aW9uKSB7XG4gICAgICAgIGlmIChjYW5kaWRhdGUudXBwZXJCb3VuZCA8IGJlc3RMb3dlckJvdW5kKSB7XG4gICAgICAgICAgY2FuZGlkYXRlLmVsaW1pbmF0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN1Y2Nlc3NpdmVIYWx2aW5nKSB7XG4gICAgICBjb25zdCBoYWx2aW5nQ2FuZGlkYXRlcyA9IGNhbmRpZGF0ZXMuZmlsdGVyKFxuICAgICAgICAoY2FuZGlkYXRlKSA9PiAhY2FuZGlkYXRlLmVsaW1pbmF0ZWQsXG4gICAgICApO1xuICAgICAgaWYgKGhhbHZpbmdDYW5kaWRhdGVzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgY29uc3Qgc3Vydml2b3JzID0gTWF0aC5tYXgoXG4gICAgICAgICAgMSxcbiAgICAgICAgICBNYXRoLmNlaWwoaGFsdmluZ0NhbmRpZGF0ZXMubGVuZ3RoICogc3VjY2Vzc2l2ZUhhbHZpbmdSYXRlKSxcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgcmFua2VkRm9yU2NyZWVuaW5nID0gWy4uLmhhbHZpbmdDYW5kaWRhdGVzXS5zb3J0KFxuICAgICAgICAgIChsZWZ0LCByaWdodCkgPT5cbiAgICAgICAgICAgIHJpZ2h0LnNjb3JlIC0gbGVmdC5zY29yZSB8fFxuICAgICAgICAgICAgcmlnaHQubG93ZXJCb3VuZCAtIGxlZnQubG93ZXJCb3VuZCB8fFxuICAgICAgICAgICAgcmlnaHQud2lucyAtIGxlZnQud2lucyB8fFxuICAgICAgICAgICAgbGVmdC5sb3NzZXMgLSByaWdodC5sb3NzZXMsXG4gICAgICAgICk7XG4gICAgICAgIHJhbmtlZEZvclNjcmVlbmluZy5zbGljZShzdXJ2aXZvcnMpLmZvckVhY2goKGNhbmRpZGF0ZSkgPT4ge1xuICAgICAgICAgIGNhbmRpZGF0ZS5lbGltaW5hdGVkID0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcm91bmQgKz0gMTtcbiAgfVxuXG4gIGZvciAoY29uc3QgY2FuZGlkYXRlIG9mIGNhbmRpZGF0ZXMpIHtcbiAgICB1cGRhdGVDYW5kaWRhdGVTdGF0cyhjYW5kaWRhdGUsIGNvbmZpZGVuY2VaKTtcbiAgfVxuXG4gIGNvbnN0IHJhbmtlZFBlcm11dGF0aW9ucyA9IFsuLi5jYW5kaWRhdGVzXS5zb3J0KChsZWZ0LCByaWdodCkgPT4ge1xuICAgIGlmIChyaWdodC5zY29yZSAhPT0gbGVmdC5zY29yZSkge1xuICAgICAgcmV0dXJuIHJpZ2h0LnNjb3JlIC0gbGVmdC5zY29yZTtcbiAgICB9XG4gICAgaWYgKHJpZ2h0Lmxvd2VyQm91bmQgIT09IGxlZnQubG93ZXJCb3VuZCkge1xuICAgICAgcmV0dXJuIHJpZ2h0Lmxvd2VyQm91bmQgLSBsZWZ0Lmxvd2VyQm91bmQ7XG4gICAgfVxuICAgIGlmIChyaWdodC5zaW11bGF0aW9ucyAhPT0gbGVmdC5zaW11bGF0aW9ucykge1xuICAgICAgcmV0dXJuIHJpZ2h0LnNpbXVsYXRpb25zIC0gbGVmdC5zaW11bGF0aW9ucztcbiAgICB9XG4gICAgcmV0dXJuIDA7XG4gIH0pO1xuXG4gIGNvbnN0IGJlc3RQZXJtdXRhdGlvbiA9IHJhbmtlZFBlcm11dGF0aW9uc1swXTtcbiAgaWYgKCFiZXN0UGVybXV0YXRpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Bvc2l0aW9uaW5nIG9wdGltaXphdGlvbiBmYWlsZWQgdG8gcmFuayBjYW5kaWRhdGVzLicpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzaWRlLFxuICAgIHRvdGFsUGVybXV0YXRpb25zOiBjYW5kaWRhdGVzLmxlbmd0aCxcbiAgICBwcnVuZWRQZXJtdXRhdGlvbnM6IGNhbmRpZGF0ZXMuZmlsdGVyKChjYW5kaWRhdGUpID0+IGNhbmRpZGF0ZS5lbGltaW5hdGVkKVxuICAgICAgLmxlbmd0aCxcbiAgICBzaW11bGF0ZWRCYXR0bGVzOiBjb21wbGV0ZWRCYXR0bGVzLFxuICAgIGFib3J0ZWQsXG4gICAgYmVzdFBlcm11dGF0aW9uOiBjbG9uZUNhbmRpZGF0ZVN0YXRzKGJlc3RQZXJtdXRhdGlvbiwgcmVjb21wdXRlUGFycm90Q29waWVzKSxcbiAgICByYW5rZWRQZXJtdXRhdGlvbnM6IHJhbmtlZFBlcm11dGF0aW9ucy5tYXAoKGNhbmRpZGF0ZSkgPT5cbiAgICAgIGNsb25lQ2FuZGlkYXRlU3RhdHMoY2FuZGlkYXRlLCByZWNvbXB1dGVQYXJyb3RDb3BpZXMpLFxuICAgICksXG4gIH07XG59XG5cbmZ1bmN0aW9uIGNsb25lQ2FuZGlkYXRlU3RhdHMoXG4gIGNhbmRpZGF0ZTogQ2FuZGlkYXRlU3RhdGUsXG4gIHJlY29tcHV0ZVBhcnJvdENvcGllczogYm9vbGVhbixcbik6IFBvc2l0aW9uaW5nUGVybXV0YXRpb25TdGF0cyB7XG4gIHJldHVybiB7XG4gICAgb3JkZXI6IFsuLi5jYW5kaWRhdGUub3JkZXJdLFxuICAgIGxpbmV1cDogWy4uLmNhbmRpZGF0ZS5saW5ldXBdLFxuICAgIHNpbXVsYXRpb25MaW5ldXA6IFtcbiAgICAgIC4uLihjYW5kaWRhdGUuc2ltdWxhdGlvbkxpbmV1cCA/P1xuICAgICAgICAocmVjb21wdXRlUGFycm90Q29waWVzXG4gICAgICAgICAgPyByZWZyZXNoUG9zaXRpb25pbmdMaW5ldXBNZW1vcnkoY2FuZGlkYXRlLmxpbmV1cClcbiAgICAgICAgICA6IGNhbmRpZGF0ZS5saW5ldXApKSxcbiAgICBdLFxuICAgIHNpbXVsYXRpb25zOiBjYW5kaWRhdGUuc2ltdWxhdGlvbnMsXG4gICAgd2luczogY2FuZGlkYXRlLndpbnMsXG4gICAgZHJhd3M6IGNhbmRpZGF0ZS5kcmF3cyxcbiAgICBsb3NzZXM6IGNhbmRpZGF0ZS5sb3NzZXMsXG4gICAgc2NvcmU6IGNhbmRpZGF0ZS5zY29yZSxcbiAgICBsb3dlckJvdW5kOiBjYW5kaWRhdGUubG93ZXJCb3VuZCxcbiAgICB1cHBlckJvdW5kOiBjYW5kaWRhdGUudXBwZXJCb3VuZCxcbiAgICBlbGltaW5hdGVkOiBjYW5kaWRhdGUuZWxpbWluYXRlZCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlQ2FuZGlkYXRlU3RhdHMoY2FuZGlkYXRlOiBDYW5kaWRhdGVTdGF0ZSwgelNjb3JlOiBudW1iZXIpOiB2b2lkIHtcbiAgY29uc3Qgc2ltdWxhdGlvbnMgPSBjYW5kaWRhdGUuc2ltdWxhdGlvbnM7XG4gIGlmIChzaW11bGF0aW9ucyA8PSAwKSB7XG4gICAgY2FuZGlkYXRlLnNjb3JlID0gMDtcbiAgICBjYW5kaWRhdGUubG93ZXJCb3VuZCA9IDA7XG4gICAgY2FuZGlkYXRlLnVwcGVyQm91bmQgPSAxO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHNjb3JlID0gc2NvcmVGcm9tVGFsbGllcyhjYW5kaWRhdGUud2lucywgY2FuZGlkYXRlLmRyYXdzLCBzaW11bGF0aW9ucyk7XG4gIGNvbnN0IHZhcmlhbmNlID0gTWF0aC5tYXgoMCwgc2NvcmUgKiAoMSAtIHNjb3JlKSk7XG4gIGNvbnN0IG1hcmdpbiA9IHpTY29yZSAqIE1hdGguc3FydCh2YXJpYW5jZSAvIHNpbXVsYXRpb25zKTtcbiAgY2FuZGlkYXRlLnNjb3JlID0gc2NvcmU7XG4gIGNhbmRpZGF0ZS5sb3dlckJvdW5kID0gTWF0aC5tYXgoMCwgc2NvcmUgLSBtYXJnaW4pO1xuICBjYW5kaWRhdGUudXBwZXJCb3VuZCA9IE1hdGgubWluKDEsIHNjb3JlICsgbWFyZ2luKTtcbn1cblxuZnVuY3Rpb24gc2NvcmVGcm9tVGFsbGllcyhcbiAgd2luczogbnVtYmVyLFxuICBkcmF3czogbnVtYmVyLFxuICBzaW11bGF0aW9uczogbnVtYmVyLFxuKTogbnVtYmVyIHtcbiAgaWYgKHNpbXVsYXRpb25zIDw9IDApIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICByZXR1cm4gKHdpbnMgKyBkcmF3cyAqIDAuNSkgLyBzaW11bGF0aW9ucztcbn1cblxuZnVuY3Rpb24gYXBwbHlPcmRlcjxUPihzb3VyY2U6IFRbXSwgb3JkZXI6IG51bWJlcltdKTogVFtdIHtcbiAgcmV0dXJuIG9yZGVyLm1hcCgoaW5kZXgpID0+IHNvdXJjZVtpbmRleF0pO1xufVxuXG5mdW5jdGlvbiBidWlsZFByb2plY3RlZENhbmRpZGF0ZUxpbmV1cChcbiAgYmFzZUNvbmZpZzogU2ltdWxhdGlvbkNvbmZpZyxcbiAgc2lkZTogUG9zaXRpb25pbmdPcHRpbWl6YXRpb25TaWRlLFxuICBzaWRlUGV0czogKFBldENvbmZpZyB8IG51bGwpW10sXG4gIG9yZGVyOiBudW1iZXJbXSxcbiAgYmFzZWxpbmVMaW5ldXBEZWx0YXM6IEFycmF5PFJlY29yZDxzdHJpbmcsIG51bWJlcj4+LFxuICBwcm9qZWN0RW5kVHVybkxpbmV1cDogTm9uTnVsbGFibGU8XG4gICAgUnVuUG9zaXRpb25pbmdPcHRpbWl6YXRpb25QYXJhbXNbJ3Byb2plY3RFbmRUdXJuTGluZXVwJ11cbiAgPixcbik6IChQZXRDb25maWcgfCBudWxsKVtdIHtcbiAgY29uc3QgY2FuZGlkYXRlTGluZXVwID0gYXBwbHlPcmRlcihzaWRlUGV0cywgb3JkZXIpO1xuICBjb25zdCBwcm9qZWN0ZWRDYW5kaWRhdGVMaW5ldXAgPSBub3JtYWxpemVMaW5ldXBMZW5ndGgoXG4gICAgcHJvamVjdEVuZFR1cm5MaW5ldXAoe1xuICAgICAgYmFzZUNvbmZpZyxcbiAgICAgIHNpZGUsXG4gICAgICBsaW5ldXA6IGNhbmRpZGF0ZUxpbmV1cCxcbiAgICB9KSxcbiAgICBjYW5kaWRhdGVMaW5ldXAubGVuZ3RoLFxuICApO1xuICBjb25zdCBjYW5kaWRhdGVMaW5ldXBEZWx0YXMgPSBjb21wdXRlTGluZXVwTnVtZXJpY0RlbHRhcyhcbiAgICBjYW5kaWRhdGVMaW5ldXAsXG4gICAgcHJvamVjdGVkQ2FuZGlkYXRlTGluZXVwLFxuICApO1xuXG4gIHJldHVybiBjYW5kaWRhdGVMaW5ldXAubWFwKChwZXQsIHRhcmdldEluZGV4KSA9PiB7XG4gICAgaWYgKCFwZXQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBzb3VyY2VJbmRleCA9IG9yZGVyW3RhcmdldEluZGV4XSA/PyB0YXJnZXRJbmRleDtcbiAgICBjb25zdCBiYXNlbGluZURlbHRhID0gYmFzZWxpbmVMaW5ldXBEZWx0YXNbc291cmNlSW5kZXhdID8/IHt9O1xuICAgIGNvbnN0IGNhbmRpZGF0ZURlbHRhID0gY2FuZGlkYXRlTGluZXVwRGVsdGFzW3RhcmdldEluZGV4XSA/PyB7fTtcbiAgICBjb25zdCBudW1lcmljS2V5cyA9IG5ldyBTZXQ8c3RyaW5nPihbXG4gICAgICAuLi5PYmplY3Qua2V5cyhjYW5kaWRhdGVEZWx0YSksXG4gICAgICAuLi5PYmplY3Qua2V5cyhiYXNlbGluZURlbHRhKSxcbiAgICBdKTtcbiAgICBpZiAobnVtZXJpY0tleXMuc2l6ZSA8PSAwKSB7XG4gICAgICByZXR1cm4gcGV0O1xuICAgIH1cblxuICAgIGNvbnN0IHBldFJlY29yZCA9IHBldCBhcyB1bmtub3duIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuICAgIGNvbnN0IHByb2plY3RlZFBldDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPSB7XG4gICAgICAuLi5wZXRSZWNvcmQsXG4gICAgICBlcXVpcG1lbnQ6XG4gICAgICAgIHBldFJlY29yZC5lcXVpcG1lbnQgJiYgdHlwZW9mIHBldFJlY29yZC5lcXVpcG1lbnQgPT09ICdvYmplY3QnXG4gICAgICAgICAgPyB7IC4uLihwZXRSZWNvcmQuZXF1aXBtZW50IGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KSB9XG4gICAgICAgICAgOiBwZXRSZWNvcmQuZXF1aXBtZW50ID8/IG51bGwsXG4gICAgfTtcblxuICAgIGZvciAoY29uc3Qga2V5IG9mIG51bWVyaWNLZXlzKSB7XG4gICAgICBjb25zdCBjdXJyZW50VmFsdWUgPSB0b0Zpbml0ZU51bWJlcihwZXRSZWNvcmRba2V5XSkgPz8gMDtcbiAgICAgIGNvbnN0IHByb2plY3RlZFZhbHVlID1cbiAgICAgICAgY3VycmVudFZhbHVlICsgKGNhbmRpZGF0ZURlbHRhW2tleV0gPz8gMCkgLSAoYmFzZWxpbmVEZWx0YVtrZXldID8/IDApO1xuICAgICAgcHJvamVjdGVkUGV0W2tleV0gPSBwcm9qZWN0ZWRWYWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJvamVjdGVkUGV0IGFzIHVua25vd24gYXMgUGV0Q29uZmlnO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gY29tcHV0ZUxpbmV1cE51bWVyaWNEZWx0YXMoXG4gIGJlZm9yZUxpbmV1cDogKFBldENvbmZpZyB8IG51bGwpW10sXG4gIGFmdGVyTGluZXVwOiAoUGV0Q29uZmlnIHwgbnVsbClbXSxcbik6IEFycmF5PFJlY29yZDxzdHJpbmcsIG51bWJlcj4+IHtcbiAgY29uc3QgbWF4TGVuZ3RoID0gTWF0aC5tYXgoYmVmb3JlTGluZXVwLmxlbmd0aCwgYWZ0ZXJMaW5ldXAubGVuZ3RoKTtcbiAgY29uc3QgZGVsdGFzOiBBcnJheTxSZWNvcmQ8c3RyaW5nLCBudW1iZXI+PiA9IFtdO1xuICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgbWF4TGVuZ3RoOyBpbmRleCArPSAxKSB7XG4gICAgZGVsdGFzLnB1c2goXG4gICAgICBjb21wdXRlUGV0TnVtZXJpY0RlbHRhKFxuICAgICAgICBiZWZvcmVMaW5ldXBbaW5kZXhdID8/IG51bGwsXG4gICAgICAgIGFmdGVyTGluZXVwW2luZGV4XSA/PyBudWxsLFxuICAgICAgKSxcbiAgICApO1xuICB9XG4gIHJldHVybiBkZWx0YXM7XG59XG5cbmZ1bmN0aW9uIGNvbXB1dGVQZXROdW1lcmljRGVsdGEoXG4gIGJlZm9yZVBldDogUGV0Q29uZmlnIHwgbnVsbCxcbiAgYWZ0ZXJQZXQ6IFBldENvbmZpZyB8IG51bGwsXG4pOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+IHtcbiAgaWYgKCFiZWZvcmVQZXQgfHwgIWFmdGVyUGV0KSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgY29uc3QgYmVmb3JlUmVjb3JkID0gYmVmb3JlUGV0IGFzIHVua25vd24gYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gIGNvbnN0IGFmdGVyUmVjb3JkID0gYWZ0ZXJQZXQgYXMgdW5rbm93biBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbiAgY29uc3QgbnVtZXJpY0tleXMgPSBuZXcgU2V0PHN0cmluZz4oKTtcblxuICBPYmplY3QuZW50cmllcyhiZWZvcmVSZWNvcmQpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgIGlmICh0b0Zpbml0ZU51bWJlcih2YWx1ZSkgIT0gbnVsbCkge1xuICAgICAgbnVtZXJpY0tleXMuYWRkKGtleSk7XG4gICAgfVxuICB9KTtcbiAgT2JqZWN0LmVudHJpZXMoYWZ0ZXJSZWNvcmQpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgIGlmICh0b0Zpbml0ZU51bWJlcih2YWx1ZSkgIT0gbnVsbCkge1xuICAgICAgbnVtZXJpY0tleXMuYWRkKGtleSk7XG4gICAgfVxuICB9KTtcblxuICBjb25zdCBkZWx0YTogUmVjb3JkPHN0cmluZywgbnVtYmVyPiA9IHt9O1xuICBmb3IgKGNvbnN0IGtleSBvZiBudW1lcmljS2V5cykge1xuICAgIGNvbnN0IGJlZm9yZVZhbHVlID0gdG9GaW5pdGVOdW1iZXIoYmVmb3JlUmVjb3JkW2tleV0pID8/IDA7XG4gICAgY29uc3QgYWZ0ZXJWYWx1ZSA9IHRvRmluaXRlTnVtYmVyKGFmdGVyUmVjb3JkW2tleV0pID8/IDA7XG4gICAgY29uc3QgZGlmZmVyZW5jZSA9IGFmdGVyVmFsdWUgLSBiZWZvcmVWYWx1ZTtcbiAgICBpZiAoZGlmZmVyZW5jZSAhPT0gMCkge1xuICAgICAgZGVsdGFba2V5XSA9IGRpZmZlcmVuY2U7XG4gICAgfVxuICB9XG4gIHJldHVybiBkZWx0YTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplTGluZXVwTGVuZ3RoKFxuICBsaW5ldXA6IChQZXRDb25maWcgfCBudWxsKVtdLFxuICBsZW5ndGg6IG51bWJlcixcbik6IChQZXRDb25maWcgfCBudWxsKVtdIHtcbiAgY29uc3Qgbm9ybWFsaXplZCA9IGxpbmV1cC5zbGljZSgwLCBsZW5ndGgpO1xuICB3aGlsZSAobm9ybWFsaXplZC5sZW5ndGggPCBsZW5ndGgpIHtcbiAgICBub3JtYWxpemVkLnB1c2gobnVsbCk7XG4gIH1cbiAgcmV0dXJuIG5vcm1hbGl6ZWQ7XG59XG5cbmZ1bmN0aW9uIHRvRmluaXRlTnVtYmVyKHZhbHVlOiB1bmtub3duKTogbnVtYmVyIHwgbnVsbCB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIE51bWJlci5pc0Zpbml0ZSh2YWx1ZSkgPyB2YWx1ZSA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlSW5kZXhQZXJtdXRhdGlvbnM8VD4oc291cmNlOiBUW10pOiBudW1iZXJbXVtdIHtcbiAgY29uc3Qgc2l6ZSA9IHNvdXJjZS5sZW5ndGg7XG4gIGlmIChzaXplIDw9IDApIHtcbiAgICByZXR1cm4gW1tdXTtcbiAgfVxuXG4gIGNvbnN0IGdyb3VwcyA9IGdyb3VwRXF1aXZhbGVudFZhbHVlcyhzb3VyY2UpO1xuICBjb25zdCByZW1haW5pbmdDb3VudHMgPSBncm91cHMubWFwKChncm91cCkgPT4gZ3JvdXAuaW5kaWNlcy5sZW5ndGgpO1xuICBjb25zdCBncm91cE9yZGVyID0gbmV3IEFycmF5PG51bWJlcj4oc2l6ZSk7XG4gIGNvbnN0IGdyb3VwUGVybXV0YXRpb25zOiBudW1iZXJbXVtdID0gW107XG5cbiAgZ2VuZXJhdGVHcm91cE9yZGVyUGVybXV0YXRpb25zKFxuICAgIDAsXG4gICAgZ3JvdXBPcmRlcixcbiAgICByZW1haW5pbmdDb3VudHMsXG4gICAgZ3JvdXBQZXJtdXRhdGlvbnMsXG4gICk7XG5cbiAgcmV0dXJuIGdyb3VwUGVybXV0YXRpb25zLm1hcCgocGVybXV0YXRpb24pID0+XG4gICAgbWF0ZXJpYWxpemVJbmRleFBlcm11dGF0aW9uKHBlcm11dGF0aW9uLCBncm91cHMpLFxuICApO1xufVxuXG5mdW5jdGlvbiBncm91cEVxdWl2YWxlbnRWYWx1ZXM8VD4oXG4gIHNvdXJjZTogVFtdLFxuKTogQXJyYXk8eyByZXByZXNlbnRhdGl2ZTogVDsgaW5kaWNlczogbnVtYmVyW10gfT4ge1xuICBjb25zdCBncm91cHNCeVNpZ25hdHVyZSA9IG5ldyBNYXA8XG4gICAgc3RyaW5nLFxuICAgIHsgcmVwcmVzZW50YXRpdmU6IFQ7IGluZGljZXM6IG51bWJlcltdIH1cbiAgPigpO1xuXG4gIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBzb3VyY2UubGVuZ3RoOyBpbmRleCArPSAxKSB7XG4gICAgY29uc3QgdmFsdWUgPSBzb3VyY2VbaW5kZXhdO1xuICAgIGNvbnN0IHNpZ25hdHVyZSA9IGJ1aWxkVmFsdWVTaWduYXR1cmUodmFsdWUpO1xuICAgIGNvbnN0IGV4aXN0aW5nR3JvdXAgPSBncm91cHNCeVNpZ25hdHVyZS5nZXQoc2lnbmF0dXJlKTtcbiAgICBpZiAoZXhpc3RpbmdHcm91cCkge1xuICAgICAgZXhpc3RpbmdHcm91cC5pbmRpY2VzLnB1c2goaW5kZXgpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGdyb3Vwc0J5U2lnbmF0dXJlLnNldChzaWduYXR1cmUsIHtcbiAgICAgIHJlcHJlc2VudGF0aXZlOiB2YWx1ZSxcbiAgICAgIGluZGljZXM6IFtpbmRleF0sXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gQXJyYXkuZnJvbShncm91cHNCeVNpZ25hdHVyZS52YWx1ZXMoKSk7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlR3JvdXBPcmRlclBlcm11dGF0aW9ucyhcbiAgZGVwdGg6IG51bWJlcixcbiAgZ3JvdXBPcmRlcjogbnVtYmVyW10sXG4gIHJlbWFpbmluZ0NvdW50czogbnVtYmVyW10sXG4gIG91dHB1dDogbnVtYmVyW11bXSxcbik6IHZvaWQge1xuICBpZiAoZGVwdGggPj0gZ3JvdXBPcmRlci5sZW5ndGgpIHtcbiAgICBvdXRwdXQucHVzaChncm91cE9yZGVyLnNsaWNlKCkpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGZvciAoXG4gICAgbGV0IGdyb3VwSW5kZXggPSAwO1xuICAgIGdyb3VwSW5kZXggPCByZW1haW5pbmdDb3VudHMubGVuZ3RoO1xuICAgIGdyb3VwSW5kZXggKz0gMVxuICApIHtcbiAgICBpZiAocmVtYWluaW5nQ291bnRzW2dyb3VwSW5kZXhdIDw9IDApIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGdyb3VwT3JkZXJbZGVwdGhdID0gZ3JvdXBJbmRleDtcbiAgICByZW1haW5pbmdDb3VudHNbZ3JvdXBJbmRleF0gLT0gMTtcbiAgICBnZW5lcmF0ZUdyb3VwT3JkZXJQZXJtdXRhdGlvbnMoXG4gICAgICBkZXB0aCArIDEsXG4gICAgICBncm91cE9yZGVyLFxuICAgICAgcmVtYWluaW5nQ291bnRzLFxuICAgICAgb3V0cHV0LFxuICAgICk7XG4gICAgcmVtYWluaW5nQ291bnRzW2dyb3VwSW5kZXhdICs9IDE7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWF0ZXJpYWxpemVJbmRleFBlcm11dGF0aW9uPFQ+KFxuICBncm91cE9yZGVyOiBudW1iZXJbXSxcbiAgZ3JvdXBzOiBBcnJheTx7IHJlcHJlc2VudGF0aXZlOiBUOyBpbmRpY2VzOiBudW1iZXJbXSB9Pixcbik6IG51bWJlcltdIHtcbiAgY29uc3QgZ3JvdXBPZmZzZXRzID0gZ3JvdXBzLm1hcCgoKSA9PiAwKTtcblxuICByZXR1cm4gZ3JvdXBPcmRlci5tYXAoKGdyb3VwSW5kZXgpID0+IHtcbiAgICBjb25zdCBvZmZzZXQgPSBncm91cE9mZnNldHNbZ3JvdXBJbmRleF07XG4gICAgZ3JvdXBPZmZzZXRzW2dyb3VwSW5kZXhdICs9IDE7XG4gICAgY29uc3QgaW5kZXggPSBncm91cHNbZ3JvdXBJbmRleF0uaW5kaWNlc1tvZmZzZXRdO1xuICAgIGlmIChpbmRleCA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBtYXAgZ3JvdXBlZCBwZXJtdXRhdGlvbiB0byBpbmRleCBwZXJtdXRhdGlvbi4nKTtcbiAgICB9XG4gICAgcmV0dXJuIGluZGV4O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0Q2FuZGlkYXRlU2ltdWxhdGlvbkxpbmV1cChcbiAgY2FuZGlkYXRlOiBDYW5kaWRhdGVTdGF0ZSxcbiAgY29udGV4dDoge1xuICAgIGtlZXBTYW1lQnVmZlRhcmdldHM6IGJvb2xlYW47XG4gICAgcmVjb21wdXRlUGFycm90Q29waWVzOiBib29sZWFuO1xuICAgIGJhc2VDb25maWc6IFNpbXVsYXRpb25Db25maWc7XG4gICAgc2lkZTogUG9zaXRpb25pbmdPcHRpbWl6YXRpb25TaWRlO1xuICAgIHNpZGVQZXRzOiAoUGV0Q29uZmlnIHwgbnVsbClbXTtcbiAgICBiYXNlbGluZUxpbmV1cERlbHRhczogQXJyYXk8UmVjb3JkPHN0cmluZywgbnVtYmVyPj4gfCBudWxsO1xuICAgIHByb2plY3RFbmRUdXJuTGluZXVwOiBSdW5Qb3NpdGlvbmluZ09wdGltaXphdGlvblBhcmFtc1sncHJvamVjdEVuZFR1cm5MaW5ldXAnXTtcbiAgfSxcbiAgcHJvamVjdGVkTGluZXVwQ2FjaGU6IE1hcDxzdHJpbmcsIChQZXRDb25maWcgfCBudWxsKVtdPixcbik6IChQZXRDb25maWcgfCBudWxsKVtdIHtcbiAgaWYgKGNhbmRpZGF0ZS5zaW11bGF0aW9uTGluZXVwKSB7XG4gICAgcmV0dXJuIGNhbmRpZGF0ZS5zaW11bGF0aW9uTGluZXVwO1xuICB9XG5cbiAgY29uc3QgY2FjaGVkID0gcHJvamVjdGVkTGluZXVwQ2FjaGUuZ2V0KGNhbmRpZGF0ZS5saW5ldXBTaWduYXR1cmUpO1xuICBpZiAoY2FjaGVkKSB7XG4gICAgY2FuZGlkYXRlLnNpbXVsYXRpb25MaW5ldXAgPSBjYWNoZWQ7XG4gICAgcmV0dXJuIGNhY2hlZDtcbiAgfVxuXG4gIGNvbnN0IHByb2plY3RlZE9yUmF3TGluZXVwID1cbiAgICBjb250ZXh0LmtlZXBTYW1lQnVmZlRhcmdldHMgfHwgIWNvbnRleHQuYmFzZWxpbmVMaW5ldXBEZWx0YXMgfHwgIWNvbnRleHQucHJvamVjdEVuZFR1cm5MaW5ldXBcbiAgICAgID8gY2FuZGlkYXRlLmxpbmV1cFxuICAgICAgOiBidWlsZFByb2plY3RlZENhbmRpZGF0ZUxpbmV1cChcbiAgICAgICAgICBjb250ZXh0LmJhc2VDb25maWcsXG4gICAgICAgICAgY29udGV4dC5zaWRlLFxuICAgICAgICAgIGNvbnRleHQuc2lkZVBldHMsXG4gICAgICAgICAgY2FuZGlkYXRlLm9yZGVyLFxuICAgICAgICAgIGNvbnRleHQuYmFzZWxpbmVMaW5ldXBEZWx0YXMsXG4gICAgICAgICAgY29udGV4dC5wcm9qZWN0RW5kVHVybkxpbmV1cCxcbiAgICAgICAgKTtcbiAgY29uc3Qgc2ltdWxhdGlvbkxpbmV1cCA9IGNvbnRleHQucmVjb21wdXRlUGFycm90Q29waWVzXG4gICAgPyByZWZyZXNoUG9zaXRpb25pbmdMaW5ldXBNZW1vcnkocHJvamVjdGVkT3JSYXdMaW5ldXApXG4gICAgOiBwcm9qZWN0ZWRPclJhd0xpbmV1cDtcblxuICBwcm9qZWN0ZWRMaW5ldXBDYWNoZS5zZXQoY2FuZGlkYXRlLmxpbmV1cFNpZ25hdHVyZSwgc2ltdWxhdGlvbkxpbmV1cCk7XG4gIGNhbmRpZGF0ZS5zaW11bGF0aW9uTGluZXVwID0gc2ltdWxhdGlvbkxpbmV1cDtcbiAgcmV0dXJuIHNpbXVsYXRpb25MaW5ldXA7XG59XG5cbmNvbnN0IG9iamVjdFNpZ25hdHVyZUNhY2hlID0gbmV3IFdlYWtNYXA8b2JqZWN0LCBzdHJpbmc+KCk7XG5cbmZ1bmN0aW9uIGJ1aWxkTGluZXVwU2lnbmF0dXJlKGxpbmV1cDogKFBldENvbmZpZyB8IG51bGwpW10pOiBzdHJpbmcge1xuICByZXR1cm4gbGluZXVwLm1hcCgocGV0KSA9PiBidWlsZFZhbHVlU2lnbmF0dXJlKHBldCkpLmpvaW4oJ3wnKTtcbn1cblxuZnVuY3Rpb24gYnVpbGRWYWx1ZVNpZ25hdHVyZSh2YWx1ZTogdW5rbm93bik6IHN0cmluZyB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGAke3ZhbHVlfWA7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gYHM6JHt2YWx1ZX1gO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgcmV0dXJuIGAke3R5cGVvZiB2YWx1ZX06JHt2YWx1ZX1gO1xuICB9XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiBgWyR7dmFsdWUubWFwKChlbnRyeSkgPT4gYnVpbGRWYWx1ZVNpZ25hdHVyZShlbnRyeSkpLmpvaW4oJywnKX1dYDtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBgJHt0eXBlb2YgdmFsdWV9OiR7U3RyaW5nKHZhbHVlKX1gO1xuICB9XG5cbiAgY29uc3QgY2FjaGVkID0gb2JqZWN0U2lnbmF0dXJlQ2FjaGUuZ2V0KHZhbHVlKTtcbiAgaWYgKGNhY2hlZCkge1xuICAgIHJldHVybiBjYWNoZWQ7XG4gIH1cblxuICBjb25zdCByZWNvcmQgPSB2YWx1ZSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHJlY29yZCkuc29ydCgpO1xuICBjb25zdCBzaWduYXR1cmUgPSBgeyR7a2V5c1xuICAgIC5tYXAoKGtleSkgPT4gYCR7a2V5fToke2J1aWxkVmFsdWVTaWduYXR1cmUocmVjb3JkW2tleV0pfWApXG4gICAgLmpvaW4oJywnKX19YDtcbiAgb2JqZWN0U2lnbmF0dXJlQ2FjaGUuc2V0KHZhbHVlLCBzaWduYXR1cmUpO1xuICByZXR1cm4gc2lnbmF0dXJlO1xufVxuXG4iLCAiaW1wb3J0IHtcbiAgUGV0Q29uZmlnLFxuICBTaW11bGF0aW9uQ29uZmlnLFxuICBTaW11bGF0aW9uUmVzdWx0LFxufSBmcm9tICdhcHAvZG9tYWluL2ludGVyZmFjZXMvc2ltdWxhdGlvbi1jb25maWcuaW50ZXJmYWNlJztcblxuZXhwb3J0IHR5cGUgQm9hcmRTdHJlbmd0aFNpZGUgPSAncGxheWVyJyB8ICdvcHBvbmVudCc7XG5leHBvcnQgdHlwZSBCb2FyZFN0cmVuZ3RoUHJlY2lzaW9uID0gJ3F1aWNrJyB8ICdzdGFuZGFyZCcgfCAnaGlnaCc7XG5leHBvcnQgdHlwZSBCb2FyZFN0cmVuZ3RoUGhhc2UgPSAnc2NvdXQnIHwgJ3NjYW4nIHwgJ3JlZmluZScgfCAnY29tcGxldGUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEJvYXJkU3RyZW5ndGhPcHRpb25zIHtcbiAgc2lkZTogQm9hcmRTdHJlbmd0aFNpZGU7XG4gIHByZWNpc2lvbj86IEJvYXJkU3RyZW5ndGhQcmVjaXNpb247XG4gIG1pblN0YXQ/OiBudW1iZXI7XG4gIG1heFN0YXQ/OiBudW1iZXI7XG4gIHNlZWQ/OiBudW1iZXIgfCBudWxsO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJvYXJkU3RyZW5ndGhQb2ludCB7XG4gIHN0YXQ6IG51bWJlcjtcbiAgd2luczogbnVtYmVyO1xuICBkcmF3czogbnVtYmVyO1xuICBsb3NzZXM6IG51bWJlcjtcbiAgYmF0dGxlczogbnVtYmVyO1xuICBleHBlY3RlZFNjb3JlOiBudW1iZXI7XG4gIHNtb290aGVkU2NvcmU6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBCb2FyZFN0cmVuZ3RoUHJvZ3Jlc3Mge1xuICBwaGFzZTogQm9hcmRTdHJlbmd0aFBoYXNlO1xuICBjb21wbGV0ZWRTdGF0czogbnVtYmVyO1xuICB0b3RhbFN0YXRzOiBudW1iZXI7XG4gIGN1cnJlbnRTdGF0OiBudW1iZXI7XG4gIGJhdHRsZXNDb21wbGV0ZWQ6IG51bWJlcjtcbiAgbWF4aW11bUJhdHRsZXM6IG51bWJlcjtcbiAgcmVmaW5lbWVudFJvdW5kOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQm9hcmRTdHJlbmd0aFJlc3VsdCB7XG4gIHZlcnNpb246ICdCUzEnO1xuICBzaWRlOiBCb2FyZFN0cmVuZ3RoU2lkZTtcbiAgcHJlY2lzaW9uOiBCb2FyZFN0cmVuZ3RoUHJlY2lzaW9uO1xuICBzY29yZTogbnVtYmVyO1xuICBiZW5jaG1hcms1MDogbnVtYmVyIHwgbnVsbDtcbiAgZXN0aW1hdGVkUHJlY2lzaW9uOTU6IG51bWJlcjtcbiAgdG90YWxCYXR0bGVzOiBudW1iZXI7XG4gIG1pblN0YXQ6IG51bWJlcjtcbiAgbWF4U3RhdDogbnVtYmVyO1xuICBwb2ludHM6IEJvYXJkU3RyZW5ndGhQb2ludFtdO1xuICBhYm9ydGVkOiBib29sZWFuO1xuICByYW5nZVRydW5jYXRlZDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBCb2FyZFN0cmVuZ3RoUnVuQ29udGV4dCB7XG4gIGJhc2VDb25maWc6IFNpbXVsYXRpb25Db25maWc7XG4gIG9wdGlvbnM6IEJvYXJkU3RyZW5ndGhPcHRpb25zO1xuICBzaW11bGF0ZUJhdGNoOiAoY29uZmlnOiBTaW11bGF0aW9uQ29uZmlnKSA9PiBTaW11bGF0aW9uUmVzdWx0O1xuICBzaG91bGRBYm9ydD86ICgpID0+IGJvb2xlYW47XG4gIG9uUHJvZ3Jlc3M/OiAocHJvZ3Jlc3M6IEJvYXJkU3RyZW5ndGhQcm9ncmVzcykgPT4gdm9pZDtcbn1cblxuaW50ZXJmYWNlIFByZWNpc2lvblByb2ZpbGUge1xuICBpbml0aWFsQmF0dGxlczogbnVtYmVyO1xuICBiYXRjaFNpemU6IG51bWJlcjtcbiAgbWF4QmF0dGxlc1BlclN0YXQ6IG51bWJlcjtcbiAgdGFyZ2V0U3RhbmRhcmRFcnJvcjogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgTXV0YWJsZVBvaW50IHtcbiAgc3RhdDogbnVtYmVyO1xuICB3aW5zOiBudW1iZXI7XG4gIGRyYXdzOiBudW1iZXI7XG4gIGxvc3NlczogbnVtYmVyO1xuICBiYXR0bGVzOiBudW1iZXI7XG59XG5cbmNvbnN0IERFRkFVTFRfU0VFRCA9IDczMDI0MTtcbmNvbnN0IEFVVE9fSU5JVElBTF9NQVhfU1RBVCA9IDEwMDtcbmNvbnN0IEFVVE9fTUFYX1NUQVQgPSA1MDAwO1xuY29uc3QgQVVUT19TSUdOQUxfVEhSRVNIT0xEID0gMC4wMDU7XG5cbmNvbnN0IFBSRUNJU0lPTl9QUk9GSUxFUzogUmVhZG9ubHk8UmVjb3JkPEJvYXJkU3RyZW5ndGhQcmVjaXNpb24sIFByZWNpc2lvblByb2ZpbGU+PiA9IHtcbiAgcXVpY2s6IHtcbiAgICBpbml0aWFsQmF0dGxlczogMjUsXG4gICAgYmF0Y2hTaXplOiAyNSxcbiAgICBtYXhCYXR0bGVzUGVyU3RhdDogMTAwLFxuICAgIHRhcmdldFN0YW5kYXJkRXJyb3I6IDAuMDU1LFxuICB9LFxuICBzdGFuZGFyZDoge1xuICAgIGluaXRpYWxCYXR0bGVzOiA1MCxcbiAgICBiYXRjaFNpemU6IDUwLFxuICAgIG1heEJhdHRsZXNQZXJTdGF0OiAyMDAsXG4gICAgdGFyZ2V0U3RhbmRhcmRFcnJvcjogMC4wNCxcbiAgfSxcbiAgaGlnaDoge1xuICAgIGluaXRpYWxCYXR0bGVzOiAxMDAsXG4gICAgYmF0Y2hTaXplOiAxMDAsXG4gICAgbWF4QmF0dGxlc1BlclN0YXQ6IDQwMCxcbiAgICB0YXJnZXRTdGFuZGFyZEVycm9yOiAwLjAyNSxcbiAgfSxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRCb2FyZFN0cmVuZ3RoUHJlY2lzaW9uUHJvZmlsZShcbiAgcHJlY2lzaW9uOiBCb2FyZFN0cmVuZ3RoUHJlY2lzaW9uLFxuKTogUmVhZG9ubHk8UHJlY2lzaW9uUHJvZmlsZT4ge1xuICByZXR1cm4gUFJFQ0lTSU9OX1BST0ZJTEVTW3ByZWNpc2lvbl07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBydW5Cb2FyZFN0cmVuZ3RoRXZhbHVhdGlvbihcbiAgY29udGV4dDogQm9hcmRTdHJlbmd0aFJ1bkNvbnRleHQsXG4pOiBCb2FyZFN0cmVuZ3RoUmVzdWx0IHtcbiAgY29uc3QgcHJlY2lzaW9uID0gY29udGV4dC5vcHRpb25zLnByZWNpc2lvbiA/PyAnc3RhbmRhcmQnO1xuICBjb25zdCBwcm9maWxlID0gUFJFQ0lTSU9OX1BST0ZJTEVTW3ByZWNpc2lvbl07XG4gIGNvbnN0IG1pblN0YXQgPSBub3JtYWxpemVQb3NpdGl2ZUludGVnZXIoY29udGV4dC5vcHRpb25zLm1pblN0YXQgPz8gMSk7XG4gIGNvbnN0IGV4cGxpY2l0TWF4U3RhdCA9IGNvbnRleHQub3B0aW9ucy5tYXhTdGF0ID09PSB1bmRlZmluZWRcbiAgICA/IG51bGxcbiAgICA6IE1hdGgubWF4KG1pblN0YXQsIG5vcm1hbGl6ZVBvc2l0aXZlSW50ZWdlcihjb250ZXh0Lm9wdGlvbnMubWF4U3RhdCkpO1xuICBjb25zdCBwb2ludHNCeVN0YXQgPSBuZXcgTWFwPG51bWJlciwgTXV0YWJsZVBvaW50PigpO1xuICBsZXQgYmF0dGxlc0NvbXBsZXRlZCA9IDA7XG4gIGxldCBjb21wbGV0ZWRTdGF0cyA9IDA7XG4gIGxldCByZWZpbmVtZW50Um91bmQgPSAwO1xuICBsZXQgcmFuZ2VUcnVuY2F0ZWQgPSBmYWxzZTtcblxuICBjb25zdCBnZXRQb2ludCA9IChzdGF0OiBudW1iZXIpOiBNdXRhYmxlUG9pbnQgPT4ge1xuICAgIGNvbnN0IGV4aXN0aW5nID0gcG9pbnRzQnlTdGF0LmdldChzdGF0KTtcbiAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgIHJldHVybiBleGlzdGluZztcbiAgICB9XG4gICAgY29uc3QgcG9pbnQ6IE11dGFibGVQb2ludCA9IHsgc3RhdCwgd2luczogMCwgZHJhd3M6IDAsIGxvc3NlczogMCwgYmF0dGxlczogMCB9O1xuICAgIHBvaW50c0J5U3RhdC5zZXQoc3RhdCwgcG9pbnQpO1xuICAgIHJldHVybiBwb2ludDtcbiAgfTtcblxuICBjb25zdCBzaW11bGF0ZVBvaW50ID0gKHBvaW50OiBNdXRhYmxlUG9pbnQsIGNvdW50OiBudW1iZXIpID0+IHtcbiAgICBjb25zdCBjb25maWcgPSBjcmVhdGVCb2FyZFN0cmVuZ3RoTWF0Y2hDb25maWcoXG4gICAgICBjb250ZXh0LmJhc2VDb25maWcsXG4gICAgICBjb250ZXh0Lm9wdGlvbnMuc2lkZSxcbiAgICAgIHBvaW50LnN0YXQsXG4gICAgICBjb3VudCxcbiAgICAgIChjb250ZXh0Lm9wdGlvbnMuc2VlZCA/PyBjb250ZXh0LmJhc2VDb25maWcuc2VlZCA/PyBERUZBVUxUX1NFRUQpICtcbiAgICAgICAgcG9pbnQuc3RhdCAqIDEwMDAwICtcbiAgICAgICAgcG9pbnQuYmF0dGxlcyxcbiAgICApO1xuICAgIGNvbnN0IHJlc3VsdCA9IGNvbnRleHQuc2ltdWxhdGVCYXRjaChjb25maWcpO1xuICAgIGNvbnN0IGNhbmRpZGF0ZVdpbnMgPVxuICAgICAgY29udGV4dC5vcHRpb25zLnNpZGUgPT09ICdwbGF5ZXInXG4gICAgICAgID8gcmVzdWx0LnBsYXllcldpbnNcbiAgICAgICAgOiByZXN1bHQub3Bwb25lbnRXaW5zO1xuICAgIGNvbnN0IGNhbmRpZGF0ZUxvc3NlcyA9XG4gICAgICBjb250ZXh0Lm9wdGlvbnMuc2lkZSA9PT0gJ3BsYXllcidcbiAgICAgICAgPyByZXN1bHQub3Bwb25lbnRXaW5zXG4gICAgICAgIDogcmVzdWx0LnBsYXllcldpbnM7XG4gICAgY29uc3QgY29tcGxldGVkID0gY2FuZGlkYXRlV2lucyArIGNhbmRpZGF0ZUxvc3NlcyArIHJlc3VsdC5kcmF3cztcblxuICAgIHBvaW50LndpbnMgKz0gY2FuZGlkYXRlV2lucztcbiAgICBwb2ludC5sb3NzZXMgKz0gY2FuZGlkYXRlTG9zc2VzO1xuICAgIHBvaW50LmRyYXdzICs9IHJlc3VsdC5kcmF3cztcbiAgICBwb2ludC5iYXR0bGVzICs9IGNvbXBsZXRlZDtcbiAgICBiYXR0bGVzQ29tcGxldGVkICs9IGNvbXBsZXRlZDtcbiAgfTtcblxuICBsZXQgbWF4U3RhdCA9IGV4cGxpY2l0TWF4U3RhdCA/PyBNYXRoLm1heChtaW5TdGF0LCBBVVRPX0lOSVRJQUxfTUFYX1NUQVQpO1xuICBpZiAoZXhwbGljaXRNYXhTdGF0ID09PSBudWxsKSB7XG4gICAgbGV0IHByb2JlU3RhdCA9IG1heFN0YXQ7XG4gICAgbGV0IGNvbnNlY3V0aXZlTWlzc2VzID0gMDtcbiAgICBsZXQgc2F3U2lnbmFsID0gZmFsc2U7XG4gICAgbGV0IGNvdmVyYWdlQm91bmRhcnkgPSBtYXhTdGF0O1xuXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGlmIChjb250ZXh0LnNob3VsZEFib3J0Py4oKSkge1xuICAgICAgICBjb25zdCBwYXJ0aWFsID0gWy4uLnBvaW50c0J5U3RhdC52YWx1ZXMoKV0uc29ydCgoYSwgYikgPT4gYS5zdGF0IC0gYi5zdGF0KTtcbiAgICAgICAgcmV0dXJuIGJ1aWxkUmVzdWx0KHBhcnRpYWwsIGNvbnRleHQub3B0aW9ucy5zaWRlLCBwcmVjaXNpb24sIG1pblN0YXQsIHByb2JlU3RhdCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgfVxuICAgICAgY29uc3QgcG9pbnQgPSBnZXRQb2ludChwcm9iZVN0YXQpO1xuICAgICAgc2ltdWxhdGVQb2ludChwb2ludCwgcHJvZmlsZS5pbml0aWFsQmF0dGxlcyk7XG4gICAgICBjb25zdCBoYXNTaWduYWwgPSBnZXRFeHBlY3RlZFNjb3JlKHBvaW50KSA+IEFVVE9fU0lHTkFMX1RIUkVTSE9MRDtcbiAgICAgIGlmIChoYXNTaWduYWwpIHtcbiAgICAgICAgc2F3U2lnbmFsID0gdHJ1ZTtcbiAgICAgICAgY29uc2VjdXRpdmVNaXNzZXMgPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc2VjdXRpdmVNaXNzZXMgKz0gMTtcbiAgICAgICAgaWYgKHNhd1NpZ25hbCAmJiBjb25zZWN1dGl2ZU1pc3NlcyA9PT0gMSkge1xuICAgICAgICAgIGNvdmVyYWdlQm91bmRhcnkgPSBwcm9iZVN0YXQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnRleHQub25Qcm9ncmVzcz8uKHtcbiAgICAgICAgcGhhc2U6ICdzY291dCcsIGNvbXBsZXRlZFN0YXRzOiAwLCB0b3RhbFN0YXRzOiAwLCBjdXJyZW50U3RhdDogcHJvYmVTdGF0LFxuICAgICAgICBiYXR0bGVzQ29tcGxldGVkLCBtYXhpbXVtQmF0dGxlczogMCwgcmVmaW5lbWVudFJvdW5kLFxuICAgICAgfSk7XG5cbiAgICAgIGlmIChwcm9iZVN0YXQgPj0gQVVUT19NQVhfU1RBVCkge1xuICAgICAgICByYW5nZVRydW5jYXRlZCA9IGhhc1NpZ25hbDtcbiAgICAgICAgbWF4U3RhdCA9IHJhbmdlVHJ1bmNhdGVkID8gQVVUT19NQVhfU1RBVCA6IGNvdmVyYWdlQm91bmRhcnk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgcHJvYmVTdGF0ID0gTWF0aC5taW4oXG4gICAgICAgIEFVVE9fTUFYX1NUQVQsXG4gICAgICAgIHByb2JlU3RhdCA8IDEwMDAgPyBwcm9iZVN0YXQgKyAxMDAgOiBwcm9iZVN0YXQgKiAyLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBzdGF0cyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IG1heFN0YXQgLSBtaW5TdGF0ICsgMSB9LCAoXywgaW5kZXgpID0+IG1pblN0YXQgKyBpbmRleCk7XG4gIGNvbnN0IHBvaW50cyA9IHN0YXRzLm1hcChnZXRQb2ludCk7XG4gIGNvbnN0IG1heGltdW1CYXR0bGVzID0gc3RhdHMubGVuZ3RoICogcHJvZmlsZS5tYXhCYXR0bGVzUGVyU3RhdDtcblxuICBmb3IgKGNvbnN0IHBvaW50IG9mIHBvaW50cykge1xuICAgIGlmIChjb250ZXh0LnNob3VsZEFib3J0Py4oKSkge1xuICAgICAgcmV0dXJuIGJ1aWxkUmVzdWx0KHBvaW50cywgY29udGV4dC5vcHRpb25zLnNpZGUsIHByZWNpc2lvbiwgbWluU3RhdCwgbWF4U3RhdCwgdHJ1ZSwgcmFuZ2VUcnVuY2F0ZWQpO1xuICAgIH1cbiAgICBpZiAocG9pbnQuYmF0dGxlcyA9PT0gMCkge1xuICAgICAgc2ltdWxhdGVQb2ludChwb2ludCwgcHJvZmlsZS5pbml0aWFsQmF0dGxlcyk7XG4gICAgfVxuICAgIGNvbXBsZXRlZFN0YXRzICs9IDE7XG4gICAgY29udGV4dC5vblByb2dyZXNzPy4oe1xuICAgICAgcGhhc2U6ICdzY2FuJyxcbiAgICAgIGNvbXBsZXRlZFN0YXRzLFxuICAgICAgdG90YWxTdGF0czogc3RhdHMubGVuZ3RoLFxuICAgICAgY3VycmVudFN0YXQ6IHBvaW50LnN0YXQsXG4gICAgICBiYXR0bGVzQ29tcGxldGVkLFxuICAgICAgbWF4aW11bUJhdHRsZXMsXG4gICAgICByZWZpbmVtZW50Um91bmQsXG4gICAgfSk7XG4gIH1cblxuICB3aGlsZSAodHJ1ZSkge1xuICAgIGNvbnN0IGNhbmRpZGF0ZXMgPSBwb2ludHMuZmlsdGVyKFxuICAgICAgKHBvaW50KSA9PlxuICAgICAgICBwb2ludC5iYXR0bGVzIDwgcHJvZmlsZS5tYXhCYXR0bGVzUGVyU3RhdCAmJlxuICAgICAgICBlc3RpbWF0ZVN0YW5kYXJkRXJyb3IocG9pbnQpID4gcHJvZmlsZS50YXJnZXRTdGFuZGFyZEVycm9yLFxuICAgICk7XG4gICAgaWYgKGNhbmRpZGF0ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZWZpbmVtZW50Um91bmQgKz0gMTtcbiAgICBmb3IgKGNvbnN0IHBvaW50IG9mIGNhbmRpZGF0ZXMpIHtcbiAgICAgIGlmIChjb250ZXh0LnNob3VsZEFib3J0Py4oKSkge1xuICAgICAgICByZXR1cm4gYnVpbGRSZXN1bHQocG9pbnRzLCBjb250ZXh0Lm9wdGlvbnMuc2lkZSwgcHJlY2lzaW9uLCBtaW5TdGF0LCBtYXhTdGF0LCB0cnVlLCByYW5nZVRydW5jYXRlZCk7XG4gICAgICB9XG4gICAgICBjb25zdCByZW1haW5pbmcgPSBwcm9maWxlLm1heEJhdHRsZXNQZXJTdGF0IC0gcG9pbnQuYmF0dGxlcztcbiAgICAgIHNpbXVsYXRlUG9pbnQocG9pbnQsIE1hdGgubWluKHByb2ZpbGUuYmF0Y2hTaXplLCByZW1haW5pbmcpKTtcbiAgICAgIGNvbnRleHQub25Qcm9ncmVzcz8uKHtcbiAgICAgICAgcGhhc2U6ICdyZWZpbmUnLFxuICAgICAgICBjb21wbGV0ZWRTdGF0cyxcbiAgICAgICAgdG90YWxTdGF0czogc3RhdHMubGVuZ3RoLFxuICAgICAgICBjdXJyZW50U3RhdDogcG9pbnQuc3RhdCxcbiAgICAgICAgYmF0dGxlc0NvbXBsZXRlZCxcbiAgICAgICAgbWF4aW11bUJhdHRsZXMsXG4gICAgICAgIHJlZmluZW1lbnRSb3VuZCxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGNvbnRleHQub25Qcm9ncmVzcz8uKHtcbiAgICBwaGFzZTogJ2NvbXBsZXRlJyxcbiAgICBjb21wbGV0ZWRTdGF0czogc3RhdHMubGVuZ3RoLFxuICAgIHRvdGFsU3RhdHM6IHN0YXRzLmxlbmd0aCxcbiAgICBjdXJyZW50U3RhdDogbWF4U3RhdCxcbiAgICBiYXR0bGVzQ29tcGxldGVkLFxuICAgIG1heGltdW1CYXR0bGVzLFxuICAgIHJlZmluZW1lbnRSb3VuZCxcbiAgfSk7XG5cbiAgcmV0dXJuIGJ1aWxkUmVzdWx0KFxuICAgIHBvaW50cyxcbiAgICBjb250ZXh0Lm9wdGlvbnMuc2lkZSxcbiAgICBwcmVjaXNpb24sXG4gICAgbWluU3RhdCxcbiAgICBtYXhTdGF0LFxuICAgIGZhbHNlLFxuICAgIHJhbmdlVHJ1bmNhdGVkLFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQm9hcmRTdHJlbmd0aE1hdGNoQ29uZmlnKFxuICBiYXNlQ29uZmlnOiBTaW11bGF0aW9uQ29uZmlnLFxuICBzaWRlOiBCb2FyZFN0cmVuZ3RoU2lkZSxcbiAgc3RhdDogbnVtYmVyLFxuICBzaW11bGF0aW9uQ291bnQ6IG51bWJlcixcbiAgc2VlZDogbnVtYmVyLFxuKTogU2ltdWxhdGlvbkNvbmZpZyB7XG4gIGNvbnN0IGNvbmZpZyA9IGRlZXBDbG9uZShiYXNlQ29uZmlnKTtcbiAgY29uc3QgYmVuY2htYXJrUGV0cyA9IGNyZWF0ZUJlbmNobWFya1BldHMoc3RhdCk7XG4gIGNvbnN0IGNhbmRpZGF0ZVBhY2sgPVxuICAgIHNpZGUgPT09ICdwbGF5ZXInID8gY29uZmlnLnBsYXllclBhY2sgOiBjb25maWcub3Bwb25lbnRQYWNrO1xuXG4gIGlmIChzaWRlID09PSAncGxheWVyJykge1xuICAgIGNvbmZpZy5vcHBvbmVudFBldHMgPSBiZW5jaG1hcmtQZXRzO1xuICAgIGNvbmZpZy5vcHBvbmVudFBhY2sgPSBjYW5kaWRhdGVQYWNrO1xuICAgIGNvbmZpZy5vcHBvbmVudFRveSA9IG51bGw7XG4gICAgY29uZmlnLm9wcG9uZW50SGFyZFRveSA9IG51bGw7XG4gICAgY29uZmlnLm9wcG9uZW50R29sZFNwZW50ID0gMDtcbiAgICBjb25maWcub3Bwb25lbnRSb2xsQW1vdW50ID0gMDtcbiAgICBjb25maWcub3Bwb25lbnRTdW1tb25lZEFtb3VudCA9IDA7XG4gICAgY29uZmlnLm9wcG9uZW50TGV2ZWwzU29sZCA9IDA7XG4gICAgY29uZmlnLm9wcG9uZW50VHJhbnNmb3JtYXRpb25BbW91bnQgPSAwO1xuICAgIGNvbmZpZy5vcHBvbmVudExvc3RMYXN0QmF0dGxlID0gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgY29uZmlnLnBsYXllclBldHMgPSBiZW5jaG1hcmtQZXRzO1xuICAgIGNvbmZpZy5wbGF5ZXJQYWNrID0gY2FuZGlkYXRlUGFjaztcbiAgICBjb25maWcucGxheWVyVG95ID0gbnVsbDtcbiAgICBjb25maWcucGxheWVySGFyZFRveSA9IG51bGw7XG4gICAgY29uZmlnLnBsYXllckdvbGRTcGVudCA9IDA7XG4gICAgY29uZmlnLnBsYXllclJvbGxBbW91bnQgPSAwO1xuICAgIGNvbmZpZy5wbGF5ZXJTdW1tb25lZEFtb3VudCA9IDA7XG4gICAgY29uZmlnLnBsYXllckxldmVsM1NvbGQgPSAwO1xuICAgIGNvbmZpZy5wbGF5ZXJUcmFuc2Zvcm1hdGlvbkFtb3VudCA9IDA7XG4gICAgY29uZmlnLnBsYXllckxvc3RMYXN0QmF0dGxlID0gZmFsc2U7XG4gIH1cblxuICBjb25maWcuc2ltdWxhdGlvbkNvdW50ID0gc2ltdWxhdGlvbkNvdW50O1xuICBjb25maWcuc2VlZCA9IE1hdGgudHJ1bmMoc2VlZCk7XG4gIGNvbmZpZy5sb2dzRW5hYmxlZCA9IGZhbHNlO1xuICBjb25maWcubWF4TG9nZ2VkQmF0dGxlcyA9IDA7XG4gIGNvbmZpZy5jYXB0dXJlUmFuZG9tRGVjaXNpb25zID0gZmFsc2U7XG4gIGNvbmZpZy5yYW5kb21EZWNpc2lvbk92ZXJyaWRlcyA9IFtdO1xuICBjb25maWcub3B0aW1pemVEZXRlcm1pbmlzdGljU2ltdWxhdGlvbnMgPSBmYWxzZTtcbiAgcmV0dXJuIGNvbmZpZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUJvYXJkU3RyZW5ndGhGaW5nZXJwcmludChcbiAgYmFzZUNvbmZpZzogU2ltdWxhdGlvbkNvbmZpZyxcbiAgc2lkZTogQm9hcmRTdHJlbmd0aFNpZGUsXG4pOiBzdHJpbmcge1xuICBjb25zdCBub3JtYWxpemVkID0gY3JlYXRlQm9hcmRTdHJlbmd0aE1hdGNoQ29uZmlnKFxuICAgIGJhc2VDb25maWcsXG4gICAgc2lkZSxcbiAgICAxLFxuICAgIDEsXG4gICAgREVGQVVMVF9TRUVELFxuICApO1xuICBub3JtYWxpemVkLnNlZWQgPSBudWxsO1xuICBub3JtYWxpemVkLnNpbXVsYXRpb25Db3VudCA9IDE7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShub3JtYWxpemVkKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQmVuY2htYXJrUGV0cyhzdGF0OiBudW1iZXIpOiBQZXRDb25maWdbXSB7XG4gIGNvbnN0IG5vcm1hbGl6ZWRTdGF0ID0gbm9ybWFsaXplUG9zaXRpdmVJbnRlZ2VyKHN0YXQpO1xuICByZXR1cm4gQXJyYXkuZnJvbSh7IGxlbmd0aDogNSB9LCAoKSA9PiB7XG4gICAgY29uc3QgcGV0OiBQZXRDb25maWcgPSB7XG4gICAgICBuYW1lOiAnQmVuY2htYXJrIFBldCcsXG4gICAgICBiZW5jaG1hcms6IHRydWUsXG4gICAgICBhdHRhY2s6IG5vcm1hbGl6ZWRTdGF0LFxuICAgICAgaGVhbHRoOiBub3JtYWxpemVkU3RhdCxcbiAgICAgIGV4cDogMCxcbiAgICAgIGVxdWlwbWVudDogbnVsbCxcbiAgICAgIG1hbmE6IDAsXG4gICAgfTtcbiAgICByZXR1cm4gcGV0O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYnVpbGRSZXN1bHQoXG4gIG11dGFibGVQb2ludHM6IE11dGFibGVQb2ludFtdLFxuICBzaWRlOiBCb2FyZFN0cmVuZ3RoU2lkZSxcbiAgcHJlY2lzaW9uOiBCb2FyZFN0cmVuZ3RoUHJlY2lzaW9uLFxuICBtaW5TdGF0OiBudW1iZXIsXG4gIG1heFN0YXQ6IG51bWJlcixcbiAgYWJvcnRlZDogYm9vbGVhbixcbiAgcmFuZ2VUcnVuY2F0ZWQ6IGJvb2xlYW4sXG4pOiBCb2FyZFN0cmVuZ3RoUmVzdWx0IHtcbiAgY29uc3QgcmF3U2NvcmVzID0gbXV0YWJsZVBvaW50cy5tYXAoKHBvaW50KSA9PiBnZXRFeHBlY3RlZFNjb3JlKHBvaW50KSk7XG4gIGNvbnN0IHBvaW50cyA9IG11dGFibGVQb2ludHMubWFwPEJvYXJkU3RyZW5ndGhQb2ludD4oKHBvaW50LCBpbmRleCkgPT4gKHtcbiAgICAuLi5wb2ludCxcbiAgICBleHBlY3RlZFNjb3JlOiByYXdTY29yZXNbaW5kZXhdLFxuICAgIHNtb290aGVkU2NvcmU6IHJhd1Njb3Jlc1tpbmRleF0sXG4gIH0pKTtcbiAgY29uc3Qgc2NvcmUgPSByYXdTY29yZXMucmVkdWNlKChzdW0sIHZhbHVlKSA9PiBzdW0gKyB2YWx1ZSwgMCk7XG4gIGNvbnN0IHZhcmlhbmNlT2ZTY29yZSA9IG11dGFibGVQb2ludHMucmVkdWNlKChzdW0sIHBvaW50KSA9PiB7XG4gICAgY29uc3Qgc3RhbmRhcmRFcnJvciA9IGVzdGltYXRlU3RhbmRhcmRFcnJvcihwb2ludCk7XG4gICAgcmV0dXJuIHN1bSArIHN0YW5kYXJkRXJyb3IgKiBzdGFuZGFyZEVycm9yO1xuICB9LCAwKTtcblxuICByZXR1cm4ge1xuICAgIHZlcnNpb246ICdCUzEnLFxuICAgIHNpZGUsXG4gICAgcHJlY2lzaW9uLFxuICAgIHNjb3JlLFxuICAgIGJlbmNobWFyazUwOiBmaW5kQmVuY2htYXJrNTAocG9pbnRzKSxcbiAgICBlc3RpbWF0ZWRQcmVjaXNpb245NTogMS45NiAqIE1hdGguc3FydCh2YXJpYW5jZU9mU2NvcmUpLFxuICAgIHRvdGFsQmF0dGxlczogbXV0YWJsZVBvaW50cy5yZWR1Y2UoXG4gICAgICAoc3VtLCBwb2ludCkgPT4gc3VtICsgcG9pbnQuYmF0dGxlcyxcbiAgICAgIDAsXG4gICAgKSxcbiAgICBtaW5TdGF0LFxuICAgIG1heFN0YXQsXG4gICAgcG9pbnRzLFxuICAgIGFib3J0ZWQsXG4gICAgcmFuZ2VUcnVuY2F0ZWQsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldEV4cGVjdGVkU2NvcmUocG9pbnQ6IE11dGFibGVQb2ludCk6IG51bWJlciB7XG4gIGlmIChwb2ludC5iYXR0bGVzID09PSAwKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgcmV0dXJuIChwb2ludC53aW5zICsgcG9pbnQuZHJhd3MgKiAwLjUpIC8gcG9pbnQuYmF0dGxlcztcbn1cblxuZnVuY3Rpb24gZXN0aW1hdGVTdGFuZGFyZEVycm9yKHBvaW50OiBNdXRhYmxlUG9pbnQpOiBudW1iZXIge1xuICBpZiAocG9pbnQuYmF0dGxlcyA9PT0gMCkge1xuICAgIHJldHVybiBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG4gIH1cbiAgY29uc3QgbWVhbiA9IGdldEV4cGVjdGVkU2NvcmUocG9pbnQpO1xuICBjb25zdCBzZWNvbmRNb21lbnQgPVxuICAgIChwb2ludC53aW5zICsgcG9pbnQuZHJhd3MgKiAwLjI1KSAvIHBvaW50LmJhdHRsZXM7XG4gIGNvbnN0IGVtcGlyaWNhbFZhcmlhbmNlID0gTWF0aC5tYXgoMCwgc2Vjb25kTW9tZW50IC0gbWVhbiAqIG1lYW4pO1xuICBjb25zdCBzbW9vdGhlZE1lYW4gPVxuICAgIChwb2ludC53aW5zICsgcG9pbnQuZHJhd3MgKiAwLjUgKyAxKSAvIChwb2ludC5iYXR0bGVzICsgMik7XG4gIGNvbnN0IGNvbnNlcnZhdGl2ZVZhcmlhbmNlID0gTWF0aC5tYXgoXG4gICAgZW1waXJpY2FsVmFyaWFuY2UsXG4gICAgc21vb3RoZWRNZWFuICogKDEgLSBzbW9vdGhlZE1lYW4pLFxuICApO1xuICByZXR1cm4gTWF0aC5zcXJ0KGNvbnNlcnZhdGl2ZVZhcmlhbmNlIC8gcG9pbnQuYmF0dGxlcyk7XG59XG5cbmZ1bmN0aW9uIGZpbmRCZW5jaG1hcms1MChwb2ludHM6IEJvYXJkU3RyZW5ndGhQb2ludFtdKTogbnVtYmVyIHwgbnVsbCB7XG4gIGxldCBoaWdoZXN0UGFzc2luZ1N0YXQ6IG51bWJlciB8IG51bGwgPSBudWxsO1xuICBmb3IgKGNvbnN0IHBvaW50IG9mIHBvaW50cykge1xuICAgIGlmIChwb2ludC5leHBlY3RlZFNjb3JlID49IDAuNSkge1xuICAgICAgaGlnaGVzdFBhc3NpbmdTdGF0ID0gcG9pbnQuc3RhdDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGhpZ2hlc3RQYXNzaW5nU3RhdDtcbn1cblxuZnVuY3Rpb24gZGVlcENsb25lPFQ+KHZhbHVlOiBUKTogVCB7XG4gIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHZhbHVlKSkgYXMgVDtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplUG9zaXRpdmVJbnRlZ2VyKHZhbHVlOiBudW1iZXIpOiBudW1iZXIge1xuICBjb25zdCBub3JtYWxpemVkID0gTnVtYmVyLmlzRmluaXRlKHZhbHVlKSA/IE1hdGgudHJ1bmModmFsdWUpIDogMTtcbiAgcmV0dXJuIE1hdGgubWF4KDEsIG5vcm1hbGl6ZWQpO1xufVxuIl0sCiAgIm1hcHBp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a0JBQWtCO0FBQUEsTUFDMUIsVUFBVSxrQkFBa0I7QUFBQSxJQUM5QjtBQUFBLEVBQ0Y7QUFFQSxNQUFJO0FBQ0YsVUFBTSxXQUFXLE9BQU8sdUJBQXVCLGVBQWU7QUFDOUQsV0FBTyxTQUFTLFFBQVEsT0FBTyxLQUFLO0FBQUEsRUFDdEMsVUFBRTtBQUNBLFFBQUksV0FBVztBQUNiLHVCQUFpQixTQUFTO0FBQUEsSUFDNUIsT0FBTztBQUNMLGFBQU8saUJBQWlCO0FBQUEsSUFDMUI7QUFBQSxFQUNGO0FBQ0Y7IiwKICAibmFtZXMiOiBbImVuZ2luZUhlYWRsZXNzU2ltdWxhdGlvbiIsICJpbXBvcnRfc2FwX2JhdHRsZV9lbmdpbmUiLCAiX2luaXQiLCAicGV0TmFtZXMiLCAidG95TmFtZXMiLCAiZXF1aXBtZW50TmFtZXMiLCAicmVnZXgiLCAibWF0Y2giLCAicGV0TmFtZXMiLCAidG95TmFtZXMiLCAiZXF1aXBtZW50TmFtZXMiLCAicGV0cyIsICJpbXBvcnRfc2FwX2JhdHRsZV9lbmdpbmUiLCAibnVtZXJpYyIsICJ0b0Zpbml0ZU51bWJlciIsICJwZXRzIiwgInRvRmluaXRlTnVtYmVyIiwgImltcG9ydF9zYXBfYmF0dGxlX2VuZ2luZSIsICJ0b051bWJlck9yRmFsbGJhY2siXQp9Cg==
