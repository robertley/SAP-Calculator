import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { getOpponent } from "../../../util/helper-functions";
import { Toy } from "../../toy.class";

export class Camera extends Toy {
    name = "Camera";
    tier = 5;
    startOfBattle(gameApi?: GameAPI, puma?: boolean) {
        let opponent = getOpponent(gameApi, this.parent);
        for (let i = 0; i < this.level; i++) {
            let highestAttackPetResp = opponent.getHighestAttackPet();
            let target = highestAttackPetResp.pet;
            if (target == null) {
                return;
            }
            let power = .30;
            let reducedTo = Math.max(1, Math.floor(target.attack * (1 - power)));
            target.attack = reducedTo;
            this.logService.createLog({
                message: `${this.name} reduced ${target.name} attack by ${power * 100}% (${reducedTo})`,
                type: 'ability',
                player: this.parent,
                puma: puma,
                randomEvent: highestAttackPetResp.random
            });
        }
    }
}