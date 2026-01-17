import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { Toy } from "../../toy.class";

export class Lamp extends Toy {
    name = "Lamp";
    tier = 1;
    startOfBattle(gameApi?: GameAPI, puma?: boolean) {
        for (const pet of this.parent.petArray) {
            const attackLoss = Math.floor(pet.attack * 0.2);
            const healthLoss = Math.floor(pet.health * 0.2);
            if (attackLoss > 0) {
                pet.increaseAttack(-attackLoss);
            }
            if (healthLoss > 0) {
                pet.increaseHealth(-healthLoss);
            }
            this.logService.createLog({
                message: `${this.name} removed ${attackLoss} attack and ${healthLoss} health from ${pet.name}.`,
                type: "ability",
                player: this.parent,
                puma: puma
            });
        }
    }
}
