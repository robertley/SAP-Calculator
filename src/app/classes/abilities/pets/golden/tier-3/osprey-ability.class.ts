import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { Groundhog } from "../../../../pets/golden/tier-1/groundhog.class";

export class OspreyAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'OspreyAbility',
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
        const { gameApi, triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;

        for (let i = 0; i < owner.level; i++) {
            let groundhog = new Groundhog(this.logService, this.abilityService, owner.parent, null, null, 0, 0);

            let summonResult = owner.parent.summonPet(groundhog, owner.savedPosition, false, owner)
            if (summonResult.success) {
                this.logService.createLog(
                    {
                        message: `${owner.name} summoned a 2/1 Groundhog`,
                        type: "ability",
                        player: owner.parent,
                        tiger: tiger,
                        pteranodon: pteranodon,
                        randomEvent: summonResult.randomEvent
                    }
                )
            }
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): OspreyAbility {
        return new OspreyAbility(newOwner, this.logService, this.abilityService);
    }
}