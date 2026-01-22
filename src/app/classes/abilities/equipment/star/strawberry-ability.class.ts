import { Ability, AbilityContext } from '../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../pet.class';
import { Equipment } from '../../../equipment.class';
import { LogService } from 'app/services/log.service';

export class StrawberryAbility extends Ability {
  private equipment: Equipment;
  private logService: LogService;

  constructor(owner: Pet, equipment: Equipment, logService: LogService) {
    super({
      name: 'StrawberryAbility',
      owner: owner,
      triggers: ['ThisDied'],
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
