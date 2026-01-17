import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability/ability.service";
import { Chick } from "../../../../pets/hidden/chick.class";

export class RoosterAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'RoosterAbility',
            owner: owner,
            triggers: ['ThisDied'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
        this.abilityService = abilityService;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        let attack = Math.max(Math.floor(owner.attack * .5), 1);
        for (let i = 0; i < this.level; i++) {
            let chick = new Chick(this.logService, this.abilityService, owner.parent, 1, attack, 0, this.minExpForLevel);

            let summonResult = owner.parent.summonPet(chick, owner.savedPosition, false, owner);

            if (summonResult.success) {
                this.logService.createLog({
                    message: `${owner.name} spawned Chick (${attack}).`,
                    type: 'ability',
                    player: owner.parent,
                    tiger: tiger,
                    pteranodon: pteranodon,
                    randomEvent: summonResult.randomEvent
                });
            }
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): RoosterAbility {
        return new RoosterAbility(newOwner, this.logService, this.abilityService);
    }
}