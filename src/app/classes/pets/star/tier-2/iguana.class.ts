import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Iguana extends Pet {
    name = "Iguana";
    tier = 2;
    pack: Pack = 'Star';
    attack = 2;
    health = 4;
    enemyPushed(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        let targetResp = this.parent.getSpecificPet(this, pet);
        let target = targetResp.pet;
        if (target == null || !target.alive) {
            return;
        }
        let power = this.level * 2;
        this.snipePet(target, power, targetResp.random, tiger);

        this.superEnemyPushed(gameApi, pet, tiger);
    }
    enemySummoned(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        let targetResp = this.parent.getSpecificPet(this, pet);
        let target = targetResp.pet;
        if (target == null || !target.alive) {
            return;
        }
        let power = this.level * 2;
        this.snipePet(target, power, targetResp.random, tiger);
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