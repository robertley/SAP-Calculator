import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class PygmyHippo extends Pet {
  name = 'Pygmy Hippo';
  tier = 3;
  pack: Pack = 'Danger';
  attack = 2;
  health = 7;
  initAbilities(): void {
    this.addAbility(
      new PygmyHippoAbility(this, this.logService, this.abilityService),
    );
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


export class PygmyHippoAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'PygmyHippoAbility',
      owner: owner,
      triggers: ['EnemyAttacked5'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let damage = Math.floor(owner.health * 0.33); // 33% of current health
    let targetsResp = owner.parent.opponent.getLowestHealthPets(
      this.level,
      undefined,
      owner,
    );

    for (let target of targetsResp.pets) {
      owner.snipePet(target, damage, targetsResp.random, tiger);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): PygmyHippoAbility {
    return new PygmyHippoAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}


