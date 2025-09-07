import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Roc extends Pet {
    name = "Roc";
    tier = 4;
    pack: Pack = 'Unicorn';
    attack = 4;
    health = 4;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let petsAhead = this.getPetsAhead(5);
        if (petsAhead.length == 0) {
            return;
        }

        let excludePets = this.parent.petArray.filter(pet => pet == this || !petsAhead.includes(pet));
        //TO DO: Make it spread evenly
        for (let i = 0; i < this.level * 3; i++) {
            let targetResp = this.parent.getRandomPet(excludePets, true, false, false, this);
            if (targetResp.pet == null) {
                break;
            }
            this.logService.createLog({
                message: `${this.name} gave ${targetResp.pet.name} 2 mana.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: targetResp.random
            })

            targetResp.pet.increaseMana(2);
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