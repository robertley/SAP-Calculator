import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, FormArray } from '@angular/forms';
import { Player } from '../../classes/player.class';
import { Pet } from '../../classes/pet.class';
import { PetService } from '../../services/pet.service';
import { EquipmentService } from '../../services/equipment.service';
import { Equipment } from '../../classes/equipment.class';
import { cloneEquipment } from '../../util/equipment-utils';
import { AILMENT_CATEGORIES, EQUIPMENT_CATEGORIES } from '../../services/equipment-categories';
import { Subscription } from 'rxjs';
import { BASE_PACK_NAMES, PACK_NAMES } from '../../util/pack-names';
import { getPetIconPath, getEquipmentIconPath, getPetIconFileName } from '../../util/asset-utils';

@Component({
  selector: 'app-pet-selector',
  templateUrl: './pet-selector.component.html',
  styleUrls: ['./pet-selector.component.scss']
})
export class PetSelectorComponent implements OnInit, OnDestroy {

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
  customPacks: AbstractControl;//FormArray;
  @Input()
  flipImage = false;
  @Input()
  allowEquipmentUseOverrides: boolean;
  @Input()
  showSwallowedLevels = false;

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

  private basePackSets = new Map<string, Set<string>>();
  private friendsDiedCaps = new Map<string, number>([
    ['Vulture', 1],
    ['Saiga Antelope', 1],
    ['Secretary Bird', 1],
    ['Mimic', 2]
  ]);
  private customPackPetsCache = new Map<string, Set<string>>();
  private cachedPlayerPack: string | null = null;
  private cachedOpponentPack: string | null = null;
  private cachedPlayerPackSet: Set<string> | null = null;
  private cachedOpponentPackSet: Set<string> | null = null;
  private customPackSubscription: Subscription | null = null;

  @Input()
  showTokenPets = false;
  tokenPets: string[] = [
    'Bee',
    'Bus',
    'Chick',
    'Dirty Rat',
    'Lizard Tail',
    'Ram',
    'Smaller Slug',
    'Smallest Slug',
    'Zombie Cricket',
    'Zombie Fly',
    'Chimera Goat',
    'Chimera Lion',
    'Chimera Snake',
    'Daycrawler',
    'Head',
    'Monty',
    'Nessie?',
    'Smaller Slime',
    'Young Phoenix',
    'Good Dog',
    'Adult Flounder',
    'Burbel',
    'Cooked Roach',
    'Cuckoo Chick',
    'Fake Nessie',
    'Guinea Piglet',
    'Hydra Head',
    'Moby Dick',
    'Quail',
    'Sleeping Gelada',
    'Tand and Tand',
];

  constructor(private petService: PetService, private equipmentService: EquipmentService) {

  }

  ngOnInit(): void {
    this.initSelector();
    this.initPackSets();
    this.customPackSubscription = (this.customPacks as FormArray)?.valueChanges?.subscribe(() => {
      this.invalidatePackCaches();
    }) ?? null;

    this.fixLoadEquipment();

  }

  initSelector() {
    this.initPets();
    this.initEquipment();
    this.initForm();
  }

  initPets() {
    this.pets = new Map();
    for (let i = 1; i <= 6; i++) {
      this.pets.set(i, []);
    }
    for (const packName of PACK_NAMES) {
      const packPets = this.petService.basePackPetsByName[packName];
      for (let [tier, pets] of packPets) {
        this.pets.get(tier).push(...pets);
      }
    }
    // remove duplicates from each tier
    for (let [tier, pets] of this.pets) {
      this.pets.set(tier, [...new Set(pets)]);
    }

    this.initStartOfBattlePets();

    // console.log('pets', this.pets);
  }

  initStartOfBattlePets() {
    this.startOfBattlePets = new Map();
    for (let i = 1; i <= 6; i++) {
      let SOBpets = [];
      for (let pet of this.pets.get(i)) {
        if (this.petService.startOfBattlePets.includes(pet)) {
          SOBpets.push(pet);
        }
      }
      this.startOfBattlePets.set(i, SOBpets);
    }
  }

  ngOnDestroy(): void {
    this.customPackSubscription?.unsubscribe();
  }

  initEquipment() {
    this.equipment = this.equipmentService.getInstanceOfAllEquipment();
    this.ailmentEquipment = this.equipmentService.getInstanceOfAllAilments();
    this.equipmentCategoryGroups = this.buildCategoryGroups(EQUIPMENT_CATEGORIES, this.equipment);
    this.ailmentCategoryGroups = this.buildCategoryGroups(AILMENT_CATEGORIES, this.ailmentEquipment);
  }

  buildCategoryGroups(categoryMap: { [key: string]: string[] }, source: Map<string, Equipment>) {
    return Object.entries(categoryMap).map(([label, names]) => {
      const items: Equipment[] = [];
      for (const name of names) {
        const equipment = source.get(name);
        if (equipment) {
          items.push(equipment);
        }
      }
      return { label, items };
    }).filter(group => group.items.length > 0);
  }

  initForm() {
    // this.formGroup = new FormGroup({
    //   name: new FormControl(this.pet?.name),
    //   attack: new FormControl(this.pet?.attack),
    //   health: new FormControl(this.pet?.health),
    //   exp: new FormControl(this.pet?.exp),
    //   equipment: new FormControl(this.pet?.equipment),
    //   belugaSwallowedPet: new FormControl(this.pet?.belugaSwallowedPet)
    // })

    this.formGroup.get('name').valueChanges.subscribe((value) => {
      this.petImageBroken = false;
      if (value == null) {
        this.removePet();
        return;
      }
      this.substitutePet(true)
    });
    this.formGroup.get('attack').valueChanges.subscribe(() => {
      this.clampControl('attack', 0, 100);
      this.substitutePet(false);
    });
    this.formGroup.get('health').valueChanges.subscribe(() => {
      this.clampControl('health', 0, 100);
      this.substitutePet(false);
    });
    this.formGroup.get('exp').valueChanges.subscribe(() => { this.substitutePet(false) });
    const equipmentUsesControl = this.formGroup.get('equipmentUses');
    this.formGroup.get('equipment').valueChanges.subscribe((value) => {
      this.equipmentImageBroken = false;
      if (value != null && value.reset == null) {
        let equipment = this.equipment.get(value.name);
        if (equipment == null) {
          equipment = this.ailmentEquipment.get(value.name);
        }
        this.formGroup.get('equipment').setValue(equipment, {emitEvent: false});
      }
      this.substitutePet(false)
    });
    this.formGroup.get('equipmentUses')?.valueChanges.subscribe(() => this.substitutePet(false));
    this.formGroup.get('belugaSwallowedPet').valueChanges.subscribe((value) => { this.setBelugaSwallow(value) });
    this.formGroup.get('sarcasticFringeheadSwallowedPet')?.valueChanges.subscribe((value) => { this.setSarcasticFringeheadSwallowedPet(value) });
    this.formGroup.get('abominationSwallowedPet1').valueChanges.subscribe((value) => { this.setSwallowedPets(value) });
    this.formGroup.get('abominationSwallowedPet2').valueChanges.subscribe((value) => { this.setSwallowedPets(value) });
    this.formGroup.get('abominationSwallowedPet3').valueChanges.subscribe((value) => { this.setSwallowedPets(value) });
    this.formGroup.get('abominationSwallowedPet1Level').valueChanges.subscribe((value) => { this.setSwallowedPets(value) });
    this.formGroup.get('abominationSwallowedPet2Level').valueChanges.subscribe((value) => { this.setSwallowedPets(value) });
    this.formGroup.get('abominationSwallowedPet3Level').valueChanges.subscribe((value) => { this.setSwallowedPets(value) });
    this.formGroup.get('mana').valueChanges.subscribe(() => {
      this.clampControl('mana', 0, 50);
      this.substitutePet(false);
    });
    this.formGroup.get('triggersConsumed').valueChanges.subscribe(() => {
      this.clampControl('triggersConsumed', 0, 10);
      this.substitutePet(false);
    });
    this.formGroup.get('friendsDiedBeforeBattle')?.valueChanges.subscribe(() => {
      this.clampFriendsDiedBeforeBattle();
      this.substitutePet(false);
    });
    this.formGroup.get('battlesFought').valueChanges.subscribe((value) => { this.setBattlesFought(value) });
    this.formGroup.get('timesHurt').valueChanges.subscribe((value) => { this.setTimesHurt(value) });
  }

  setExp(amt: number) {
    this.formGroup.get('exp').setValue(amt);
  }

  getIsSelected(amt: number) {
    return this.formGroup.get('exp').value >= amt;
  }

  showRemoveExp() {
    return this.formGroup.get('exp').value > 0;
  }

  substitutePet(nameChange = false) {
    setTimeout(() => {
      let formValue = this.formGroup.value;
      if (nameChange) {
        formValue.attack = null;
        formValue.health = null;
        formValue.mana = null;
        formValue.triggersConsumed = null;
      }
      this.applyStatCaps(formValue);
      let equipment = formValue.equipment;
      if (equipment != null) {
        const baseEquipment = this.equipment.get(equipment.name) ?? this.ailmentEquipment.get(equipment.name);
        if (baseEquipment != null) {
          const cloned = cloneEquipment(baseEquipment);
          if (this.allowEquipmentUseOverrides) {
            const parsedUses = Number(formValue.equipmentUses);
            const uses = Number.isFinite(parsedUses) ? parsedUses : cloned.uses;
            if (uses != null) {
              cloned.uses = uses;
              cloned.originalUses = uses;
            }
          }
          formValue.equipment = cloned;
        } else {
          formValue.equipment = baseEquipment;
        }
      }

      let pet = this.petService.createPet(formValue, this.player);
      this.player.setPet(this.index, pet, true);
  
      // console.log('pet substituted', this.player);
      if (nameChange) {
        this.formGroup.get('attack').setValue(pet.attack, {emitEvent: false});
        this.formGroup.get('health').setValue(pet.health, {emitEvent: false});
        this.formGroup.get('mana').setValue(pet.mana, {emitEvent: false});
        this.formGroup.get('triggersConsumed').setValue(pet.triggersConsumed, {emitEvent: false});
      }

    })

  }

  get petImageSrc(): string | null {
    const name = this.formGroup?.get('name')?.value;
    if (!name) {
      return null;
    }
    const fileName = getPetIconFileName(name);
    if (!fileName) {
      return null;
    }
    return `/assets/art/Public/Public/Pets/${fileName}.png`;
  }

  get swallowedPetImageSrc(): string | null {
    const name = this.formGroup?.get('name')?.value;
    if (name === 'Beluga Whale') {
      return this.getPetImagePath(this.formGroup.get('belugaSwallowedPet')?.value);
    }
    if (name === 'Sarcastic Fringehead') {
      return this.getPetImagePath(this.formGroup.get('sarcasticFringeheadSwallowedPet')?.value);
    }
    return null;
  }

  get abominationSwallowedPetImages(): string[] {
    const name = this.formGroup?.get('name')?.value;
    if (name !== 'Abomination') {
      return [];
    }
    const values = [
      this.formGroup.get('abominationSwallowedPet1')?.value,
      this.formGroup.get('abominationSwallowedPet2')?.value,
      this.formGroup.get('abominationSwallowedPet3')?.value,
    ];
    return values
      .map((value) => this.getPetImagePath(value))
      .filter((value) => value != null) as string[];
  }

  get equipmentImageSrc(): string | null {
    const equipment = this.formGroup?.get('equipment')?.value;
    if (!equipment?.name || equipment.equipmentClass?.startsWith('ailment')) {
      return null;
    }
    return getEquipmentIconPath(equipment.name, false);
  }

  get ailmentImageSrc(): string | null {
    const equipment = this.formGroup?.get('equipment')?.value;
    if (!equipment?.name || !equipment.equipmentClass?.startsWith('ailment')) {
      return null;
    }
    return getEquipmentIconPath(equipment.name, true);
  }

  get equipmentSelected(): boolean {
    const equipment = this.formGroup?.get('equipment')?.value;
    return !!equipment;
  }

  get equipmentHasUses(): boolean {
    const equipment = this.formGroup?.get('equipment')?.value;
    return equipment?.uses != null;
  }

  get equipmentUsesToggleId(): string {
    return `equipmentUsesToggle-${this.index ?? 'none'}`;
  }

  get equipmentUsesInputId(): string {
    return `equipmentUsesInput-${this.index ?? 'none'}`;
  }

  get equipmentUsesAvailable(): boolean {
    return this.equipmentSelected && this.equipmentHasUses;
  }

  getPetOptionStyle(pet: string) {
    const icon = getPetIconPath(pet);
    return this.buildOptionStyle(icon);
  }

  getEquipmentOptionStyle(equipment: Equipment, isAilment = false) {
    const icon = getEquipmentIconPath(equipment?.name, isAilment);
    return this.buildOptionStyle(icon);
  }

  private buildOptionStyle(icon: string | null) {
    if (!icon) {
      return {};
    }
    return {
      'background-image': `url(${icon})`,
      'background-repeat': 'no-repeat',
      'background-position': 'left center',
      'background-size': '24px 24px',
      'padding-left': '2.5rem'
    };
  }

  shouldShowFriendsDiedInput(): boolean {
    return this.friendsDiedCaps.has(this.formGroup.get('name').value);
  }

  private clampFriendsDiedBeforeBattle() {
    const max = this.getFriendsDiedMax();
    this.clampControl('friendsDiedBeforeBattle', 0, max);
  }

  private getFriendsDiedMax(): number {
    const name = this.formGroup.get('name').value;
    return this.friendsDiedCaps.get(name) ?? 5;
  }

  private getPetImagePath(petName?: string | null): string | null {
    if (!petName) {
      return null;
    }
    const fileName = getPetIconFileName(petName);
    if (!fileName) {
      return null;
    }
    return `/assets/art/Public/Public/Pets/${fileName}.png`;
  }

  private applyStatCaps(formValue: any) {
    const attack = this.clampValue(formValue.attack, 0, 100);
    const health = this.clampValue(formValue.health, 0, 100);
    const mana = this.clampValue(formValue.mana, 0, 50);
    const triggers = this.clampValue(formValue.triggersConsumed, 0, 10);

    if (attack !== formValue.attack && formValue.attack != null) {
      this.formGroup.get('attack').setValue(attack, { emitEvent: false });
      formValue.attack = attack;
    }
    if (health !== formValue.health && formValue.health != null) {
      this.formGroup.get('health').setValue(health, { emitEvent: false });
      formValue.health = health;
    }
    if (mana !== formValue.mana && formValue.mana != null) {
      this.formGroup.get('mana').setValue(mana, { emitEvent: false });
      formValue.mana = mana;
    }
    if (triggers !== formValue.triggersConsumed && formValue.triggersConsumed != null) {
      this.formGroup.get('triggersConsumed').setValue(triggers, { emitEvent: false });
      formValue.triggersConsumed = triggers;
    }
  }

  private clampControl(controlName: string, min: number, max: number) {
    const control = this.formGroup.get(controlName);
    if (!control) {
      return;
    }
    const rawValue = control.value;
    const clamped = this.clampValue(rawValue, min, max);
    if (clamped !== rawValue && rawValue != null && rawValue !== '') {
      control.setValue(clamped, { emitEvent: false });
    }
  }

  private clampValue(value: any, min: number, max: number) {
    if (value == null || value === '') {
      return value;
    }
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
      return value;
    }
    return Math.min(max, Math.max(min, numeric));
  }

  setBelugaSwallow(value: string) {
    let pet = this.player.getPet(this.index);
    if (pet == null) {
      return;
    }
    pet.belugaSwallowedPet = value;
  }

  setSarcasticFringeheadSwallowedPet(value: string) {
    let pet = this.player.getPet(this.index);
    if (pet == null) {
      return;
    }
    pet.sarcasticFringeheadSwallowedPet = value;
  }

  setSwallowedPets(value: any) {
    let pet = this.player.getPet(this.index);
    if (pet == null) {
      return;
    }
    const swallowedPets: Array<{ name: string; level: number }> = [];
    const pet1 = this.formGroup.get('abominationSwallowedPet1').value;
    const pet2 = this.formGroup.get('abominationSwallowedPet2').value;
    const pet3 = this.formGroup.get('abominationSwallowedPet3').value;
    const level1 = Number(this.formGroup.get('abominationSwallowedPet1Level').value ?? 1);
    const level2 = Number(this.formGroup.get('abominationSwallowedPet2Level').value ?? 1);
    const level3 = Number(this.formGroup.get('abominationSwallowedPet3Level').value ?? 1);

    if (pet1 != null) {
      swallowedPets.push({ name: pet1, level: level1 || 1 });
    }
    if (pet2 != null) {
      swallowedPets.push({ name: pet2, level: level2 || 1 });
    }
    if (pet3 != null) {
      swallowedPets.push({ name: pet3, level: level3 || 1 });
    }
    pet.abominationSwallowedPet1 = swallowedPets[0]?.name ?? null;
    pet.abominationSwallowedPet2 = swallowedPets[1]?.name ?? null;
    pet.abominationSwallowedPet3 = swallowedPets[2]?.name ?? null;
    pet.abominationSwallowedPet1Level = swallowedPets[0]?.level ?? 1;
    pet.abominationSwallowedPet2Level = swallowedPets[1]?.level ?? 1;
    pet.abominationSwallowedPet3Level = swallowedPets[2]?.level ?? 1;
  }

  setBattlesFought(value: number) {
    let pet = this.player.getPet(this.index);
    if (pet == null) {
      return;
    }
    pet.battlesFought = value;
  }

  setTimesHurt(value: number) {
    let pet = this.player.getPet(this.index);
    if (pet == null) {
      return;
    }
    pet.timesHurt = value;
    this.substitutePet(false);
  }

  removePet() {
    this.player.setPet(this.index, null, true);
    this.formGroup.get('name').setValue(null, {emitEvent: false});
    this.formGroup.get('attack').setValue(0, {emitEvent: false});
    this.formGroup.get('health').setValue(0, {emitEvent: false});
    this.formGroup.get('exp').setValue(0, {emitEvent: false});
    this.formGroup.get('equipment').setValue(null, {emitEvent: false});
    this.formGroup.get('mana').setValue(0, {emitEvent: false});
    this.formGroup.get('triggersConsumed').setValue(0, {emitEvent: false});
  }

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

  private initPackSets() {
    for (const packName of BASE_PACK_NAMES) {
      const packPets = this.petService.basePackPetsByName[packName];
      this.basePackSets.set(packName, this.buildPackSetFromMap(packPets));
    }
  }

  private buildPackSetFromMap(pack: Map<number, string[]>): Set<string> {
    const set = new Set<string>();
    for (const pets of pack.values()) {
      for (const pet of pets) {
        set.add(pet);
      }
    }
    return set;
  }

  private invalidatePackCaches() {
    this.customPackPetsCache.clear();
    this.cachedPlayerPack = null;
    this.cachedOpponentPack = null;
    this.cachedPlayerPackSet = null;
    this.cachedOpponentPackSet = null;
  }

  private getPlayerPackSet(): Set<string> {
    const packName = this.player?.pack || 'Turtle';
    if (this.cachedPlayerPack !== packName || !this.cachedPlayerPackSet) {
      this.cachedPlayerPack = packName;
      this.cachedPlayerPackSet = this.getPackSetForName(packName);
    }
    return this.cachedPlayerPackSet;
  }

  private getOpponentPackSet(): Set<string> {
    const packName = this.opponent?.pack || 'Turtle';
    if (this.cachedOpponentPack !== packName || !this.cachedOpponentPackSet) {
      this.cachedOpponentPack = packName;
      this.cachedOpponentPackSet = this.getPackSetForName(packName);
    }
    return this.cachedOpponentPackSet;
  }

  private getPackSetForName(packName: string): Set<string> {
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

  private buildCustomPackSet(name: string): Set<string> {
    const fallback = this.basePackSets.get('Turtle') ?? new Set<string>();
    const customPacks = this.customPacks as FormArray;
    if (!customPacks?.controls?.length) {
      return fallback;
    }
    const customPack = customPacks.controls.find((pack) => pack.get('name').value === name);
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
    let equipment = this.formGroup.get('equipment').value;
    if (equipment == null) {
      return;
    }
    let newEquipment = this.equipment.get(equipment.name);
    if (newEquipment == null) {
      newEquipment = this.ailmentEquipment.get(equipment.name);
    }
    setTimeout(() => {
      this.formGroup.get('equipment').setValue(newEquipment, { emitEvent: false });
      this.formGroup.get('equipment').updateValueAndValidity({ emitEvent: false });
    });
  }


}
