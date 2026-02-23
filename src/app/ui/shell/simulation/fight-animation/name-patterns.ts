import { AILMENT_CATEGORIES } from 'app/integrations/equipment/equipment-categories';
import {
    getAllEquipmentNames,
    getAllPetNames,
} from 'app/runtime/asset-catalog';
import { NamePatternSet } from './types';

export function buildNamePatternSet(names: string[]): NamePatternSet {
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

export function extractKnownNames(text: string, patternSet: NamePatternSet): string[] {
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

export function escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const ailmentNames = new Set(
    Object.values(AILMENT_CATEGORIES).flat().filter(Boolean),
);
export const petPatterns = buildNamePatternSet(getAllPetNames());
export const equipmentPatterns = buildNamePatternSet(getAllEquipmentNames());
