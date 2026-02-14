#!/usr/bin/env node
import fs from 'fs';
import { runHeadlessSimulation } from './simulate';
import { SimulationConfig } from '../src/app/domain/interfaces/simulation-config.interface';
import {
  evaluateCandidateBatch,
  evaluateCandidateVsPool,
  EvaluateBatchRequest,
  EvaluateRequest,
  getDefaultPresetPool,
} from './evolution';

type CliOptions = {
  inputPath?: string;
  useStdin?: boolean;
  includeBattles?: boolean;
  enableLogs?: boolean;
  pretty?: boolean;
};

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--stdin' || arg === '-') {
      options.useStdin = true;
      continue;
    }
    if (arg === '--include-battles') {
      options.includeBattles = true;
      continue;
    }
    if (arg === '--logs') {
      options.enableLogs = true;
      continue;
    }
    if (arg === '--pretty') {
      options.pretty = true;
      continue;
    }
    if (arg === '--input' || arg === '-i') {
      options.inputPath = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
    if (!arg.startsWith('-') && !options.inputPath) {
      options.inputPath = arg;
    }
  }
  return options;
}

type PresetPoolOptions = {
  pretty?: boolean;
  limit?: number;
};

function parsePresetPoolArgs(argv: string[]): PresetPoolOptions {
  const options: PresetPoolOptions = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--pretty') {
      options.pretty = true;
      continue;
    }
    if (arg.startsWith('--limit=')) {
      const raw = Number(arg.split('=').slice(1).join('='));
      options.limit = Number.isFinite(raw) ? Math.max(1, Math.trunc(raw)) : undefined;
      continue;
    }
    if (arg === '--limit') {
      const raw = Number(argv[i + 1]);
      options.limit = Number.isFinite(raw) ? Math.max(1, Math.trunc(raw)) : undefined;
      i += 1;
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }
  return options;
}

function printHelp() {
  const text = [
    'Usage: sap-calculator-sim [command] [options] [path]',
    '',
    'Commands:',
    '  simulate (default)       Run a single simulation config',
    '  evaluate                 Score candidate vs opponent pool',
    '  evaluate-batch           Score many candidates vs opponent pool',
    '  preset-pool              Output default preset teams for seeding',
    '',
    'Options:',
    '  -i, --input <path>     JSON config file path',
    '  --stdin, -             Read JSON config from stdin',
    '  --include-battles      Include battles array in output',
    '  --logs                 Enable log generation',
    '  --pretty               Pretty-print JSON output',
    '  --limit <n>            (preset-pool) limit output rows',
    '  -h, --help             Show help',
  ];
  console.log(text.join('\n'));
}

function readInput(options: CliOptions): string {
  if (options.useStdin) {
    return fs.readFileSync(0, 'utf8');
  }
  if (!options.inputPath) {
    throw new Error('No input provided. Use --stdin or provide a JSON file path.');
  }
  return fs.readFileSync(options.inputPath, 'utf8');
}

function printJson(value: unknown, pretty: boolean | undefined): void {
  const output = pretty
    ? JSON.stringify(value, null, 2)
    : JSON.stringify(value);
  process.stdout.write(output);
}

function runPresetPool(argv: string[]): void {
  const options = parsePresetPoolArgs(argv);
  const allTeams = getDefaultPresetPool();
  const teams = options.limit ? allTeams.slice(0, options.limit) : allTeams;
  printJson(
    {
      generatedAt: Date.now(),
      totalTeams: teams.length,
      teams,
    },
    options.pretty,
  );
}

function runEvaluate(argv: string[]): void {
  const options = parseArgs(argv);
  const input = readInput(options);
  const payload = JSON.parse(input) as EvaluateRequest;
  const result = evaluateCandidateVsPool(payload);
  printJson(result, options.pretty);
}

function runEvaluateBatch(argv: string[]): void {
  const options = parseArgs(argv);
  const input = readInput(options);
  const payload = JSON.parse(input) as EvaluateBatchRequest;
  const result = evaluateCandidateBatch(payload);
  printJson(result, options.pretty);
}

function runSimulate(argv: string[]): void {
  const options = parseArgs(argv);
  const input = readInput(options);
  const config = JSON.parse(input) as SimulationConfig;
  const result = runHeadlessSimulation(config, {
    includeBattles: options.includeBattles,
    enableLogs: options.enableLogs,
  });
  printJson(result, options.pretty);
}

function run() {
  const argv = process.argv.slice(2);
  if (argv.length === 0) {
    runSimulate(argv);
    return;
  }

  const command = argv[0];
  if (command === '--help' || command === '-h') {
    printHelp();
    return;
  }

  if (command === 'preset-pool') {
    runPresetPool(argv.slice(1));
    return;
  }

  if (command === 'evaluate') {
    runEvaluate(argv.slice(1));
    return;
  }

  if (command === 'evaluate-batch') {
    runEvaluateBatch(argv.slice(1));
    return;
  }

  if (command === 'simulate') {
    runSimulate(argv.slice(1));
    return;
  }

  runSimulate(argv);
}

run();
