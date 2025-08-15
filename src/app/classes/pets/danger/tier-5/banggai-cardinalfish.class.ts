import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class BanggaiCardinalfish extends Pet {
    name = "Banggai Cardinalfish";
    tier = 5;
    pack: Pack = 'Danger';
    attack = 4;
    health = 5;

    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let attackReduction = this.level * 6; // 6/12/18 based on level
        let minimumAttack = 5;
        
        let targets = [...this.parent.petArray, ...this.parent.opponent.petArray];
        targets = targets.filter(pet => pet.alive && pet !== this);
        for (let targetPet of targets) {
            let newAttack = Math.max(targetPet.attack - attackReduction, minimumAttack);
            
            targetPet.attack = newAttack;
            this.logService.createLog({
                message: `${this.name} reduced ${targetPet.name} attack by ${attackReduction} to (${newAttack}).`,
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