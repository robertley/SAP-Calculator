import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Mandrill extends Pet {
    name = "Mandrill";
    tier = 2;
    pack: Pack = 'Puppy';
    attack = 3;
    health = 4;
    faint(gameApi?: GameAPI, tiger?: boolean): void {
        let toyLevelMax = this.level * 2;
        if (this.parent.toy?.tier <= toyLevelMax) {
            this.parent.breakToy();
        }
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