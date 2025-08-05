import { cloneDeep } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Orangutang } from "../../star/tier-4/orangutang.class";

export class SilverFox extends Pet {
    name = "Silver Fox";
    tier = 5;
    pack: Pack = 'Golden';
    attack = 3;
    health = 6;
    beforeAttack(gameApi: GameAPI, tiger?: boolean): void {
        this.logService.createLog({
            message: `${this.name} gained ${this.level} Gold.`,
            type: "ability",
            player: this.parent,
            tiger: tiger
        })
        this.superBeforeAttack(gameApi, tiger);
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