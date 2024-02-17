import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { Pet } from "../../pet.class";
import { Toy } from "../../toy.class";

export class RedCape extends Toy {
    name = "Red Cape";
    tier = 4;
    friendJumped(gameApi?: GameAPI, pet?: Pet, puma?: boolean, level?: number) {
        let targets = pet.parent.petArray.filter(p => p.alive);
        for (let target of targets) {
            this.logService.createLog({
                message: `${this.name} gave ${target.name} ${level} attack and ${level} health.`,
                type: "ability",
                player: this.parent,
                puma: puma
            });
            target.increaseAttack(+level);
            target.increaseHealth(+level);
        }
    }
}