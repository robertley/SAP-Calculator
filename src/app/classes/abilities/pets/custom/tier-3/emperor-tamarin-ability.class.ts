import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class EmperorTamarinAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Emperor Tamarin Ability',
            owner: owner,
            triggers: ['ThisSold'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const owner = this.owner;
        const percentage = this.level === 1 ? 33 : (this.level === 2 ? 66 : 100);

        // Shop logic - log the effect
        this.logService.createLog({
            message: `${owner.name} sold and gave ${percentage}% of its stats to the leftmost shop pet.`,
            type: 'ability',
            player: owner.parent
        });

        this.triggerTigerExecution(context);
    }

    override copy(newOwner: Pet): EmperorTamarinAbility {
        return new EmperorTamarinAbility(newOwner, this.logService);
    }
}