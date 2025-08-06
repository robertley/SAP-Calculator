import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Dodo extends Pet {
    name = "Dodo";
    tier = 3;
    pack: Pack = 'Turtle';
    health = 2;
    attack = 4;
    startOfBattle(gameApi, tiger) {
        let boostPet = this.petAhead;
        if (boostPet == null) {
            return;
        }
        let boostAmt = Math.floor(this.attack * (this.level * .5));
        boostPet.increaseAttack(boostAmt);
        this.logService.createLog({
            message: `${this.name} gave ${boostPet.name} ${boostAmt} attack.`,
            player: this.parent,
            type: 'ability',
            tiger: tiger
        })
        
        super.superStartOfBattle(gameApi, tiger);

        return true;
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