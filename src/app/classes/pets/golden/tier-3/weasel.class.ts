import { clone, shuffle } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Weak } from "../../../equipment/ailments/weak.class";

export class Weasel extends Pet {
    name = "Weasel";
    tier = 3;
    pack: Pack = 'Golden';
    attack = 3;
    health = 4;
    faint(gameApi: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        this.logService.createLog({
            message: `${this.name} gained ${this.level} Gold.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            pteranodon: pteranodon
        })
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