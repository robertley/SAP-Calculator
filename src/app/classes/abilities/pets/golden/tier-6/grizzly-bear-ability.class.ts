import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class GrizzlyBearAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'GrizzlyBearAbility',
            owner: owner,
            triggers: ['FriendAttacked5'],
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
        let targetResp = owner.parent.opponent.getRandomPets(2, [], true, false, owner);
        let targets = targetResp.pets;
        let power = this.level * 6;
        for (let target of targets) {
            owner.snipePet(target, power, targetResp.random, tiger);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): GrizzlyBearAbility {
        return new GrizzlyBearAbility(newOwner, this.logService);
    }
}