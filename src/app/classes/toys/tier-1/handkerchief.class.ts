import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { Weak } from "../../equipment/ailments/weak.class";
import { Toy } from "../../toy.class";

export class Handkerchief extends Toy {
    name = "Handkerchief";
    tier = 1;
    startOfBattle(gameApi?: GameAPI, puma?: boolean) {
        const targets = this.parent.getFurthestUpPets(2);
        for (const pet of targets.pets) {
            pet.givePetEquipment(new Weak());
            this.logService.createLog({
                message: `${this.name} gave ${pet.name} Weak.`,
                type: "ability",
                player: this.parent,
                puma: puma,
                randomEvent: targets.random
            });
        }
    }
}
