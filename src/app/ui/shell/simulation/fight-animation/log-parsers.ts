import {
    ATTACK_REGEX,
    FAINT_REGEX,
    IMAGE_TAG_REGEX,
    INLINE_STATS_REGEX,
    SIDE_TOKEN_REGEX,
    SNIPE_REGEX,
    SUBJECT_REGEX,
    TO_SEGMENT_REGEX,
    TRANSFORM_INTO_SEGMENT_REGEX,
    TRANSFORM_TARGET_REGEX,
    PLAYER_FALLBACK_ORDER,
    OPPONENT_FALLBACK_ORDER,
} from './constants';
import { equipmentPatterns, extractKnownNames, petPatterns } from './name-patterns';
import {
    FightAnimationSlot,
    FightSide,
    ParsedAttackEvent,
    ParsedStatChange,
    ParsedToken,
    ParsedTransformEvent,
    ParsedTrumpetChange,
} from './types';
import {
    buildEmptySlots,
    normalizeComparableName,
    normalizeEntityToken,
    normalizeSlot,
    readAttr,
    resolvePetVisual,
    getSlotLabel,
} from './slot-utils';

// ---------------------------------------------------------------------------
// Token / board parsing
// ---------------------------------------------------------------------------

export function parseSideSlots(
    raw: string,
    side: FightSide,
): {
    slots: FightAnimationSlot[];
    toyName: string | null;
    hardToyName: string | null;
} | null {
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

    const toyMatch = raw.match(/\{\{toy:([^}]+)\}\}/);
    const hardToyMatch = raw.match(/\{\{hardtoy:([^}]+)\}\}/);

    return {
        slots,
        toyName: toyMatch ? toyMatch[1] : null,
        hardToyName: hardToyMatch ? hardToyMatch[1] : null,
    };
}

export function parseToken(token: string): ParsedToken {
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

export function parseInlineStatsFromSegment(segment: string): {
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

// ---------------------------------------------------------------------------
// Event parsers
// ---------------------------------------------------------------------------

export function parseAttackEvent(text: string): ParsedAttackEvent {
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

export function parseFaintedName(text: string): string | null {
    const match = FAINT_REGEX.exec(text);
    if (!match) {
        return null;
    }
    return normalizeEntityToken(match[1]);
}

export function parseSubjectName(text: string): string | null {
    const match = SUBJECT_REGEX.exec(text);
    if (!match) {
        const petNames = extractKnownNames(text, petPatterns);
        return petNames[0] ?? null;
    }
    return normalizeEntityToken(match[1]);
}

export function parseTargetName(
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

export function parseTransformEvent(text: string): ParsedTransformEvent {
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

export function parseStatChange(text: string): ParsedStatChange | null {
    const hasAttack = /\battack\b/i.test(text);
    const hasHealth = /\bhealth\b/i.test(text);
    const hasExp = /\b(?:xp|exp|experience)\b/i.test(text);
    const hasMana = /\bmana\b/i.test(text);
    if (!hasAttack && !hasHealth && !hasExp && !hasMana) {
        return null;
    }

    const sign = /\b(?:lost|spent|took|drain(?:ed)?|reduce(?:d)?|decrease(?:d)?|lower(?:ed)?)\b/i.test(
        text,
    )
        ? -1
        : 1;
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

export function parseTrumpetChange(text: string): ParsedTrumpetChange | null {
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

// ---------------------------------------------------------------------------
// Stat change target determination
// ---------------------------------------------------------------------------

export function shouldApplyStatChangeToTarget(
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

export function shouldApplyManaChangeToTarget(
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

// ---------------------------------------------------------------------------
// Value extraction helpers
// ---------------------------------------------------------------------------

export function extractStatValue(
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

export function extractExpValue(text: string, defaultSign: number): number | null {
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

export function extractManaValue(text: string, defaultSign: number): number | null {
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

export function parseSignedAmount(raw: string | null | undefined): number | null {
    if (!raw) {
        return null;
    }
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
        return null;
    }
    return parsed;
}

export function parseDamageValue(text: string): number | null {
    const damageMatch = /\bfor\s+(\d+)\b/i.exec(text);
    if (!damageMatch) {
        return null;
    }
    const value = Number(damageMatch[1]);
    return Number.isFinite(value) ? value : null;
}

// ---------------------------------------------------------------------------
// Equipment name extraction helpers
// ---------------------------------------------------------------------------

function getEquipmentNameFromSegment(segment: string): string | null {
    if (!segment) {
        return null;
    }
    return extractKnownNames(segment, equipmentPatterns)[0] ?? null;
}

export function getEquipmentNameAfterVerb(text: string, verb: string): string | null {
    const segment = new RegExp(`\\b${verb}\\b([\\s\\S]*)$`, 'i').exec(text)?.[1] ?? '';
    return getEquipmentNameFromSegment(segment);
}

export function parsePositionLabelAfterVerb(
    text: string,
    verb: string,
): { side: FightSide; index: number } | null {
    const segment = new RegExp(`\\b${verb}\\b([\\s\\S]*)$`, 'i').exec(text)?.[1] ?? '';
    const match = /\b([PO])([1-5])\b/i.exec(segment);
    if (!match) {
        return null;
    }

    return {
        side: match[1].toUpperCase() === 'O' ? 'opponent' : 'player',
        index: Number(match[2]),
    };
}

// ---------------------------------------------------------------------------
// Summon helpers
// ---------------------------------------------------------------------------

export function getSummonSegment(text: string): string {
    return /\b(?:summoned|spawned)\b([\s\S]*)$/i.exec(text)?.[1] ?? '';
}

export function parseSummonedPetName(
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

export function inferSummonedSide(text: string, sourceSide: FightSide): FightSide {
    if (/\b(?:for|on)\s+(?:the\s+)?(?:enemy|opponent)\b/i.test(text)) {
        return sourceSide === 'player' ? 'opponent' : 'player';
    }
    if (/\bfor\s+(?:the\s+)?player\b/i.test(text)) {
        return 'player';
    }
    return sourceSide;
}
