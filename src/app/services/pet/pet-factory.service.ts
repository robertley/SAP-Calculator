import { Injectable } from '@angular/core';
import { Pet } from '../../classes/pet.class';
import { Player } from '../../classes/player.class';
import { Equipment } from '../../classes/equipment.class';
import { LogService } from '../log.service';
import { AbilityService } from '../ability/ability.service';
import { GameService } from '../game.service';
import { levelToExp } from '../../util/leveling';
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
  equipment?: Equipment | null;
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

@Injectable({
  providedIn: 'root',
})
export class PetFactoryService {
  constructor(
    private logService: LogService,
    private abilityService: AbilityService,
    private gameService: GameService,
  ) {}

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
    const { name, health, attack, mana, exp, equipment, triggersConsumed } =
      petForm;
    const deps: PetFactoryDeps = {
      logService: this.logService,
      abilityService: this.abilityService,
      gameService: this.gameService,
    };

    const applySarcasticSetting = (pet: Pet) => {
      if (pet) {
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
      if (petForm.timesHurt != null) {
        pet.timesHurt = petForm.timesHurt;
        pet.originalTimesHurt = petForm.timesHurt;
      }
      return pet;
    };
    const applyAbominationBelugaSwallows = (petInstance: Pet) => {
      if (petInstance?.name !== 'Abomination') {
        return petInstance;
      }
      petInstance.abominationSwallowedPet1BelugaSwallowedPet =
        petForm.abominationSwallowedPet1BelugaSwallowedPet ?? null;
      petInstance.abominationSwallowedPet2BelugaSwallowedPet =
        petForm.abominationSwallowedPet2BelugaSwallowedPet ?? null;
      petInstance.abominationSwallowedPet3BelugaSwallowedPet =
        petForm.abominationSwallowedPet3BelugaSwallowedPet ?? null;
      petInstance.abominationSwallowedPet1ParrotCopyPet =
        petForm.abominationSwallowedPet1ParrotCopyPet ?? null;
      petInstance.abominationSwallowedPet2ParrotCopyPet =
        petForm.abominationSwallowedPet2ParrotCopyPet ?? null;
      petInstance.abominationSwallowedPet3ParrotCopyPet =
        petForm.abominationSwallowedPet3ParrotCopyPet ?? null;
      petInstance.abominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet =
        petForm.abominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet ?? null;
      petInstance.abominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet =
        petForm.abominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet ?? null;
      petInstance.abominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet =
        petForm.abominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet ?? null;
      petInstance.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1 =
        petForm.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1 ??
        null;
      petInstance.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2 =
        petForm.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2 ??
        null;
      petInstance.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3 =
        petForm.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3 ??
        null;
      petInstance.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1 =
        petForm.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1 ??
        null;
      petInstance.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2 =
        petForm.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2 ??
        null;
      petInstance.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3 =
        petForm.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3 ??
        null;
      petInstance.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1 =
        petForm.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1 ??
        null;
      petInstance.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2 =
        petForm.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2 ??
        null;
      petInstance.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3 =
        petForm.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3 ??
        null;
      petInstance.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet =
        petForm.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ??
        null;
      petInstance.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet =
        petForm.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ??
        null;
      petInstance.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet =
        petForm.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ??
        null;
      petInstance.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet =
        petForm.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ??
        null;
      petInstance.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet =
        petForm.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ??
        null;
      petInstance.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet =
        petForm.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ??
        null;
      petInstance.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet =
        petForm.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ??
        null;
      petInstance.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet =
        petForm.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ??
        null;
      petInstance.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet =
        petForm.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ??
        null;
      petInstance.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level =
        petForm.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level ??
        1;
      petInstance.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level =
        petForm.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level ??
        1;
      petInstance.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level =
        petForm.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level ??
        1;
      petInstance.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level =
        petForm.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level ??
        1;
      petInstance.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level =
        petForm.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level ??
        1;
      petInstance.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level =
        petForm.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level ??
        1;
      petInstance.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level =
        petForm.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level ??
        1;
      petInstance.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level =
        petForm.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level ??
        1;
      petInstance.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level =
        petForm.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level ??
        1;
      petInstance.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt =
        petForm.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt ??
        0;
      petInstance.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt =
        petForm.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt ??
        0;
      petInstance.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt =
        petForm.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt ??
        0;
      petInstance.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt =
        petForm.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt ??
        0;
      petInstance.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt =
        petForm.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt ??
        0;
      petInstance.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt =
        petForm.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt ??
        0;
      petInstance.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt =
        petForm.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt ??
        0;
      petInstance.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt =
        petForm.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt ??
        0;
      petInstance.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt =
        petForm.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt ??
        0;
      return petInstance;
    };
    const applyParrotCopyPet = (petInstance: Pet) => {
      if (petInstance?.name !== 'Parrot') {
        return petInstance;
      }
      petInstance.parrotCopyPet = petForm.parrotCopyPet ?? null;
      petInstance.parrotCopyPetBelugaSwallowedPet =
        petForm.parrotCopyPetBelugaSwallowedPet ?? null;
      petInstance.parrotCopyPetAbominationSwallowedPet1 =
        petForm.parrotCopyPetAbominationSwallowedPet1 ?? null;
      petInstance.parrotCopyPetAbominationSwallowedPet2 =
        petForm.parrotCopyPetAbominationSwallowedPet2 ?? null;
      petInstance.parrotCopyPetAbominationSwallowedPet3 =
        petForm.parrotCopyPetAbominationSwallowedPet3 ?? null;
      petInstance.parrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet =
        petForm.parrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ?? null;
      petInstance.parrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet =
        petForm.parrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ?? null;
      petInstance.parrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet =
        petForm.parrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ?? null;
      petInstance.parrotCopyPetAbominationSwallowedPet1Level =
        petForm.parrotCopyPetAbominationSwallowedPet1Level ?? 1;
      petInstance.parrotCopyPetAbominationSwallowedPet2Level =
        petForm.parrotCopyPetAbominationSwallowedPet2Level ?? 1;
      petInstance.parrotCopyPetAbominationSwallowedPet3Level =
        petForm.parrotCopyPetAbominationSwallowedPet3Level ?? 1;
      petInstance.parrotCopyPetAbominationSwallowedPet1TimesHurt =
        petForm.parrotCopyPetAbominationSwallowedPet1TimesHurt ?? 0;
      petInstance.parrotCopyPetAbominationSwallowedPet2TimesHurt =
        petForm.parrotCopyPetAbominationSwallowedPet2TimesHurt ?? 0;
      petInstance.parrotCopyPetAbominationSwallowedPet3TimesHurt =
        petForm.parrotCopyPetAbominationSwallowedPet3TimesHurt ?? 0;
      petInstance.parrotCopyPetAbominationSwallowedPet1ParrotCopyPet =
        petForm.parrotCopyPetAbominationSwallowedPet1ParrotCopyPet ?? null;
      petInstance.parrotCopyPetAbominationSwallowedPet2ParrotCopyPet =
        petForm.parrotCopyPetAbominationSwallowedPet2ParrotCopyPet ?? null;
      petInstance.parrotCopyPetAbominationSwallowedPet3ParrotCopyPet =
        petForm.parrotCopyPetAbominationSwallowedPet3ParrotCopyPet ?? null;
      petInstance.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet =
        petForm.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet ??
        null;
      petInstance.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet =
        petForm.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet ??
        null;
      petInstance.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet =
        petForm.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet ??
        null;
      petInstance.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1 =
        petForm.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1 ??
        null;
      petInstance.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2 =
        petForm.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2 ??
        null;
      petInstance.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3 =
        petForm.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3 ??
        null;
      petInstance.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1 =
        petForm.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1 ??
        null;
      petInstance.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2 =
        petForm.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2 ??
        null;
      petInstance.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3 =
        petForm.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3 ??
        null;
      petInstance.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1 =
        petForm.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1 ??
        null;
      petInstance.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2 =
        petForm.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2 ??
        null;
      petInstance.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3 =
        petForm.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3 ??
        null;
      petInstance.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet =
        petForm.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ??
        null;
      petInstance.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet =
        petForm.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ??
        null;
      petInstance.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet =
        petForm.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ??
        null;
      petInstance.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet =
        petForm.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ??
        null;
      petInstance.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet =
        petForm.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ??
        null;
      petInstance.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet =
        petForm.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ??
        null;
      petInstance.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet =
        petForm.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ??
        null;
      petInstance.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet =
        petForm.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ??
        null;
      petInstance.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet =
        petForm.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ??
        null;
      petInstance.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level =
        petForm.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level ??
        1;
      petInstance.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level =
        petForm.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level ??
        1;
      petInstance.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level =
        petForm.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level ??
        1;
      petInstance.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level =
        petForm.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level ??
        1;
      petInstance.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level =
        petForm.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level ??
        1;
      petInstance.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level =
        petForm.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level ??
        1;
      petInstance.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level =
        petForm.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level ??
        1;
      petInstance.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level =
        petForm.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level ??
        1;
      petInstance.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level =
        petForm.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level ??
        1;
      petInstance.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt =
        petForm.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt ??
        0;
      petInstance.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt =
        petForm.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt ??
        0;
      petInstance.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt =
        petForm.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt ??
        0;
      petInstance.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt =
        petForm.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt ??
        0;
      petInstance.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt =
        petForm.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt ??
        0;
      petInstance.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt =
        petForm.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt ??
        0;
      petInstance.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt =
        petForm.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt ??
        0;
      petInstance.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt =
        petForm.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt ??
        0;
      petInstance.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt =
        petForm.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt ??
        0;
      return petInstance;
    };
    const buildPetInstance = (petInstance: Pet) => {
      if (!petInstance) {
        return petInstance;
      }
      const withEquipment = this.applyEquipmentUsesOverride(
        petInstance,
        petForm,
      );
      return finalizePet(
        applyParrotCopyPet(
          applySarcasticSetting(applyAbominationBelugaSwallows(withEquipment)),
        ),
      );
    };

    // Check if pet needs GameService (highest priority)
    if (PETS_NEEDING_GAMESERVICE[name]) {
      const PetClass = PETS_NEEDING_GAMESERVICE[name];
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

    // Special handling for pets with extra parameters
    const specialBuilder = SPECIAL_FORM_PET_BUILDERS[name];
    if (specialBuilder) {
      const petInstance = specialBuilder(deps, petForm, parent, petService);
      return buildPetInstance(petInstance);
    }

    // Check if pet needs PetService
    if (PETS_NEEDING_PETSERVICE[name]) {
      const PetClass = PETS_NEEDING_PETSERVICE[name];
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

    // Generic case using registry
    const PetClass = registry[name];
    if (PetClass) {
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
      (pet as any).equipmentUsesOverride = petForm.equipmentUses;
    }
    return pet;
  }
}
