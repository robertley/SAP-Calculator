import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { ZombieCricket } from "./../../hidden/zombie-cricket.class";

export class Cricket extends Pet {
    name = "Cricket";
    tier = 1;
    pack: Pack = 'Turtle';
    health = 3;
    attack = 1;
    faint(gameApi, tiger, pteranodon?: boolean) {
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
                let zombie = new ZombieCricket(this.logService, this.abilityService, this.parent, null, null, null, exp);
        
                this.logService.createLog(
                    {
                        message: `${this.name} spawned Zombie Cricket Level ${level}`,
                        type: "ability",
                        player: this.parent,
                        tiger: tiger,
                        pteranodon: pteranodon
                    }
                )

                if (this.parent.summonPet(zombie, this.savedPosition)) {
                    this.abilityService.triggerSummonedEvents(zombie);
                }
            },
            priority: this.attack
        })

        super.superFaint(gameApi, tiger);
        
    };
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