import { FaintService } from "../../services/faint.service";
import { LogService } from "../../services/log.servicee";
import { SummonedService } from "../../services/summoned.service";
import { Equipment } from "../equipment.class";
import { Pet } from "../pet.class";
import { Player } from "../player.class";

export class Horse extends Pet {
    name = "Horse"
    health = 1;
    attack = 2;
    friendSummoned = (pet) => {
        pet.attack += this.level;
        this.logService.createLog({
            message: `Horse gave ${pet.name} ${this.level} attack`,
            type: 'ability',
            player: this.parent
        })
    }
    constructor(protected logService: LogService,
        protected faintService: FaintService,
        protected summonedService: SummonedService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, faintService, summonedService, parent);
        this.health = health ?? this.health;
        this.attack = attack ?? this.attack;
        this.exp = exp ?? this.exp;
        this.originalHealth = this.health;
        this.originalAttack = this.attack;
        this.equipment = equipment;
    }
}