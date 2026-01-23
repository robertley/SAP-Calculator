import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Kraken extends Pet {
  name = 'Kraken';
  tier = 4;
  pack: Pack = 'Unicorn';
  attack = 5;
  health = 7;
  initAbilities(): void {
    this.addAbility(new KrakenAbility(this, this.logService));
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


export class KrakenAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'KrakenAbility',
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

    let targetsResp = owner.parent.getAll(true, owner, true);
    let targets = targetsResp.pets;
    if (targets.length == 0) {
      return;
    }

    for (let targetPet of targets) {
      // multiplying has a weird bug with 0.33 * 2 = 0.6600000000000001 type ish
      let power = this.level == 1 ? 0.15 : this.level == 2 ? 0.3 : 0.45;
      let reducedTo = Math.max(1, Math.floor(targetPet.health * (1 - power)));
      targetPet.health = reducedTo;
      this.logService.createLog({
        message: `${owner.name} reduced ${targetPet.name} health by ${(power * 100).toFixed(0)}% (${reducedTo})`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetsResp.random,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): KrakenAbility {
    return new KrakenAbility(newOwner, this.logService);
  }
}
