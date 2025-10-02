import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { Toy } from "../../toy.class";
import { PeanutButter } from "app/classes/equipment/hidden/peanut-butter";

export class PeanutJar extends Toy {
    name = "Peanut Jar";
    tier = 6;
    startOfBattle(gameApi?: GameAPI, puma?: boolean) {
        for (let i = 0; i < this.level; i++) {
            for (let pet of this.parent.petArray) {
                if (pet?.equipment instanceof PeanutButter) {
                    continue;
                }
                pet.givePetEquipment(new PeanutButter());
                this.logService.createLog({
                    message: `${this.name} gave ${pet.name} PeanutButter.`,
                    type: 'ability',
                    player: this.parent,
                    puma: puma
                })
                break;
            }
        }
    }
}