import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
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
        let targetResp = this.parent.opponent.getRandomPet([], false, true, false, this);
        let power = this.level * 3;
        if (targetResp.pet == null) {
            return;
        }
        this.snipePet(targetResp.pet, power, targetResp.random, tiger);
        this.superEnemySummoned(gameApi, pet, tiger);
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