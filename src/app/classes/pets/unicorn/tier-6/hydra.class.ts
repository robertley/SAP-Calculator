import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Head } from "../../hidden/head.class";

export class Hydra extends Pet {
    name = "Hydra";
    tier = 6;
    pack: Pack = 'Unicorn';
    attack = 10;
    health = 6;
    afterFaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let amt = Math.floor(this.attack / 10);
        for (let i = 0; i < amt; i++) {
            let power = this.level * 5;
            let head = new Head(this.logService, this.abilityService, this.parent, power, power);
    
            let summonResult = this.parent.summonPet(head, this.savedPosition, false, this);
            if (summonResult.success) {
                this.logService.createLog(
                    {
                        message: `${this.name} spawned Head (${head.attack}/${head.health}).`,
                        type: "ability",
                        player: this.parent,
                        tiger: tiger,
                        pteranodon: pteranodon,
                        randomEvent: summonResult.randomEvent
                    }
                )

                this.abilityService.triggerFriendSummonedEvents(head);
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