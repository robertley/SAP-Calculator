import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { getOpponent } from "../../../util/helper-functions";
import { Toy } from "../../toy.class";

export class StrinkySock extends Toy {
    name = "Strinky Sock";
    tier = 5;
    startOfBattle(gameApi?: GameAPI, puma?: boolean) {
        let opponent = getOpponent(gameApi, this.parent);
        for (let i = 0; i < this.level; i++) {
            let target = opponent.getHighestHealthPet();
            let power = .40;
            let reducedTo =  Math.ceil(target.health * (1 - power));
            target.health = reducedTo;
            this.logService.createLog({
                message: `${this.name} reduced ${target.name} health by ${power * 100}% (${reducedTo})`,
                type: 'ability',
                player: this.parent,
                puma: puma
            });
        }
    }
}