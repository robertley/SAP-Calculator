import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class DoorHeadAntAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'DoorHeadAntAbility',
            owner: owner,
            triggers: ['ClearFront'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            condition: (context: AbilityContext) => {
                const owner = this.owner;
                // Check if first pet is null (front space is empty)
                return owner.parent.pet0 == null;
            },
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const { gameApi, triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;
        let pushTargetResp = owner.parent.getThis(owner);
        let pushTarget = pushTargetResp.pet
        if (pushTarget == null) {
            return;
        }
        // Push self to front
        owner.parent.pushPetToFront(pushTarget, true);
        this.logService.createLog({
            message: `${owner.name} pushed ${pushTarget.name} to the front.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon,
            randomEvent: pushTargetResp.random
        });

        // Gain health based on level
        let power = this.level * 4;
        let targetResp = owner.parent.getThis(owner);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }
        target.increaseHealth(power);
        this.logService.createLog({
            message: `${owner.name} gained ${power} health.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon,
            randomEvent: targetResp.random
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): DoorHeadAntAbility {
        return new DoorHeadAntAbility(newOwner, this.logService);
    }
}