import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Cobra extends Pet {
    name = "Cobra";
    tier = 6;
    pack: Pack = 'Golden';
    attack = 12;
    health = 6;
    friendAheadAttacks(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        let target = this.parent.opponent.getRandomPet(null, null, true);
        if (target == null) {
            return;
        }
        let power = Math.floor(this.attack * .2 * this.level);
        this.snipePet(target, power, true, tiger);
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