import { cloneDeep } from "lodash";
import { GameAPI } from "../../interfaces/gameAPI.interface";
import { FaintService } from "../../services/faint.service";
import { LogService } from "../../services/log.servicee";
import { SummonedService } from "../../services/summoned.service";
import { Pet } from "../pet.class";
import { Player } from "../player.class";
import { Equipment } from "../equipment.class";

export class Mosquito extends Pet {
    name = "Mosquito"
    health = 2;
    attack = 2;
    startOfBattle = (gameApi: GameAPI) => {
        let opponent: Player;
        if (gameApi.player == this.parent) {
            opponent = gameApi.opponet;
        } else {
            opponent = gameApi.player;
        }

        for (let i = 0; i < this.level; i++) {
            let attackPet = opponent.getRandomPet();
            this.snipePet(attackPet, 1, true)
        }
    }
    constructor(protected logService: LogService,
        protected faintService: FaintService,
        protected summonedService: SummonedService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, faintService, summonedService, parent);
        this.health = health ?? this.health;
        this.attack = attack ?? this.attack;
        this.exp = exp ?? this.exp;
        this.originalHealth = this.health;
        this.originalAttack = this.attack;
        this.equipment = equipment;
    }
}