import { getOpponent } from "app/util/helper-functions";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Blowfish extends Pet {
    name = "Blowfish";
    tier = 4;
    pack: Pack = 'Turtle';
    attack = 3;
    health = 6;
    hurt(gameApi, pet, tiger) {
        let power = this.level * 3;
        let targetPet = getOpponent(gameApi, this.parent).getRandomPet(null, null, true);
        if (targetPet)
            this.snipePet(targetPet, power, true, tiger);
        
        this.superHurt(gameApi, tiger)
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