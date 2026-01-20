import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability/ability.service";

export class GoldfishAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: "GoldfishAbility",
            owner: owner,
            triggers: ['StartTurn'],
            abilityType: "Pet",
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
        owner.increaseSellValue(this.level);
        this.logService.createLog({
            message: `${owner.name} increased its sell value by ${this.level}.`,
            type: 'ability',
            player: owner.parent,
            tiger: context.tiger
        });
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): GoldfishAbility {
        return new GoldfishAbility(newOwner, this.logService, this.abilityService);
    }
}
