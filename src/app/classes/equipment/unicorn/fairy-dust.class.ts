import { LogService } from "../../../services/log.service";
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
            let manaAmmt = 2 * this.multiplier;
            this.logService.createLog({
                message: `${pet.name} pushed itself to the front and gained ${manaAmmt} mana(Fairy Dust)${this.multiplierMessage}.`,
                type: 'ability',
                player: pet.parent
            })
    
            pet.parent.pushPetToFront(pet, true);
            pet.increaseMana(manaAmmt);
        }

        let originalEmptyFrontSpace = pet.emptyFrontSpace;
        pet.emptyFrontSpace = (gameApi, tiger) => {
            if (originalEmptyFrontSpace != null) {
                originalEmptyFrontSpace(gameApi, tiger);
            }
            
            if (tiger) {
                return;
            }

            if (pet.equipment?.name != 'Tomato') {
                return;
            }

            callback(pet);
            pet.removePerk();

        }
    }
    constructor(private logService: LogService) {
        super();
    }
}