import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { getOpponent } from "../../../util/helper-functions";
import { Toy } from "../../toy.class";

export class PogoStick extends Toy {
    name = "Pogo Stick";
    tier = 1;
    startOfBattle(gameApi?: GameAPI, puma?: boolean) {
        const opponent = getOpponent(gameApi, this.parent);
        const targetResp = opponent.getLastPet();
        if (!targetResp.pet) {
            return;
        }

        const target = targetResp.pet;
        opponent.pushPetToFront(target);

        const attackGain = target.attack;
        const healthGain = target.health;
        target.increaseAttack(attackGain);
        target.increaseHealth(healthGain);

        this.logService.createLog({
            message: `${this.name} pushed ${target.name} forward and gave +${attackGain}/+${healthGain}.`,
            type: "ability",
            player: this.parent,
            puma: puma
        });
    }
}
