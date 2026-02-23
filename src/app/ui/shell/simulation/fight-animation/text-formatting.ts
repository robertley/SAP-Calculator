import { Log } from 'app/domain/interfaces/log.interface';
import { FightSide } from './types';
import { getLogPrimarySide, getLogTargetSide } from './slot-resolver';

export function normalizePositionBracketSpacing(message: string): string {
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

export function addPositionPrefix(text: string, log: Log): string {
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

export function formatPositionLabel(
    side: FightSide | null,
    index: number | null | undefined,
): string | null {
    if (side == null || index == null || !Number.isFinite(index)) {
        return null;
    }
    const slot = Math.min(Math.max(1, Math.trunc(index)), 5);
    return `${side === 'player' ? 'P' : 'O'}${slot}`;
}
