import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class DungBeetle extends Pet {
  name = 'Dung Beetle';
  tier = 2;
  pack: Pack = 'Custom';
  attack = 2;
  health = 4;
  initAbilities(): void {
    this.addAbility(new DungBeetleAbility(this, this.logService));
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


export class DungBeetleAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'DungBeetleAbility',
      owner: owner,
      triggers: ['FoodEatenByFriendly', 'PostRemovalFaint'],
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
    const ownerData = owner as unknown as {
      dungBeetleFoodEaten?: number;
      dungBeetleFoodTurn?: number;
      dungBeetleFoodSeededTurn?: number;
    };

    const turnNumber = gameApi?.turnNumber ?? 0;
    if (ownerData.dungBeetleFoodTurn !== turnNumber) {
      ownerData.dungBeetleFoodTurn = turnNumber;
      ownerData.dungBeetleFoodEaten = 0;
    }
    if (ownerData.dungBeetleFoodSeededTurn !== turnNumber) {
      ownerData.dungBeetleFoodSeededTurn = turnNumber;
      const foods = owner.foodsEaten ?? 0;
      if (foods > 0) {
        ownerData.dungBeetleFoodEaten = Math.min(
          3,
          Math.max(ownerData.dungBeetleFoodEaten ?? 0, foods),
        );
      }
    }

    if (triggerPet && owner.alive) {
      ownerData.dungBeetleFoodEaten = Math.min(
        3,
        (ownerData.dungBeetleFoodEaten ?? 0) + 1,
      );
      return;
    }

    if (owner.alive) {
      return;
    }

    const foodCount = Math.min(3, ownerData.dungBeetleFoodEaten ?? 0);
    if (foodCount <= 0) {
      return;
    }

    const power = this.level * 3;
    for (let i = 0; i < foodCount; i++) {
      let targetResp = owner.parent.opponent.getLowestHealthPet(
        undefined,
        owner,
      );
      let target = targetResp.pet;
      if (target == null) {
        break;
      }
      owner.snipePet(target, power, targetResp.random, tiger);
    }

    this.logService.createLog({
      message: `${owner.name} dealt ${power} damage ${foodCount} time(s) to the weakest enemy.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): DungBeetleAbility {
    return new DungBeetleAbility(newOwner, this.logService);
  }
}

