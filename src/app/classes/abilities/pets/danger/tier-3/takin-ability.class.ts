import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class TakinAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'TakinAbility',
            owner: owner,
            triggers: ['FriendAheadHurt'],
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

        let attackGain = this.level;
        let healthGain = this.level * 2;
        let targetResp = owner.parent.getThis(owner);
        let target = targetResp.pet;

        target.increaseAttack(attackGain);
        target.increaseHealth(healthGain);

        this.logService.createLog({
            message: `${owner.name} gave ${target.name} ${attackGain} attack and ${healthGain} health.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): TakinAbility {
        return new TakinAbility(newOwner, this.logService);
    }
}