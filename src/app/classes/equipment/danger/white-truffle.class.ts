import { LogService } from 'app/services/log.service';
import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class WhiteTruffle extends Equipment {
  name = 'White Truffle';
  equipmentClass = 'faint' as EquipmentClass;

  callback = (pet: Pet) => {
    const equipment = pet.getEquippedEquipmentInstance(this);
    // Add White Truffle ability using dedicated ability class
    pet.addAbility(new WhiteTruffleAbility(pet, equipment, this.logService));
  };

  constructor(protected logService: LogService) {
    super();
  }
}


export class WhiteTruffleAbility extends Ability {
  private equipment: Equipment;
  private logService: LogService;
  constructor(owner: Pet, equipment: Equipment, logService: LogService) {
    super({
      name: 'WhiteTruffleAbility',
      owner: owner,
      triggers: ['PostRemovalFriendFaints'],
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
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, faintedPet, tiger } = context;
    const owner = this.owner;

    for (let i = 0; i < this.equipment.multiplier; i++) {
      let targetResp = owner.parent.opponent.getHighestAttackPet(
        undefined,
        owner,
      );
      if (targetResp.pet) {
        owner.jumpAttackPrep(targetResp.pet);
        owner.jumpAttack(targetResp.pet, tiger, null, targetResp.random);
      }
    }
    owner.removePerk();
  }
}

