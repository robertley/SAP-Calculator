import { Ability, AbilityContext } from '../../../ability.class';
import { Pet } from '../../../pet.class';
import { Equipment } from '../../../equipment.class';
import { LogService } from 'app/services/log.service';

export class BaguetteAbility extends Ability {
  private equipment: Equipment;
  private logService: LogService;

  constructor(owner: Pet, equipment: Equipment, logService: LogService) {
    super({
      name: 'BaguetteAbility',
      owner: owner,
      triggers: ['BeforeThisAttacks'],
      abilityType: 'Equipment',
      native: true,
      maxUses: 1, // Baguette is one-time use (removes itself after use)
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
    // Remove the front-most enemy's equipment
    for (let i = 0; i < this.equipment.multiplier; i++) {
      let excludePet = owner.parent.opponent.getPetsWithoutEquipment('Perk');
      let frontMostEnemy = owner.parent.opponent.getFurthestUpPet(
        owner,
        excludePet,
      ).pet;

      if (frontMostEnemy == null) {
        return;
      }
      if (frontMostEnemy.equipment != null) {
        let removedEquipment = frontMostEnemy.equipment.name;
        frontMostEnemy.removePerk();

        let multiplierMessage = i > 0 ? this.equipment.multiplierMessage : '';
        this.logService.createLog({
          message: `${owner.name} removed ${removedEquipment} from ${frontMostEnemy.name} (Baguette)${multiplierMessage}`,
          type: 'equipment',
          player: owner.parent,
        });
      }
    }
    owner.removePerk();
  }
}
