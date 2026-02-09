import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class GrizzlyBear extends Pet {
  name = 'Grizzly Bear';
  tier = 6;
  pack: Pack = 'Golden';
  attack = 6;
  health = 8;

  initAbilities(): void {
    this.addAbility(new GrizzlyBearAbility(this, this.logService));
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


export class GrizzlyBearAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'GrizzlyBearAbility',
      owner: owner,
      triggers: ['FriendlyAttacked5'],
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
    let targetResp = owner.parent.getRandomEnemyPetsWithSillyFallback(
      2,
      [],
      true,
      false,
      owner,
    );
    let targets = targetResp.pets;
    let power = this.level * 6;
    for (let target of targets) {
      owner.snipePet(target, power, targetResp.random, tiger);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): GrizzlyBearAbility {
    return new GrizzlyBearAbility(newOwner, this.logService);
  }
}


