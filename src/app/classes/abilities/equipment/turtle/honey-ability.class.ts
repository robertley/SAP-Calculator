import { Ability, AbilityContext } from '../../../ability.class';
import { Pet } from '../../../pet.class';
import { Equipment } from '../../../equipment.class';
import { Bee } from '../../../pets/hidden/bee.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';

export class HoneyAbility extends Ability {
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
      name: 'HoneyAbility',
      owner: owner,
      triggers: ['ThisDied'],
      abilityType: 'Equipment',
      native: true,
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
      let bee = new Bee(
        this.logService,
        this.abilityService,
        owner.parent,
        null,
        null,
        0,
      );

      let summonResult = owner.parent.summonPet(bee, owner.savedPosition);
      if (summonResult.success) {
        let multiplierMessage = i > 0 ? this.equipment.multiplierMessage : '';

        this.logService.createLog({
          message: `${owner.name} Spawned Bee (Honey)${multiplierMessage}`,
          type: 'ability',
          player: owner.parent,
        });
      }
    }
  }
}
