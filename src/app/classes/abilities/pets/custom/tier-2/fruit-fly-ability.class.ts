import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { Blueberry } from '../../../../equipment/custom/blueberry.class';

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
