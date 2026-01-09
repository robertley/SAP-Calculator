export function levelToExp(level: number): number {
    return level === 1 ? 0 : level === 2 ? 2 : 5;
}

export function minExpForLevel(level: number): number {
    return levelToExp(level);
}
