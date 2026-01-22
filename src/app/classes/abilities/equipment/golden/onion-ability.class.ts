import { Ability, AbilityContext } from '../../../ability.class';
import { Pet } from '../../../pet.class';
import { Equipment } from '../../../equipment.class';
import { LogService } from 'app/services/log.service';
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
