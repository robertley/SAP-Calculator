import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import {
  Ability,
  AbilityCustomParams,
  AbilityTrigger,
  AbilityType,
} from '../ability.class';
import { Equipment } from '../equipment.class';
import type { Pet } from '../pet.class';

export abstract class PetAbilityFacade {
  abstract equipment?: Equipment;
  abstract eggplantTouched: boolean;
  abstract name: string;
  abstract baseName: string;
  abstract transformed: boolean;
  abstract transformedInto: Pet | null;
  abstract abilityList: Ability[];
  abstract originalAbilityList: Ability[];

  setAbilityEquipments() {
    if (this.equipment?.name == 'Eggplant') {
      this.equipment.callback(this.asPet());
      this.eggplantTouched = true;
    } else if (this.equipment?.callback) {
      this.equipment.callback(this.asPet());
    }
  }

  getEquippedEquipmentInstance<T extends Equipment>(fallback: T): T {
    return ((this.equipment as T) ?? fallback);
  }

  addAbility(ability: Ability): void {
    this.abilityList.push(ability);
  }

  removeAbility(abilityName?: string, abilityType?: AbilityType): boolean {
    const initialLength = this.abilityList.length;

    this.abilityList = this.abilityList.filter((ability) => {
      if (abilityName && ability.name === abilityName) return false;
      if (abilityType && ability.abilityType === abilityType) return false;
      if (!abilityName && !abilityType) return false;
      return true;
    });

    return this.abilityList.length < initialLength;
  }

  getAbilities(trigger?: AbilityTrigger, abilityType?: AbilityType): Ability[] {
    return this.abilityList.filter((ability) => {
      if (trigger && !ability.matchesTrigger(trigger)) return false;
      if (abilityType && ability.abilityType !== abilityType) return false;
      return true;
    });
  }

  getAbilitiesWithTrigger(
    trigger?: AbilityTrigger,
    abilityType?: AbilityType,
    abilityName?: string,
  ): Ability[] {
    return this.abilityList.filter((ability) => {
      if ((trigger && !ability.matchesTrigger(trigger)) || !ability.canUse()) {
        return false;
      }
      if (abilityType && ability.abilityType !== abilityType) return false;
      if (abilityName && ability.name !== abilityName) return false;
      return true;
    });
  }

  executeAbilities(
    trigger: AbilityTrigger,
    gameApi: GameAPI,
    triggerPet?: Pet,
    tiger?: boolean,
    pteranodon?: boolean,
    customParams?: AbilityCustomParams,
  ): void {
    if (this.transformed && this.transformedInto) {
      this.transformedInto.executeAbilities(
        trigger,
        gameApi,
        triggerPet,
        tiger,
        pteranodon,
        customParams,
      );
      return;
    }

    const matchingPetAbilities = this.getAbilitiesWithTrigger(trigger, 'Pet');
    for (const ability of matchingPetAbilities) {
      ability.execute(gameApi, triggerPet, tiger, pteranodon, customParams);
      if (this.transformed && this.transformedInto) {
        this.transformedInto.executeAbilities(
          trigger,
          gameApi,
          triggerPet,
          tiger,
          pteranodon,
          customParams,
        );
        return;
      }
    }

    const matchingEquipmentAbilities = this.getAbilitiesWithTrigger(
      trigger,
      'Equipment',
    );
    for (const ability of matchingEquipmentAbilities) {
      ability.execute(gameApi, triggerPet, tiger, pteranodon, customParams);
      if (this.transformed && this.transformedInto) {
        this.transformedInto.executeAbilities(
          trigger,
          gameApi,
          triggerPet,
          tiger,
          pteranodon,
          customParams,
        );
        return;
      }
    }
  }

  activateAbilities(
    trigger: AbilityTrigger,
    gameApi: GameAPI,
    type: AbilityType,
    triggerPet?: Pet,
    customParams?: AbilityCustomParams,
  ): void {
    const matchingAbilities = this.getAbilities(trigger, type);
    for (const ability of matchingAbilities) {
      ability.execute(gameApi, triggerPet, undefined, undefined, customParams);
    }
  }

  copyAbilities(
    sourcePet: Pet,
    abilityType?: AbilityType,
    level?: number,
  ): void {
    this.transferAbilities(sourcePet, abilityType, level, true);
  }

  gainAbilities(
    sourcePet: Pet,
    abilityType?: AbilityType,
    level?: number,
  ): void {
    this.transferAbilities(sourcePet, abilityType, level, false);
  }

  private transferAbilities(
    sourcePet: Pet,
    abilityType: AbilityType | undefined,
    level: number | undefined,
    replaceExisting: boolean,
  ): void {
    const abilitiesToCopy = sourcePet.getAbilities(undefined, abilityType);
    if (replaceExisting) {
      this.removeAbility(undefined, abilityType);
    }

    for (const ability of abilitiesToCopy) {
      const copiedAbility = ability.copy(this.asPet());
      if (copiedAbility == null) {
        continue;
      }
      if (level) {
        copiedAbility.abilityLevel = level;
        copiedAbility.alwaysIgnorePetLevel = true;
        copiedAbility.reset();
      }
      copiedAbility.native = false;

      const originalFunction = copiedAbility.abilityFunction;
      const sourcePetName = sourcePet.name;
      copiedAbility.abilityFunction = (context) => {
        const originalName = this.name;
        const baseName = this.baseName ?? originalName;
        this.name = `${baseName}'s ${sourcePetName}`;
        try {
          originalFunction(context);
        } finally {
          this.name = originalName;
        }
      };

      this.addAbility(copiedAbility);
    }
  }

  hasAbility(trigger: AbilityTrigger, abilityType?: AbilityType): boolean {
    return this.getAbilities(trigger, abilityType).length > 0;
  }

  hasTrigger(
    trigger?: AbilityTrigger,
    abilityType?: AbilityType,
    abilityName?: string,
  ): boolean {
    return (
      this.getAbilitiesWithTrigger(trigger, abilityType, abilityName).length > 0
    );
  }

  isSellPet(): boolean {
    let sellPets = [
      'Beaver',
      'Duck',
      'Pig',
      'Pillbug',
      'Kiwi',
      'Mouse',
      'Frog',
      'Bass',
      'Tooth Billed Pigeon',
      'Marmoset',
      'Capybara',
      'Platypus',
    ];
    if (
      sellPets.includes(this.name) ||
      this.originalAbilityList.filter((ability) => {
        return (
          ability.matchesTrigger('ThisSold') && ability.abilityType == 'Pet'
        );
      }).length > 0
    ) {
      return true;
    }
    return false;
  }

  isFaintPet(): boolean {
    if (
      this.originalAbilityList.filter((ability) => {
        return (
          (ability.matchesTrigger('PostRemovalFaint') ||
            ability.matchesTrigger('Faint')) &&
          ability.abilityType == 'Pet'
        );
      }).length > 0
    ) {
      return true;
    }
    return false;
  }

  protected asPet(): Pet {
    return this as unknown as Pet;
  }
}
