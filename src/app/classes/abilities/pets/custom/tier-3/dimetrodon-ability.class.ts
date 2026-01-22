import { Ability, AbilityContext } from '../../../../ability.class';
import { Pack, Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';
import { Player } from 'app/classes/player.class';

class SummonedDimetrodon extends Pet {
  name = 'Dimetrodon';
  tier = 3;
  pack: Pack = 'Custom';
  hidden = true;

  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
    parent: Player,
    health?: number,
    attack?: number,
    mana?: number,
    exp?: number,
    triggersConsumed?: number,
  ) {
    super(logService, abilityService, parent);
    this.initPet(exp, health, attack, mana, null, triggersConsumed);
  }

  override initAbilities(): void {
    // Do not add abilities to summoned copy.
  }
}

export class DimetrodonAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Dimetrodon Ability',
      owner: owner,
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
    const level = this.level;
    const stats = 5 * level;
    const summoned = new SummonedDimetrodon(
      this.logService,
      (owner as any).abilityService,
      owner.parent,
      stats,
      stats,
    );
    const summonResult = owner.parent.summonPet(summoned, owner.position);

    if (summonResult.success) {
      this.logService.createLog({
        message: `${owner.name} summoned a ${stats}/${stats} Dimetrodon.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
      });
    } else {
      const buffAmount = level;
      const friends = owner.parent.petArray.filter(
        (pet) => pet && pet !== owner,
      );
      for (const pet of friends) {
        pet.increaseAttack(buffAmount);
        pet.increaseHealth(buffAmount);
      }
      if (friends.length > 0) {
        this.logService.createLog({
          message: `${owner.name} gave friends +${buffAmount}/+${buffAmount}.`,
          type: 'ability',
          player: owner.parent,
          tiger: tiger,
          pteranodon: pteranodon,
        });
      }
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): DimetrodonAbility {
    return new DimetrodonAbility(newOwner, this.logService);
  }
}
