import { Ability, AbilityContext } from "../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../pet.class";
import { LogService } from "app/services/log.service";
import { EquipmentService } from "app/services/equipment/equipment.service";
import { InjectorService } from "app/services/injector.service";
import { cloneEquipment } from "app/util/equipment-utils";

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
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        let targetsResp = owner.parent.getAll(true, owner);
        let targets = targetsResp.pets;
        if (targets.length === 0) {
            return;
        }

        const equipmentMap = InjectorService.getInjector().get(EquipmentService).getInstanceOfAllEquipment();
        const minTierByLevel = new Map([
            [1, 1],
            [2, 3],
            [3, 5]
        ]);
        const minTier = minTierByLevel.get(owner.level) ?? 1;
        let equipmentArray = Array.from(equipmentMap.values())
            .filter((equipment) => equipment && (equipment.tier ?? 1) >= minTier);

        if (!equipmentArray.length) {
            equipmentArray = Array.from(equipmentMap.values()).filter(Boolean);
        }

        for (let pet of targets) {
            if (!pet.alive) {
                continue;
            }
            const baseEquipment = equipmentArray[Math.floor(Math.random() * equipmentArray.length)];
            const equipment = cloneEquipment(baseEquipment);
            if (!equipment) {
                continue;
            }
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
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): GoodDogAbility {
        return new GoodDogAbility(newOwner, this.logService);
    }
}