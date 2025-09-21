import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class WoodpeckerAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'WoodpeckerAbility',
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

        let triggers = this.level * 2; // L1=2, L2=4, L3=6 triggers

        for (let i = 0; i < triggers; i++) {
            // Find the nearest two pets ahead
            let targetsResp = owner.parent.nearestPetsAhead(2, owner, null, true);
            let targets = targetsResp.pets;
            for (let target of targets) {
                owner.snipePet(target, 2, targetsResp.random, tiger);
            }
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): WoodpeckerAbility {
        return new WoodpeckerAbility(newOwner, this.logService);
    }
}