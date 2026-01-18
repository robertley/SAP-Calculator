import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { Pet } from "../../pet.class";
import { Toy } from "../../toy.class";
import { PetService } from "../../../services/pet/pet.service";
import { cloneEquipment } from "../../../util/equipment-utils";
import { LogService } from "../../../services/log.service";
import { ToyService } from "../../../services/toy/toy.service";
import { Player } from "../../player.class";

export class StuffedBear extends Toy {
    name = "Stuffed Bear";
    tier = 1;
    private faintCount = 0;

    constructor(
        protected logService: LogService,
        protected toyService: ToyService,
        private petService: PetService,
        parent: Player,
        level: number
    ) {
        super(logService, toyService, parent, level);
    }

    friendFaints(gameApi?: GameAPI, pet?: Pet, puma?: boolean, level?: number) {
        this.faintCount += 1;
        if (this.faintCount % 3 !== 0) {
            return;
        }

        const backResp = this.parent.getLastPet();
        if (!backResp.pet) {
            return;
        }

        const source = backResp.pet;
        const clonedEquipment = cloneEquipment(source.equipment);
        const enemy = this.parent.opponent;
        const copy = this.petService.createPet({
            name: source.name,
            attack: source.attack,
            health: source.health,
            exp: source.exp ?? 0,
            mana: source.mana ?? 0,
            equipment: clonedEquipment
        }, enemy);
        copy.toyPet = true;

        if (enemy.summonPet(copy, 0).success) {
            this.logService.createLog({
                message: `${this.name} summoned an enemy copy of ${source.name}.`,
                type: "ability",
                player: this.parent,
                puma: puma
            });
        }
    }
}
