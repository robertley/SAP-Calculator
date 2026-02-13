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
const DEFAULT_POOL_REPORT = path.join(ROOT, 'tmp', 'abomination-pool-report.json');
const DEFAULT_OUTPUT = path.join(ROOT, 'tmp', 'search-a-flex-report.json');

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
  console.log('Usage: node scripts/search-a-flex-pet.mjs [options]');
  console.log('');
  console.log('Search A: score single flex swallowed pets for one Abomination slot.');
  console.log('');
  console.log('Options:');
  console.log(
    '  --pool-report <path>         Candidate source JSON (default: tmp/abomination-pool-report.json).',
  );
  console.log(
    '                               Supports analyzer reports (candidatePetNames) or Search A reports (rankedResults).',
  );
  console.log(
    '  --base-config <path>         SimulationConfig JSON. If omitted, built-in Infinite Damage mirror is used.',
  );
  console.log(
    '  --side <player|opponent>     Which side to mutate/optimize (default: player).',
  );
  console.log(
    '  --abom-slot <1-5>            Board slot containing the Abomination to mutate (default: 5).',
  );
  console.log(
    '  --swallow-slot <1-3>         Abomination swallowed slot to mutate (default: 3).',
  );
  console.log(
    '  --simulations <number>       Battles per seed per candidate (default: 150).',
  );
  console.log(
    '  --seed-count <number>        Number of seeds per candidate (default: 3).',
  );
  console.log(
    '  --base-seed <number>         Initial seed used for first run (default: 123456).',
  );
  console.log(
    '  --top <number>               Keep top N candidates from ranked source reports before other filters.',
  );
  console.log(
    '  --limit <number>             Limit candidate count for quick runs (default: no limit).',
  );
  console.log(
    '  --no-beluga-nested           Do not test Beluga Whale with nested swallowed target variants.',
  );
  console.log(
    '  --beluga-nested-limit <n>    Limit nested Beluga targets (default: all filtered candidates).',
  );
  console.log(
    '  --include <a,b,c>            Restrict to listed pet names only.',
  );
  console.log(
    '  --exclude <a,b,c>            Remove listed pet names from candidate pool.',
  );
  console.log(
    '  --mirror                     Apply candidate to both sides for mirror testing.',
  );
  console.log(
    '  --no-maxed-board             Do not force mana=50 + advanced settings=99.',
  );
  console.log(
    '  --beluga-swallowed <name>    Forced swallowed pet if candidate is Beluga Whale.',
  );
  console.log(
    '  --output <path>              Report output JSON (default: tmp/search-a-flex-report.json).',
  );
  console.log('  --help                        Show this help.');
  process.exit(0);
}

function parseOptions(argv) {
  const options = {
    poolReport: DEFAULT_POOL_REPORT,
    baseConfigPath: null,
    side: 'player',
    abomSlot: 5,
    swallowSlot: 3,
    simulations: 150,
    seedCount: 3,
    baseSeed: 123456,
    top: null,
    limit: null,
    include: [],
    exclude: [],
    mirror: false,
    belugaSwallowed: null,
    belugaNestedLimit: null,
    expandBelugaNested: true,
    maxedBoardMode: true,
    outputFile: DEFAULT_OUTPUT,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      printHelpAndExit();
    }
    if (arg.startsWith('--pool-report=')) {
      options.poolReport = path.resolve(
        ROOT,
        arg.split('=').slice(1).join('=').trim(),
      );
      continue;
    }
    if (arg === '--pool-report') {
      options.poolReport = path.resolve(ROOT, `${argv[i + 1] ?? ''}`.trim());
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
    if (arg.startsWith('--swallow-slot=')) {
      options.swallowSlot = parseInteger(arg.split('=').slice(1).join('='), 3);
      continue;
    }
    if (arg === '--swallow-slot') {
      options.swallowSlot = parseInteger(argv[i + 1], 3);
      i += 1;
      continue;
    }
    if (arg.startsWith('--simulations=')) {
      options.simulations = parseInteger(arg.split('=').slice(1).join('='), 150);
      continue;
    }
    if (arg === '--simulations') {
      options.simulations = parseInteger(argv[i + 1], 150);
      i += 1;
      continue;
    }
    if (arg.startsWith('--seed-count=')) {
      options.seedCount = parseInteger(arg.split('=').slice(1).join('='), 3);
      continue;
    }
    if (arg === '--seed-count') {
      options.seedCount = parseInteger(argv[i + 1], 3);
      i += 1;
      continue;
    }
    if (arg.startsWith('--base-seed=')) {
      options.baseSeed = parseInteger(arg.split('=').slice(1).join('='), 123456);
      continue;
    }
    if (arg === '--base-seed') {
      options.baseSeed = parseInteger(argv[i + 1], 123456);
      i += 1;
      continue;
    }
    if (arg.startsWith('--limit=')) {
      options.limit = parseInteger(arg.split('=').slice(1).join('='), null);
      continue;
    }
    if (arg === '--limit') {
      options.limit = parseInteger(argv[i + 1], null);
      i += 1;
      continue;
    }
    if (arg.startsWith('--top=')) {
      options.top = parseInteger(arg.split('=').slice(1).join('='), null);
      continue;
    }
    if (arg === '--top') {
      options.top = parseInteger(argv[i + 1], null);
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
    if (arg === '--mirror') {
      options.mirror = true;
      continue;
    }
    if (arg === '--no-maxed-board') {
      options.maxedBoardMode = false;
      continue;
    }
    if (arg === '--no-beluga-nested') {
      options.expandBelugaNested = false;
      continue;
    }
    if (arg.startsWith('--beluga-nested-limit=')) {
      options.belugaNestedLimit = parseInteger(
        arg.split('=').slice(1).join('='),
        null,
      );
      continue;
    }
    if (arg === '--beluga-nested-limit') {
      options.belugaNestedLimit = parseInteger(argv[i + 1], null);
      i += 1;
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
  if (options.swallowSlot < 1 || options.swallowSlot > 3) {
    throw new Error(
      `swallow-slot must be 1..3. Received ${options.swallowSlot}.`,
    );
  }
  options.simulations = Math.max(1, options.simulations);
  options.seedCount = Math.max(1, options.seedCount);
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

function loadCandidateNames(poolReportPath, topLimit) {
  const report = readJson(poolReportPath);
  let sourceType = 'unknown';
  let names = [];

  if (Array.isArray(report?.candidatePetNames)) {
    sourceType = 'analyzer';
    names = report.candidatePetNames;
  } else if (Array.isArray(report?.rankedResults)) {
    sourceType = 'search-a';
    names = report.rankedResults
      .map((row) => (typeof row?.candidate === 'string' ? row.candidate : null))
      .filter((name) => typeof name === 'string' && name.trim().length > 0);
  } else {
    throw new Error(
      `Unsupported candidate report format in ${poolReportPath}. Expected candidatePetNames or rankedResults.`,
    );
  }

  let filtered = names.filter(
    (name) => typeof name === 'string' && name.trim().length > 0,
  );
  if (topLimit != null && Number.isFinite(topLimit) && topLimit > 0) {
    filtered = filtered.slice(0, topLimit);
  }
  return {
    names: filtered,
    sourceType,
  };
}

function applyCandidateToSlot(
  petConfig,
  swallowSlot,
  candidateName,
  options,
  belugaSwallowedOverride = null,
) {
  const baseField = `abominationSwallowedPet${swallowSlot}`;
  const levelField = `abominationSwallowedPet${swallowSlot}Level`;
  const timesHurtField = `abominationSwallowedPet${swallowSlot}TimesHurt`;
  const belugaField = `abominationSwallowedPet${swallowSlot}BelugaSwallowedPet`;

  petConfig[baseField] = candidateName;
  if (!Number.isFinite(Number(petConfig[levelField]))) {
    petConfig[levelField] = 3;
  }
  if (!Number.isFinite(Number(petConfig[timesHurtField]))) {
    petConfig[timesHurtField] = 0;
  }

  if (candidateName === 'Beluga Whale') {
    if (belugaSwallowedOverride) {
      petConfig[belugaField] = belugaSwallowedOverride;
    } else if (options.belugaSwallowed) {
      petConfig[belugaField] = options.belugaSwallowed;
    } else if (typeof petConfig[belugaField] !== 'string') {
      petConfig[belugaField] = 'Giant Pangasius';
    }
  } else {
    petConfig[belugaField] = null;
  }
}

function resolveSidePetsKey(side) {
  return side === 'player' ? 'playerPets' : 'opponentPets';
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

function runCandidateScore(
  baseConfig,
  candidateName,
  options,
  belugaSwallowedOverride = null,
) {
  const sidePetsKey = resolveSidePetsKey(options.side);
  let wins = 0;
  let losses = 0;
  let draws = 0;
  let totalSims = 0;

  for (let seedOffset = 0; seedOffset < options.seedCount; seedOffset += 1) {
    const config = deepClone(baseConfig);
    const sidePets = config[sidePetsKey];
    const petIndex = options.abomSlot - 1;
    const targetPet = sidePets?.[petIndex];
    if (!targetPet || targetPet.name !== 'Abomination') {
      throw new Error(
        `Target slot ${options.abomSlot} on ${options.side} is not an Abomination.`,
      );
    }
    applyCandidateToSlot(
      targetPet,
      options.swallowSlot,
      candidateName,
      options,
      belugaSwallowedOverride,
    );

    if (options.mirror) {
      const oppositeKey = resolveSidePetsKey(
        options.side === 'player' ? 'opponent' : 'player',
      );
      const oppositeTarget = config[oppositeKey]?.[petIndex];
      if (oppositeTarget && oppositeTarget.name === 'Abomination') {
        applyCandidateToSlot(
          oppositeTarget,
          options.swallowSlot,
          candidateName,
          options,
          belugaSwallowedOverride,
        );
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
    candidate: candidateName,
    belugaSwallowedPet:
      candidateName === 'Beluga Whale'
        ? belugaSwallowedOverride ?? options.belugaSwallowed ?? 'Giant Pangasius'
        : null,
    score,
    winRate,
    wins,
    losses,
    draws,
    totalSims,
  };
}

function buildBelugaNestedCandidates(options, filteredCandidates) {
  if (!options.expandBelugaNested) {
    return [];
  }
  let nested = filteredCandidates.filter(
    (name) => normalizeName(name) !== normalizeName('Beluga Whale'),
  );
  if (options.belugaNestedLimit != null && options.belugaNestedLimit > 0) {
    nested = nested.slice(0, options.belugaNestedLimit);
  }
  return nested;
}

function scoreCandidateWithBelugaNesting(
  baseConfig,
  candidateName,
  options,
  belugaNestedCandidates,
) {
  if (
    normalizeName(candidateName) !== normalizeName('Beluga Whale') ||
    !options.expandBelugaNested ||
    belugaNestedCandidates.length === 0
  ) {
    return runCandidateScore(baseConfig, candidateName, options);
  }

  const variantRows = [];
  for (const nestedTarget of belugaNestedCandidates) {
    variantRows.push(
      runCandidateScore(baseConfig, candidateName, options, nestedTarget),
    );
  }
  variantRows.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    if (b.winRate !== a.winRate) {
      return b.winRate - a.winRate;
    }
    return `${a.belugaSwallowedPet ?? ''}`.localeCompare(
      `${b.belugaSwallowedPet ?? ''}`,
    );
  });

  const best = variantRows[0];
  return {
    ...best,
    belugaVariantsTested: variantRows.length,
    belugaTopVariants: variantRows.slice(0, 10).map((row, index) => ({
      rank: index + 1,
      swallowedPet: row.belugaSwallowedPet,
      score: row.score,
      scorePct: Number((row.score * 100).toFixed(3)),
      wins: row.wins,
      draws: row.draws,
      losses: row.losses,
      totalSims: row.totalSims,
    })),
  };
}

function main() {
  const options = parseOptions(process.argv.slice(2));
  const baseConfig = loadBaseConfig(options);
  const baseConfigSummary = summarizeBaseConfig(baseConfig);
  const sidePetsKey = resolveSidePetsKey(options.side);
  const targetPet = baseConfig?.[sidePetsKey]?.[options.abomSlot - 1];
  if (!targetPet || targetPet.name !== 'Abomination') {
    throw new Error(
      `Base config ${options.side} slot ${options.abomSlot} is not an Abomination.`,
    );
  }

  const slotField = `abominationSwallowedPet${options.swallowSlot}`;
  const baselineFlexPet =
    typeof targetPet[slotField] === 'string' ? targetPet[slotField] : null;

  const candidateSource = loadCandidateNames(options.poolReport, options.top);
  let filteredCandidates = [...new Set(candidateSource.names)];

  const includeSet = new Set(options.include.map((name) => normalizeName(name)));
  const excludeSet = new Set(options.exclude.map((name) => normalizeName(name)));

  if (includeSet.size > 0) {
    filteredCandidates = filteredCandidates.filter((name) =>
      includeSet.has(normalizeName(name)),
    );
  }
  if (excludeSet.size > 0) {
    filteredCandidates = filteredCandidates.filter(
      (name) => !excludeSet.has(normalizeName(name)),
    );
  }
  if (baselineFlexPet && !filteredCandidates.includes(baselineFlexPet)) {
    filteredCandidates.push(baselineFlexPet);
  }
  filteredCandidates.sort((a, b) => a.localeCompare(b));

  if (options.limit != null && Number.isFinite(options.limit) && options.limit > 0) {
    filteredCandidates = filteredCandidates.slice(0, options.limit);
  }

  if (filteredCandidates.length === 0) {
    throw new Error('No candidates to score after filters.');
  }
  const belugaNestedCandidates = buildBelugaNestedCandidates(
    options,
    filteredCandidates,
  );

  console.log(
    `Search A: scoring ${filteredCandidates.length} candidates for ${options.side} slot ${options.abomSlot}, swallowed slot ${options.swallowSlot}.`,
  );
  console.log(`Candidate source: ${candidateSource.sourceType}`);
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
  console.log(
    `Per candidate: ${options.simulations} sims x ${options.seedCount} seeds = ${
      options.simulations * options.seedCount
    } sims.`,
  );
  if (baselineFlexPet) {
    console.log(`Baseline flex pet: ${baselineFlexPet}`);
  }
  if (options.expandBelugaNested) {
    console.log(
      `Beluga nested mode: ${belugaNestedCandidates.length} nested targets.`,
    );
  } else {
    console.log('Beluga nested mode disabled.');
  }

  const startedAt = Date.now();
  const results = [];
  for (let index = 0; index < filteredCandidates.length; index += 1) {
    const candidate = filteredCandidates[index];
    const row = scoreCandidateWithBelugaNesting(
      baseConfig,
      candidate,
      options,
      belugaNestedCandidates,
    );
    results.push(row);
    if ((index + 1) % 10 === 0 || index + 1 === filteredCandidates.length) {
      console.log(`Progress: ${index + 1}/${filteredCandidates.length}`);
    }
  }

  results.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    if (b.winRate !== a.winRate) {
      return b.winRate - a.winRate;
    }
    return a.candidate.localeCompare(b.candidate);
  });

  const finishedAt = Date.now();
  const report = {
    generatedAt: new Date().toISOString(),
    durationMs: finishedAt - startedAt,
    options: {
      ...options,
      poolReport: path.relative(ROOT, options.poolReport),
      candidateSourceType: candidateSource.sourceType,
      baseConfigPath: options.baseConfigPath
        ? path.relative(ROOT, options.baseConfigPath)
        : null,
      outputFile: path.relative(ROOT, options.outputFile),
    },
    baseConfigSummary,
    target: {
      side: options.side,
      abomSlot: options.abomSlot,
      swallowSlot: options.swallowSlot,
      baselineFlexPet,
      mirror: options.mirror,
    },
    simulationsPerCandidate: options.simulations * options.seedCount,
    totalCandidates: results.length,
    top10: results.slice(0, 10).map((row, index) => ({
      rank: index + 1,
      candidate: row.candidate,
      belugaSwallowedPet: row.belugaSwallowedPet ?? null,
      belugaVariantsTested: row.belugaVariantsTested ?? 0,
      score: row.score,
      scorePct: Number((row.score * 100).toFixed(3)),
      winRate: row.winRate,
      wins: row.wins,
      draws: row.draws,
      losses: row.losses,
      totalSims: row.totalSims,
    })),
    rankedResults: results,
  };

  writeJson(options.outputFile, report);
  console.log(`Search A complete. Report: ${path.relative(ROOT, options.outputFile)}`);
  if (report.top10.length > 0) {
    console.log(
      `Top candidate: ${report.top10[0].candidate} (${report.top10[0].scorePct}%)`,
    );
  }
}

main();
