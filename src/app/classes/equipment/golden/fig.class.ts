import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Panther } from "../../pets/puppy/tier-5/panther.class";

export class Fig extends Equipment {
    name = 'Fig';
    equipmentClass = 'startOfBattle' as EquipmentClass;
    callback = (pet: Pet) => {
        let originalStartOfBattle = pet.originalStartOfBattle?.bind(pet);
        pet.startOfBattle = (gameApi) => {
            if (originalStartOfBattle != null) {
                originalStartOfBattle(gameApi);
            }

            let amt = 1;
            if (pet instanceof Panther) {
                amt = pet.level + 1;
            }

            for (let i = 0; i < amt; i++) {
                let lowestHeathPetResp = pet.parent.opponent.getLowestHealthPet();
                if (!lowestHeathPetResp.pet) {
                    return;
                }
                pet.snipePet(lowestHeathPetResp.pet, 4, lowestHeathPetResp.random, false, false, true);
            }
        }
    }

}