import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Jellyfish extends Pet {
    name = "Jellyfish";
    tier = 2;
    pack: Pack = 'Star';
    attack = 2;
    health = 3;
    anyoneLevelUp(gameApi: GameAPI, tiger?: boolean): void {
        let power = this.level;
        this.increaseAttack(power);
        this.increaseHealth(power);
        this.logService.createLog({
            message: `${this.name} increased attack by ${power} and health by ${power}`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        this.superAnyoneLevelUp(gameApi, tiger);
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