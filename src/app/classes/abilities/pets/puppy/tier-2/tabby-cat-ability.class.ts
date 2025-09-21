import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class TabbyCatAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'TabbyCatAbility',
            owner: owner,
            triggers: ['FriendlyGainsPerk'],
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

        let targetsResp = owner.parent.getRandomPets(2, [owner], true, false, owner);
        if (targetsResp.pets.length == 0) {
            return;
        }
        for (let target of targetsResp.pets) {
            if (target != null) {
                this.logService.createLog({
                    message: `${owner.name} increased ${target.name}'s health by ${this.level}.`,
                    type: 'ability',
                    player: owner.parent,
                    randomEvent: targetsResp.random,
                    tiger: tiger
                });
                target.increaseHealth(this.level);
            }
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): TabbyCatAbility {
        return new TabbyCatAbility(newOwner, this.logService);
    }
}