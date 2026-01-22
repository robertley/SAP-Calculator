import { Ability, AbilityContext } from '../../../ability.class';
import { Pet } from '../../../pet.class';
import { Equipment } from '../../../equipment.class';
import { LogService } from 'app/services/log.service';

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
