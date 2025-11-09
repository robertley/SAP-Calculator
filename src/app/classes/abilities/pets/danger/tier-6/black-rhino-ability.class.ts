import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class BlackRhinoAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'BlackRhinoAbility',
            owner: owner,
            triggers: ['EnemyAttacked7'],
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

        let damage = 30; // Fixed 30 damage

        // Get all alive enemies and shuffle for random selection
        let targetsResp = owner.parent.opponent.getHighestHealthPets(owner.level, [], owner);
        let targets = targetsResp.pets;
        for (let target of targets) {
            owner.snipePet(target, damage, targetsResp.random, tiger);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): BlackRhinoAbility {
        return new BlackRhinoAbility(newOwner, this.logService);
    }
}