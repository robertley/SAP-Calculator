import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class GreatOneAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'GreatOneAbility',
            owner: owner,
            triggers: ['ThisSummoned'],
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
        let targets = [...owner.parent.petArray, ...owner.parent.opponent.petArray];
        targets = targets.filter(pet => pet !== owner);
        for (let target of targets) {
            owner.snipePet(target, owner.level * 6);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): GreatOneAbility {
        return new GreatOneAbility(newOwner, this.logService);
    }
}