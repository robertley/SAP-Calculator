import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { getOpponent } from "../../../util/helper-functions";
import { Toy } from "../../toy.class";

export class FoamSword extends Toy {
    name = "Foam Sword";
    tier = 4;
    startOfBattle(gameApi?: GameAPI, puma?: boolean) {
        let opponent = getOpponent(gameApi, this.parent);
        for (let i = 0; i < this.level; i++) {
            let lowestHealthResp = opponent.getLowestHealthPet();
            if (lowestHealthResp.pet == null) {
                return;
            }
            this.toyService.snipePet(lowestHealthResp.pet, 5, this.parent, this.name, lowestHealthResp.random, puma);
        }
    }
}