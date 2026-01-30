import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { ZombieCricket } from 'app/classes/pets/hidden/zombie-cricket.class';


export class Cricket extends Pet {
  name = 'Cricket';
  tier = 1;
  pack: Pack = 'Turtle';
  health = 3;
  attack = 1;
  initAbilities() {
    this.addAbility(
      new CricketAbility(this, this.logService, this.abilityService),
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


export class CricketAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'CricketAbility',
      owner: owner,
      triggers: ['PostRemovalFaint'],
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

    // Use ability level - Tiger system will override this.level during second execution
    const level = this.level;
    const exp = this.minExpForLevel;

    let zombie = new ZombieCricket(
      this.logService,
      this.abilityService,
      owner.parent,
      null,
      null,
      null,
      exp,
    );

    let summonResult = owner.parent.summonPet(
      zombie,
      owner.savedPosition,
      false,
      owner,
    );

    if (summonResult.success) {
      this.logService.createLog({
        message: `${owner.name} spawned Zombie Cricket Level ${level}`,
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

  copy(newOwner: Pet): CricketAbility {
    return new CricketAbility(newOwner, this.logService, this.abilityService);
  }
}

