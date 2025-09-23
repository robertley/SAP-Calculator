import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class OctopusAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'OctopusAbility',
            owner: owner,
            triggers: ['ThisAttacked'],
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

        let opponent = owner.parent.opponent;
        let targetsResp = opponent.getRandomPets(this.level, null, null, true, owner);
        let targets = targetsResp.pets;
        let power = 6;
        for (let target of targets) {
            if (target == null) {
                return;
            }
            owner.snipePet(target, power, targetsResp.random, tiger);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): OctopusAbility {
        return new OctopusAbility(newOwner, this.logService);
    }
}