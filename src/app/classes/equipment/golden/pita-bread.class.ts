import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class PitaBread extends Equipment {
    name = 'Pita Bread';
    power = 0;
    equipmentClass = 'hurt' as EquipmentClass;
    callback = (pet: Pet) => {
        let originalHurt = pet.hurt?.bind(pet);
        pet.hurt = (gameApi) => {
            if (originalHurt != null) {
                originalHurt(gameApi);
            }
            if (pet.equipment?.name != 'Pita Bread') {
                return;
            }
            if (!pet.alive) {
                return;
            }
            let power = 15 * this.multiplier;
            pet.increaseHealth(power);
            let message = `${pet.name} gained ${power} health. (Pita Bread)${this.multiplierMessage}`;
            message += '.';
            this.logService.createLog({
                message: message,
                type: 'equipment',
                player: pet.parent
            })
            pet.removePerk();
        }
    }
    constructor(
        protected logService: LogService
    ) {
        super()
    }
}