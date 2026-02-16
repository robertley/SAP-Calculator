import {
  ReplayBattleJson,
  ReplayBuildModelJson,
} from './replay-calc-parser';

export const REPLAY_CODE_PREFIX = 'SAPR1:';

export interface ReplayCodePayload {
  battle: ReplayBattleJson;
  genesisBuildModel?: ReplayBuildModelJson | null;
  abilityPetMap?: Record<string, string | number> | null;
  turn?: number;
}

interface ReplayCodeEnvelope extends ReplayCodePayload {
  version: 1;
}

function toBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function fromBase64Url(value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (base64.length % 4)) % 4;
  const padded = `${base64}${'='.repeat(padLength)}`;
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function buildReplayCode(payload: ReplayCodePayload): string {
  const envelope: ReplayCodeEnvelope = {
    version: 1,
    battle: payload.battle,
    genesisBuildModel: payload.genesisBuildModel ?? null,
    abilityPetMap: payload.abilityPetMap ?? null,
    turn: payload.turn,
  };
  const encoded = toBase64Url(JSON.stringify(envelope));
  return `${REPLAY_CODE_PREFIX}${encoded}`;
}

export function parseReplayCode(raw: string): ReplayCodePayload | null {
  const trimmed = raw?.trim();
  if (!trimmed || !trimmed.startsWith(REPLAY_CODE_PREFIX)) {
    return null;
  }

  const encoded = trimmed.slice(REPLAY_CODE_PREFIX.length);
  if (!encoded) {
    return null;
  }

  try {
    const parsed = JSON.parse(fromBase64Url(encoded)) as unknown;
    if (!isRecord(parsed) || parsed.version !== 1 || !isRecord(parsed.battle)) {
      return null;
    }
    return {
      battle: parsed.battle as ReplayBattleJson,
      genesisBuildModel: (parsed.genesisBuildModel ?? null) as
        | ReplayBuildModelJson
        | null,
      abilityPetMap: (parsed.abilityPetMap ?? null) as Record<
        string,
        string | number
      > | null,
      turn:
        typeof parsed.turn === 'number' && Number.isFinite(parsed.turn)
          ? parsed.turn
          : undefined,
    };
  } catch {
    return null;
  }
}
