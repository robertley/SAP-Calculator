import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Beaver extends Pet {
  name = 'Beaver';
  tier = 1;
  pack: Pack = 'Turtle';
  health = 2;
  attack = 3;
  initAbilities(): void {
    this.addAbility(new BeaverAbility(this, this.logService));
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


export class BeaverAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'BeaverAbility',
      owner: owner,
      triggers: ['ThisSold'],
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
    const power = this.level;
    const targetsResp = owner.parent.getRandomPets(
      2,
      [owner],
      false,
      false,
      owner,
    );
    if (targetsResp.pets.length === 0) {
      return;
    }

    for (const target of targetsResp.pets) {
      target.increaseAttack(power);
    }

    this.logService.createLog({
      message: `${owner.name} gave ${targetsResp.pets
        .map((pet) => pet.name)
        .join(', ')} ${power} attack.`,
      type: 'ability',
      player: owner.parent,
      randomEvent: targetsResp.random,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): BeaverAbility {
    return new BeaverAbility(newOwner, this.logService);
  }
}


