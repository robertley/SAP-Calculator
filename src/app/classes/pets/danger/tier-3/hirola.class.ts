import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { EthiopianWolf } from "../tier-1/ethiopian-wolf.class";

export class Hirola extends Pet {
    name = "Hirola";
    tier = 3;
    pack: Pack = 'Danger';
    attack = 2;
    health = 2;

    afterFaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        for (let i = 0; i < this.level; i++) {
            let wolf = new EthiopianWolf(this.logService, this.abilityService, this.parent, 3, 4, this.mana, this.exp);
            
            let summonResult = this.parent.summonPet(wolf, this.savedPosition, false, this);
            if (summonResult.success) {
                this.logService.createLog({
                    message: `${this.name} summoned a ${4}/${3} ${wolf.name}.`,
                    type: 'ability',
                    player: this.parent,
                    tiger: tiger,
                    pteranodon: pteranodon,
                    randomEvent: summonResult.randomEvent
                });
                
                this.abilityService.triggerFriendSummonedEvents(wolf);
            }
        }
        
        this.superAfterFaint(gameApi, tiger, pteranodon);
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