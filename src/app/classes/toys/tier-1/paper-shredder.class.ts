import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { Pet } from "../../pet.class";
import { Toy } from "../../toy.class";

export class PaperShredder extends Toy {
    name = "Paper Shredder";
    tier = 1;
    friendSummoned(gameApi?: GameAPI, pet?: Pet, puma?: boolean, level?: number) {
        if (!pet) {
            return;
        }
        pet.health = 0;
        this.logService.createLog({
            message: `${this.name} knocked out ${pet.name}.`,
            type: "ability",
            player: this.parent,
            puma: puma
        });
    }
}
