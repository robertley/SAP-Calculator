import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class HealthPotion extends Equipment {
    name = 'Health Potion';
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
            let power = 2 * this.multiplier;
            let target = pet.parent.furthestUpPet;
            if (target == null) {
                return;
            }
            this.logService.createLog({
                message: `${pet.name} gave ${power} health to ${target.name} (Health Potion)${this.multiplierMessage}.`,
                type: 'equipment',
                player: pet.parent
            })
            target.increaseHealth(power);
        }
    }

    constructor(private logService: LogService) {
        super();
    }
}