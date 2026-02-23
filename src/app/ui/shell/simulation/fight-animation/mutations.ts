import { Log } from 'app/domain/interfaces/log.interface';
import { extractKnownNames, equipmentPatterns } from './name-patterns';
import {
    parseAttackEvent,
    parseSubjectName,
    parseTargetName,
    parseTransformEvent,
    parseStatChange,
    parseTrumpetChange,
    parseFaintedName,
    shouldApplyStatChangeToTarget,
    shouldApplyManaChangeToTarget,
    parseSummonedPetName,
    getSummonSegment,
    inferSummonedSide,
    parseInlineStatsFromSegment,
    getEquipmentNameAfterVerb,
} from './log-parsers';
import {
    getLogPrimarySide,
    inferTargetSide,
    resolveSlotRef,
    resolveSummonSlot,
    resolveTrumpetPopupSlot,
    getOppositeSide,
} from './slot-resolver';
import {
    FightAnimationBoardState,
    FightAnimationDeath,
    FightAnimationEquipmentChange,
    FightAnimationImpact,
    FightAnimationMutationResult,
    FightAnimationPopup,
    FightAnimationSlot,
    FightAnimationToyChange,
    FightSide,
} from './types';
import {
    clearPendingRemovalSlots,
    clearSlotEquipment,
    getSlot,
    normalizeEntityToken,
    normalizeSlot,
    pushSideForward,
    resolveEquipmentIconSrc,
    setSlotEquipment,
    setSlotPet,
} from './slot-utils';

export function createEmptyMutationResult(): FightAnimationMutationResult {
    return {
        impact: null,
        popups: [],
        death: null,
        shifts: [],
        equipmentChanges: [],
        toyChanges: [],
    };
}

export function applyLogMutation(
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
        applyToyMutation(state, log, text, result.toyChanges);
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

// ---------------------------------------------------------------------------
// Attack mutation
// ---------------------------------------------------------------------------

export function applyAttackMutation(
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

// ---------------------------------------------------------------------------
// Death mutation
// ---------------------------------------------------------------------------

export function applyDeathMutation(
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

// ---------------------------------------------------------------------------
// Transform mutation
// ---------------------------------------------------------------------------

export function applyTransformMutation(
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

// ---------------------------------------------------------------------------
// Stat mutation
// ---------------------------------------------------------------------------

export function applyStatMutation(
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

// ---------------------------------------------------------------------------
// Trumpet mutation
// ---------------------------------------------------------------------------

export function applyTrumpetMutation(
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

// ---------------------------------------------------------------------------
// Stat change helpers
// ---------------------------------------------------------------------------

export function applyAbsoluteStatChange(
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

export function applyDeltaStatChange(
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

export function pushStatPopup(
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

// ---------------------------------------------------------------------------
// Equipment mutation
// ---------------------------------------------------------------------------

export function applyEquipmentMutation(
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

function getEquipmentNameAfterGave(text: string): string | null {
    const segment = /\bgave\b([\s\S]*)$/i.exec(text)?.[1] ?? '';
    return getEquipmentNameFromSegment(segment);
}

// ---------------------------------------------------------------------------
// Summon mutation
// ---------------------------------------------------------------------------

export function applySummonMutation(
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

// ---------------------------------------------------------------------------
// Toy mutation
// ---------------------------------------------------------------------------

export function applyToyMutation(
    state: FightAnimationBoardState,
    log: Log,
    text: string,
    toyChanges: FightAnimationToyChange[],
): void {
    const match = /(.+?)\s+broke!/i.exec(text);
    if (!match) {
        return;
    }
    const toyNameRaw = match[1];
    const sourceSide = getLogPrimarySide(log);

    // Check if the source side's toy matches the broken toy roughly
    const isPlayerToy = state.playerToyName && toyNameRaw.toLowerCase().includes(state.playerToyName.toLowerCase());
    const isPlayerHardToy = state.playerHardToyName && toyNameRaw.toLowerCase().includes(state.playerHardToyName.toLowerCase());
    const isOpponentToy = state.opponentToyName && toyNameRaw.toLowerCase().includes(state.opponentToyName.toLowerCase());
    const isOpponentHardToy = state.opponentHardToyName && toyNameRaw.toLowerCase().includes(state.opponentHardToyName.toLowerCase());

    if (sourceSide === 'player') {
        if (isPlayerToy) {
            toyChanges.push({ side: 'player', action: 'removed', toyName: state.playerToyName!, isHardToy: false });
            state.playerToyName = null;
        } else if (isPlayerHardToy) {
            toyChanges.push({ side: 'player', action: 'removed', toyName: state.playerHardToyName!, isHardToy: true });
            state.playerHardToyName = null;
        } else if (isOpponentToy) { // Fallback just in case log source is weird
            toyChanges.push({ side: 'opponent', action: 'removed', toyName: state.opponentToyName!, isHardToy: false });
            state.opponentToyName = null;
        } else if (isOpponentHardToy) {
            toyChanges.push({ side: 'opponent', action: 'removed', toyName: state.opponentHardToyName!, isHardToy: true });
            state.opponentHardToyName = null;
        }
    } else {
        if (isOpponentToy) {
            toyChanges.push({ side: 'opponent', action: 'removed', toyName: state.opponentToyName!, isHardToy: false });
            state.opponentToyName = null;
        } else if (isOpponentHardToy) {
            toyChanges.push({ side: 'opponent', action: 'removed', toyName: state.opponentHardToyName!, isHardToy: true });
            state.opponentHardToyName = null;
        } else if (isPlayerToy) {
            toyChanges.push({ side: 'player', action: 'removed', toyName: state.playerToyName!, isHardToy: false });
            state.playerToyName = null;
        } else if (isPlayerHardToy) {
            toyChanges.push({ side: 'player', action: 'removed', toyName: state.playerHardToyName!, isHardToy: true });
            state.playerHardToyName = null;
        }
    }
}
