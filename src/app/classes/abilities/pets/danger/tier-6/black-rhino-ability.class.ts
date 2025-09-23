import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class BlackRhinoAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'BlackRhinoAbility',
            owner: owner,
            triggers: ['EnemyAttacked8'],
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

        let damage = 30; // Fixed 30 damage

        // Get all alive enemies and shuffle for random selection
        let targetsResp = owner.parent.opponent.getRandomPets(owner.level, [], false, true, owner);
        let targets = targetsResp.pets;
        for (let target of targets) {
            owner.snipePet(target, damage, targetsResp.random, tiger);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): BlackRhinoAbility {
        return new BlackRhinoAbility(newOwner, this.logService);
    }
}