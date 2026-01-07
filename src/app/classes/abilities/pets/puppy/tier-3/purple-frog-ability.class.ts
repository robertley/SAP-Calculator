import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "../../../../../services/log.service";

export class PurpleFrogAbility extends Ability {
    constructor(owner: Pet, private logService: LogService) {
        super({
            name: 'PurpleFrogAbility',
            owner: owner,
            triggers: ['FriendSummoned'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: 1,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
    }

    private executeAbility(context: AbilityContext): void {
        // Empty implementation - to be filled by user
        this.triggerTigerExecution(context);
    }
}
