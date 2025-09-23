import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class WhiteTigerAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'WhiteTigerAbility',
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

        let targetsBehindResp = owner.parent.nearestPetsBehind(this.level, owner);
        for (let target of targetsBehindResp.pets) {
            this.logService.createLog({
                message: `${owner.name} gave ${target.name} +3 experience.`,
                type: "ability",
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: targetsBehindResp.random
            });
            target.increaseExp(3);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): WhiteTigerAbility {
        return new WhiteTigerAbility(newOwner, this.logService);
    }
}