import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TEST_ROOT = path.join(ROOT, 'tests', 'generated');

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

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');
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
  const content = `import { describe, expect, it } from 'vitest';
import { runPetSmoke } from '../../helpers/simulation-fixtures';

describe('Generated pet smoke: ${entry.name}', () => {
  it('runs ${entry.name} without crashing', () => {
    const result = runPetSmoke({
      petName: '${entry.name}',
      playerPack: '${entry.pack}',
      opponentPack: '${entry.pack}',
    });
    expect(result.playerWins + result.opponentWins + result.draws).toBeGreaterThanOrEqual(0);
  });
});
`;
  fs.writeFileSync(filePath, content, 'utf8');
}

function writeToyTestFile(name) {
  const filename = `${slugify(name)}.generated.test.ts`;
  const filePath = path.join(TEST_ROOT, 'toys', filename);
  const content = `import { describe, expect, it } from 'vitest';
import { runToySmoke } from '../../helpers/simulation-fixtures';

describe('Generated toy smoke: ${name}', () => {
  it('runs ${name} without crashing', () => {
    const result = runToySmoke({
      toyName: '${name}',
    });
    expect(result.playerWins + result.opponentWins + result.draws).toBeGreaterThanOrEqual(0);
  });
});
`;
  fs.writeFileSync(filePath, content, 'utf8');
}

function writeEquipmentTestFile(name) {
  const filename = `${slugify(name)}.generated.test.ts`;
  const filePath = path.join(TEST_ROOT, 'equipment', filename);
  const content = `import { describe, expect, it } from 'vitest';
import { runEquipmentSmoke } from '../../helpers/simulation-fixtures';

describe('Generated equipment smoke: ${name}', () => {
  it('runs ${name} without crashing', () => {
    const result = runEquipmentSmoke({
      equipmentName: '${name}',
    });
    expect(result.playerWins + result.opponentWins + result.draws).toBeGreaterThanOrEqual(0);
  });
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
  const pets = parsePetEntries();
  const toys = parseToyEntries();
  const equipment = parseEquipmentEntries();

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
  console.log(
    `Generated ${pets.length} pet tests, ${toys.length} toy tests, ${equipment.length} equipment tests.`,
  );
}

main();
