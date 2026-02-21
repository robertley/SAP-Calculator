import { LogService } from 'app/integrations/log.service';
import { Equipment, EquipmentClass } from '../../../equipment.class';
import { Pet } from '../../../pet.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Squash extends Equipment {
  name = 'Squash';
  tier = 3;
  equipmentClass: EquipmentClass = 'beforeAttack';
  callback = (pet: Pet) => {
    const equipment = pet.getEquippedEquipmentInstance(this);
    // Add Squash ability using dedicated ability class
    pet.addAbility(new SquashAbility(pet, equipment, this.logService));
  };

  constructor(protected logService: LogService) {
    super();
  }
}

export class SquashAbility extends Ability {
  private equipment: Equipment;
  private logService: LogService;

  constructor(owner: Pet, equipment: Equipment, logService: LogService) {
    super({
      name: 'SquashAbility',
      owner: owner,
      triggers: ['BeforeThisAttacks'],
      abilityType: 'Equipment',
      native: true,
      maxUses: 1, // Squash is removed after one use
      abilitylevel: 1,
      condition: () => {
        const frontEnemy = this.owner.parent.opponent.pet0;
        return !!frontEnemy && frontEnemy.alive;
      },
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.equipment = equipment;
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;

    for (let i = 0; i < this.equipment.multiplier; i++) {
      // Squash targets the pet being attacked, need to get front pet from opponent
      let targetPet = owner.parent.opponent.pet0;
      if (targetPet == null || !targetPet.alive) {
        return;
      }

      let power = 6;
      let reducedTo = Math.max(1, targetPet.health - power);
      targetPet.health = reducedTo;
      let multiplierMessage = i > 0 ? this.equipment.multiplierMessage : '';
      this.logService.createLog({
        message: `${this.equipment.name} reduced ${targetPet.name} health by ${power} to ${reducedTo}${multiplierMessage}`,
        type: 'equipment',
        player: owner.parent,
      });
    }

    // Remove equipment after use
    owner.removePerk();
  }
}


