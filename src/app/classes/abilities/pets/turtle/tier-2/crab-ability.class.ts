import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class CrabAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'CrabAbility',
            owner: owner,
            triggers: ['StartBattle'],
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

        if (!owner.alive) {
            return;
        }

        let highestHealthResp = owner.parent.getHighestHealthPet(owner, owner);
        if (highestHealthResp.pet == null) {
            return;
        }

        let gainAmmt = Math.floor(highestHealthResp.pet.health * (.25 * this.level));
        let selfTargetResp = owner.parent.getThis(owner);
        if (selfTargetResp.pet) {
            selfTargetResp.pet.increaseHealth(gainAmmt);
            this.logService.createLog({
                message: `${owner.name} gave ${selfTargetResp.pet.name} ${.25 * this.level * 100}% of ${highestHealthResp.pet.name}'s health (${gainAmmt})`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: selfTargetResp.random
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): CrabAbility {
        return new CrabAbility(newOwner, this.logService);
    }
}