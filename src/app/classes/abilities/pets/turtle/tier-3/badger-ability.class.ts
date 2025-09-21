import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Player } from "../../../../player.class";

export class BadgerAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'BadgerAbility',
            owner: owner,
            triggers: ['BeforeThisDies'],
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

        let attackAmt = Math.floor(owner.attack * (this.level * .5));

        // Target behind (friendly only)
        let targetsBehindResp = owner.parent.nearestPetsBehind(1, owner);
        if (targetsBehindResp.pets.length > 0) {
            let target = targetsBehindResp.pets[0];
            owner.snipePet(target, attackAmt, targetsBehindResp.random, tiger, pteranodon);
        }

        // Target ahead (including opponents if no friendlies available)
        let targetsAheadResp = owner.parent.nearestPetsAhead(1, owner, undefined, true);
        if (targetsAheadResp.pets.length > 0) {
            let target = targetsAheadResp.pets[0];
            owner.snipePet(target, attackAmt, targetsAheadResp.random, tiger, pteranodon);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): BadgerAbility {
        return new BadgerAbility(newOwner, this.logService);
    }
}