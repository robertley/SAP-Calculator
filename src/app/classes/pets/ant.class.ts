import { Power } from "../../interfaces/power.interface";
import { FaintService } from "../../services/faint.service";
import { LogService } from "../../services/log.servicee";
import { SummonedService } from "../../services/summoned.service";
import { Equipment } from "../equipment.class";
import { Pet } from "../pet.class";
import { Player } from "../player.class";

export class Ant extends Pet {

    name = "Ant"
    health = 2;
    attack = 2;

    faint = () => {
        let power: Power = this.level == 1 ? { health: 1, attack: 1 } :
            this.level == 2 ? { health: 2, attack: 2 } : { health: 3, attack: 3 };

        let boostPet = this.parent.getRandomPet(this);
        if (boostPet == null) {
            return;
        }
        boostPet.health += power.health;
        boostPet.attack += power.attack;
        this.logService.createLog({
            message: `Ant gave ${boostPet.name} ${power.attack} attack and ${power.health} health.`,
            type: "ability",
            randomEvent: true,
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