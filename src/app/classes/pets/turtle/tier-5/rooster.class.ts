import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Bus } from "../../hidden/bus.class";
import { Chick } from "../../hidden/chick.class";

export class Rooster extends Pet {
    name = "Rooster";
    tier = 5;
    pack: Pack = 'Turtle';
    attack = 6;
    health = 4;
    afterFaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let attack = Math.max(Math.floor(this.attack * .5), 1);
        for (let i = 0; i < this.level; i++) {
            let chick = new Chick(this.logService, this.abilityService, this.parent, 1, attack, 0, this.minExpForLevel);
            
            let summonResult = this.parent.summonPet(chick, this.savedPosition, false, this);
            
            if (summonResult.success) {
                this.logService.createLog({
                    message: `${this.name} spawned Chick (${attack}).`,
                    type: 'ability',
                    player: this.parent,
                    tiger: tiger,
                    pteranodon: pteranodon,
                    randomEvent: summonResult.randomEvent
                })
                
                this.abilityService.triggerFriendSummonedEvents(chick);
            }
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