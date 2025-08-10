import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class Onion extends Equipment {
    name = 'Onion';
    equipmentClass = 'beforeAttack' as EquipmentClass;
    callback = (pet: Pet) => {
        let originalBeforeAttack = pet.originalBeforeAttack?.bind(pet);
        pet.beforeAttack = (gameApi) => {
            if (originalBeforeAttack != null) {
                originalBeforeAttack(gameApi);
            }
            
            this.logService.createLog({
                message: `${pet.name} pushed itself to the back. (Onion)`,
                type: 'equipment',
                player: pet.parent
            })
            pet.givePetEquipment(null);
            pet.parent.pushPetToBack(pet);
            pet.parent.pushPetsForward();
        }
    }
    constructor(private logService: LogService) {
        super();
    }

}