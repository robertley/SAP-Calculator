import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { Inked } from "../../equipment/ailments/inked.class";
import { Toy } from "../../toy.class";

export class Pen extends Toy {
    name = "Pen";
    tier = 1;
    startOfBattle(gameApi?: GameAPI, puma?: boolean) {
        const targets = this.parent.getFurthestUpPets(2);
        for (const pet of targets.pets) {
            pet.givePetEquipment(new Inked());
            this.logService.createLog({
                message: `${this.name} gave ${pet.name} Inked.`,
                type: "ability",
                player: this.parent,
                puma: puma,
                randomEvent: targets.random
            });
        }
    }
}
