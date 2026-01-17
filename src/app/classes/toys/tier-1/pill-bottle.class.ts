import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { getOpponent } from "../../../util/helper-functions";
import { Toy } from "../../toy.class";

export class PillBottle extends Toy {
    name = "Pill Bottle";
    tier = 1;
    startOfBattle(gameApi?: GameAPI, puma?: boolean) {
        const frontFriends = this.parent.getFurthestUpPets(2);
        for (const pet of frontFriends.pets) {
            pet.health = 0;
            this.logService.createLog({
                message: `${this.name} knocked out ${pet.name}.`,
                type: "ability",
                player: this.parent,
                puma: puma
            });
        }

        const opponent = getOpponent(gameApi, this.parent);
        const frontEnemy = opponent.getFurthestUpPets(1).pets[0];
        if (frontEnemy) {
            frontEnemy.health = 0;
            this.logService.createLog({
                message: `${this.name} knocked out ${frontEnemy.name}.`,
                type: "ability",
                player: this.parent,
                puma: puma
            });
        }
    }
}
