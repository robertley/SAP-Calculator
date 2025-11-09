import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { SmallerSlug } from "../../../../pets/hidden/smaller-slug.class";

export class SlugAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'SlugAbility',
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

        let slug = new SmallerSlug(this.logService, this.abilityService, owner.parent, null, null, 0, owner.minExpForLevel);

        let summonResult = owner.parent.summonPet(slug, owner.savedPosition, false, owner)
        if (summonResult.success) {
            this.logService.createLog(
                {
                    message: `${owner.name} spawned Smaller Slug Level ${owner.level}`,
                    type: "ability",
                    player: owner.parent,
                    tiger: tiger,
                    pteranodon: pteranodon,
                    randomEvent: summonResult.randomEvent
                }
            )
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): SlugAbility {
        return new SlugAbility(newOwner, this.logService, this.abilityService);
    }
}