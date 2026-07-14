import {
  ReplayBattleJson,
  ReplayBuildModelJson,
} from './replay-calc-parser';
import { decodeBase64Url, encodeBase64Url } from 'app/runtime/base64-url';

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
  const encoded = encodeBase64Url(JSON.stringify(envelope));
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
    const parsed = JSON.parse(decodeBase64Url(encoded)) as unknown;
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
