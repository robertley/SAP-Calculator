import { Ability, AbilityContext, AbilityType } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class AnubisAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'AnubisAbility',
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

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, tiger, pteranodon } = context;
        const owner = this.owner;
        const thresholds = [2, 4, 6];
        const tierLimit = thresholds[Math.min(Math.max(this.level, 1) - 1, thresholds.length - 1)];

        for (const friend of owner.parent.petArray) {
            if (!friend || friend === owner || !friend.alive) {
                continue;
            }
            if (!friend.isFaintPet()) {
                continue;
            }
            if (friend.tier > tierLimit) {
                continue;
            }

            this.logService.createLog({
                message: `${owner.name} activated ${friend.name}'s faint ability (tier ${friend.tier} ≤ ${tierLimit}).`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon
            });

            friend.activateAbilities('ThisDied', gameApi, 'Pet' as AbilityType);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): AnubisAbility {
        return new AnubisAbility(newOwner, this.logService);
    }
}
