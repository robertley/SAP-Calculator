import { GameAPI } from "../../../interfaces/gameAPI.interface";

import { Melon } from "../../equipment/turtle/melon.class";
import { Toy } from "../../toy.class";

export class MelonHelmet extends Toy {
    name = "Melon Helmet";
    tier = 3;
    onBreak(gameApi?: GameAPI, puma?: boolean) {
        let targetPets = this.parent.petArray.filter(pet => {
            return pet.alive;
        }).slice(0, this.level);
        for (let pet of targetPets) {
            pet.givePetEquipment(new Melon());
            this.logService.createLog({
                message: `${this.name} gave ${pet.name} Melon.`,
                type: 'ability',
                player: this.parent,
                puma: puma
            })
        }
    }
}
