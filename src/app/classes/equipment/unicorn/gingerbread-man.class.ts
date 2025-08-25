import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class GingerbreadMan extends Equipment {
    name = 'Gingerbread Man';
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
            let expGain = 1 * this.multiplier;
            this.logService.createLog({
                message: `${pet.name} gained ${expGain} experience (Gingerbread Man)${this.multiplierMessage}.`,
                type: 'equipment',
                player: pet.parent
            })
            pet.increaseExp(expGain);
        }
    }

    constructor(private logService: LogService) {
        super();
    }
}