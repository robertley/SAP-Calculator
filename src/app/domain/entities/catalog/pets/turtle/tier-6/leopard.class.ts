import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Leopard extends Pet {
  name = 'Leopard';
  tier = 6;
  pack: Pack = 'Turtle';
  attack = 10;
  health = 4;
  initAbilities(): void {
    this.addAbility(new LeopardAbility(this, this.logService));
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


export class LeopardAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'LeopardAbility',
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

    let power = Math.floor(owner.attack * 0.5);
    let targetsResp = owner.parent.getRandomEnemyPetsWithSillyFallback(
      this.level,
      null,
      null,
      true,
      owner,
    );
    for (let target of targetsResp.pets) {
      if (target != null) {
        owner.snipePet(target, power, targetsResp.random, tiger);
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): LeopardAbility {
    return new LeopardAbility(newOwner, this.logService);
  }
}


