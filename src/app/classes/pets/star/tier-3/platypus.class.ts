import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Player } from "../../../player.class";
import { Pet, Pack } from "../../../pet.class";
import { Equipment } from "../../../equipment.class";

export class Platypus extends Pet {
    name = "Platypus";
    tier = 3;
    pack: Pack = "Star";
    health = 3;
    attack = 3;

    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
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