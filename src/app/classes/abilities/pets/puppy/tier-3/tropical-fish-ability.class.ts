import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability/ability.service";
import { getAdjacentAlivePets, logAbility } from "../../../ability-helpers";

export class TropicalFishAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'TropicalFishAbility',
            owner: owner,
            triggers: ['StartTurn'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
        this.abilityService = abilityService;
    }

    private executeAbility(context: AbilityContext): void {
        const owner = this.owner;
        const targets = getAdjacentAlivePets(owner);
        if (targets.length === 0) {
            this.triggerTigerExecution(context);
            return;
        }

        for (const target of targets) {
            target.increaseHealth(this.level);
            logAbility(
                this.logService,
                owner,
                `${owner.name} gave ${target.name} +${this.level} health.`,
                context.tiger,
                context.pteranodon
            );
        }
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): TropicalFishAbility {
        return new TropicalFishAbility(newOwner, this.logService, this.abilityService);
    }
}
