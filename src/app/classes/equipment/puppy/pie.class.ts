import { LogService } from 'app/services/log.service';
import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Pie extends Equipment {
  name = 'Pie';
  tier = 4;
  equipmentClass: EquipmentClass = 'beforeStartOfBattle';
  callback = (pet: Pet) => {
    const equipment = pet.getEquippedEquipmentInstance(this);
    // Add Pie ability using dedicated ability class
    pet.addAbility(new PieAbility(pet, equipment, this.logService));
  };

  constructor(protected logService: LogService) {
    super();
  }
}


export class PieAbility extends Ability {
  private equipment: Equipment;
  private logService: LogService;

  constructor(owner: Pet, equipment: Equipment, logService: LogService) {
    super({
      name: 'PieAbility',
      owner: owner,
      triggers: ['BeforeStartBattle'],
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

    const attackGain = 4 * this.equipment.multiplier;
    const healthGain = 3 * this.equipment.multiplier;
    owner.increaseAttack(attackGain);
    owner.increaseHealth(healthGain);

    this.logService.createLog({
      message: `${owner.name} gained ${attackGain} attack and ${healthGain} health (Pie)${this.equipment.multiplierMessage}`,
      type: 'equipment',
      player: owner.parent,
    });
  }
}
