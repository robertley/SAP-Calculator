import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class SwordFishAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'SwordFishAbility',
            owner: owner,
            triggers: ['StartBattle'],
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

        let opponent = owner.parent.opponent;
        let highestHealthPetResp = opponent.getHighestHealthPet(undefined, owner);
        let target = highestHealthPetResp.pet;
        let power = owner.attack * this.level;
        if (target != null) {
            owner.snipePet(target, power, highestHealthPetResp.random, tiger);
        }
        owner.snipePet(owner, power, false, tiger);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): SwordFishAbility {
        return new SwordFishAbility(newOwner, this.logService);
    }
}