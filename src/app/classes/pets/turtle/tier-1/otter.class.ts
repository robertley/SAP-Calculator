import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Otter extends Pet {
  name = 'Otter';
  tier = 1;
  pack: Pack = 'Turtle';
  health = 4;
  attack = 1;
  initAbilities(): void {
    this.addAbility(new OtterAbility(this, this.logService));
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


export class OtterAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'OtterAbility',
      owner: owner,
      triggers: ['ThisBought'],
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
    const targetsResp = owner.parent.getRandomPets(
      count,
      [owner],
      false,
      false,
      owner,
    );
    if (targetsResp.pets.length === 0) {
      return;
    }

    for (const target of targetsResp.pets) {
      target.increaseHealth(1);
    }

    this.logService.createLog({
      message: `${owner.name} gave ${targetsResp.pets
        .map((pet) => pet.name)
        .join(', ')} +1 health.`,
      type: 'ability',
      player: owner.parent,
      randomEvent: targetsResp.random,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): OtterAbility {
    return new OtterAbility(newOwner, this.logService);
  }
}
