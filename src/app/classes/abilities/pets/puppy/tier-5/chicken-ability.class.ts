import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";

export class ChickenAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'ChickenAbility',
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
        const buff = this.level;
        this.logService.createLog({
            message: `${owner.name} gave future shop pets +${buff} attack and +${buff} health.`,
            type: 'ability',
            player: owner.parent,
            tiger: context.tiger
        });
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): ChickenAbility {
        return new ChickenAbility(newOwner, this.logService, this.abilityService);
    }
}
