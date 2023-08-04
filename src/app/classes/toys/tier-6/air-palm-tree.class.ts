import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { Coconut } from "../../equipment/turtle/coconut.class";
import { Peanut } from "../../equipment/turtle/peanut.class";
import { Toy } from "../../toy.class";

export class AirPalmTree extends Toy {
    name = "Air Palm Tree";
    tier = 6;
    startOfBattle(gameApi?: GameAPI, puma?: boolean) {
        for (let i = 0; i < this.level; i++) {
            for (let pet of this.parent.petArray) {
                if (pet?.equipment instanceof Coconut) {
                    continue;
                }
                pet.givePetEquipment(new Coconut());
                this.logService.createLog({
                    message: `${this.name} gave ${pet.name} Coconut.`,
                    type: 'ability',
                    player: this.parent,
                    puma: puma
                })
                break;
            }
        }
    }
}