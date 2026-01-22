import { Ability, AbilityContext } from '../../../ability.class';
import { Pet } from '../../../pet.class';
import { Equipment } from '../../../equipment.class';
import { LogService } from 'app/services/log.service';
export class SquashAbility extends Ability {
  private equipment: Equipment;
  private logService: LogService;

  constructor(owner: Pet, equipment: Equipment, logService: LogService) {
    super({
      name: 'SquashAbility',
      owner: owner,
      triggers: ['BeforeThisAttacks'],
      abilityType: 'Equipment',
      native: true,
      maxUses: 1, // Squash is removed after one use
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

    for (let i = 0; i < this.equipment.multiplier; i++) {
      // Squash targets the pet being attacked, need to get front pet from opponent
      let targetPet = owner.parent.opponent.pet0;
      if (targetPet == null || !targetPet.alive) {
        console.warn("squash didn't find target");
        return;
      }

      let power = 6;
      let reducedTo = Math.max(1, targetPet.health - power);
      targetPet.health = reducedTo;
      let multiplierMessage = i > 0 ? this.equipment.multiplierMessage : '';
      this.logService.createLog({
        message: `${this.equipment.name} reduced ${targetPet.name} health by ${power} (${reducedTo})${multiplierMessage}`,
        type: 'equipment',
        player: owner.parent,
      });
    }

    // Remove equipment after use
    owner.removePerk();
  }
}
