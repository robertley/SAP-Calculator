import { LogService } from 'app/integrations/log.service';
import { Equipment, EquipmentClass } from '../../../equipment.class';
import { Pet } from '../../../pet.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Eggplant extends Equipment {
  name = 'Eggplant';
  equipmentClass = 'beforeStartOfBattle' as EquipmentClass;
  callback = (pet: Pet) => {
    const equipment = pet.getEquippedEquipmentInstance(this);
    pet.addAbility(new EggplantAbility(pet, equipment, this.logService));
  };
  constructor(protected logService: LogService) {
    super();
  }
}

export class EggplantAbility extends Ability {
  private equipment: Equipment;
  private logService: LogService;

  constructor(owner: Pet, equipment: Equipment, logService: LogService) {
    super({
      name: 'EggplantAbility',
      owner: owner,
      triggers: ['BeforeStartBattle'],
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

    let multiplier = this.equipment.multiplier;

    for (let i = 0; i < multiplier; i++) {
      let opponent = owner.parent.opponent;
      let target = opponent.getPet(owner.position);
      if (target == null) {
        return;
      }

      let multiplierMessage = i > 0 ? this.equipment.multiplierMessage : '';
      this.logService.createLog({
        message: `${owner.name} pushed ${target.name} 1 space forward. (Eggplant)${multiplierMessage}`,
        type: 'equipment',
        player: owner.parent,
      });

      opponent.pushPet(target, 1);
    }
  }
}


