import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { WhiteOkra } from "../../../../equipment/danger/white-okra.class";

export class PaintedTerrapinAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'PaintedTerrapinAbility',
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

        let excludePets = owner.parent.getPetsWithEquipment("White Okra");
        let targetsResp = owner.parent.nearestPetsBehind(owner.level, owner, excludePets);
        let targets = targetsResp.pets;

        for (let targetPet of targets) {
            this.logService.createLog({
                message: `${owner.name} gave ${targetPet.name} White Okra perk`,
                type: 'ability',
                tiger: tiger,
                player: owner.parent,
                pteranodon: pteranodon,
                randomEvent: targetsResp.random
            });
            targetPet.givePetEquipment(new WhiteOkra());
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): PaintedTerrapinAbility {
        return new PaintedTerrapinAbility(newOwner, this.logService);
    }
}