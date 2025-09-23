import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class LynxAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'LynxAbility',
            owner: owner,
            triggers: ['StartBattle'],
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

        let opponent = (gameApi.player == owner.parent) ? gameApi.opponet : gameApi.player;

        let power = 0;
        for (let pet of owner.parent.petArray) {
            power += pet.level;
        }

        let targetsResp = opponent.getRandomPets(this.level, null, null, true, owner);
        for (let target of targetsResp.pets) {
            if (target != null) {
                owner.snipePet(target, power, targetsResp.random, tiger);
            }
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): LynxAbility {
        return new LynxAbility(newOwner, this.logService);
    }
}