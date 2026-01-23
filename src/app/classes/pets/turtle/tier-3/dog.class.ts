import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Dog extends Pet {
  name = 'Dog';
  tier = 3;
  pack: Pack = 'Turtle';
  attack = 3;
  health = 2;
  initAbilities(): void {
    this.addAbility(new DogAbility(this, this.logService));
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


export class DogAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'DogAbility',
      owner: owner,
      triggers: ['FriendSummoned'],
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
    if (!triggerPet || triggerPet === owner) {
      return;
    }
    let boostAtkAmt = this.level * 2;
    let boostHealthAmt = this.level;
    let selfTargetResp = owner.parent.getThis(owner);
    if (selfTargetResp.pet) {
      selfTargetResp.pet.increaseAttack(boostAtkAmt);
      selfTargetResp.pet.increaseHealth(boostHealthAmt);
      this.logService.createLog({
        message: `${owner.name} gave ${selfTargetResp.pet.name} ${boostAtkAmt} attack and ${boostHealthAmt} health.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: selfTargetResp.random,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): DogAbility {
    return new DogAbility(newOwner, this.logService);
  }
}
