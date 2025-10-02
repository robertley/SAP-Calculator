import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class PixiuAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'PixiuAbility',
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

        if (owner.mana < 4) {
            return;
        }

        let power = this.level * 3;
        this.logService.createLog({
            message: `${owner.name} spent 4 mana and gained ${power} gold for next turn.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger
        });

        owner.mana -= 4;

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): PixiuAbility {
        return new PixiuAbility(newOwner, this.logService);
    }
}