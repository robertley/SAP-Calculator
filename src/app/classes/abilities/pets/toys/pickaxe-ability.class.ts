import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";

export class PickaxeAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'PickaxeAbility',
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
        this.abilityService = abilityService;
    }

    private executeAbility(context: AbilityContext): void {
        const { gameApi, triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;

        // Mirror Pickaxe toy behavior (empty class - no effect)

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): PickaxeAbility {
        return new PickaxeAbility(newOwner, this.logService, this.abilityService);
    }
}