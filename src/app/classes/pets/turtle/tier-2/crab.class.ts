import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
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
        let copyAmmt = .5 * this.level;
        let crabHealth = Math.floor(highestHealthPet.health * copyAmmt);
        this.health = crabHealth;
        this.logService.createLog({
            message: `${this.name} copied ${copyAmmt * 100}% of ${highestHealthPet.name}'s health (${crabHealth})`,
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
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, equipment);
    }
}