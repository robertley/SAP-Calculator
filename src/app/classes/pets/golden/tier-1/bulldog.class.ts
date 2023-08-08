import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Bulldog extends Pet {
    name = "Bulldog";
    tier = 1;
    pack: Pack = 'Golden';
    attack = 1;
    health = 3;
    afterAttack(gameApi: GameAPI, tiger?: boolean): void {
        if (!this.alive) {
            return;
        }
        this.attack = Math.min(50, this.health + this.level);
        this.logService.createLog({
            message: `${this.name} attack is set to ${this.attack}.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        this.superAfterAttack(gameApi, tiger);
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