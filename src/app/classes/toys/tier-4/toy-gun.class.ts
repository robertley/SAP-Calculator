import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { getOpponent } from "../../../util/helper-functions";
import { Toy } from "../../toy.class";

export class ToyGun extends Toy {
    name = "Toy Gun";
    tier = 3;
    startOfBattle(gameApi?: GameAPI) {
        let opponent = getOpponent(gameApi, this.parent);
        for (let i = 0; i < this.level; i++) {
            let target = opponent.getLastPet();
            this.toyService.snipePet(target, 6, this.parent, this.name, false);
        }
    }
}