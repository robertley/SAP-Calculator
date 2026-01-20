import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { ToyService } from "../../../services/toy/toy.service";
import { Toy } from "../../toy.class";

export class Balloon extends Toy {
    name = "Balloon";
    tier = 1;
    onBreak(gameApi?: GameAPI, puma?: boolean) {
        let targets = this.parent.getFurthestUpPets(this.level, []);
        if (targets.pets.length == 0) {
            return;
        }
        let power = 1;
        for (let target of targets.pets) {
            target.increaseAttack(power);
            target.increaseHealth(power);
            this.logService.createLog({
                message: `${this.name} gave ${target.name} ${power} attack and ${power} health.`,
                type: 'ability',
                player: this.parent,
                puma: puma
            })
        }
    }
}