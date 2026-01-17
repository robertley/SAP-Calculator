import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { Toy } from "../../toy.class";

export class ToyMouse extends Toy {
    name = "Toy Mouse";
    tier = 3;
    startOfBattle(gameApi?: GameAPI, puma?: boolean) {
        for (const pet of this.parent.petArray) {
            pet.exp = 0;
            this.logService.createLog({
                message: `${this.name} set ${pet.name} to level 1.`,
                type: "ability",
                player: this.parent,
                puma: puma
            });
        }
    }
}
