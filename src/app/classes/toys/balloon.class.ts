import { GameAPI } from "../../interfaces/gameAPI.interface";
import { Toy } from "../toy.class";

export class Balloon extends Toy {
    name = "Balloon";
    onBreak(gameApi?: GameAPI) {
        let target = this.parent.furthestUpPet;
        let power = this.level;
        target.increaseAttack(power);
        target.increaseHealth(power);
        this.logService.createLog({
            message: `${this.name} gave ${target.name} ${power} attack and ${power} health.`,
            type: 'ability',
            player: this.parent
        })
    }
}