import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { ZombieFly } from '../../hidden/zombie-fly.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Fly extends Pet {
  name = 'Fly';
  tier = 6;
  pack: Pack = 'Turtle';
  attack = 5;
  health = 5;
  initAbilities(): void {
    this.addAbility(new FlyAbility(this, this.logService, this.abilityService));
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


export class FlyAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'FlyAbility',
      owner: owner,
      triggers: ['FriendDied'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: 3,
      condition: (context: AbilityContext) => {
        const { triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;
        if (
          (triggerPet && triggerPet instanceof ZombieFly) ||
          owner.parent.petArray.length >= 5
        ) {
          return false;
        }
        return true;
      },
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

    let zombie = new ZombieFly(
      this.logService,
      this.abilityService,
      owner.parent,
      null,
      null,
      null,
      this.minExpForLevel,
    );

    let summonResult = owner.parent.summonPet(
      zombie,
      triggerPet.savedPosition,
      true,
      owner,
    );

    if (summonResult.success) {
      this.logService.createLog({
        message: `${owner.name} spawned Zombie Fly Level ${this.level}`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: summonResult.randomEvent,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): FlyAbility {
    return new FlyAbility(newOwner, this.logService, this.abilityService);
  }
}
