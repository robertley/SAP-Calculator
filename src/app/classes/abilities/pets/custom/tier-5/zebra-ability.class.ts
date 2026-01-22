import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class ZebraAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Zebra Ability',
      owner: owner,
      triggers: ['ThisBought', 'ThisSold'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const targetResp = owner.parent.getRandomPets(
      1,
      [owner],
      false,
      false,
      owner,
    );
    const target = targetResp.pets[0];
    if (!target) {
      this.triggerTigerExecution(context);
      return;
    }

    const buff = 2 * this.level;
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

  copy(newOwner: Pet): ZebraAbility {
    return new ZebraAbility(newOwner, this.logService);
  }
}
