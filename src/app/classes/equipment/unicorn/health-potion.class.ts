import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";

export class HealthPotion extends Equipment {
    name = 'Health Potion';
    equipmentClass = 'beforeStartOfBattle' as EquipmentClass;
    callback = (pet) => {
        let power = pet.level * 3;
        this.logService.createLog({
            message: `${pet.name} gained ${power} health (Love Potion).`,
            type: 'equipment',
            player: pet.parent
        })

        pet.increaseHealth(power);
    }

    constructor(private logService: LogService) {
        super();
    }
}