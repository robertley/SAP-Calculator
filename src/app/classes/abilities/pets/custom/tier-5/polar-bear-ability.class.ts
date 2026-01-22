import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class PolarBearAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Polar Bear Ability',
      owner: owner,
      triggers: ['StartTurn'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const levelBuffs = [4, 8, 12];
    const buff =
      levelBuffs[Math.min(Math.max(owner.level - 1, 0), levelBuffs.length - 1)];
    const targetResp = owner.parent.getRandomPets(1, [], false, false, owner);
    const target = targetResp.pets[0];
    if (!target) {
      this.triggerTigerExecution(context);
      return;
    }

    target.increaseAttack(buff);
    target.increaseHealth(buff);

    this.logService.createLog({
      message: `${owner.name} gave ${target.name} +${buff}/+${buff}.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
      randomEvent: targetResp.random,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): PolarBearAbility {
    return new PolarBearAbility(newOwner, this.logService);
  }
}
