import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { getOpponent } from "../../../util/helper-functions";
import { Weak } from "../../equipment/ailments/weak.class";
import { Toy } from "../../toy.class";

export class ToiletPaper extends Toy {
    name = "Toilet Paper";
    tier = 3;
    startOfBattle(gameApi?: GameAPI, puma?: boolean) {
        let opponent = getOpponent(gameApi, this.parent);
        let weakTargets = opponent.petArray.slice(0, this.level);
        for (let pet of weakTargets) {
            pet.givePetEquipment(new Weak());
            this.logService.createLog({
                message: `${this.name} gave ${pet.name} Weak.`,
                type: 'ability',
                player: this.parent,
                puma: puma
            })
        }
    }
}