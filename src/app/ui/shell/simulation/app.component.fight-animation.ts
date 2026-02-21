import { Log } from 'app/domain/interfaces/log.interface';
import { AILMENT_CATEGORIES } from 'app/integrations/equipment/equipment-categories';
import {
  getAllEquipmentNames,
  getAllPetNames,
  getEquipmentIconPath,
  getPetIconPath,
} from 'app/runtime/asset-catalog';
import { getPlainLogText } from './app.component.simulation-log';

type FightSide = 'player' | 'opponent';

interface NamePatternSet {
  regex: RegExp | null;
  canonicalByLower: Map<string, string>;
}

interface ParsedAttackEvent {
  attackerName: string | null;
  targetName: string | null;
  damage: number | null;
}

interface ParsedTransformEvent {
  sourceName: string | null;
  targetName: string | null;
  transformedName: string | null;
  attack: number | null;
  health: number | null;
  exp: number | null;
  equipmentName: string | null;
}

interface ParsedStatChange {
  attackDelta: number;
  healthDelta: number;
  expDelta: number;
}

interface SlotRef {
  side: FightSide;
  slot: number;
  value: FightAnimationSlot;
}

interface ResolvedPetVisual {
  petIconSrc: string | null;
  petCompanionIconSrc: string | null;
  petCompanionName: string | null;
}

export interface FightAnimationSlot {
  side: FightSide;
  slot: number;
  isEmpty: boolean;
  attack: number | null;
  health: number | null;
  exp: number | null;
  petIconSrc: string | null;
  petName: string | null;
  petCompanionIconSrc: string | null;
  petCompanionName: string | null;
  equipmentIconSrc: string | null;
  equipmentName: string | null;
  label: string | null;
}

export interface FightAnimationFrame {
  index: number;
  logIndex: number;
  type: Log['type'];
  text: string;
  randomEvent: boolean;
  impact: FightAnimationImpact | null;
  popups: FightAnimationPopup[];
  death: FightAnimationDeath | null;
  shifts: FightAnimationShift[];
  playerSlots: FightAnimationSlot[];
  opponentSlots: FightAnimationSlot[];
}

export interface FightAnimationImpact {
  attackerSide: FightSide;
  attackerSlot: number;
  targetSide: FightSide;
  targetSlot: number;
  damage: number | null;
}

export type FightAnimationPopupType = 'damage' | 'attack' | 'health' | 'exp';

export interface FightAnimationPopup {
  side: FightSide;
  slot: number;
  type: FightAnimationPopupType;
  delta: number;
}

export interface FightAnimationDeath {
  side: FightSide;
  slot: number;
  petIconSrc: string | null;
  petName: string | null;
  petCompanionIconSrc: string | null;
  petCompanionName: string | null;
}

export interface FightAnimationShift {
  side: FightSide;
  slot: number;
  fromSlot: number;
}

interface FightAnimationBoardState {
  playerSlots: FightAnimationSlot[];
  opponentSlots: FightAnimationSlot[];
}

interface FightAnimationMutationResult {
  impact: FightAnimationImpact | null;
  popups: FightAnimationPopup[];
  death: FightAnimationDeath | null;
  shifts: FightAnimationShift[];
}

interface ParsedToken {
  slot: number | null;
  isEmpty: boolean;
  attack: number | null;
  health: number | null;
  exp: number | null;
  petIconSrc: string | null;
  petName: string | null;
  equipmentIconSrc: string | null;
  equipmentName: string | null;
  label: string | null;
}

export interface FightAnimationBuildOptions {
  includePositionPrefix?: boolean;
}

const SIDE_TOKEN_REGEX =
  /___ \(-\/-\)|(?:[PO]\d+\s+)?(?:<img\b[^>]*>\s*)*\(\d+\/\d+(?:\/\d+(?:\s*xp)?)?\)/gi;
const IMAGE_TAG_REGEX = /<img\b[^>]*>/gi;
const PLAYER_FALLBACK_ORDER = [4, 3, 2, 1, 0];
const OPPONENT_FALLBACK_ORDER = [0, 1, 2, 3, 4];
const ATTACK_REGEX =
  /^(.+?)\s+(?:jump-)?attacks?\s+(.+?)\s+for\s+(\d+)/i;
const SNIPE_REGEX = /^(.+?)\s+sniped\s+(.+?)\s+for\s+(\d+)/i;
const FAINT_REGEX = /^(.+?)\s+fainted\./i;
const SUBJECT_REGEX =
  /^(.+?)\s+(?:attacks?|sniped|fainted|gave|gained|lost|transformed|destroyed|consumed|moved)\b/i;
const TO_SEGMENT_REGEX = /\bto\s+(.+?)(?:\.|$)/i;
const TRANSFORM_TARGET_REGEX = /\btransformed\s+(.+?)\s+into\b/i;
const TRANSFORM_INTO_SEGMENT_REGEX = /\binto\b([\s\S]*)$/i;
const INLINE_STATS_REGEX = /(\d+)\s*\/\s*(\d+)(?:\s*\/\s*(\d+)(?:\s*xp)?)?/i;
const POSSESSIVE_SPLIT_REGEX = /\s*(?:'|\u2019)s\s+/i;

const ailmentNames = new Set(
  Object.values(AILMENT_CATEGORIES).flat().filter(Boolean),
);
const petPatterns = buildNamePatternSet(getAllPetNames());
const equipmentPatterns = buildNamePatternSet(getAllEquipmentNames());

export function buildFightAnimationFrames(
  logs: Log[],
  options: FightAnimationBuildOptions = {},
): FightAnimationFrame[] {
  if (!Array.isArray(logs) || logs.length === 0) {
    return [];
  }

  const includePositionPrefix = options.includePositionPrefix !== false;
  let boardState: FightAnimationBoardState | null = null;
  const frames: FightAnimationFrame[] = [];

  logs.forEach((log, logIndex) => {
    if (!log) {
      return;
    }

    if (log.type === 'board') {
      const parsedBoardState = parseFightAnimationBoardState(log.message ?? '');
      if (parsedBoardState) {
        boardState = parsedBoardState;
      }
    }

    if (!boardState) {
      return;
    }

    const baseText = getPlainLogText(log);
    if (!baseText) {
      return;
    }

    const mutationResult =
      log.type !== 'board'
        ? applyLogMutation(boardState, log, baseText)
        : createEmptyMutationResult();
    const displayText = includePositionPrefix
      ? addPositionPrefix(baseText, log)
      : normalizePositionBracketSpacing(baseText);

    frames.push({
      index: frames.length,
      logIndex,
      type: log.type,
      text: displayText,
      randomEvent: log.randomEvent === true,
      impact: mutationResult.impact,
      popups: mutationResult.popups,
      death: mutationResult.death,
      shifts: mutationResult.shifts,
      playerSlots: cloneSlots(boardState.playerSlots),
      opponentSlots: cloneSlots(boardState.opponentSlots),
    });
  });

  return frames;
}

export function parseFightAnimationBoardState(
  message: string,
): FightAnimationBoardState | null {
  if (!message || !message.includes('|')) {
    return null;
  }

  const [playerRaw, opponentRaw] = message.split('|');
  if (playerRaw == null || opponentRaw == null) {
    return null;
  }

  const playerSlots = parseSideSlots(playerRaw, 'player');
  const opponentSlots = parseSideSlots(opponentRaw, 'opponent');
  if (!playerSlots || !opponentSlots) {
    return null;
  }

  return {
    playerSlots,
    opponentSlots,
  };
}

function createEmptyMutationResult(): FightAnimationMutationResult {
  return {
    impact: null,
    popups: [],
    death: null,
    shifts: [],
  };
}

function applyLogMutation(
  state: FightAnimationBoardState,
  log: Log,
  text: string,
): FightAnimationMutationResult {
  const result = createEmptyMutationResult();

  if (log.type === 'attack') {
    result.impact = applyAttackMutation(state, log, text, result.popups);
    return result;
  }
  if (log.type === 'death') {
    result.death = applyDeathMutation(state, log, text, result.shifts);
    return result;
  }
  if (log.type === 'ability' || log.type === 'equipment') {
    applyTransformMutation(state, log, text, result.popups);
    applyStatMutation(state, log, text, result.popups);
    applyEquipmentMutation(state, log, text);
    return result;
  }
  if (log.type === 'move' && /\bmoved\b/i.test(text)) {
    result.shifts.push(...pushSideForward(state, 'player'));
    result.shifts.push(...pushSideForward(state, 'opponent'));
  }
  return result;
}

function applyAttackMutation(
  state: FightAnimationBoardState,
  log: Log,
  text: string,
  popups: FightAnimationPopup[],
): FightAnimationImpact | null {
  const parsedAttack = parseAttackEvent(text);
  const sourceSide = getLogPrimarySide(log);
  const sourceRef = resolveSlotRef(state, {
    preferredSide: sourceSide,
    explicitIndex: log.sourceIndex,
    expectedName: parsedAttack.attackerName,
    preferNonEmpty: true,
  });

  if (sourceRef && parsedAttack.attackerName) {
    setSlotPet(sourceRef.value, parsedAttack.attackerName);
  }
  if (
    sourceRef &&
    sourceRef.value.attack == null &&
    parsedAttack.damage != null &&
    parsedAttack.damage > 0
  ) {
    sourceRef.value.attack = parsedAttack.damage;
  }

  const resolvedSourceSide = sourceRef?.side ?? sourceSide;
  const targetSide = inferTargetSide(
    state,
    log,
    text,
    resolvedSourceSide,
    parsedAttack.targetName,
    'opposite',
  );
  const targetRef = resolveSlotRef(state, {
    preferredSide: targetSide,
    explicitIndex: log.targetIndex,
    expectedName: parsedAttack.targetName,
    preferNonEmpty: true,
  });
  if (!targetRef) {
    if (parsedAttack.damage != null && parsedAttack.damage > 0) {
      popups.push({
        side: targetSide,
        slot: normalizeSlot((log.targetIndex ?? 1) - 1),
        type: 'damage',
        delta: -parsedAttack.damage,
      });
    }
    return {
      attackerSide: resolvedSourceSide,
      attackerSlot:
        sourceRef?.slot ?? normalizeSlot((log.sourceIndex ?? 1) - 1),
      targetSide,
      targetSlot: normalizeSlot((log.targetIndex ?? 1) - 1),
      damage: parsedAttack.damage,
    };
  }

  if (parsedAttack.targetName) {
    setSlotPet(targetRef.value, parsedAttack.targetName);
  }

  if (parsedAttack.damage != null && targetRef.value.health != null) {
    targetRef.value.health = Math.max(
      0,
      targetRef.value.health - parsedAttack.damage,
    );
  }
  if (parsedAttack.damage != null && parsedAttack.damage > 0) {
    popups.push({
      side: targetRef.side,
      slot: targetRef.slot,
      type: 'damage',
      delta: -parsedAttack.damage,
    });
  }

  return {
    attackerSide: sourceRef?.side ?? resolvedSourceSide,
    attackerSlot: sourceRef?.slot ?? normalizeSlot((log.sourceIndex ?? 1) - 1),
    targetSide: targetRef.side,
    targetSlot: targetRef.slot,
    damage: parsedAttack.damage,
  };
}

function applyDeathMutation(
  state: FightAnimationBoardState,
  log: Log,
  text: string,
  shifts: FightAnimationShift[],
): FightAnimationDeath | null {
  const deadName = parseFaintedName(text);
  const preferredSide = getLogPrimarySide(log);
  const deadRef = resolveSlotRef(state, {
    preferredSide,
    explicitIndex: log.sourceIndex,
    expectedName: deadName,
    preferNonEmpty: true,
  });
  if (!deadRef) {
    return null;
  }
  const death: FightAnimationDeath = {
    side: deadRef.side,
    slot: deadRef.slot,
    petIconSrc: deadRef.value.petIconSrc,
    petName: deadRef.value.petName,
    petCompanionIconSrc: deadRef.value.petCompanionIconSrc,
    petCompanionName: deadRef.value.petCompanionName,
  };
  clearSlot(deadRef.value);
  shifts.push(...pushSideForward(state, deadRef.side));
  return death;
}

function applyTransformMutation(
  state: FightAnimationBoardState,
  log: Log,
  text: string,
  popups: FightAnimationPopup[],
): void {
  if (!/\btransform(?:ed|ing)?\b/i.test(text)) {
    return;
  }

  const transform = parseTransformEvent(text);
  if (!transform.transformedName && transform.attack == null && transform.health == null) {
    return;
  }

  const sourceSide = getLogPrimarySide(log);
  const resolvedSourceName = transform.sourceName ?? parseSubjectName(text);
  const expectedTargetName =
    transform.targetName ??
    transform.sourceName ??
    resolvedSourceName;
  const explicitTargetIndex = log.targetIndex ?? log.sourceIndex;
  const targetSide = inferTargetSide(
    state,
    log,
    text,
    sourceSide,
    expectedTargetName,
    'same',
  );
  const targetRef = resolveSlotRef(state, {
    preferredSide: targetSide,
    explicitIndex: explicitTargetIndex,
    expectedName: expectedTargetName,
    preferNonEmpty: false,
  });
  if (!targetRef) {
    return;
  }

  if (transform.transformedName) {
    setSlotPet(targetRef.value, transform.transformedName);
  }
  applyAbsoluteStatChange(
    targetRef.value,
    popups,
    targetRef.side,
    targetRef.slot,
    'attack',
    transform.attack,
  );
  applyAbsoluteStatChange(
    targetRef.value,
    popups,
    targetRef.side,
    targetRef.slot,
    'health',
    transform.health,
  );
  applyAbsoluteStatChange(
    targetRef.value,
    popups,
    targetRef.side,
    targetRef.slot,
    'exp',
    transform.exp,
  );
  if (transform.equipmentName) {
    setSlotEquipment(targetRef.value, transform.equipmentName);
  }
}

function applyStatMutation(
  state: FightAnimationBoardState,
  log: Log,
  text: string,
  popups: FightAnimationPopup[],
): void {
  const statChange = parseStatChange(text);
  if (!statChange) {
    return;
  }
  if (
    statChange.attackDelta === 0 &&
    statChange.healthDelta === 0 &&
    statChange.expDelta === 0
  ) {
    return;
  }

  const sourceSide = getLogPrimarySide(log);
  const sourceName = parseSubjectName(text);
  const targetName = parseTargetName(text, sourceName);
  const isGiveMessage = /\bgave\b/i.test(text);
  const targetSide = inferTargetSide(
    state,
    log,
    text,
    sourceSide,
    targetName,
    'same',
  );

  const targetRef = resolveSlotRef(state, {
    preferredSide: isGiveMessage ? targetSide : sourceSide,
    explicitIndex: isGiveMessage ? log.targetIndex : log.sourceIndex,
    expectedName: isGiveMessage ? targetName : sourceName,
    preferNonEmpty: true,
  });
  if (!targetRef) {
    return;
  }

  applyDeltaStatChange(
    targetRef.value,
    popups,
    targetRef.side,
    targetRef.slot,
    'attack',
    statChange.attackDelta,
  );
  applyDeltaStatChange(
    targetRef.value,
    popups,
    targetRef.side,
    targetRef.slot,
    'health',
    statChange.healthDelta,
  );
  applyDeltaStatChange(
    targetRef.value,
    popups,
    targetRef.side,
    targetRef.slot,
    'exp',
    statChange.expDelta,
  );
}

function applyAbsoluteStatChange(
  slot: FightAnimationSlot,
  popups: FightAnimationPopup[],
  side: FightSide,
  slotIndex: number,
  type: 'attack' | 'health' | 'exp',
  value: number | null,
): void {
  if (value == null) {
    return;
  }
  const previous =
    type === 'attack' ? slot.attack : type === 'health' ? slot.health : slot.exp;
  if (type === 'attack') {
    slot.attack = value;
  } else if (type === 'health') {
    slot.health = value;
  } else {
    slot.exp = value;
  }
  const appliedDelta = previous != null ? value - previous : 0;
  pushStatPopup(popups, side, slotIndex, type, appliedDelta);
}

function applyDeltaStatChange(
  slot: FightAnimationSlot,
  popups: FightAnimationPopup[],
  side: FightSide,
  slotIndex: number,
  type: 'attack' | 'health' | 'exp',
  delta: number,
): void {
  if (delta === 0) {
    return;
  }

  const previous =
    type === 'attack'
      ? (slot.attack ?? 0)
      : type === 'health'
        ? (slot.health ?? 0)
        : (slot.exp ?? 0);
  const next = Math.max(0, previous + delta);
  if (type === 'attack') {
    slot.attack = next;
  } else if (type === 'health') {
    slot.health = next;
  } else {
    slot.exp = next;
  }
  pushStatPopup(popups, side, slotIndex, type, next - previous);
}

function pushStatPopup(
  popups: FightAnimationPopup[],
  side: FightSide,
  slot: number,
  type: 'attack' | 'health' | 'exp',
  delta: number,
): void {
  if (!Number.isFinite(delta) || delta === 0) {
    return;
  }
  popups.push({
    side,
    slot,
    type,
    delta,
  });
}

function applyEquipmentMutation(
  state: FightAnimationBoardState,
  log: Log,
  text: string,
): void {
  const mentionedEquipment = extractKnownNames(text, equipmentPatterns);
  const equipmentName = mentionedEquipment[0] ?? null;
  const sourceSide = getLogPrimarySide(log);
  const sourceName = parseSubjectName(text);
  const targetName = parseTargetName(text, sourceName);
  const targetSide = inferTargetSide(
    state,
    log,
    text,
    sourceSide,
    targetName,
    'same',
  );

  if (/\blost\b/i.test(text) && /\bequipment|perk|ailment\b/i.test(text)) {
    const sourceRef = resolveSlotRef(state, {
      preferredSide: sourceSide,
      explicitIndex: log.sourceIndex,
      expectedName: sourceName,
      preferNonEmpty: true,
    });
    if (sourceRef) {
      clearSlotEquipment(sourceRef.value);
    }
    return;
  }

  if (
    /\bdestroyed\b/i.test(text) &&
    /\bequipment|perk|ailment\b/i.test(text)
  ) {
    const targetRef = resolveSlotRef(state, {
      preferredSide: targetSide,
      explicitIndex: log.targetIndex,
      expectedName: targetName,
      preferNonEmpty: true,
    });
    if (targetRef) {
      clearSlotEquipment(targetRef.value);
    }
    return;
  }

  if (!equipmentName) {
    return;
  }

  if (/\bgave\b/i.test(text)) {
    const targetRef = resolveSlotRef(state, {
      preferredSide: targetSide,
      explicitIndex: log.targetIndex,
      expectedName: targetName,
      preferNonEmpty: true,
    });
    if (targetRef) {
      setSlotEquipment(targetRef.value, equipmentName);
    }
    return;
  }

  if (/\bgained\b/i.test(text) || /\bwith\b/i.test(text)) {
    const sourceRef = resolveSlotRef(state, {
      preferredSide: sourceSide,
      explicitIndex: log.sourceIndex ?? log.targetIndex,
      expectedName: sourceName,
      preferNonEmpty: true,
    });
    if (sourceRef) {
      setSlotEquipment(sourceRef.value, equipmentName);
    }
  }
}

function parseSideSlots(
  raw: string,
  side: FightSide,
): FightAnimationSlot[] | null {
  const matches = raw.match(SIDE_TOKEN_REGEX);
  if (!matches || matches.length === 0) {
    return null;
  }

  const slots = buildEmptySlots(side);
  const fallbackOrder =
    side === 'player' ? PLAYER_FALLBACK_ORDER : OPPONENT_FALLBACK_ORDER;

  matches.forEach((token, tokenIndex) => {
    const parsed = parseToken(token);
    const fallbackSlot = fallbackOrder[tokenIndex] ?? fallbackOrder[0];
    const slot = normalizeSlot(parsed.slot ?? fallbackSlot);
    const petVisual = resolvePetVisual(parsed.petName, parsed.petIconSrc);
    slots[slot] = {
      side,
      slot,
      isEmpty: parsed.isEmpty,
      attack: parsed.attack,
      health: parsed.health,
      exp: parsed.exp,
      petIconSrc: petVisual.petIconSrc,
      petName: parsed.petName,
      petCompanionIconSrc: petVisual.petCompanionIconSrc,
      petCompanionName: petVisual.petCompanionName,
      equipmentIconSrc: parsed.equipmentIconSrc,
      equipmentName: parsed.equipmentName,
      label: parsed.label ?? getSlotLabel(side, slot),
    };
  });

  return slots;
}

function parseToken(token: string): ParsedToken {
  const trimmed = token.trim();
  if (trimmed === '___ (-/-)') {
    return {
      slot: null,
      isEmpty: true,
      attack: null,
      health: null,
      exp: null,
      petIconSrc: null,
      petName: null,
      equipmentIconSrc: null,
      equipmentName: null,
      label: null,
    };
  }

  const labelMatch = /\b([PO])([1-5])\b/.exec(trimmed);
  const label = labelMatch ? `${labelMatch[1]}${labelMatch[2]}` : null;
  const parsedSlot =
    labelMatch && Number.isFinite(Number(labelMatch[2]))
      ? Number(labelMatch[2]) - 1
      : null;

  const statsMatch = /\((\d+)\/(\d+)(?:\/(\d+)(?:\s*xp)?)?\)/i.exec(trimmed);
  const attack = statsMatch ? Number(statsMatch[1]) : null;
  const health = statsMatch ? Number(statsMatch[2]) : null;
  const exp = statsMatch?.[3] != null ? Number(statsMatch[3]) : null;

  let petIconSrc: string | null = null;
  let petName: string | null = null;
  let equipmentIconSrc: string | null = null;
  let equipmentName: string | null = null;

  const images = trimmed.match(IMAGE_TAG_REGEX) ?? [];
  images.forEach((imgTag) => {
    const src = readAttr(imgTag, 'src');
    const alt = readAttr(imgTag, 'alt');
    const cls = readAttr(imgTag, 'class') ?? '';
    const classes = cls.split(/\s+/g);

    if (classes.includes('log-pet-icon')) {
      petIconSrc = src ?? petIconSrc;
      petName = alt ?? petName;
      return;
    }

    if (classes.includes('log-inline-icon')) {
      equipmentIconSrc = src ?? equipmentIconSrc;
      equipmentName = alt ?? equipmentName;
      return;
    }

    if (!petIconSrc) {
      petIconSrc = src ?? null;
      petName = alt ?? null;
      return;
    }

    if (!equipmentIconSrc) {
      equipmentIconSrc = src ?? null;
      equipmentName = alt ?? null;
    }
  });

  return {
    slot: parsedSlot != null ? normalizeSlot(parsedSlot) : null,
    isEmpty: false,
    attack,
    health,
    exp,
    petIconSrc,
    petName,
    equipmentIconSrc,
    equipmentName,
    label,
  };
}

function parseAttackEvent(text: string): ParsedAttackEvent {
  const attackMatch = ATTACK_REGEX.exec(text) ?? SNIPE_REGEX.exec(text);
  if (!attackMatch) {
    return {
      attackerName: null,
      targetName: null,
      damage: parseDamageValue(text),
    };
  }

  return {
    attackerName: normalizeEntityToken(attackMatch[1]),
    targetName: normalizeEntityToken(attackMatch[2]),
    damage: Number(attackMatch[3]),
  };
}

function parseFaintedName(text: string): string | null {
  const match = FAINT_REGEX.exec(text);
  if (!match) {
    return null;
  }
  return normalizeEntityToken(match[1]);
}

function parseSubjectName(text: string): string | null {
  const match = SUBJECT_REGEX.exec(text);
  if (!match) {
    const petNames = extractKnownNames(text, petPatterns);
    return petNames[0] ?? null;
  }
  return normalizeEntityToken(match[1]);
}

function parseTargetName(
  text: string,
  sourceName: string | null,
): string | null {
  const toSegment = TO_SEGMENT_REGEX.exec(text)?.[1] ?? '';
  const namesFromTo = extractKnownNames(toSegment, petPatterns);
  if (namesFromTo.length > 0) {
    return namesFromTo[0];
  }

  const allPetNames = extractKnownNames(text, petPatterns);
  if (allPetNames.length === 0) {
    return null;
  }
  const sourceNormalized = normalizeComparableName(sourceName);
  const nonSource = allPetNames.find(
    (name) => normalizeComparableName(name) !== sourceNormalized,
  );
  return nonSource ?? allPetNames[0] ?? null;
}

function parseTransformEvent(text: string): ParsedTransformEvent {
  const sourceName = parseSubjectName(text);
  const explicitTargetName = TRANSFORM_TARGET_REGEX.exec(text)?.[1] ?? null;
  const targetName = explicitTargetName
    ? normalizeEntityToken(explicitTargetName)
    : null;

  const intoSegment = TRANSFORM_INTO_SEGMENT_REGEX.exec(text)?.[1] ?? '';
  const transformedName = extractKnownNames(intoSegment, petPatterns)[0] ?? null;
  const statsMatch = INLINE_STATS_REGEX.exec(intoSegment);
  const attack = statsMatch ? Number(statsMatch[1]) : null;
  const health = statsMatch ? Number(statsMatch[2]) : null;
  const exp = statsMatch?.[3] != null ? Number(statsMatch[3]) : null;
  const equipmentName =
    extractKnownNames(intoSegment, equipmentPatterns)[0] ?? null;

  return {
    sourceName,
    targetName,
    transformedName,
    attack,
    health,
    exp,
    equipmentName,
  };
}

function parseStatChange(text: string): ParsedStatChange | null {
  const hasAttack = /\battack\b/i.test(text);
  const hasHealth = /\bhealth\b/i.test(text);
  const hasExp = /\b(?:xp|exp|experience)\b/i.test(text);
  if (!hasAttack && !hasHealth && !hasExp) {
    return null;
  }

  const sign = /\blost\b/i.test(text) ? -1 : 1;
  const attackValue = extractStatValue(text, 'attack', sign);
  const healthValue = extractStatValue(text, 'health', sign);
  const expValue = extractExpValue(text, sign);

  if (attackValue == null && healthValue == null && expValue == null) {
    return null;
  }

  return {
    attackDelta: attackValue ?? 0,
    healthDelta: healthValue ?? 0,
    expDelta: expValue ?? 0,
  };
}

function extractStatValue(
  text: string,
  stat: 'attack' | 'health',
  defaultSign: number,
): number | null {
  const regex = new RegExp(`([+-]?\\d+)\\s+${stat}\\b`, 'i');
  const match = regex.exec(text);
  if (!match) {
    return null;
  }
  const raw = match[1];
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  if (raw.startsWith('+') || raw.startsWith('-')) {
    return parsed;
  }
  return parsed * defaultSign;
}

function extractExpValue(text: string, defaultSign: number): number | null {
  const regex = /([+-]?\d+)\s+(?:xp|exp(?:erience)?)\b/i;
  const match = regex.exec(text);
  if (!match) {
    return null;
  }
  const raw = match[1];
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  if (raw.startsWith('+') || raw.startsWith('-')) {
    return parsed;
  }
  return parsed * defaultSign;
}

function inferTargetSide(
  state: FightAnimationBoardState,
  log: Log,
  text: string,
  sourceSide: FightSide,
  targetName: string | null,
  defaultMode: 'same' | 'opposite',
): FightSide {
  const opposite = sourceSide === 'player' ? 'opponent' : 'player';
  const explicitLogSide = getLogTargetSide(log);
  if (explicitLogSide) {
    return explicitLogSide;
  }
  const explicitSide = inferSideFromLabel(text, log.targetIndex ?? null);
  if (explicitSide) {
    return explicitSide;
  }

  if (/\benemy|opponent\b/i.test(text)) {
    return opposite;
  }
  if (/\bfriend|friendly|self|itself|ally\b/i.test(text)) {
    return sourceSide;
  }

  if (log.targetIndex != null) {
    const index = normalizeSlot(log.targetIndex - 1);
    const preferred = getSlot(state, sourceSide, index);
    const other = getSlot(state, opposite, index);
    const targetNormalized = normalizeComparableName(targetName);
    if (targetNormalized) {
      const preferredMatches = slotNameMatches(preferred, targetNormalized);
      const otherMatches = slotNameMatches(other, targetNormalized);
      if (preferredMatches !== otherMatches) {
        return preferredMatches ? sourceSide : opposite;
      }
    }
    if (preferred.isEmpty && !other.isEmpty) {
      return opposite;
    }
    if (!preferred.isEmpty && other.isEmpty) {
      return sourceSide;
    }
  }

  if (targetName) {
    const sourceFound = findSlotIndexByName(
      getSideSlots(state, sourceSide),
      targetName,
    );
    const oppositeFound = findSlotIndexByName(
      getSideSlots(state, opposite),
      targetName,
    );
    if (sourceFound !== -1 && oppositeFound === -1) {
      return sourceSide;
    }
    if (oppositeFound !== -1 && sourceFound === -1) {
      return opposite;
    }
  }

  return defaultMode === 'opposite' ? opposite : sourceSide;
}

function resolveSlotRef(
  state: FightAnimationBoardState,
  options: {
    preferredSide: FightSide;
    explicitIndex?: number | null;
    expectedName?: string | null;
    preferNonEmpty: boolean;
  },
): SlotRef | null {
  const preferredSide = options.preferredSide;
  const oppositeSide = preferredSide === 'player' ? 'opponent' : 'player';
  const preferredSlots = getSideSlots(state, preferredSide);
  const oppositeSlots = getSideSlots(state, oppositeSide);
  const expectedNormalized = normalizeComparableName(options.expectedName ?? null);

  if (options.explicitIndex != null) {
    const index = normalizeSlot(options.explicitIndex - 1);
    const preferredSlot = preferredSlots[index];
    const oppositeSlot = oppositeSlots[index];
    if (expectedNormalized) {
      const preferredMatches = slotNameMatches(preferredSlot, expectedNormalized);
      const oppositeMatches = slotNameMatches(oppositeSlot, expectedNormalized);
      if (preferredMatches && !oppositeMatches) {
        return { side: preferredSide, slot: index, value: preferredSlot };
      }
      if (oppositeMatches && !preferredMatches) {
        return { side: oppositeSide, slot: index, value: oppositeSlot };
      }
    }
    if (options.preferNonEmpty) {
      if (preferredSlot.isEmpty && !oppositeSlot.isEmpty) {
        return { side: oppositeSide, slot: index, value: oppositeSlot };
      }
      if (!preferredSlot.isEmpty && oppositeSlot.isEmpty) {
        return { side: preferredSide, slot: index, value: preferredSlot };
      }
    }
    return { side: preferredSide, slot: index, value: preferredSlot };
  }

  if (expectedNormalized) {
    const preferredIndex = findSlotIndexByName(
      preferredSlots,
      options.expectedName ?? null,
    );
    if (preferredIndex !== -1) {
      return {
        side: preferredSide,
        slot: preferredIndex,
        value: preferredSlots[preferredIndex],
      };
    }
    const oppositeIndex = findSlotIndexByName(
      oppositeSlots,
      options.expectedName ?? null,
    );
    if (oppositeIndex !== -1) {
      return {
        side: oppositeSide,
        slot: oppositeIndex,
        value: oppositeSlots[oppositeIndex],
      };
    }
  }

  if (options.preferNonEmpty) {
    const firstPreferred = preferredSlots.findIndex((slot) => !slot.isEmpty);
    if (firstPreferred !== -1) {
      return {
        side: preferredSide,
        slot: firstPreferred,
        value: preferredSlots[firstPreferred],
      };
    }
    const firstOpposite = oppositeSlots.findIndex((slot) => !slot.isEmpty);
    if (firstOpposite !== -1) {
      return {
        side: oppositeSide,
        slot: firstOpposite,
        value: oppositeSlots[firstOpposite],
      };
    }
  }

  return null;
}

function getLogPrimarySide(log: Log): FightSide {
  return (
    resolveSideFromIsOpponent(log.player?.isOpponent) ??
    resolveSideFromIsOpponent(log.playerIsOpponent) ??
    resolveSideFromIsOpponent(log.sourcePet?.parent?.isOpponent) ??
    'player'
  );
}

function getLogTargetSide(log: Log): FightSide | null {
  return (
    resolveSideFromIsOpponent(log.targetPet?.parent?.isOpponent) ??
    resolveSideFromIsOpponent(log.targetIsOpponent)
  );
}

function resolveSideFromIsOpponent(
  isOpponent: boolean | null | undefined,
): FightSide | null {
  if (isOpponent === true) {
    return 'opponent';
  }
  if (isOpponent === false) {
    return 'player';
  }
  return null;
}

function parseDamageValue(text: string): number | null {
  const damageMatch = /\bfor\s+(\d+)\b/i.exec(text);
  if (!damageMatch) {
    return null;
  }
  const value = Number(damageMatch[1]);
  return Number.isFinite(value) ? value : null;
}

function normalizePositionBracketSpacing(message: string): string {
  return message
    .replace(
      /\[\s*([PO])\s*([1-5])\s*->\s*([PO])\s*([1-5])\s*\]/g,
      '[$1$2->$3$4]',
    )
    .replace(/\[\s*([PO])\s*([1-5])\s*\]/g, '[$1$2]')
    .replace(/\[\s*->\s*([PO])\s*([1-5])\s*\]/g, '[->$1$2]');
}

function addPositionPrefix(text: string, log: Log): string {
  const compactText = normalizePositionBracketSpacing(text);
  if (/\b[PO][1-5]\b/.test(compactText)) {
    return compactText;
  }

  const sourceLabel = formatPositionLabel(
    getLogPrimarySide(log),
    log.sourceIndex,
  );
  const explicitTargetSide = getLogTargetSide(log);
  const fallbackTargetSide =
    explicitTargetSide ??
    (log.type === 'attack'
      ? getLogPrimarySide(log) === 'player'
        ? 'opponent'
        : 'player'
      : null);
  const targetLabel = formatPositionLabel(fallbackTargetSide, log.targetIndex);

  if (sourceLabel && targetLabel) {
    return `[${sourceLabel}->${targetLabel}] ${compactText}`;
  }
  if (sourceLabel) {
    return `[${sourceLabel}] ${compactText}`;
  }
  if (targetLabel) {
    return `[->${targetLabel}] ${compactText}`;
  }
  return compactText;
}

function formatPositionLabel(
  side: FightSide | null,
  index: number | null | undefined,
): string | null {
  if (side == null || index == null || !Number.isFinite(index)) {
    return null;
  }
  const slot = Math.min(Math.max(1, Math.trunc(index)), 5);
  return `${side === 'player' ? 'P' : 'O'}${slot}`;
}

function buildNamePatternSet(names: string[]): NamePatternSet {
  const canonicalByLower = new Map<string, string>();
  const escaped: string[] = [];
  names
    .filter((name) => Boolean(name))
    .sort((a, b) => b.length - a.length)
    .forEach((name) => {
      canonicalByLower.set(name.toLowerCase(), name);
      escaped.push(escapeRegex(name));
    });

  if (escaped.length === 0) {
    return {
      regex: null,
      canonicalByLower,
    };
  }

  return {
    regex: new RegExp(
      `(?<![A-Za-z0-9])(${escaped.join('|')})(?![A-Za-z0-9])`,
      'gi',
    ),
    canonicalByLower,
  };
}

function extractKnownNames(text: string, patternSet: NamePatternSet): string[] {
  if (!text || !patternSet.regex) {
    return [];
  }
  const regex = new RegExp(patternSet.regex.source, patternSet.regex.flags);
  const values: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text))) {
    const raw = match[1];
    if (!raw) {
      continue;
    }
    const canonical =
      patternSet.canonicalByLower.get(raw.toLowerCase()) ?? raw;
    values.push(canonical);
  }
  return values;
}

function parseSideFromLabel(label: string): FightSide | null {
  if (label.startsWith('P')) {
    return 'player';
  }
  if (label.startsWith('O')) {
    return 'opponent';
  }
  return null;
}

function inferSideFromLabel(text: string, index: number | null): FightSide | null {
  if (index == null || !Number.isFinite(index)) {
    return null;
  }
  const labelIndex = Math.min(Math.max(1, Math.trunc(index)), 5);
  const match = new RegExp(`\\b([PO])${labelIndex}\\b`, 'i').exec(text);
  if (!match) {
    return null;
  }
  return parseSideFromLabel(match[1].toUpperCase());
}

function getSideSlots(
  state: FightAnimationBoardState,
  side: FightSide,
): FightAnimationSlot[] {
  return side === 'player' ? state.playerSlots : state.opponentSlots;
}

function getSlot(
  state: FightAnimationBoardState,
  side: FightSide,
  index: number,
): FightAnimationSlot {
  return getSideSlots(state, side)[normalizeSlot(index)];
}

function findSlotIndexByName(
  slots: FightAnimationSlot[],
  name: string | null | undefined,
): number {
  const normalized = normalizeComparableName(name ?? null);
  if (!normalized) {
    return -1;
  }
  for (let i = 0; i < slots.length; i += 1) {
    const slotName = normalizeComparableName(slots[i].petName);
    if (slotName === normalized) {
      return i;
    }
  }
  return -1;
}

function slotNameMatches(slot: FightAnimationSlot, normalizedName: string): boolean {
  return normalizeComparableName(slot.petName) === normalizedName;
}

function normalizeComparableName(name: string | null | undefined): string {
  return `${name ?? ''}`.trim().toLowerCase();
}

function normalizeEntityToken(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }
  const withoutLabel = value.replace(/^[PO]\d+\s+/i, '').trim();
  const cleaned = withoutLabel
    .replace(/^[Aa]n?\s+/, '')
    .replace(/[.!,:;]+$/, '')
    .trim();
  return cleaned || null;
}

function setSlotPet(slot: FightAnimationSlot, petName: string): void {
  slot.isEmpty = false;
  slot.petName = petName;
  const visual = resolvePetVisual(petName);
  slot.petIconSrc = visual.petIconSrc;
  slot.petCompanionIconSrc = visual.petCompanionIconSrc;
  slot.petCompanionName = visual.petCompanionName;
  slot.label = getSlotLabel(slot.side, slot.slot);
}

function setSlotEquipment(slot: FightAnimationSlot, equipmentName: string): void {
  slot.isEmpty = false;
  slot.equipmentName = equipmentName;
  const isAilment = ailmentNames.has(equipmentName);
  slot.equipmentIconSrc = getEquipmentIconPath(equipmentName, isAilment);
  slot.label = getSlotLabel(slot.side, slot.slot);
}

function clearSlotEquipment(slot: FightAnimationSlot): void {
  slot.equipmentName = null;
  slot.equipmentIconSrc = null;
}

function clearSlot(slot: FightAnimationSlot): void {
  slot.isEmpty = true;
  slot.attack = null;
  slot.health = null;
  slot.exp = null;
  slot.petIconSrc = null;
  slot.petName = null;
  slot.petCompanionIconSrc = null;
  slot.petCompanionName = null;
  slot.equipmentIconSrc = null;
  slot.equipmentName = null;
  slot.label = null;
}

function pushSideForward(
  state: FightAnimationBoardState,
  side: FightSide,
): FightAnimationShift[] {
  const slots = getSideSlots(state, side);
  const survivors = slots
    .map((slot, index) => ({ slot, index }))
    .filter((entry) => !entry.slot.isEmpty)
    .map((entry) => ({
      value: { ...entry.slot },
      fromSlot: entry.index,
    }));
  const next = buildEmptySlots(side);
  const shifts: FightAnimationShift[] = [];

  survivors.forEach((survivor, index) => {
    const normalizedIndex = normalizeSlot(index);
    if (survivor.fromSlot !== normalizedIndex) {
      shifts.push({
        side,
        slot: normalizedIndex,
        fromSlot: survivor.fromSlot,
      });
    }
    next[normalizedIndex] = {
      ...survivor.value,
      side,
      slot: normalizedIndex,
      label: getSlotLabel(side, normalizedIndex),
      isEmpty: false,
    };
  });
  for (let i = 0; i < slots.length; i += 1) {
    slots[i] = next[i];
  }

  return shifts;
}

function getSlotLabel(side: FightSide, slot: number): string {
  return `${side === 'player' ? 'P' : 'O'}${slot + 1}`;
}

function readAttr(tag: string, attr: string): string | null {
  const doubleQuotedMatch = new RegExp(`${attr}="([^"]*)"`, 'i').exec(tag);
  if (doubleQuotedMatch) {
    return doubleQuotedMatch[1];
  }
  const singleQuotedMatch = new RegExp(`${attr}='([^']*)'`, 'i').exec(tag);
  if (singleQuotedMatch) {
    return singleQuotedMatch[1];
  }
  return null;
}

function normalizeSlot(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.min(Math.max(0, Math.trunc(value)), 4);
}

function resolvePetVisual(
  petName: string | null | undefined,
  fallbackIconSrc: string | null = null,
): ResolvedPetVisual {
  const displayName = `${petName ?? ''}`.trim();
  if (!displayName) {
    return {
      petIconSrc: fallbackIconSrc,
      petCompanionIconSrc: null,
      petCompanionName: null,
    };
  }

  const directIcon = getPetIconPath(displayName);
  if (directIcon) {
    return {
      petIconSrc: directIcon,
      petCompanionIconSrc: null,
      petCompanionName: null,
    };
  }

  const segments = splitCompositePetName(displayName);
  if (segments.length < 2) {
    return {
      petIconSrc: fallbackIconSrc,
      petCompanionIconSrc: null,
      petCompanionName: null,
    };
  }

  const resolvedSegments = segments
    .map((segment) => normalizeEntityToken(segment))
    .filter((segment): segment is string => Boolean(segment));
  if (resolvedSegments.length < 2) {
    return {
      petIconSrc: fallbackIconSrc,
      petCompanionIconSrc: null,
      petCompanionName: null,
    };
  }

  let baseName: string | null = null;
  let baseIcon: string | null = null;
  for (const segment of resolvedSegments) {
    const segmentIcon = getPetIconPath(segment);
    if (!segmentIcon) {
      continue;
    }
    baseName = segment;
    baseIcon = segmentIcon;
    break;
  }

  let companionName: string | null = null;
  let companionIcon: string | null = null;
  for (let i = resolvedSegments.length - 1; i >= 0; i -= 1) {
    const segment = resolvedSegments[i];
    if (baseName && normalizeComparableName(segment) === normalizeComparableName(baseName)) {
      continue;
    }
    const segmentIcon = getPetIconPath(segment);
    if (!segmentIcon) {
      continue;
    }
    companionName = segment;
    companionIcon = segmentIcon;
    break;
  }

  return {
    petIconSrc: baseIcon ?? fallbackIconSrc,
    petCompanionIconSrc: companionIcon,
    petCompanionName: companionIcon ? companionName : null,
  };
}

function splitCompositePetName(name: string): string[] {
  if (!name.includes("'") && !name.includes('\u2019')) {
    return [name];
  }
  return name
    .split(POSSESSIVE_SPLIT_REGEX)
    .map((part) => part.trim())
    .filter((part) => Boolean(part));
}

function buildEmptySlots(side: FightSide): FightAnimationSlot[] {
  const slots: FightAnimationSlot[] = [];
  for (let slot = 0; slot < 5; slot += 1) {
    slots.push({
      side,
      slot,
      isEmpty: true,
      attack: null,
      health: null,
      exp: null,
      petIconSrc: null,
      petName: null,
      petCompanionIconSrc: null,
      petCompanionName: null,
      equipmentIconSrc: null,
      equipmentName: null,
      label: null,
    });
  }
  return slots;
}

function cloneSlots(slots: FightAnimationSlot[]): FightAnimationSlot[] {
  return slots.map((slot) => ({ ...slot }));
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
