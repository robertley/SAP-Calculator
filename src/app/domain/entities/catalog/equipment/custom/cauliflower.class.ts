import { Equipment, EquipmentClass } from '../../../equipment.class';
import { Pet } from '../../../pet.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { InjectorService } from 'app/integrations/injector.service';
import { LogService } from 'app/integrations/log.service';


export class Cauliflower extends Equipment {
  name = 'Cauliflower';
  equipmentClass: EquipmentClass = 'shop';
  callback = (pet: Pet) => {
    const equipment = pet.getEquippedEquipmentInstance(this);
    pet.addAbility(new CauliflowerAbility(pet, equipment));
  };
}


export class CauliflowerAbility extends Ability {
  private equipment: Equipment;
  private logService: LogService;

  constructor(owner: Pet, equipment: Equipment) {
    super({
      name: 'CauliflowerAbility',
      owner: owner,
      triggers: ['KnockOut'],
      abilityType: 'Equipment',
      native: true,
      maxUses: 1,
      abilitylevel: 1,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.equipment = equipment;
    this.logService = InjectorService.getInjector().get(LogService);
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    if (!owner.alive) {
      owner.removePerk();
      return;
    }

    const buffAmount = 1 * this.equipment.multiplier;
    owner.increaseAttack(buffAmount);
    owner.increaseHealth(buffAmount);

    this.logService.createLog({
      message: `${owner.name} gained +${buffAmount} attack and +${buffAmount} health. (Cauliflower)${this.equipment.multiplierMessage}`,
      type: 'equipment',
      player: owner.parent,
    });

    owner.removePerk();
  }
}


