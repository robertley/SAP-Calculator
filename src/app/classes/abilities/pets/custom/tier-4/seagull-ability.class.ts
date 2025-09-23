import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { EquipmentService } from "app/services/equipment.service";
import { InjectorService } from "app/services/injector.service";

export class SeagullAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'SeagullAbility',
            owner: owner,
            triggers: ['FriendSummoned'],
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

        if (!triggerPet || !owner.equipment) {
            return;
        }

        triggerPet.givePetEquipment(InjectorService.getInjector().get(EquipmentService).getInstanceOfAllEquipment().get(owner.equipment.name));
        this.logService.createLog({
            message: `${owner.name} gave ${triggerPet.name} a ${owner.equipment.name}`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): SeagullAbility {
        return new SeagullAbility(newOwner, this.logService);
    }
}