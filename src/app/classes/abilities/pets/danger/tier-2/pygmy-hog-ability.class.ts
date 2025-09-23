import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { AngryPygmyHog } from "../../../../pets/hidden/angry-pygmy-hog.class";
import { Garlic } from "../../../../equipment/turtle/garlic.class";

export class PygmyHogAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'PygmyHogAbility',
            owner: owner,
            triggers: ['EnemyAttacked5'],
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
        let transformedStats = this.level * 5; // 5/5, 10/10, 15/15
        let angryPygmyHog = new AngryPygmyHog(this.logService, this.abilityService, owner.parent, transformedStats, transformedStats, owner.mana, owner.exp, new Garlic());

        this.logService.createLog({
            message: `${owner.name} transformed into ${angryPygmyHog.name} (${transformedStats}/${transformedStats}) with Garlic!`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
        });

        owner.parent.transformPet(owner, angryPygmyHog);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): PygmyHogAbility {
        return new PygmyHogAbility(newOwner, this.logService, this.abilityService);
    }
}