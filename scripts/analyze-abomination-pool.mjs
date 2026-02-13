import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PETS_JSON = path.join(ROOT, 'src', 'assets', 'data', 'pets.json');
const OUTPUT_DIR = path.join(ROOT, 'tmp');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'abomination-pool-report.json');
const DEFAULT_MIN_TIER = null;

const DEAD_TRIGGER_PREFIXES = new Set(
  [
    'start of turn',
    'end turn',
    'special end turn',
    'buy',
    'friend bought',
    'sell',
    'friend sold',
    'sell friend',
    'roll',
    'roll 3 times',
    'roll & sell',
    'shop tier upgraded',
    'spend gold',
    'eats food',
    'eats two food',
    'friendly ate food',
    'food bought',
    'no ability.',
    'has no special ability. is kind of lame combat-wise. but he truly believes in you!',
    "does not provide shop rewards on level-up.",
  ].map((value) => normalizeKey(value)),
);

function normalizeKey(value) {
  return `${value ?? ''}`.trim().toLowerCase().replace(/\s+/g, ' ');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function parseInteger(value, fallback = null) {
  if (value == null || value === '') {
    return fallback;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.trunc(parsed);
}

function parseListValue(rawValue) {
  if (!rawValue) {
    return [];
  }
  return `${rawValue}`
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function printHelpAndExit() {
  console.log('Usage: node scripts/analyze-abomination-pool.mjs [options]');
  console.log('');
  console.log('Options:');
  console.log(
    '  --min-tier <number>        Keep only swallowed pets at/above this tier.',
  );
  console.log(
    '  --allow <petName>          Exception pet name to allow below min tier (repeatable).',
  );
  console.log(
    '  --allow-list <a,b,c>       Comma-separated exception pet names below min tier.',
  );
  console.log(
    '  --exclude-random           Remove random pets from pool (off by default).',
  );
  console.log(
    '  --output <filePath>        Output report path (default: tmp/abomination-pool-report.json).',
  );
  console.log('  --help                      Show this help.');
  console.log('');
  console.log('Environment alternatives:');
  console.log('  ABOM_MIN_TIER=4');
  console.log('  ABOM_ALLOW_LIST=Guineafowl,Rat');
  console.log('  ABOM_EXCLUDE_RANDOM=true');
  process.exit(0);
}

function parseOptions(argv) {
  const envMinTier = parseInteger(process.env.ABOM_MIN_TIER, DEFAULT_MIN_TIER);
  const envAllowList = parseListValue(process.env.ABOM_ALLOW_LIST);
  const envExcludeRandom = /^(1|true|yes)$/i.test(
    `${process.env.ABOM_EXCLUDE_RANDOM ?? ''}`.trim(),
  );
  const envOutput = `${process.env.ABOM_OUTPUT_FILE ?? ''}`.trim();

  const options = {
    minTier: envMinTier,
    allowedLowTierPets: new Set(envAllowList),
    excludeRandom: envExcludeRandom,
    outputFile: envOutput || OUTPUT_FILE,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      printHelpAndExit();
    }
    if (arg === '--exclude-random') {
      options.excludeRandom = true;
      continue;
    }
    if (arg.startsWith('--min-tier=')) {
      options.minTier = parseInteger(arg.split('=').slice(1).join('='), null);
      continue;
    }
    if (arg === '--min-tier') {
      options.minTier = parseInteger(argv[i + 1], null);
      i += 1;
      continue;
    }
    if (arg.startsWith('--allow=')) {
      const value = arg.split('=').slice(1).join('=').trim();
      if (value) {
        options.allowedLowTierPets.add(value);
      }
      continue;
    }
    if (arg === '--allow') {
      const value = `${argv[i + 1] ?? ''}`.trim();
      if (value) {
        options.allowedLowTierPets.add(value);
      }
      i += 1;
      continue;
    }
    if (arg.startsWith('--allow-list=')) {
      const entries = parseListValue(arg.split('=').slice(1).join('='));
      for (const entry of entries) {
        options.allowedLowTierPets.add(entry);
      }
      continue;
    }
    if (arg === '--allow-list') {
      const entries = parseListValue(argv[i + 1]);
      for (const entry of entries) {
        options.allowedLowTierPets.add(entry);
      }
      i += 1;
      continue;
    }
    if (arg.startsWith('--output=')) {
      const value = arg.split('=').slice(1).join('=').trim();
      if (value) {
        options.outputFile = path.resolve(ROOT, value);
      }
      continue;
    }
    if (arg === '--output') {
      const value = `${argv[i + 1] ?? ''}`.trim();
      if (value) {
        options.outputFile = path.resolve(ROOT, value);
      }
      i += 1;
      continue;
    }
  }

  const normalizedAllowed = [...options.allowedLowTierPets]
    .map((name) => name.trim())
    .filter((name) => name.length > 0);

  return {
    minTier: options.minTier,
    allowedLowTierPets: normalizedAllowed,
    excludeRandom: options.excludeRandom,
    outputFile: path.resolve(ROOT, options.outputFile),
  };
}

function extractAbilityPrefixes(pet) {
  if (!Array.isArray(pet?.Abilities)) {
    return [];
  }
  const prefixes = new Set();
  for (const ability of pet.Abilities) {
    const about = typeof ability?.About === 'string' ? ability.About.trim() : '';
    if (!about) {
      continue;
    }
    const colonIndex = about.indexOf(':');
    const prefix = colonIndex > 0 ? about.slice(0, colonIndex).trim() : about;
    prefixes.add(prefix);
  }
  return [...prefixes];
}

function log10Choose(n, k) {
  if (!Number.isFinite(n) || !Number.isFinite(k) || k < 0 || n < k) {
    return Number.NEGATIVE_INFINITY;
  }
  let sum = 0;
  for (let i = 1; i <= k; i += 1) {
    sum += Math.log10(n - k + i) - Math.log10(i);
  }
  return sum;
}

function estimateFiveAbominationSearchLog10(candidateCount) {
  let sum = 0;
  for (let i = 0; i < 5; i += 1) {
    sum += log10Choose(candidateCount - i * 3, 3);
  }
  return sum;
}

function estimateLockedPangasiusSearchLog10(candidateCount) {
  if (candidateCount < 15) {
    return Number.NEGATIVE_INFINITY;
  }
  // One swallowed slot is forced to Giant Pangasius; choose which Abomination gets it.
  let sum = Math.log10(5);
  sum += log10Choose(candidateCount - 1, 2);
  sum += log10Choose(candidateCount - 3, 3);
  sum += log10Choose(candidateCount - 6, 3);
  sum += log10Choose(candidateCount - 9, 3);
  sum += log10Choose(candidateCount - 12, 3);
  return sum;
}

function formatApproximateMagnitude(log10Value) {
  if (!Number.isFinite(log10Value)) {
    return 'n/a';
  }
  return `10^${log10Value.toFixed(2)}`;
}

function applyTierConstraint(candidates, minTier, allowedLowTierPets) {
  if (!Number.isFinite(minTier)) {
    return {
      constrained: candidates,
      droppedByTier: [],
      allowedByException: [],
    };
  }

  const exceptionSet = new Set(allowedLowTierPets.map((name) => normalizeKey(name)));
  const constrained = [];
  const droppedByTier = [];
  const allowedByException = [];

  for (const pet of candidates) {
    const petTier = Number(pet.tier);
    const petNameKey = normalizeKey(pet.name);
    const matchesTier = Number.isFinite(petTier) && petTier >= minTier;
    const matchesException = exceptionSet.has(petNameKey);

    if (matchesTier || matchesException) {
      constrained.push(pet);
      if (!matchesTier && matchesException) {
        allowedByException.push(pet.name);
      }
      continue;
    }
    droppedByTier.push(pet.name);
  }

  return {
    constrained,
    droppedByTier: droppedByTier.sort(),
    allowedByException: allowedByException.sort(),
  };
}

function buildTierCounts(pets) {
  const counts = new Map();
  for (const pet of pets) {
    const tierKey = Number.isFinite(pet.tier) ? `${pet.tier}` : 'unknown';
    counts.set(tierKey, (counts.get(tierKey) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([tier, count]) => ({ tier, count }));
}

function main() {
  const options = parseOptions(process.argv.slice(2));
  const allPets = readJson(PETS_JSON);
  const rollablePets = allPets.filter(
    (pet) => pet?.Rollable === true && typeof pet?.Name === 'string' && pet.Name,
  );

  const analyzedPets = rollablePets.map((pet) => {
    const prefixes = extractAbilityPrefixes(pet);
    const deadPrefixes = prefixes.filter((prefix) =>
      DEAD_TRIGGER_PREFIXES.has(normalizeKey(prefix)),
    );
    const deadOnly = prefixes.length > 0 && deadPrefixes.length === prefixes.length;

    return {
      name: pet.Name,
      tier: Number(pet.Tier) || null,
      packCodes: Array.isArray(pet.Packs) ? pet.Packs : [],
      prefixes,
      deadOnly,
      isRandom: pet.Random === true,
    };
  });

  const baseCandidates = analyzedPets.filter(
    (pet) =>
      pet.prefixes.length > 0 &&
      !pet.deadOnly &&
      (options.excludeRandom ? !pet.isRandom : true),
  );
  const removedByDeadTrigger = analyzedPets.filter(
    (pet) => pet.prefixes.length === 0 || pet.deadOnly,
  );
  const removedByRandomRule = options.excludeRandom
    ? analyzedPets.filter((pet) => pet.isRandom && pet.prefixes.length > 0 && !pet.deadOnly)
    : [];
  const tierConstraint = applyTierConstraint(
    baseCandidates,
    options.minTier,
    options.allowedLowTierPets,
  );
  const candidatePets = tierConstraint.constrained;
  const removedPets = analyzedPets.filter((pet) =>
    !candidatePets.some((candidate) => candidate.name === pet.name),
  );

  const prefixStats = new Map();
  for (const pet of candidatePets) {
    for (const prefix of pet.prefixes) {
      const key = normalizeKey(prefix);
      if (DEAD_TRIGGER_PREFIXES.has(key)) {
        continue;
      }
      prefixStats.set(prefix, (prefixStats.get(prefix) ?? 0) + 1);
    }
  }

  const basePoolSearchLog10 = estimateFiveAbominationSearchLog10(
    baseCandidates.length,
  );
  const basePoolLockedPangasiusLog10 = estimateLockedPangasiusSearchLog10(
    baseCandidates.length,
  );
  const searchLog10 = estimateFiveAbominationSearchLog10(candidatePets.length);
  const lockedPangasiusLog10 =
    estimateLockedPangasiusSearchLog10(candidatePets.length);

  const allowedLowTierNotFound = options.allowedLowTierPets.filter(
    (name) =>
      !analyzedPets.some((pet) => normalizeKey(pet.name) === normalizeKey(name)),
  );

  const report = {
    generatedAt: new Date().toISOString(),
    constraints: {
      excludeRandom: options.excludeRandom,
      minTier: Number.isFinite(options.minTier) ? options.minTier : null,
      allowedLowTierPets: options.allowedLowTierPets.sort(),
      allowedLowTierPetsFound: tierConstraint.allowedByException,
      allowedLowTierPetsNotFound: allowedLowTierNotFound.sort(),
    },
    totals: {
      totalPetsInData: allPets.length,
      rollablePets: rollablePets.length,
      baseCandidatesAfterDeadTriggerFilter: baseCandidates.length,
      removedByDeadTriggerFilter: removedByDeadTrigger.length,
      removedByRandomFilter: removedByRandomRule.length,
      candidateSwallowedPets: candidatePets.length,
      removedPets: removedPets.length,
    },
    tierCounts: {
      candidatePool: buildTierCounts(candidatePets),
      removedByTierConstraint: buildTierCounts(
        baseCandidates.filter((pet) => tierConstraint.droppedByTier.includes(pet.name)),
      ),
    },
    searchSpaceEstimates: {
      basePoolFiveAbominationsLog10: basePoolSearchLog10,
      basePoolFiveAbominationsApproximate: formatApproximateMagnitude(
        basePoolSearchLog10,
      ),
      basePoolOneLockedGiantPangasiusLog10: basePoolLockedPangasiusLog10,
      basePoolOneLockedGiantPangasiusApproximate: formatApproximateMagnitude(
        basePoolLockedPangasiusLog10,
      ),
      currentCandidatePoolFiveAbominationsLog10: searchLog10,
      currentCandidatePoolFiveAbominationsApproximate: formatApproximateMagnitude(
        searchLog10,
      ),
      currentCandidatePoolOneLockedGiantPangasiusLog10: lockedPangasiusLog10,
      currentCandidatePoolOneLockedGiantPangasiusApproximate:
        formatApproximateMagnitude(
        lockedPangasiusLog10,
      ),
    },
    deadTriggerPrefixes: [...DEAD_TRIGGER_PREFIXES].sort(),
    topLivePrefixes: [...prefixStats.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 40)
      .map(([prefix, count]) => ({ prefix, count })),
    candidatePetNames: candidatePets.map((pet) => pet.name).sort(),
    removedPetNames: removedPets.map((pet) => pet.name).sort(),
  };

  fs.mkdirSync(path.dirname(options.outputFile), { recursive: true });
  fs.writeFileSync(options.outputFile, JSON.stringify(report, null, 2));

  console.log('Abomination pool analysis complete.');
  console.log(
    `Mode: ${options.excludeRandom ? 'random excluded' : 'random included'}${
      Number.isFinite(options.minTier) ? `, min tier ${options.minTier}` : ''
    }`,
  );
  console.log(`Total pets in data: ${report.totals.totalPetsInData}`);
  console.log(`Rollable pets: ${report.totals.rollablePets}`);
  console.log(
    `Base candidates (dead-trigger filter only): ${report.totals.baseCandidatesAfterDeadTriggerFilter}`,
  );
  console.log(`Candidate swallowed pets: ${report.totals.candidateSwallowedPets}`);
  console.log(`Removed pets: ${report.totals.removedPets}`);
  if (Number.isFinite(options.minTier)) {
    console.log(
      `Allowed by low-tier exceptions: ${report.constraints.allowedLowTierPetsFound.length}`,
    );
  }
  console.log(
    `Estimated 5-Abomination search size: ${report.searchSpaceEstimates.currentCandidatePoolFiveAbominationsApproximate}`,
  );
  console.log(
    `Estimated with one locked Giant Pangasius: ${report.searchSpaceEstimates.currentCandidatePoolOneLockedGiantPangasiusApproximate}`,
  );
  console.log(`Report written to: ${path.relative(ROOT, options.outputFile)}`);
}

main();
