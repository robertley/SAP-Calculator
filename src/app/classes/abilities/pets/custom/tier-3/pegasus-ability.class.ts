import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class PegasusAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'PegasusAbility',
            owner: owner,
            triggers: ['FriendSummoned'],
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
        let targetsResp = owner.parent.getRandomPets(3, [owner], true, false, owner);
        for (let target of targetsResp.pets) {
            if (target) {
                target.increaseAttack(owner.level);
                this.logService.createLog({
                    message: `${owner.name} gave ${target.name} ${owner.level} attack.`,
                    type: 'ability',
                    player: owner.parent,
                    randomEvent: targetsResp.random,
                    tiger: tiger
                });
            }
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): PegasusAbility {
        return new PegasusAbility(newOwner, this.logService);
    }
}