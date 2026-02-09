import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();
const GENERATED_ROOT = path.join(ROOT, 'tests', 'generated');
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

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');

const extractObjectBody = (source: string, objectName: string): string => {
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

const parseRegistryKeys = (source: string, objectName: string): string[] => {
  const body = extractObjectBody(source, objectName);
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

const parsePetEntries = (): Array<{ name: string; pack: string }> => {
  const files = fs
    .readdirSync(PET_REGISTRY_DIR)
    .filter((file) => file.startsWith('pet-registry.') && file.endsWith('.ts'));

  const result: Array<{ name: string; pack: string }> = [];
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
      result.push({ name, pack });
    }
  }
  return result;
};

const parseToyEntries = (): string[] => {
  const source = fs.readFileSync(TOY_REGISTRY_FILE, 'utf8');
  const objectNames = [
    'STANDARD_TOYS',
    'TOYS_NEEDING_ABILITY_SERVICE',
    'SPECIAL_TOY_BUILDERS',
  ];
  return [...new Set(objectNames.flatMap((name) => parseRegistryKeys(source, name)))];
};

const parseEquipmentEntries = (): string[] => {
  const source = fs.readFileSync(EQUIPMENT_REGISTRY_FILE, 'utf8');
  const objectNames = [
    'NO_ARG_EQUIPMENT',
    'LOG_ONLY_EQUIPMENT',
    'LOG_ABILITY_EQUIPMENT',
    'NO_ARG_AILMENTS',
    'SPECIAL_EQUIPMENT_BUILDERS',
    'SPECIAL_AILMENT_BUILDERS',
  ];
  return [...new Set(objectNames.flatMap((name) => parseRegistryKeys(source, name)))];
};

describe('Generated entity test coverage', () => {
  it('has generated pet tests for all registry pets', () => {
    const missing: string[] = [];
    for (const entry of parsePetEntries()) {
      const filename = `${slugify(entry.pack)}__${slugify(entry.name)}.generated.test.ts`;
      const testPath = path.join(GENERATED_ROOT, 'pets', filename);
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
    for (const name of parseToyEntries()) {
      const filename = `${slugify(name)}.generated.test.ts`;
      const testPath = path.join(GENERATED_ROOT, 'toys', filename);
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
    for (const name of parseEquipmentEntries()) {
      const filename = `${slugify(name)}.generated.test.ts`;
      const testPath = path.join(GENERATED_ROOT, 'equipment', filename);
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
