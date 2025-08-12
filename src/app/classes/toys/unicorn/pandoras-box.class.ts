import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { EquipmentService } from "../../../services/equipment.service";
import { LogService } from "../../../services/log.service";
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

// Equipment effects are now multiplied by toy level via Equipment.getMultiplier()

export class PandorasBox extends Toy {
    name = "Pandoras Box";
    tier = 6;
    startOfBattle(gameApi?: GameAPI, puma?: boolean) {
        let equipmentMap = this.equipmentService.getInstanceOfAllEquipment();
        let ailments = [
            new Cold(),
            new Crisp(),
            new Dazed(),
            new Exposed(),
            // new Ink(), // excluded
            new Spooked(),
            new Weak()
        ];
        
        // https://superautopets.wiki.gg/wiki/Pandoras_Box
        let excludedPerks = [
            'Carrot',
            'Cherry',
            'Chocolate Cake',
            'Coconut',
            'Croissant',
            'Cucumber',
            'Eggplant',
            'Fig',
            'Gingerbread Man',
            'Grapes',
            'Golden Egg',
            'Health Potion',
            'Love Potion',
            'Magic Beans',
            'Peanut',
            'Pie',
            'Rambutan',
            'Rice',
            'Skewer'
        ]

        let pets = [
            ...gameApi.player.petArray,
            ...gameApi.opponet.petArray
        ];

        let equipments = Array.from(equipmentMap.values());
        equipments = equipments.filter(equipment => !excludedPerks.includes(equipment.name));

        for (let pet of pets) {
            // 50% chance for pool to be ailments
            let perkPool = ailments;
            if (Math.random() < 0.5) {
                perkPool = equipments;
            }
            let equipment = perkPool[Math.floor(Math.random() * perkPool.length)];
            this.logService.createLog({
                message: `${this.name} gave ${pet.name} ${equipment.name}`,
                type: "ability",
                player: this.parent,
                randomEvent: true,
            })
            pet.givePetEquipment(equipment, this.level);
        }
    }

    constructor(protected logService: LogService, protected toyService: ToyService, parent: Player, level: number,
        private equipmentService: EquipmentService) {
        super(logService, toyService, parent, level);
    }
}