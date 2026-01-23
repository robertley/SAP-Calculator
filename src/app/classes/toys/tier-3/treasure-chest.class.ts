import { Toy } from '../../toy.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Pet } from '../../pet.class';
import { LogService } from 'app/services/log.service';


export class TreasureChest extends Toy {
  name = 'Treasure Chest';
  tier = 3;
}


export class TreasureChestAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'TreasureChestAbility',
      owner: owner,
      triggers: [],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {}

  copy(newOwner: Pet): TreasureChestAbility {
    return new TreasureChestAbility(newOwner, this.logService);
  }
}

