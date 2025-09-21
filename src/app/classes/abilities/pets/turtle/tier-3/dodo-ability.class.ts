import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class DodoAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'DodoAbility',
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

        let targetsAheadResp = owner.parent.nearestPetsAhead(1, owner);
        if (targetsAheadResp.pets.length === 0) {
            return;
        }

        let boostPet = targetsAheadResp.pets[0];
        let boostAmt = Math.floor(owner.attack * (this.level * .5));
        boostPet.increaseAttack(boostAmt);
        this.logService.createLog({
            message: `${owner.name} gave ${boostPet.name} ${boostAmt} attack.`,
            player: owner.parent,
            type: 'ability',
            tiger: tiger,
            randomEvent: targetsAheadResp.random
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): DodoAbility {
        return new DodoAbility(newOwner, this.logService);
    }
}