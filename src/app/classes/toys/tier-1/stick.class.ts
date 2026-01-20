import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { Toy } from "../../toy.class";
import { Walnut } from "../../equipment/puppy/walnut.class";
import { LogService } from "../../../services/log.service";
import { PetService } from "../../../services/pet/pet.service";

export class Stick extends Toy {
    name = 'Stick';
    tier = 1;

    constructor(protected logService: LogService, protected toyService: any, parent: any, level: number, private petService?: PetService) {
        super(logService, toyService, parent, level);
    }

    startOfBattle(gameApi?: GameAPI, puma?: boolean) {
        // Give Walnut perk to the friend on the middle space.
        const friendResp = this.parent.getMiddleFriend();
        if (friendResp.pet && friendResp.pet.alive) {
            const walnut = new Walnut();
            walnut.power = 2 * this.level;
            walnut.originalPower = walnut.power;
            friendResp.pet.givePetEquipment(walnut);
            this.logService.createLog({
                message: `${this.name} gave Walnut to ${friendResp.pet.name}`,
                type: 'ability',
                player: this.parent,
                randomEvent: friendResp.random
            });
        }
    }
}
