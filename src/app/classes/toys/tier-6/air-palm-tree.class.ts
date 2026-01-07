import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { Coconut } from "../../equipment/turtle/coconut.class";
import { Peanut } from "../../equipment/turtle/peanut.class";
import { Toy } from "../../toy.class";

export class AirPalmTree extends Toy {
    name = "Air Palm Tree";
    tier = 6;
    startOfBattle(gameApi?: GameAPI, puma?: boolean) {
        let targetResp = this.parent.getHighestAttackPets(this.level, this.parent.getPetsWithEquipment('Coconut'));
        let targets = targetResp.pets;
        if (targets.length == 0) {
            return;
        }
        for (let pet of targets) {
            pet.givePetEquipment(new Coconut());
            this.logService.createLog({
                message: `${this.name} gave ${pet.name} Coconut.`,
                type: 'ability',
                player: this.parent,
                puma: puma,
                randomEvent: targetResp.random
            })
        }
    }
}