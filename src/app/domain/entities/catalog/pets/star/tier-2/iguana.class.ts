import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Iguana extends Pet {
  name = 'Iguana';
  tier = 2;
  pack: Pack = 'Star';
  attack = 2;
  health = 4;

  initAbilities(): void {
    this.addAbility(new IguanaAbility(this, this.logService));
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


export class IguanaAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'IguanaAbility',
      owner: owner,
      triggers: ['EnemyPushed', 'EnemySummoned'],
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

    let targetResp = owner.parent.getSpecificPet(owner, triggerPet);
    let target = targetResp.pet;
    if (target == null || !target.alive) {
      return;
    }
    let power = this.level * 2;
    owner.snipePet(target, power, targetResp.random, tiger);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): IguanaAbility {
    return new IguanaAbility(newOwner, this.logService);
  }
}


