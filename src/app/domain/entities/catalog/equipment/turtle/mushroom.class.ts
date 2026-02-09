import { LogService } from 'app/integrations/log.service';
import { Equipment, EquipmentClass } from '../../../equipment.class';
import { Pet } from '../../../pet.class';
import { PetService } from 'app/integrations/pet/pet.service';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Mushroom extends Equipment {
  name = 'Mushroom';
  tier = 6;
  equipmentClass = 'afterFaint' as EquipmentClass;
  callback = (pet: Pet) => {
    const equipment = pet.getEquippedEquipmentInstance(this);
    // Add Mushroom ability using dedicated ability class
    pet.addAbility(
      new MushroomAbility(pet, equipment, this.logService, this.petService),
    );
  };

  constructor(
    protected logService: LogService,
    protected petService: PetService,
  ) {
    super();
  }
}


export class MushroomAbility extends Ability {
  private equipment: Equipment;
  private logService: LogService;
  private petService: PetService;

  constructor(
    owner: Pet,
    equipment: Equipment,
    logService: LogService,
    petService: PetService,
  ) {
    super({
      name: 'MushroomAbility',
      owner: owner,
      triggers: ['PostRemovalFaint'],
      abilityType: 'Equipment',
      native: true,
      abilitylevel: 1,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.equipment = equipment;
    this.logService = logService;
    this.petService = petService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;

    for (let i = 0; i < this.equipment.multiplier; i++) {
      let newPet = this.petService.createDefaultVersionOfPet(owner, 1, 1);
      newPet.exp = owner.exp;
      newPet.triggersConsumed = owner.triggersConsumed;
      newPet.originalTriggersConsumed = owner.triggersConsumed;

      let summonResult = owner.parent.summonPet(newPet, owner.savedPosition);
      if (summonResult.success) {
        let multiplierMessage = i > 0 ? this.equipment.multiplierMessage : '';

        this.logService.createLog({
          message: `${owner.name} Spawned ${newPet.name} (level ${newPet.level}) (Mushroom)${multiplierMessage}`,
          type: 'ability',
          player: owner.parent,
        });
      }
    }
  }
}



