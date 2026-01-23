import { Chili } from 'app/classes/equipment/turtle/chili.class';
import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Bus } from '../../hidden/bus.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Deer extends Pet {
  name = 'Deer';
  tier = 4;
  pack: Pack = 'Turtle';
  attack = 2;
  health = 2;
  initAbilities(): void {
    this.addAbility(
      new DeerAbility(this, this.logService, this.abilityService),
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
//Faint: Summon one 5/3 *level Bus with Chili.


export class DeerAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'DeerAbility',
      owner: owner,
      triggers: ['ThisDied'],
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

    let bus = new Bus(
      this.logService,
      this.abilityService,
      owner.parent,
      null,
      null,
      null,
      this.minExpForLevel,
      new Chili(this.logService, this.abilityService),
    );

    let summonResult = owner.parent.summonPet(
      bus,
      owner.savedPosition,
      false,
      owner,
    );
    if (summonResult.success) {
      this.logService.createLog({
        message: `${owner.name} spawned Bus level ${this.level}`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: summonResult.randomEvent,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): DeerAbility {
    return new DeerAbility(newOwner, this.logService, this.abilityService);
  }
}
