import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Ogopogo extends Pet {
    name = "Ogopogo";
    tier = 2;
    pack: Pack = 'Unicorn';
    attack = 3;
    health = 1;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        const potentialTargets = this.parent.petArray.filter(pet => pet !== this);
        const numberOfTargets = this.level;
        const targets = potentialTargets.slice(0, numberOfTargets);
        
        if (targets.length === 0) {
            this.superStartOfBattle(gameApi, tiger);
            return;
        }

        for (const target of targets) {
            this.logService.createLog({
                message: `${this.name} gave ${target.name} +1 experience.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            });
    
            target.increaseExp(1);
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