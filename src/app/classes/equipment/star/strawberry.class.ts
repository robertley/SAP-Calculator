import { LogService } from 'app/services/log.service';
import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Strawberry extends Equipment {
  name = 'Strawberry';
  equipmentClass = 'shield' as EquipmentClass;
  tier = 1;
  uses = 2;
  originalUses = 2;

  callback = (pet: Pet) => {
    const equipment = pet.getEquippedEquipmentInstance(this);
    // Add Strawberry ability using dedicated ability class
    pet.addAbility(new StrawberryAbility(pet, equipment, this.logService));
  };

  constructor(protected logService: LogService) {
    super();
  }
}


export class StrawberryAbility extends Ability {
  private equipment: Equipment;
  private logService: LogService;

  constructor(owner: Pet, equipment: Equipment, logService: LogService) {
    super({
      name: 'StrawberryAbility',
      owner: owner,
      triggers: ['PostRemovalFaint'],
      abilityType: 'Equipment',
      native: true,
      maxUses: equipment.originalUses,
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

    const targetResp = owner.parent.getLastPet();
    if (targetResp.pet) {
      const buffAmount = 1 * this.equipment.multiplier;

      let multiplierMessage = this.equipment.multiplierMessage;
      this.logService.createLog({
        message: `${owner.name} (Strawberry) gave ${targetResp.pet.name} +${buffAmount} attack and +${buffAmount} health${multiplierMessage}.`,
        type: 'equipment',
        player: owner.parent,
        randomEvent: targetResp.random,
      });

      targetResp.pet.increaseAttack(buffAmount);
      targetResp.pet.increaseHealth(buffAmount);
    }
  }
}

