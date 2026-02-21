import { LogService } from 'app/integrations/log.service';
import { Equipment, EquipmentClass } from '../../../equipment.class';
import { Pet } from '../../../pet.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class FairyDust extends Equipment {
  name = 'Fairy Dust';
  equipmentClass = 'beforeStartOfBattle' as EquipmentClass;
  callback = (pet: Pet) => {
    const equipment = pet.getEquippedEquipmentInstance(this);
    pet.addAbility(new FairyDustAbility(pet, equipment, this.logService));
  };
  constructor(protected logService: LogService) {
    super();
  }
}

export class FairyDustAbility extends Ability {
  private equipment: Equipment;
  private logService: LogService;

  constructor(owner: Pet, equipment: Equipment, logService: LogService) {
    super({
      name: 'FairyDustAbility',
      owner: owner,
      triggers: ['EmptyFrontSpace'],
      abilityType: 'Equipment',
      native: true,
      maxUses: 1, // Fairy Dust is removed after one use
      abilitylevel: 1,
      condition: () => {
        return this.owner.parent.pet0 == null;
      },
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
    let manaAmmt = 2 * multiplier;

    this.logService.createLog({
      message: `${owner.name} pushed itself to the front and gained ${manaAmmt} mana(Fairy Dust)${this.equipment.multiplierMessage}.`,
      type: 'ability',
      player: owner.parent,
    });

    owner.parent.pushPetToFront(owner, true);
    owner.increaseMana(manaAmmt);
    owner.removePerk();
  }
}


