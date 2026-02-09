import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class RoyalFlycatcher extends Pet {
  name = 'Royal Flycatcher';
  tier = 3;
  pack: Pack = 'Golden';
  attack = 2;
  health = 4;
  initAbilities(): void {
    this.addAbility(new RoyalFlycatcherAbility(this, this.logService));
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


export class RoyalFlycatcherAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'RoyalFlycatcherAbility',
      owner: owner,
      triggers: ['EnemyFaint3'],
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
    let power = this.level * 4;
    let targetResp = owner.parent.opponent.getRandomPet(
      [],
      null,
      true,
      null,
      owner,
    );
    let target = targetResp.pet;
    if (target == null) {
      return;
    }
    owner.snipePet(target, power, targetResp.random, tiger);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): RoyalFlycatcherAbility {
    return new RoyalFlycatcherAbility(newOwner, this.logService);
  }
}


