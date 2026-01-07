import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { GameService } from "../../../services/game.service";
import { LogService } from "../../../services/log.service";
import { PetService } from "../../../services/pet.service";
import { ToyService } from "../../../services/toy.service";
import { Popcorn } from "../../equipment/star/popcorn.class";
import { Player } from "../../player.class";
import { Toy } from "../../toy.class";

export class MicrowaveOven extends Toy {
    name = "Microwave Oven";
    tier = 2;
    startOfBattle(gameApi?: GameAPI, puma?: boolean) {
        // Give Popcorn perk to the level-number of front-most perkless friends
        const targetsCount = this.level;
        let targetCount = 0;
        
        for (let pet of this.parent.petArray) {
            if (targetCount >= targetsCount) {
                break;
            }
            
            // Skip if pet already has equipment/perk
            if (pet.equipment != null) {
                continue;
            }
            
            pet.givePetEquipment(new Popcorn(this.logService, this.petService, this.gameService));
            targetCount++;
            
            this.logService.createLog({
                message: `${this.name} gave ${pet.name} Popcorn.`,
                type: 'ability',
                player: this.parent,
                puma: puma
            });
        }
    }

    constructor(protected logService: LogService, protected toyService: ToyService, parent: Player, level: number,
        private petService: PetService, private gameService: GameService) {
        super(logService, toyService, parent, level);
    }
}
