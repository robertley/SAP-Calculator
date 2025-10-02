import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";

export class FanMusselAbility extends Ability {

    constructor(owner: Pet) {
        super({
            name: 'FanMusselAbility',
            owner: owner,
            triggers: [],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: 2,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
    }

    private executeAbility(context: AbilityContext): void {
        // Empty implementation - to be filled by user
        //this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): FanMusselAbility {
        return new FanMusselAbility(newOwner);
    }
}