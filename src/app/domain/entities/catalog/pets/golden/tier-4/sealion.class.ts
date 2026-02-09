import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Sealion extends Pet {
  name = 'Sealion';
  tier = 4;
  pack: Pack = 'Golden';
  attack = 2;
  health = 4;
  initAbilities(): void {
    this.addAbility(
      new SealionAbility(this, this.logService, this.abilityService),
    );
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


export class SealionAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'SealionAbility',
      owner: owner,
      triggers: ['EndTurn'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const attackGain = this.level;
    const healthGain = this.level;

    const friendsBehind: Pet[] = [];
    let petBehind = owner.petBehind();
    while (petBehind) {
      friendsBehind.push(petBehind);
      petBehind = petBehind.petBehind();
    }

    const friendsAhead: Pet[] = [];
    let petAhead = owner.petAhead;
    while (petAhead) {
      friendsAhead.push(petAhead);
      petAhead = petAhead.petAhead;
    }

    for (const friend of friendsBehind) {
      friend.increaseAttack(attackGain);
    }
    for (const friend of friendsAhead) {
      friend.increaseHealth(healthGain);
    }

    if (friendsBehind.length > 0 || friendsAhead.length > 0) {
      this.logService.createLog({
        message: `${owner.name} gave friends behind +${attackGain} attack and friends ahead +${healthGain} health.`,
        type: 'ability',
        player: owner.parent,
        tiger: context.tiger,
        pteranodon: context.pteranodon,
        randomEvent: friendsBehind.length + friendsAhead.length > 1,
      });
    }
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SealionAbility {
    return new SealionAbility(newOwner, this.logService, this.abilityService);
  }
}


