import { LogService } from "../../../services/log.servicee";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Panther } from "../../pets/puppy/tier-5/panther.class";

export class Eggplant extends Equipment {
    name = 'Eggplant';
    equipmentClass = 'beforeStartOfBattle' as EquipmentClass;
    callback = (pet: Pet) => {
        let originalStartOfBattle = pet.originalStartOfBattle?.bind(pet);
        pet.startOfBattle = (gameApi) => {
            if (originalStartOfBattle != null) {
                originalStartOfBattle(gameApi);
            }
            let amt = 1;
            if (pet instanceof Panther) {
                amt = 1 + pet.level;
            }
            for (let i = 0; i < amt; i++) {
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