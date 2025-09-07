import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { getOpponent } from "../../../util/helper-functions";
import { Toy } from "../../toy.class";

export class TennisBall extends Toy {
    name = "Tennis Ball";
    tier = 1;
    startOfBattle(gameApi?: GameAPI, puma?: boolean) {
        let opponent = getOpponent(gameApi, this.parent);
        let targetResp = opponent.getRandomPet([], false, true, false, null);
        if (targetResp.pet == null) {
            return;
        }
        this.toyService.snipePet(targetResp.pet, this.level, this.parent, this.name, true, puma);
        targetResp = opponent.getRandomPet([], false, true, false, null);
        if (targetResp.pet == null) {
            return;
        }
        this.toyService.snipePet(targetResp.pet, this.level, this.parent, this.name, true, puma);
    }
}