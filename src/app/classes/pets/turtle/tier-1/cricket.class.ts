import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { ZombieCricket } from "./../../hidden/zombie-cricket.class";

export class Cricket extends Pet {
    name = "Cricket";
    tier = 1;
    pack: Pack = 'Turtle';
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
        this.abilityService.setSpawnEvent({
            callback: () => {
                let zombie = new ZombieCricket(this.logService, this.abilityService, this.parent, null, null, exp);
        
                this.logService.createLog(
                    {
                        message: `Cricket Spawned Zombie Cricket Level ${level}`,
                        type: "ability",
                        player: this.parent
                    }
                )

                if (this.parent.spawnPet(zombie, this.savedPosition)) {
                    this.abilityService.triggerSummonedEvents(zombie);
                }
            },
            priority: this.attack
        })
        
    };
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