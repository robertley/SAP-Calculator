import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../../equipment.class';

export class RealVelociraptorAbility extends Ability {
  private logService: LogService;
  private friendAppliedThisTurn: Set<Pet> = new Set();
  reset(): void {
    this.maxUses = this.level;
    this.friendAppliedThisTurn = new Set();
    super.reset();
  }
  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'RealVelociraptorAbility',
      owner: owner,
      triggers: ['FriendLostPerk'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: owner.level,
      condition: (context: AbilityContext) => {
        const { triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;
        return (
          triggerPet &&
          triggerPet !== owner &&
          triggerPet.lastLostEquipment &&
          !this.friendAppliedThisTurn.has(triggerPet)
        );
      },
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    // Create new instance of the lost equipment
    let restoredPerk = this.createEquipmentInstance(
      triggerPet.lastLostEquipment,
    );
    if (restoredPerk) {
      let targetResp = owner.parent.getSpecificPet(owner, triggerPet);
      let target = targetResp.pet;
      if (target == null) {
        return;
      }
      target.givePetEquipment(restoredPerk);

      this.logService.createLog({
        message: `${owner.name} returned ${restoredPerk.name} to ${target.name}.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetResp.random,
      });
      this.friendAppliedThisTurn.add(target);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  /**
   * Creates a new instance of equipment based on the equipment class
   */
  private createEquipmentInstance(equipment: Equipment): Equipment | null {
    try {
      // Get the constructor of the equipment
      const EquipmentClass = equipment.constructor as new () => Equipment;
      return new EquipmentClass();
    } catch (error) {
      console.warn(
        'Failed to create equipment instance:',
        equipment.name,
        error,
      );
      return null;
    }
  }

  copy(newOwner: Pet): RealVelociraptorAbility {
    return new RealVelociraptorAbility(newOwner, this.logService);
  }
}
