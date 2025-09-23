import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class CaliforniaCondorAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'CaliforniaCondorAbility',
            owner: owner,
            triggers: ['FriendTransformed'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: 2,
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;
        let copyPet = triggerPet;

        if (!copyPet) {
            return;
        }

        this.logService.createLog({
            message: `California Condor copied ${copyPet.name}'s level ${owner.level} ability`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger
        });
        owner.gainAbilities(copyPet, 'Pet');
        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): CaliforniaCondorAbility {
        return new CaliforniaCondorAbility(newOwner, this.logService);
    }
}