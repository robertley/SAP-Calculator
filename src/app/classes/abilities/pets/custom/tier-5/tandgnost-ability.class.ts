import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { shuffle } from 'app/util/helper-functions';

export class TandgnostAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Tandgnost Ability',
      owner: owner,
      triggers: ['EndTurn'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const targets = owner.parent.petArray.filter(
      (pet) => pet && pet.alive && pet.name === 'Tandgrisner',
    );
    if (targets.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const [target] = shuffle([...targets]);
    const buff = Math.max(1, this.level) * 3;
    target.increaseHealth(buff);

    this.logService.createLog({
      message: `${owner.name} gave ${target.name} +${buff} health.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TandgnostAbility {
    return new TandgnostAbility(newOwner, this.logService);
  }
}
