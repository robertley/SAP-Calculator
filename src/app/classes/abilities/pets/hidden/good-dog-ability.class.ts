import { Ability } from "../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../pet.class";
import { LogService } from "app/services/log.service";
import { EquipmentService } from "app/services/equipment.service";
import { InjectorService } from "app/services/injector.service";

export class GoodDogAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'GoodDogAbility',
            owner: owner,
            triggers: ['StartBattle'],
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
        const owner = this.owner;

        let targetsResp = owner.parent.getAll(true, owner);
        let targets = targetsResp.pets;
        if (targets.length === 0) {
            return;
        }

        let equipmentMap = InjectorService.getInjector().get(EquipmentService).getInstanceOfAllEquipment();
        let equipmentArray = Array.from(equipmentMap.values());

        for (let pet of targets) {
            if (!pet.alive) {
                continue;
            }
            let equipment = equipmentArray[Math.floor(Math.random() * equipmentArray.length)];
            this.logService.createLog({
                message: `${owner.name} gave ${pet.name} ${equipment.name}`,
                type: "ability",
                player: owner.parent,
                randomEvent: targetsResp.random,
                tiger: tiger
            });
            pet.givePetEquipment(equipment);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): GoodDogAbility {
        return new GoodDogAbility(newOwner, this.logService);
    }
}