import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Toasty } from "../../../equipment/ailments/toasty.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class VolcanoSnail extends Pet {
    name = "Volcano Snail";
    tier = 1;
    pack: Pack = 'Danger';
    attack = 1;
    health = 4;

    faint(gameApi?: GameAPI, tiger?: boolean): void {
        let excludePet = [...this.parent.opponent.petArray].filter((pet) => pet.equipment != null);
        let targetResp = this.parent.opponent.getRandomPets(3, excludePet, null, null, this );
        
        if (targetResp.pets.length === 0) {
            return;
        }

        for (let target of targetResp.pets) {
            let toasty = new Toasty();
            target.givePetEquipment(toasty);
            
            this.logService.createLog({
                message: `${this.name} made ${target.name} Toasty`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: targetResp.random
            });
        }
        
        this.superFaint(gameApi, tiger);
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