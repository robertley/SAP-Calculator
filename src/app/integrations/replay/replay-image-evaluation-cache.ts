const CACHE_PREFIX = 'sap-calculator:replay-image-evaluation:v1:';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_PERSISTED_ENTRIES = 80;

interface CacheEnvelope<T> {
  fingerprint: string;
  createdAt: number;
  value: T;
}

const memoryCache = new Map<string, CacheEnvelope<unknown>>();

export interface ReplayImageBuildMetrics {
  durationMs: number;
  cacheHits: number;
  cacheMisses: number;
  workerTasks: number;
  simulationsRun: number;
}

export function createReplayImageBuildMetrics(): ReplayImageBuildMetrics {
  return {
    durationMs: 0,
    cacheHits: 0,
    cacheMisses: 0,
    workerTasks: 0,
    simulationsRun: 0,
  };
}

export function nowMilliseconds(): number {
  return typeof performance !== 'undefined' && typeof performance.now === 'function'
    ? performance.now()
    : Date.now();
}

export function getReplayImageEvaluationCache<T>(
  namespace: string,
  fingerprint: string,
): T | null {
  const key = buildCacheKey(namespace, fingerprint);
  const inMemory = memoryCache.get(key) as CacheEnvelope<T> | undefined;
  if (isValidEnvelope(inMemory, fingerprint)) {
    return inMemory.value;
  }
  if (!canUseStorage()) {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as CacheEnvelope<T>;
    if (!isValidEnvelope(parsed, fingerprint)) {
      window.localStorage.removeItem(key);
      return null;
    }
    memoryCache.set(key, parsed as CacheEnvelope<unknown>);
    return parsed.value;
  } catch {
    return null;
  }
}

export function storeReplayImageEvaluationCache<T>(
  namespace: string,
  fingerprint: string,
  value: T,
): void {
  const key = buildCacheKey(namespace, fingerprint);
  const envelope: CacheEnvelope<T> = {
    fingerprint,
    createdAt: Date.now(),
    value,
  };
  memoryCache.set(key, envelope as CacheEnvelope<unknown>);
  if (!canUseStorage()) {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(envelope));
    pruneStorage();
  } catch {
    // Storage can be unavailable or full; the in-memory cache still applies.
  }
}

export function clearReplayImageEvaluationMemoryCache(): void {
  memoryCache.clear();
}

function buildCacheKey(namespace: string, fingerprint: string): string {
  return `${CACHE_PREFIX}${namespace}:${hashString(fingerprint)}`;
}

function isValidEnvelope<T>(
  envelope: CacheEnvelope<T> | null | undefined,
  fingerprint: string,
): envelope is CacheEnvelope<T> {
  return Boolean(
    envelope &&
      envelope.fingerprint === fingerprint &&
      Number.isFinite(envelope.createdAt) &&
      Date.now() - envelope.createdAt <= CACHE_TTL_MS,
  );
}

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function pruneStorage(): void {
  const entries: Array<{ key: string; createdAt: number }> = [];
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (!key?.startsWith(CACHE_PREFIX)) {
      continue;
    }
    try {
      const parsed = JSON.parse(window.localStorage.getItem(key) ?? '') as {
        createdAt?: number;
      };
      entries.push({ key, createdAt: parsed.createdAt ?? 0 });
    } catch {
      window.localStorage.removeItem(key);
    }
  }
  entries
    .sort((left, right) => right.createdAt - left.createdAt)
    .slice(MAX_PERSISTED_ENTRIES)
    .forEach((entry) => window.localStorage.removeItem(entry.key));
}

function hashString(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}
