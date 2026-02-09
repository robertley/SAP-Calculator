import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Amphisbaena extends Pet {
  name = 'Amphisbaena';
  tier = 2;
  pack: Pack = 'Custom';
  attack = 2;
  health = 2;
  initAbilities(): void {
    this.addAbility(new AmphisbaenaAbility(this, this.logService));
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


export class AmphisbaenaAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'AmphisbaenaAbility',
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
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, tiger, pteranodon } = context;
    const owner = this.owner;

    let targetsAheadResp = owner.parent.nearestPetsAhead(1, owner);
    if (targetsAheadResp.pets.length === 0) {
      return;
    }
    let target = targetsAheadResp.pets[0];

    const turnNumber = gameApi?.turnNumber ?? 1;
    if (turnNumber % 2 === 1) {
      target.increaseAttack(this.level);
      this.logService.createLog({
        message: `${owner.name} gave ${target.name} ${this.level} attack.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: targetsAheadResp.random,
      });
    } else {
      target.increaseHealth(this.level);
      this.logService.createLog({
        message: `${owner.name} gave ${target.name} ${this.level} health.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: targetsAheadResp.random,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): AmphisbaenaAbility {
    return new AmphisbaenaAbility(newOwner, this.logService);
  }
}


