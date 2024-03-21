import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { EquipmentService } from "../../../services/equipment.service";
import { LogService } from "../../../services/log.servicee";
import { ToyService } from "../../../services/toy.service";
import { Cold } from "../../equipment/ailments/cold.class";
import { Crisp } from "../../equipment/ailments/crisp.class";
import { Dazed } from "../../equipment/ailments/dazed.class";
import { Exposed } from "../../equipment/ailments/exposed.class";
import { Ink } from "../../equipment/ailments/ink.class";
import { Spooked } from "../../equipment/ailments/spooked.class";
import { Weak } from "../../equipment/ailments/weak.class";
import { Peanut } from "../../equipment/turtle/peanut.class";
import { Player } from "../../player.class";
import { Toy } from "../../toy.class";

export class PandorasBox extends Toy {
    name = "Pandoras Box";
    tier = 6;
    startOfBattle(gameApi?: GameAPI, puma?: boolean) {
        let equipmentMap = this.equipmentService.getInstanceOfAllEquipment();
        equipmentMap.set('Cold', new Cold());
        equipmentMap.set('Crisp', new Crisp());
        equipmentMap.set('Exposed', new Exposed());
        equipmentMap.set('Ink', new Ink());
        equipmentMap.set('Weak', new Weak());
        equipmentMap.set('Dazed', new Dazed());
        equipmentMap.set('Spooked', new Spooked());

        let pets = [
            ...gameApi.player.petArray,
            ...gameApi.opponet.petArray
        ];

        let equipmentArray = Array.from(equipmentMap.values());

        for (let pet of pets) {
            let equipment = equipmentArray[Math.floor(Math.random() * equipmentArray.length)];
            this.logService.createLog({
                message: `${this.name} gave ${pet.name} ${equipment.name}`,
                type: "ability",
                player: this.parent,
                randomEvent: true,
            })
            pet.givePetEquipment(equipment);
        }
    }

    constructor(protected logService: LogService, protected toyService: ToyService, parent: Player, level: number,
        private equipmentService: EquipmentService) {
        super(logService, toyService, parent, level);
    }
}