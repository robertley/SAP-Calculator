import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class RocAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'RocAbility',
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

        let petsAhead = owner.getPetsAhead(5);
        if (petsAhead.length == 0) {
            return;
        }

        let excludePets = owner.parent.petArray.filter(pet => pet == owner || !petsAhead.includes(pet));
        //TO DO: Make it spread evenly
        for (let i = 0; i < this.level * 3; i++) {
            let targetResp = owner.parent.getRandomPet(excludePets, true, false, false, owner);
            if (targetResp.pet == null) {
                break;
            }
            this.logService.createLog({
                message: `${owner.name} gave ${targetResp.pet.name} 2 mana.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: targetResp.random
            });

            targetResp.pet.increaseMana(2);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): RocAbility {
        return new RocAbility(newOwner, this.logService);
    }
}