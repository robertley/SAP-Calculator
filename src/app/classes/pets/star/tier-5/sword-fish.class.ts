import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class SwordFish extends Pet {
    name = "Sword Fish";
    tier = 5;
    pack: Pack = 'Star';
    attack = 5;
    health = 5;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let opponent = this.parent.opponent;
        let highestHealthPetResp = opponent.getHighestHealthPet();
        let target = highestHealthPetResp.pet;
        let power = this.attack * this.level;
        if (target != null) {
            this.snipePet(target, power, highestHealthPetResp.random, tiger);
        }
        this.snipePet(this, power, false, tiger);
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