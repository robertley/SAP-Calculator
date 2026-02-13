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
const DEFAULT_OUTPUT = path.join(ROOT, 'tmp', 'search-b-combinations-report.json');

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
  console.log('Usage: node scripts/search-b-combinations.mjs [options]');
  console.log('');
  console.log(
    'Search B: score combinations from top Search A candidates across multiple Abomination slots.',
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
    '  --abom-slots <a,b,c>         Abomination board slots to fill. Default: auto-detect Abominations on side.',
  );
  console.log(
    '  --swallow-slot <1-3>         Swallowed slot to mutate on each selected Abomination (default: 3).',
  );
  console.log(
    '  --top <number>               Use top N Search A candidates for combinations (default: 30).',
  );
  console.log(
    '  --simulations <number>       Battles per seed per combination (default: 6).',
  );
  console.log(
    '  --seed-count <number>        Number of seeds per combination (default: 1).',
  );
  console.log(
    '  --base-seed <number>         Initial seed used for first run (default: 424242).',
  );
  console.log(
    '  --max-combos <number>        Evaluate only first N combinations (for quick tests).',
  );
  console.log(
    '  --start-combo <number>       Skip the first N generated combinations before scoring.',
  );
  console.log(
    '  --keep-top <number>          Keep only top N rows in memory/report (default: 500).',
  );
  console.log(
    '  --store-all                  Store all scored combinations in report (can use lots of memory).',
  );
  console.log(
    '  --mirror                     Apply combination to both sides for mirror testing.',
  );
  console.log(
    '  --no-maxed-board             Do not force mana=50 + advanced settings=99.',
  );
  console.log(
    '  --beluga-swallowed <name>    Fallback nested swallowed pet for Beluga Whale when none is in source report.',
  );
  console.log(
    '  --output <path>              Report output JSON (default: tmp/search-b-combinations-report.json).',
  );
  console.log('  --help                        Show this help.');
  process.exit(0);
}

function parseOptions(argv) {
  const options = {
    sourceReport: DEFAULT_SOURCE_REPORT,
    baseConfigPath: null,
    side: 'player',
    abomSlots: [],
    swallowSlot: 3,
    top: 30,
    simulations: 6,
    seedCount: 1,
    baseSeed: 424242,
    startCombo: 0,
    maxCombos: null,
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
    if (arg.startsWith('--abom-slots=')) {
      options.abomSlots = parseList(arg.split('=').slice(1).join('='))
        .map((value) => parseInteger(value, NaN))
        .filter((value) => Number.isFinite(value));
      continue;
    }
    if (arg === '--abom-slots') {
      options.abomSlots = parseList(argv[i + 1])
        .map((value) => parseInteger(value, NaN))
        .filter((value) => Number.isFinite(value));
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
    if (arg.startsWith('--top=')) {
      options.top = parseInteger(arg.split('=').slice(1).join('='), 30);
      continue;
    }
    if (arg === '--top') {
      options.top = parseInteger(argv[i + 1], 30);
      i += 1;
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
      options.baseSeed = parseInteger(arg.split('=').slice(1).join('='), 424242);
      continue;
    }
    if (arg === '--base-seed') {
      options.baseSeed = parseInteger(argv[i + 1], 424242);
      i += 1;
      continue;
    }
    if (arg.startsWith('--max-combos=')) {
      options.maxCombos = parseInteger(arg.split('=').slice(1).join('='), null);
      continue;
    }
    if (arg === '--max-combos') {
      options.maxCombos = parseInteger(argv[i + 1], null);
      i += 1;
      continue;
    }
    if (arg.startsWith('--start-combo=')) {
      options.startCombo = parseInteger(arg.split('=').slice(1).join('='), 0);
      continue;
    }
    if (arg === '--start-combo') {
      options.startCombo = parseInteger(argv[i + 1], 0);
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
  if (options.swallowSlot < 1 || options.swallowSlot > 3) {
    throw new Error(
      `swallow-slot must be 1..3. Received ${options.swallowSlot}.`,
    );
  }
  options.top = Math.max(1, options.top);
  options.simulations = Math.max(1, options.simulations);
  options.seedCount = Math.max(1, options.seedCount);
  options.startCombo = Math.max(0, options.startCombo);
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
          : typeof row?.belugaBestSwallowedPet === 'string' &&
              row.belugaBestSwallowedPet
            ? row.belugaBestSwallowedPet
            : null,
    });
    if (deduped.length >= topN) {
      break;
    }
  }
  return deduped;
}

function autoDetectAbominationSlots(baseConfig, side) {
  const pets = baseConfig?.[resolveSidePetsKey(side)];
  const slots = [];
  for (let i = 0; i < (Array.isArray(pets) ? pets.length : 0); i += 1) {
    if (pets[i]?.name === 'Abomination') {
      slots.push(i + 1);
    }
  }
  return slots;
}

function ensureAbominationSlots(baseConfig, side, slots) {
  const pets = baseConfig?.[resolveSidePetsKey(side)];
  for (const slot of slots) {
    const pet = pets?.[slot - 1];
    if (!pet || pet.name !== 'Abomination') {
      throw new Error(
        `Slot ${slot} on ${side} is not Abomination in base config.`,
      );
    }
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

function combinationCount(n, k) {
  if (k < 0 || n < k) {
    return 0;
  }
  const log10 = log10Choose(n, k);
  if (!Number.isFinite(log10)) {
    return 0;
  }
  if (log10 < 12) {
    return Math.round(10 ** log10);
  }
  return Number.POSITIVE_INFINITY;
}

function* generateCombinationIndices(n, k) {
  if (k <= 0 || n < k) {
    return;
  }
  const indices = Array.from({ length: k }, (_, i) => i);
  while (true) {
    yield [...indices];
    let position = k - 1;
    while (position >= 0 && indices[position] === n - k + position) {
      position -= 1;
    }
    if (position < 0) {
      break;
    }
    indices[position] += 1;
    for (let i = position + 1; i < k; i += 1) {
      indices[i] = indices[i - 1] + 1;
    }
  }
}

function applyCandidateToSlot(
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

function scoreCombination(baseConfig, candidateCombo, slotCombo, options) {
  const sidePetsKey = resolveSidePetsKey(options.side);
  let wins = 0;
  let losses = 0;
  let draws = 0;
  let totalSims = 0;

  for (let seedOffset = 0; seedOffset < options.seedCount; seedOffset += 1) {
    const config = deepClone(baseConfig);
    for (let i = 0; i < slotCombo.length; i += 1) {
      const slot = slotCombo[i];
      const candidateEntry = candidateCombo[i];
      const targetPet = config?.[sidePetsKey]?.[slot - 1];
      if (!targetPet || targetPet.name !== 'Abomination') {
        throw new Error(
          `Target slot ${slot} on ${options.side} is not an Abomination.`,
        );
      }
      applyCandidateToSlot(targetPet, options.swallowSlot, candidateEntry, options);

      if (options.mirror) {
        const oppositeKey = resolveSidePetsKey(
          options.side === 'player' ? 'opponent' : 'player',
        );
        const oppositePet = config?.[oppositeKey]?.[slot - 1];
        if (oppositePet && oppositePet.name === 'Abomination') {
          applyCandidateToSlot(
            oppositePet,
            options.swallowSlot,
            candidateEntry,
            options,
          );
        }
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
    combo: candidateCombo.map((entry) => entry.name),
    slots: [...slotCombo],
    belugaNestedTargets: candidateCombo
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
  return left.combo.join('|').localeCompare(right.combo.join('|'));
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
    // row is not better than current worst; skip
    return;
  }
  topRows[topRows.length - 1] = row;
  topRows.sort(compareRows);
}

function main() {
  const options = parseOptions(process.argv.slice(2));
  const baseConfig = loadBaseConfig(options);
  const baseConfigSummary = summarizeBaseConfig(baseConfig);
  const candidates = loadRankedCandidates(options.sourceReport, options.top);
  const abomSlots =
    options.abomSlots.length > 0
      ? options.abomSlots
      : autoDetectAbominationSlots(baseConfig, options.side);

  if (abomSlots.length === 0) {
    throw new Error('No Abomination slots detected/provided.');
  }
  ensureAbominationSlots(baseConfig, options.side, abomSlots);
  if (candidates.length < abomSlots.length) {
    throw new Error(
      `Need at least ${abomSlots.length} candidates, but only ${candidates.length} available.`,
    );
  }

  const totalCombinationsEstimate = combinationCount(
    candidates.length,
    abomSlots.length,
  );

  console.log(
    `Search B: top ${candidates.length} candidates, ${abomSlots.length} slots (${abomSlots.join(', ')}), swallow slot ${options.swallowSlot}.`,
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
  if (Number.isFinite(totalCombinationsEstimate)) {
    console.log(`Total combinations: ${totalCombinationsEstimate}`);
  } else {
    console.log(
      `Total combinations: ~10^${log10Choose(
        candidates.length,
        abomSlots.length,
      ).toFixed(2)}`,
    );
  }
  if (options.maxCombos != null && options.maxCombos > 0) {
    console.log(`Max combos limit: ${options.maxCombos}`);
  }
  if (options.startCombo > 0) {
    console.log(`Start combo offset: ${options.startCombo}`);
  }
  console.log(
    `Per combination: ${options.simulations} sims x ${options.seedCount} seeds = ${
      options.simulations * options.seedCount
    } sims.`,
  );

  const startedAt = Date.now();
  const rows = [];
  const topRows = [];
  let generated = 0;
  let processed = 0;
  const progressInterval = 1000;

  for (const indexCombo of generateCombinationIndices(
    candidates.length,
    abomSlots.length,
  )) {
    if (generated < options.startCombo) {
      generated += 1;
      continue;
    }
    const candidateCombo = indexCombo.map((index) => candidates[index]);
    const row = scoreCombination(baseConfig, candidateCombo, abomSlots, options);
    if (options.storeAll) {
      rows.push(row);
    } else {
      pushTopRow(topRows, row, options.keepTop);
    }
    processed += 1;
    generated += 1;

    if (processed % progressInterval === 0) {
      console.log(
        `Progress: scored ${processed} combos (generated index ${generated})`,
      );
    }
    if (options.maxCombos != null && options.maxCombos > 0) {
      if (processed >= options.maxCombos) {
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
      abomSlots,
      swallowSlot: options.swallowSlot,
      mirror: options.mirror,
    },
    candidateCount: candidates.length,
    startCombo: options.startCombo,
    generatedCombinationsSeen: generated,
    processedCombinations: processed,
    resultsTruncated: !options.storeAll,
    keptRows: rankedRows.length,
    combinationsEstimate: Number.isFinite(totalCombinationsEstimate)
      ? totalCombinationsEstimate
      : null,
    simulationsPerCombination: options.simulations * options.seedCount,
    top20: rankedRows.slice(0, 20).map((row, index) => ({
      rank: index + 1,
      combo: row.combo,
      slots: row.slots,
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
  console.log(`Search B complete. Report: ${path.relative(ROOT, options.outputFile)}`);
  if (report.top20.length > 0) {
    console.log(
      `Top combo score: ${report.top20[0].scorePct}% (${report.top20[0].combo.join(
        ' | ',
      )})`,
    );
  }
}

main();
