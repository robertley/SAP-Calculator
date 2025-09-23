import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class JerseyDevilAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'JerseyDevilAbility',
            owner: owner,
            triggers: ['FriendSummoned'],
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

        if (!triggerPet) {
            return;
        }

        let isPlayer = owner.parent === gameApi.player;
        let mult = isPlayer ? gameApi.playerLevel3Sold : gameApi.opponentLevel3Sold;
        mult = Math.min(mult, 5);
        let power = this.level * mult;

        let targetResp = owner.parent.getThis(triggerPet);
        let target = targetResp.pet;
        if (!target) {
            return;
        }

        this.logService.createLog({
            message: `${owner.name} gave ${target.name} ${power} attack and ${power} health`,
            type: "ability",
            player: owner.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });

        target.increaseAttack(power);
        target.increaseHealth(power);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): JerseyDevilAbility {
        return new JerseyDevilAbility(newOwner, this.logService);
    }
}