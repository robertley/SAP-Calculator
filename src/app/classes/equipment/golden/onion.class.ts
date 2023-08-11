import { LogService } from "../../../services/log.servicee";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class Onion extends Equipment {
    name = 'Onion';
    equipmentClass = 'shop' as EquipmentClass;
    callback = (pet: Pet) => {
        this.logService.createLog({
            message: `${pet.name} pushed itself to the back. (Onion)`,
            type: 'equipment',
            player: pet.parent
        })
        pet.givePetEquipment(null);
        pet.parent.pushPetToBack(pet);
    }
    constructor(private logService: LogService) {
        super();
    }

}