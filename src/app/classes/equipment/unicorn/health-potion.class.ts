import { LogService } from 'app/services/log.service';
import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class HealthPotion extends Equipment {
  name = 'Health Potion';
  equipmentClass = 'beforeStartOfBattle' as EquipmentClass;
  callback = (pet: Pet) => {
    const equipment = pet.getEquippedEquipmentInstance(this);
    pet.addAbility(new HealthPotionAbility(pet, equipment, this.logService));
  };

  constructor(protected logService: LogService) {
    super();
  }
}


export class HealthPotionAbility extends Ability {
  private equipment: Equipment;
  private logService: LogService;

  constructor(owner: Pet, equipment: Equipment, logService: LogService) {
    super({
      name: 'HealthPotionAbility',
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
    let power = 2 * multiplier;
    let target = owner.parent.furthestUpPet;

    if (target == null) {
      return;
    }

    this.logService.createLog({
      message: `${owner.name} gave ${power} health to ${target.name} (Health Potion)${this.equipment.multiplierMessage}.`,
      type: 'equipment',
      player: owner.parent,
    });

    target.increaseHealth(power);
  }
}
