import { GameAPI } from "../../interfaces/gameAPI.interface";
import { Toy } from "../toy.class";
import { ToyService } from "../../services/toy.service";
import { LogService } from "../../services/log.service";
import { Player } from "../player.class";

/**
 * A toy that intentionally does not interact with pet-triggered events.
 * Useful for “wacky” mode parity: only its direct callbacks (e.g., start of battle)
 * should ever run.
 */
export class WackyToy extends Toy {
    name = "Wacky Toy";
    tier = 7;
    interactsWithPets = false;
    isWacky = true;

    constructor(logService: LogService, toyService: ToyService, parent: Player, level: number) {
        super(logService, toyService, parent, level);
    }

    // Example: still allow start-of-battle effects if assigned later
    startOfBattle?(gameApi?: GameAPI, puma?: boolean);
}
