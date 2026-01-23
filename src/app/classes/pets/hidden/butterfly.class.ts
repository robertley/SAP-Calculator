import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../equipment.class';
import { Pack, Pet } from '../../pet.class';
import { Player } from '../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Butterfly extends Pet {
  name = 'Butterfly';
  tier = 1;
  pack: Pack = 'Puppy';
  hidden: boolean = true;
  health = 1;
  attack = 1;
  initAbilities(): void {
    this.addAbility(new ButterflyAbility(this, this.logService));
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


export class ButterflyAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'ButterflyAbility',
      owner: owner,
      triggers: ['ThisTransformed'],
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

    if (!owner.alive) {
      return;
    }

    let opponent = owner.parent.opponent;
    let targetResp = opponent.getStrongestPet(owner);
    if (!targetResp.pet) {
      return;
    }

    owner.health = targetResp.pet.health;
    owner.attack = targetResp.pet.attack;
    this.logService.createLog({
      message: `${owner.name} copied stats from the strongest enemy (${owner.attack}/${owner.health}).`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetResp.random,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): ButterflyAbility {
    return new ButterflyAbility(newOwner, this.logService);
  }
}
