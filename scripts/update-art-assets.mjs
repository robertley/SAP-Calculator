#!/usr/bin/env node

/* global Buffer, URL, console, fetch, process */

import { createHash } from 'node:crypto';
import {
  access,
  copyFile,
  cp,
  mkdir,
  mkdtemp,
  open,
  readFile,
  readdir,
  rename,
  rm,
  stat,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const DEFAULT_DRIVE_URL =
  'https://drive.google.com/file/d/1p4TlD45ReNHlGwGKPIX7e09gq8mMW71t/view?usp=drive_link';
const MAX_ARCHIVE_BYTES = 500 * 1024 * 1024;
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const PUBLIC_CATEGORIES = [
  'Background',
  'Cosmetic',
  'Food',
  'Mascot',
  'Pets',
  'Toys',
];
const MINIMUM_IMAGE_COUNTS = {
  Ailment: 10,
  Background: 50,
  Cosmetic: 50,
  Food: 100,
  Mascot: 50,
  Pets: 400,
  Toys: 50,
};

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, '..');
const assetsRoot = join(repositoryRoot, 'src', 'assets');
const artRoot = join(assetsRoot, 'art');

function printUsage() {
  console.log(`Usage: npm run update:art-assets -- [options]

Options:
  --drive-url <url>  Download a different public Google Drive file.
  --archive <path>   Use an existing zip instead of downloading.
  --dry-run          Validate and report changes without updating the repo.
  --help             Show this help.`);
}

function parseArguments(argv) {
  const options = {
    archive: null,
    driveUrl: DEFAULT_DRIVE_URL,
    dryRun: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--dry-run') {
      options.dryRun = true;
      continue;
    }
    if (argument === '--help') {
      printUsage();
      process.exit(0);
    }
    if (argument === '--archive' || argument === '--drive-url') {
      const value = argv[index + 1];
      if (!value) {
        throw new Error(`${argument} requires a value.`);
      }
      if (argument === '--archive') {
        options.archive = resolve(value);
      } else {
        options.driveUrl = value;
      }
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${argument}`);
  }

  return options;
}

function extractDriveFileId(value) {
  const pathMatch = value.match(/\/file\/d\/([^/?#]+)/);
  if (pathMatch) {
    return pathMatch[1];
  }

  try {
    const id = new URL(value).searchParams.get('id');
    if (id) {
      return id;
    }
  } catch {
    // Accept a bare Drive file id below.
  }

  if (/^[a-zA-Z0-9_-]{20,}$/.test(value)) {
    return value;
  }
  throw new Error(`Could not find a Google Drive file id in: ${value}`);
}

function decodeHtml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

function htmlAttribute(tag, name) {
  const match = tag.match(
    new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'),
  );
  return match ? decodeHtml(match[1]) : null;
}

function confirmationUrl(html, responseUrl) {
  const form = [...html.matchAll(/<form\b[^>]*>/gi)]
    .map((match) => match[0])
    .find((tag) => htmlAttribute(tag, 'id') === 'download-form');
  const action = form ? htmlAttribute(form, 'action') : null;
  if (!form || !action) {
    return null;
  }

  const url = new URL(action, responseUrl);
  for (const inputMatch of html.matchAll(/<input\b[^>]*>/gi)) {
    const tag = inputMatch[0];
    const name = htmlAttribute(tag, 'name');
    const value = htmlAttribute(tag, 'value');
    if (name && value !== null) {
      url.searchParams.set(name, value);
    }
  }
  return url;
}

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KiB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MiB`;
}

async function saveDownload(response, destination) {
  if (!response.body) {
    throw new Error('The Drive download returned no response body.');
  }

  const totalBytes = Number(response.headers.get('content-length')) || null;
  const output = await open(destination, 'w');
  const reader = response.body.getReader();
  let receivedBytes = 0;
  let nextProgressUpdate = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      receivedBytes += value.byteLength;
      if (receivedBytes > MAX_ARCHIVE_BYTES) {
        throw new Error(
          `The archive exceeds the ${formatBytes(MAX_ARCHIVE_BYTES)} safety limit.`,
        );
      }
      await output.write(value);

      if (receivedBytes >= nextProgressUpdate) {
        const total = totalBytes ? ` / ${formatBytes(totalBytes)}` : '';
        process.stdout.write(
          `\rDownloading Public.zip: ${formatBytes(receivedBytes)}${total}`,
        );
        nextProgressUpdate = receivedBytes + 1024 * 1024;
      }
    }
  } finally {
    await output.close();
  }
  process.stdout.write('\n');
}

async function downloadDriveArchive(driveUrl, destination) {
  const fileId = extractDriveFileId(driveUrl);
  const initialUrl = new URL('https://drive.google.com/uc');
  initialUrl.searchParams.set('export', 'download');
  initialUrl.searchParams.set('id', fileId);

  let response = await fetch(initialUrl, { redirect: 'follow' });
  if (!response.ok) {
    throw new Error(`Drive download failed with HTTP ${response.status}.`);
  }

  if ((response.headers.get('content-type') ?? '').includes('text/html')) {
    const warningPage = await response.text();
    const confirmedUrl = confirmationUrl(warningPage, response.url);
    if (!confirmedUrl) {
      throw new Error(
        'Google Drive returned HTML without a recognized download confirmation form. Is the file public?',
      );
    }
    response = await fetch(confirmedUrl, { redirect: 'follow' });
    if (!response.ok) {
      throw new Error(
        `Confirmed Drive download failed with HTTP ${response.status}.`,
      );
    }
  }

  await saveDownload(response, destination);
}

function runUnzip(argumentsList, description) {
  const result = spawnSync('unzip', argumentsList, {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });
  if (result.error?.code === 'ENOENT') {
    throw new Error('The `unzip` command is required to update art assets.');
  }
  if (result.status !== 0) {
    throw new Error(
      `${description} failed:\n${result.stderr || result.stdout}`.trim(),
    );
  }
  return result.stdout;
}

async function validateArchive(archivePath) {
  const archiveStats = await stat(archivePath);
  if (archiveStats.size > MAX_ARCHIVE_BYTES) {
    throw new Error(
      `The archive exceeds the ${formatBytes(MAX_ARCHIVE_BYTES)} safety limit.`,
    );
  }

  const signature = Buffer.alloc(4);
  const archive = await open(archivePath, 'r');
  try {
    await archive.read(signature, 0, signature.length, 0);
  } finally {
    await archive.close();
  }
  if (signature[0] !== 0x50 || signature[1] !== 0x4b) {
    throw new Error(`${basename(archivePath)} is not a zip archive.`);
  }

  runUnzip(['-tqq', archivePath], 'Zip integrity check');
  const entries = runUnzip(['-Z1', archivePath], 'Zip manifest read')
    .split(/\r?\n/)
    .filter(Boolean);
  const unsafeEntry = entries.find(
    (entry) =>
      entry.startsWith('/') ||
      entry.includes('\\') ||
      entry.split('/').includes('..'),
  );
  if (unsafeEntry) {
    throw new Error(`The archive contains an unsafe path: ${unsafeEntry}`);
  }
  if (!entries.some((entry) => entry.startsWith('Public/Pets/'))) {
    throw new Error('The archive does not contain the expected Public/Pets tree.');
  }
}

async function listPngFiles(root) {
  const files = [];

  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const entryPath = join(directory, entry.name);
      if (entry.isSymbolicLink()) {
        throw new Error(`Symbolic links are not allowed in the art archive: ${entryPath}`);
      }
      if (entry.isDirectory()) {
        await visit(entryPath);
      } else if (entry.isFile() && extname(entry.name).toLowerCase() === '.png') {
        files.push(entryPath);
      }
    }
  }

  await visit(root);
  return files.sort();
}

async function validateExtractedArt(publicRoot) {
  for (const [category, minimumCount] of Object.entries(
    MINIMUM_IMAGE_COUNTS,
  )) {
    const categoryRoot = join(publicRoot, category);
    await access(categoryRoot);
    const files = await listPngFiles(categoryRoot);
    if (files.length < minimumCount) {
      throw new Error(
        `${category} contains ${files.length} PNGs; expected at least ${minimumCount}.`,
      );
    }

    for (const file of files) {
      const signature = (await readFile(file)).subarray(0, PNG_SIGNATURE.length);
      if (!signature.equals(PNG_SIGNATURE)) {
        throw new Error(`Invalid PNG signature: ${relative(publicRoot, file)}`);
      }
    }
    console.log(`Validated ${category}: ${files.length} PNGs`);
  }
}

async function copyPngTree(source, destination) {
  const files = await listPngFiles(source);
  for (const sourceFile of files) {
    const relativePath = relative(source, sourceFile);
    const destinationFile = join(destination, relativePath);
    await mkdir(dirname(destinationFile), { recursive: true });
    await copyFile(sourceFile, destinationFile);
  }
}

async function sha256(file) {
  return createHash('sha256').update(await readFile(file)).digest('hex');
}

async function imageManifest(root) {
  const manifest = new Map();
  for (const file of await listPngFiles(root)) {
    manifest.set(relative(root, file), await sha256(file));
  }
  return manifest;
}

function compareManifests(before, after) {
  let added = 0;
  let updated = 0;
  let removed = 0;

  for (const [file, hash] of after) {
    if (!before.has(file)) {
      added += 1;
    } else if (before.get(file) !== hash) {
      updated += 1;
    }
  }
  for (const file of before.keys()) {
    if (!after.has(file)) {
      removed += 1;
    }
  }
  return { added, updated, removed };
}

async function buildUpdatedArt(sourcePublicRoot, stagingRoot) {
  const nextArtRoot = join(stagingRoot, 'art');
  await cp(artRoot, nextArtRoot, {
    recursive: true,
    preserveTimestamps: true,
  });

  for (const category of [...PUBLIC_CATEGORIES, 'Ailment']) {
    const target = join(nextArtRoot, 'Public', 'Public', category);
    await rm(target, { recursive: true, force: true });
    await copyPngTree(join(sourcePublicRoot, category), target);
  }

  // The app's historical ailment URL remains supported, including retired
  // images that are still referenced by the pinned battle engine.
  await copyPngTree(
    join(sourcePublicRoot, 'Ailment'),
    join(nextArtRoot, 'Ailments', 'Ailments'),
  );

  return nextArtRoot;
}

async function installUpdatedArt(nextArtRoot, stagingRoot) {
  const previousArtRoot = join(stagingRoot, 'previous-art');
  await rename(artRoot, previousArtRoot);
  try {
    await rename(nextArtRoot, artRoot);
  } catch (error) {
    await rename(previousArtRoot, artRoot);
    throw error;
  }
  await rm(previousArtRoot, { recursive: true, force: true });
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const temporaryRoot = await mkdtemp(join(tmpdir(), 'sap-art-assets-'));
  const stagingRoot = await mkdtemp(join(assetsRoot, '.art-update-'));

  try {
    const archivePath = options.archive ?? join(temporaryRoot, 'Public.zip');
    if (options.archive) {
      console.log(`Using archive: ${archivePath}`);
    } else {
      console.log(`Downloading art from ${options.driveUrl}`);
      await downloadDriveArchive(options.driveUrl, archivePath);
    }

    await validateArchive(archivePath);
    const extractionRoot = join(temporaryRoot, 'extracted');
    await mkdir(extractionRoot, { recursive: true });
    runUnzip(['-q', archivePath, '-d', extractionRoot], 'Zip extraction');

    const sourcePublicRoot = join(extractionRoot, 'Public');
    await validateExtractedArt(sourcePublicRoot);
    const beforeManifest = await imageManifest(artRoot);
    const nextArtRoot = await buildUpdatedArt(sourcePublicRoot, stagingRoot);
    const afterManifest = await imageManifest(nextArtRoot);
    const changes = compareManifests(beforeManifest, afterManifest);

    console.log(
      `Art changes: ${changes.added} added, ${changes.updated} updated, ${changes.removed} removed.`,
    );
    if (options.dryRun) {
      console.log('Dry run complete; no repository files were changed.');
      return;
    }
    if (changes.added === 0 && changes.updated === 0 && changes.removed === 0) {
      console.log('Art assets are already current.');
      return;
    }

    await installUpdatedArt(nextArtRoot, stagingRoot);
    console.log('Updated src/assets/art successfully.');
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
    await rm(stagingRoot, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
