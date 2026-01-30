import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { Tandgnost } from 'app/classes/pets/custom/tier-4/tandgnost.class';
import { Tandgrisner } from 'app/classes/pets/custom/tier-5/tandgrisner.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class YggdrasilFruit extends Equipment {
  name = 'Yggdrasil Fruit';
  equipmentClass = 'afterFaint' as EquipmentClass;
  callback = (pet?: Pet) => {
    pet.addAbility(
      new YggdrasilFruitAbility(
        pet,
        this,
        this.logService,
        this.abilityService,
      ),
    );
  };
  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
  ) {
    super();
  }
}


export class YggdrasilFruitAbility extends Ability {
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
      name: 'YggdrasilFruitAbility',
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
      let tandgnost = new Tandgnost(
        this.logService,
        this.abilityService,
        owner.parent,
        5,
        5,
        0,
      );
      let tandgrisner = new Tandgrisner(
        this.logService,
        this.abilityService,
        owner.parent,
        5,
        5,
        0,
      );

      let multiplierMessage = i > 0 ? this.equipment.multiplierMessage : '';

      let summonResult = owner.parent.summonPet(tandgnost, owner.savedPosition);
      if (summonResult.success) {
        this.logService.createLog({
          message: `${owner.name} Spawned Tandgnost (Yggdrasil Fruit)${multiplierMessage}`,
          type: 'ability',
          player: owner.parent,
        });
      }

      let summonResult2 = owner.parent.summonPet(
        tandgrisner,
        owner.savedPosition,
      );
      if (summonResult2.success) {
        this.logService.createLog({
          message: `${owner.name} Spawned Tandgrisner (Yggdrasil Fruit)${multiplierMessage}`,
          type: 'ability',
          player: owner.parent,
        });
      }
    }
  }
}

