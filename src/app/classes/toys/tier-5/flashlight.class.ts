import { GameAPI } from "../../../interfaces/gameAPI.interface";

import { Melon } from "../../equipment/turtle/melon.class";
import { Toy } from "../../toy.class";

export class Flashlight extends Toy {
    name = "Flashlight";
    tier = 5;
    onBreak(gameApi?: GameAPI, puma?: boolean) {
        let power = this.level * 5;
        let target = this.parent.furthestUpPet;
        if (target == null) {
            return;
        }
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