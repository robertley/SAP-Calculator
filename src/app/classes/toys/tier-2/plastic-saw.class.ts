import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { getOpponent } from "../../../util/helper-functions";
import { Eucalyptus } from "../../equipment/puppy/eucalyptus.class";
import { Toy } from "../../toy.class";

export class PlasticSaw extends Toy {
    name = "Plastic Saw";
    tier = 2;
    startOfBattle(gameApi?: GameAPI, puma?: boolean) {
        let excludePets = this.parent.getPetsWithEquipment('Eucalyptus');
        let targetResp = this.parent.getFurthestUpPets(this.level, excludePets);
        let targets = targetResp.pets;
        if (targets.length == 0) {
            return;
        }
        for (let pet of targets) {
            this.logService.createLog({
                message: `${this.name} gave ${pet.name} Eucalyptus.`,
                type: 'ability',
                player: this.parent,
                puma: puma
            })
            pet.givePetEquipment(new Eucalyptus());
        }
    }
}