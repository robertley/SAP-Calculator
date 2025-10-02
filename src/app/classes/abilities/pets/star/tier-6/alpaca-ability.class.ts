import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Alpaca } from "../../../../pets/star/tier-6/alpaca.class";

export class AlpacaAbility extends Ability {
    private logService: LogService;
    reset(): void {
        this.maxUses = this.level;
        super.reset();
    }
    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'AlpacaAbility',
            owner: owner,
            triggers: ['FriendSummoned'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: owner.level,
            condition: (context: AbilityContext) => {
                const { triggerPet, tiger, pteranodon } = context;
                const owner = this.owner;
                return triggerPet && !(triggerPet instanceof Alpaca);
            },
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        let targetResp = owner.parent.getSpecificPet(owner, triggerPet);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }
        target.increaseExp(3);
        this.logService.createLog({
            message: `${owner.name} gave ${target.name} 3 exp.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): AlpacaAbility {
        return new AlpacaAbility(newOwner, this.logService);
    }
}