import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";

export class NurikabeAbility extends Ability {

    constructor(owner: Pet) {
        super({
            name: 'NurikabeAbility',
            owner: owner,
            triggers: [],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
    }

    private executeAbility(context: AbilityContext): void {
    }

    copy(newOwner: Pet): NurikabeAbility {
        return new NurikabeAbility(newOwner);
    }
}