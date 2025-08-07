import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { getOpponent } from "../../../util/helper-functions";
import { Garlic } from "../../equipment/turtle/garlic.class";
import { Toy } from "../../toy.class";

export class GarlicPress extends Toy {
    name = "Garlic Press";
    tier = 2;
    startOfBattle(gameApi?: GameAPI, puma?: boolean) {
        for (let i = 0; i < this.level; i++) {
            for (let pet of this.parent.petArray) {
                if (pet?.equipment instanceof Garlic) {
                    continue;
                }
                pet.givePetEquipment(new Garlic());
                this.logService.createLog({
                    message: `${this.name} gave ${pet.name} Garlic.`,
                    type: 'ability',
                    player: this.parent,
                    puma: puma
                })
                break;
            }
        }
    }
}