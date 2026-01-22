import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class DeerLordAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Deer Lord Ability',
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
    const friendAhead = owner.petAhead;

    if (friendAhead) {
      // Knock out the friend ahead
      friendAhead.health = 0;

      this.logService.createLog({
        message: `${owner.name} knocked out ${friendAhead.name}.`,
        type: 'ability',
        player: owner.parent,
      });

      // Stock free Bacon
      const amount = this.level;
      this.logService.createLog({
        message: `${owner.name} stocked ${amount} free Bacon.`,
        type: 'ability',
        player: owner.parent,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): DeerLordAbility {
    return new DeerLordAbility(newOwner, this.logService);
  }
}
