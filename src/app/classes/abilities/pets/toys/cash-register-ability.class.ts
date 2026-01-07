import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { LogService } from "app/services/log.service";

export class CashRegisterAbility extends Ability {
    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'CashRegisterAbility',
            triggers: [],
            owner: owner,
            abilityType: 'Pet',
            abilityFunction: (context: AbilityContext) => {
                // Placeholder for Cash Register ability
            }
        });
    }
}
