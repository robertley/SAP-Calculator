import { LogService } from 'app/services/log.service';
import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class PitaBread extends Equipment {
  name = 'Pita Bread';
  tier = 6;
  power = 0;
  equipmentClass = 'hurt' as EquipmentClass;
  callback = (pet: Pet) => {
    const equipment = pet.getEquippedEquipmentInstance(this);
    pet.addAbility(new PitaBreadAbility(pet, equipment, this.logService));
  };
  constructor(protected logService: LogService) {
    super();
  }
}


export class PitaBreadAbility extends Ability {
  private equipment: Equipment;
  private logService: LogService;

  constructor(owner: Pet, equipment: Equipment, logService: LogService) {
    super({
      name: 'PitaBreadAbility',
      owner: owner,
      triggers: ['ThisHurt'],
      abilityType: 'Equipment',
      native: true,
      maxUses: 1, // Pita Bread is removed after one use
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

    if (!owner.alive) {
      return;
    }

    let multiplier = this.equipment.multiplier;
    let power = 15 * multiplier;
    owner.increaseHealth(power);

    let message = `${owner.name} gained ${power} health. (Pita Bread)${this.equipment.multiplierMessage}`;

    this.logService.createLog({
      message: message,
      type: 'equipment',
      player: owner.parent,
    });

    owner.removePerk();
  }
}
