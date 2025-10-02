import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { LogService } from "app/services/log.service";

export class BalloonAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'BalloonAbility',
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
        const { gameApi, triggerPet, tiger} = context;
        const owner = this.owner;

        // Mirror Balloon toy behavior
        let targetResp = owner.parent.getFurthestUpPet(owner);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }
        let power = this.level;
        target.increaseAttack(power);
        target.increaseHealth(power);
        this.logService.createLog({
            message: `${owner.name} gave ${target.name} ${power} attack and ${power} health.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        })

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): BalloonAbility {
        return new BalloonAbility(newOwner, this.logService);
    }
}