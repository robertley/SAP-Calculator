import { LogService } from 'app/integrations/log.service';
import { Equipment, EquipmentClass } from '../../../equipment.class';
import { Pet } from '../../../pet.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class CashewNut extends Equipment {
  name = 'Cashew Nut';
  tier = 1;
  equipmentClass: EquipmentClass = 'beforeAttack';
  callback = (pet: Pet) => {
    const equipment = pet.getEquippedEquipmentInstance(this);
    // Add Cashew Nut ability using dedicated ability class
    pet.addAbility(new CashewNutAbility(pet, equipment));
  };

  constructor(protected logService: LogService) {
    super();
  }
}


export class CashewNutAbility extends Ability {
  private equipment: Equipment;

  constructor(owner: Pet, equipment: Equipment) {
    super({
      name: 'CashewNutAbility',
      owner: owner,
      triggers: ['BeforeThisAttacks'],
      abilityType: 'Equipment',
      native: true,
      maxUses: 1,
      abilitylevel: 1,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.equipment = equipment;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const targetResp = owner.parent.opponent.getFurthestUpPets(
      2,
      undefined,
      owner,
    );
    const target = targetResp.pets[1];

    if (target?.alive) {
      owner.snipePet(
        target,
        2 * this.equipment.multiplier,
        targetResp.random,
        null,
        null,
        true,
        false,
        'sniped',
        2,
      );
    }

    owner.removePerk();
  }
}


