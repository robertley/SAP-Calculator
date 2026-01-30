import { LogService } from 'app/services/log.service';
import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Tasty extends Equipment {
  name = 'Tasty';
  equipmentClass = 'faint' as EquipmentClass;
  callback = (pet: Pet) => {
    const equipment = pet.getEquippedEquipmentInstance(this);
    // Add Tasty ability using dedicated ability class
    pet.addAbility(new TastyAbility(pet, equipment, this.logService));
  };

  constructor(protected logService: LogService) {
    super();
  }
}

export class TastyAbility extends Ability {
  private equipment: Equipment;
  private logService: LogService;

  constructor(owner: Pet, equipment: Equipment, logService: LogService) {
    super({
      name: 'TastyAbility',
      owner: owner,
      triggers: ['Faint'],
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

    // Get random enemy
    let enemies = owner.parent.opponent.petArray.filter((enemy) => enemy.alive);
    if (enemies.length == 0) {
      return;
    }

    let randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];

    // Give random enemy +2 attack and +2 health
    randomEnemy.increaseAttack(2 * this.equipment.multiplier);
    randomEnemy.increaseHealth(2 * this.equipment.multiplier);

    this.logService.createLog({
      message: `${owner.name} gave ${randomEnemy.name} +2 attack and +2 health (Tasty)${this.equipment.multiplierMessage}`,
      type: 'equipment',
      player: owner.parent,
      randomEvent: enemies.length > 1,
    });
  }
}

