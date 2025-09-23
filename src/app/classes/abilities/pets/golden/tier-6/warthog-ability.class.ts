import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class WarthogAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'WarthogAbility',
            owner: owner,
            triggers: ['BeforeThisDies'],
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

        let power = this.level;
        let triggers = Math.floor(owner.attack / 3);

        for (let i = 0; i < triggers; i++) {
            let targetResp = owner.parent.getRandomPet([], true, false, true, owner);
            if (targetResp.pet == null) {
                break;
            }
            targetResp.pet.increaseAttack(power);
            targetResp.pet.increaseHealth(power);
            this.logService.createLog({
                message: `${owner.name} gave ${targetResp.pet.name} ${power} attack and ${power} health.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: targetResp.random
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): WarthogAbility {
        return new WarthogAbility(newOwner, this.logService);
    }
}