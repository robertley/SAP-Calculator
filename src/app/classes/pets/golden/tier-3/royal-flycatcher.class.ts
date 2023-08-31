import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class RoyalFlycatcher extends Pet {
    name = "Royal Flycatcher";
    tier = 3;
    pack: Pack = 'Golden';
    attack = 2;
    health = 4;
    enemySummoned(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        let target = this.parent.opponent.getRandomPet();
        let power = this.level * 3;
        if (target == null) {
            return;
        }
        this.snipePet(target, power, true, tiger);
        this.superEnemySummoned(gameApi, pet, tiger);
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