import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Blueberry } from 'app/domain/entities/catalog/equipment/custom/blueberry.class';


export class FruitFly extends Pet {
  name = 'Fruit Fly';
  tier = 2;
  pack: Pack = 'Custom';
  attack = 2;
  health = 2;
  initAbilities(): void {
    this.addAbility(new FruitFlyAbility(this, this.logService));
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


export class FruitFlyAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'FruitFlyAbility',
      owner: owner,
      triggers: ['StartBattle'],
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
    const { tiger, pteranodon } = context;
    const owner = this.owner;

    let targetResp = owner.parent.getOppositeEnemyPet(owner);
    let target = targetResp.pet;
    if (target == null) {
      return;
    }

    target.givePetEquipment(new Blueberry());
    this.logService.createLog({
      message: `${owner.name} gave ${target.name} Blueberry.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
      randomEvent: targetResp.random,
    });

    let power = this.level * 2;
    owner.snipePet(target, power, targetResp.random, tiger);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): FruitFlyAbility {
    return new FruitFlyAbility(newOwner, this.logService);
  }
}



