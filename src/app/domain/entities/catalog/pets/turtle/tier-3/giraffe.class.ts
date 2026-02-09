import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Giraffe extends Pet {
  name = 'Giraffe';
  tier = 3;
  pack: Pack = 'Turtle';
  attack = 1;
  health = 2;
  initAbilities(): void {
    this.addAbility(new GiraffeAbility(this, this.logService));
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


export class GiraffeAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'GiraffeAbility',
      owner: owner,
      triggers: ['StartTurn'],
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
    const count = this.level;
    const targetsResp = owner.parent.nearestPetsAhead(count, owner);
    if (targetsResp.pets.length === 0) {
      return;
    }

    for (const target of targetsResp.pets) {
      target.increaseAttack(1);
      target.increaseHealth(1);
    }

    this.logService.createLog({
      message: `${owner.name} gave ${targetsResp.pets
        .map((pet) => pet.name)
        .join(', ')} +1 attack and +1 health.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
      randomEvent: targetsResp.random,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): GiraffeAbility {
    return new GiraffeAbility(newOwner, this.logService);
  }
}


