import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class SeaTurtleAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'SeaTurtleAbility',
            owner: owner,
            triggers: ['FriendSummoned'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        let power = this.level * 2;
        let targetResp = owner.parent.getSpecificPet(owner, triggerPet);
        let target = targetResp.pet;
        if (!target) {
            return;
        }

        target.increaseHealth(power);
        this.logService.createLog({
            message: `${owner.name} gave ${target.name} ${power} health.`,
            type: "ability",
            player: owner.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): SeaTurtleAbility {
        return new SeaTurtleAbility(newOwner, this.logService);
    }
}