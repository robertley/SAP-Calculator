import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Kraken extends Pet {
    name = "Kraken";
    tier = 4;
    pack: Pack = 'Unicorn';
    attack = 4;
    health = 7;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {

        let targets = [ ...this.parent.petArray, ...this.parent.opponent.petArray ];
        targets = targets.filter(pet => pet.alive && pet !== this); 
        for (let targetPet of targets) {
            // multiplying has a weird bug with 0.33 * 2 = 0.6600000000000001 type ish
            let power = this.level == 1 ? .15 : this.level == 2 ? .3 : .45;
            let reducedTo =  Math.max(1, Math.floor(targetPet.health * (1 - power)));
            targetPet.health = reducedTo;
            this.logService.createLog({
                message: `${this.name} reduced ${targetPet.name} health by ${(power * 100).toFixed(0)}% (${reducedTo})`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            });
    
        }

        this.superStartOfBattle(gameApi, tiger);
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