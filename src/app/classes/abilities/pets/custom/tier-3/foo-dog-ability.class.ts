import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class FooDogAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Foo Dog Ability',
            owner: owner,
            triggers: ['ThisBought'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const owner = this.owner;
        const hpBuff = 2 * this.level;

        // Shop logic - log the effect
        this.logService.createLog({
            message: `${owner.name} was bought and gave future shop pets from the next tier +${hpBuff} health.`,
            type: 'ability',
            player: owner.parent
        });

        this.triggerTigerExecution(context);
    }

    override copy(newOwner: Pet): FooDogAbility {
        return new FooDogAbility(newOwner, this.logService);
    }
}