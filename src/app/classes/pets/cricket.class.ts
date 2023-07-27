import { FaintService } from "../../services/faint.service";
import { LogService } from "../../services/log.servicee";
import { SummonedService } from "../../services/summoned.service";
import { Equipment } from "../equipment.class";
import { Pet } from "../pet.class";
import { Player } from "../player.class";
import { ZombieCricket } from "./zombie-cricket.class";

export class Cricket extends Pet {
    name = "Cricket"
    health = 2;
    attack = 1;
    faint = () => {
        let level = 1;
        let exp = 0;
        if (this.level == 2) {
            exp = 2;
            level = 2;
        } else if (this.level == 3) {
            exp = 5;
            level = 3;
        }
        let zombie = new ZombieCricket(this.logService, this.faintService, this.summonedService, this.parent, null, null, exp);
        if (this.savedPosition == 0) {
            this.parent.pet0 = zombie;
        }
        if (this.savedPosition == 1) {
            this.parent.pet1 = zombie;
        }
        if (this.savedPosition == 2) {
            this.parent.pet2 = zombie;
        }
        if (this.savedPosition == 3) {
            this.parent.pet3 = zombie;
        }
        if (this.savedPosition == 4) {
            this.parent.pet4 = zombie;
        }
        this.logService.createLog(
            {
                message: `Cricket Spawned Zombie Cricket Level ${level}`,
                type: "ability",
                player: this.parent
            }
        )
        this.summonedService.triggerSummonedEvents(zombie);
    };
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