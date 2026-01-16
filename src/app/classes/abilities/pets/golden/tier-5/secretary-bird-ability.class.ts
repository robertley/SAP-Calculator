import { Ability, AbilityContext } from "../../../../ability.class";
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
            triggers: ['FriendDied2'],
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
        this.triggerTigerExecution(context);
        this.logService.createLog({
            message: `${owner.name} triggered secretary bird ability at level ${this.level}.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon
        });
    }

    copy(newOwner: Pet): SecretaryBirdAbility {
        return new SecretaryBirdAbility(newOwner, this.logService);
    }
}
