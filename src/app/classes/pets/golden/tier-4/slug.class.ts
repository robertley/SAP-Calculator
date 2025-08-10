import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { SmallerSlug } from "../../hidden/smaller-slug.class";

export class Slug extends Pet {
    name = "Slug";
    tier = 4;
    pack: Pack = 'Golden';
    attack = 4;
    health = 4;
    afterFaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        this.abilityService.setSpawnEvent({
            callback: () => {
                let slug = new SmallerSlug(this.logService, this.abilityService, this.parent, null, null, 0, this.minExpForLevel);
        
                this.logService.createLog(
                    {
                        message: `${this.name} spawned Smaller Slug Level ${this.level}`,
                        type: "ability",
                        player: this.parent,
                        tiger: tiger,
                        pteranodon: pteranodon
                    }
                )

                if (this.parent.summonPet(slug, this.savedPosition)) {
                    this.abilityService.triggerSummonedEvents(slug);
                }
            },
            priority: this.attack
        })

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