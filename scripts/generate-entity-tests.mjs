import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TEST_ROOT = path.join(ROOT, 'tests', 'generated');

const PET_REGISTRY_DIR = path.join(
  ROOT,
  'src',
  'app',
  'integrations',
  'pet',
  'registries',
);
const TOY_REGISTRY_FILE = path.join(
  ROOT,
  'src',
  'app',
  'integrations',
  'toy',
  'toy-registry.ts',
);
const EQUIPMENT_REGISTRY_FILE = path.join(
  ROOT,
  'src',
  'app',
  'integrations',
  'equipment',
  'equipment-registry.ts',
);
const PETS_JSON = path.join(ROOT, 'src', 'assets', 'data', 'pets.json');
const TOYS_JSON = path.join(ROOT, 'src', 'assets', 'data', 'toys.json');
const FOOD_JSON = path.join(ROOT, 'src', 'assets', 'data', 'food.json');
const PERKS_JSON = path.join(ROOT, 'src', 'assets', 'data', 'perks.json');

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');
}

function quote(value) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function firstAbilityText(entry) {
  if (!Array.isArray(entry?.Abilities)) {
    return null;
  }
  const lvl1 =
    entry.Abilities.find((ability) => Number(ability?.Level) === 1)?.About ??
    entry.Abilities[0]?.About;
  if (typeof lvl1 !== 'string') {
    return null;
  }
  const text = lvl1.trim();
  return text.length ? text : null;
}

function getAbilityPrefix(text) {
  const idx = text.indexOf(':');
  if (idx < 0) {
    return '';
  }
  return text.slice(0, idx).trim().toLowerCase();
}

const SHOP_TRIGGER_PREFIXES = [
  'start of turn',
  'end turn',
  'break',
  'sell',
  'buy',
  'friend sold',
  'friend bought',
  'friendly level-up',
  'level-up',
  'shop',
  'roll',
  'three friends bought',
  'spend',
  'food bought',
  'eats',
  'eat',
  'pet sold',
];

const BATTLE_TRIGGER_PREFIXES = [
  'before battle',
  'start of battle',
  'before attack',
  'after attack',
  'faint',
  'hurt',
  'friend summoned',
  'summoned',
  'friend faints',
  'friend hurt',
  'friend ahead',
  'enemy summoned',
  'enemy hurt',
  'enemy faints',
  'enemy gained ailment',
  'friendly attacked',
  'friend attacked',
  'adjacent friend attacked',
  'before friend attacks',
  'before any attack',
  'before first attack',
  'empty front space',
  'knock out',
  'anyone',
  'bee summoned',
  'pet flung',
  'enemy',
];

const TOY_BATTLE_SUPPORTED_PREFIXES = new Set([
  'start of battle',
  'empty front space',
  'faint',
  'friend summoned',
]);

const EQUIPMENT_BATTLE_SUPPORTED_PREFIXES = new Set([
  'start of battle',
  'before battle',
  'before attack',
  'faint',
  'hurt',
  'empty front space',
  'knock out',
  'anyone attacks',
]);

function classifyAbilityScope(abilityText) {
  if (!abilityText) {
    return { scope: 'none', reason: 'No ability text.' };
  }
  const text = abilityText.trim();
  if (!text || /^No ability\./i.test(text)) {
    return { scope: 'none', reason: 'No ability text.' };
  }

  const prefix = getAbilityPrefix(text);
  if (prefix) {
    if (SHOP_TRIGGER_PREFIXES.some((token) => prefix.includes(token))) {
      return {
        scope: 'shop',
        reason: `Shop-phase trigger (${prefix}).`,
      };
    }
    if (BATTLE_TRIGGER_PREFIXES.some((token) => prefix.includes(token))) {
      return {
        scope: 'battle',
        reason: `Battle-phase trigger (${prefix}).`,
      };
    }
  }

  const lowered = text.toLowerCase();
  if (!prefix) {
    if (
      /\b(start of battle|before battle|before attack|after attack|faint|hurt|summon|empty front space|knock out|enemy summoned|friend summoned)\b/.test(
        lowered,
      )
    ) {
      return { scope: 'battle', reason: 'Battle keyword match.' };
    }
    if (
      /\b(start of turn|end turn|break|sell|buy|roll|shop|food|level-?up|spend \d+ gold|tier)\b/.test(
        lowered,
      )
    ) {
      return { scope: 'shop', reason: 'Shop keyword match.' };
    }
    return {
      scope: 'unknown',
      reason: 'Unable to classify trigger scope from ability text.',
    };
  }

  if (
    /\b(start of battle|before battle|before attack|after attack|faint|hurt|summon|attack|enemy|empty front space|knock out|jump)\b/.test(
      lowered,
    )
  ) {
    return { scope: 'battle', reason: 'Battle keyword match.' };
  }
  if (
    /\b(start of turn|end turn|sell|buy|roll|shop|food|level-?up|spend \d+ gold|tier)\b/.test(
      lowered,
    )
  ) {
    return { scope: 'shop', reason: 'Shop keyword match.' };
  }
  return {
    scope: 'unknown',
    reason: 'Unable to classify trigger scope from ability text.',
  };
}

function isBattleBehaviorSupported(kind, abilityText) {
  if (!abilityText) {
    return false;
  }
  const prefix = getAbilityPrefix(abilityText);
  if (!prefix) {
    return false;
  }
  if (kind === 'toy') {
    return TOY_BATTLE_SUPPORTED_PREFIXES.has(prefix);
  }
  if (kind === 'equipment') {
    return EQUIPMENT_BATTLE_SUPPORTED_PREFIXES.has(prefix);
  }
  return true;
}

function buildPetAbilityMap() {
  const petData = readJson(PETS_JSON);
  return new Map(
    petData.map((entry) => [entry.Name, firstAbilityText(entry) ?? null]),
  );
}

function buildToyAbilityMap() {
  const toyData = readJson(TOYS_JSON);
  return new Map(
    toyData.map((entry) => [entry.Name, firstAbilityText(entry) ?? null]),
  );
}

function buildEquipmentAbilityMap() {
  const map = new Map();
  const rows = [...readJson(FOOD_JSON), ...readJson(PERKS_JSON)];
  for (const row of rows) {
    const name = row?.Name;
    const text =
      typeof row?.Ability === 'string' ? row.Ability.trim() || null : null;
    if (!name) {
      continue;
    }
    map.set(name, text);
  }
  return map;
}

function withAbilityMeta(entry, abilityMap, kind) {
  const abilityText = abilityMap.get(entry.name) ?? null;
  let classified = classifyAbilityScope(abilityText);
  if (
    classified.scope === 'battle' &&
    !isBattleBehaviorSupported(kind, abilityText)
  ) {
    classified = {
      scope: 'unknown',
      reason: 'Battle trigger requires specialized scenario; skipped by generator.',
    };
  }
  return {
    ...entry,
    abilityText,
    abilityScope: classified.scope,
    abilityScopeReason: classified.reason,
  };
}

function extractObjectBody(source, objectName) {
  const anchor = `export const ${objectName}`;
  const start = source.indexOf(anchor);
  if (start < 0) {
    return '';
  }
  const equalsIndex = source.indexOf('=', start);
  if (equalsIndex < 0) {
    return '';
  }
  const braceStart = source.indexOf('{', equalsIndex);
  if (braceStart < 0) {
    return '';
  }

  let depth = 0;
  for (let i = braceStart; i < source.length; i += 1) {
    const ch = source[i];
    if (ch === '{') {
      depth += 1;
    } else if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        return source.slice(braceStart + 1, i);
      }
    }
  }
  return '';
}

function parseRegistryKeys(source, objectName) {
  const body = extractObjectBody(source, objectName);
  const keys = [];
  const keyRegex =
    /^\s*(?:'([^']+)'|"([^"]+)"|([A-Za-z][A-Za-z0-9]*))\s*:\s*[^,]+,?\s*$/gm;

  let match = keyRegex.exec(body);
  while (match) {
    const key = match[1] ?? match[2] ?? match[3];
    if (key && !key.startsWith('...')) {
      keys.push(key);
    }
    match = keyRegex.exec(body);
  }
  return keys;
}

function parsePetEntries() {
  const files = fs
    .readdirSync(PET_REGISTRY_DIR)
    .filter((file) => file.startsWith('pet-registry.') && file.endsWith('.ts'));

  const entries = [];
  for (const file of files) {
    const fullPath = path.join(PET_REGISTRY_DIR, file);
    const source = fs.readFileSync(fullPath, 'utf8');
    const objectMatch = source.match(
      /export const ([A-Z_]+_PET_REGISTRY)\s*:\s*\{[^}]+\}\s*=\s*\{/,
    );
    if (!objectMatch) {
      continue;
    }

    const objectName = objectMatch[1];
    const keys = parseRegistryKeys(source, objectName);
    const suffix = file.replace(/^pet-registry\./, '').replace(/\.ts$/, '');
    const pack =
      suffix.toLowerCase() === 'hidden'
        ? 'Custom'
        : `${suffix[0].toUpperCase()}${suffix.slice(1).toLowerCase()}`;

    for (const name of keys) {
      entries.push({ name, pack });
    }
  }

  const seen = new Set();
  return entries
    .filter((entry) => {
      const key = `${entry.name}|${entry.pack}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .sort((a, b) =>
      a.pack === b.pack
        ? a.name.localeCompare(b.name)
        : a.pack.localeCompare(b.pack),
    );
}

function parseToyEntries() {
  const source = fs.readFileSync(TOY_REGISTRY_FILE, 'utf8');
  const objectNames = [
    'STANDARD_TOYS',
    'TOYS_NEEDING_ABILITY_SERVICE',
    'SPECIAL_TOY_BUILDERS',
  ];
  const names = objectNames.flatMap((objectName) =>
    parseRegistryKeys(source, objectName),
  );
  return [...new Set(names)].sort((a, b) => a.localeCompare(b));
}

function parseEquipmentEntries() {
  const source = fs.readFileSync(EQUIPMENT_REGISTRY_FILE, 'utf8');
  const objectNames = [
    'NO_ARG_EQUIPMENT',
    'LOG_ONLY_EQUIPMENT',
    'LOG_ABILITY_EQUIPMENT',
    'NO_ARG_AILMENTS',
    'SPECIAL_EQUIPMENT_BUILDERS',
    'SPECIAL_AILMENT_BUILDERS',
  ];
  const names = objectNames.flatMap((objectName) =>
    parseRegistryKeys(source, objectName),
  );
  return [...new Set(names)].sort((a, b) => a.localeCompare(b));
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writePetTestFile(entry) {
  const filename = `${slugify(entry.pack)}__${slugify(entry.name)}.generated.test.ts`;
  const filePath = path.join(TEST_ROOT, 'pets', filename);
  const abilityLiteral = entry.abilityText ? `'${quote(entry.abilityText)}'` : 'null';
  const safeName = quote(entry.name);
  const safePack = quote(entry.pack);
  const content = `import { describe, expect, it } from 'vitest';
import { runPetBehavior, runPetSmoke } from '../../support/smoke-test-runners';

const ABILITY_TEXT = ${abilityLiteral};
const ABILITY_SCOPE = '${entry.abilityScope}';
const ABILITY_SCOPE_REASON = '${quote(entry.abilityScopeReason)}';

describe('Generated pet test: ${safeName}', () => {
  it('runs ${safeName} without crashing', () => {
    const result = runPetSmoke({
      petName: '${safeName}',
      playerPack: '${safePack}',
      opponentPack: '${safePack}',
    });
    expect(result.playerWins + result.opponentWins + result.draws).toBeGreaterThanOrEqual(0);
  });

  if (ABILITY_SCOPE === 'battle') {
    it(\`validates battle ability behavior: \${ABILITY_TEXT}\`, () => {
      runPetBehavior({
        petName: '${safeName}',
        playerPack: '${safePack}',
        opponentPack: '${safePack}',
        abilityText: ABILITY_TEXT,
      });
    });
  } else {
    it.skip(\`battle behavior assertion skipped: \${ABILITY_SCOPE_REASON}\`, () => {});
  }
});
`;
  fs.writeFileSync(filePath, content, 'utf8');
}

function writeToyTestFile(name) {
  const filename = `${slugify(name.name)}.generated.test.ts`;
  const filePath = path.join(TEST_ROOT, 'toys', filename);
  const abilityLiteral = name.abilityText ? `'${quote(name.abilityText)}'` : 'null';
  const safeName = quote(name.name);
  const content = `import { describe, expect, it } from 'vitest';
import { runToyBehavior, runToySmoke } from '../../support/smoke-test-runners';

const ABILITY_TEXT = ${abilityLiteral};
const ABILITY_SCOPE = '${name.abilityScope}';
const ABILITY_SCOPE_REASON = '${quote(name.abilityScopeReason)}';

describe('Generated toy test: ${safeName}', () => {
  it('runs ${safeName} without crashing', () => {
    const result = runToySmoke({
      toyName: '${safeName}',
    });
    expect(result.playerWins + result.opponentWins + result.draws).toBeGreaterThanOrEqual(0);
  });

  if (ABILITY_SCOPE === 'battle') {
    it(\`validates battle ability behavior: \${ABILITY_TEXT}\`, () => {
      runToyBehavior({
        toyName: '${safeName}',
        abilityText: ABILITY_TEXT,
      });
    });
  } else {
    it.skip(\`battle behavior assertion skipped: \${ABILITY_SCOPE_REASON}\`, () => {});
  }
});
`;
  fs.writeFileSync(filePath, content, 'utf8');
}

function writeEquipmentTestFile(name) {
  const filename = `${slugify(name.name)}.generated.test.ts`;
  const filePath = path.join(TEST_ROOT, 'equipment', filename);
  const abilityLiteral = name.abilityText ? `'${quote(name.abilityText)}'` : 'null';
  const safeName = quote(name.name);
  const content = `import { describe, expect, it } from 'vitest';
import { runEquipmentBehavior, runEquipmentSmoke } from '../../support/smoke-test-runners';

const ABILITY_TEXT = ${abilityLiteral};
const ABILITY_SCOPE = '${name.abilityScope}';
const ABILITY_SCOPE_REASON = '${quote(name.abilityScopeReason)}';

describe('Generated equipment test: ${safeName}', () => {
  it('runs ${safeName} without crashing', () => {
    const result = runEquipmentSmoke({
      equipmentName: '${safeName}',
    });
    expect(result.playerWins + result.opponentWins + result.draws).toBeGreaterThanOrEqual(0);
  });

  if (ABILITY_SCOPE === 'battle') {
    it(\`validates battle ability behavior: \${ABILITY_TEXT}\`, () => {
      runEquipmentBehavior({
        equipmentName: '${safeName}',
        abilityText: ABILITY_TEXT,
      });
    });
  } else {
    it.skip(\`battle behavior assertion skipped: \${ABILITY_SCOPE_REASON}\`, () => {});
  }
});
`;
  fs.writeFileSync(filePath, content, 'utf8');
}

function writeManifest(pets, toys, equipment) {
  const payload = {
    generatedAt: new Date().toISOString(),
    counts: {
      pets: pets.length,
      toys: toys.length,
      equipment: equipment.length,
    },
    pets,
    toys,
    equipment,
  };
  fs.writeFileSync(
    path.join(TEST_ROOT, 'entity-manifest.json'),
    `${JSON.stringify(payload, null, 2)}\n`,
    'utf8',
  );
}

function main() {
  const petAbilities = buildPetAbilityMap();
  const toyAbilities = buildToyAbilityMap();
  const equipmentAbilities = buildEquipmentAbilityMap();

  const pets = parsePetEntries().map((entry) =>
    withAbilityMeta(entry, petAbilities, 'pet'),
  );
  const toys = parseToyEntries().map((name) =>
    withAbilityMeta({ name }, toyAbilities, 'toy'),
  );
  const equipment = parseEquipmentEntries().map((name) =>
    withAbilityMeta({ name }, equipmentAbilities, 'equipment'),
  );

  fs.rmSync(TEST_ROOT, { recursive: true, force: true });
  ensureDir(path.join(TEST_ROOT, 'pets'));
  ensureDir(path.join(TEST_ROOT, 'toys'));
  ensureDir(path.join(TEST_ROOT, 'equipment'));

  for (const pet of pets) {
    writePetTestFile(pet);
  }
  for (const toy of toys) {
    writeToyTestFile(toy);
  }
  for (const item of equipment) {
    writeEquipmentTestFile(item);
  }

  writeManifest(pets, toys, equipment);
  const battlePetCount = pets.filter((entry) => entry.abilityScope === 'battle').length;
  const battleToyCount = toys.filter((entry) => entry.abilityScope === 'battle').length;
  const battleEquipmentCount = equipment.filter(
    (entry) => entry.abilityScope === 'battle',
  ).length;
  console.log(
    `Generated ${pets.length} pet tests (${battlePetCount} battle-behavior), ${toys.length} toy tests (${battleToyCount} battle-behavior), ${equipment.length} equipment tests (${battleEquipmentCount} battle-behavior).`,
  );
}

main();

