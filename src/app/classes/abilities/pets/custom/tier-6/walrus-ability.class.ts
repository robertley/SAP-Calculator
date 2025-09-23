import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { PeanutButter } from "../../../../equipment/hidden/peanut-butter";

export class WalrusAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'WalrusAbility',
            owner: owner,
            triggers: ['BeforeThisDies'],
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

        let targetsResp = owner.parent.getRandomPets(this.level, null, true, false, owner);
        for (let target of targetsResp.pets) {
            if (target != null) {
                target.givePetEquipment(new PeanutButter());
                this.logService.createLog({
                    message: `${owner.name} gave ${target.name} a Peanut Butter.`,
                    type: "ability",
                    player: owner.parent,
                    tiger: tiger,
                    pteranodon: pteranodon,
                    randomEvent: targetsResp.random
                });
            }
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): WalrusAbility {
        return new WalrusAbility(newOwner, this.logService);
    }
}