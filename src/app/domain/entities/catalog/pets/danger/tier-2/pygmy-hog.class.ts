import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { AngryPygmyHog } from 'app/domain/entities/catalog/pets/hidden/angry-pygmy-hog.class';
import { Garlic } from 'app/domain/entities/catalog/equipment/turtle/garlic.class';
import { Power } from 'app/domain/interfaces/power.interface';


export class PygmyHog extends Pet {
  name = 'Pygmy Hog';
  tier = 2;
  pack: Pack = 'Danger';
  attack = 1;
  health = 2;
  initAbilities(): void {
    this.addAbility(
      new PygmyHogAbility(this, this.logService, this.abilityService),
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


export class PygmyHogAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'PygmyHogAbility',
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
    let power: Power = {
      health: Math.max(this.level * 5, owner.health),
      attack: Math.max(this.level * 5, owner.attack),
    };
    let angryPygmyHog = new AngryPygmyHog(
      this.logService,
      this.abilityService,
      owner.parent,
      power.health,
      power.attack,
      owner.mana,
      owner.exp,
      new Garlic(),
    );

    this.logService.createLog({
      message: `${owner.name} transformed into ${angryPygmyHog.name} (${power.attack}/${power.health}) with Garlic!`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
    });

    owner.parent.transformPet(owner, angryPygmyHog);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): PygmyHogAbility {
    return new PygmyHogAbility(newOwner, this.logService, this.abilityService);
  }
}



