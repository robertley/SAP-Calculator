import { Chili } from "app/classes/equipment/chili.class";
import { getOpponent } from "app/util/helper-functions";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Bus } from "../../hidden/bus.class";

export class Deer extends Pet {
    name = "Deer";
    tier = 4;
    pack: Pack = 'Turtle';
    attack = 1;
    health = 1;
    faint(gameApi, tiger) {
        let bus = new Bus(this.logService, this.abilityService, this.parent, null, null, this.minExpForLevel, new Chili(this.logService));
        this.abilityService.setSpawnEvent({
            callback: () => {
        
                this.logService.createLog(
                    {
                        message: `${this.name} spawned Bus level ${this.level}`,
                        type: "ability",
                        player: this.parent,
                        tiger: tiger
                    }
                )

                if (this.parent.spawnPet(bus, this.savedPosition)) {
                    this.abilityService.triggerSummonedEvents(bus);
                }
            },
            priority: this.attack
        })

        super.superFaint(gameApi, tiger);
    }
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