import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.servicee";
import { Equipment } from "../../equipment.class";
import { Pack, Pet } from "../../pet.class";
import { Player } from "../../player.class";

export class ZombieCricket extends Pet {
    name = "Zombie Cricket";
    tier = 1;
    pack: Pack = 'Turtle';
    hidden: boolean = true;
    health = 1;
    attack = 1;
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.exp = exp ?? this.exp;
        this.health = this.level;
        this.attack = this.level;
        this.originalHealth = this.health;
        this.originalAttack = this.attack;
        this.equipment = equipment;
        this.originalEquipment = equipment;
    }
}