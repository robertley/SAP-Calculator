import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Kangaroo extends Pet {
  name = 'Kangaroo';
  tier = 2;
  pack: Pack = 'Turtle';
  health = 2;
  attack = 2;
  initAbilities(): void {
    this.addAbility(new KangarooAbility(this, this.logService));
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


export class KangarooAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'KangarooAbility',
      owner: owner,
      triggers: ['FriendAheadAttacked'],
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
    let selfTargetResp = owner.parent.getThis(owner);
    if (selfTargetResp.pet) {
      selfTargetResp.pet.increaseAttack(this.level);
      selfTargetResp.pet.increaseHealth(this.level);
      this.logService.createLog({
        message: `${owner.name} gave ${selfTargetResp.pet.name} ${this.level} attack and ${this.level} health.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: selfTargetResp.random,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): KangarooAbility {
    return new KangarooAbility(newOwner, this.logService);
  }
}


