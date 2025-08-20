import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Eel extends Pet {
    name = "Eel";
    tier = 4;
    pack: Pack = 'Custom';
    attack = 4;
    health = 2;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let power = .5 * this.level;
        this.health = Math.min(50, Math.floor(this.health * (1 + power)));
        this.logService.createLog({
            message: `${this.name} has gained ${power * 100}% health. (${this.health})`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
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