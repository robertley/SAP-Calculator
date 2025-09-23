import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { ZombieFly } from "../../../../pets/hidden/zombie-fly.class";

export class FlyAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'FlyAbility',
            owner: owner,
            triggers: ['FriendDied'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: 3,
            condition: (owner: Pet, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                if ((triggerPet && triggerPet instanceof ZombieFly) || owner.parent.petArray.length >= 5) {
                    return false;
                }
                return true;
            },
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
        this.abilityService = abilityService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        let zombie = new ZombieFly(this.logService, this.abilityService, owner.parent, null, null, null, this.minExpForLevel);

        let summonResult = owner.parent.summonPet(zombie, triggerPet.savedPosition, true, owner);

        if (summonResult.success) {
            this.logService.createLog({
                message: `${owner.name} spawned Zombie Fly Level ${this.level}`,
                type: "ability",
                player: owner.parent,
                tiger: tiger,
                randomEvent: summonResult.randomEvent
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): FlyAbility {
        return new FlyAbility(newOwner, this.logService, this.abilityService);
    }
}