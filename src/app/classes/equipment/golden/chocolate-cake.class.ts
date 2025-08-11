import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class ChocolateCake extends Equipment {
    name = 'Chocolate Cake';
    equipmentClass = 'beforeAttack' as EquipmentClass;
    callback = (pet: Pet) => {
        let originalBeforeAttack = pet.originalBeforeAttack?.bind(pet);
        pet.beforeAttack = (gameApi) => {
            if (originalBeforeAttack != null) {
                originalBeforeAttack(gameApi);
            }
            
            this.logService.createLog({
                message: `${pet.name} gained 3 exp. (Chocolate Cake)`,
                type: 'equipment',
                player: pet.parent
            })
            pet.increaseExp(3);
            pet.health = 0;

            if (pet.knockOut != null) {
                this.abilityService.setKnockOutEvent({
                    callback: pet.knockOut.bind(pet),
                    priority: pet.attack
                })
            }
        }
    }

    constructor(private logService: LogService, private abilityService: AbilityService) {
        super();
    }

}