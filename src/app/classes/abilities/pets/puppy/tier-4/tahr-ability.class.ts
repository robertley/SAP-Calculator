import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { MildChili } from "../../../../equipment/star/mild-chili.class";

export class TahrAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'TahrAbility',
            owner: owner,
            triggers: ['BeforeThisDies'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
        this.abilityService = abilityService;
    }

    private executeAbility(context: AbilityContext): void {

        const { gameApi, triggerPet, tiger, pteranodon } = context; const owner = this.owner;

        let excludePets = owner.parent.getPetsWithEquipment("Mild Chili");
        let targetsBehindResp = owner.parent.nearestPetsBehind(this.level, owner, excludePets);
        if (targetsBehindResp.pets.length === 0) {
            return;
        }
        for (let pet of targetsBehindResp.pets) {
            this.logService.createLog({
                message: `${owner.name} gave ${pet.name} Mild Chili.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: targetsBehindResp.random
            });
            pet.givePetEquipment(new MildChili(this.logService, this.abilityService));
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): TahrAbility {
        return new TahrAbility(newOwner, this.logService, this.abilityService);
    }
}