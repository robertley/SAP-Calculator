import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import {
  MAX_MANA,
  MAX_ADVANCED,
  buildInfiniteDamageMirrorBaseConfig,
  applyMaxedBoardSettings,
  summarizeBaseConfig,
} from './lib/base-config.mjs';

const require = createRequire(import.meta.url);
const { runHeadlessSimulation } = require('../simulation/dist/index.js');

const ROOT = process.cwd();
const DEFAULT_SOURCE_REPORT = path.join(
  ROOT,
  'tmp',
  'search-a-flex-report.json',
);
const DEFAULT_OUTPUT = path.join(ROOT, 'tmp', 'search-c-triplets-report.json');

function normalizeName(value) {
  return `${value ?? ''}`.trim().toLowerCase();
}

function parseInteger(value, fallback) {
  if (value == null || value === '') {
    return fallback;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.trunc(parsed);
}

function parseList(value) {
  if (!value) {
    return [];
  }
  return `${value}`
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function printHelpAndExit() {
  console.log('Usage: node scripts/search-c-triplets.mjs [options]');
  console.log('');
  console.log(
    'Search C: score full 3-pet swallowed triplets for one Abomination slot.',
  );
  console.log('');
  console.log('Options:');
  console.log(
    '  --source-report <path>       Search A report with rankedResults (default: tmp/search-a-flex-report.json).',
  );
  console.log(
    '  --base-config <path>         SimulationConfig JSON. If omitted, built-in Infinite Damage mirror is used.',
  );
  console.log(
    '  --side <player|opponent>     Which side to mutate/optimize (default: player).',
  );
  console.log(
    '  --abom-slot <1-5>            Abomination board slot to optimize (default: 5).',
  );
  console.log(
    '  --top <number>               Use top N Search A candidates (default: 30).',
  );
  console.log(
    '  --ordered                    Evaluate ordered triplets (P(n,3)); default is unordered C(n,3).',
  );
  console.log(
    '  --simulations <number>       Battles per seed per triplet (default: 6).',
  );
  console.log(
    '  --seed-count <number>        Number of seeds per triplet (default: 1).',
  );
  console.log(
    '  --base-seed <number>         Initial seed used for first run (default: 777777).',
  );
  console.log(
    '  --start-triplet <number>     Skip first N generated triplets before scoring.',
  );
  console.log(
    '  --max-triplets <number>      Evaluate only first N triplets after start offset.',
  );
  console.log(
    '  --include <a,b,c>            Restrict candidate pool by name.',
  );
  console.log(
    '  --exclude <a,b,c>            Exclude candidates by name.',
  );
  console.log(
    '  --keep-top <number>          Keep only top N rows in memory/report (default: 500).',
  );
  console.log(
    '  --store-all                  Store all scored rows (uses more memory).',
  );
  console.log(
    '  --mirror                     Apply triplet to both sides at same slot.',
  );
  console.log(
    '  --no-maxed-board             Do not force mana=50 + advanced settings=99.',
  );
  console.log(
    '  --beluga-swallowed <name>    Fallback nested swallowed pet for Beluga Whale.',
  );
  console.log(
    '  --output <path>              Report output JSON (default: tmp/search-c-triplets-report.json).',
  );
  console.log('  --help                        Show this help.');
  process.exit(0);
}

function parseOptions(argv) {
  const options = {
    sourceReport: DEFAULT_SOURCE_REPORT,
    baseConfigPath: null,
    side: 'player',
    abomSlot: 5,
    top: 30,
    ordered: false,
    simulations: 6,
    seedCount: 1,
    baseSeed: 777777,
    startTriplet: 0,
    maxTriplets: null,
    include: [],
    exclude: [],
    keepTop: 500,
    storeAll: false,
    mirror: false,
    maxedBoardMode: true,
    belugaSwallowed: null,
    outputFile: DEFAULT_OUTPUT,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      printHelpAndExit();
    }
    if (arg.startsWith('--source-report=')) {
      options.sourceReport = path.resolve(
        ROOT,
        arg.split('=').slice(1).join('=').trim(),
      );
      continue;
    }
    if (arg === '--source-report') {
      options.sourceReport = path.resolve(ROOT, `${argv[i + 1] ?? ''}`.trim());
      i += 1;
      continue;
    }
    if (arg.startsWith('--base-config=')) {
      options.baseConfigPath = path.resolve(
        ROOT,
        arg.split('=').slice(1).join('=').trim(),
      );
      continue;
    }
    if (arg === '--base-config') {
      options.baseConfigPath = path.resolve(ROOT, `${argv[i + 1] ?? ''}`.trim());
      i += 1;
      continue;
    }
    if (arg.startsWith('--side=')) {
      options.side = arg.split('=').slice(1).join('=').trim().toLowerCase();
      continue;
    }
    if (arg === '--side') {
      options.side = `${argv[i + 1] ?? ''}`.trim().toLowerCase();
      i += 1;
      continue;
    }
    if (arg.startsWith('--abom-slot=')) {
      options.abomSlot = parseInteger(arg.split('=').slice(1).join('='), 5);
      continue;
    }
    if (arg === '--abom-slot') {
      options.abomSlot = parseInteger(argv[i + 1], 5);
      i += 1;
      continue;
    }
    if (arg.startsWith('--top=')) {
      options.top = parseInteger(arg.split('=').slice(1).join('='), 30);
      continue;
    }
    if (arg === '--top') {
      options.top = parseInteger(argv[i + 1], 30);
      i += 1;
      continue;
    }
    if (arg === '--ordered') {
      options.ordered = true;
      continue;
    }
    if (arg.startsWith('--simulations=')) {
      options.simulations = parseInteger(arg.split('=').slice(1).join('='), 6);
      continue;
    }
    if (arg === '--simulations') {
      options.simulations = parseInteger(argv[i + 1], 6);
      i += 1;
      continue;
    }
    if (arg.startsWith('--seed-count=')) {
      options.seedCount = parseInteger(arg.split('=').slice(1).join('='), 1);
      continue;
    }
    if (arg === '--seed-count') {
      options.seedCount = parseInteger(argv[i + 1], 1);
      i += 1;
      continue;
    }
    if (arg.startsWith('--base-seed=')) {
      options.baseSeed = parseInteger(arg.split('=').slice(1).join('='), 777777);
      continue;
    }
    if (arg === '--base-seed') {
      options.baseSeed = parseInteger(argv[i + 1], 777777);
      i += 1;
      continue;
    }
    if (arg.startsWith('--start-triplet=')) {
      options.startTriplet = parseInteger(
        arg.split('=').slice(1).join('='),
        0,
      );
      continue;
    }
    if (arg === '--start-triplet') {
      options.startTriplet = parseInteger(argv[i + 1], 0);
      i += 1;
      continue;
    }
    if (arg.startsWith('--max-triplets=')) {
      options.maxTriplets = parseInteger(
        arg.split('=').slice(1).join('='),
        null,
      );
      continue;
    }
    if (arg === '--max-triplets') {
      options.maxTriplets = parseInteger(argv[i + 1], null);
      i += 1;
      continue;
    }
    if (arg.startsWith('--include=')) {
      options.include = parseList(arg.split('=').slice(1).join('='));
      continue;
    }
    if (arg === '--include') {
      options.include = parseList(argv[i + 1]);
      i += 1;
      continue;
    }
    if (arg.startsWith('--exclude=')) {
      options.exclude = parseList(arg.split('=').slice(1).join('='));
      continue;
    }
    if (arg === '--exclude') {
      options.exclude = parseList(argv[i + 1]);
      i += 1;
      continue;
    }
    if (arg.startsWith('--keep-top=')) {
      options.keepTop = parseInteger(arg.split('=').slice(1).join('='), 500);
      continue;
    }
    if (arg === '--keep-top') {
      options.keepTop = parseInteger(argv[i + 1], 500);
      i += 1;
      continue;
    }
    if (arg === '--store-all') {
      options.storeAll = true;
      continue;
    }
    if (arg === '--mirror') {
      options.mirror = true;
      continue;
    }
    if (arg === '--no-maxed-board') {
      options.maxedBoardMode = false;
      continue;
    }
    if (arg.startsWith('--beluga-swallowed=')) {
      options.belugaSwallowed = arg.split('=').slice(1).join('=').trim() || null;
      continue;
    }
    if (arg === '--beluga-swallowed') {
      options.belugaSwallowed = `${argv[i + 1] ?? ''}`.trim() || null;
      i += 1;
      continue;
    }
    if (arg.startsWith('--output=')) {
      options.outputFile = path.resolve(
        ROOT,
        arg.split('=').slice(1).join('=').trim(),
      );
      continue;
    }
    if (arg === '--output') {
      options.outputFile = path.resolve(ROOT, `${argv[i + 1] ?? ''}`.trim());
      i += 1;
      continue;
    }
  }

  if (options.side !== 'player' && options.side !== 'opponent') {
    throw new Error(`Invalid side "${options.side}". Use "player" or "opponent".`);
  }
  if (options.abomSlot < 1 || options.abomSlot > 5) {
    throw new Error(`abom-slot must be 1..5. Received ${options.abomSlot}.`);
  }

  options.top = Math.max(1, options.top);
  options.simulations = Math.max(1, options.simulations);
  options.seedCount = Math.max(1, options.seedCount);
  options.startTriplet = Math.max(0, options.startTriplet);
  options.keepTop = Math.max(1, options.keepTop);
  return options;
}

function loadBaseConfig(options) {
  const config = options.baseConfigPath
    ? readJson(options.baseConfigPath)
    : buildInfiniteDamageMirrorBaseConfig();
  if (options.maxedBoardMode) {
    applyMaxedBoardSettings(config);
  }
  return config;
}

function resolveSidePetsKey(side) {
  return side === 'player' ? 'playerPets' : 'opponentPets';
}

function loadRankedCandidates(sourceReportPath, topN) {
  const report = readJson(sourceReportPath);
  if (!Array.isArray(report?.rankedResults)) {
    throw new Error(
      `Source report ${sourceReportPath} must contain rankedResults from Search A.`,
    );
  }

  const deduped = [];
  const seen = new Set();
  for (const row of report.rankedResults) {
    const candidate = typeof row?.candidate === 'string' ? row.candidate : null;
    if (!candidate || seen.has(normalizeName(candidate))) {
      continue;
    }
    seen.add(normalizeName(candidate));
    deduped.push({
      name: candidate,
      belugaSwallowedPet:
        typeof row?.belugaSwallowedPet === 'string' && row.belugaSwallowedPet
          ? row.belugaSwallowedPet
          : null,
    });
    if (deduped.length >= topN) {
      break;
    }
  }
  return deduped;
}

function ensureAbominationSlot(baseConfig, side, abomSlot) {
  const pets = baseConfig?.[resolveSidePetsKey(side)];
  const pet = pets?.[abomSlot - 1];
  if (!pet || pet.name !== 'Abomination') {
    throw new Error(
      `Slot ${abomSlot} on ${side} is not Abomination in base config.`,
    );
  }
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

function combinationsCount(n) {
  if (n < 3) {
    return 0;
  }
  const log10 = log10Choose(n, 3);
  if (log10 < 12) {
    return Math.round(10 ** log10);
  }
  return Number.POSITIVE_INFINITY;
}

function permutationsCount(n) {
  if (n < 3) {
    return 0;
  }
  return n * (n - 1) * (n - 2);
}

function* generateCombinationTriplets(n) {
  for (let i = 0; i < n - 2; i += 1) {
    for (let j = i + 1; j < n - 1; j += 1) {
      for (let k = j + 1; k < n; k += 1) {
        yield [i, j, k];
      }
    }
  }
}

function* generateOrderedTriplets(n) {
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if (j === i) {
        continue;
      }
      for (let k = 0; k < n; k += 1) {
        if (k === i || k === j) {
          continue;
        }
        yield [i, j, k];
      }
    }
  }
}

function applyCandidateToSwallowSlot(
  petConfig,
  swallowSlot,
  candidateEntry,
  options,
) {
  const baseField = `abominationSwallowedPet${swallowSlot}`;
  const levelField = `abominationSwallowedPet${swallowSlot}Level`;
  const timesHurtField = `abominationSwallowedPet${swallowSlot}TimesHurt`;
  const belugaField = `abominationSwallowedPet${swallowSlot}BelugaSwallowedPet`;
  const candidateName = candidateEntry.name;

  petConfig[baseField] = candidateName;
  if (!Number.isFinite(Number(petConfig[levelField]))) {
    petConfig[levelField] = 3;
  }
  if (!Number.isFinite(Number(petConfig[timesHurtField]))) {
    petConfig[timesHurtField] = 0;
  }

  if (candidateName === 'Beluga Whale') {
    if (candidateEntry.belugaSwallowedPet) {
      petConfig[belugaField] = candidateEntry.belugaSwallowedPet;
    } else if (options.belugaSwallowed) {
      petConfig[belugaField] = options.belugaSwallowed;
    } else if (typeof petConfig[belugaField] !== 'string') {
      petConfig[belugaField] = 'Giant Pangasius';
    }
  } else {
    petConfig[belugaField] = null;
  }
}

function getObjectiveTallies(side, result) {
  if (side === 'player') {
    return {
      wins: result.playerWins ?? 0,
      losses: result.opponentWins ?? 0,
      draws: result.draws ?? 0,
    };
  }
  return {
    wins: result.opponentWins ?? 0,
    losses: result.playerWins ?? 0,
    draws: result.draws ?? 0,
  };
}

function scoreTriplet(baseConfig, tripletEntries, options) {
  const sidePetsKey = resolveSidePetsKey(options.side);
  let wins = 0;
  let losses = 0;
  let draws = 0;
  let totalSims = 0;

  for (let seedOffset = 0; seedOffset < options.seedCount; seedOffset += 1) {
    const config = deepClone(baseConfig);
    const targetPet = config?.[sidePetsKey]?.[options.abomSlot - 1];
    if (!targetPet || targetPet.name !== 'Abomination') {
      throw new Error(
        `Target slot ${options.abomSlot} on ${options.side} is not Abomination.`,
      );
    }

    applyCandidateToSwallowSlot(targetPet, 1, tripletEntries[0], options);
    applyCandidateToSwallowSlot(targetPet, 2, tripletEntries[1], options);
    applyCandidateToSwallowSlot(targetPet, 3, tripletEntries[2], options);

    if (options.mirror) {
      const oppositeKey = resolveSidePetsKey(
        options.side === 'player' ? 'opponent' : 'player',
      );
      const oppositePet = config?.[oppositeKey]?.[options.abomSlot - 1];
      if (oppositePet && oppositePet.name === 'Abomination') {
        applyCandidateToSwallowSlot(oppositePet, 1, tripletEntries[0], options);
        applyCandidateToSwallowSlot(oppositePet, 2, tripletEntries[1], options);
        applyCandidateToSwallowSlot(oppositePet, 3, tripletEntries[2], options);
      }
    }

    config.simulationCount = options.simulations;
    config.logsEnabled = false;
    config.maxLoggedBattles = 0;
    config.captureRandomDecisions = false;
    config.randomDecisionOverrides = [];
    config.seed = options.baseSeed + seedOffset;

    const result = runHeadlessSimulation(config, {
      enableLogs: false,
      includeBattles: false,
    });
    const tallies = getObjectiveTallies(options.side, result);
    wins += tallies.wins;
    losses += tallies.losses;
    draws += tallies.draws;
    totalSims += options.simulations;
  }

  const score = totalSims > 0 ? (wins + draws * 0.5) / totalSims : 0;
  const winRate = totalSims > 0 ? wins / totalSims : 0;
  return {
    triplet: tripletEntries.map((entry) => entry.name),
    belugaNestedTargets: tripletEntries
      .filter((entry) => entry.name === 'Beluga Whale')
      .map((entry) => entry.belugaSwallowedPet ?? options.belugaSwallowed ?? null)
      .filter((value) => value != null),
    score,
    winRate,
    wins,
    losses,
    draws,
    totalSims,
  };
}

function compareRows(left, right) {
  if (right.score !== left.score) {
    return right.score - left.score;
  }
  if (right.winRate !== left.winRate) {
    return right.winRate - left.winRate;
  }
  return left.triplet.join('|').localeCompare(right.triplet.join('|'));
}

function pushTopRow(topRows, row, keepTop) {
  if (topRows.length < keepTop) {
    topRows.push(row);
    if (topRows.length === keepTop) {
      topRows.sort(compareRows);
    }
    return;
  }
  const worst = topRows[topRows.length - 1];
  if (compareRows(row, worst) >= 0) {
    return;
  }
  topRows[topRows.length - 1] = row;
  topRows.sort(compareRows);
}

function main() {
  const options = parseOptions(process.argv.slice(2));
  const baseConfig = loadBaseConfig(options);
  const baseConfigSummary = summarizeBaseConfig(baseConfig);
  ensureAbominationSlot(baseConfig, options.side, options.abomSlot);

  const candidates = loadRankedCandidates(options.sourceReport, options.top);
  const includeSet = new Set(options.include.map((name) => normalizeName(name)));
  const excludeSet = new Set(options.exclude.map((name) => normalizeName(name)));
  let filteredCandidates = [...candidates];
  if (includeSet.size > 0) {
    filteredCandidates = filteredCandidates.filter((entry) =>
      includeSet.has(normalizeName(entry.name)),
    );
  }
  if (excludeSet.size > 0) {
    filteredCandidates = filteredCandidates.filter(
      (entry) => !excludeSet.has(normalizeName(entry.name)),
    );
  }
  if (filteredCandidates.length < 3) {
    throw new Error(
      `Need at least 3 candidates after filtering, got ${filteredCandidates.length}.`,
    );
  }

  const totalTripletsEstimate = options.ordered
    ? permutationsCount(filteredCandidates.length)
    : combinationsCount(filteredCandidates.length);
  const tripletGenerator = options.ordered
    ? generateOrderedTriplets(filteredCandidates.length)
    : generateCombinationTriplets(filteredCandidates.length);

  console.log(
    `Search C: ${filteredCandidates.length} candidates, ${
      options.ordered ? 'ordered' : 'unordered'
    } triplets, target ${options.side} slot ${options.abomSlot}.`,
  );
  console.log(
    `Base config: packs ${baseConfigSummary.playerPack}/${baseConfigSummary.opponentPack}, allPets=${baseConfigSummary.allPets}, tokenPets=${baseConfigSummary.tokenPets}, mana=${baseConfigSummary.mana}.`,
  );
  if (options.maxedBoardMode) {
    console.log(
      `Maxed board mode: mana=${MAX_MANA}, advanced settings=${MAX_ADVANCED}.`,
    );
  } else {
    console.log('Maxed board mode disabled.');
  }
  if (Number.isFinite(totalTripletsEstimate)) {
    console.log(`Total triplets: ${totalTripletsEstimate}`);
  } else {
    console.log(`Total triplets: very large`);
  }
  if (options.startTriplet > 0) {
    console.log(`Start triplet offset: ${options.startTriplet}`);
  }
  if (options.maxTriplets != null && options.maxTriplets > 0) {
    console.log(`Max triplets: ${options.maxTriplets}`);
  }
  console.log(
    `Per triplet: ${options.simulations} sims x ${options.seedCount} seeds = ${
      options.simulations * options.seedCount
    } sims.`,
  );

  const startedAt = Date.now();
  const rows = [];
  const topRows = [];
  let generated = 0;
  let processed = 0;
  const progressInterval = 1000;

  for (const indexTriplet of tripletGenerator) {
    if (generated < options.startTriplet) {
      generated += 1;
      continue;
    }

    const tripletEntries = indexTriplet.map((index) => filteredCandidates[index]);
    const row = scoreTriplet(baseConfig, tripletEntries, options);
    if (options.storeAll) {
      rows.push(row);
    } else {
      pushTopRow(topRows, row, options.keepTop);
    }
    processed += 1;
    generated += 1;

    if (processed % progressInterval === 0) {
      console.log(
        `Progress: scored ${processed} triplets (generated index ${generated})`,
      );
    }
    if (options.maxTriplets != null && options.maxTriplets > 0) {
      if (processed >= options.maxTriplets) {
        break;
      }
    }
  }

  const rankedRows = options.storeAll ? rows : topRows;
  rankedRows.sort(compareRows);

  const finishedAt = Date.now();
  const report = {
    generatedAt: new Date().toISOString(),
    durationMs: finishedAt - startedAt,
    options: {
      ...options,
      sourceReport: path.relative(ROOT, options.sourceReport),
      baseConfigPath: options.baseConfigPath
        ? path.relative(ROOT, options.baseConfigPath)
        : null,
      outputFile: path.relative(ROOT, options.outputFile),
    },
    baseConfigSummary,
    target: {
      side: options.side,
      abomSlot: options.abomSlot,
      mirror: options.mirror,
    },
    candidateCount: filteredCandidates.length,
    tripletMode: options.ordered ? 'ordered' : 'unordered',
    tripletsEstimate: Number.isFinite(totalTripletsEstimate)
      ? totalTripletsEstimate
      : null,
    startTriplet: options.startTriplet,
    generatedTripletsSeen: generated,
    processedTriplets: processed,
    resultsTruncated: !options.storeAll,
    keptRows: rankedRows.length,
    simulationsPerTriplet: options.simulations * options.seedCount,
    top20: rankedRows.slice(0, 20).map((row, index) => ({
      rank: index + 1,
      triplet: row.triplet,
      belugaNestedTargets: row.belugaNestedTargets,
      score: row.score,
      scorePct: Number((row.score * 100).toFixed(3)),
      wins: row.wins,
      draws: row.draws,
      losses: row.losses,
      totalSims: row.totalSims,
    })),
    rankedResults: rankedRows,
  };

  writeJson(options.outputFile, report);
  console.log(`Search C complete. Report: ${path.relative(ROOT, options.outputFile)}`);
  if (report.top20.length > 0) {
    console.log(
      `Top triplet: ${report.top20[0].triplet.join(' | ')} (${report.top20[0].scorePct}%)`,
    );
  }
}

main();
