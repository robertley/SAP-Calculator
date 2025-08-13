import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class Pie extends Equipment {
    name = 'Pie';
    tier = 4;
    equipmentClass: EquipmentClass = 'beforeStartOfBattle';
    callback = (pet: Pet) => {
        let originalBeforeStartOfBattle = pet.originalBeforeStartOfBattle?.bind(pet);
        pet.beforeStartOfBattle = (gameApi) => {
            if (originalBeforeStartOfBattle != null) {
                originalBeforeStartOfBattle(gameApi);
            }
            let attackGain = 4 * this.multiplier;
            let healthGain = 4 * this.multiplier;
            pet.increaseAttack(attackGain);
            pet.increaseHealth(healthGain);
            this.logService.createLog({
                message: `${pet.name} gained ${attackGain} attack and ${healthGain} health (Pie)${this.multiplierMessage}`,
                type: 'equipment',
                player: pet.parent
            })
        }
    }
    
    constructor(protected logService: LogService) {
        super();
    }
}