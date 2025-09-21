import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class KiwiAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'KiwiAbility',
            owner: owner,
            triggers: ['ThisHurt', 'ThisSold'],
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

        let excludePets = owner.parent.petArray
            .filter(pet => pet.equipment?.name != 'Strawberry' || pet == owner);

        // Get the backmost (last position) Strawberry pet
        let targetResp = owner.parent.getLastPet(excludePets, owner);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }
        let attackBoost = this.level;
        target.increaseAttack(attackBoost);

        this.logService.createLog({
            message: `${owner.name} gave ${target.name} +${attackBoost} attack`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): KiwiAbility {
        return new KiwiAbility(newOwner, this.logService);
    }
}