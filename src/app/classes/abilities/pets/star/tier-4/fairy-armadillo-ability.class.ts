import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability/ability.service";
import { FairyBall } from "../../../../pets/hidden/fairy-ball.class";

export class FairyArmadilloAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'FairyArmadilloAbility',
            owner: owner,
            triggers: ['ThisHurt'],
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
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        const healthGain = this.level * 2;
        const targetResp = owner.parent.getThis(owner);
        const target = targetResp.pet;
        if (target == null) {
            return;
        }
        target.increaseHealth(healthGain);
        this.logService.createLog({
            message: `${owner.name} gave ${target.name} ${healthGain} permanent health and transforms into a protected ball!`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });

        const transformTargetResp = owner.parent.getThis(owner);
        const transformTarget = transformTargetResp.pet;
        if (transformTarget == null) {
            return;
        }
        const fairyBall = new FairyBall(this.logService, this.abilityService, transformTarget.parent, transformTarget.health, transformTarget.attack, transformTarget.mana, transformTarget.exp, transformTarget.equipment);
        this.logService.createLog({
            message: `${owner.name} transformed ${transformTarget.name} into a protected ball!`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: transformTargetResp.random
        });
        transformTarget.parent.transformPet(transformTarget, fairyBall);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): FairyArmadilloAbility {
        return new FairyArmadilloAbility(newOwner, this.logService, this.abilityService);
    }
}