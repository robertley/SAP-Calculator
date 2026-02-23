import {
    getEquipmentIconPath,
    getPetIconPath,
} from 'app/runtime/asset-catalog';
import { ailmentNames } from './name-patterns';
import {
    FightAnimationBoardState,
    FightAnimationShift,
    FightAnimationSlot,
    FightSide,
    ResolvedPetVisual,
} from './types';

export function normalizeSlot(value: number): number {
    if (!Number.isFinite(value)) {
        return 0;
    }
    return Math.min(Math.max(0, Math.trunc(value)), 4);
}

export function getSlotLabel(side: FightSide, slot: number): string {
    return `${side === 'player' ? 'P' : 'O'}${slot + 1}`;
}

export function normalizeComparableName(name: string | null | undefined): string {
    return `${name ?? ''}`.trim().toLowerCase();
}

export function normalizeEntityToken(value: string | null | undefined): string | null {
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

export function readAttr(tag: string, attr: string): string | null {
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

export function getSideSlots(
    state: FightAnimationBoardState,
    side: FightSide,
): FightAnimationSlot[] {
    return side === 'player' ? state.playerSlots : state.opponentSlots;
}

export function getSlot(
    state: FightAnimationBoardState,
    side: FightSide,
    index: number,
): FightAnimationSlot {
    return getSideSlots(state, side)[normalizeSlot(index)];
}

export function findSlotIndexByName(
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

export function slotNameMatches(slot: FightAnimationSlot, normalizedName: string): boolean {
    return normalizeComparableName(slot.petName) === normalizedName;
}

export function resolveEquipmentIconSrc(
    equipmentName: string | null | undefined,
): string | null {
    if (!equipmentName) {
        return null;
    }
    const isAilment = ailmentNames.has(equipmentName);
    return getEquipmentIconPath(equipmentName, isAilment);
}

export function resolvePetVisual(
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

export function splitCompositePetName(name: string): string[] {
    if (!name.includes("'") && !name.includes('\u2019')) {
        return [name];
    }
    const POSSESSIVE_SPLIT_REGEX = /\s*(?:'|\u2019)s\s+/i;
    return name
        .split(POSSESSIVE_SPLIT_REGEX)
        .map((part) => part.trim())
        .filter((part) => Boolean(part));
}

export function buildEmptySlots(side: FightSide): FightAnimationSlot[] {
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

export function cloneSlots(slots: FightAnimationSlot[]): FightAnimationSlot[] {
    return slots.map((slot) => ({ ...slot }));
}

export function clearSlot(slot: FightAnimationSlot): void {
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

export function clearPendingRemovalSlots(state: FightAnimationBoardState): void {
    clearPendingRemovalSlotsForSide(state, 'player');
    clearPendingRemovalSlotsForSide(state, 'opponent');
}

export function clearPendingRemovalSlotsForSide(
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

export function setSlotPet(slot: FightAnimationSlot, petName: string): void {
    slot.isEmpty = false;
    slot.petName = petName;
    const visual = resolvePetVisual(petName);
    slot.petIconSrc = visual.petIconSrc;
    slot.petCompanionIconSrc = visual.petCompanionIconSrc;
    slot.petCompanionName = visual.petCompanionName;
    slot.label = getSlotLabel(slot.side, slot.slot);
}

export function setSlotEquipment(slot: FightAnimationSlot, equipmentName: string): void {
    slot.isEmpty = false;
    slot.equipmentName = equipmentName;
    slot.equipmentIconSrc = resolveEquipmentIconSrc(equipmentName);
    slot.label = getSlotLabel(slot.side, slot.slot);
}

export function clearSlotEquipment(slot: FightAnimationSlot): void {
    slot.equipmentName = null;
    slot.equipmentIconSrc = null;
}

export function pushSideForward(
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
