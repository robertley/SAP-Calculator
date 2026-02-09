import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class BlackBear extends Pet {
  name = 'Black Bear';
  tier = 6;
  pack: Pack = 'Custom';
  attack = 5;
  health = 6;
  initAbilities(): void {
    this.addAbility(new BlackBearAbility(this, this.logService));
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


export class BlackBearAbility extends Ability {
  private logService: LogService;
  private foodsEatenThisTurn = 0;
  private seededFromShop = false;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Black Bear Ability',
      owner: owner,
      triggers: ['StartTurn', 'FoodEatenByThis', 'PostRemovalFaint'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;

    if (context.trigger === 'StartTurn') {
      this.foodsEatenThisTurn = 0;
      this.seededFromShop = false;
      return;
    }

    if (!this.seededFromShop) {
      const foods = owner.foodsEaten ?? 0;
      if (foods > 0) {
        this.foodsEatenThisTurn = Math.max(this.foodsEatenThisTurn, foods);
      }
      this.seededFromShop = true;
    }

    if (context.trigger === 'FoodEatenByThis') {
      this.foodsEatenThisTurn++;
      return;
    }

    if (context.trigger === 'PostRemovalFaint') {
      const damagePerFood = this.level * 4;
      const totalDamage = damagePerFood * this.foodsEatenThisTurn;
      if (totalDamage <= 0) {
        this.triggerTigerExecution(context);
        return;
      }

      const targetResp = owner.parent.getRandomEnemyPetsWithSillyFallback(
        1,
        [],
        false,
        true,
        owner,
      );
      const target = targetResp.pets[0];
      if (!target) {
        this.triggerTigerExecution(context);
        return;
      }

      owner.dealDamage(target, totalDamage);

      this.logService.createLog({
        message: `${owner.name} dealt ${totalDamage} damage to ${target.name} after eating ${this.foodsEatenThisTurn} food item${this.foodsEatenThisTurn === 1 ? '' : 's'}.`,
        type: 'ability',
        player: owner.parent,
        tiger: context.tiger,
        pteranodon: context.pteranodon,
        randomEvent: targetResp.random,
      });
      this.triggerTigerExecution(context);
    }
  }

  copy(newOwner: Pet): BlackBearAbility {
    return new BlackBearAbility(newOwner, this.logService);
  }
}



