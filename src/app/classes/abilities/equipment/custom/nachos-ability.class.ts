import { Ability, AbilityContext } from '../../../ability.class';
import { Pet } from '../../../pet.class';
import { Equipment } from '../../../equipment.class';
import { LogService } from 'app/services/log.service';
export class NachosAbility extends Ability {
  private equipment: Equipment;
  private logService: LogService;

  constructor(owner: Pet, equipment: Equipment, logService: LogService) {
    super({
      name: 'NachosAbility',
      owner: owner,
      triggers: ['BeforeThisAttacks'],
      abilityType: 'Equipment',
      native: true,
      maxUses: 1, // Equipment is removed after use
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
      // Calculate how much health can be converted (up to 3, but don't kill pet)
      let maxConversion = 3;
      let availableHealth = owner.health - 1; // Keep pet alive (minimum 1 health)
      let conversionAmount = Math.min(maxConversion, availableHealth);

      // Only convert if there's health to convert
      if (conversionAmount > 0) {
        // Convert health to attack
        owner.increaseHealth(-conversionAmount);
        owner.increaseAttack(conversionAmount);

        let multiplierMessage = i > 0 ? this.equipment.multiplierMessage : '';
        this.logService.createLog({
          message: `${owner.name} converted ${conversionAmount} health into ${conversionAmount} attack (Nachos)${multiplierMessage}`,
          type: 'equipment',
          player: owner.parent,
        });
      }
    }

    // Remove equipment after use
    owner.removePerk();
  }
}
