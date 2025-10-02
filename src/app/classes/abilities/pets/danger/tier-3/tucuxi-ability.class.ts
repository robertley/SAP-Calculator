import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class TucuxiAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'TucuxiAbility',
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

        // Get target for push effect
        let pushTargetResp = owner.parent.getLastPet([owner], owner);
        let pushTarget = pushTargetResp.pet;

        // Safety check for push target
        if (!pushTarget) {
            return;
        }

        // Push target to front (this will handle occupied front slot automatically)
        owner.parent.pushPetToFront(pushTarget, false);

        this.logService.createLog({
            message: `${owner.name} pushed ${pushTarget.name} to the front`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon,
            randomEvent: pushTargetResp.random
        });

        // Get target for buff effect (could be different if Silly)
        let buffTargetResp = owner.parent.getLastPet([owner], owner);
        let buffTarget = buffTargetResp.pet;

        // Safety check for buff target
        if (!buffTarget) {
            return;
        }

        // Give level-based buffs (3/6/9 attack and health)
        let power = this.level * 3;
        buffTarget.increaseAttack(power);
        buffTarget.increaseHealth(power);

        this.logService.createLog({
            message: `${owner.name} gave ${buffTarget.name} +${power} attack and +${power} health`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon,
            randomEvent: buffTargetResp.random
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): TucuxiAbility {
        return new TucuxiAbility(newOwner, this.logService);
    }
}