import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Corncob } from "../../../../equipment/custom/corncob.class";

export class FarmerChickenAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'FarmerChickenAbility',
            owner: owner,
            triggers: ['EndTurn'],
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
        
        const { tiger, pteranodon } = context;
        const owner = this.owner;

        let targetsResp = owner.parent.nearestPetsAhead(this.level, owner);
        if (targetsResp.pets.length === 0) {
            return;
        }

        for (let target of targetsResp.pets) {
            target.givePetEquipment(new Corncob());
            this.logService.createLog({
                message: `${owner.name} fed ${target.name} a Corncob.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: targetsResp.random
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): FarmerChickenAbility {
        return new FarmerChickenAbility(newOwner, this.logService);
    }
}
