import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { getOpponent } from "../../../util/helper-functions";
import { Toy } from "../../toy.class";

export class TennisBall extends Toy {
    name = "Tennis Ball";
    tier = 1;
    startOfBattle(gameApi?: GameAPI, puma?: boolean) {
        let opponent = getOpponent(gameApi, this.parent);
        let target = opponent.getRandomPet(null, null, true);
        if (target == null) {
            return;
        }
        this.toyService.snipePet(target, this.level, this.parent, this.name, true, puma);
        target = opponent.getRandomPet(null, null, true);
        if (target == null) {
            return;
        }
        this.toyService.snipePet(target, this.level, this.parent, this.name, true, puma);
    }
}