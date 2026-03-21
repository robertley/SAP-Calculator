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
import {
  ABILITY_PRIORITIES,
  ATTACK_TRIGGERS,
  IN_SHOP_TRIGGERS,
  PHASE_TRIGGERS,
} from 'app/integrations/ability/ability-priorities';
import { SelectionItem, SelectionType } from './item-selection-dialog.types';

export interface IndexedSelectionItem extends SelectionItem {
  searchName: string;
  searchDisplayName: string;
  triggerCategory: string;
}

export interface TriggerCategoryGroup {
  label: string;
  categories: string[];
}

export type TriggerFilterEntry =
  | {
      type: 'single';
      category: string;
    }
  | {
      type: 'group';
      label: string;
      categories: string[];
    };

export const PASSIVE_TRIGGER_CATEGORY = 'Passive';

interface TriggerGroupDefinition {
  label: string;
  triggers: readonly string[];
}

const phaseTriggers = [...PHASE_TRIGGERS];
const attackTriggers = [...ATTACK_TRIGGERS];
const inShopTriggers = [...IN_SHOP_TRIGGERS];
const phaseTriggerKeys = new Set(phaseTriggers.map((trigger) => normalizeTriggerKey(trigger)));
const attackTriggerKeys = new Set(attackTriggers.map((trigger) => normalizeTriggerKey(trigger)));
const inShopTriggerKeys = new Set(inShopTriggers.map((trigger) => normalizeTriggerKey(trigger)));
const reservedNonPriorityTriggerKeys = new Set<string>([
  ...phaseTriggerKeys,
  ...attackTriggerKeys,
  ...inShopTriggerKeys,
]);
const regularPriorityTriggers = Object.entries(ABILITY_PRIORITIES)
  .sort((left, right) => left[1] - right[1])
  .map(([trigger]) => trigger)
  .filter((trigger) => !reservedNonPriorityTriggerKeys.has(normalizeTriggerKey(trigger)));

const attackTriggerGroups: ReadonlyArray<TriggerGroupDefinition> = [
  {
    label: 'Pre-Attack Triggers',
    triggers: [
      'BeforeFriendlyAttack',
      'BeforeThisAttacks',
      'BeforeFirstAttack',
      'BeforeFriendAttacks',
      'BeforeAdjacentFriendAttacked',
    ],
  },
  {
    label: 'Attack Result Triggers',
    triggers: [
      'AnyoneAttack',
      'EnemyAttacked',
      'EnemyAttacked2',
      'EnemyAttacked5',
      'EnemyAttacked7',
      'EnemyAttacked8',
      'FriendlyAttacked',
      'FriendlyAttacked5',
      'FriendAttacked',
      'FriendAheadAttacked',
      'AdjacentFriendAttacked',
      'ThisAttacked',
      'ThisFirstAttack',
    ],
  },
];

const priorityTriggerGroups: ReadonlyArray<TriggerGroupDefinition> = [
  {
    label: 'Level Up Events',
    triggers: [
      'ThisLeveledUp',
      'FriendLeveledUp',
      'FriendlyLeveledUp',
    ],
  },
  {
    label: 'Hurt Events',
    triggers: [
      'ThisHurt',
      'FriendHurt',
      'EnemyHurt',
      'AnyoneHurt',
      'FriendAheadHurt',
      'AnyoneBehindHurt',
    ],
  },
  {
    label: 'Mana Events',
    triggers: ['ThisGainedMana'],
  },
  {
    label: 'Summon Events',
    triggers: [
      'ThisSummoned',
      'FriendSummoned',
      'EnemySummoned',
      'BeeSummoned',
    ],
  },
  {
    label: 'Movement Events',
    triggers: [
      'EnemyPushed',
      'FriendJumped',
      'AnyoneJumped',
    ],
  },
  {
    label: 'Pre-Removal Faint Events',
    triggers: [
      'Faint',
      'FriendAheadFainted',
      'FriendFaints',
      'EnemyFaint',
    ],
  },
  {
    label: 'Kill Events',
    triggers: ['KnockOut'],
  },
  {
    label: 'Transform Events',
    triggers: [
      'ThisTransformed',
      'FriendTransformed',
    ],
  },
  {
    label: 'Experience Events',
    triggers: ['FriendGainedExp'],
  },
  {
    label: 'Food Events',
    triggers: [
      'FoodEatenByThis',
      'FoodEatenByFriendly',
      'AppleEatenByThis',
      'CornEatenByFriend',
    ],
  },
  {
    label: 'Counter Events',
    triggers: ['CounterEvent'],
  },
  {
    label: 'Lost Perk Events',
    triggers: [
      'FriendLostPerk',
      'PetLostPerk',
    ],
  },
  {
    label: 'Gained Perk Events',
    triggers: [
      'ThisGainedPerk',
      'FriendlyGainsPerk',
      'FriendlyGainedStrawberry',
    ],
  },
  {
    label: 'Ailment Events',
    triggers: [
      'ThisGainedAilment',
      'FriendGainsAilment',
      'EnemyGainedAilment',
      'AnyoneGainedAilment',
    ],
  },
  {
    label: 'Fling Events',
    triggers: ['AnyoneFlung'],
  },
  {
    label: 'Mana Snipe',
    triggers: ['ManaSnipe'],
  },
  {
    label: 'Post-Removal Events',
    triggers: [
      'PostRemovalFaint',
      'PostRemovalFriendFaints',
      'FriendlyToyBroke',
    ],
  },
  {
    label: 'Board Cleanup',
    triggers: ['EmptyFrontSpace'],
  },
  {
    label: 'Special Summons',
    triggers: ['GoldenRetrieverSummons'],
  },
];

const inShopTriggerGroups: ReadonlyArray<TriggerGroupDefinition> = [
  {
    label: 'Shop Flow',
    triggers: [
      'ShopUpgrade',
      'StartTurn',
      'SpecialEndTurn',
      'Roll',
      'Roll3',
      'EndTurn',
    ],
  },
  {
    label: 'Shop Buy/Sell',
    triggers: [
      'ThisSold',
      'ThisBought',
      'FriendSold',
      'FriendBought',
      'Tier1FriendBought',
      'SpendGold',
      'SpendGold7',
    ],
  },
  {
    label: 'Shop Food',
    triggers: [
      'FoodBought',
      'Eat',
      'Eat2',
    ],
  },
];

const groupedTriggerDefinitions = [
  ...buildOrderedTriggerGroups(phaseTriggers, [
    {
      label: 'Battle Phases',
      triggers: phaseTriggers,
    },
  ]),
  ...buildOrderedTriggerGroups(attackTriggers, attackTriggerGroups),
  ...buildOrderedTriggerGroups(regularPriorityTriggers, priorityTriggerGroups),
  ...buildOrderedTriggerGroups(inShopTriggers, inShopTriggerGroups),
];

const battlePhaseOrder = buildTriggerIndexMap(phaseTriggers);
const attackTriggerOrder = buildTriggerIndexMap(attackTriggers);
const priorityTriggerOrder = buildTriggerIndexMap(regularPriorityTriggers);
const shopTriggerOrder = buildTriggerIndexMap(inShopTriggers);
const triggerGroupByKey = buildTriggerGroupByKey();
const triggerKeyAliases = new Map<string, string>([
  ['beforebattle', normalizeTriggerKey('BeforeStartBattle')],
  ['beforestartofbattle', normalizeTriggerKey('BeforeStartBattle')],
  ['startofbattle', normalizeTriggerKey('StartBattle')],
  ['startbattle', normalizeTriggerKey('StartBattle')],
  ['startofturn', normalizeTriggerKey('StartTurn')],
  ['beforeattack', normalizeTriggerKey('BeforeThisAttacks')],
  ['beforeattacks', normalizeTriggerKey('BeforeThisAttacks')],
  ['attack', normalizeTriggerKey('ThisAttacked')],
  ['attacks', normalizeTriggerKey('ThisAttacked')],
  ['friendlyattack', normalizeTriggerKey('FriendlyAttacked')],
  ['friendlyattacks', normalizeTriggerKey('FriendlyAttacked')],
  ['friendattack', normalizeTriggerKey('FriendAttacked')],
  ['friendattacks', normalizeTriggerKey('FriendAttacked')],
  ['enemyattack', normalizeTriggerKey('EnemyAttacked')],
  ['enemyattacks', normalizeTriggerKey('EnemyAttacked')],
  ['enemyfaints', normalizeTriggerKey('EnemyFaint')],
  ['enemyfainted', normalizeTriggerKey('EnemyFaint')],
  ['friendfaints', normalizeTriggerKey('FriendFaints')],
  ['friendfainted', normalizeTriggerKey('FriendFaints')],
  ['hurt', normalizeTriggerKey('ThisHurt')],
  ['knockout', normalizeTriggerKey('KnockOut')],
  ['break', normalizeTriggerKey('FriendlyToyBroke')],
]);

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
      return normalizeTriggerLabel(triggerMatch[1]);
    }
  }

  return PASSIVE_TRIGGER_CATEGORY;
}

export function compareTriggerCategories(left: string, right: string): number {
  if (left === right) {
    return 0;
  }
  const leftRank = getTriggerSortRank(left);
  const rightRank = getTriggerSortRank(right);
  if (leftRank.block !== rightRank.block) {
    return leftRank.block - rightRank.block;
  }
  if (leftRank.index !== rightRank.index) {
    return leftRank.index - rightRank.index;
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

export function getGroupedTriggerCategories(
  items: Array<Pick<IndexedSelectionItem, 'triggerCategory'>>,
): TriggerCategoryGroup[] {
  const categories = getTriggerCategories(items);
  const groups = new Map<string, string[]>();

  categories.forEach((category) => {
    const groupLabel = resolveTriggerGroupLabel(category);
    const existing = groups.get(groupLabel);
    if (existing) {
      existing.push(category);
      return;
    }
    groups.set(groupLabel, [category]);
  });

  return Array.from(groups.entries()).map(([label, groupedCategories]) => ({
      label,
      categories: groupedCategories,
    }));
}

export function getTriggerFilterEntries(
  items: Array<Pick<IndexedSelectionItem, 'triggerCategory'>>,
): TriggerFilterEntry[] {
  return getGroupedTriggerCategories(items).map((group) => {
    if (group.categories.length === 1) {
      return {
        type: 'single',
        category: group.categories[0],
      };
    }

    return {
      type: 'group',
      label: group.label,
      categories: group.categories,
    };
  });
}

export function sortItemsByTrigger<T extends IndexedSelectionItem>(items: T[]): T[] {
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

function buildTriggerIndexMap(triggers: readonly string[]): Map<string, number> {
  const order = new Map<string, number>();
  triggers.forEach((trigger, index) => {
    const normalizedKey = normalizeTriggerKey(trigger);
    if (!order.has(normalizedKey)) {
      order.set(normalizedKey, index);
    }
  });
  return order;
}

function buildTriggerGroupByKey(): Map<string, string> {
  const groups = new Map<string, string>();
  groupedTriggerDefinitions.forEach((group) => {
    group.triggers.forEach((trigger) => {
      const key = normalizeTriggerKey(trigger);
      if (!groups.has(key)) {
        groups.set(key, group.label);
      }
    });
  });
  return groups;
}

function buildOrderedTriggerGroups(
  orderedTriggers: readonly string[],
  groupDefinitions: ReadonlyArray<TriggerGroupDefinition>,
): TriggerGroupDefinition[] {
  const groupedTriggers = new Map<string, string[]>();
  const groupByKey = new Map<string, string>();

  groupDefinitions.forEach((group) => {
    group.triggers.forEach((trigger) => {
      groupByKey.set(normalizeTriggerKey(trigger), group.label);
    });
  });

  orderedTriggers.forEach((trigger) => {
    const normalizedKey = normalizeTriggerKey(trigger);
    const groupLabel = groupByKey.get(normalizedKey);
    if (!groupLabel) {
      return;
    }

    const existing = groupedTriggers.get(groupLabel);
    if (existing) {
      existing.push(trigger);
      return;
    }
    groupedTriggers.set(groupLabel, [trigger]);
  });

  return groupDefinitions
    .map((group) => ({
      label: group.label,
      triggers: groupedTriggers.get(group.label) ?? [],
    }))
    .filter((group) => group.triggers.length > 0);
}

function normalizeTriggerLabel(label: string): string {
  const trimmedLabel = label.trim();
  if (!trimmedLabel) {
    return PASSIVE_TRIGGER_CATEGORY;
  }

  const withoutNumberSuffix = trimmedLabel.replace(/\s*\d+\s*$/, '').trim();
  const humanizedLabel = withoutNumberSuffix.includes(' ')
    ? withoutNumberSuffix
    : withoutNumberSuffix
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');

  return humanizedLabel || PASSIVE_TRIGGER_CATEGORY;
}

function resolveTriggerSortKey(triggerLabel: string): string {
  const normalizedKey = normalizeTriggerKey(triggerLabel);
  return triggerKeyAliases.get(normalizedKey) ?? normalizedKey;
}

function getTriggerSortRank(triggerLabel: string): { block: number; index: number } {
  if (triggerLabel === PASSIVE_TRIGGER_CATEGORY) {
    return { block: 4, index: 0 };
  }

  const triggerKey = resolveTriggerSortKey(triggerLabel);
  const battlePhaseIndex = battlePhaseOrder.get(triggerKey);
  if (battlePhaseIndex != null) {
    return { block: 0, index: battlePhaseIndex };
  }

  const attackIndex = attackTriggerOrder.get(triggerKey);
  if (attackIndex != null) {
    return { block: 1, index: attackIndex };
  }

  const priorityIndex = priorityTriggerOrder.get(triggerKey);
  if (priorityIndex != null) {
    return { block: 2, index: priorityIndex };
  }

  const shopIndex = shopTriggerOrder.get(triggerKey);
  if (shopIndex != null) {
    return { block: 5, index: shopIndex };
  }

  return { block: 3, index: Number.MAX_SAFE_INTEGER };
}

export function resolveTriggerGroupLabel(triggerLabel: string): string {
  if (triggerLabel === PASSIVE_TRIGGER_CATEGORY) {
    return PASSIVE_TRIGGER_CATEGORY;
  }

  const groupLabel = triggerGroupByKey.get(resolveTriggerSortKey(triggerLabel));
  return groupLabel ?? triggerLabel;
}

function normalizeTriggerKey(value: string): string {
  return value
    .trim()
    .replace(/\d+$/, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();
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
