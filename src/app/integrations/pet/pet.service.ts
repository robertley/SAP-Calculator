import { Injectable } from '@angular/core';
import { Pet } from 'app/domain/entities/pet.class';
import { PetForm } from './pet-form.interface';
import { EquipmentService } from '../equipment/equipment.service';
import { cloneEquipmentWithUses } from 'app/runtime/equipment-clone';
import { Player } from 'app/domain/entities/player.class';
import { getRandomInt } from 'app/runtime/random';
import { FormArray } from '@angular/forms';
import { BASE_PACK_NAMES, BasePackName, PackName } from 'app/runtime/pack-names';
import { pets as petJson } from 'app/runtime/content-catalogs';

interface PetJsonEntry {
  Attack?: number;
  Health?: number;
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

  constructor(private equipmentService: EquipmentService) {
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

  getPetPoolByTier(parent: Player, tier: number): string[] {
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


  private populatePackMaps(pets: PetJsonEntry[]) {
    for (const pet of pets) {
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

  init() {
    this.resetPackMaps();
    const pets = this.getPetEntriesFromJson();
    this.populatePackMaps(pets);
    this.startOfBattlePets = this.buildStartOfBattlePets(pets);
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
    const metadata = this.getPetEntriesFromJson().find((entry) => entry.Name === petForm.name);
    const pet = Object.assign(new Pet(), petForm, { parent });
    pet.exp = petForm.exp ?? 0;
    pet.attack = petForm.attack ?? (metadata?.Attack ?? 1) + pet.exp;
    pet.health = petForm.health ?? (metadata?.Health ?? 1) + pet.exp;
    pet.mana = petForm.mana ?? 0;
    pet.tier = Number(metadata?.Tier ?? 1);
    const name = typeof petForm.equipment === 'string' ? petForm.equipment : petForm.equipment?.name;
    pet.equipment = cloneEquipmentWithUses(
      this.equipmentService.getInstanceOfAllEquipment().get(name) ?? this.equipmentService.getInstanceOfAllAilments().get(name),
      petForm.equipmentUses,
    );
    pet.equipmentUsesOverride = petForm.equipmentUses;
    return pet;
  }

  getRandomPet(parent: Player): Pet {
    const tier = getRandomInt(1, 6);
    const pool = this.getPetPoolByTier(parent, tier);
    if (parent.allPets && parent.tokenPets) pool.push(...(this.tokenPetsMap.get(tier) ?? []));
    const names = [...new Set(pool)];
    return this.createPet({ name: names[getRandomInt(0, names.length - 1)] ?? 'Ant', exp: getRandomInt(0, 5) }, parent);
  }
}
