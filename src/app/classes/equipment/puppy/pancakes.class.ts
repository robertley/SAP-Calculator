import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class Pancakes extends Equipment {
    name = 'Pancakes';
    tier = 6;
    equipmentClass: EquipmentClass = 'beforeStartOfBattle';
    callback = (pet: Pet) => {
        let originalBeforeStartOfBattle =pet.beforeStartOfBattle?.bind(pet);
        pet.beforeStartOfBattle = (gameApi, tiger) => {
            if (originalBeforeStartOfBattle != null) {
                originalBeforeStartOfBattle(gameApi, tiger);
            }
            
            if (tiger) {
                return;
            }
            for (let pett of pet.parent.petArray) {
                if (pet == pett) {
                    continue;
                }
                let attackGain = 2 * this.multiplier;
                let healthGain = 2 * this.multiplier;
                pett.increaseAttack(attackGain);
                pett.increaseHealth(healthGain);
                this.logService.createLog({
                    message: `${pett.name} gained ${attackGain} attack and ${healthGain} health (Pancakes)${this.multiplierMessage}`,
                    type: 'equipment',
                    player: pet.parent
                })
            }
        }
    }
    
    constructor(protected logService: LogService) {
        super();
    }
}