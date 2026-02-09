import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class AfricanWildDog extends Pet {
  name = 'African Wild Dog';
  tier = 1;
  pack: Pack = 'Danger';
  attack = 3;
  health = 2;
  initAbilities(): void {
    this.addAbility(new AfricanWildDogAbility(this, this.logService));
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


export class AfricanWildDogAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'AfricanWildDogAbility',
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

    let targetResp = owner.parent.opponent.getFurthestUpPet(owner);
    if (targetResp.pet == null) {
      return;
    }
    let target: Pet;
    if (targetResp.random) {
      target = targetResp.pet;
    } else {
      target = targetResp.pet?.petBehind();
    }

    if (target) {
      let damage = this.level * 3;
      owner.jumpAttackPrep(target);
      owner.jumpAttack(target, tiger, damage, targetResp.random);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): AfricanWildDogAbility {
    return new AfricanWildDogAbility(newOwner, this.logService);
  }
}


