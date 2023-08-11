import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Ant } from "../../turtle/tier-1/ant.class";

export class Anteater extends Pet {
    name = "Anteater";
    tier = 4;
    pack: Pack = 'Star';
    attack = 3;
    health = 2;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        for (let i = 0; i < 2; i++) {
            this.abilityService.setSpawnEvent({
                callback: () => {
                    let ant = new Ant(this.logService, this.abilityService, this.parent, null, null, this.minExpForLevel);
            
                    this.logService.createLog(
                        {
                            message: `${this.name} spawned Ant Level ${this.level}`,
                            type: "ability",
                            player: this.parent,
                            tiger: tiger,
                            pteranodon: pteranodon
                        }
                    )
    
                    if (this.parent.summonPet(ant, this.savedPosition)) {
                        this.abilityService.triggerSummonedEvents(ant);
                    }
                },
                priority: this.attack
            })
        }

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
        this.initPet(exp, health, attack, equipment);
    }
}