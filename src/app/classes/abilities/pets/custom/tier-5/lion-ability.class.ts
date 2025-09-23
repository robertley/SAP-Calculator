import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class LionAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'LionAbility',
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

    private conditionFunction(): boolean {
        const owner = this.owner;
        let otherPets = owner.parent.petArray.filter(pet => pet !== owner);
        let highestTier = 0;
        for (let pet of otherPets) {
            if (pet.tier > highestTier) {
                highestTier = pet.tier;
            }
        }
        return owner.tier > highestTier;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        if (!this.conditionFunction()) {
            return;
        }

        let power = .5 * this.level;
        owner.increaseAttack(Math.floor(owner.attack * power));
        owner.increaseHealth(Math.floor(owner.health * power));
        this.logService.createLog({
            message: `${owner.name} increased its attack and health by ${power * 100}% (${owner.attack}/${owner.health})`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): LionAbility {
        return new LionAbility(newOwner, this.logService);
    }
}