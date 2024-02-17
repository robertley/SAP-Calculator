import { LogService } from "../../../services/log.servicee";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class FairyDust extends Equipment {
    name = 'Fairy Dust';
    equipmentClass = 'beforeStartOfBattle' as EquipmentClass;
    callback = (pet: Pet) => {
        let callback = (pet: Pet) => {
            if (pet.parent.pet0 != null) {
                return;
            }
    
            this.logService.createLog({
                message: `${pet.name} pushed itself to the front (Fairy Dust).`,
                type: 'ability',
                player: pet.parent
            })
    
            pet.parent.pushPetToFront(pet, true);
        }

        let originalEmptyFrontSpace = pet.emptyFrontSpace;
        pet.emptyFrontSpace = (gameApi, tiger) => {
            if (originalEmptyFrontSpace != null) {
                originalEmptyFrontSpace(gameApi, tiger);
            }

            callback(pet);
        }
    }
    constructor(private logService: LogService) {
        super();
    }
}