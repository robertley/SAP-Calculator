import { LogService } from "../../../services/log.servicee";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class Eggplant extends Equipment {
    name = 'Eggplant';
    equipmentClass = 'beforeStartOfBattle' as EquipmentClass;
    callback = (pet: Pet) => {
        if (pet.eggplantTouched) {
            return;
        }
        let originalStartOfBattle = pet.startOfBattle?.bind(pet);
        pet.startOfBattle = (gameApi) => {
            if (originalStartOfBattle != null) {
                originalStartOfBattle(gameApi);
            }
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
    constructor(private logService: LogService) {
        super();
    }

}