import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { EquipmentService } from 'app/services/equipment/equipment.service';
import { InjectorService } from 'app/services/injector.service';
import { getRandomInt } from 'app/util/helper-functions';

export class SilkieChickenAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Silkie Chicken Ability',
      owner: owner,
      triggers: ['FriendGainsAilment'],
      abilityType: 'Pet',
      native: true,
      maxUses: 2,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon, triggerPet } = context;
    const owner = this.owner;
    const target = triggerPet;

    if (!target || !target.alive) {
      this.triggerTigerExecution(context);
      return;
    }

    const equipmentService =
      InjectorService.getInjector().get(EquipmentService);
    const perks = equipmentService.getUsefulPerksByTier(1);

    if (perks.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const perkIndex = getRandomInt(0, perks.length - 1);
    const perk = perks[perkIndex];
    target.givePetEquipment(perk);

    this.logService.createLog({
      message: `${owner.name} gave ${target.name} the ${perk.name} perk.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): SilkieChickenAbility {
    return new SilkieChickenAbility(newOwner, this.logService);
  }
}
