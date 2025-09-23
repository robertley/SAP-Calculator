import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Skewer } from "../../../../equipment/puppy/skewer.class";

export class SnappingTurtleAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'SnappingTurtleAbility',
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

        let excludePets = owner.parent.getPetsWithEquipment("Skewer");
        let targetsBehindResp = owner.parent.nearestPetsBehind(owner.level, owner, excludePets);
        if (targetsBehindResp.pets.length === 0) {
            return;
        }

        for (let pet of targetsBehindResp.pets) {
            this.logService.createLog({
                message: `${owner.name} gave ${pet.name} Skewer.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: targetsBehindResp.random
            });
            pet.givePetEquipment(new Skewer(this.logService));
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): SnappingTurtleAbility {
        return new SnappingTurtleAbility(newOwner, this.logService);
    }
}