import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Fish } from 'app/classes/pets/turtle/tier-1/fish.class';


export class CodRoe extends Equipment {
  name = 'Cod Roe';
  equipmentClass = 'afterFaint' as EquipmentClass;
  callback = (pet: Pet) => {
    const equipment = pet.getEquippedEquipmentInstance(this);
    // Add Cod Roe ability using dedicated ability class
    pet.addAbility(
      new CodRoeAbility(pet, equipment, this.logService, this.abilityService),
    );
  };

  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
  ) {
    super();
  }
}


export class CodRoeAbility extends Ability {
  private equipment: Equipment;
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    equipment: Equipment,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'CodRoeAbility',
      owner: owner,
      triggers: ['PostRemovalFaint'],
      abilityType: 'Equipment',
      native: true,
      maxUses: 1, // Equipment is removed after one use
      abilitylevel: 1,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.equipment = equipment;
    this.logService = logService;
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;

    for (let i = 0; i < this.equipment.multiplier; i++) {
      let fish = new Fish(
        this.logService,
        this.abilityService,
        owner.parent,
        3,
        2,
        0,
        0,
      );

      let summonResult = owner.parent.summonPet(fish, owner.savedPosition);
      if (summonResult.success) {
        let multiplierMessage = i > 0 ? this.equipment.multiplierMessage : '';

        this.logService.createLog({
          message: `${owner.name} spawned ${fish.name} (Cod Roe)${multiplierMessage}`,
          type: 'equipment',
          player: owner.parent,
        });
      }
    }
  }
}

