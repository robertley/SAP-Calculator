import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { shuffle } from 'app/runtime/random';


export class BlueJay extends Pet {
  name = 'Blue Jay';
  tier = 5;
  pack: Pack = 'Custom';
  attack = 3;
  health = 3;
  initAbilities(): void {
    this.addAbility(new BlueJayAbility(this, this.logService));
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


export class BlueJayAbility extends Ability {
  private logService: LogService;
  private foodsEatenThisTurn = 0;
  private seededFromShop = false;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Blue Jay Ability',
      owner: owner,
      triggers: ['FoodEatenByThis', 'StartTurn', 'PostRemovalFaint'],
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
      const buffPerFood = this.level;
      const totalBuff = buffPerFood * this.foodsEatenThisTurn;
      if (totalBuff <= 0) {
        this.triggerTigerExecution(context);
        return;
      }

      const friends = owner.parent.petArray.filter(
        (friend) => friend && friend !== owner && friend.alive,
      );

      if (friends.length === 0) {
        this.triggerTigerExecution(context);
        return;
      }

      shuffle(friends);
      const targets = friends.slice(0, 3);

      for (const target of targets) {
        target.increaseAttack(totalBuff);
        target.increaseHealth(totalBuff);
      }

      this.logService.createLog({
        message: `${owner.name} gave ${targets.map((pet) => pet.name).join(', ')} +${totalBuff}/+${totalBuff} after fainting.`,
        type: 'ability',
        player: owner.parent,
        tiger: context.tiger,
        pteranodon: context.pteranodon,
      });
      this.triggerTigerExecution(context);
    }
  }

  copy(newOwner: Pet): BlueJayAbility {
    return new BlueJayAbility(newOwner, this.logService);
  }
}







