import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { Equipment } from "../../../../equipment.class";

export class WhaleSharkAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'WhaleSharkAbility',
            owner: owner,
            triggers: ['ThisGainedPerk', 'ThisGainedAilment'],
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

        if (owner.equipment) {
            // Remove the equipment that was just gained
            this.logService.createLog({
                message: `${owner.name} removed ${owner.equipment.name}`,
                type: 'ability',
                player: owner.parent
            });
            owner.removePerk();
        }

        let targetResp = owner.parent.getThis(owner);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }

        let power = this.level * 3;
        target.increaseAttack(power);
        target.increaseHealth(power);
        this.logService.createLog({
            message: `${owner.name} gave ${target.name} ${power} attack and ${power} health.`,
            type: 'ability',
            player: owner.parent,
            randomEvent: targetResp.random
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): WhaleSharkAbility {
        return new WhaleSharkAbility(newOwner, this.logService, this.abilityService);
    }
}