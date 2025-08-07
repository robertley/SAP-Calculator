import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { getOpponent } from "../../../util/helper-functions";
import { Weak } from "../../equipment/ailments/weak.class";
import { Toy } from "../../toy.class";

export class OvenMitts extends Toy {
    name = "Oven Mitts";
    tier = 3;
    onBreak(gameApi?: GameAPI) {
        // doesn't need to be programmed
    }
}