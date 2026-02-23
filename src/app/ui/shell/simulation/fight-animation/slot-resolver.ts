import { Log } from 'app/domain/interfaces/log.interface';
import {
    FightAnimationBoardState,
    FightSide,
    SlotRef,
} from './types';
import {
    findSlotIndexByName,
    getSideSlots,
    getSlot,
    normalizeComparableName,
    normalizeSlot,
    slotNameMatches,
} from './slot-utils';

// ---------------------------------------------------------------------------
// Log side helpers
// ---------------------------------------------------------------------------

export function getLogPrimarySide(log: Log): FightSide {
    return (
        resolveSideFromIsOpponent(log.player?.isOpponent) ??
        resolveSideFromIsOpponent(log.playerIsOpponent) ??
        resolveSideFromIsOpponent(log.sourcePet?.parent?.isOpponent) ??
        'player'
    );
}

export function getLogTargetSide(log: Log): FightSide | null {
    return (
        resolveSideFromIsOpponent(log.targetPet?.parent?.isOpponent) ??
        resolveSideFromIsOpponent(log.targetIsOpponent)
    );
}

export function resolveSideFromIsOpponent(
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

export function getOppositeSide(side: FightSide): FightSide {
    return side === 'player' ? 'opponent' : 'player';
}

// ---------------------------------------------------------------------------
// Label-based side inference
// ---------------------------------------------------------------------------

export function parseSideFromLabel(label: string): FightSide | null {
    if (label.startsWith('P')) {
        return 'player';
    }
    if (label.startsWith('O')) {
        return 'opponent';
    }
    return null;
}

export function inferSideFromLabel(text: string, index: number | null): FightSide | null {
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

// ---------------------------------------------------------------------------
// Target side inference
// ---------------------------------------------------------------------------

export function inferTargetSide(
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

// ---------------------------------------------------------------------------
// Slot resolution
// ---------------------------------------------------------------------------

export function resolveSlotRef(
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

export function resolveSummonSlot(
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

export function resolveTrumpetPopupSlot(
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
