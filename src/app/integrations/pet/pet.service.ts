import { Injectable } from '@angular/core';
import { Pet } from 'app/domain/entities/pet.class';
import { LogService } from '../log.service';
import { PetFactoryService, PetForm } from './pet-factory.service';
import { Player } from 'app/domain/entities/player.class';
import { AbilityService } from '../ability/ability.service';
import { GameService } from 'app/runtime/state/game.service';
import { getRandomInt } from 'app/runtime/random';
import { FormArray } from '@angular/forms';
import { Mouse } from 'app/domain/entities/catalog/pets/custom/tier-1/mouse.class';
import { PET_REGISTRY } from './pet-registry';
import { BASE_PACK_NAMES, BasePackName, PackName } from 'app/runtime/pack-names';
import * as petJson from 'assets/data/pets.json';
import { chooseRandomOption } from 'app/runtime/random-decision-state';
import { CustomPackConfig } from 'app/domain/interfaces/simulation-config.interface';
import { coerceLogService } from 'app/runtime/log-service-fallback';

interface PetJsonEntry {
  Name: string;
  Tier: number | string;
  Packs?: string[];
  PacksRequired?: string[];
  Abilities?: Array<{ Level?: number; About?: string }>;
  Rollable?: boolean;
  Random?: boolean;
}

const MIN_TIER = 1;
const MAX_TIER = 6;
const ALL_TIERS = [1, 2, 3, 4, 5, 6] as const;
const RANDOM_PET_FALLBACK = 'Ant';

const PACK_CODE_TO_NAME: Record<string, PackName> = {
  Pack1: 'Turtle',
  Pack2: 'Puppy',
  Pack3: 'Star',
  Pack4: 'Golden',
  Pack5: 'Unicorn',
  Danger: 'Danger',
  Custom: 'Custom',
  MiniPack1: 'Custom',
  MiniPack2: 'Custom',
  MiniPack3: 'Custom',
};
@Injectable({
  providedIn: 'root',
})
export class PetService {
  turtlePackPets: Map<number, string[]> = new Map();
  puppyPackPets: Map<number, string[]> = new Map();
  starPackPets: Map<number, string[]> = new Map();
  goldenPackPets: Map<number, string[]> = new Map();
  unicornPackPets: Map<number, string[]> = new Map();
  customPackPets: Map<number, string[]> = new Map();
  dangerPackPets: Map<number, string[]> = new Map();
  playerCustomPackPets: Map<string, Map<number, string[]>> = new Map();
  allPets: Map<number, string[]> = new Map();
  tokenPetsMap: Map<number, string[]> = new Map();
  readonly basePackPetsByName: Record<PackName, Map<number, string[]>>;
  startOfBattlePets: string[] = [];
  faintPetsByTier: Map<number, string[]> = new Map();

  constructor(
    private logService: LogService,
    private abilityService: AbilityService,
    private gameService: GameService,
    private petFactory: PetFactoryService,
  ) {
    this.logService = coerceLogService(this.logService);
    this.basePackPetsByName = {
      Turtle: this.turtlePackPets,
      Puppy: this.puppyPackPets,
      Star: this.starPackPets,
      Golden: this.goldenPackPets,
      Unicorn: this.unicornPackPets,
      Danger: this.dangerPackPets,
      Custom: this.customPackPets,
    };
  }

  buildCustomPackPets(customPacks: FormArray) {
    for (let customPack of customPacks.controls) {
      let pack = new Map<number, string[]>();
      for (let i = 1; i <= 6; i++) {
        pack.set(i, customPack.get(`tier${i}Pets`).value);
      }
      this.playerCustomPackPets.set(customPack.get('name').value, pack);
    }
  }

  setCustomPackPools(customPacks: CustomPackConfig[] = []) {
    this.playerCustomPackPets.clear();
    for (const customPack of customPacks) {
      const packName = `${customPack?.name ?? ''}`.trim();
      if (!packName) {
        continue;
      }
      const pack = new Map<number, string[]>();
      for (const tier of ALL_TIERS) {
        const tierKey = `tier${tier}Pets` as keyof CustomPackConfig;
        const tierPets = customPack?.[tierKey];
        const normalized = this.normalizePetNameList(tierPets);
        pack.set(tier, normalized);
      }
      this.playerCustomPackPets.set(packName, pack);
    }
  }

  private normalizePetNameList(value: unknown): string[] {
    if (!Array.isArray(value)) {
      return [];
    }
    return value
      .filter((petName): petName is string => typeof petName === 'string')
      .map((petName) => petName.trim())
      .filter((petName) => petName.length > 0);
  }

  private isValidTier(value: number): boolean {
    return Number.isFinite(value) && value >= MIN_TIER && value <= MAX_TIER;
  }

  private getCustomPackTierPets(packName: string, tier: number): string[] {
    return [...(this.playerCustomPackPets.get(packName)?.get(tier) || [])];
  }

  private getBasePackTierPets(packName: BasePackName, tier: number): string[] {
    return [...(this.basePackPetsByName[packName]?.get(tier) || [])];
  }

  private resolveBasePackName(packName: string): BasePackName | null {
    switch (packName) {
      case 'Turtle':
      case 'Puppy':
      case 'Star':
      case 'Golden':
      case 'Unicorn':
      case 'Danger':
        return packName;
      default:
        return null;
    }
  }

  private getRandomPetPoolByTier(parent: Player, tier: number): string[] {
    if (parent.allPets) {
      return [...(this.allPets.get(tier) || [])];
    }

    const basePackName = this.resolveBasePackName(parent.pack);
    if (basePackName) {
      return this.getBasePackTierPets(basePackName, tier);
    }

    return this.getCustomPackTierPets(parent.pack, tier);
  }

  private resetPackMaps() {
    const tierMaps = [
      this.turtlePackPets,
      this.puppyPackPets,
      this.starPackPets,
      this.goldenPackPets,
      this.unicornPackPets,
      this.dangerPackPets,
      this.customPackPets,
      this.tokenPetsMap,
    ];
    for (const map of tierMaps) {
      map.clear();
      for (const tier of ALL_TIERS) {
        map.set(tier, []);
      }
    }
  }

  private getPetEntriesFromJson(): PetJsonEntry[] {
    const entries =
      (petJson as unknown as { default?: PetJsonEntry[] }).default ??
      (petJson as unknown as PetJsonEntry[]) ??
      [];
    return entries.filter((pet) => Boolean(pet?.Name));
  }


  isPetRandom(name: string): boolean {
    return this.petDataMap.get(name)?.Random === true;
  }

  private petDataMap: Map<string, PetJsonEntry> = new Map();

  private populatePackMaps(pets: PetJsonEntry[]) {
    for (const pet of pets) {
      if (pet.Name) {
        this.petDataMap.set(pet.Name, pet);
      }
      const tier = Number(pet.Tier);
      if (!this.isValidTier(tier)) {
        continue;
      }
      const hasNoAbility =
        Array.isArray(pet.Abilities) &&
        pet.Abilities.length > 0 &&
        pet.Abilities.every((ability) => ability?.About === 'No ability.');
      const isToken = pet.Rollable !== true || hasNoAbility;

      if (isToken) {
        this.tokenPetsMap.get(tier)?.push(pet.Name);
        continue;
      }

      for (const packName of this.getPackNamesFromEntry(pet)) {
        const tierMap = this.basePackPetsByName[packName];
        const tierPets = tierMap?.get(tier);
        if (tierPets) {
          tierPets.push(pet.Name);
        }
      }
    }
    for (const tierMap of Object.values(this.basePackPetsByName)) {
      this.deduplicateTierMap(tierMap);
    }
    this.deduplicateTierMap(this.tokenPetsMap);
  }

  private getPackNamesFromEntry(pet: PetJsonEntry): PackName[] {
    const codes = new Set<string>();
    const packCodes = new Set<string>();
    if (Array.isArray(pet.Packs)) {
      pet.Packs.forEach((code) => {
        if (code) {
          const trimmed = code.trim();
          codes.add(trimmed);
          packCodes.add(trimmed);
        }
      });
    }
    const hasCustomPack =
      packCodes.has('Custom') ||
      packCodes.has('MiniPack1') ||
      packCodes.has('MiniPack2') ||
      packCodes.has('MiniPack3');
    if (!hasCustomPack && Array.isArray(pet.PacksRequired)) {
      pet.PacksRequired.forEach((code) => {
        if (code) {
          codes.add(code.trim());
        }
      });
    }
    const packNames = new Set<PackName>();
    for (const code of codes) {
      const packName = PACK_CODE_TO_NAME[code];
      if (packName) {
        packNames.add(packName);
      }
    }
    return Array.from(packNames);
  }

  private deduplicateTierMap(map: Map<number, string[]>) {
    for (const [tier, pets] of map) {
      map.set(tier, [...new Set(pets)]);
    }
  }

  private buildStartOfBattlePets(pets: PetJsonEntry[]): string[] {
    const names = new Set<string>();
    for (const pet of pets) {
      if (!Array.isArray(pet.Abilities)) {
        continue;
      }
      if (
        pet.Abilities.some((ability) => {
          const about = ability?.About;
          return (
            typeof about === 'string' &&
            about.toLowerCase().includes('start of battle')
          );
        })
      ) {
        names.add(pet.Name);
      }
    }
    return Array.from(names);
  }

  private buildFaintPetsByTier(pets: PetJsonEntry[]): Map<number, string[]> {
    const faintMap = new Map<number, string[]>();
    for (const tier of ALL_TIERS) {
      faintMap.set(tier, []);
    }
    for (const pet of pets) {
      const tier = Number(pet.Tier);
      if (!this.isValidTier(tier)) {
        continue;
      }
      if (pet.Rollable !== true) {
        continue;
      }
      if (!Array.isArray(pet.Abilities)) {
        continue;
      }
      const hasFaintAbility = pet.Abilities.some((ability) => {
        const about = ability?.About;
        return typeof about === 'string' && about.includes('Faint:');
      });
      if (!hasFaintAbility) {
        continue;
      }
      faintMap.get(tier)?.push(pet.Name);
    }
    this.deduplicateTierMap(faintMap);
    return faintMap;
  }

  init() {
    this.resetPackMaps();
    const pets = this.getPetEntriesFromJson();
    this.populatePackMaps(pets);
    this.startOfBattlePets = this.buildStartOfBattlePets(pets);
    this.faintPetsByTier = this.buildFaintPetsByTier(pets);
    this.setAllPets();
  }

  setAllPets() {
    this.allPets = new Map();
    for (const tier of ALL_TIERS) {
      this.allPets.set(tier, []);
    }
    for (const packName of BASE_PACK_NAMES) {
      const packPets = this.basePackPetsByName[packName];
      for (let [tier, pets] of packPets) {
        this.allPets.get(tier).push(...pets);
      }
    }
    // remove duplicates from each tier
    for (let [tier, pets] of this.allPets) {
      this.allPets.set(tier, [...new Set(pets)]);
    }
  }

  createPet(petForm: PetForm, parent: Player): Pet {
    const result = this.petFactory.createPetFromForm(
      petForm,
      parent,
      this,
      PET_REGISTRY,
    );
    if (result) {
      return result;
    }
    const equipment = this.petFactory.resolveEquipmentFromForm(
      petForm.equipment,
      petForm.equipmentUses,
    );
    // Fallback
    return new Mouse(
      this.logService,
      this.abilityService,
      parent,
      petForm.health,
      petForm.attack,
      petForm.mana,
      petForm.exp,
      equipment,
      petForm.triggersConsumed,
    );
  }

  createDefaultVersionOfPet(
    pet: Pet,
    attack: number = null,
    health: number = null,
  ) {
    return this.petFactory.createPet(pet, this, attack, health);
  }

  getRandomPet(parent: Player) {
    const tierOptions = ALL_TIERS.map((value) => ({
      id: `tier-${value}`,
      label: `Tier ${value}`,
    }));
    const tierDecision = chooseRandomOption(
      {
        key: 'pet.random-tier',
        label: 'Random pet tier',
        options: tierOptions,
      },
      () => getRandomInt(0, tierOptions.length - 1),
    );
    let tier = tierDecision.index + 1;
    let pets = this.getRandomPetPoolByTier(parent, tier);

    if (parent.allPets && parent.tokenPets) {
      const tokens = this.tokenPetsMap.get(tier) || [];
      pets.push(...tokens);
      // Deduplicate in case some tokens are also in the pack (though unlikely)
      pets = [...new Set(pets)];
    }

    if (!pets || pets.length === 0) {
      // Fallback if tier has no pets in this configuration
      pets = [RANDOM_PET_FALLBACK]; // Very safe fallback
    }
    const petDecision = chooseRandomOption(
      {
        key: 'pet.random-pool',
        label: `Random pet from tier ${tier}`,
        options: pets.map((name) => ({ id: name, label: name })),
      },
      () => getRandomInt(0, pets.length - 1),
    );
    let pet = pets[petDecision.index];
    return this.createPet(
      {
        attack: null,
        equipment: null,
        exp: getRandomInt(0, 5),
        health: null,
        name: pet,
        mana: null,
      },
      parent,
    );
  }

  getRandomFaintPet(
    parent: Player,
    tier?: number,
    excludeNames: string[] = [],
    sourcePet?: Pet,
  ): Pet {
    if (!this.faintPetsByTier?.size) {
      this.faintPetsByTier = this.buildFaintPetsByTier(
        this.getPetEntriesFromJson(),
      );
    }

    let faintPets: string[] = [];
    if (tier && this.faintPetsByTier.get(tier)) {
      faintPets = this.faintPetsByTier.get(tier) ?? [];
    } else {
      // If no tier specified or invalid tier, use all faint pets
      faintPets = Array.from(this.faintPetsByTier.values()).flat();
    }

    const excludeSet = new Set(excludeNames.map((name) => name?.toLowerCase()));
    const filteredFaintPets = faintPets.filter(
      (name) => !excludeSet.has(name.toLowerCase()),
    );

    // Fallback to all tiers (still excluding) if tier-specific pool is exhausted
    let pool = filteredFaintPets;
    if (!pool.length && tier) {
      const allFiltered = Array.from(this.faintPetsByTier.values())
        .flat()
        .filter((name: string) => !excludeSet.has(name.toLowerCase()));
      if (allFiltered.length) {
        pool = allFiltered;
      }
    }

    // Final fallback to original list to avoid crashes if everything was excluded
    if (!pool.length) {
      pool = faintPets;
    }

    const decision = chooseRandomOption(
      {
        key: 'pet.random-faint-pet',
        label: `${this.describeRandomFaintPetOwner(parent, sourcePet)} -> Random faint pet summon`,
        options: pool.map((name) => ({ id: name, label: name })),
      },
      () => getRandomInt(0, pool.length - 1),
    );
    let petName = pool[decision.index];
    return this.createPet(
      {
        name: petName,
        attack: null,
        equipment: null,
        exp: 0,
        health: null,
        mana: null,
      },
      parent,
    );
  }

  private describeRandomFaintPetOwner(parent: Player, sourcePet?: Pet): string {
    const ownerSide = parent?.isOpponent ? 'opponent team' : 'player team';
    if (!sourcePet) {
      return ownerSide;
    }
    const sourceSide = sourcePet.parent?.isOpponent ? 'O' : 'P';
    const sourcePosition = Number.isFinite(sourcePet.savedPosition)
      ? sourcePet.savedPosition + 1
      : 0;
    return `${sourceSide}${sourcePosition} ${sourcePet.name} (owner: ${ownerSide})`;
  }
}






