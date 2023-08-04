import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { Peanut } from "../../equipment/turtle/peanut.class";
import { Toy } from "../../toy.class";

export class PeanutJar extends Toy {
    name = "Peanut Jar";
    tier = 6;
    startOfBattle(gameApi?: GameAPI, puma?: boolean) {
        for (let i = 0; i < this.level; i++) {
            for (let pet of this.parent.petArray) {
                if (pet?.equipment instanceof Peanut) {
                    continue;
                }
                pet.givePetEquipment(new Peanut());
                this.logService.createLog({
                    message: `${this.name} gave ${pet.name} Peanut.`,
                    type: 'ability',
                    player: this.parent,
                    puma: puma
                })
                break;
            }
        }
    }
}