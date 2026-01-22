import { Ability, AbilityContext } from '../../../ability.class';
import { Pet } from '../../../pet.class';
import { Equipment } from '../../../equipment.class';
import { Fish } from '../../../pets/turtle/tier-1/fish.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';

export class CodRoeAbility extends Ability {
  private equipment: Equipment;
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    equipment: Equipment,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'CodRoeAbility',
      owner: owner,
      triggers: ['ThisDied'],
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
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;

    for (let i = 0; i < this.equipment.multiplier; i++) {
      let fish = new Fish(
        this.logService,
        this.abilityService,
        owner.parent,
        3,
        2,
        0,
        0,
      );

      let summonResult = owner.parent.summonPet(fish, owner.savedPosition);
      if (summonResult.success) {
        let multiplierMessage = i > 0 ? this.equipment.multiplierMessage : '';

        this.logService.createLog({
          message: `${owner.name} spawned ${fish.name} (Cod Roe)${multiplierMessage}`,
          type: 'equipment',
          player: owner.parent,
        });
      }
    }
  }
}
