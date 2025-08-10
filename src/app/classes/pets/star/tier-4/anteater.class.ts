import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Ant } from "../../turtle/tier-1/ant.class";

export class Anteater extends Pet {
    name = "Anteater";
    tier = 3;
    pack: Pack = 'Star';
    attack = 3;
    health = 2;
    afterFaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        for (let i = 0; i < this.level; i++) {
            this.abilityService.setSpawnEvent({
                callback: () => {
                    let ant = new Ant(this.logService, this.abilityService, this.parent, 1, 1, 0, 5);
            
                    this.logService.createLog(
                        {
                            message: `${this.name} spawned 1/1 Ant level 3`,
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

        super.superAfterFaint(gameApi, tiger, pteranodon);
    }
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