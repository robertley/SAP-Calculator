import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Cold } from "../../../../equipment/ailments/cold.class";

export class FrostWolfAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'FrostWolfAbility',
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

        let excludePets = owner.parent.opponent.getPetsWithEquipment("Cold");
        let targetResp = owner.parent.opponent.getFurthestUpPet(owner, excludePets);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }

        const coldAilment = new Cold();
        coldAilment.multiplier += this.level - 1;

        let effectMessage = ".";
        if (this.level === 2) {
            effectMessage = " twice for double effect.";
        } else if (this.level === 3) {
            effectMessage = " thrice for triple effect.";
        }

        this.logService.createLog({
            message: `${owner.name} made ${target.name} Cold ${effectMessage}`,
            type: "ability",
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon,
            randomEvent: targetResp.random
        });

        target.givePetEquipment(coldAilment);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): FrostWolfAbility {
        return new FrostWolfAbility(newOwner, this.logService);
    }
}