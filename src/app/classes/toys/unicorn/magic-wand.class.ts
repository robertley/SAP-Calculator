import { shuffle } from "lodash";
import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { ToyService } from "../../../services/toy/toy.service";
import { getOpponent } from "../../../util/helper-functions";
import { Weak } from "../../equipment/ailments/weak.class";
import { Toy } from "../../toy.class";

export class MagicWand extends Toy {
    name = "Magic Wand";
    tier = 1;
    startOfBattle(gameApi?: GameAPI, puma?: boolean) {
        let targets = this.parent.petArray.filter(pet => pet.level < 3);
        let target = null;
        let random = false;
        if (targets.length == 0) {
            target = this.parent.getRandomPet([], true);
        } else {
            targets = shuffle(targets);
            target = targets[0];
            random = targets.length > 1;
        }

        if (target == null) {
            return;
        }

        this.logService.createLog({
            message: `${this.name} gave ${target.name} ${this.level} exp.`,
            type: "ability",
            player: this.parent,
            puma: puma,
            randomEvent: random
        });

        target.increaseExp(this.level);
    }
}