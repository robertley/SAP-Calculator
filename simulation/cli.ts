#!/usr/bin/env node
import fs from 'fs';
import { runHeadlessSimulation } from './simulate';
import { SimulationConfig } from '../src/app/interfaces/simulation-config.interface';

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

function printHelp() {
  const text = [
    'Usage: sap-calculator-sim [options] [path]',
    '',
    'Options:',
    '  -i, --input <path>     JSON config file path',
    '  --stdin, -             Read JSON config from stdin',
    '  --include-battles      Include battles array in output',
    '  --logs                 Enable log generation',
    '  --pretty               Pretty-print JSON output',
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

function run() {
  const options = parseArgs(process.argv.slice(2));
  const input = readInput(options);
  const config = JSON.parse(input) as SimulationConfig;
  const result = runHeadlessSimulation(config, {
    includeBattles: options.includeBattles,
    enableLogs: options.enableLogs,
  });
  const output = options.pretty
    ? JSON.stringify(result, null, 2)
    : JSON.stringify(result);
  process.stdout.write(output);
}

run();
