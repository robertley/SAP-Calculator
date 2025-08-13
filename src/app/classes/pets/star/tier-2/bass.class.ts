import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Bass extends Pet {
    name = "Bass";
    tier = 2;
    pack: Pack = 'Star';
    attack = 3;
    health = 3;
    afterFaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let expToGive = this.level;
        let validTargets = this.parent.petArray.filter(pet => pet.alive && pet.level == 2);
        
        if (validTargets.length > 0) {
            let target = validTargets[Math.floor(Math.random() * validTargets.length)];
            target.increaseExp(expToGive);
            
            this.logService.createLog(
                {
                    message: `${this.name} gave ${target.name} +${expToGive} experience`,
                    type: "ability",
                    player: this.parent,
                    tiger: tiger,
                    pteranodon: pteranodon
                }
            );
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