import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Groundhog } from "../tier-1/groundhog.class";

export class Osprey extends Pet {
    name = "Osprey";
    tier = 3;
    pack: Pack = 'Golden';
    attack = 3;
    health = 3;
    faint(gameApi?: GameAPI, tiger?: boolean): void {
        for (let i = 0; i < this.level; i++) {
            this.abilityService.setSpawnEvent({
                callback: () => {
                    let groundhog = new Groundhog(this.logService, this.abilityService, this.parent, null, null, 0);
            
                    this.logService.createLog(
                        {
                            message: `${this.name} summoned a 2/1 Groundhog`,
                            type: "ability",
                            player: this.parent,
                            tiger: tiger
                        }
                    )

                    if (this.parent.summonPet(groundhog, this.savedPosition)) {
                        this.abilityService.triggerSummonedEvents(groundhog);
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