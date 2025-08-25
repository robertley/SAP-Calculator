import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class Eggplant extends Equipment {
    name = 'Eggplant';
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
            for (let i = 0; i < this.multiplier; i++) {
                let opponent = pet.parent.opponent;
                let target = opponent.getPet(pet.position);
                if (target == null) {
                    return;
                }
                this.logService.createLog({
                    message: `${pet.name} pushed ${target.name} 1 space forward. (Eggplant)`,
                    type: 'equipment',
                    player: pet.parent
                })
                opponent.pushPet(target, 1);
            }

        }

    }
    constructor(private logService: LogService) {
        super();
    }

}