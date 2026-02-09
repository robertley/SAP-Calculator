import { LogService } from 'app/integrations/log.service';
import { Equipment, EquipmentClass } from '../../../equipment.class';
import { Pet } from '../../../pet.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Onion extends Equipment {
  name = 'Onion';
  equipmentClass = 'beforeAttack' as EquipmentClass;
  callback = (pet: Pet) => {
    const equipment = pet.getEquippedEquipmentInstance(this);
    pet.addAbility(new OnionAbility(pet, equipment, this.logService));
  };
  constructor(protected logService: LogService) {
    super();
  }
}

export class OnionAbility extends Ability {
  private equipment: Equipment;
  private logService: LogService;

  constructor(owner: Pet, equipment: Equipment, logService: LogService) {
    super({
      name: 'OnionAbility',
      owner: owner,
      triggers: ['BeforeThisAttacks'],
      abilityType: 'Equipment',
      native: true,
      maxUses: 1, // Onion is removed after one use
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

    this.logService.createLog({
      message: `${owner.name} pushed itself to the back. (Onion)`,
      type: 'equipment',
      player: owner.parent,
    });

    owner.parent.pushPetToBack(owner);
    owner.parent.pushPetsForward();

    owner.removePerk();
  }
}


