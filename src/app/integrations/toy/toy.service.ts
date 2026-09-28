import { Injectable } from '@angular/core';
import { Player } from 'app/domain/entities/player.class';
import { Toy } from 'app/domain/entities/toy.class';
import { toys as toysJson } from 'app/runtime/content-catalogs';

interface ToyJsonEntry {
  Name: string;
  Tier: number | string;
  NameId?: string;
  ToyType?: number | string;
  Random?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ToyService {
  toys: Map<number, string[]> = new Map();
  private toysByType: Map<number, Map<number, string[]>> = new Map();
  private toyNameIds: Map<string, string> = new Map();

  constructor() { this.setToys(); }

  setToys() {
    this.toys.clear();
    this.toyNameIds.clear();
    this.toysByType.clear();
    const toyEntries = this.getToyEntriesFromJson();
    for (const toy of toyEntries) {
      const tier = Number(toy.Tier);
      if (!Number.isFinite(tier) || tier < 1) {
        continue;
      }
      if (!this.toys.has(tier)) {
        this.toys.set(tier, []);
      }
      const tierList = this.toys.get(tier);
      if (tierList) {
        tierList.push(toy.Name);
      }
      const toyType = Number.isFinite(Number(toy.ToyType))
        ? Number(toy.ToyType)
        : 0;
      if (!this.toysByType.has(toyType)) {
        this.toysByType.set(toyType, new Map());
      }
      const typeMap = this.toysByType.get(toyType);
      if (typeMap && !typeMap.has(tier)) {
        typeMap.set(tier, []);
      }
      const typeTierList = typeMap?.get(tier);
      if (typeTierList) {
        typeTierList.push(toy.Name);
      }
      if (toy.Name && toy.NameId) {
        this.toyNameIds.set(toy.Name, toy.NameId);
      }
    }
    for (const [tier, toyNames] of this.toys) {
      this.toys.set(tier, [...new Set(toyNames)]);
    }
    for (const [toyType, tierMap] of this.toysByType) {
      for (const [tier, toyNames] of tierMap) {
        tierMap.set(tier, [...new Set(toyNames)]);
      }
    }
  }

  getToyNameId(toyName: string): string | null {
    if (!toyName) {
      return null;
    }
    return this.toyNameIds.get(toyName) ?? null;
  }

  getToysByType(toyType: number): Map<number, string[]> {
    const tierMap = this.toysByType.get(toyType);
    if (!tierMap) {
      return new Map();
    }
    return new Map(
      Array.from(tierMap.entries()).map(([tier, names]) => [tier, [...names]]),
    );
  }

  isToyRandom(name: string): boolean {
    return this.toyDataMap.get(name)?.Random === true;
  }

  private toyDataMap: Map<string, ToyJsonEntry> = new Map();

  private getToyEntriesFromJson(): ToyJsonEntry[] {
    const entries =
      (toysJson as unknown as { default?: ToyJsonEntry[] }).default ??
      (toysJson as unknown as ToyJsonEntry[]) ??
      [];
    entries.forEach((toy) => {
      if (toy.Name) {
        this.toyDataMap.set(toy.Name, toy);
      }
    });
    return entries.filter((toy) => Boolean(toy?.Name));
  }

  createToy(toyName: string, _parent: Player, level = 1): Toy | null {
    return this.toyDataMap.has(toyName) ? { name: toyName, level } : null;
  }
}
