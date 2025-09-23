import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class SecretaryBirdAbility extends Ability {
    private logService: LogService;
    private abilityUses: number = 0;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'SecretaryBirdAbility',
            owner: owner,
            triggers: ['TwoFriendsDied'],
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

        let targetsAheadResp = owner.parent.nearestPetsAhead(1, owner);
        if (targetsAheadResp.pets.length === 0) {
            return;
        }
        let target = targetsAheadResp.pets[0];
        let powerAttack = this.level * 3;
        let powerHealth = this.level * 4;
        target.increaseAttack(powerAttack);
        target.increaseHealth(powerHealth);
        this.logService.createLog({
            message: `${owner.name} gave ${target.name} ${powerAttack} attack and ${powerHealth} health.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon,
            randomEvent: targetsAheadResp.random
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): SecretaryBirdAbility {
        return new SecretaryBirdAbility(newOwner, this.logService);
    }
}