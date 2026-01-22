import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { InjectorService } from 'app/services/injector.service';
import { EquipmentService } from 'app/services/equipment/equipment.service';

export class FoxAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Fox Ability',
      owner: owner,
      triggers: ['EndTurn'],
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
    const owner = this.owner;
    const equipmentService =
      InjectorService.getInjector().get(EquipmentService);
    const equipmentMap = equipmentService.getInstanceOfAllEquipment();
    const shopFoods = Array.from(equipmentMap.values()).filter(
      (equipment) => equipment.equipmentClass === 'shop',
    );
    if (shopFoods.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const stolenFood = shopFoods[shopFoods.length - 1];
    const effectMultiplier = this.level;
    const baseBuff = Math.max(1, owner.level * 2);
    const totalBuff = baseBuff * effectMultiplier;
    owner.increaseAttack(totalBuff);
    owner.increaseHealth(totalBuff);

    this.logService.createLog({
      message: `${owner.name} stole ${stolenFood.name} (x${effectMultiplier}) and gained +${totalBuff}/+${totalBuff}.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): FoxAbility {
    return new FoxAbility(newOwner, this.logService);
  }
}
