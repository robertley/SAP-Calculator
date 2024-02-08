import { LogService } from "../../../services/log.servicee";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class YggdrasilFruit extends Equipment {
    name = 'Yggdrasil Fruit';
    equipmentClass = 'faint' as EquipmentClass;

    constructor(private logService: LogService) {
        super();
    }
}