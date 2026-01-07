import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { Toy } from "../../toy.class";
import { Walnut } from "../../equipment/custom/walnut.class";
import { LogService } from "../../../services/log.service";
import { PetService } from "../../../services/pet.service";

export class Stick extends Toy {
    name = 'Stick';
    tier = 1;

    constructor(protected logService: LogService, protected toyService: any, parent: any, level: number, private petService?: PetService) {
        super(logService, toyService, parent, level);
    }

    startOfBattle(gameApi?: GameAPI, puma?: boolean) {
        // Give Walnut perk to the middle space friend
        const middleIndex = Math.floor(this.parent.petArray.length / 2);
        const pet = this.parent.petArray[middleIndex];
        if (pet && pet.alive) {
            const walnut = new Walnut();
            walnut.multiplier = this.level;
            pet.givePetEquipment(walnut);
            this.logService.createLog({ message: `${this.name} gave Walnut to ${pet.name}`, type: 'ability', player: this.parent, randomEvent: false });
        }
    }
}
