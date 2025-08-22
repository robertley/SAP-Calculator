import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Crab extends Pet {
    name = "Crab";
    tier = 2;
    pack: Pack = 'Turtle';
    health = 1;
    attack = 4;
    startOfBattle(gameApi: GameAPI, tiger) {
        if (!this.alive) {
            return;
        }
        let highestHealthPet = this.parent.getHighestHealthPet(this).pet;
        let gainAmmt = Math.floor(highestHealthPet.health * (.25 * this.level));
        this.increaseHealth(gainAmmt);
        this.logService.createLog({
            message: `${this.name} gained ${.25 * this.level * 100}% of ${highestHealthPet.name}'s health (${gainAmmt})`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        }),
        
        super.superStartOfBattle(gameApi, tiger);
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