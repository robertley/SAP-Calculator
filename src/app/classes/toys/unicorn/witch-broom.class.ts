import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { ToyService } from "../../../services/toy.service";
import { getOpponent } from "../../../util/helper-functions";
import { Weak } from "../../equipment/ailments/weak.class";
import { Toy } from "../../toy.class";

export class WitchBroom extends Toy {
    name = "Witch Broom";
    tier = 1;
    startOfBattle(gameApi?: GameAPI, puma?: boolean) {
        let opponent = getOpponent(gameApi, this.parent);
        let excludePets = opponent.petArray.filter(pet => pet.equipment != null);
        let targets = [];
        for (let i = 0; i < this.level; i++) {
            let target = opponent.getRandomPet(excludePets, null, true);
            if (target == null) {
                break;
            }
            excludePets.push(target);
            targets.push(target);
        }
        for (let target of targets) {
            this.logService.createLog({
                message: `${this.name} gave ${target.name} Weak.`,
                type: "ability",
                player: this.parent,
                puma: puma,
                randomEvent: opponent.petArray.length - excludePets.length > 0
            });
            target.givePetEquipment(new Weak());
        }

    }
}