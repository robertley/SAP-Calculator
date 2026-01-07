import { LogService } from "app/services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";

export class Guava extends Equipment {
    name = 'Guava';
    equipmentClass: EquipmentClass = 'attack';
    tier = 3;
    power = 3;
    originalPower = 3;
    uses = 1;
    originalUses = 1;
    minimumDamage = 0;
    constructor(protected logService: LogService) {
        super();
    }
}
