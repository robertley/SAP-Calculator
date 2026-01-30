import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { InjectorService } from 'app/services/injector.service';
import { PetService } from 'app/services/pet/pet.service';
import { getRandomInt } from 'app/util/helper-functions';
import * as foodJson from 'assets/data/food.json';

type StatFood = {
  name: string;
  attack: number;
  health: number;
};

const STAT_FOODS: StatFood[] = (() => {
  const foods =
    (foodJson as unknown as { default?: any[] }).default ?? (foodJson as any[]);
  if (!Array.isArray(foods)) {
    return [];
  }

  const results: StatFood[] = [];
  const statRegex =
    /Give one pet \+(\d+) attack(?: and \+(\d+) health)?|Give one pet \+(\d+) health/;

  for (const food of foods) {
    const ability: string = food?.Ability ?? '';
    if (!ability || /perk/i.test(ability)) {
      continue;
    }
    if (!ability.startsWith('Give one pet +')) {
      continue;
    }

    const match = ability.match(statRegex);
    if (!match) {
      continue;
    }

    const attack = match[1] ? Number(match[1]) : 0;
    const health = match[2]
      ? Number(match[2])
      : match[3]
        ? Number(match[3])
        : 0;
    if (!Number.isFinite(attack) || !Number.isFinite(health)) {
      continue;
    }

    results.push({
      name: food.Name,
      attack,
      health,
    });
  }

  return results;
})();


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
      triggers: ['FoodEatenByThis', 'PostRemovalFaint'],
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

    if (context.trigger !== 'PostRemovalFaint') {
      this.triggerTigerExecution(context);
      return;
    }

    const foodCount = ownerData.locustFoodEaten ?? 0;
    if (foodCount <= 0) {
      this.triggerTigerExecution(context);
      return;
    }

    let summoned = 0;
    const spawnIndex = owner.position ?? owner.savedPosition ?? 0;
    const petService = InjectorService.getInjector().get(PetService);
    const statFoods = STAT_FOODS;

    for (let i = 0; i < foodCount; i++) {
      for (let j = 0; j < this.level; j++) {
        const randomPet = petService
          ? petService.getRandomPet(owner.parent)
          : null;
        if (!randomPet) {
          break;
        }
        const result = owner.parent.summonPet(
          randomPet,
          spawnIndex,
          false,
          owner,
        );
        if (!result.success) {
          break;
        }

        summoned++;

        if (statFoods.length > 0) {
          const statFood =
            statFoods[getRandomInt(0, statFoods.length - 1)];
          if (statFood) {
            if (statFood.attack) {
              randomPet.increaseAttack(statFood.attack);
            }
            if (statFood.health) {
              randomPet.increaseHealth(statFood.health);
            }
            this.abilityService?.triggerFoodEvents(
              randomPet,
              statFood.name.toLowerCase(),
            );
          }
        }
      }
    }

    this.logService.createLog({
      message: `${owner.name} summoned ${summoned} friend${summoned === 1 ? '' : 's'} and fed them random food.`,
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

