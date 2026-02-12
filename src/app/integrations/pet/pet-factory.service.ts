import { Injectable } from '@angular/core';
import { Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Equipment } from 'app/domain/entities/equipment.class';
import { LogService } from '../log.service';
import { AbilityService } from '../ability/ability.service';
import { GameService } from 'app/runtime/state/game.service';
import { levelToExp } from 'app/runtime/experience';
import { EquipmentService } from '../equipment/equipment.service';
import { cloneEquipment } from 'app/runtime/equipment-clone';
import { InjectorService } from '../injector.service';
import { PetForm } from './pet-form.interface';
export type { PetForm } from './pet-form.interface';
import {
  ABOMINATION_FORM_FIELDS,
  PARROT_FORM_FIELDS,
  copyPetFormFields,
  hasNonDefaultFormValue,
} from './pet-factory-form-fields';
import {
  PetFactoryDeps,
  PetFactoryPetService,
  PETS_NEEDING_PETSERVICE,
  PETS_NEEDING_GAMESERVICE,
  PETS_NEEDING_PETSERVICE_TYPES,
  PETS_NEEDING_GAMESERVICE_TYPES,
  SpecialFormPetBuilder,
  SPECIAL_FORM_PET_BUILDERS,
} from './pet-factory-registry';
import { PetConstructor, PetRegistryMap } from './pet-registry.types';

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
    petService: PetFactoryPetService,
    attack?: number,
    health?: number,
    exp?: number,
  ): Pet {
    const PetClass = originalPet.constructor as unknown as PetConstructor;
    const parent = originalPet.parent;
    const xp = exp ?? levelToExp(originalPet.level);

    // Special Cases requiring PetService + GameService
    for (const gameServicePetCtor of PETS_NEEDING_GAMESERVICE_TYPES) {
      const GameServicePet = gameServicePetCtor as PetConstructor;
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
    petService: PetFactoryPetService,
    registry: PetRegistryMap,
  ): Pet | null {
    const plan = this.getPetBuildPlan(petForm, registry);
    const equipment = this.resolveEquipment(
      plan.equipmentValue,
      plan.equipmentUses,
    );
    const { name, health, attack, mana, exp, triggersConsumed, foodsEaten } = petForm;
    let hasRandomEvents = petForm.hasRandomEvents;
    if (
      hasRandomEvents === undefined &&
      typeof petService.isPetRandom === 'function'
    ) {
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
      if (foodsEaten != null) {
        const value = Number(foodsEaten);
        if (Number.isFinite(value)) {
          pet.foodsEaten = value;
          pet.originalFoodsEaten = value;
        }
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
      const PetClass = plan.PetClass as PetConstructor;
      const petInstance = new PetClass(
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
      const PetClass = plan.PetClass as PetConstructor;
      const petInstance = new PetClass(
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
      const PetClass = plan.PetClass as PetConstructor;
      const petInstance = new PetClass(
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
      pet.equipmentUsesOverride = petForm.equipmentUses;
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
    registry: PetRegistryMap,
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
    const hasFoodsEaten = petForm.foodsEaten != null;
    const needsPostInit =
      hasEquipmentUses ||
      hasParrotData ||
      hasAbominationData ||
      hasSarcastic ||
      hasFriendsDied ||
      hasTimesHurt ||
      hasFoodsEaten;

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
  PetClass?: unknown;
  specialBuilder?: SpecialFormPetBuilder;
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




