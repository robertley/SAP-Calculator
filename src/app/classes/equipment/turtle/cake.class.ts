import { LogService } from 'app/services/log.service';
import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Cake extends Equipment {
  name = 'Cake';
  equipmentClass: EquipmentClass = 'shop';
  tier = 3;
  callback = (pet: Pet) => {
    pet.addAbility(new CakeAbility(pet, this, this.logService));
  };

  constructor(protected logService: LogService) {
    super();
  }
}


export class CakeAbility extends Ability {
  private equipment: Equipment;
  private logService: LogService;

  constructor(owner: Pet, equipment: Equipment, logService: LogService) {
    super({
      name: 'CakeAbility',
      owner: owner,
      triggers: ['EndTurn'],
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
    const amount = 1 * (this.equipment.multiplier ?? 1);
    owner.increaseSellValue(amount);
    this.logService.createLog({
      message: `${owner.name} increased its sell value by ${amount}. (Cake)${this.equipment.multiplierMessage}`,
      type: 'equipment',
      player: owner.parent,
    });
  }
}
