import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class ParrotAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'ParrotAbility',
            owner: owner,
            triggers: ['EndTurn', 'SpecialEndTurn'],
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
        let owner = this.owner;
        let copyPet = owner.petAhead;
        if (copyPet == null) {
            return;
        }
        owner.copyAbilities(copyPet, 'Pet');
        this.logService.createLog({
            message: `${owner.name} copied ${copyPet.name}`,
            type: 'ability',
            player: owner.parent
        })
    }

    copy(newOwner: Pet): ParrotAbility {
        return new ParrotAbility(newOwner, this.logService);
    }
}