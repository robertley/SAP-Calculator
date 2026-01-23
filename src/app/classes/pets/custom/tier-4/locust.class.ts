import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Locust extends Pet {
  name = 'Locust';
  tier = 4;
  pack: Pack = 'Custom';
  attack = 3;
  health = 3;

  override initAbilities(): void {
    this.addAbility(
      new LocustAbility(this, this.logService, this.abilityService),
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


class PlainLocust extends Pet {
  name = 'Plain Locust';
  tier = 1;
  pack: Pack = 'Custom';
  attack = 1;
  health = 1;

  override initAbilities(): void {
    // Tokens do not gain any abilities
  }

  constructor(
    logService: LogService,
    abilityService: AbilityService,
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

export class LocustAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'Locust Ability',
      owner: owner,
      triggers: ['FoodEatenByThis', 'ThisDied'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, tiger, pteranodon } = context;
    const owner = this.owner;
    const ownerData = owner as {
      locustFoodEaten?: number;
      locustFoodTurn?: number;
    };

    const turnNumber = gameApi?.turnNumber ?? 0;
    if (ownerData.locustFoodTurn !== turnNumber) {
      ownerData.locustFoodTurn = turnNumber;
      ownerData.locustFoodEaten = 0;
    }

    if (context.trigger === 'FoodEatenByThis' && owner.alive) {
      ownerData.locustFoodEaten = (ownerData.locustFoodEaten ?? 0) + 1;
      return;
    }

    if (context.trigger !== 'ThisDied') {
      this.triggerTigerExecution(context);
      return;
    }

    const foodCount = ownerData.locustFoodEaten ?? 0;
    if (foodCount <= 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const locustStat = this.level * 3;
    let summoned = 0;
    const spawnIndex = owner.position ?? owner.savedPosition ?? 0;
    for (let i = 0; i < foodCount; i++) {
      const token = new PlainLocust(
        this.logService,
        this.abilityService,
        owner.parent,
        locustStat,
        locustStat,
      );
      const result = owner.parent.summonPet(token, spawnIndex, false, owner);
      if (result.success) {
        summoned++;
      } else {
        break;
      }
    }

    this.logService.createLog({
      message: `${owner.name} summoned ${summoned} ${locustStat}/${locustStat} plain Locust${summoned === 1 ? '' : 's'}.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): LocustAbility {
    return new LocustAbility(newOwner, this.logService, this.abilityService);
  }
}
