import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class AmazonRiverDolphinAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'AmazonRiverDolphinAbility',
            owner: owner,
            triggers: ['AdjacentFriendAttacked'],
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

        // Choice: Deal damage to its target OR gain attack
        let targetResp = owner.parent.getSpecificPet(owner, triggerPet.currentTarget);
        let target = targetResp.pet;
        if (target && target.alive) {
            let damage = 3 * this.level;
            owner.snipePet(target, damage, targetResp.random, tiger);
        } else {
            let targetResp = owner.parent.getThis(owner);
            let selfTarget = targetResp.pet;

            if (!selfTarget) {
                return;
            }

            let attackBonus = 3 * this.level;
            selfTarget.increaseAttack(attackBonus);
            this.logService.createLog({
                message: `${owner.name} gave ${selfTarget.name} ${attackBonus} attack`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: targetResp.random
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): AmazonRiverDolphinAbility {
        return new AmazonRiverDolphinAbility(newOwner, this.logService);
    }
}