import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Melon } from "../../../../equipment/turtle/melon.class";

export class TurtleAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'TurtleAbility',
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
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        let excludePets = owner.parent.getPetsWithEquipment("Melon");
        let targetsBehindResp = owner.parent.nearestPetsBehind(this.level, owner, excludePets);
        if (targetsBehindResp.pets.length == 0) {
            return;
        }

        for (let targetPet of targetsBehindResp.pets) {
            this.logService.createLog({
                message: `${owner.name} gave ${targetPet.name} Melon.`,
                type: 'ability',
                tiger: tiger,
                player: owner.parent,
                pteranodon: pteranodon,
                randomEvent: targetsBehindResp.random
            });
            targetPet.givePetEquipment(new Melon());
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): TurtleAbility {
        return new TurtleAbility(newOwner, this.logService);
    }
}