import { Ability, AbilityContext } from '../../../ability.class';
import { Pet } from '../../../pet.class';
import { Equipment } from '../../../equipment.class';
import { InjectorService } from 'app/services/injector.service';
import { LogService } from 'app/services/log.service';

export class ManaPotionAbility extends Ability {
  private equipment: Equipment;
  private logService: LogService;

  constructor(owner: Pet, equipment: Equipment) {
    super({
      name: 'ManaPotionAbility',
      owner: owner,
      triggers: ['BeforeStartBattle'],
      abilityType: 'Equipment',
      native: true,
      abilitylevel: 1,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.equipment = equipment;
    this.logService = InjectorService.getInjector().get(LogService);
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const manaGain = 6 * this.equipment.multiplier;
    owner.increaseMana(manaGain);

    this.logService.createLog({
      message: `${owner.name} gained ${manaGain} mana. (Mana Potion)${this.equipment.multiplierMessage}`,
      type: 'equipment',
      player: owner.parent,
    });
  }
}
