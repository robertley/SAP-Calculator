import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class GingerbreadMan extends Equipment {
    name = 'Gingerbread Man';
    equipmentClass = 'beforeStartOfBattle' as EquipmentClass;
    callback = (pet: Pet) => {
        this.logService.createLog({
            message: `${pet.name} increased gained 1 experience (Gingerbread Man).`,
            type: 'equipment',
            player: pet.parent
        })
        pet.increaseExp(1);
    }

    constructor(private logService: LogService) {
        super();
    }
}