import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { ToyService } from "../../../services/toy.service";
import { Toy } from "../../toy.class";

export class Balloon extends Toy {
    name = "Balloon";
    tier = 1;
    onBreak() {
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