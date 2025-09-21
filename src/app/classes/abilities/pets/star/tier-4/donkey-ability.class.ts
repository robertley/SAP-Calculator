import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class DonkeyAbility extends Ability {
    private logService: LogService;
    reset(): void {
        this.maxUses = this.owner.level;
        super.reset();
    }
    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'DonkeyAbility',
            owner: owner,
            triggers: ['FriendDied'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: owner.level,
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        let opponent = owner.parent.opponent;
        let targetResp = opponent.getLastPet();
        if (targetResp.pet == null) {
            return;
        }
        owner.parent.pushPet(targetResp.pet, targetResp.pet.position);
        this.logService.createLog({
            message: `${owner.name} pushed ${targetResp.pet.name} to the front.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): DonkeyAbility {
        return new DonkeyAbility(newOwner, this.logService);
    }
}