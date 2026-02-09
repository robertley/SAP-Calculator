import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Dimetrodon extends Pet {
  name = 'Dimetrodon';
  tier = 3;
  pack: Pack = 'Custom';
  attack = 1;
  health = 3;

  override initAbilities(): void {
    this.addAbility(new DimetrodonAbility(this, this.logService));
    super.initAbilities();
  }

  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
    parent: Player,
    health?: number,
    attack?: number,
    mana?: number,
    exp?: number,
    equipment?: Equipment,
    triggersConsumed?: number,
  ) {
    super(logService, abilityService, parent);
    this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
  }
}


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


