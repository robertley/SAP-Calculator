import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.servicee";
import { Equipment } from "../../equipment.class";
import { Pack, Pet } from "../../pet.class";
import { Player } from "../../player.class";

export class Head extends Pet {
    name = "Head";
    tier = 1;
    pack: Pack = 'Unicorn';
    hidden: boolean = true;
    health = 5;
    attack = 5;
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