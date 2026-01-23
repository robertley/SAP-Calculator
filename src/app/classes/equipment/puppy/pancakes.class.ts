import { LogService } from 'app/services/log.service';
import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Pancakes extends Equipment {
  name = 'Pancakes';
  tier = 6;
  equipmentClass: EquipmentClass = 'beforeStartOfBattle';
  callback = (pet: Pet) => {
    // Add Pancakes ability using dedicated ability class
    pet.addAbility(new PancakesAbility(pet, this, this.logService));
  };

  constructor(protected logService: LogService) {
    super();
  }
}


export class PancakesAbility extends Ability {
  private equipment: Equipment;
  private logService: LogService;

  constructor(owner: Pet, equipment: Equipment, logService: LogService) {
    super({
      name: 'PancakesAbility',
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

    for (let pett of owner.parent.petArray) {
      if (owner == pett) {
        continue;
      }
      let attackGain = 2 * this.equipment.multiplier;
      let healthGain = 2 * this.equipment.multiplier;
      pett.increaseAttack(attackGain);
      pett.increaseHealth(healthGain);
      this.logService.createLog({
        message: `${pett.name} gained ${attackGain} attack and ${healthGain} health (Pancakes)${this.equipment.multiplierMessage}`,
        type: 'equipment',
        player: owner.parent,
      });
    }
  }
}
