import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class CashewNut extends Equipment {
    name = 'Cashew Nut';
    tier = 1;
    equipmentClass: EquipmentClass = 'beforeStartOfBattle';
    callback = (pet: Pet) => {
        let originalBeforeStartOfBattle = pet.beforeStartOfBattle?.bind(pet);
        pet.beforeStartOfBattle = (gameApi, tiger) => {
            if (originalBeforeStartOfBattle != null) {
                originalBeforeStartOfBattle(gameApi, tiger);
            }
            
            if (tiger) {
                return;
            }
            
            // Check if equipment is still equipped
            if (pet.equipment !== this) {
                return;
            }
            
            let targetResp = pet.parent.nearestPetsAhead(2, pet, null, true);
            let targets = targetResp.pets;
            if (targets.length < 2) {
                return;
            }
            let target = targets[1];
            if (target.parent == pet.parent) {
                pet.snipePet(target, 1, targetResp.random, null, null, true);
            } else {
                pet.snipePet(target, 2, targetResp.random, null, null, true);
            }
        }
    }

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService 
    ) {
        super();
    }
}