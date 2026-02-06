import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'tests', 'specs', 'pilot');
const PET_REGISTRY_DIR = path.join(
  ROOT,
  'src',
  'app',
  'services',
  'pet',
  'registry',
);
const TOY_REGISTRY_FILE = path.join(
  ROOT,
  'src',
  'app',
  'services',
  'toy',
  'toy-registry.ts',
);
const EQUIPMENT_REGISTRY_FILE = path.join(
  ROOT,
  'src',
  'app',
  'services',
  'equipment',
  'equipment-registry.ts',
);
const PETS_JSON = path.join(ROOT, 'src', 'assets', 'data', 'pets.json');
const TOYS_JSON = path.join(ROOT, 'src', 'assets', 'data', 'toys.json');
const FOOD_JSON = path.join(ROOT, 'src', 'assets', 'data', 'food.json');
const PERKS_JSON = path.join(ROOT, 'src', 'assets', 'data', 'perks.json');

const PILOT_COUNTS = {
  pets: 20,
  toys: 10,
  equipment: 10,
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
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
    if (key) {
      keys.push(key);
    }
    match = keyRegex.exec(body);
  }
  return keys;
}

function parsePetRegistry() {
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
    const suffix = file.replace(/^pet-registry\./, '').replace(/\.ts$/, '');
    const pack =
      suffix.toLowerCase() === 'hidden'
        ? 'Custom'
        : `${suffix[0].toUpperCase()}${suffix.slice(1).toLowerCase()}`;
    for (const name of parseRegistryKeys(source, objectName)) {
      entries.push({ name, pack });
    }
  }
  return entries;
}

function parseToyRegistry() {
  const source = fs.readFileSync(TOY_REGISTRY_FILE, 'utf8');
  const objectNames = [
    'STANDARD_TOYS',
    'TOYS_NEEDING_ABILITY_SERVICE',
    'SPECIAL_TOY_BUILDERS',
  ];
  return [...new Set(objectNames.flatMap((n) => parseRegistryKeys(source, n)))];
}

function parseEquipmentRegistry() {
  const source = fs.readFileSync(EQUIPMENT_REGISTRY_FILE, 'utf8');
  const objectNames = [
    'NO_ARG_EQUIPMENT',
    'LOG_ONLY_EQUIPMENT',
    'LOG_ABILITY_EQUIPMENT',
    'NO_ARG_AILMENTS',
    'SPECIAL_EQUIPMENT_BUILDERS',
    'SPECIAL_AILMENT_BUILDERS',
  ];
  return [...new Set(objectNames.flatMap((n) => parseRegistryKeys(source, n)))];
}

function firstAbilityText(entry) {
  if (!Array.isArray(entry?.Abilities)) {
    return null;
  }
  const lvl1 =
    entry.Abilities.find((a) => Number(a?.Level) === 1)?.About ??
    entry.Abilities[0]?.About;
  if (typeof lvl1 !== 'string') {
    return null;
  }
  if (/^No ability\./i.test(lvl1.trim())) {
    return null;
  }
  return lvl1.trim();
}

function getPilotPets() {
  const petRegistry = parsePetRegistry();
  const petData = readJson(PETS_JSON);
  const dataByName = new Map(petData.map((p) => [p.Name, p]));
  const entries = [];
  for (const regEntry of petRegistry) {
    const data = dataByName.get(regEntry.name);
    const behavior = firstAbilityText(data);
    if (!behavior) {
      continue;
    }
    entries.push({
      name: regEntry.name,
      pack: regEntry.pack,
      behavior,
    });
  }
  entries.sort((a, b) =>
    a.pack === b.pack
      ? a.name.localeCompare(b.name)
      : a.pack.localeCompare(b.pack),
  );
  const seen = new Set();
  const unique = entries.filter((entry) => {
    const key = `${entry.pack}|${entry.name}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
  return unique.slice(0, PILOT_COUNTS.pets);
}

function getPilotToys() {
  const toyRegistry = parseToyRegistry();
  const toyData = readJson(TOYS_JSON);
  const dataByName = new Map(toyData.map((t) => [t.Name, t]));
  const entries = [];
  for (const name of toyRegistry) {
    const behavior = firstAbilityText(dataByName.get(name));
    if (!behavior) {
      continue;
    }
    entries.push({ name, behavior });
  }
  entries.sort((a, b) => a.name.localeCompare(b.name));
  return entries.slice(0, PILOT_COUNTS.toys);
}

function getPilotEquipment() {
  const equipmentRegistry = parseEquipmentRegistry();
  const foodData = readJson(FOOD_JSON);
  const perksData = readJson(PERKS_JSON);
  const behaviorByName = new Map();
  for (const row of foodData) {
    if (row?.Name && typeof row?.Ability === 'string') {
      behaviorByName.set(row.Name, row.Ability.trim());
    }
  }
  for (const row of perksData) {
    if (row?.Name && typeof row?.Ability === 'string') {
      behaviorByName.set(row.Name, row.Ability.trim());
    }
  }

  const entries = [];
  for (const name of equipmentRegistry) {
    const behavior = behaviorByName.get(name);
    if (!behavior || /^No ability\./i.test(behavior)) {
      continue;
    }
    entries.push({ name, behavior });
  }
  entries.sort((a, b) => a.name.localeCompare(b.name));
  return entries.slice(0, PILOT_COUNTS.equipment);
}

function quote(value) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function buildPetsSpec(pets) {
  const rows = pets
    .map(
      (p) =>
        `  { name: '${quote(p.name)}', pack: '${quote(p.pack)}', behavior: '${quote(
          p.behavior,
        )}' },`,
    )
    .join('\n');
  return `import { describe, expect, it } from 'vitest';
import { runPetSmoke } from '../../helpers/simulation-fixtures';

const PILOT_PETS = [
${rows}
] as const;

describe('Pilot Pet Specs (Generated)', () => {
  for (const pet of PILOT_PETS) {
    describe(\`\${pet.pack} / \${pet.name}\`, () => {
      it('has level 1 behavior text', () => {
        expect(pet.behavior.length).toBeGreaterThan(0);
        expect(pet.behavior.toLowerCase()).not.toContain('no ability');
      });

      it('smoke runs in battle simulation', () => {
        const result = runPetSmoke({
          petName: pet.name,
          playerPack: pet.pack as any,
          opponentPack: pet.pack as any,
        });
        expect(result.playerWins + result.opponentWins + result.draws).toBeGreaterThanOrEqual(0);
      });

      it.todo(\`runtime behavior assertion: \${pet.behavior}\`);
    });
  }
});
`;
}

function buildToysSpec(toys) {
  const rows = toys
    .map(
      (t) =>
        `  { name: '${quote(t.name)}', behavior: '${quote(t.behavior)}' },`,
    )
    .join('\n');
  return `import { describe, expect, it } from 'vitest';
import { runToySmoke } from '../../helpers/simulation-fixtures';

const PILOT_TOYS = [
${rows}
] as const;

describe('Pilot Toy Specs (Generated)', () => {
  for (const toy of PILOT_TOYS) {
    describe(toy.name, () => {
      it('has level 1 behavior text', () => {
        expect(toy.behavior.length).toBeGreaterThan(0);
        expect(toy.behavior.toLowerCase()).not.toContain('no ability');
      });

      it('smoke runs in battle simulation', () => {
        const result = runToySmoke({ toyName: toy.name });
        expect(result.playerWins + result.opponentWins + result.draws).toBeGreaterThanOrEqual(0);
      });

      it.todo(\`runtime behavior assertion: \${toy.behavior}\`);
    });
  }
});
`;
}

function buildEquipmentSpec(equipment) {
  const rows = equipment
    .map(
      (e) =>
        `  { name: '${quote(e.name)}', behavior: '${quote(e.behavior)}' },`,
    )
    .join('\n');
  return `import { describe, expect, it } from 'vitest';
import { runEquipmentSmoke } from '../../helpers/simulation-fixtures';

const PILOT_EQUIPMENT = [
${rows}
] as const;

describe('Pilot Equipment Specs (Generated)', () => {
  for (const item of PILOT_EQUIPMENT) {
    describe(item.name, () => {
      it('has behavior text', () => {
        expect(item.behavior.length).toBeGreaterThan(0);
        expect(item.behavior.toLowerCase()).not.toContain('no ability');
      });

      it('smoke runs in battle simulation', () => {
        const result = runEquipmentSmoke({ equipmentName: item.name });
        expect(result.playerWins + result.opponentWins + result.draws).toBeGreaterThanOrEqual(0);
      });

      it.todo(\`runtime behavior assertion: \${item.behavior}\`);
    });
  }
});
`;
}

function main() {
  const pilotPets = getPilotPets();
  const pilotToys = getPilotToys();
  const pilotEquipment = getPilotEquipment();

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(OUT_DIR, 'pilot-pets.spec.ts'),
    buildPetsSpec(pilotPets),
    'utf8',
  );
  fs.writeFileSync(
    path.join(OUT_DIR, 'pilot-toys.spec.ts'),
    buildToysSpec(pilotToys),
    'utf8',
  );
  fs.writeFileSync(
    path.join(OUT_DIR, 'pilot-equipment.spec.ts'),
    buildEquipmentSpec(pilotEquipment),
    'utf8',
  );
  fs.writeFileSync(
    path.join(OUT_DIR, 'pilot-manifest.json'),
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        counts: {
          pets: pilotPets.length,
          toys: pilotToys.length,
          equipment: pilotEquipment.length,
        },
        pets: pilotPets,
        toys: pilotToys,
        equipment: pilotEquipment,
      },
      null,
      2,
    )}\n`,
    'utf8',
  );

  console.log(
    `Generated pilot specs: ${pilotPets.length} pets, ${pilotToys.length} toys, ${pilotEquipment.length} equipment.`,
  );
}

main();
