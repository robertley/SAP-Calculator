import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Peanut } from "../../../equipment/turtle/peanut.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Scorpion extends Pet {
    name = "Scorpion";
    tier = 5;
    pack: Pack = 'Turtle';
    attack = 1;
    health = 1;
    summoned(gameApi: GameAPI, tiger?: boolean): void {
        this.equipment = new Peanut();
        this.logService.createLog({
            message: `${this.name} gained the Peanut perk.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        this.superSummoned(gameApi, tiger);
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