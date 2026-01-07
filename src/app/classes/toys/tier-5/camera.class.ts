import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { Toy } from "../../toy.class";
import { getOpponent } from "../../../util/helper-functions";
import { LogService } from "../../../services/log.service";
import { PetService } from "../../../services/pet.service";

export class Camera extends Toy {
    name = 'Camera';
    tier = 5;

    constructor(protected logService: LogService, protected toyService: any, parent: any, level: number, private petService?: PetService) {
        super(logService, toyService, parent, level);
    }

    startOfBattle(gameApi?: GameAPI, puma?: boolean) {
        let opponent = getOpponent(gameApi, this.parent);
        if (!opponent) {
            return;
        }
        // reduce attack of highest attack pets by 30% (approximate)
        let targets = opponent.petArray.filter(p => p.alive).sort((a,b)=>b.attack - a.attack).slice(0, this.level);
        for (let t of targets) {
            let reduction = Math.floor(t.attack * 0.3);
            t.attack = Math.max(0, t.attack - reduction);
            this.logService.createLog({ message: `${this.name} reduced ${t.name}'s attack by ${reduction}`, type: 'ability', player: this.parent, randomEvent: false });
        }
    }
}
