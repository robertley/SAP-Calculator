import { Panther } from "app/classes/pets/puppy/tier-5/panther.class";
import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class ChocolateCake extends Equipment {
    name = 'Chocolate Cake';
    equipmentClass = 'beforeAttack' as EquipmentClass;
    callback = (pet: Pet) => {
        let originalBeforeAttack =pet.beforeAttack?.bind(pet);
        pet.beforeAttack = (gameApi, tiger) => {
            if (originalBeforeAttack != null) {
                originalBeforeAttack(gameApi, tiger);
            }
            
            if (tiger) {
                return;
            }

            // Check if equipment is still equipped
            if (pet.equipment?.name != 'Chocolate Cake') {
                return;
            }
            
            let expGain = 3 * this.multiplier;
            this.logService.createLog({
                message: `${pet.name} gained ${expGain} exp. (Chocolate Cake)${this.multiplierMessage}`,
                type: 'equipment',
                player: pet.parent
            })
            pet.increaseExp(expGain);
            pet.health = 0;

            if (pet.knockOut != null) {
                this.abilityService.setKnockOutEvent({
                    callback: pet.knockOut.bind(pet),
                    priority: pet.attack
                })
            }

            pet.removePerk();
        }
    }

    constructor(private logService: LogService, private abilityService: AbilityService) {
        super();
    }

}