import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Tuna extends Pet {
    name = "Tuna";
    tier = 3;
    pack: Pack = 'Star';
    attack = 3;
    health = 5;
    hurtCount = 0;
    
    hurt(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        this.hurtCount++;
        this.superHurt(gameApi, pet, tiger);
    }
    
    afterFaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        if (this.hurtCount > 0) {
            let attackBonus = this.level * this.hurtCount;
            let healthBonus = this.level * this.hurtCount;
            
            let validTargets = this.parent.petArray.filter(pet => pet.alive && pet !== this);
            if (validTargets.length > 0) {
                let target = validTargets[Math.floor(Math.random() * validTargets.length)];
                target.increaseAttack(attackBonus);
                target.increaseHealth(healthBonus);
                
                this.logService.createLog(
                    {
                        message: `${this.name} gave ${target.name} +${attackBonus}/+${healthBonus} (hurt ${this.hurtCount} time${this.hurtCount > 1 ? 's' : ''})`,
                        type: "ability",
                        player: this.parent,
                        tiger: tiger,
                        pteranodon: pteranodon
                    }
                );
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