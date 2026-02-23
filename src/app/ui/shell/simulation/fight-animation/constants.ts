export const SIDE_TOKEN_REGEX =
    /___ \(-\/-\)|(?:[PO]\d+\s+)?(?:<img\b[^>]*>\s*)*\(\d+\/\d+(?:\/\d+(?:\s*xp)?)?(?:\/\d+(?:\s*mana)?)?\)/gi;
export const IMAGE_TAG_REGEX = /<img\b[^>]*>/gi;
export const PLAYER_FALLBACK_ORDER = [4, 3, 2, 1, 0];
export const OPPONENT_FALLBACK_ORDER = [0, 1, 2, 3, 4];
export const ATTACK_REGEX =
    /^(.+?)\s+(?:jump-)?attacks?\s+(.+?)\s+for\s+(\d+)/i;
export const SNIPE_REGEX = /^(.+?)\s+sniped\s+(.+?)\s+for\s+(\d+)/i;
export const FAINT_REGEX = /^(.+?)\s+fainted\./i;
export const SUBJECT_REGEX =
    /^(.+?)\s+(?:attacks?|sniped|fainted|gave|gained|lost|removed|transformed|destroyed|consumed|moved)\b/i;
export const TO_SEGMENT_REGEX = /\bto\s+(.+?)(?:\.|$)/i;
export const TRANSFORM_TARGET_REGEX = /\btransformed\s+(.+?)\s+into\b/i;
export const TRANSFORM_INTO_SEGMENT_REGEX = /\binto\b([\s\S]*)$/i;
export const INLINE_STATS_REGEX =
    /(\d+)\s*\/\s*(\d+)(?:\s*\/\s*(\d+)(?:\s*xp)?)?(?:\s*\/\s*(\d+)(?:\s*mana)?)?/i;
export const POSSESSIVE_SPLIT_REGEX = /\s*(?:'|\u2019)s\s+/i;
