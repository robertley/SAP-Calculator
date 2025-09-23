import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class StegosaurusAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'StegosaurusAbility',
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

        let equipmentPets = owner.parent.petArray.filter(pet => pet.equipment != null);
        let targetResp = owner.parent.getRandomPet([...equipmentPets, owner], true, false, true, owner);
        if (targetResp.pet == null) {
            return;
        }
        let power = this.level * gameApi.turnNumber;
        targetResp.pet.increaseAttack(power);
        targetResp.pet.increaseHealth(power);
        this.logService.createLog({
            message: `${owner.name} gave ${targetResp.pet.name} ${power} attack and ${power} health.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon,
            randomEvent: targetResp.random
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): StegosaurusAbility {
        return new StegosaurusAbility(newOwner, this.logService);
    }
}