import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";

export class Rambutan extends Equipment {
    name = 'Rambutan';
    equipmentClass = 'beforeAttack' as EquipmentClass;
    callback = (pet) => {
        this.logService.createLog({
            message: `${pet.name} gained 3 mana. (Rambutan)`,
            type: 'equipment',
            player: pet.parent
        })
        pet.increaseMana(3);
    }

    constructor(private logService: LogService) {
        super();
    }
}