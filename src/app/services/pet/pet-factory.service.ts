import { Injectable } from '@angular/core';
import { Pet } from '../../classes/pet.class';
import { Player } from '../../classes/player.class';
import { Equipment } from '../../classes/equipment.class';
import { LogService } from '../log.service';
import { AbilityService } from '../ability/ability.service';
import { GameService } from '../game.service';
import { levelToExp } from '../../util/leveling';
import { EquipmentService } from '../equipment/equipment.service';
import { cloneEquipment } from '../../util/equipment-utils';
import { InjectorService } from '../injector.service';
import {
  PetFactoryDeps,
  PETS_NEEDING_PETSERVICE,
  PETS_NEEDING_GAMESERVICE,
  PETS_NEEDING_PETSERVICE_TYPES,
  PETS_NEEDING_GAMESERVICE_TYPES,
  SPECIAL_FORM_PET_BUILDERS,
} from './pet-factory-registry';

export interface PetForm {
  name: string;
  attack?: number | null;
  health?: number | null;
  mana?: number | null;
  triggersConsumed?: number;
  exp: number;
  hasRandomEvents?: boolean;
  equipment?: string | Equipment | { name?: string } | null;
  belugaSwallowedPet?: string;
  parrotCopyPet?: string;
  parrotCopyPetBelugaSwallowedPet?: string;
  parrotCopyPetAbominationSwallowedPet1?: string | null;
  parrotCopyPetAbominationSwallowedPet2?: string | null;
  parrotCopyPetAbominationSwallowedPet3?: string | null;
  parrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet?: string | null;
  parrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet?: string | null;
  parrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet?: string | null;
  parrotCopyPetAbominationSwallowedPet1Level?: number;
  parrotCopyPetAbominationSwallowedPet2Level?: number;
  parrotCopyPetAbominationSwallowedPet3Level?: number;
  parrotCopyPetAbominationSwallowedPet1TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet2TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet3TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPet?: string | null;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPet?: string | null;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPet?: string | null;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet?:
  | string
  | null;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet?:
  | string
  | null;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet?:
  | string
  | null;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1?:
  | string
  | null;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2?:
  | string
  | null;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3?:
  | string
  | null;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1?:
  | string
  | null;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2?:
  | string
  | null;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3?:
  | string
  | null;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1?:
  | string
  | null;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2?:
  | string
  | null;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3?:
  | string
  | null;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet?:
  | string
  | null;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet?:
  | string
  | null;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet?:
  | string
  | null;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet?:
  | string
  | null;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet?:
  | string
  | null;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet?:
  | string
  | null;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet?:
  | string
  | null;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet?:
  | string
  | null;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet?:
  | string
  | null;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level?: number;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level?: number;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level?: number;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level?: number;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level?: number;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level?: number;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level?: number;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level?: number;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level?: number;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt?: number;
  sarcasticFringeheadSwallowedPet?: string;
  abominationSwallowedPet1?: string;
  abominationSwallowedPet2?: string;
  abominationSwallowedPet3?: string;
  abominationSwallowedPet1BelugaSwallowedPet?: string | null;
  abominationSwallowedPet2BelugaSwallowedPet?: string | null;
  abominationSwallowedPet3BelugaSwallowedPet?: string | null;
  abominationSwallowedPet1ParrotCopyPet?: string | null;
  abominationSwallowedPet2ParrotCopyPet?: string | null;
  abominationSwallowedPet3ParrotCopyPet?: string | null;
  abominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet?: string | null;
  abominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet?: string | null;
  abominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet?: string | null;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1?: string | null;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2?: string | null;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3?: string | null;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1?: string | null;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2?: string | null;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3?: string | null;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1?: string | null;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2?: string | null;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3?: string | null;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet?:
  | string
  | null;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet?:
  | string
  | null;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet?:
  | string
  | null;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet?:
  | string
  | null;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet?:
  | string
  | null;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet?:
  | string
  | null;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet?:
  | string
  | null;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet?:
  | string
  | null;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet?:
  | string
  | null;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level?: number;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level?: number;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level?: number;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level?: number;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level?: number;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level?: number;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level?: number;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level?: number;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level?: number;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt?: number;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt?: number;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt?: number;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt?: number;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt?: number;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt?: number;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt?: number;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt?: number;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt?: number;
  abominationSwallowedPet1Level?: number;
  abominationSwallowedPet2Level?: number;
  abominationSwallowedPet3Level?: number;
  abominationSwallowedPet1TimesHurt?: number;
  abominationSwallowedPet2TimesHurt?: number;
  abominationSwallowedPet3TimesHurt?: number;
  battlesFought?: number;
  timesHurt?: number;
  friendsDiedBeforeBattle?: number;
  equipmentUses?: number;
}


const PET_INDEXES = [1, 2, 3] as const;

type PetFormField = keyof PetForm;

const buildParrotFormFields = (): ReadonlyArray<PetFormField> => {
  const fields: PetFormField[] = [
    'parrotCopyPet',
    'parrotCopyPetBelugaSwallowedPet',
  ];

  for (const i of PET_INDEXES) {
    fields.push(`parrotCopyPetAbominationSwallowedPet${i}` as PetFormField);
    fields.push(
      `parrotCopyPetAbominationSwallowedPet${i}BelugaSwallowedPet` as PetFormField,
    );
    fields.push(
      `parrotCopyPetAbominationSwallowedPet${i}Level` as PetFormField,
    );
    fields.push(
      `parrotCopyPetAbominationSwallowedPet${i}TimesHurt` as PetFormField,
    );
    fields.push(
      `parrotCopyPetAbominationSwallowedPet${i}ParrotCopyPet` as PetFormField,
    );
    fields.push(
      `parrotCopyPetAbominationSwallowedPet${i}ParrotCopyPetBelugaSwallowedPet` as PetFormField,
    );

    for (const j of PET_INDEXES) {
      fields.push(
        `parrotCopyPetAbominationSwallowedPet${i}ParrotCopyPetAbominationSwallowedPet${j}` as PetFormField,
      );
      fields.push(
        `parrotCopyPetAbominationSwallowedPet${i}ParrotCopyPetAbominationSwallowedPet${j}BelugaSwallowedPet` as PetFormField,
      );
      fields.push(
        `parrotCopyPetAbominationSwallowedPet${i}ParrotCopyPetAbominationSwallowedPet${j}Level` as PetFormField,
      );
      fields.push(
        `parrotCopyPetAbominationSwallowedPet${i}ParrotCopyPetAbominationSwallowedPet${j}TimesHurt` as PetFormField,
      );
    }
  }

  return fields;
};

const buildAbominationFormFields = (): ReadonlyArray<PetFormField> => {
  const fields: PetFormField[] = [];

  for (const i of PET_INDEXES) {
    fields.push(
      `abominationSwallowedPet${i}BelugaSwallowedPet` as PetFormField,
    );
    fields.push(`abominationSwallowedPet${i}ParrotCopyPet` as PetFormField);
    fields.push(
      `abominationSwallowedPet${i}ParrotCopyPetBelugaSwallowedPet` as PetFormField,
    );

    for (const j of PET_INDEXES) {
      fields.push(
        `abominationSwallowedPet${i}ParrotCopyPetAbominationSwallowedPet${j}` as PetFormField,
      );
      fields.push(
        `abominationSwallowedPet${i}ParrotCopyPetAbominationSwallowedPet${j}BelugaSwallowedPet` as PetFormField,
      );
      fields.push(
        `abominationSwallowedPet${i}ParrotCopyPetAbominationSwallowedPet${j}Level` as PetFormField,
      );
      fields.push(
        `abominationSwallowedPet${i}ParrotCopyPetAbominationSwallowedPet${j}TimesHurt` as PetFormField,
      );
    }
  }

  return fields;
};

const PARROT_FORM_FIELDS = buildParrotFormFields();
const ABOMINATION_FORM_FIELDS = buildAbominationFormFields();

const isNonDefaultPetFormValue = (
  field: keyof PetForm,
  value: unknown,
): boolean => {
  if (value == null) {
    return false;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return false;
  }
  const fieldName = String(field);
  if (fieldName.endsWith('Level')) {
    const numeric = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(numeric) ? numeric !== 1 : false;
  }
  if (fieldName.endsWith('TimesHurt')) {
    const numeric = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(numeric) ? numeric !== 0 : false;
  }
  return true;
};

function hasNonDefaultFormValue(
  petForm: PetForm,
  fields: ReadonlyArray<keyof PetForm>,
): boolean {
  for (const field of fields) {
    const value = (petForm as any)[field];
    if (isNonDefaultPetFormValue(field, value)) {
      return true;
    }
  }
  return false;
}

function copyPetFormFields(
  target: Pet,
  petForm: PetForm,
  fields: ReadonlyArray<keyof PetForm>,
): void {
  for (const field of fields) {
    const value = (petForm as any)[field];
    if (value != null) {
      (target as any)[field] = value;
      continue;
    }
    const fieldName = String(field);
    if (fieldName.endsWith('Level')) {
      (target as any)[field] = 1;
      continue;
    }
    if (fieldName.endsWith('TimesHurt')) {
      (target as any)[field] = 0;
      continue;
    }
    (target as any)[field] = null;
  }
}

@Injectable({
  providedIn: 'root',
})
export class PetFactoryService {

  private equipmentCache = new Map<string, Equipment>();

  constructor(
    private logService: LogService,
    private abilityService: AbilityService,
    private gameService: GameService,
    private equipmentService: EquipmentService,
  ) { }

  /**
   * Creates a pet from a Pet instance (cloning). Used by createDefaultVersionOfPet.
   */
  createPet(
    originalPet: Pet,
    petService: any,
    attack?: number,
    health?: number,
    exp?: number,
  ): Pet {
    const PetClass = originalPet.constructor as any;
    const parent = originalPet.parent;
    const xp = exp ?? levelToExp(originalPet.level);

    // Special Cases requiring PetService + GameService
    for (const GameServicePet of PETS_NEEDING_GAMESERVICE_TYPES) {
      if (originalPet instanceof GameServicePet) {
        return new GameServicePet(
          this.logService,
          this.abilityService,
          petService,
          this.gameService,
          parent,
          health,
          attack,
          0,
          xp,
        );
      }
    }

    if (PETS_NEEDING_PETSERVICE_TYPES.includes(PetClass)) {
      return new PetClass(
        this.logService,
        this.abilityService,
        petService,
        parent,
        health,
        attack,
        0,
        xp,
      );
    }

    // Generic Case
    return new PetClass(
      this.logService,
      this.abilityService,
      parent,
      health,
      attack,
      0,
      xp,
    );
  }

  /**
   * Creates a pet from a PetForm object. Used by createPet in PetService.
   */
  createPetFromForm(
    petForm: PetForm,
    parent: Player,
    petService: any,
    registry: { [key: string]: any },
  ): Pet {
    const plan = this.getPetBuildPlan(petForm, registry);
    const equipment = this.resolveEquipment(
      plan.equipmentValue,
      plan.equipmentUses,
    );
    const { name, health, attack, mana, exp, triggersConsumed } = petForm;
    let hasRandomEvents = petForm.hasRandomEvents;
    if (hasRandomEvents === undefined && petService && typeof petService.isPetRandom === 'function') {
      hasRandomEvents = petService.isPetRandom(name);
    }

    const applySarcasticSetting = (pet: Pet) => {
      if (pet && (plan.hasSarcastic || plan.hasFriendsDied)) {
        pet.sarcasticFringeheadSwallowedPet =
          petForm.sarcasticFringeheadSwallowedPet ?? null;
        pet.friendsDiedBeforeBattle = petForm.friendsDiedBeforeBattle ?? 0;
      }
      return pet;
    };
    const finalizePet = (pet: Pet) => {
      if (!pet) {
        return pet;
      }
      if (plan.hasTimesHurt && petForm.timesHurt != null) {
        pet.timesHurt = petForm.timesHurt;
        pet.originalTimesHurt = petForm.timesHurt;
      }
      if (hasRandomEvents) {
        pet.hasRandomEvents = true;
      }
      return pet;
    };
    const applyAbominationBelugaSwallows = (petInstance: Pet) => {
      if (!plan.hasAbominationData || petInstance?.name !== 'Abomination') {
        return petInstance;
      }
      copyPetFormFields(petInstance, petForm, ABOMINATION_FORM_FIELDS);
      return petInstance;
    };
    const applyParrotCopyPet = (petInstance: Pet) => {
      if (!plan.hasParrotData || petInstance?.name !== 'Parrot') {
        return petInstance;
      }
      copyPetFormFields(petInstance, petForm, PARROT_FORM_FIELDS);
      return petInstance;
    };
    const buildPetInstance = (petInstance: Pet) => {
      if (!petInstance) {
        return petInstance;
      }
      if (!plan.needsPostInit) {
        return petInstance;
      }
      const withEquipment = plan.hasEquipmentUses
        ? this.applyEquipmentUsesOverride(petInstance, petForm)
        : petInstance;
      return finalizePet(
        applyParrotCopyPet(
          applySarcasticSetting(applyAbominationBelugaSwallows(withEquipment)),
        ),
      );
    };

    // Check if pet needs GameService (highest priority)
    if (plan.builderKind === 'gameservice' && plan.PetClass) {
      const petInstance = new plan.PetClass(
        this.logService,
        this.abilityService,
        petService,
        this.gameService,
        parent,
        health,
        attack,
        mana,
        exp,
        equipment,
        triggersConsumed,
      );
      return buildPetInstance(petInstance);
    }

    if (plan.builderKind === 'special' && plan.specialBuilder) {
      const deps: PetFactoryDeps = {
        logService: this.logService,
        abilityService: this.abilityService,
        gameService: this.gameService,
      };
      const petFormWithEquipment = { ...petForm, equipment };
      const petInstance = plan.specialBuilder(
        deps,
        petFormWithEquipment,
        parent,
        petService,
      );
      return buildPetInstance(petInstance);
    }

    if (plan.builderKind === 'petservice' && plan.PetClass) {
      const petInstance = new plan.PetClass(
        this.logService,
        this.abilityService,
        petService,
        parent,
        health,
        attack,
        mana,
        exp,
        equipment,
        triggersConsumed,
      );
      return buildPetInstance(petInstance);
    }

    if (plan.builderKind === 'registry' && plan.PetClass) {
      const petInstance = new plan.PetClass(
        this.logService,
        this.abilityService,
        parent,
        health,
        attack,
        mana,
        exp,
        equipment,
        triggersConsumed,
      );
      return buildPetInstance(petInstance);
    }

    // Should not reach here if registry is complete
    return null;
  }

  private applyEquipmentUsesOverride(pet: Pet, petForm: PetForm): Pet {
    if (!pet) {
      return pet;
    }
    if (petForm.equipmentUses != null) {
      (pet as any).equipmentUsesOverride = petForm.equipmentUses;
    }
    return pet;
  }

  public resolveEquipmentFromForm(
    equipmentValue: string | Equipment | { name?: string } | null | undefined,
    equipmentUses?: number | null,
  ): Equipment | null {
    return this.resolveEquipment(equipmentValue, equipmentUses);
  }

  private resolveEquipment(
    equipmentValue: string | Equipment | { name?: string } | null | undefined,
    equipmentUses?: number | null,
  ): Equipment | null {
    const explicitUses =
      equipmentUses == null
        ? typeof (equipmentValue as { uses?: number })?.uses === 'number'
          ? (equipmentValue as { uses?: number }).uses
          : null
        : equipmentUses;
    if (equipmentValue instanceof Equipment) {
      const clone = cloneEquipment(equipmentValue);
      if (explicitUses != null) {
        const usesValue = Number(explicitUses);
        if (Number.isFinite(usesValue)) {
          clone.uses = usesValue;
          clone.originalUses = usesValue;
        }
      }
      return clone;
    }
    const equipmentName = this.getEquipmentName(equipmentValue);
    if (!equipmentName) {
      return null;
    }
    const injector = InjectorService.getInjector();
    const equipmentService =
      this.equipmentService ??
      (injector ? injector.get(EquipmentService) : null);
    if (!equipmentService) {
      return null;
    }
    const equipmentMap = equipmentService.getInstanceOfAllEquipment();
    const ailmentMap = equipmentService.getInstanceOfAllAilments();
    const baseEquipment =
      equipmentMap.get(equipmentName) ?? ailmentMap.get(equipmentName);
    if (!baseEquipment) {
      return null;
    }
    const clone = cloneEquipment(baseEquipment);
    if (explicitUses != null) {
      const usesValue = Number(explicitUses);
      if (Number.isFinite(usesValue)) {
        clone.uses = usesValue;
        clone.originalUses = usesValue;
      }
    }
    return clone;
  }

  private getEquipmentName(
    equipmentValue: string | Equipment | { name?: string } | null | undefined,
  ): string | null {
    if (!equipmentValue) {
      return null;
    }
    if (typeof equipmentValue === 'string') {
      return equipmentValue;
    }
    const name =
      typeof (equipmentValue as { name?: string }).name === 'string'
        ? (equipmentValue as { name?: string }).name
        : null;
    return name || null;
  }

  private getPetBuildPlan(
    petForm: PetForm,
    registry: { [key: string]: any },
  ): PetBuildPlan {


    const name = petForm.name;
    const hasEquipmentUses = petForm.equipmentUses != null;
    const hasParrotData =
      petForm.name === 'Parrot' &&
      hasNonDefaultFormValue(petForm, PARROT_FORM_FIELDS);
    const hasAbominationData =
      petForm.name === 'Abomination' &&
      hasNonDefaultFormValue(petForm, ABOMINATION_FORM_FIELDS);
    const hasSarcastic = petForm.sarcasticFringeheadSwallowedPet != null;
    const hasFriendsDied = (petForm.friendsDiedBeforeBattle ?? 0) > 0;
    const hasTimesHurt = (petForm.timesHurt ?? 0) > 0;
    const needsPostInit =
      hasEquipmentUses ||
      hasParrotData ||
      hasAbominationData ||
      hasSarcastic ||
      hasFriendsDied ||
      hasTimesHurt;

    let builderKind: PetBuildPlan['builderKind'] = 'missing';
    let PetClass: PetBuildPlan['PetClass'];
    let specialBuilder: PetBuildPlan['specialBuilder'];

    if (PETS_NEEDING_GAMESERVICE[name]) {
      builderKind = 'gameservice';
      PetClass = PETS_NEEDING_GAMESERVICE[name];
    } else if (SPECIAL_FORM_PET_BUILDERS[name]) {
      builderKind = 'special';
      specialBuilder = SPECIAL_FORM_PET_BUILDERS[name];
    } else if (PETS_NEEDING_PETSERVICE[name]) {
      builderKind = 'petservice';
      PetClass = PETS_NEEDING_PETSERVICE[name];
    } else if (registry[name]) {
      builderKind = 'registry';
      PetClass = registry[name];
    }

    const plan: PetBuildPlan = {
      name,
      builderKind,
      PetClass,
      specialBuilder,
      needsPostInit,
      hasParrotData,
      hasAbominationData,
      hasSarcastic,
      hasFriendsDied,
      hasTimesHurt,
      hasEquipmentUses,
      equipmentValue: petForm.equipment ?? null,
      equipmentUses: petForm.equipmentUses ?? null,
    };


    return plan;
  }


}

type PetBuildPlan = {
  name: string;
  builderKind: 'gameservice' | 'special' | 'petservice' | 'registry' | 'missing';
  PetClass?: any;
  specialBuilder?: any;
  needsPostInit: boolean;
  hasParrotData: boolean;
  hasAbominationData: boolean;
  hasSarcastic: boolean;
  hasFriendsDied: boolean;
  hasTimesHurt: boolean;
  hasEquipmentUses: boolean;
  equipmentValue: PetForm['equipment'] | null;
  equipmentUses: number | null;
};
