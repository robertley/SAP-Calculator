import {
  Directive,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormGroup,
  AbstractControl,
  FormArray,
} from '@angular/forms';
import { Player } from 'app/domain/entities/player.class';
import { Pet } from 'app/domain/entities/pet.class';
import { PetService } from 'app/integrations/pet/pet.service';
import { EquipmentService } from 'app/integrations/equipment/equipment.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Subject, Subscription } from 'rxjs';
import { BASE_PACK_NAMES } from 'app/runtime/pack-names';
import {
  SwallowedPetTarget,
  TOKEN_PETS,
} from './pet-selector.constants';

@Directive()
export class PetSelectorPackFiltering {
  @Input()
  pet: Pet;
  @Input()
  player: Player;
  @Input()
  opponent: Player;
  @Input()
  index: number;
  @Input()
  ailments: boolean;
  @Input()
  allPets: boolean;
  @Input()
  mana: boolean;
  @Input()
  triggersConsumed: boolean;
  @Input()
  formGroup: FormGroup;
  @Input()
  customPacks: AbstractControl;
  @Input()
  flipImage = false;
  @Input()
  allowEquipmentUseOverrides: boolean;

  equipment: Map<string, Equipment>;
  ailmentEquipment: Map<string, Equipment>;
  equipmentCategoryGroups: Array<{ label: string; items: Equipment[] }> = [];
  ailmentCategoryGroups: Array<{ label: string; items: Equipment[] }> = [];
  turtlePackPets: string[];
  pets: Map<number, string[]>;
  startOfBattlePets: Map<number, string[]>;

  attackHealthMax = 100;
  petImageBroken = false;
  equipmentImageBroken = false;
  compareEquipment = (a: Equipment, b: Equipment) => {
    return a?.name === b?.name;
  };

  protected basePackSets = new Map<string, Set<string>>();
  protected friendsDiedCaps = new Map<string, number>([
    ['Vulture', 1],
    ['Saiga Antelope', 1],
    ['Secretary Bird', 1],
    ['Mimic', 2],
  ]);
  protected customPackPetsCache = new Map<string, Set<string>>();
  protected cachedPlayerPack: string | null = null;
  protected cachedOpponentPack: string | null = null;
  protected cachedPlayerPackSet: Set<string> | null = null;
  protected cachedOpponentPackSet: Set<string> | null = null;
  protected customPackSubscription: Subscription | null = null;
  protected destroy$ = new Subject<void>();

  @Input()
  showTokenPets = false;
  showSelectionDialog = false;
  selectionType: 'pet' | 'equipment' | 'swallowed-pet' | 'ability' = 'pet';
  swallowedPetIndex?: number;
  swallowedPetParentIndex?: number;
  swallowedPetTarget: SwallowedPetTarget = 'pet';
  forceShowAllPets = false;
  lockSelectionLevel = false;
  lockedSelectionLevel = 1;
  tokenPets: string[] = TOKEN_PETS;

  constructor(
    protected petService: PetService,
    protected equipmentService: EquipmentService,
    protected cdr: ChangeDetectorRef,
  ) { }

  optionHidden(option: string) {
    if (this.allPets) {
      return false;
    }

    const playerPackSet = this.getPlayerPackSet();
    if (playerPackSet.has(option)) {
      return false;
    }
    if (this.player.getPet(this.index)?.name == option) {
      return false;
    }

    return true;
  }

  protected initPackSets() {
    for (const packName of BASE_PACK_NAMES) {
      const packPets = this.petService.basePackPetsByName[packName];
      this.basePackSets.set(packName, this.buildPackSetFromMap(packPets));
    }
  }

  protected buildPackSetFromMap(pack: Map<number, string[]>): Set<string> {
    const set = new Set<string>();
    for (const pets of pack.values()) {
      for (const pet of pets) {
        set.add(pet);
      }
    }
    return set;
  }

  protected invalidatePackCaches() {
    this.customPackPetsCache.clear();
    this.cachedPlayerPack = null;
    this.cachedOpponentPack = null;
    this.cachedPlayerPackSet = null;
    this.cachedOpponentPackSet = null;
  }

  protected getPlayerPackSet(): Set<string> {
    const packName = this.player?.pack || 'Turtle';
    if (this.cachedPlayerPack !== packName || !this.cachedPlayerPackSet) {
      this.cachedPlayerPack = packName;
      this.cachedPlayerPackSet = this.getPackSetForName(packName);
    }
    return this.cachedPlayerPackSet;
  }

  protected getOpponentPackSet(): Set<string> {
    const packName = this.opponent?.pack || 'Turtle';
    if (this.cachedOpponentPack !== packName || !this.cachedOpponentPackSet) {
      this.cachedOpponentPack = packName;
      this.cachedOpponentPackSet = this.getPackSetForName(packName);
    }
    return this.cachedOpponentPackSet;
  }

  protected getPackSetForName(packName: string): Set<string> {
    const basePack = this.basePackSets.get(packName);
    if (basePack) {
      return basePack;
    }
    const cachedCustomPack = this.customPackPetsCache.get(packName);
    if (cachedCustomPack) {
      return cachedCustomPack;
    }
    const builtCustomPack = this.buildCustomPackSet(packName);
    this.customPackPetsCache.set(packName, builtCustomPack);
    return builtCustomPack;
  }

  protected buildCustomPackSet(name: string): Set<string> {
    const fallback = this.basePackSets.get('Turtle') ?? new Set<string>();
    const customPacks = this.customPacks as FormArray;
    if (!customPacks?.controls?.length) {
      return fallback;
    }
    const customPack = customPacks.controls.find(
      (pack) => pack.get('name').value === name,
    );
    if (!customPack) {
      return fallback;
    }
    const packSet = new Set<string>();
    for (let i = 1; i <= 6; i++) {
      const pets = customPack.get(`tier${i}Pets`).value || [];
      for (const pet of pets) {
        if (pet) {
          packSet.add(pet);
        }
      }
    }
    return packSet;
  }

  fixLoadEquipment() {
    const equipmentValue = this.formGroup.get('equipment').value;
    const equipmentName = this.normalizeEquipmentValue(equipmentValue);
    if (equipmentName === equipmentValue) {
      return;
    }
    setTimeout(() => {
      this.formGroup
        .get('equipment')
        .setValue(equipmentName, { emitEvent: false });
      this.formGroup
        .get('equipment')
        .updateValueAndValidity({ emitEvent: false });
    });
  }

  protected normalizeEquipmentValue(value: unknown): string | null {
    if (!value) {
      return null;
    }
    if (typeof value === 'string') {
      return value;
    }
    if (
      typeof value === 'object' &&
      value !== null &&
      typeof (value as { name?: unknown }).name === 'string'
    ) {
      return (value as { name: string }).name;
    }
    return null;
  }

  protected getSelectedEquipmentName(): string | null {
    return this.normalizeEquipmentValue(
      this.formGroup?.get('equipment')?.value,
    );
  }

  protected getSelectedEquipment(): Equipment | null {
    const name = this.getSelectedEquipmentName();
    if (!name) {
      return null;
    }
    return this.equipment.get(name) ?? this.ailmentEquipment.get(name) ?? null;
  }
}
