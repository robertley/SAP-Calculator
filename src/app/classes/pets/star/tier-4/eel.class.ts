import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Eel extends Pet {
    name = "Eel";
    tier = 3;
    pack: Pack = 'Star';
    attack = 3;
    health = 4;
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
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, equipment);
    }
}