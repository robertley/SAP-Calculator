import { LogService } from 'app/integrations/log.service';
import { PetService } from 'app/integrations/pet/pet.service';
import { Equipment, EquipmentClass } from '../../../equipment.class';
import { Pet } from '../../../pet.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


//TO DO: Add all tier 1 faint pet
export class FaintBread extends Equipment {
  name = 'Faint Bread';
  equipmentClass: EquipmentClass = 'afterFaint';
  callback = (pet: Pet) => {
    const equipment = pet.getEquippedEquipmentInstance(this);
    pet.addAbility(
      new FaintBreadAbility(pet, equipment, this.petService, this.logService),
    );
  };

  constructor(
    protected logService: LogService,
    protected petService: PetService,
  ) {
    super();
  }
}


export class FaintBreadAbility extends Ability {
  private equipment: Equipment;
  private petService: PetService;
  private logService: LogService;

  constructor(
    owner: Pet,
    equipment: Equipment,
    petService: PetService,
    logService: LogService,
  ) {
    super({
      name: 'FaintBreadAbility',
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
    this.petService = petService;
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;

    for (let i = 0; i < this.equipment.multiplier; i++) {
      let faintPet = this.petService.getRandomFaintPet(owner.parent, 1);

      let multiplierMessage = i > 0 ? this.equipment.multiplierMessage : '';

      let summonResult = owner.parent.summonPet(faintPet, owner.savedPosition);
      if (summonResult.success) {
        this.logService.createLog({
          message: `${owner.name} Spawned ${faintPet.name} (Faint Bread)${multiplierMessage}`,
          type: 'ability',
          player: owner.parent,
          randomEvent: true,
        });
      }
    }
  }
}



