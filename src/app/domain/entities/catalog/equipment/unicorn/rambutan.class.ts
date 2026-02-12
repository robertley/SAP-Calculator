import { LogService } from 'app/integrations/log.service';
import { Equipment, EquipmentClass } from '../../../equipment.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Pet } from '../../../pet.class';


export class Rambutan extends Equipment {
  name = 'Rambutan';
  equipmentClass = 'beforeAttack' as EquipmentClass;
  callback = (pet: Pet): void => {
    const equipment = pet.getEquippedEquipmentInstance(this);
    pet.addAbility(new RambutanAbility(pet, equipment, this.logService));
  };

  constructor(protected logService: LogService) {
    super();
  }
}


export class RambutanAbility extends Ability {
  private equipment: Equipment;
  private logService: LogService;

  constructor(owner: Pet, equipment: Equipment, logService: LogService) {
    super({
      name: 'RambutanAbility',
      owner: owner,
      triggers: ['BeforeThisAttacks'],
      abilityType: 'Equipment',
      native: true,
      abilitylevel: 1,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.equipment = equipment;
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;

    let baseManaGain = 3;
    let multiplier = this.equipment.multiplier;
    let manaGain = baseManaGain * multiplier;

    this.logService.createLog({
      message: `${owner.name} gained ${manaGain} mana. (Rambutan)${this.equipment.multiplierMessage}`,
      type: 'equipment',
      player: owner.parent,
    });

    owner.increaseMana(manaGain);
  }
}


