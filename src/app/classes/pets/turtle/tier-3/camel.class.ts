import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Camel extends Pet {
  name = 'Camel';
  tier = 3;
  pack: Pack = 'Turtle';
  health = 3;
  attack = 3;
  initAbilities(): void {
    this.addAbility(new CamelAbility(this, this.logService));
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


export class CamelAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'CamelAbility',
      owner: owner,
      triggers: ['ThisHurt'],
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

    let targetsBehindResp = owner.parent.nearestPetsBehind(1, owner);
    if (targetsBehindResp.pets.length === 0) {
      return;
    }

    let boostPet = targetsBehindResp.pets[0];
    let boostAmt = this.level * 2;
    boostPet.increaseAttack(this.level);
    boostPet.increaseHealth(boostAmt);
    this.logService.createLog({
      message: `${owner.name} gave ${boostPet.name} ${this.level} attack and ${boostAmt} health.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetsBehindResp.random,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): CamelAbility {
    return new CamelAbility(newOwner, this.logService);
  }
}
