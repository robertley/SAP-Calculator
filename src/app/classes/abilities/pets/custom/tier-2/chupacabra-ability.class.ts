import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class ChupacabraAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'ChupacabraAbility',
            owner: owner,
            triggers: ['ThisKilledEnemy'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {

        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        for (let i = 0; i < this.level * 3; i++) {
            let targetResp = owner.parent.getRandomPet([owner], true, false, true, owner);
            if (targetResp.pet == null) {
                return;
            }

            targetResp.pet.increaseHealth(1);

            this.logService.createLog({
                message: `${owner.name} gave ${targetResp.pet.name} 1 health.`,
                type: "ability",
                player: owner.parent,
                tiger: tiger,
                randomEvent: targetResp.random
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): ChupacabraAbility {
        return new ChupacabraAbility(newOwner, this.logService);
    }
}