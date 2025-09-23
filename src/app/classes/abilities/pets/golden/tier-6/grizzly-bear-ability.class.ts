import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class GrizzlyBearAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'GrizzlyBearAbility',
            owner: owner,
            triggers: ['FriendAttacked5'],
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
        let targetResp = owner.parent.opponent.getRandomPets(2, [], true, false, owner);
        let targets = targetResp.pets;
        let power = this.level * 6;
        for (let target of targets) {
            owner.snipePet(target, power, targetResp.random, tiger);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): GrizzlyBearAbility {
        return new GrizzlyBearAbility(newOwner, this.logService);
    }
}