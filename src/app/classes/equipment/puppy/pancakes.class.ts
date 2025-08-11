import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Panther } from "../../pets/puppy/tier-5/panther.class";

export class Pancakes extends Equipment {
    name = 'Pancakes';
    tier = 6;
    equipmentClass: EquipmentClass = 'beforeStartOfBattle';
    callback = (pet: Pet) => {
        let originalBeforeStartOfBattle = pet.originalBeforeStartOfBattle?.bind(pet);
        pet.beforeStartOfBattle = (gameApi) => {
            if (originalBeforeStartOfBattle != null) {
                originalBeforeStartOfBattle(gameApi);
            }
            let multiplier = 1;
            let pantherMessage = '';
            if (pet instanceof Panther) {
                multiplier = pet.level + 1;
                pantherMessage = ' (Panther)';
            }
            for (let pett of pet.parent.petArray) {
                if (pet == pett) {
                    continue;
                }
                pett.increaseAttack(2 * multiplier);
                pett.increaseHealth(2 * multiplier);
                this.logService.createLog({
                    message: `${pett.name} gained ${2 * multiplier} attack and ${2 * multiplier} health (Pancakes)${pantherMessage}`,
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