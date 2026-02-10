import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const WORKSPACE_ROOT = process.cwd();
const GENERATED_TESTS_ROOT = path.join(WORKSPACE_ROOT, 'tests', 'generated');
const PET_REGISTRIES_DIR = path.join(
  WORKSPACE_ROOT,
  'src',
  'app',
  'integrations',
  'pet',
  'registries',
);
const TOY_REGISTRY_FILE = path.join(
  WORKSPACE_ROOT,
  'src',
  'app',
  'integrations',
  'toy',
  'toy-registry.ts',
);
const EQUIPMENT_REGISTRY_FILE = path.join(
  WORKSPACE_ROOT,
  'src',
  'app',
  'integrations',
  'equipment',
  'equipment-registry.ts',
);

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');

const extractExportedObjectBody = (
  source: string,
  objectName: string,
): string => {
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
};

const parseRegistryObjectKeys = (source: string, objectName: string): string[] => {
  const body = extractExportedObjectBody(source, objectName);
  const keys: string[] = [];
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
};

const collectPetRegistryEntries = (): Array<{ name: string; pack: string }> => {
  const registryFiles = fs
    .readdirSync(PET_REGISTRIES_DIR)
    .filter((file) => file.startsWith('pet-registry.') && file.endsWith('.ts'));

  const entries: Array<{ name: string; pack: string }> = [];
  for (const file of registryFiles) {
    const registryFilePath = path.join(PET_REGISTRIES_DIR, file);
    const source = fs.readFileSync(registryFilePath, 'utf8');
    const registryObjectMatch = source.match(
      /export const ([A-Z_]+_PET_REGISTRY)\s*:\s*\{[^}]+\}\s*=\s*\{/,
    );
    if (!registryObjectMatch) {
      continue;
    }
    const objectName = registryObjectMatch[1];
    const registrySuffix = file.replace(/^pet-registry\./, '').replace(/\.ts$/, '');
    const pack =
      registrySuffix.toLowerCase() === 'hidden'
        ? 'Custom'
        : `${registrySuffix[0].toUpperCase()}${registrySuffix.slice(1).toLowerCase()}`;
    for (const petName of parseRegistryObjectKeys(source, objectName)) {
      entries.push({ name: petName, pack });
    }
  }
  return entries;
};

const collectToyRegistryNames = (): string[] => {
  const source = fs.readFileSync(TOY_REGISTRY_FILE, 'utf8');
  const registryObjectNames = [
    'STANDARD_TOYS',
    'TOYS_NEEDING_ABILITY_SERVICE',
    'SPECIAL_TOY_BUILDERS',
  ];
  return [
    ...new Set(
      registryObjectNames.flatMap((name) => parseRegistryObjectKeys(source, name)),
    ),
  ];
};

const collectEquipmentRegistryNames = (): string[] => {
  const source = fs.readFileSync(EQUIPMENT_REGISTRY_FILE, 'utf8');
  const registryObjectNames = [
    'NO_ARG_EQUIPMENT',
    'LOG_ONLY_EQUIPMENT',
    'LOG_ABILITY_EQUIPMENT',
    'NO_ARG_AILMENTS',
    'SPECIAL_EQUIPMENT_BUILDERS',
    'SPECIAL_AILMENT_BUILDERS',
  ];
  return [
    ...new Set(
      registryObjectNames.flatMap((name) =>
        parseRegistryObjectKeys(source, name),
      ),
    ),
  ];
};

describe('Generated entity test coverage', () => {
  it('has generated pet tests for all registry pets', () => {
    const missing: string[] = [];
    for (const entry of collectPetRegistryEntries()) {
      const filename = `${slugify(entry.pack)}__${slugify(entry.name)}.generated.test.ts`;
      const testPath = path.join(GENERATED_TESTS_ROOT, 'pets', filename);
      if (!fs.existsSync(testPath)) {
        missing.push(`${entry.pack}:${entry.name}`);
      }
    }
    expect(
      missing,
      `Missing pet generated tests (${missing.length}):\n${missing.join('\n')}`,
    ).toEqual([]);
  });

  it('has generated toy tests for all registry toys', () => {
    const missing: string[] = [];
    for (const name of collectToyRegistryNames()) {
      const filename = `${slugify(name)}.generated.test.ts`;
      const testPath = path.join(GENERATED_TESTS_ROOT, 'toys', filename);
      if (!fs.existsSync(testPath)) {
        missing.push(name);
      }
    }
    expect(
      missing,
      `Missing toy generated tests (${missing.length}):\n${missing.join('\n')}`,
    ).toEqual([]);
  });

  it('has generated equipment tests for all registry equipment', () => {
    const missing: string[] = [];
    for (const name of collectEquipmentRegistryNames()) {
      const filename = `${slugify(name)}.generated.test.ts`;
      const testPath = path.join(GENERATED_TESTS_ROOT, 'equipment', filename);
      if (!fs.existsSync(testPath)) {
        missing.push(name);
      }
    }
    expect(
      missing,
      `Missing equipment generated tests (${missing.length}):\n${missing.join(
        '\n',
      )}`,
    ).toEqual([]);
  });
});
