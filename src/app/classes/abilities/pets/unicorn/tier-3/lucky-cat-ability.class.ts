import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class LuckyCatAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'LuckyCatAbility',
            owner: owner,
            triggers: ['ThisLeveledUp'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        let power = 2;

        if (owner.level == 3) {
            power = 4;
        }
        let targetResp = owner.parent.getThis(owner);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }
        this.logService.createLog({
            message: `${owner.name} gave ${target.name} ${power} attack and ${power} health.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger
        });

        target.increaseAttack(power);
        target.increaseHealth(power);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): LuckyCatAbility {
        return new LuckyCatAbility(newOwner, this.logService);
    }
}