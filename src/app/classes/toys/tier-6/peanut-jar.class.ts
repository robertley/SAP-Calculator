import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { Toy } from "../../toy.class";
import { PeanutButter } from "app/classes/equipment/hidden/peanut-butter";

export class PeanutJar extends Toy {
    name = "Peanut Jar";
    tier = 6;
    startOfBattle(gameApi?: GameAPI, puma?: boolean) {
        let targetResp = this.parent.getLowestAttackPets(this.level, this.parent.getPetsWithEquipment('Peanut Butter'));
        let targets = targetResp.pets;
        if (targets.length == 0) {
            return;
        }
        for (let pet of targets) {
            pet.givePetEquipment(new PeanutButter());
            this.logService.createLog({
                message: `${this.name} gave ${pet.name} PeanutButter.`,
                type: 'ability',
                player: this.parent,
                puma: puma,
                randomEvent: targetResp.random
            })
        }
    }
}