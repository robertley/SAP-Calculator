import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment } from "../../equipment.class";
import { Pack, Pet } from "../../pet.class";
import { Player } from "../../player.class";
import { EquipmentService } from "../../../services/equipment.service";
import { PetService } from "../../../services/pet.service";
import { GameService } from "../../../services/game.service";
import { InjectorService } from "../../../services/injector.service";
// TO DO: Add all perks
export class GoodDog extends Pet {
    name = "Good Dog";
    tier = 5;
    pack: Pack = 'Unicorn';
    attack = 3;
    health = 3;
    hidden: boolean = true;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let targetsResp = this.parent.getAll(true, this);
        let targets = targetsResp.pets;
        if (targets.length == 0) {
            return;
        }

        let equipmentMap = InjectorService.getInjector().get(EquipmentService).getInstanceOfAllEquipment();
        let equipmentArray = Array.from(equipmentMap.values());

        for (let pet of targets) {
            if (!pet.alive) {
                continue;
            }
            let equipment = equipmentArray[Math.floor(Math.random() * equipmentArray.length)];
            this.logService.createLog({
                message: `${this.name} gave ${pet.name} ${equipment.name}`,
                type: "ability",
                player: this.parent,
                randomEvent: targetsResp.random,
                tiger: tiger
            })
            pet.givePetEquipment(equipment);
        }
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService,
        protected gameService: GameService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment);
    }
}