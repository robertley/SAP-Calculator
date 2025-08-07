import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

// TODO investigate tiger interaction
export class SeaSerpent extends Pet {
    name = "Sea Serpent";
    tier = 6;
    pack: Pack = 'Unicorn';
    attack = 6;
    health = 6;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        if (this.mana == 0) {
            return;
        }

        let opponentPets = this.parent.opponent.petArray;
        opponentPets = opponentPets.filter(pet => pet.alive);
        opponentPets.sort((a, b) => b.health - a.health);

        const numTargets = this.level + 1;
        let power = this.mana;
        let mana = this.mana;
        this.logService.createLog({
            message: `${this.name} spent ${mana} mana.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            pteranodon: pteranodon
        })

        this.mana = 0;        

        for (let i = 0; i < numTargets; i++) {
            let target = opponentPets[i];
            if (target == null) {
                break;
            }

            this.snipePet(target, power, false, tiger, pteranodon);
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