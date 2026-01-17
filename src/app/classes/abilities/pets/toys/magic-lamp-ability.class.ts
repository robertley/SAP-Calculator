import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability/ability.service";

export class MagicLampAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'MagicLampAbility',
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

        // Mirror Magic Lamp toy behavior (friendlyLevelUp method)
        // Note: This would need to be triggered when a pet levels up
        // For now, we'll implement the effect as a general ability
        let pet = triggerPet || owner;
        this.logService.createLog({
            message: `Magic Lamp Ability gave ${pet.name} ${this.level} attack and ${this.level} health.`,
            type: "ability",
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon
        });
        pet.increaseAttack(+this.level);
        pet.increaseHealth(+this.level);

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): MagicLampAbility {
        return new MagicLampAbility(newOwner, this.logService, this.abilityService);
    }
}