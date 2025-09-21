import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class AntAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'AntAbility',
            owner: owner,
            triggers: ['BeforeThisDies'],
            abilityType: 'Pet',
            native: true, // Pet abilities are native
            abilitylevel: owner.level,
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        // Use ability level - Tiger system will override this.level during second execution
        const power = this.level;

        const boostResp = owner.parent.getRandomPet([owner], true, false, true, owner);
        if (boostResp.pet == null) {
            return;
        }

        this.logService.createLog({
            message: `${owner.name} gave ${boostResp.pet.name} ${power} attack and ${power} health.`,
            type: "ability",
            randomEvent: boostResp.random,
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon
        });

        boostResp.pet.increaseAttack(power);
        boostResp.pet.increaseHealth(power);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): AntAbility {
        return new AntAbility(newOwner, this.logService);
    }
}