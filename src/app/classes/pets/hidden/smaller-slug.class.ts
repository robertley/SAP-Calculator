import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment } from "../../equipment.class";
import { Pack, Pet } from "../../pet.class";
import { Player } from "../../player.class";
import { SmallestSlug } from "./smallest-slug.class";

export class SmallerSlug extends Pet {
    name = "Smaller Slug";
    tier = 1;
    pack: Pack = 'Golden';
    hidden: boolean = true;
    health = 2;
    attack = 2;
    afterFaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let slug = new SmallestSlug(this.logService, this.abilityService, this.parent, null, null, 0, this.minExpForLevel);

        let summonResult = this.parent.summonPet(slug, this.savedPosition, false, this);
        if (summonResult.success) {
            this.logService.createLog(
                {
                    message: `${this.name} spawned Smallest Slug Level ${this.level}`,
                    type: "ability",
                    player: this.parent,
                    tiger: tiger,
                    pteranodon: pteranodon,
                    randomEvent: summonResult.randomEvent
                }
            )

            this.abilityService.triggerFriendSummonedEvents(slug);
        }

        super.superFaint(gameApi, tiger);
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