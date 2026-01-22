import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class LampreyAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'LampreyAbility',
      owner: owner,
      triggers: ['FriendDied'],
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
    const { triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;
    if (!triggerPet) {
      this.triggerTigerExecution(context);
      return;
    }

    const targetsResp = owner.parent.nearestPetsAhead(this.level, owner);
    if (targetsResp.pets.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const targets = targetsResp.pets;
    for (const target of targets) {
      owner.dealDamage(target, 1);
    }

    const targetNames = targets.map((p) => p.name).join(', ');
    this.logService.createLog({
      message: `${owner.name} dealt 1 damage to ${targetNames} when ${triggerPet.name} fainted.`,
      type: 'ability',
      player: owner.parent,
      tiger,
      pteranodon,
      randomEvent: targetsResp.random,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): LampreyAbility {
    return new LampreyAbility(newOwner, this.logService);
  }
}
