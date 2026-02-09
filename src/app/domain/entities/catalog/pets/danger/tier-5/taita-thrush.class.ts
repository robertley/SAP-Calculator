import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class TaitaThrush extends Pet {
  name = 'Taita Thrush';
  tier = 5;
  pack: Pack = 'Danger';
  attack = 3;
  health = 4;

  initAbilities(): void {
    this.addAbility(new TaitaThrushAbility(this, this.logService));
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


export class TaitaThrushAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'TaitaThrushAbility',
      owner: owner,
      triggers: ['AdjacentFriendAttacked'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: 3,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let power = this.level; // 1/2/3 based on level

    let friendsResp = owner.parent.getAll(false, owner, true); // excludeSelf = true

    for (let friend of friendsResp.pets) {
      friend.increaseAttack(power);
      friend.increaseHealth(power);

      this.logService.createLog({
        message: `${owner.name} gave ${friend.name} +${power} attack and +${power} health`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: friendsResp.random,
      });
    } // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TaitaThrushAbility {
    return new TaitaThrushAbility(newOwner, this.logService);
  }
}


