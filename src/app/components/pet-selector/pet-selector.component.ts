import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  FormGroup,
  AbstractControl,
  FormArray,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Player } from '../../classes/player.class';
import { Pet } from '../../classes/pet.class';
import { PetService } from '../../services/pet/pet.service';
import { EquipmentService } from '../../services/equipment/equipment.service';
import { Equipment } from '../../classes/equipment.class';
import {
  AILMENT_CATEGORIES,
  EQUIPMENT_CATEGORIES,
} from '../../services/equipment/equipment-categories';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { BASE_PACK_NAMES, PACK_NAMES } from '../../util/pack-names';
import {
  getPetIconPath,
  getEquipmentIconPath,
  getPetIconFileName,
} from '../../util/asset-utils';
import { ItemSelectionDialogComponent } from '../item-selection-dialog/item-selection-dialog.component';

const PARROT_COPY_ABOMINATION_SWALLOWED_FIELDS: string[] = (() => {
  const fields: string[] = [];
  for (let slot = 1; slot <= 3; slot++) {
    const base = `parrotCopyPetAbominationSwallowedPet${slot}`;
    fields.push(base);
    fields.push(`${base}BelugaSwallowedPet`);
    fields.push(`${base}Level`);
    fields.push(`${base}TimesHurt`);
  }
  return fields;
})();

const PARROT_COPY_ABOMINATION_PARROT_FIELDS: string[] = (() => {
  const fields: string[] = [];
  for (let slot = 1; slot <= 3; slot++) {
    const base = `parrotCopyPetAbominationSwallowedPet${slot}`;
    fields.push(`${base}ParrotCopyPet`);
    fields.push(`${base}ParrotCopyPetBelugaSwallowedPet`);
    for (let inner = 1; inner <= 3; inner++) {
      const innerBase = `${base}ParrotCopyPetAbominationSwallowedPet${inner}`;
      fields.push(innerBase);
      fields.push(`${innerBase}BelugaSwallowedPet`);
      fields.push(`${innerBase}Level`);
      fields.push(`${innerBase}TimesHurt`);
    }
  }
  return fields;
})();

@Component({
  selector: 'app-pet-selector',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    FormsModule,
    ItemSelectionDialogComponent,
  ],
  templateUrl: './pet-selector.component.html',
  styleUrls: ['./pet-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  customPacks: AbstractControl; //FormArray;
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
    ['Mimic', 2],
  ]);
  private customPackPetsCache = new Map<string, Set<string>>();
  private cachedPlayerPack: string | null = null;
  private cachedOpponentPack: string | null = null;
  private cachedPlayerPackSet: Set<string> | null = null;
  private cachedOpponentPackSet: Set<string> | null = null;
  private customPackSubscription: Subscription | null = null;

  @Input()
  showTokenPets = false;
  showSelectionDialog = false;
  selectionType: 'pet' | 'equipment' | 'swallowed-pet' = 'pet';
  swallowedPetIndex?: number;
  swallowedPetParentIndex?: number;
  swallowedPetTarget:
    | 'pet'
    | 'abomination'
    | 'sarcastic'
    | 'abomination-beluga'
    | 'parrot'
    | 'parrot-beluga'
    | 'parrot-abomination'
    | 'parrot-abomination-beluga'
    | 'abomination-parrot'
    | 'abomination-parrot-beluga'
    | 'abomination-parrot-abomination'
    | 'abomination-parrot-abomination-beluga'
    | 'parrot-abomination-parrot'
    | 'parrot-abomination-parrot-beluga'
    | 'parrot-abomination-parrot-abomination'
    | 'parrot-abomination-parrot-abomination-beluga' = 'pet';
  forceShowAllPets = false;

  tokenPets: string[] = [
    'Adult Flounder',
    'Angry Pygmy Hog',
    'Baby Urchin',
    'Bee',
    'Bus',
    'Butterfly',
    'Chick',
    'Chimera Goat',
    'Chimera Lion',
    'Chimera Snake',
    'Cooked Roach',
    'Cracked Egg',
    'Cuckoo Chick',
    'Daycrawler',
    'Dirty Rat',
    'Fairy Ball',
    'Fake Nessie',
    'Fire Pup',
    'Giant Eyes Dog',
    'Golden Retriever',
    'Good Dog',
    'Great One',
    'Head',
    'Lizard Tail',
    'Loyal Chinchilla',
    'Mimic Octopus',
    'Moby Dick',
    'Monty',
    'Nessie?',
    'Nest',
    'Quail',
    'Ram',
    'Rock',
    'Salmon',
    'Sleeping Gelada',
    'Smaller Slime',
    'Smaller Slug',
    'Smallest Slug',
    'Tand and Tand',
    'Young Phoenix',
    'Zombie Cricket',
    'Zombie Fly',
  ];

  constructor(
    private petService: PetService,
    private equipmentService: EquipmentService,
  ) { }

  trackByIndex(index: number): number {
    return index;
  }

  ngOnInit(): void {
    this.initSelector();
    this.initPackSets();
    this.customPackSubscription =
      (this.customPacks as FormArray)?.valueChanges?.subscribe(() => {
        this.invalidatePackCaches();
      }) ?? null;

    this.fixLoadEquipment();
  }

  openSelectionDialog(
    type: 'pet' | 'equipment' | 'swallowed-pet',
    index?: number,
    target:
      | 'pet'
      | 'abomination'
      | 'sarcastic'
      | 'abomination-beluga'
      | 'parrot'
      | 'parrot-beluga'
      | 'parrot-abomination'
      | 'parrot-abomination-beluga'
      | 'abomination-parrot'
      | 'abomination-parrot-beluga'
      | 'abomination-parrot-abomination'
      | 'abomination-parrot-abomination-beluga'
      | 'parrot-abomination-parrot'
      | 'parrot-abomination-parrot-beluga'
      | 'parrot-abomination-parrot-abomination'
      | 'parrot-abomination-parrot-abomination-beluga' = 'pet',
    parentIndex?: number,
  ) {
    this.selectionType = type;
    this.swallowedPetIndex = index;
    this.swallowedPetTarget = target;
    this.swallowedPetParentIndex = parentIndex;
    this.forceShowAllPets =
      type === 'swallowed-pet' && this.isParrotCopyTarget(target);
    this.showSelectionDialog = true;
  }

  onItemSelected(item: any) {
    if (item instanceof Event) {
      this.closeSelectionDialog();
      return;
    }
    if (this.selectionType === 'pet') {
      this.formGroup.get('name').setValue(item);
    } else if (this.selectionType === 'equipment') {
      const equipmentName =
        typeof item === 'string' ? item : item?.name ?? null;
      this.formGroup.get('equipment').setValue(equipmentName);
    } else if (this.selectionType === 'swallowed-pet') {
      if (this.swallowedPetTarget === 'abomination-beluga') {
        this.formGroup
          .get(
            `abominationSwallowedPet${this.swallowedPetIndex}BelugaSwallowedPet`,
          )
          .setValue(item);
      } else if (this.swallowedPetTarget === 'parrot') {
        this.formGroup.get('parrotCopyPet').setValue(item);
      } else if (this.swallowedPetTarget === 'parrot-beluga') {
        this.formGroup.get('parrotCopyPetBelugaSwallowedPet').setValue(item);
      } else if (this.swallowedPetTarget === 'parrot-abomination') {
        this.formGroup
          .get(`parrotCopyPetAbominationSwallowedPet${this.swallowedPetIndex}`)
          .setValue(item);
      } else if (this.swallowedPetTarget === 'parrot-abomination-beluga') {
        this.formGroup
          .get(
            `parrotCopyPetAbominationSwallowedPet${this.swallowedPetIndex}BelugaSwallowedPet`,
          )
          .setValue(item);
      } else if (this.swallowedPetTarget === 'abomination-parrot') {
        this.formGroup
          .get(`abominationSwallowedPet${this.swallowedPetIndex}ParrotCopyPet`)
          .setValue(item);
      } else if (this.swallowedPetTarget === 'abomination-parrot-beluga') {
        this.formGroup
          .get(
            `abominationSwallowedPet${this.swallowedPetIndex}ParrotCopyPetBelugaSwallowedPet`,
          )
          .setValue(item);
      } else if (this.swallowedPetTarget === 'abomination-parrot-abomination') {
        if (this.swallowedPetParentIndex == null) {
          return;
        }
        this.formGroup
          .get(
            `abominationSwallowedPet${this.swallowedPetParentIndex}ParrotCopyPetAbominationSwallowedPet${this.swallowedPetIndex}`,
          )
          .setValue(item);
      } else if (
        this.swallowedPetTarget === 'abomination-parrot-abomination-beluga'
      ) {
        if (this.swallowedPetParentIndex == null) {
          return;
        }
        this.formGroup
          .get(
            `abominationSwallowedPet${this.swallowedPetParentIndex}ParrotCopyPetAbominationSwallowedPet${this.swallowedPetIndex}BelugaSwallowedPet`,
          )
          .setValue(item);
      } else if (this.swallowedPetTarget === 'parrot-abomination-parrot') {
        this.formGroup
          .get(
            `parrotCopyPetAbominationSwallowedPet${this.swallowedPetIndex}ParrotCopyPet`,
          )
          .setValue(item);
      } else if (
        this.swallowedPetTarget === 'parrot-abomination-parrot-beluga'
      ) {
        this.formGroup
          .get(
            `parrotCopyPetAbominationSwallowedPet${this.swallowedPetIndex}ParrotCopyPetBelugaSwallowedPet`,
          )
          .setValue(item);
      } else if (
        this.swallowedPetTarget === 'parrot-abomination-parrot-abomination'
      ) {
        if (this.swallowedPetParentIndex == null) {
          return;
        }
        this.formGroup
          .get(
            `parrotCopyPetAbominationSwallowedPet${this.swallowedPetParentIndex}ParrotCopyPetAbominationSwallowedPet${this.swallowedPetIndex}`,
          )
          .setValue(item);
      } else if (
        this.swallowedPetTarget ===
        'parrot-abomination-parrot-abomination-beluga'
      ) {
        if (this.swallowedPetParentIndex == null) {
          return;
        }
        this.formGroup
          .get(
            `parrotCopyPetAbominationSwallowedPet${this.swallowedPetParentIndex}ParrotCopyPetAbominationSwallowedPet${this.swallowedPetIndex}BelugaSwallowedPet`,
          )
          .setValue(item);
      } else if (this.pet?.name === 'Beluga Whale') {
        this.formGroup.get('belugaSwallowedPet').setValue(item);
      } else if (
        this.swallowedPetTarget === 'abomination' ||
        this.pet?.name === 'Abomination'
      ) {
        this.formGroup
          .get(`abominationSwallowedPet${this.swallowedPetIndex}`)
          .setValue(item);
      } else if (this.pet?.name === 'Sarcastic Fringehead') {
        this.formGroup.get('sarcasticFringeheadSwallowedPet').setValue(item);
      }
    }
    this.closeSelectionDialog();
  }

  closeSelectionDialog() {
    this.showSelectionDialog = false;
    this.forceShowAllPets = false;
  }

  private isParrotCopyTarget(
    target: PetSelectorComponent['swallowedPetTarget'],
  ): boolean {
    return [
      'parrot',
      'parrot-beluga',
      'parrot-abomination',
      'parrot-abomination-beluga',
      'abomination-parrot',
      'abomination-parrot-beluga',
      'abomination-parrot-abomination',
      'abomination-parrot-abomination-beluga',
      'parrot-abomination-parrot',
      'parrot-abomination-parrot-beluga',
      'parrot-abomination-parrot-abomination',
      'parrot-abomination-parrot-abomination-beluga',
    ].includes(target);
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
    this.equipmentCategoryGroups = this.buildCategoryGroups(
      EQUIPMENT_CATEGORIES,
      this.equipment,
    );
    this.ailmentCategoryGroups = this.buildCategoryGroups(
      AILMENT_CATEGORIES,
      this.ailmentEquipment,
    );
  }

  buildCategoryGroups(
    categoryMap: { [key: string]: string[] },
    source: Map<string, Equipment>,
  ) {
    return Object.entries(categoryMap)
      .map(([label, names]) => {
        const items: Equipment[] = [];
        for (const name of names) {
          const equipment = source.get(name);
          if (equipment) {
            items.push(equipment);
          }
        }
        return { label, items };
      })
      .filter((group) => group.items.length > 0);
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

    const inputDebounceMs = 0;

    this.formGroup
      .get('name')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        this.petImageBroken = false;
        if (value == null) {
          this.removePet();
          return;
        }
        this.substitutePet(true);
      });
    this.formGroup
      .get('attack')
      .valueChanges.pipe(debounceTime(inputDebounceMs), distinctUntilChanged())
      .subscribe(() => {
        this.clampControl('attack', 0, 100);
        this.substitutePet(false);
      });
    this.formGroup
      .get('health')
      .valueChanges.pipe(debounceTime(inputDebounceMs), distinctUntilChanged())
      .subscribe(() => {
        this.clampControl('health', 0, 100);
        this.substitutePet(false);
      });
    this.formGroup
      .get('exp')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe(() => {
        this.substitutePet(false);
      });
    const equipmentUsesControl = this.formGroup.get('equipmentUses');
    this.formGroup.get('equipment').valueChanges.subscribe((value) => {
      this.equipmentImageBroken = false;
      const equipmentName = this.normalizeEquipmentValue(value);
      if (equipmentName !== value) {
        this.formGroup
          .get('equipment')
          .setValue(equipmentName, { emitEvent: false });
      }
      if (!equipmentName) {
        equipmentUsesControl?.setValue(null, { emitEvent: false });
      }
      this.substitutePet(false);
    });
    this.formGroup
      .get('equipmentUses')
      ?.valueChanges.pipe(debounceTime(inputDebounceMs), distinctUntilChanged())
      .subscribe(() => this.substitutePet(false));
    this.formGroup.get('belugaSwallowedPet').valueChanges.subscribe((value) => {
      this.setBelugaSwallow(value);
    });
    this.formGroup.get('parrotCopyPet')?.valueChanges.subscribe((value) => {
      this.setParrotCopyPet(value);
    });
    this.formGroup
      .get('parrotCopyPetBelugaSwallowedPet')
      ?.valueChanges.subscribe((value) => {
        this.setParrotCopyPetBelugaSwallowedPet(value);
      });
    for (const field of PARROT_COPY_ABOMINATION_SWALLOWED_FIELDS) {
      this.formGroup.get(field)?.valueChanges.subscribe((value) => {
        this.setParrotCopyPetAbominationSwallowedPets(value);
      });
    }
    for (const field of PARROT_COPY_ABOMINATION_PARROT_FIELDS) {
      this.formGroup.get(field)?.valueChanges.subscribe((value) => {
        this.setParrotCopyPetAbominationParrotSettings(value);
      });
    }
    this.formGroup
      .get('sarcasticFringeheadSwallowedPet')
      ?.valueChanges.subscribe((value) => {
        this.setSarcasticFringeheadSwallowedPet(value);
      });
    this.formGroup
      .get('abominationSwallowedPet1')
      .valueChanges.subscribe((value) => {
        this.setSwallowedPets(value);
      });
    this.formGroup
      .get('abominationSwallowedPet2')
      .valueChanges.subscribe((value) => {
        this.setSwallowedPets(value);
      });
    this.formGroup
      .get('abominationSwallowedPet3')
      .valueChanges.subscribe((value) => {
        this.setSwallowedPets(value);
      });
    this.formGroup
      .get('abominationSwallowedPet1BelugaSwallowedPet')
      ?.valueChanges.subscribe((value) => {
        this.setSwallowedPets(value);
      });
    this.formGroup
      .get('abominationSwallowedPet2BelugaSwallowedPet')
      ?.valueChanges.subscribe((value) => {
        this.setSwallowedPets(value);
      });
    this.formGroup
      .get('abominationSwallowedPet3BelugaSwallowedPet')
      ?.valueChanges.subscribe((value) => {
        this.setSwallowedPets(value);
      });
    this.formGroup
      .get('abominationSwallowedPet1ParrotCopyPet')
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get('abominationSwallowedPet2ParrotCopyPet')
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get('abominationSwallowedPet3ParrotCopyPet')
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get('abominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet')
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get('abominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet')
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get('abominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet')
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get('abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1')
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get('abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2')
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get('abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3')
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get('abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1')
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get('abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2')
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get('abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3')
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get('abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1')
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get('abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2')
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get('abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3')
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get(
        'abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet',
      )
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get(
        'abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet',
      )
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get(
        'abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet',
      )
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get(
        'abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet',
      )
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get(
        'abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet',
      )
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get(
        'abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet',
      )
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get(
        'abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet',
      )
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get(
        'abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet',
      )
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get(
        'abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet',
      )
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get('abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level')
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get('abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level')
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get('abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level')
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get('abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level')
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get('abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level')
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get('abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level')
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get('abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level')
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get('abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level')
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get('abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level')
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get(
        'abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt',
      )
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get(
        'abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt',
      )
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get(
        'abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt',
      )
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get(
        'abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt',
      )
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get(
        'abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt',
      )
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get(
        'abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt',
      )
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get(
        'abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt',
      )
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get(
        'abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt',
      )
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get(
        'abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt',
      )
      ?.valueChanges.subscribe((value) => {
        this.setAbominationParrotCopySettings(value);
      });
    this.formGroup
      .get('abominationSwallowedPet1Level')
      .valueChanges.subscribe((value) => {
        this.setSwallowedPets(value);
      });
    this.formGroup
      .get('abominationSwallowedPet2Level')
      .valueChanges.subscribe((value) => {
        this.setSwallowedPets(value);
      });
    this.formGroup
      .get('abominationSwallowedPet3Level')
      .valueChanges.subscribe((value) => {
        this.setSwallowedPets(value);
      });
    this.formGroup
      .get('abominationSwallowedPet1TimesHurt')
      ?.valueChanges.subscribe((value) => {
        this.setSwallowedPets(value);
      });
    this.formGroup
      .get('abominationSwallowedPet2TimesHurt')
      ?.valueChanges.subscribe((value) => {
        this.setSwallowedPets(value);
      });
    this.formGroup
      .get('abominationSwallowedPet3TimesHurt')
      ?.valueChanges.subscribe((value) => {
        this.setSwallowedPets(value);
      });
    this.formGroup
      .get('mana')
      .valueChanges.pipe(debounceTime(inputDebounceMs), distinctUntilChanged())
      .subscribe(() => {
        this.clampControl('mana', 0, 50);
        this.substitutePet(false);
      });
    this.formGroup
      .get('triggersConsumed')
      .valueChanges.pipe(debounceTime(inputDebounceMs), distinctUntilChanged())
      .subscribe(() => {
        this.clampControl('triggersConsumed', 0, 10);
        this.substitutePet(false);
      });
    this.formGroup
      .get('friendsDiedBeforeBattle')
      ?.valueChanges.pipe(debounceTime(inputDebounceMs), distinctUntilChanged())
      .subscribe(() => {
        this.clampFriendsDiedBeforeBattle();
        this.substitutePet(false);
      });
    this.formGroup
      .get('battlesFought')
      .valueChanges.pipe(debounceTime(inputDebounceMs), distinctUntilChanged())
      .subscribe((value) => {
        this.setBattlesFought(value);
      });
    this.formGroup
      .get('timesHurt')
      .valueChanges.pipe(debounceTime(inputDebounceMs), distinctUntilChanged())
      .subscribe((value) => {
        this.setTimesHurt(value);
      });
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
      formValue.equipment = this.normalizeEquipmentValue(formValue.equipment);

      let pet = this.petService.createPet(formValue, this.player);
      this.player.setPet(this.index, pet, true);

      // console.log('pet substituted', this.player);
      if (nameChange) {
        this.formGroup.get('attack').setValue(pet.attack, { emitEvent: false });
        this.formGroup.get('health').setValue(pet.health, { emitEvent: false });
        this.formGroup.get('mana').setValue(pet.mana, { emitEvent: false });
        this.formGroup
          .get('triggersConsumed')
          .setValue(pet.triggersConsumed, { emitEvent: false });
      }
    });
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
    return `assets/art/Public/Public/Pets/${fileName}.png`;
  }

  get swallowedPetImageSrc(): string | null {
    const name = this.formGroup?.get('name')?.value;
    if (name === 'Beluga Whale') {
      return this.getPetImagePath(
        this.formGroup.get('belugaSwallowedPet')?.value,
      );
    }
    if (name === 'Sarcastic Fringehead') {
      return this.getPetImagePath(
        this.formGroup.get('sarcasticFringeheadSwallowedPet')?.value,
      );
    }
    if (name === 'Parrot') {
      const belugaSwallowed = this.formGroup.get(
        'parrotCopyPetBelugaSwallowedPet',
      )?.value;
      if (belugaSwallowed) {
        return this.getPetImagePath(belugaSwallowed);
      }
      return this.getPetImagePath(this.formGroup.get('parrotCopyPet')?.value);
    }
    return null;
  }

  get abominationSwallowedPetImages(): string[] {
    const name = this.formGroup?.get('name')?.value;
    if (name !== 'Abomination') {
      return [];
    }
    const values = [
      {
        name: this.formGroup.get('abominationSwallowedPet1')?.value,
        belugaSwallowed: this.formGroup.get(
          'abominationSwallowedPet1BelugaSwallowedPet',
        )?.value,
      },
      {
        name: this.formGroup.get('abominationSwallowedPet2')?.value,
        belugaSwallowed: this.formGroup.get(
          'abominationSwallowedPet2BelugaSwallowedPet',
        )?.value,
      },
      {
        name: this.formGroup.get('abominationSwallowedPet3')?.value,
        belugaSwallowed: this.formGroup.get(
          'abominationSwallowedPet3BelugaSwallowedPet',
        )?.value,
      },
    ];
    const images: string[] = [];
    for (const value of values) {
      if (!value.name) {
        continue;
      }
      const image = this.getPetImagePath(value.name);
      if (image) {
        images.push(image);
      }
      if (value.name === 'Beluga Whale' && value.belugaSwallowed) {
        const belugaImage = this.getPetImagePath(value.belugaSwallowed);
        if (belugaImage) {
          images.push(belugaImage);
        }
      }
    }
    return images;
  }

  get equipmentImageSrc(): string | null {
    const equipmentName = this.getSelectedEquipmentName();
    if (!equipmentName || this.ailmentEquipment?.has(equipmentName)) {
      return null;
    }
    return getEquipmentIconPath(equipmentName, false);
  }

  get ailmentImageSrc(): string | null {
    const equipmentName = this.getSelectedEquipmentName();
    if (!equipmentName || !this.ailmentEquipment?.has(equipmentName)) {
      return null;
    }
    return getEquipmentIconPath(equipmentName, true);
  }

  get equipmentSelected(): boolean {
    return !!this.getSelectedEquipmentName();
  }

  get equipmentHasUses(): boolean {
    const equipment = this.getSelectedEquipment();
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
      'padding-left': '2.5rem',
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

  getPetImagePath(petName?: string | null): string | null {
    if (!petName) {
      return null;
    }
    const fileName = getPetIconFileName(petName);
    if (!fileName) {
      return null;
    }
    return `assets/art/Public/Public/Pets/${fileName}.png`;
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
    if (
      triggers !== formValue.triggersConsumed &&
      formValue.triggersConsumed != null
    ) {
      this.formGroup
        .get('triggersConsumed')
        .setValue(triggers, { emitEvent: false });
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

  setParrotCopyPet(value: string) {
    let pet = this.player.getPet(this.index);
    if (pet == null) {
      return;
    }
    pet.parrotCopyPet = value;
    if (value !== 'Beluga Whale') {
      pet.parrotCopyPetBelugaSwallowedPet = null;
      this.formGroup
        .get('parrotCopyPetBelugaSwallowedPet')
        ?.setValue(null, { emitEvent: false });
    }
    if (value !== 'Abomination') {
      this.clearParrotCopyPetAbominationSettings(pet);
    }
  }

  setParrotCopyPetBelugaSwallowedPet(value: string) {
    let pet = this.player.getPet(this.index);
    if (pet == null) {
      return;
    }
    pet.parrotCopyPetBelugaSwallowedPet = value;
  }

  getParrotCopyAbominationSlotCount(): number {
    const exp = Number(this.formGroup.get('exp')?.value ?? 0);
    if (exp < 2) {
      return 1;
    }
    if (exp < 5) {
      return 2;
    }
    return 3;
  }

  setAbominationParrotCopySettings(value: any) {
    let pet = this.player.getPet(this.index);
    if (pet == null) {
      return;
    }
    const slots = [1, 2, 3];
    for (const slot of slots) {
      const base = `abominationSwallowedPet${slot}`;
      const swallowedName = this.formGroup.get(base)?.value;
      if (swallowedName !== 'Parrot') {
        this.clearAbominationParrotCopySettings(pet, slot);
        continue;
      }

      const parrotCopyPet =
        this.formGroup.get(`${base}ParrotCopyPet`)?.value ?? null;
      const parrotCopyBeluga =
        this.formGroup.get(`${base}ParrotCopyPetBelugaSwallowedPet`)?.value ??
        null;

      (pet as any)[`${base}ParrotCopyPet`] = parrotCopyPet;
      (pet as any)[`${base}ParrotCopyPetBelugaSwallowedPet`] =
        parrotCopyPet === 'Beluga Whale' ? parrotCopyBeluga : null;
      if (parrotCopyPet !== 'Beluga Whale') {
        this.formGroup
          .get(`${base}ParrotCopyPetBelugaSwallowedPet`)
          ?.setValue(null, { emitEvent: false });
      }

      if (parrotCopyPet !== 'Abomination') {
        this.clearAbominationParrotCopyAbominationSettings(pet, slot);
        continue;
      }

      for (let inner = 1; inner <= 3; inner++) {
        const innerBase = `${base}ParrotCopyPetAbominationSwallowedPet${inner}`;
        const innerName = this.formGroup.get(innerBase)?.value ?? null;
        const innerBeluga =
          this.formGroup.get(`${innerBase}BelugaSwallowedPet`)?.value ?? null;
        const innerLevel = Number(
          this.formGroup.get(`${innerBase}Level`)?.value ?? 1,
        );
        (pet as any)[innerBase] = innerName;
        (pet as any)[`${innerBase}BelugaSwallowedPet`] =
          innerName === 'Beluga Whale' ? innerBeluga : null;
        (pet as any)[`${innerBase}Level`] = innerLevel || 1;
        (pet as any)[`${innerBase}TimesHurt`] =
          this.getAbominationParrotCopyAbominationTimesHurtValue(
            `${innerBase}TimesHurt`,
          );

        if (innerName !== 'Beluga Whale') {
          this.formGroup
            .get(`${innerBase}BelugaSwallowedPet`)
            ?.setValue(null, { emitEvent: false });
        }
      }
    }
  }

  shouldShowAbominationParrotCopyAbominationTimesHurt(
    outerIndex: number,
    innerIndex: number,
  ): boolean {
    const control = this.formGroup.get(
      `abominationSwallowedPet${outerIndex}ParrotCopyPetAbominationSwallowedPet${innerIndex}`,
    );
    const name = control?.value;
    return name === 'Sabertooth Tiger' || name === 'Tuna';
  }

  private getAbominationParrotCopyAbominationTimesHurtValue(
    controlName: string,
  ): number {
    const control = this.formGroup.get(controlName);
    if (!control) {
      return 0;
    }
    const rawValue = Number(control.value);
    if (Number.isNaN(rawValue)) {
      return 0;
    }
    return Math.max(0, Math.min(99, rawValue));
  }

  private clearAbominationParrotCopySettings(pet: Pet, slot: number) {
    const base = `abominationSwallowedPet${slot}`;
    (pet as any)[`${base}ParrotCopyPet`] = null;
    (pet as any)[`${base}ParrotCopyPetBelugaSwallowedPet`] = null;
    this.formGroup
      .get(`${base}ParrotCopyPet`)
      ?.setValue(null, { emitEvent: false });
    this.formGroup
      .get(`${base}ParrotCopyPetBelugaSwallowedPet`)
      ?.setValue(null, { emitEvent: false });
    this.clearAbominationParrotCopyAbominationSettings(pet, slot);
  }

  private clearAbominationParrotCopyAbominationSettings(
    pet: Pet,
    slot: number,
  ) {
    for (let inner = 1; inner <= 3; inner++) {
      const innerBase = `abominationSwallowedPet${slot}ParrotCopyPetAbominationSwallowedPet${inner}`;
      (pet as any)[innerBase] = null;
      (pet as any)[`${innerBase}BelugaSwallowedPet`] = null;
      (pet as any)[`${innerBase}Level`] = 1;
      (pet as any)[`${innerBase}TimesHurt`] = 0;
      this.formGroup.get(innerBase)?.setValue(null, { emitEvent: false });
      this.formGroup
        .get(`${innerBase}BelugaSwallowedPet`)
        ?.setValue(null, { emitEvent: false });
      this.formGroup
        .get(`${innerBase}Level`)
        ?.setValue(1, { emitEvent: false });
      this.formGroup
        .get(`${innerBase}TimesHurt`)
        ?.setValue(0, { emitEvent: false });
    }
  }

  setParrotCopyPetAbominationSwallowedPets(value: any) {
    let pet = this.player.getPet(this.index);
    if (pet == null) {
      return;
    }
    const pet1 = this.formGroup.get(
      'parrotCopyPetAbominationSwallowedPet1',
    )?.value;
    const pet2 = this.formGroup.get(
      'parrotCopyPetAbominationSwallowedPet2',
    )?.value;
    const pet3 = this.formGroup.get(
      'parrotCopyPetAbominationSwallowedPet3',
    )?.value;
    const beluga1 =
      this.formGroup.get(
        'parrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet',
      )?.value ?? null;
    const beluga2 =
      this.formGroup.get(
        'parrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet',
      )?.value ?? null;
    const beluga3 =
      this.formGroup.get(
        'parrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet',
      )?.value ?? null;
    const level1 = Number(
      this.formGroup.get('parrotCopyPetAbominationSwallowedPet1Level')?.value ??
      1,
    );
    const level2 = Number(
      this.formGroup.get('parrotCopyPetAbominationSwallowedPet2Level')?.value ??
      1,
    );
    const level3 = Number(
      this.formGroup.get('parrotCopyPetAbominationSwallowedPet3Level')?.value ??
      1,
    );

    pet.parrotCopyPetAbominationSwallowedPet1 = pet1 ?? null;
    pet.parrotCopyPetAbominationSwallowedPet2 = pet2 ?? null;
    pet.parrotCopyPetAbominationSwallowedPet3 = pet3 ?? null;
    pet.parrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet =
      pet1 === 'Beluga Whale' ? beluga1 : null;
    pet.parrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet =
      pet2 === 'Beluga Whale' ? beluga2 : null;
    pet.parrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet =
      pet3 === 'Beluga Whale' ? beluga3 : null;
    if (pet1 !== 'Beluga Whale') {
      this.formGroup
        .get('parrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet')
        ?.setValue(null, { emitEvent: false });
    }
    if (pet2 !== 'Beluga Whale') {
      this.formGroup
        .get('parrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet')
        ?.setValue(null, { emitEvent: false });
    }
    if (pet3 !== 'Beluga Whale') {
      this.formGroup
        .get('parrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet')
        ?.setValue(null, { emitEvent: false });
    }
    pet.parrotCopyPetAbominationSwallowedPet1Level = level1 || 1;
    pet.parrotCopyPetAbominationSwallowedPet2Level = level2 || 1;
    pet.parrotCopyPetAbominationSwallowedPet3Level = level3 || 1;
    pet.parrotCopyPetAbominationSwallowedPet1TimesHurt =
      this.getParrotAbominationTimesHurtValue(
        'parrotCopyPetAbominationSwallowedPet1TimesHurt',
      );
    pet.parrotCopyPetAbominationSwallowedPet2TimesHurt =
      this.getParrotAbominationTimesHurtValue(
        'parrotCopyPetAbominationSwallowedPet2TimesHurt',
      );
    pet.parrotCopyPetAbominationSwallowedPet3TimesHurt =
      this.getParrotAbominationTimesHurtValue(
        'parrotCopyPetAbominationSwallowedPet3TimesHurt',
      );
    this.setParrotCopyPetAbominationParrotSettings(null);
  }

  setParrotCopyPetAbominationParrotSettings(value: any) {
    let pet = this.player.getPet(this.index);
    if (pet == null) {
      return;
    }
    for (let slot = 1; slot <= 3; slot++) {
      const base = `parrotCopyPetAbominationSwallowedPet${slot}`;
      const swallowedName = this.formGroup.get(base)?.value;
      if (swallowedName !== 'Parrot') {
        this.clearParrotCopyPetAbominationParrotSettings(pet, slot);
        continue;
      }

      const parrotCopyPet =
        this.formGroup.get(`${base}ParrotCopyPet`)?.value ?? null;
      const parrotCopyBeluga =
        this.formGroup.get(`${base}ParrotCopyPetBelugaSwallowedPet`)?.value ??
        null;

      (pet as any)[`${base}ParrotCopyPet`] = parrotCopyPet;
      (pet as any)[`${base}ParrotCopyPetBelugaSwallowedPet`] =
        parrotCopyPet === 'Beluga Whale' ? parrotCopyBeluga : null;
      if (parrotCopyPet !== 'Beluga Whale') {
        this.formGroup
          .get(`${base}ParrotCopyPetBelugaSwallowedPet`)
          ?.setValue(null, { emitEvent: false });
      }

      if (parrotCopyPet !== 'Abomination') {
        this.clearParrotCopyPetAbominationParrotAbominationSettings(pet, slot);
        continue;
      }

      for (let inner = 1; inner <= 3; inner++) {
        const innerBase = `${base}ParrotCopyPetAbominationSwallowedPet${inner}`;
        const innerName = this.formGroup.get(innerBase)?.value ?? null;
        const innerBeluga =
          this.formGroup.get(`${innerBase}BelugaSwallowedPet`)?.value ?? null;
        const innerLevel = Number(
          this.formGroup.get(`${innerBase}Level`)?.value ?? 1,
        );
        (pet as any)[innerBase] = innerName;
        (pet as any)[`${innerBase}BelugaSwallowedPet`] =
          innerName === 'Beluga Whale' ? innerBeluga : null;
        (pet as any)[`${innerBase}Level`] = innerLevel || 1;
        (pet as any)[`${innerBase}TimesHurt`] =
          this.getParrotCopyPetAbominationParrotAbominationTimesHurtValue(
            `${innerBase}TimesHurt`,
          );
        if (innerName !== 'Beluga Whale') {
          this.formGroup
            .get(`${innerBase}BelugaSwallowedPet`)
            ?.setValue(null, { emitEvent: false });
        }
      }
    }
  }

  shouldShowParrotCopyPetAbominationParrotAbominationTimesHurt(
    outerIndex: number,
    innerIndex: number,
  ): boolean {
    const control = this.formGroup.get(
      `parrotCopyPetAbominationSwallowedPet${outerIndex}ParrotCopyPetAbominationSwallowedPet${innerIndex}`,
    );
    const name = control?.value;
    return name === 'Sabertooth Tiger' || name === 'Tuna';
  }

  private getParrotCopyPetAbominationParrotAbominationTimesHurtValue(
    controlName: string,
  ): number {
    const control = this.formGroup.get(controlName);
    if (!control) {
      return 0;
    }
    const rawValue = Number(control.value);
    if (Number.isNaN(rawValue)) {
      return 0;
    }
    return Math.max(0, Math.min(99, rawValue));
  }

  private clearParrotCopyPetAbominationParrotSettings(pet: Pet, slot: number) {
    const base = `parrotCopyPetAbominationSwallowedPet${slot}`;
    (pet as any)[`${base}ParrotCopyPet`] = null;
    (pet as any)[`${base}ParrotCopyPetBelugaSwallowedPet`] = null;
    this.formGroup
      .get(`${base}ParrotCopyPet`)
      ?.setValue(null, { emitEvent: false });
    this.formGroup
      .get(`${base}ParrotCopyPetBelugaSwallowedPet`)
      ?.setValue(null, { emitEvent: false });
    this.clearParrotCopyPetAbominationParrotAbominationSettings(pet, slot);
  }

  private clearParrotCopyPetAbominationParrotAbominationSettings(
    pet: Pet,
    slot: number,
  ) {
    for (let inner = 1; inner <= 3; inner++) {
      const innerBase = `parrotCopyPetAbominationSwallowedPet${slot}ParrotCopyPetAbominationSwallowedPet${inner}`;
      (pet as any)[innerBase] = null;
      (pet as any)[`${innerBase}BelugaSwallowedPet`] = null;
      (pet as any)[`${innerBase}Level`] = 1;
      (pet as any)[`${innerBase}TimesHurt`] = 0;
      this.formGroup.get(innerBase)?.setValue(null, { emitEvent: false });
      this.formGroup
        .get(`${innerBase}BelugaSwallowedPet`)
        ?.setValue(null, { emitEvent: false });
      this.formGroup
        .get(`${innerBase}Level`)
        ?.setValue(1, { emitEvent: false });
      this.formGroup
        .get(`${innerBase}TimesHurt`)
        ?.setValue(0, { emitEvent: false });
    }
  }

  shouldShowParrotCopyPetAbominationTimesHurt(index: number): boolean {
    const control = this.formGroup.get(
      `parrotCopyPetAbominationSwallowedPet${index + 1}`,
    );
    const name = control?.value;
    return name === 'Sabertooth Tiger' || name === 'Tuna';
  }

  private getParrotAbominationTimesHurtValue(controlName: string): number {
    const control = this.formGroup.get(controlName);
    if (!control) {
      return 0;
    }
    const rawValue = Number(control.value);
    if (Number.isNaN(rawValue)) {
      return 0;
    }
    return Math.max(0, Math.min(99, rawValue));
  }

  private clearParrotCopyPetAbominationSettings(pet: Pet) {
    for (const field of PARROT_COPY_ABOMINATION_SWALLOWED_FIELDS) {
      const defaultValue = field.endsWith('Level')
        ? 1
        : field.endsWith('TimesHurt')
          ? 0
          : null;
      (pet as any)[field] = defaultValue;
      this.formGroup.get(field)?.setValue(defaultValue, { emitEvent: false });
    }
    for (let slot = 1; slot <= 3; slot++) {
      this.clearParrotCopyPetAbominationParrotSettings(pet, slot);
    }
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
    const pet1 = this.formGroup.get('abominationSwallowedPet1').value;
    const pet2 = this.formGroup.get('abominationSwallowedPet2').value;
    const pet3 = this.formGroup.get('abominationSwallowedPet3').value;
    const beluga1 =
      this.formGroup.get('abominationSwallowedPet1BelugaSwallowedPet')?.value ??
      null;
    const beluga2 =
      this.formGroup.get('abominationSwallowedPet2BelugaSwallowedPet')?.value ??
      null;
    const beluga3 =
      this.formGroup.get('abominationSwallowedPet3BelugaSwallowedPet')?.value ??
      null;
    const level1 = Number(
      this.formGroup.get('abominationSwallowedPet1Level').value ?? 1,
    );
    const level2 = Number(
      this.formGroup.get('abominationSwallowedPet2Level').value ?? 1,
    );
    const level3 = Number(
      this.formGroup.get('abominationSwallowedPet3Level').value ?? 1,
    );

    pet.abominationSwallowedPet1 = pet1 ?? null;
    pet.abominationSwallowedPet2 = pet2 ?? null;
    pet.abominationSwallowedPet3 = pet3 ?? null;
    pet.abominationSwallowedPet1BelugaSwallowedPet = beluga1;
    pet.abominationSwallowedPet2BelugaSwallowedPet = beluga2;
    pet.abominationSwallowedPet3BelugaSwallowedPet = beluga3;
    pet.abominationSwallowedPet1Level = level1 || 1;
    pet.abominationSwallowedPet2Level = level2 || 1;
    pet.abominationSwallowedPet3Level = level3 || 1;
    pet.abominationSwallowedPet1TimesHurt = this.getAbominationTimesHurtValue(
      'abominationSwallowedPet1TimesHurt',
    );
    pet.abominationSwallowedPet2TimesHurt = this.getAbominationTimesHurtValue(
      'abominationSwallowedPet2TimesHurt',
    );
    pet.abominationSwallowedPet3TimesHurt = this.getAbominationTimesHurtValue(
      'abominationSwallowedPet3TimesHurt',
    );
    this.setAbominationParrotCopySettings(null);
  }

  shouldShowAbominationSwallowTimesHurt(index: number): boolean {
    const control = this.formGroup.get(`abominationSwallowedPet${index + 1}`);
    const name = control?.value;
    return name === 'Sabertooth Tiger' || name === 'Tuna';
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

  private getAbominationTimesHurtValue(controlName: string): number {
    const control = this.formGroup.get(controlName);
    if (!control) {
      return 0;
    }
    const rawValue = Number(control.value);
    if (Number.isNaN(rawValue)) {
      return 0;
    }
    return Math.max(0, Math.min(99, rawValue));
  }

  removePet() {
    this.player.setPet(this.index, null, true);
    this.formGroup.get('name').setValue(null, { emitEvent: false });
    this.formGroup.get('attack').setValue(0, { emitEvent: false });
    this.formGroup.get('health').setValue(0, { emitEvent: false });
    this.formGroup.get('exp').setValue(0, { emitEvent: false });
    this.formGroup.get('equipment').setValue(null, { emitEvent: false });
    this.formGroup.get('equipmentUses').setValue(null, { emitEvent: false });
    this.formGroup.get('mana').setValue(0, { emitEvent: false });
    this.formGroup.get('triggersConsumed').setValue(0, { emitEvent: false });
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

  private normalizeEquipmentValue(value: any): string | null {
    if (!value) {
      return null;
    }
    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'object' && typeof value.name === 'string') {
      return value.name;
    }
    return null;
  }

  private getSelectedEquipmentName(): string | null {
    return this.normalizeEquipmentValue(
      this.formGroup?.get('equipment')?.value,
    );
  }

  private getSelectedEquipment(): Equipment | null {
    const name = this.getSelectedEquipmentName();
    if (!name) {
      return null;
    }
    return this.equipment.get(name) ?? this.ailmentEquipment.get(name) ?? null;
  }
}
