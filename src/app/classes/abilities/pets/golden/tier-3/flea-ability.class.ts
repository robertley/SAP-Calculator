import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Weak } from "app/classes/equipment/ailments/weak.class";

export class FleaAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'FleaAbility',
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

        let excludePets = owner.parent.opponent.getPetsWithEquipment('Weak');
        let targetsResp = owner.parent.opponent.getHighestHealthPets(this.level, excludePets, owner);

        for (let target of targetsResp.pets) {
            this.logService.createLog({
                message: `${owner.name} gave ${target.name} Weak.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: targetsResp.random
            });
            target.givePetEquipment(new Weak());
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): FleaAbility {
        return new FleaAbility(newOwner, this.logService);
    }
}