import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class AnubisAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'AnubisAbility',
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

        let faintPets = owner.parent.petArray.filter(pet => pet.faintPet);
        for (let pet of faintPets) {
            if (!pet.alive) {
                continue;
            }
            if (pet.tier <= this.level * 2) {
                this.logService.createLog({
                    message: `${owner.name} activated ${pet.name}'s faint ability.`,
                    type: 'ability',
                    player: owner.parent,
                    tiger: tiger,
                    pteranodon: pteranodon
                });
                pet.activateAbilities(undefined, gameApi, 'Pet');
            }
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): AnubisAbility {
        return new AnubisAbility(newOwner, this.logService);
    }
}