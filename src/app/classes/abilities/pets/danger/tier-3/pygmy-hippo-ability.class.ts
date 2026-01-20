import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability/ability.service";

export class PygmyHippoAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'PygmyHippoAbility',
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

        let damage = Math.floor(owner.health * 0.33); // 33% of current health
        let targetsResp = owner.parent.opponent.getLowestHealthPets(this.level, undefined, owner);

        for (let target of targetsResp.pets) {
            owner.snipePet(target, damage, targetsResp.random, tiger);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): PygmyHippoAbility {
        return new PygmyHippoAbility(newOwner, this.logService, this.abilityService);
    }
}