import { GameAPI } from "../../interfaces/gameAPI.interface";
import { getOpponent } from "../../util/helper-functions";
import { Toy } from "../toy.class";

export class TennisBall extends Toy {
    name = "TennisBall";
    startOfBattle(gameApi?: GameAPI) {
        let opponent = getOpponent(gameApi, this.parent);
        let target = opponent.getRandomPet();
        this.toyService.snipePet(target, this.level, this.parent, this.name, true);
        target = opponent.getRandomPet();
        this.toyService.snipePet(target, this.level, this.parent, this.name, true);
    }
}