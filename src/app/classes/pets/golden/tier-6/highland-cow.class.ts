import { cloneDeep, shuffle } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Coconut } from "../../../equipment/turtle/coconut.class";

export class HighlandCow extends Pet {
    name = "Highland Cow";
    tier = 6;
    pack: Pack = 'Golden';
    attack = 4;
    health = 12;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let trumpetAmt = Math.floor(this.health / 3 * this.level);
        this.parent.gainTrumpets(trumpetAmt, this);
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