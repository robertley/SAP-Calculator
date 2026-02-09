import { LogService } from 'app/integrations/log.service';
import { Equipment, EquipmentClass } from '../../../equipment.class';
import { Pet } from '../../../pet.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Fig extends Equipment {
  name = 'Fig';
  equipmentClass: EquipmentClass = 'beforeAttack';
  hasRandomEvents = true;
  callback = (pet: Pet) => {
    const equipment = pet.getEquippedEquipmentInstance(this);
    pet.addAbility(new FigAbility(pet, equipment));
  };

  constructor(protected logService: LogService) {
    super();
  }
}


export class FigAbility extends Ability {
  private equipment: Equipment;

  constructor(owner: Pet, equipment: Equipment) {
    super({
      name: 'FigAbility',
      owner: owner,
      triggers: ['BeforeThisAttacks'],
      abilityType: 'Equipment',
      native: true,
      maxUses: 1, // Fig is removed after one use
      abilitylevel: 1,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.equipment = equipment;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;

    let multiplier = this.equipment.multiplier;

    for (let i = 0; i < multiplier; i++) {
      let attackPetResp = owner.parent.opponent.getLowestHealthPet();
      let attackPet = attackPetResp.pet;
      if (attackPet == null) {
        return;
      }

      // Use proper snipePet method with equipment=true flag and correct randomness
      owner.snipePet(
        attackPet,
        4,
        attackPetResp.random,
        false,
        false,
        true,
        false,
      );
    }

    // Remove equipment after use
    owner.removePerk();
  }
}


