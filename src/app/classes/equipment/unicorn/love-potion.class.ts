import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class LovePotion extends Equipment {
    name = 'Love Potion';
    equipmentClass = 'beforeStartOfBattle' as EquipmentClass;
    callback = (pet: Pet) => {
        let originalBeforeStartOfBattle = pet.originalBeforeStartOfBattle?.bind(pet);
        pet.beforeStartOfBattle = (gameApi) => {
            if (originalBeforeStartOfBattle != null) {
                originalBeforeStartOfBattle(gameApi);
            }
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
    }

    constructor(private logService: LogService) {
        super();
    }
}