import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

// TODO bug 
// - Elephant in front of tiger,
// - if kills tiger, extra triggers dont go off

// - verify tiger behaviors, in general
export class Tiger extends Pet {
    name = "Tiger";
    tier = 6;
    pack: Pack = 'Turtle';
    attack = 6;
    health = 4;
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.health = health ?? this.health;
        this.attack = attack ?? this.attack;
        this.exp = exp ?? this.exp;
        this.originalHealth = this.health;
        this.originalAttack = this.attack;
        this.equipment = equipment;
        this.originalEquipment = equipment;
    }
}