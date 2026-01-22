import { Ability, AbilityContext } from '../../../ability.class';
import { Pet } from '../../../pet.class';
import { Equipment } from '../../../equipment.class';
import { LogService } from 'app/services/log.service';

export class SudduthTomatoAbility extends Ability {
  private equipment: Equipment;
  private logService: LogService;

  constructor(owner: Pet, equipment: Equipment, logService: LogService) {
    super({
      name: 'SudduthTomatoAbility',
      owner: owner,
      triggers: ['ThisHurt'],
      abilityType: 'Equipment',
      native: true,
      maxUses: 1, // Equipment is removed after one use
      abilitylevel: 1,
      condition: (context: AbilityContext) => {
        const { triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;

        // Check if pet is still alive after being hurt
        if (!owner.alive) {
          return false;
        }

        return true;
      },
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.equipment = equipment;
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet } = context;
    const owner = this.owner;

    let multiplier = this.equipment.multiplier;
    let healthGain = 1 * multiplier;
    owner.increaseHealth(healthGain);

    this.logService.createLog({
      message: `${owner.name} gained ${healthGain} health (Sudduth Tomato)${this.equipment.multiplierMessage}`,
      type: 'equipment',
      player: owner.parent,
    });

    // Remove equipment after one use
    owner.removePerk();
  }
}
