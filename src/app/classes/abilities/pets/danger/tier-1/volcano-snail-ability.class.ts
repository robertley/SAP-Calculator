import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Toasty } from "../../../../equipment/ailments/toasty.class";

export class VolcanoSnailAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'VolcanoSnailAbility',
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

        let petsWithPerk = owner.parent.opponent.getPetsWithEquipment('perk');
        let petsWithToasty = owner.parent.opponent.getPetsWithEquipment('Toasty')
        let excludePets = [...petsWithPerk, ...petsWithToasty];
        let targetResp = owner.parent.opponent.getRandomPets(3, excludePets, null, null, owner);

        if (targetResp.pets.length === 0) {
            return;
        }

        for (let target of targetResp.pets) {
            let toasty = new Toasty();
            target.givePetEquipment(toasty);

            this.logService.createLog({
                message: `${owner.name} made ${target.name} Toasty`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: targetResp.random
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): VolcanoSnailAbility {
        return new VolcanoSnailAbility(newOwner, this.logService);
    }
}
