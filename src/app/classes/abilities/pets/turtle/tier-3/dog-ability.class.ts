import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class DogAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'DogAbility',
            owner: owner,
            triggers: ['FriendSummoned'],
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
        let boostAtkAmt = this.level * 2;
        let boostHealthAmt = this.level;
        let selfTargetResp = owner.parent.getThis(owner);
        if (selfTargetResp.pet) {
            selfTargetResp.pet.increaseAttack(boostAtkAmt);
            selfTargetResp.pet.increaseHealth(boostHealthAmt);
            this.logService.createLog({
                message: `${owner.name} gave ${selfTargetResp.pet.name} ${boostAtkAmt} attack and ${boostHealthAmt} health.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: selfTargetResp.random
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): DogAbility {
        return new DogAbility(newOwner, this.logService);
    }
}