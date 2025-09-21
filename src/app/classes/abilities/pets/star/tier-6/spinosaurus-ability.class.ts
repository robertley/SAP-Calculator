import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Power } from "app/interfaces/power.interface";

export class SpinosaurusAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'SpinosaurusAbility',
            owner: owner,
            triggers: ['FriendDied'],
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

        let power: Power = {
            attack: this.level * 2,
            health: this.level * 3
        };
        let targetResp = owner.parent.getRandomPet([owner], true, false, true, owner);
        if (targetResp.pet == null) {
            return;
        }
        targetResp.pet.increaseAttack(power.attack);
        targetResp.pet.increaseHealth(power.health);
        this.logService.createLog({
            message: `${owner.name} gave ${targetResp.pet.name} ${power.attack} attack and ${power.health} health.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): SpinosaurusAbility {
        return new SpinosaurusAbility(newOwner, this.logService);
    }
}