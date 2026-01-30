import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { Monkey } from 'app/classes/pets/turtle/tier-5/monkey.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Banana extends Equipment {
  name = 'Banana';
  equipmentClass = 'afterFaint' as EquipmentClass;
  callback = (pet: Pet) => {
    const equipment = pet.getEquippedEquipmentInstance(this);
    pet.addAbility(
      new BananaAbility(pet, equipment, this.logService, this.abilityService),
    );
  };

  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
  ) {
    super();
  }
}


export class BananaAbility extends Ability {
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
      name: 'BananaAbility',
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
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;

    for (let i = 0; i < this.equipment.multiplier; i++) {
      let monke = new Monkey(
        this.logService,
        this.abilityService,
        owner.parent,
        4,
        4,
        0,
        0,
      );

      let multiplierMessage = i > 0 ? this.equipment.multiplierMessage : '';

      let summonResult = owner.parent.summonPet(monke, owner.savedPosition);
      if (summonResult.success) {
        this.logService.createLog({
          message: `${owner.name} Spawned Monkey (Banana)${multiplierMessage}`,
          type: 'ability',
          player: owner.parent,
        });
      }
    }
  }
}

