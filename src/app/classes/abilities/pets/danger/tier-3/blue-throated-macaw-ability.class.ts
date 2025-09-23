import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class BlueThroatedMacawAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'BlueThroatedMacawAbility',
            owner: owner,
            triggers: ['FriendTransformed'],
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

        if (!triggerPet) {
            return;
        }

        //ahead
        if (triggerPet.position < owner.position) {
            let targetResp = owner.parent.getSpecificPet(owner, triggerPet);
            let target = targetResp.pet;

            if (!target) {
                return;
            }
            let power = this.level * 3;

            target.increaseAttack(power);

            this.logService.createLog({
                message: `${owner.name} gave ${target.name} +${power} attack.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: targetResp.random
            });
        } else {
            let targetResp = owner.parent.getSpecificPet(owner, triggerPet);
            let target = targetResp.pet;

            if (!target) {
                return;
            }
            let power = this.level * 3;

            target.increaseHealth(power);

            this.logService.createLog({
                message: `${owner.name} gave ${target.name} +${power} health.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: targetResp.random
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): BlueThroatedMacawAbility {
        return new BlueThroatedMacawAbility(newOwner, this.logService);
    }
}