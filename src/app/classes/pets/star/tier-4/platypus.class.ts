import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Beaver } from "../../turtle/tier-1/beaver.class";
import { Duck } from "../../turtle/tier-1/duck.class";

export class Platypus extends Pet {
    name = "Platypus";
    tier = 4;
    pack: Pack = 'Star';
    attack = 2;
    health = 2;
    afterFaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let attackPower = 3 * this.level;
        let healthPower = 2 * this.level;
        
        let duck = new Duck(this.logService, this.abilityService, this.parent, healthPower, attackPower, 0, this.minExpForLevel);
        let beaver = new Beaver(this.logService, this.abilityService, this.parent, healthPower, attackPower, 0, this.minExpForLevel);
        this.logService.createLog(
            {
                message: `${this.name} spawned ${attackPower}/${healthPower} Duck level ${this.level}`,
                type: "ability",
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon
            }
        )

        if (this.parent.summonPet(duck, this.savedPosition)) {
            this.abilityService.triggerFriendSummonedEvents(duck);
        }

        this.logService.createLog(
            {
                message: `${this.name} spawned ${attackPower}/${healthPower} Beaver level ${this.level}`,
                type: "ability",
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon
            }
        )

        if (this.parent.summonPet(beaver, this.savedPosition)) {
            this.abilityService.triggerFriendSummonedEvents(beaver);
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