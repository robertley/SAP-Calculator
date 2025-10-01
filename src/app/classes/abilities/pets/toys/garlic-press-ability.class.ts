import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { Garlic } from "../../../equipment/turtle/garlic.class";

export class GarlicPressAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'GarlicPressAbility',
            owner: owner,
            triggers: [],
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
        const { gameApi, triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;

        // Mirror Garlic Press toy behavior
        for (let i = 0; i < this.level; i++) {
            for (let pet of owner.parent.petArray) {
                if (pet?.equipment instanceof Garlic) {
                    continue;
                }
                this.logService.createLog({
                    message: `Garlic Press Ability gave ${pet.name} Garlic.`,
                    type: 'ability',
                    player: owner.parent,
                    tiger: tiger,
                    pteranodon: pteranodon
                })
                pet.givePetEquipment(new Garlic());
                break;
            }
        }

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): GarlicPressAbility {
        return new GarlicPressAbility(newOwner, this.logService, this.abilityService);
    }
}