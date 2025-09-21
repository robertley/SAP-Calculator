import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { YoungPhoenix } from "../../../../pets/hidden/young-phoenix.class";

export class PhoenixAfterfaintAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'PhoenixAfterfaintAbility',
            owner: owner,
            triggers: ['ThisDied'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
        this.abilityService = abilityService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        let power = 4 * this.level;
        let youngPhoenix = new YoungPhoenix(this.logService, this.abilityService, owner.parent, power, power, 0);

        let summonResult = owner.parent.summonPet(youngPhoenix, owner.savedPosition, false, owner);
        if (summonResult.success) {
            this.logService.createLog({
                message: `${owner.name} spawned a Young Phoenix (${power}/${power}).`,
                type: "ability",
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: summonResult.randomEvent
            });

            this.abilityService.triggerFriendSummonedEvents(youngPhoenix);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): PhoenixAfterfaintAbility {
        return new PhoenixAfterfaintAbility(newOwner, this.logService, this.abilityService);
    }
}