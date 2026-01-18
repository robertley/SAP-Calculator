import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { GameService } from "../../../services/game.service";
import { LogService } from "../../../services/log.service";
import { PetService } from "../../../services/pet/pet.service";
import { ToyService } from "../../../services/toy/toy.service";
import { Popcorn } from "../../equipment/star/popcorn.class";
import { Player } from "../../player.class";
import { Toy } from "../../toy.class";

export class MicrowaveOven extends Toy {
    name = "Microwave Oven";
    tier = 2;
    startOfBattle(gameApi?: GameAPI, puma?: boolean) {
        let excludePets = this.parent.getPetsWithEquipment('Popcorn');
        let targetResp = this.parent.getFurthestUpPets(this.level, excludePets);
        let targets = targetResp.pets;
        if (targets.length == 0) {
            return;
        }
        for (let pet of targets) {
            this.logService.createLog({
                message: `${this.name} gave ${pet.name} Popcorn.`,
                type: 'ability',
                player: this.parent,
                puma: puma
            })
            pet.givePetEquipment(new Popcorn(this.logService, this.petService, this.gameService));
        }
    }

    constructor(protected logService: LogService, protected toyService: ToyService, parent: Player, level: number,
        private petService: PetService, private gameService: GameService) {
        super(logService, toyService, parent, level);
    }
}
