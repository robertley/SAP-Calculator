import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Pug extends Pet {
    name = "Pug";
    tier = 3;
    pack: Pack = 'Star';
    attack = 5;
    health = 2;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        if (this.petAhead == null) {
            return;
        }
        let power = this.level;
        this.logService.createLog(
            {
                message: `${this.name} gave ${this.petAhead.name} ${power} exp.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            }
        )
        this.petAhead.increaseExp(power);
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