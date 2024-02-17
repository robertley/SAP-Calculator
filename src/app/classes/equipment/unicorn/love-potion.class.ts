import { LogService } from "../../../services/log.servicee";
import { Equipment, EquipmentClass } from "../../equipment.class";

export class LovePotion extends Equipment {
    name = 'Love Potion';
    equipmentClass = 'beforeStartOfBattle' as EquipmentClass;
    callback = (pet) => {
        let petAhead = pet.petAhead;
        if (petAhead == null) {
            return;
        }

        this.logService.createLog({
            message: `${pet.name} gave ${petAhead.name} ${2} health (Love Potion).`,
            type: 'equipment',
            player: pet.parent
        })

        petAhead.increaseHealth(2);
    }

    constructor(private logService: LogService) {
        super();
    }
}