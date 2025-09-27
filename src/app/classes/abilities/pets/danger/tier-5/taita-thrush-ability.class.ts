import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class TaitaThrushAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'TaitaThrushAbility',
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

        if (owner.abilityUses >= owner.maxAbilityUses) {
            return;
        }

        let power = this.level; // 1/2/3 based on level

        let friendsResp = owner.parent.getAll(false, owner, true); // excludeSelf = true

        for (let friend of friendsResp.pets) {
            friend.increaseAttack(power);
            friend.increaseHealth(power);

            this.logService.createLog({
                message: `${owner.name} gave ${friend.name} +${power} attack and +${power} health`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: friendsResp.random
            });
        }

        owner.abilityUses++;

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): TaitaThrushAbility {
        return new TaitaThrushAbility(newOwner, this.logService);
    }
}