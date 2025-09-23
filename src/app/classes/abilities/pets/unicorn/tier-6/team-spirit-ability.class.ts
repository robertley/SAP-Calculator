import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Power } from "app/interfaces/power.interface";

export class TeamSpiritAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'TeamSpiritAbility',
            owner: owner,
            triggers: ['FriendLeveledUp'],
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

        let targetResp = owner.parent.getAll(false, owner, true);
        let targets = targetResp.pets;

        let power: Power = {
            attack: owner.level,
            health: owner.level
        };

        for (let target of targets) {
            this.logService.createLog({
                message: `${owner.name} gave ${target.name} ${power.attack} attack and ${power.health} health.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: targetResp.random
            });

            target.increaseAttack(power.attack);
            target.increaseHealth(power.health);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): TeamSpiritAbility {
        return new TeamSpiritAbility(newOwner, this.logService);
    }
}