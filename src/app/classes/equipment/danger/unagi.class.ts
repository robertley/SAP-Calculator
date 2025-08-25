import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class Unagi extends Equipment {
    name = 'Unagi';
    equipmentClass = 'startOfBattle' as EquipmentClass;
    callback = (pet: Pet) => {
        let originalStartOfBattle =pet.startOfBattle?.bind(pet);
        pet.startOfBattle = (gameApi, tiger) => {
            if (originalStartOfBattle != null) {
                originalStartOfBattle(gameApi, tiger);
            }
            
            if (tiger) {
                return;
            }
            
            // Check if equipment is still equipped
            if (pet.equipment?.name != 'Unagi') {
                return;
            }
            
            // Get random enemy target
            let target = pet.parent.opponent.getRandomPet();
            if (target) {
                let damage = 2 * this.multiplier;
                pet.snipePet(target, damage, true, false, false, true, false);
            }
        }
    }

    constructor(protected logService: LogService) {
        super();
    }
}