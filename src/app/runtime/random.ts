export function shuffle<T>(items: T[]): T[] {
  let remainingItemCount = items.length;
  let swapIndex: number;

  while (remainingItemCount !== 0) {
    swapIndex = Math.floor(Math.random() * remainingItemCount);
    remainingItemCount--;
    [items[remainingItemCount], items[swapIndex]] = [
      items[swapIndex],
      items[remainingItemCount],
    ];
  }

  return items;
}

export function getRandomInt(min: number, max: number): number {
  const minInt = Math.ceil(min);
  const maxInt = Math.floor(max);
  return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
}

export function getRandomFloat(): number {
  return Math.random();
}

export function chance(probability: number): boolean {
  return getRandomFloat() < probability;
}
