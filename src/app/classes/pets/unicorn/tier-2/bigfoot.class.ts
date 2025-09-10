import { GameAPI } from "app/interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Bigfoot extends Pet {
    name = "Bigfoot";
    tier = 2;
    pack: Pack = 'Unicorn';
    attack = 2;
    health = 3;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        return
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