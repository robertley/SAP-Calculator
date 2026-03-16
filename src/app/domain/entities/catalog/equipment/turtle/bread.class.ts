import { LogService } from 'app/integrations/log.service';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Equipment, EquipmentClass } from '../../../equipment.class';
import { Pet } from '../../../pet.class';

export class Bread extends Equipment {
  name = 'Bread';
  tier = 4;
  equipmentClass: EquipmentClass = 'shop';
  callback = (pet: Pet) => {
    const equipment = pet.getEquippedEquipmentInstance(this);
    pet.addAbility(new BreadAbility(pet, equipment, this.logService));
  };

  constructor(protected logService: LogService) {
    super();
  }
}

export class BreadAbility extends Ability {
  private equipment: Equipment;
  private logService: LogService;
  private pendingHealth = 0;

  constructor(owner: Pet, equipment: Equipment, logService: LogService) {
    super({
      name: 'BreadAbility',
      owner,
      triggers: ['EndTurn', 'StartTurn'],
      abilityType: 'Equipment',
      native: true,
      abilitylevel: 1,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.equipment = equipment;
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    if (context.trigger === 'StartTurn') {
      if (this.pendingHealth !== 0) {
        owner.increaseHealth(-this.pendingHealth);
        this.pendingHealth = 0;
      }
      return;
    }

    const healthGain = 7 * (this.equipment.multiplier ?? 1);
    owner.increaseHealth(healthGain);
    this.pendingHealth = healthGain;
    this.logService.createLog({
      message: `${owner.name} gained +${healthGain} health until next turn. (Bread)${this.equipment.multiplierMessage}`,
      type: 'equipment',
      player: owner.parent,
    });
  }
}
