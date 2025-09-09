import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class SudduthTomato extends Equipment {
    name = 'Sudduth Tomato';
    equipmentClass = 'hurt' as EquipmentClass;
    callback = (pet: Pet) => {
        let originalHurt = pet.hurt?.bind(pet);
        pet.hurt = (gameApi, attacker, tiger) => {
            if (originalHurt != null) {
                originalHurt(gameApi, attacker, tiger);
            }
            
            if (tiger) {
                return;
            }
            
            // Check if equipment is still equipped
            if (pet.equipment?.name != 'Sudduth Tomato') {
                return;
            }
            
            // Check if pet is still alive after being hurt
            if (!pet.alive) {
                return;
            }
            
            let healthGain = 1 * this.multiplier;
            pet.increaseHealth(healthGain);
            
            this.logService.createLog({
                message: `${pet.name} gained ${healthGain} health (Sudduth Tomato)${this.multiplierMessage}`,
                type: 'equipment',
                player: pet.parent
            });
            
            // Remove equipment after one use
            pet.removePerk();
        }
    }

    constructor(protected logService: LogService) {
        super();
    }
}