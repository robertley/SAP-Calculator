import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Kiwi extends Pet {
    name = "Kiwi";
    tier = 1;
    pack: Pack = 'Star';
    attack = 2;
    health = 2;
    hurt(gameApi?: GameAPI, pet?: Pet, tiger?: boolean): void {
        let excludePets = this.parent.petArray
            .filter(pet => pet.equipment?.name != 'Strawberry' || pet == this);
        
        // Get the backmost (last position) Strawberry pet
        let targetResp = this.parent.getLastPet(excludePets, this);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }
        let attackBoost = this.level;
        target.increaseAttack(attackBoost);
        
        this.logService.createLog({
            message: `${this.name} gave ${target.name} +${attackBoost} attack`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });
        
        
        this.superHurt(gameApi, pet, tiger);
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