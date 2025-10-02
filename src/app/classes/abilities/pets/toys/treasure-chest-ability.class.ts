import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { LogService } from "app/services/log.service";

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
            }
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
    }

    copy(newOwner: Pet): TreasureChestAbility {
        return new TreasureChestAbility(newOwner, this.logService);
    }
}