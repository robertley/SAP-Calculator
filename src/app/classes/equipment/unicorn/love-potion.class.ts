import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class LovePotion extends Equipment {
    name = 'Love Potion';
    equipmentClass = 'beforeStartOfBattle' as EquipmentClass;
    callback = (pet: Pet) => {
        let originalBeforeStartOfBattle =pet.beforeStartOfBattle?.bind(pet);
        pet.beforeStartOfBattle = (gameApi, tiger) => {
            if (originalBeforeStartOfBattle != null) {
                originalBeforeStartOfBattle(gameApi, tiger);
            }
            
            if (tiger) {
                return;
            }
            let petAhead = pet.petAhead;
            if (petAhead == null) {
                return;
            }
            let power = 2 * this.multiplier;
            this.logService.createLog({
                message: `${pet.name} gave ${petAhead.name} ${power} health (Love Potion)${this.multiplierMessage}.`,
                type: 'equipment',
                player: pet.parent
            })
            petAhead.increaseHealth(power);
        }
    }

    constructor(private logService: LogService) {
        super();
    }
}