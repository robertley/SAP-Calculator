import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Skunk extends Pet {
  name = 'Skunk';
  tier = 4;
  pack: Pack = 'Turtle';
  attack = 3;
  health = 5;
  initAbilities(): void {
    this.addAbility(new SkunkAbility(this, this.logService));
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


export class SkunkAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'SkunkAbility',
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

    let opponent = owner.parent.opponent;
    let highestHealthPetResp = opponent.getHighestHealthPet(undefined, owner);
    let targetPet = highestHealthPetResp.pet;
    if (targetPet == null) {
      return;
    }

    let power = 0.33 * this.level;
    let reducedTo = Math.max(1, Math.floor(targetPet.health * (1 - power)));

    targetPet.health = reducedTo;
    this.logService.createLog({
      message: `${owner.name} reduced ${targetPet.name} health by ${power * 100}% (${reducedTo})`,
      type: 'ability',
      player: owner.parent,
      randomEvent: highestHealthPetResp.random,
      tiger: tiger,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SkunkAbility {
    return new SkunkAbility(newOwner, this.logService);
  }
}
