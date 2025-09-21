import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";

export class WhaleSummonAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'WhaleSummonAbility',
            owner: owner,
            triggers: ['ThisDied'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            ignoreRepeats: true,
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
        this.abilityService = abilityService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        while ((owner as any).swallowedPets.length > 0) {
            let pet = (owner as any).swallowedPets.shift();

            let summonResult = owner.parent.summonPet(pet, owner.savedPosition, false, owner);

            if (summonResult.success) {
                this.logService.createLog({
                    message: `${owner.name} summoned ${pet.name} (level ${pet.level}).`,
                    type: 'ability',
                    player: owner.parent,
                    tiger: tiger,
                    pteranodon: pteranodon,
                    randomEvent: summonResult.randomEvent
                });
            }
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): WhaleSummonAbility {
        return new WhaleSummonAbility(newOwner, this.logService, this.abilityService);
    }
}