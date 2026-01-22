import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { Power } from 'app/interfaces/power.interface';

export class PandaAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'PandaAbility',
      owner: owner,
      triggers: ['StartBattle'],
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
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let percentage = 0.5 * this.level;
    let power: Power = {
      attack: Math.floor(owner.attack * percentage),
      health: Math.floor(owner.health * percentage),
    };
    let targetsAheadResp = owner.parent.nearestPetsAhead(1, owner);
    if (targetsAheadResp.pets.length > 0) {
      let target = targetsAheadResp.pets[0];
      target.increaseAttack(power.attack);
      target.increaseHealth(power.health);
      this.logService.createLog({
        message: `${owner.name} gave ${target.name} ${power.attack} attack and ${power.health} health.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: targetsAheadResp.random,
      });
    }
    owner.health = 0;

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): PandaAbility {
    return new PandaAbility(newOwner, this.logService);
  }
}
