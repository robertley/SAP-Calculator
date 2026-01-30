import { LogService } from 'app/services/log.service';
import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class GingerbreadMan extends Equipment {
  name = 'Gingerbread Man';
  equipmentClass = 'beforeStartOfBattle' as EquipmentClass;
  callback = (pet: Pet) => {
    const equipment = pet.getEquippedEquipmentInstance(this);
    pet.addAbility(new GingerbreadManAbility(pet, equipment, this.logService));
  };

  constructor(protected logService: LogService) {
    super();
  }
}


export class GingerbreadManAbility extends Ability {
  private equipment: Equipment;
  private logService: LogService;

  constructor(owner: Pet, equipment: Equipment, logService: LogService) {
    super({
      name: 'GingerbreadManAbility',
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

    let multiplier = this.equipment.multiplier;
    let expGain = 1 * multiplier;

    this.logService.createLog({
      message: `${owner.name} gained ${expGain} experience (Gingerbread Man)${this.equipment.multiplierMessage}.`,
      type: 'equipment',
      player: owner.parent,
    });

    owner.increaseExp(expGain);
  }
}
