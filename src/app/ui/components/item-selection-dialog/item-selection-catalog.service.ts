import { Injectable } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';
import { EquipmentService } from 'app/integrations/equipment/equipment.service';
import { PetService } from 'app/integrations/pet/pet.service';
import { TeamPreset } from 'app/integrations/team-presets.service';
import { ToyService } from 'app/integrations/toy/toy.service';
import {
  getEquipmentAbilityText,
  getEquipmentIconPath,
  getPackIconPath,
  getPetAbilityText,
  getPetIconPath,
  getToyAbilityText,
  getToyIconPath,
} from 'app/runtime/asset-catalog';
import { PACK_NAMES } from 'app/runtime/pack-names';
import { SelectionItem, SelectionType } from './item-selection-dialog.types';

export interface IndexedSelectionItem extends SelectionItem {
  searchName: string;
  searchDisplayName: string;
  triggerCategory: string;
}

export const PASSIVE_TRIGGER_CATEGORY = 'Passive';

export function extractTriggerCategory(tooltip?: string | null): string {
  if (!tooltip) {
    return PASSIVE_TRIGGER_CATEGORY;
  }

  const lines = tooltip
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  for (const line of lines) {
    const normalizedLine = line.replace(/^Lv\s*\d+\s*:\s*/i, '').trim();
    const triggerMatch = /^([^:]+):/.exec(normalizedLine);
    if (triggerMatch?.[1]) {
      return triggerMatch[1].trim();
    }
  }

  return PASSIVE_TRIGGER_CATEGORY;
}

export function compareTriggerCategories(left: string, right: string): number {
  if (left === right) {
    return 0;
  }
  if (left === PASSIVE_TRIGGER_CATEGORY) {
    return 1;
  }
  if (right === PASSIVE_TRIGGER_CATEGORY) {
    return -1;
  }
  return left.localeCompare(right);
}

export function getTriggerCategories(
  items: Array<Pick<IndexedSelectionItem, 'triggerCategory'>>,
): string[] {
  const categories = Array.from(
    new Set(
      items
        .map((item) => item.triggerCategory)
        .filter((category) => category.length > 0),
    ),
  );

  categories.sort(compareTriggerCategories);
  return categories;
}

export function sortItemsByTrigger<T extends IndexedSelectionItem>(
  items: T[],
): T[] {
  return [...items].sort((left, right) => {
    const categoryDiff = compareTriggerCategories(
      left.triggerCategory,
      right.triggerCategory,
    );
    if (categoryDiff !== 0) {
      return categoryDiff;
    }
    if ((left.tier ?? 0) !== (right.tier ?? 0)) {
      return (left.tier ?? 0) - (right.tier ?? 0);
    }
    return left.name.localeCompare(right.name);
  });
}

@Injectable({
  providedIn: 'root',
})
export class ItemSelectionCatalogService {
  private basePetItems: IndexedSelectionItem[] | null = null;
  private tokenItems: IndexedSelectionItem[] | null = null;
  private equipmentItems: IndexedSelectionItem[] | null = null;
  private toyItems: IndexedSelectionItem[] | null = null;
  private hardToyItems: IndexedSelectionItem[] | null = null;
  private abilityItems: IndexedSelectionItem[] | null = null;
  private customPetCache = new Map<string, IndexedSelectionItem[]>();
  private packCache = new Map<string, IndexedSelectionItem[]>();
  private teamCache = new Map<string, IndexedSelectionItem[]>();

  constructor(
    private petService: PetService,
    private equipmentService: EquipmentService,
    private toyService: ToyService,
  ) {}

  getItems(
    type: SelectionType,
    options?: {
      customPacks?: AbstractControl | null;
      savedTeams?: TeamPreset[];
    },
  ): IndexedSelectionItem[] {
    if (type === 'pet' || type === 'swallowed-pet') {
      return this.getPetItems(options?.customPacks ?? null);
    }
    if (type === 'equipment') {
      return this.getEquipmentItems();
    }
    if (type === 'toy') {
      return this.getToyItems(false);
    }
    if (type === 'hard-toy') {
      return this.getToyItems(true);
    }
    if (type === 'pack') {
      return this.getPackItems(options?.customPacks ?? null);
    }
    if (type === 'team') {
      return this.getTeamItems(options?.savedTeams ?? []);
    }
    return this.getAbilityItems();
  }

  getTokenItems(): IndexedSelectionItem[] {
    if (!this.tokenItems) {
      const tokenItems: IndexedSelectionItem[] = [];
      for (const [tier, pets] of this.petService.tokenPetsMap) {
        pets.forEach((name) => {
          tokenItems.push(
            this.indexItem({
              name,
              displayName: name,
              tier,
              pack: 'Tokens',
              icon: getPetIconPath(name),
              tooltip: getPetAbilityText(name),
              type: 'pet',
              category: 'Tokens',
            }),
          );
        });
      }
      this.tokenItems = this.sortItems(tokenItems, 'pet');
    }
    return this.tokenItems;
  }

  private getPetItems(customPacks: AbstractControl | null): IndexedSelectionItem[] {
    const customPackSnapshot = this.buildCustomPackSnapshot(customPacks);
    const cached = this.customPetCache.get(customPackSnapshot);
    if (cached) {
      return cached;
    }

    const allPets = [
      ...this.getBasePetItems(),
      ...this.buildCustomPackPetItems(customPacks),
      ...this.getTokenItems(),
    ];
    const deduped = this.deduplicateByName(allPets);
    const sorted = this.sortItems(deduped, 'pet');
    this.customPetCache.set(customPackSnapshot, sorted);
    return sorted;
  }

  private getBasePetItems(): IndexedSelectionItem[] {
    if (!this.basePetItems) {
      const basePets: IndexedSelectionItem[] = [];
      for (const pack of PACK_NAMES) {
        const packPets = this.petService.basePackPetsByName[pack];
        if (!packPets) {
          continue;
        }
        for (const [tier, pets] of packPets) {
          pets.forEach((name) => {
            basePets.push(
              this.indexItem({
                name,
                displayName: name,
                tier,
                pack,
                icon: getPetIconPath(name),
                tooltip: getPetAbilityText(name),
                type: 'pet',
                category: `Tier ${tier}`,
              }),
            );
          });
        }
      }
      this.basePetItems = this.sortItems(basePets, 'pet');
    }
    return this.basePetItems;
  }

  private buildCustomPackPetItems(
    customPacks: AbstractControl | null,
  ): IndexedSelectionItem[] {
    if (!(customPacks instanceof FormArray)) {
      return [];
    }

    const items: IndexedSelectionItem[] = [];
    for (const control of customPacks.controls) {
      const packName = control.get('name')?.value;
      if (!packName || !control.valid) {
        continue;
      }

      const customPackPets = this.petService.playerCustomPackPets.get(packName);
      if (!customPackPets) {
        continue;
      }

      for (const [tier, pets] of customPackPets) {
        pets.forEach((name) => {
          items.push(
            this.indexItem({
              name,
              displayName: name,
              tier,
              pack: packName,
              icon: getPetIconPath(name),
              tooltip: getPetAbilityText(name),
              type: 'pet',
              category: `Tier ${tier}`,
            }),
          );
        });
      }
    }
    return items;
  }

  private getEquipmentItems(): IndexedSelectionItem[] {
    if (!this.equipmentItems) {
      const items: IndexedSelectionItem[] = [];
      const equipmentMap = this.equipmentService.getInstanceOfAllEquipment();
      const ailmentMap = this.equipmentService.getInstanceOfAllAilments();

      equipmentMap.forEach((equipment, name) => {
        if (equipment?.name === 'Corncob' || equipment?.name === 'Mana Potion') {
          return;
        }
        items.push(
          this.indexItem({
            name,
            displayName: equipment.name,
            tier: equipment.tier || 0,
            icon: getEquipmentIconPath(equipment.name),
            tooltip: getEquipmentAbilityText(equipment.name),
            type: 'equipment',
            category: equipment.tier ? `Tier ${equipment.tier}` : 'Perks',
            item: equipment,
          }),
        );
      });

      ailmentMap.forEach((ailment, name) => {
        items.push(
          this.indexItem({
            name,
            displayName: ailment.name,
            tier: 0,
            icon: getEquipmentIconPath(ailment.name, true),
            tooltip: getEquipmentAbilityText(ailment.name),
            type: 'ailment',
            category: 'Ailments',
            item: ailment,
          }),
        );
      });

      this.equipmentItems = this.sortItems(items, 'equipment');
    }
    return this.equipmentItems;
  }

  private getToyItems(isHard: boolean): IndexedSelectionItem[] {
    const cached = isHard ? this.hardToyItems : this.toyItems;
    if (cached) {
      return cached;
    }

    const items: IndexedSelectionItem[] = [];
    const toyMap = this.toyService.getToysByType(isHard ? 1 : 0);
    toyMap.forEach((toyNames, tier) => {
      toyNames.forEach((name) => {
        items.push(
          this.indexItem({
            name,
            displayName: name,
            tier,
            icon: getToyIconPath(name),
            tooltip: getToyAbilityText(name),
            type: isHard ? 'hard-toy' : 'toy',
            category: `Tier ${tier}`,
            item: name,
          }),
        );
      });
    });

    const sorted = this.sortItems(items, isHard ? 'hard-toy' : 'toy');
    if (isHard) {
      this.hardToyItems = sorted;
    } else {
      this.toyItems = sorted;
    }
    return sorted;
  }

  private getPackItems(customPacks: AbstractControl | null): IndexedSelectionItem[] {
    const snapshot = this.buildCustomPackSnapshot(customPacks);
    const cached = this.packCache.get(snapshot);
    if (cached) {
      return cached;
    }

    const items: IndexedSelectionItem[] = [];
    for (const name of PACK_NAMES) {
      if (name === 'Custom') {
        continue;
      }
      items.push(
        this.indexItem({
          name,
          displayName: name,
          tier: 0,
          icon: getPackIconPath(name),
          type: 'pack',
          category: 'Packs',
        }),
      );
    }

    if (customPacks instanceof FormArray) {
      for (const control of customPacks.controls) {
        const packName = control.get('name')?.value;
        if (!packName || !control.valid) {
          continue;
        }
        const firstPet = this.getFirstCustomPackPet(control);
        items.push(
          this.indexItem({
            name: packName,
            displayName: packName,
            tier: 0,
            icon: firstPet ? getPetIconPath(firstPet) : getPackIconPath(packName),
            type: 'pack',
            category: 'Custom Packs',
          }),
        );
      }
    }

    items.push(
      this.indexItem({
        name: 'Add Custom Pack',
        displayName: '+ Add Custom Pack',
        tier: 0,
        icon: getPetIconPath('White Tiger'),
        type: 'pack',
        category: 'Custom Packs',
      }),
    );

    const sorted = this.sortItems(items, 'pack');
    this.packCache.set(snapshot, sorted);
    return sorted;
  }

  private getTeamItems(savedTeams: TeamPreset[]): IndexedSelectionItem[] {
    const snapshot = JSON.stringify(
      savedTeams.map((team) => ({
        id: team.id,
        name: team.name,
        pets: (team.pets || []).map((pet) => pet?.name ?? null),
      })),
    );
    const cached = this.teamCache.get(snapshot);
    if (cached) {
      return cached;
    }

    const items = savedTeams.map<IndexedSelectionItem>((team) => {
      const petNames = (team.pets || [])
        .map((pet) => pet?.name)
        .filter((petName): petName is string => Boolean(petName))
        .slice(0, 5);
      return this.indexItem({
        id: team.id,
        name: team.name,
        displayName: team.name,
        tier: 0,
        icon: null,
        icons: petNames.map((name) => getPetIconPath(name)).filter(
          (icon): icon is string => Boolean(icon),
        ),
        tooltip: petNames.join(', '),
        type: 'team',
        category: 'Saved Teams',
      });
    });

    const sorted = this.sortItems(items, 'team');
    this.teamCache.set(snapshot, sorted);
    return sorted;
  }

  private getAbilityItems(): IndexedSelectionItem[] {
    if (!this.abilityItems) {
      const petItems = this.deduplicateByName([
        ...this.getBasePetItems(),
        ...this.getTokenItems(),
      ]);
      const equipmentItems = this.getEquipmentItems().map((item) =>
        this.indexItem({
          ...item,
          isDisabled: true,
          category:
            item.type === 'ailment' ? 'Ailments' : item.category ?? 'Equipment',
        }),
      );
      const toyItems = [...this.getToyItems(false), ...this.getToyItems(true)].map(
        (item) =>
          this.indexItem({
            ...item,
            isDisabled: true,
            category:
              item.type === 'hard-toy'
                ? `Hard Toy Tier ${item.tier}`
                : `Toy Tier ${item.tier}`,
          }),
      );

      this.abilityItems = this.sortItems(
        [...petItems, ...equipmentItems, ...toyItems],
        'ability',
      );
    }
    return this.abilityItems;
  }

  private indexItem(item: SelectionItem): IndexedSelectionItem {
    return {
      ...item,
      searchName: item.name.toLowerCase(),
      searchDisplayName: (item.displayName ?? item.name).toLowerCase(),
      triggerCategory: extractTriggerCategory(item.tooltip),
    };
  }

  private sortItems(
    items: IndexedSelectionItem[],
    type: SelectionType,
  ): IndexedSelectionItem[] {
    return [...items].sort((left, right) => {
      if (type === 'ability') {
        const abilityGroupOrder = (item: IndexedSelectionItem): number => {
          if (item.type === 'pet') {
            return 0;
          }
          if (item.type === 'equipment' || item.type === 'ailment') {
            return 1;
          }
          return 2;
        };
        const groupDiff = abilityGroupOrder(left) - abilityGroupOrder(right);
        if (groupDiff !== 0) {
          return groupDiff;
        }
      }

      if (left.category === 'Ailments' && right.category !== 'Ailments') {
        return 1;
      }
      if (left.category !== 'Ailments' && right.category === 'Ailments') {
        return -1;
      }

      if ((left.category ?? '') !== (right.category ?? '')) {
        return (left.category ?? '').localeCompare(right.category ?? '');
      }
      if ((left.tier ?? 0) !== (right.tier ?? 0)) {
        return (left.tier ?? 0) - (right.tier ?? 0);
      }
      return left.name.localeCompare(right.name);
    });
  }

  private deduplicateByName(
    items: IndexedSelectionItem[],
  ): IndexedSelectionItem[] {
    const byName = new Map<string, IndexedSelectionItem>();
    items.forEach((item) => {
      const existing = byName.get(item.name);
      if (!existing) {
        byName.set(item.name, item);
        return;
      }

      const existingIsToken = existing.pack === 'Tokens';
      const incomingIsToken = item.pack === 'Tokens';
      if (existingIsToken && !incomingIsToken) {
        byName.set(item.name, item);
      }
    });
    return Array.from(byName.values());
  }

  private buildCustomPackSnapshot(customPacks: AbstractControl | null): string {
    if (!(customPacks instanceof FormArray)) {
      return 'no-custom-packs';
    }

    return JSON.stringify(
      customPacks.controls.map((control) => ({
        valid: control.valid,
        name: control.get('name')?.value ?? null,
        tier1Pets: control.get('tier1Pets')?.value ?? [],
        tier2Pets: control.get('tier2Pets')?.value ?? [],
        tier3Pets: control.get('tier3Pets')?.value ?? [],
        tier4Pets: control.get('tier4Pets')?.value ?? [],
        tier5Pets: control.get('tier5Pets')?.value ?? [],
        tier6Pets: control.get('tier6Pets')?.value ?? [],
      })),
    );
  }

  private getFirstCustomPackPet(control: AbstractControl): string | null {
    for (let tier = 1; tier <= 6; tier += 1) {
      const pets = control.get(`tier${tier}Pets`)?.value;
      if (!Array.isArray(pets)) {
        continue;
      }
      const firstPet = pets.find(
        (petName): petName is string =>
          typeof petName === 'string' && petName.length > 0,
      );
      if (firstPet) {
        return firstPet;
      }
    }
    return null;
  }
}
