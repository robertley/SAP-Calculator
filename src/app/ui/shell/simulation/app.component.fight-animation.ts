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
  isSnipe: boolean;
}

interface ParsedTransformEvent {
  sourceName: string | null;
  targetName: string | null;
  transformedName: string | null;
  attack: number | null;
  health: number | null;
  exp: number | null;
  mana: number | null;
  equipmentName: string | null;
}

interface ParsedStatChange {
  attackDelta: number;
  healthDelta: number;
  expDelta: number;
  manaDelta: number;
}

interface ParsedTrumpetChange {
  delta: number;
  appliesToOpponent: boolean;
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
  pendingRemoval: boolean;
  attack: number | null;
  health: number | null;
  exp: number | null;
  mana: number | null;
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
  equipmentChanges: FightAnimationEquipmentChange[];
  playerSlots: FightAnimationSlot[];
  opponentSlots: FightAnimationSlot[];
}

export interface FightAnimationImpact {
  attackerSide: FightSide;
  attackerSlot: number;
  targetSide: FightSide;
  targetSlot: number;
  damage: number | null;
  isSnipe: boolean;
}

export type FightAnimationPopupType =
  | 'damage'
  | 'attack'
  | 'health'
  | 'exp'
  | 'mana'
  | 'trumpets';

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

export interface FightAnimationEquipmentChange {
  side: FightSide;
  slot: number;
  action: 'added' | 'removed';
  equipmentName: string | null;
  equipmentIconSrc: string | null;
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
  equipmentChanges: FightAnimationEquipmentChange[];
}

interface ParsedToken {
  slot: number | null;
  isEmpty: boolean;
  attack: number | null;
  health: number | null;
  exp: number | null;
  mana: number | null;
  petIconSrc: string | null;
  petName: string | null;
  equipmentIconSrc: string | null;
  equipmentName: string | null;
  label: string | null;
}

export interface FightAnimationBuildOptions {
  includePositionPrefix?: boolean;
  includeBoardFrames?: boolean;
}

const SIDE_TOKEN_REGEX =
  /___ \(-\/-\)|(?:[PO]\d+\s+)?(?:<img\b[^>]*>\s*)*\(\d+\/\d+(?:\/\d+(?:\s*xp)?)?(?:\/\d+(?:\s*mana)?)?\)/gi;
const IMAGE_TAG_REGEX = /<img\b[^>]*>/gi;
const PLAYER_FALLBACK_ORDER = [4, 3, 2, 1, 0];
const OPPONENT_FALLBACK_ORDER = [0, 1, 2, 3, 4];
const ATTACK_REGEX =
  /^(.+?)\s+(?:jump-)?attacks?\s+(.+?)\s+for\s+(\d+)/i;
const SNIPE_REGEX = /^(.+?)\s+sniped\s+(.+?)\s+for\s+(\d+)/i;
const FAINT_REGEX = /^(.+?)\s+fainted\./i;
const SUBJECT_REGEX =
  /^(.+?)\s+(?:attacks?|sniped|fainted|gave|gained|lost|removed|transformed|destroyed|consumed|moved)\b/i;
const TO_SEGMENT_REGEX = /\bto\s+(.+?)(?:\.|$)/i;
const TRANSFORM_TARGET_REGEX = /\btransformed\s+(.+?)\s+into\b/i;
const TRANSFORM_INTO_SEGMENT_REGEX = /\binto\b([\s\S]*)$/i;
const INLINE_STATS_REGEX =
  /(\d+)\s*\/\s*(\d+)(?:\s*\/\s*(\d+)(?:\s*xp)?)?(?:\s*\/\s*(\d+)(?:\s*mana)?)?/i;
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
  const includeBoardFrames = options.includeBoardFrames !== false;
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

    if (log.type === 'board' && !includeBoardFrames) {
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
      equipmentChanges: mutationResult.equipmentChanges,
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
    equipmentChanges: [],
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
    result.death = applyDeathMutation(state, log, text);
    return result;
  }
  if (log.type === 'ability' || log.type === 'equipment') {
    applyTransformMutation(state, log, text, result.popups);
    applyStatMutation(state, log, text, result.popups);
    applyEquipmentMutation(state, log, text, result.equipmentChanges);
    applySummonMutation(state, log, text);
    return result;
  }
  if (log.type === 'trumpets') {
    applyTrumpetMutation(state, log, text, result.popups);
    return result;
  }
  if (log.type === 'move' && /\bmoved\b/i.test(text)) {
    clearPendingRemovalSlots(state);
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
      isSnipe: parsedAttack.isSnipe,
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
    isSnipe: parsedAttack.isSnipe,
  };
}

function applyDeathMutation(
  state: FightAnimationBoardState,
  log: Log,
  text: string,
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
  deadRef.value.pendingRemoval = true;
  if (deadRef.value.health != null) {
    deadRef.value.health = 0;
  }
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
  if (
    !transform.transformedName &&
    transform.attack == null &&
    transform.health == null &&
    transform.exp == null &&
    transform.mana == null &&
    !transform.equipmentName
  ) {
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
  applyAbsoluteStatChange(
    targetRef.value,
    popups,
    targetRef.side,
    targetRef.slot,
    'mana',
    transform.mana,
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
    statChange.expDelta === 0 &&
    statChange.manaDelta === 0
  ) {
    return;
  }

  const sourceSide = getLogPrimarySide(log);
  const sourceName = parseSubjectName(text);
  const targetName = parseTargetName(text, sourceName);
  const shouldApplyToTarget = shouldApplyStatChangeToTarget(
    text,
    sourceName,
    targetName,
  );
  const targetSide = inferTargetSide(
    state,
    log,
    text,
    sourceSide,
    targetName,
    'same',
  );

  const sourcePetName = normalizeEntityToken(log.sourcePet?.name);
  const targetPetName = normalizeEntityToken(log.targetPet?.name);
  const transformedName = /\btransform(?:ed|ing)?\b/i.test(text)
    ? parseTransformEvent(text).transformedName
    : null;
  const hasPrimaryStatDelta =
    statChange.attackDelta !== 0 ||
    statChange.healthDelta !== 0 ||
    statChange.expDelta !== 0;
  if (hasPrimaryStatDelta) {
    const statRef = resolveSlotRef(state, {
      preferredSide: shouldApplyToTarget ? targetSide : sourceSide,
      explicitIndex: shouldApplyToTarget ? log.targetIndex : log.sourceIndex,
      expectedName: shouldApplyToTarget ? targetName : sourceName,
      preferNonEmpty: true,
    });
    if (statRef) {
      const resolvedTargetName = shouldApplyToTarget
        ? targetPetName ?? targetName ?? sourcePetName ?? sourceName
        : transformedName ?? sourcePetName ?? sourceName;
      if (resolvedTargetName) {
        setSlotPet(statRef.value, resolvedTargetName);
      }

      applyDeltaStatChange(
        statRef.value,
        popups,
        statRef.side,
        statRef.slot,
        'attack',
        statChange.attackDelta,
      );
      applyDeltaStatChange(
        statRef.value,
        popups,
        statRef.side,
        statRef.slot,
        'health',
        statChange.healthDelta,
      );
      applyDeltaStatChange(
        statRef.value,
        popups,
        statRef.side,
        statRef.slot,
        'exp',
        statChange.expDelta,
      );
    }
  }

  if (statChange.manaDelta !== 0) {
    const shouldApplyManaToTarget = shouldApplyManaChangeToTarget(
      text,
      sourceName,
      targetName,
    );
    const manaRef = resolveSlotRef(state, {
      preferredSide: shouldApplyManaToTarget ? targetSide : sourceSide,
      explicitIndex: shouldApplyManaToTarget ? log.targetIndex : log.sourceIndex,
      expectedName: shouldApplyManaToTarget ? targetName : sourceName,
      preferNonEmpty: true,
    });
    if (!manaRef) {
      return;
    }
    const resolvedManaName = shouldApplyManaToTarget
      ? targetPetName ?? targetName ?? sourcePetName ?? sourceName
      : sourcePetName ?? sourceName ?? transformedName;
    if (resolvedManaName) {
      setSlotPet(manaRef.value, resolvedManaName);
    }
    applyDeltaStatChange(
      manaRef.value,
      popups,
      manaRef.side,
      manaRef.slot,
      'mana',
      statChange.manaDelta,
    );
  }
}

function applyTrumpetMutation(
  state: FightAnimationBoardState,
  log: Log,
  text: string,
  popups: FightAnimationPopup[],
): void {
  const trumpetChange = parseTrumpetChange(text);
  if (!trumpetChange) {
    return;
  }

  const sourceSide = getLogPrimarySide(log);
  const sourceName = parseSubjectName(text);
  const sourceRef = resolveSlotRef(state, {
    preferredSide: sourceSide,
    explicitIndex: log.sourceIndex,
    expectedName: sourceName,
    preferNonEmpty: true,
  });
  if (sourceRef && sourceName) {
    setSlotPet(sourceRef.value, sourceName);
  }

  const popupSide = trumpetChange.appliesToOpponent
    ? getOppositeSide(sourceRef?.side ?? sourceSide)
    : sourceRef?.side ?? sourceSide;
  const popupSlot = resolveTrumpetPopupSlot(
    state,
    popupSide,
    trumpetChange.appliesToOpponent ? null : sourceRef?.slot ?? null,
    trumpetChange.appliesToOpponent ? log.targetIndex : log.sourceIndex,
  );

  popups.push({
    side: popupSide,
    slot: popupSlot,
    type: 'trumpets',
    delta: trumpetChange.delta,
  });
}

function applyAbsoluteStatChange(
  slot: FightAnimationSlot,
  popups: FightAnimationPopup[],
  side: FightSide,
  slotIndex: number,
  type: 'attack' | 'health' | 'exp' | 'mana',
  value: number | null,
): void {
  if (value == null) {
    return;
  }
  const previous =
    type === 'attack'
      ? slot.attack
      : type === 'health'
        ? slot.health
        : type === 'exp'
          ? slot.exp
          : slot.mana;
  if (type === 'attack') {
    slot.attack = value;
  } else if (type === 'health') {
    slot.health = value;
  } else if (type === 'exp') {
    slot.exp = value;
  } else {
    slot.mana = value;
  }
  const appliedDelta = previous != null ? value - previous : 0;
  pushStatPopup(popups, side, slotIndex, type, appliedDelta);
}

function applyDeltaStatChange(
  slot: FightAnimationSlot,
  popups: FightAnimationPopup[],
  side: FightSide,
  slotIndex: number,
  type: 'attack' | 'health' | 'exp' | 'mana',
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
        : type === 'exp'
          ? (slot.exp ?? 0)
          : (slot.mana ?? 0);
  const next = Math.max(0, previous + delta);
  if (type === 'attack') {
    slot.attack = next;
  } else if (type === 'health') {
    slot.health = next;
  } else if (type === 'exp') {
    slot.exp = next;
  } else {
    slot.mana = next;
  }
  pushStatPopup(popups, side, slotIndex, type, next - previous);
}

function pushStatPopup(
  popups: FightAnimationPopup[],
  side: FightSide,
  slot: number,
  type: 'attack' | 'health' | 'exp' | 'mana',
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
  equipmentChanges: FightAnimationEquipmentChange[],
): void {
  const mentionedEquipment = extractKnownNames(text, equipmentPatterns);
  const fallbackEquipmentName = mentionedEquipment[0] ?? null;
  const removedEquipmentName = getEquipmentNameBetween(text, 'removed', 'from');
  const gaveEquipmentName = getEquipmentNameAfterGave(text);
  const gainedEquipmentName = getEquipmentNameAfterVerb(text, 'gained');
  const withEquipmentName = getEquipmentNameAfterVerb(text, 'with');
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
      const previousName = sourceRef.value.equipmentName;
      const previousIcon =
        sourceRef.value.equipmentIconSrc ??
        resolveEquipmentIconSrc(previousName);
      clearSlotEquipment(sourceRef.value);
      equipmentChanges.push({
        side: sourceRef.side,
        slot: sourceRef.slot,
        action: 'removed',
        equipmentName: previousName,
        equipmentIconSrc: previousIcon,
      });
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
      const previousName = targetRef.value.equipmentName;
      const previousIcon =
        targetRef.value.equipmentIconSrc ??
        resolveEquipmentIconSrc(previousName);
      clearSlotEquipment(targetRef.value);
      equipmentChanges.push({
        side: targetRef.side,
        slot: targetRef.slot,
        action: 'removed',
        equipmentName: previousName,
        equipmentIconSrc: previousIcon,
      });
    }
    return;
  }

  if (
    /\bremoved\b/i.test(text) &&
    /\bfrom\b/i.test(text) &&
    (removedEquipmentName != null || /\bequipment|perk|ailment\b/i.test(text))
  ) {
    const targetRef = resolveSlotRef(state, {
      preferredSide: targetSide,
      explicitIndex: log.targetIndex,
      expectedName: targetName,
      preferNonEmpty: true,
    });
    if (targetRef) {
      const previousName = targetRef.value.equipmentName ?? removedEquipmentName;
      const previousIcon =
        targetRef.value.equipmentIconSrc ??
        resolveEquipmentIconSrc(previousName);
      clearSlotEquipment(targetRef.value);
      equipmentChanges.push({
        side: targetRef.side,
        slot: targetRef.slot,
        action: 'removed',
        equipmentName: previousName,
        equipmentIconSrc: previousIcon,
      });
    }
  }

  if (/\bstole\b/i.test(text) && /\bequipment\b/i.test(text)) {
    const sourceRef = resolveSlotRef(state, {
      preferredSide: sourceSide,
      explicitIndex: log.sourceIndex,
      expectedName: sourceName,
      preferNonEmpty: true,
    });
    const targetRef = resolveSlotRef(state, {
      preferredSide: targetSide,
      explicitIndex: log.targetIndex,
      expectedName: targetName,
      preferNonEmpty: true,
    });
    if (!targetRef) {
      return;
    }

    const stolenEquipmentName = targetRef.value.equipmentName ?? fallbackEquipmentName;
    const stolenEquipmentIcon =
      targetRef.value.equipmentIconSrc ??
      resolveEquipmentIconSrc(stolenEquipmentName);
    if (stolenEquipmentName) {
      clearSlotEquipment(targetRef.value);
      equipmentChanges.push({
        side: targetRef.side,
        slot: targetRef.slot,
        action: 'removed',
        equipmentName: stolenEquipmentName,
        equipmentIconSrc: stolenEquipmentIcon,
      });
      if (sourceRef) {
        setSlotEquipment(sourceRef.value, stolenEquipmentName);
        equipmentChanges.push({
          side: sourceRef.side,
          slot: sourceRef.slot,
          action: 'added',
          equipmentName: stolenEquipmentName,
          equipmentIconSrc:
            sourceRef.value.equipmentIconSrc ??
            resolveEquipmentIconSrc(stolenEquipmentName),
        });
      }
    }
    return;
  }

  if (/\bgave\b/i.test(text)) {
    const equipmentName = gaveEquipmentName ?? fallbackEquipmentName;
    if (!equipmentName) {
      return;
    }
    const targetRef = resolveSlotRef(state, {
      preferredSide: targetSide,
      explicitIndex: log.targetIndex,
      expectedName: targetName,
      preferNonEmpty: true,
    });
    if (targetRef) {
      setSlotEquipment(targetRef.value, equipmentName);
      equipmentChanges.push({
        side: targetRef.side,
        slot: targetRef.slot,
        action: 'added',
        equipmentName,
        equipmentIconSrc:
          targetRef.value.equipmentIconSrc ??
          resolveEquipmentIconSrc(equipmentName),
      });
    }
    return;
  }

  if (/\bgained\b/i.test(text) || /\bwith\b/i.test(text)) {
    const equipmentName =
      gainedEquipmentName ?? withEquipmentName ?? fallbackEquipmentName;
    if (!equipmentName) {
      return;
    }
    const sourceRef = resolveSlotRef(state, {
      preferredSide: sourceSide,
      explicitIndex: log.sourceIndex ?? log.targetIndex,
      expectedName: sourceName,
      preferNonEmpty: true,
    });
    if (sourceRef) {
      setSlotEquipment(sourceRef.value, equipmentName);
      equipmentChanges.push({
        side: sourceRef.side,
        slot: sourceRef.slot,
        action: 'added',
        equipmentName,
        equipmentIconSrc:
          sourceRef.value.equipmentIconSrc ??
          resolveEquipmentIconSrc(equipmentName),
      });
    }
  }
}

function getEquipmentNameFromSegment(segment: string): string | null {
  if (!segment) {
    return null;
  }
  return extractKnownNames(segment, equipmentPatterns)[0] ?? null;
}

function getEquipmentNameBetween(
  text: string,
  startWord: string,
  endWord: string,
): string | null {
  const segment =
    new RegExp(`\\b${startWord}\\b([\\s\\S]*?)\\b${endWord}\\b`, 'i').exec(
      text,
    )?.[1] ?? '';
  return getEquipmentNameFromSegment(segment);
}

function getEquipmentNameAfterVerb(text: string, verb: string): string | null {
  const segment = new RegExp(`\\b${verb}\\b([\\s\\S]*)$`, 'i').exec(text)?.[1] ?? '';
  return getEquipmentNameFromSegment(segment);
}

function getEquipmentNameAfterGave(text: string): string | null {
  const segment = /\bgave\b([\s\S]*)$/i.exec(text)?.[1] ?? '';
  return getEquipmentNameFromSegment(segment);
}

function applySummonMutation(
  state: FightAnimationBoardState,
  log: Log,
  text: string,
): void {
  if (!/\b(?:summoned|spawned)\b/i.test(text)) {
    return;
  }

  const sourceSide = getLogPrimarySide(log);
  const sourceName = parseSubjectName(text);
  const summonSegment = getSummonSegment(text);
  const summonedPetName = parseSummonedPetName(summonSegment, sourceName);
  if (!summonedPetName) {
    return;
  }

  const summonedSide = inferSummonedSide(text, sourceSide);
  const summonSlot = resolveSummonSlot(state, {
    side: summonedSide,
    sourceSide,
    sourceIndex: log.sourceIndex,
    targetIndex: log.targetIndex,
    summonedPetName,
  });
  if (summonSlot == null) {
    return;
  }

  const targetSlot = getSlot(state, summonedSide, summonSlot);
  setSlotPet(targetSlot, summonedPetName);

  const inlineStats = parseInlineStatsFromSegment(summonSegment);
  if (inlineStats.attack != null) {
    targetSlot.attack = inlineStats.attack;
  }
  if (inlineStats.health != null) {
    targetSlot.health = inlineStats.health;
  }
  if (inlineStats.exp != null) {
    targetSlot.exp = inlineStats.exp;
  }
  if (inlineStats.mana != null) {
    targetSlot.mana = inlineStats.mana;
  }

  const summonEquipmentName = getEquipmentNameAfterVerb(summonSegment, 'with');
  if (summonEquipmentName) {
    setSlotEquipment(targetSlot, summonEquipmentName);
  }
}

function getSummonSegment(text: string): string {
  return /\b(?:summoned|spawned)\b([\s\S]*)$/i.exec(text)?.[1] ?? '';
}

function parseSummonedPetName(
  summonSegment: string,
  sourceName: string | null,
): string | null {
  const namesFromSegment = extractKnownNames(summonSegment, petPatterns);
  if (namesFromSegment.length > 0) {
    const sourceNormalized = normalizeComparableName(sourceName);
    const nonSource = namesFromSegment.find(
      (name) => normalizeComparableName(name) !== sourceNormalized,
    );
    return nonSource ?? namesFromSegment[0] ?? null;
  }
  return null;
}

function inferSummonedSide(text: string, sourceSide: FightSide): FightSide {
  if (/\b(?:for|on)\s+(?:the\s+)?(?:enemy|opponent)\b/i.test(text)) {
    return sourceSide === 'player' ? 'opponent' : 'player';
  }
  if (/\bfor\s+(?:the\s+)?player\b/i.test(text)) {
    return 'player';
  }
  return sourceSide;
}

function resolveSummonSlot(
  state: FightAnimationBoardState,
  options: {
    side: FightSide;
    sourceSide: FightSide;
    sourceIndex?: number | null;
    targetIndex?: number | null;
    summonedPetName: string;
  },
): number | null {
  const slots = getSideSlots(state, options.side);

  if (options.targetIndex != null) {
    return normalizeSlot(options.targetIndex - 1);
  }

  if (options.side === options.sourceSide && options.sourceIndex != null) {
    const sourceSlot = normalizeSlot(options.sourceIndex - 1);
    if (slots[sourceSlot]?.isEmpty) {
      return sourceSlot;
    }
  }

  const existingSlot = findSlotIndexByName(slots, options.summonedPetName);
  if (existingSlot !== -1) {
    return existingSlot;
  }

  const firstEmptySlot = slots.findIndex((slot) => slot.isEmpty);
  if (firstEmptySlot !== -1) {
    return firstEmptySlot;
  }

  return null;
}

function parseInlineStatsFromSegment(segment: string): {
  attack: number | null;
  health: number | null;
  exp: number | null;
  mana: number | null;
} {
  const statsMatch = INLINE_STATS_REGEX.exec(segment);
  return {
    attack: statsMatch?.[1] != null ? Number(statsMatch[1]) : null,
    health: statsMatch?.[2] != null ? Number(statsMatch[2]) : null,
    exp: statsMatch?.[3] != null ? Number(statsMatch[3]) : null,
    mana: statsMatch?.[4] != null ? Number(statsMatch[4]) : null,
  };
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
      pendingRemoval: false,
      attack: parsed.attack,
      health: parsed.health,
      exp: parsed.exp,
      mana: parsed.mana,
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
      mana: null,
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

  const statsMatch =
    /\((\d+)\/(\d+)(?:\/(\d+)(?:\s*xp)?)?(?:\/(\d+)(?:\s*mana)?)?\)/i.exec(
      trimmed,
    );
  const attack = statsMatch ? Number(statsMatch[1]) : null;
  const health = statsMatch ? Number(statsMatch[2]) : null;
  const exp = statsMatch?.[3] != null ? Number(statsMatch[3]) : null;
  const mana = statsMatch?.[4] != null ? Number(statsMatch[4]) : null;

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
    mana,
    petIconSrc,
    petName,
    equipmentIconSrc,
    equipmentName,
    label,
  };
}

function parseAttackEvent(text: string): ParsedAttackEvent {
  const snipeMatch = SNIPE_REGEX.exec(text);
  if (snipeMatch) {
    return {
      attackerName: normalizeEntityToken(snipeMatch[1]),
      targetName: normalizeEntityToken(snipeMatch[2]),
      damage: Number(snipeMatch[3]),
      isSnipe: true,
    };
  }

  const attackMatch = ATTACK_REGEX.exec(text);
  if (!attackMatch) {
    return {
      attackerName: null,
      targetName: null,
      damage: parseDamageValue(text),
      isSnipe: false,
    };
  }

  return {
    attackerName: normalizeEntityToken(attackMatch[1]),
    targetName: normalizeEntityToken(attackMatch[2]),
    damage: Number(attackMatch[3]),
    isSnipe: false,
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
  const mana = statsMatch?.[4] != null ? Number(statsMatch[4]) : null;
  const equipmentName =
    extractKnownNames(intoSegment, equipmentPatterns)[0] ?? null;

  return {
    sourceName,
    targetName,
    transformedName,
    attack,
    health,
    exp,
    mana,
    equipmentName,
  };
}

function parseStatChange(text: string): ParsedStatChange | null {
  const hasAttack = /\battack\b/i.test(text);
  const hasHealth = /\bhealth\b/i.test(text);
  const hasExp = /\b(?:xp|exp|experience)\b/i.test(text);
  const hasMana = /\bmana\b/i.test(text);
  if (!hasAttack && !hasHealth && !hasExp && !hasMana) {
    return null;
  }

  const sign = /\b(?:lost|spent|took|drain(?:ed)?)\b/i.test(text) ? -1 : 1;
  const attackValue = extractStatValue(text, 'attack', sign);
  const healthValue = extractStatValue(text, 'health', sign);
  const expValue = extractExpValue(text, sign);
  const manaValue = extractManaValue(text, sign);

  if (
    attackValue == null &&
    healthValue == null &&
    expValue == null &&
    manaValue == null
  ) {
    return null;
  }

  return {
    attackDelta: attackValue ?? 0,
    healthDelta: healthValue ?? 0,
    expDelta: expValue ?? 0,
    manaDelta: manaValue ?? 0,
  };
}

function parseTrumpetChange(text: string): ParsedTrumpetChange | null {
  const gaveOpponentMatch =
    /\bgave\s+opponent\s+([+-]?\d+)\s+trumpets?\b/i.exec(text);
  if (gaveOpponentMatch) {
    const amount = parseSignedAmount(gaveOpponentMatch[1]);
    if (amount == null || amount === 0) {
      return null;
    }
    return {
      delta: Math.abs(amount),
      appliesToOpponent: true,
    };
  }

  const gainedMatch = /\bgained\s+([+-]?\d+)\s+trumpets?\b/i.exec(text);
  if (gainedMatch) {
    const amount = parseSignedAmount(gainedMatch[1]);
    if (amount == null || amount === 0) {
      return null;
    }
    return {
      delta: amount,
      appliesToOpponent: false,
    };
  }

  const spentMatch = /\bspent\s+([+-]?\d+)\s+trumpets?\b/i.exec(text);
  if (spentMatch) {
    const amount = parseSignedAmount(spentMatch[1]);
    if (amount == null || amount === 0) {
      return null;
    }
    return {
      delta: -Math.abs(amount),
      appliesToOpponent: false,
    };
  }

  return null;
}

function shouldApplyStatChangeToTarget(
  text: string,
  sourceName: string | null,
  targetName: string | null,
): boolean {
  if (!targetName) {
    return false;
  }
  if (/\bgave\b/i.test(text)) {
    return true;
  }
  const sourceNormalized = normalizeComparableName(sourceName);
  const targetNormalized = normalizeComparableName(targetName);
  if (
    sourceNormalized &&
    targetNormalized &&
    sourceNormalized === targetNormalized
  ) {
    return false;
  }
  return (
    /\bincreased\b/i.test(text) ||
    /\b(?:attack|health)\s+of\b/i.test(text) ||
    /\b(?:attack|health)\s+by\b/i.test(text)
  );
}

function shouldApplyManaChangeToTarget(
  text: string,
  sourceName: string | null,
  targetName: string | null,
): boolean {
  if (!targetName || !/\bmana\b/i.test(text)) {
    return false;
  }
  const sourceNormalized = normalizeComparableName(sourceName);
  const targetNormalized = normalizeComparableName(targetName);
  if (
    sourceNormalized &&
    targetNormalized &&
    sourceNormalized === targetNormalized
  ) {
    return false;
  }
  if (/\btook\b/i.test(text) && /\bfrom\b/i.test(text)) {
    return true;
  }
  if (/\bspent\b/i.test(text)) {
    return /\bfrom\b/i.test(text);
  }
  if (/\bgave\b/i.test(text)) {
    return true;
  }
  if (/\breplaced\b/i.test(text) && /\bon\b/i.test(text) && /\bwith\b/i.test(text)) {
    return true;
  }
  return shouldApplyStatChangeToTarget(text, sourceName, targetName);
}

function extractStatValue(
  text: string,
  stat: 'attack' | 'health',
  defaultSign: number,
): number | null {
  const directRegex = new RegExp(`([+-]?\\d+)\\s+${stat}\\b`, 'i');
  const byRegex = new RegExp(
    `${stat}\\b(?:\\s+of\\s+[^.]+?)?\\s+by\\s+([+-]?\\d+)`,
    'i',
  );
  const match = directRegex.exec(text) ?? byRegex.exec(text);
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

function extractManaValue(text: string, defaultSign: number): number | null {
  const directRegex = /([+-]?\d+)\s+(?:bonus\s+)?mana\b/i;
  const byRegex = /\bmana\b(?:\s+of\s+[^.]+?)?\s+by\s+([+-]?\d+)/i;
  const match = directRegex.exec(text) ?? byRegex.exec(text);
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

function parseSignedAmount(raw: string | null | undefined): number | null {
  if (!raw) {
    return null;
  }
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return parsed;
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

function resolveTrumpetPopupSlot(
  state: FightAnimationBoardState,
  side: FightSide,
  preferredSlot: number | null,
  explicitIndex: number | null | undefined,
): number {
  if (preferredSlot != null) {
    return normalizeSlot(preferredSlot);
  }
  if (explicitIndex != null && Number.isFinite(explicitIndex)) {
    return normalizeSlot(explicitIndex - 1);
  }
  const sideSlots = getSideSlots(state, side);
  const firstOccupied = sideSlots.findIndex((slot) => !slot.isEmpty);
  return firstOccupied === -1 ? 0 : firstOccupied;
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

function getOppositeSide(side: FightSide): FightSide {
  return side === 'player' ? 'opponent' : 'player';
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
  return message.replace(/\[([^\]]+)\]/g, (full, inner: string) => {
    const compact = `${inner ?? ''}`
      .replace(/&[a-z0-9#]+;/gi, '')
      .replace(/[\s\u200b-\u200d\u2060\ufeff]+/gi, '')
      .toUpperCase();
    if (!compact) {
      return full;
    }
    const directionalMatch = /^([PO][1-5])->([PO][1-5])$/.exec(compact);
    if (directionalMatch) {
      return `[${directionalMatch[1]}->${directionalMatch[2]}]`;
    }
    const sourceOnlyMatch = /^([PO][1-5])$/.exec(compact);
    if (sourceOnlyMatch) {
      return `[${sourceOnlyMatch[1]}]`;
    }
    const targetOnlyMatch = /^->([PO][1-5])$/.exec(compact);
    if (targetOnlyMatch) {
      return `[->${targetOnlyMatch[1]}]`;
    }
    return full;
  });
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
  slot.equipmentIconSrc = resolveEquipmentIconSrc(equipmentName);
  slot.label = getSlotLabel(slot.side, slot.slot);
}

function clearSlotEquipment(slot: FightAnimationSlot): void {
  slot.equipmentName = null;
  slot.equipmentIconSrc = null;
}

function resolveEquipmentIconSrc(
  equipmentName: string | null | undefined,
): string | null {
  if (!equipmentName) {
    return null;
  }
  const isAilment = ailmentNames.has(equipmentName);
  return getEquipmentIconPath(equipmentName, isAilment);
}

function clearSlot(slot: FightAnimationSlot): void {
  slot.isEmpty = true;
  slot.pendingRemoval = false;
  slot.attack = null;
  slot.health = null;
  slot.exp = null;
  slot.mana = null;
  slot.petIconSrc = null;
  slot.petName = null;
  slot.petCompanionIconSrc = null;
  slot.petCompanionName = null;
  slot.equipmentIconSrc = null;
  slot.equipmentName = null;
  slot.label = null;
}

function clearPendingRemovalSlots(state: FightAnimationBoardState): void {
  clearPendingRemovalSlotsForSide(state, 'player');
  clearPendingRemovalSlotsForSide(state, 'opponent');
}

function clearPendingRemovalSlotsForSide(
  state: FightAnimationBoardState,
  side: FightSide,
): void {
  const slots = getSideSlots(state, side);
  slots.forEach((slot) => {
    if (!slot.pendingRemoval) {
      return;
    }
    clearSlot(slot);
  });
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
      pendingRemoval: false,
      attack: null,
      health: null,
      exp: null,
      mana: null,
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
