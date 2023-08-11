import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.servicee";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Panther } from "../../pets/puppy/tier-5/panther.class";

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
            let multiplier = 1;
            if (pet instanceof Panther) {
                multiplier = 1 + pet.level;
            }
            let power = 15 * multiplier;
            pet.increaseHealth(power);
            let message = `${pet.name} gained ${power} health. (Pita Bread)`;
            message += '.';
            this.logService.createLog({
                message: message,
                type: 'equipment',
                player: pet.parent,
                pantherMultiplier: multiplier
            })
            pet.givePetEquipment(null);
        }
    }
    constructor(
        protected logService: LogService
    ) {
        super()
    }
}