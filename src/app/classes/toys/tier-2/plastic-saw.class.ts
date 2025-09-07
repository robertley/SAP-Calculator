import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { getOpponent } from "../../../util/helper-functions";
import { Eucalyptus } from "../../equipment/puppy/eucalyptus.class";
import { Toy } from "../../toy.class";

export class PlasticSaw extends Toy {
    name = "Plastic Saw";
    tier = 2;
    startOfBattle(gameApi?: GameAPI, puma?: boolean) {
        for (let i = 0; i < this.level; i++) {
            for (let pet of this.parent.petArray) {
                if (pet?.equipment instanceof Eucalyptus) {
                    continue;
                }
                this.logService.createLog({
                    message: `${this.name} gave ${pet.name} Eucalyptus.`,
                    type: 'ability',
                    player: this.parent,
                    puma: puma
                })
                pet.givePetEquipment(new Eucalyptus());
                break;
            }
        }
    }
}