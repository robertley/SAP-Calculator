import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class RoyalFlycatcherAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'RoyalFlycatcherAbility',
            owner: owner,
            triggers: ['EnemyFaint3'],
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
        let power = this.level * 3;
        let targetResp = owner.parent.opponent.getRandomPet([], null, true, null, owner);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }
        owner.snipePet(target, power, targetResp.random, tiger);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): RoyalFlycatcherAbility {
        return new RoyalFlycatcherAbility(newOwner, this.logService);
    }
}