import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { Toy } from "../../toy.class";

export class Television extends Toy {
    name = "Television";
    tier = 6;
    onBreak(gameApi?: GameAPI, puma?: boolean) {
        let power = this.level * 2;
        for (let pet of this.parent.petArray) {
            if (!pet.alive) {
                continue;
            }
            pet.increaseAttack(power);
            pet.increaseHealth(power);
            this.logService.createLog({
                message: `${this.name} gave ${pet.name} ${power} attack and ${power} health.`,
                type: 'ability',
                player: this.parent,
                puma: puma
            })
        }
    }
}