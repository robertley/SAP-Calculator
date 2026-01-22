import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class DeinocheirusAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Deinocheirus Ability',
      owner,
      triggers: ['StartBattle'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon } = context;
    const owner = this.owner;
    const equipment = owner.equipment;

    if (!equipment) {
      this.triggerTigerExecution(context);
      return;
    }

    const eqClass = equipment.equipmentClass;
    if (!eqClass?.startsWith('ailment')) {
      this.triggerTigerExecution(context);
      return;
    }

    const multiplier = this.level;
    const attackBuff = multiplier;
    const healthBuff = multiplier * 2;
    owner.increaseAttack(attackBuff);
    owner.increaseHealth(healthBuff);

    this.logService.createLog({
      message: `${owner.name} reversed ${equipment.name} and gained +${attackBuff}/+${healthBuff} (x${multiplier}).`,
      type: 'ability',
      player: owner.parent,
      tiger,
      pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): DeinocheirusAbility {
    return new DeinocheirusAbility(newOwner, this.logService);
  }
}
