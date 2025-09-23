import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Rice } from "../../../../equipment/puppy/rice.class";

export class FrigatebirdAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'FrigatebirdAbility',
            owner: owner,
            triggers: ['FriendGainsAilment'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: owner.level,
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        let equipment = triggerPet.equipment;
        triggerPet.givePetEquipment(new Rice());
        this.logService.createLog({
            message: `${owner.name} removed ${equipment.name} from ${triggerPet.name} and gave ${triggerPet.name} Rice.`,
            type: 'ability',
            player: owner.parent
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }
    reset(): void {
        this.maxUses = this.owner.level;
    }
    copy(newOwner: Pet): FrigatebirdAbility {
        return new FrigatebirdAbility(newOwner, this.logService);
    }
}