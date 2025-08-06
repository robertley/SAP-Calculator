import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Stonefish extends Pet {
    name = "Stonefish";
    tier = 5;
    pack: Pack = 'Puppy';
    attack = 7;
    health = 4;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let opponent = getOpponent(gameApi, this.parent);
        if (opponent.pet0 == null || !opponent.pet0.alive) {
            return;
        }
        this.snipePet(opponent.pet0, this.attack * this.level, false, tiger, pteranodon);
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