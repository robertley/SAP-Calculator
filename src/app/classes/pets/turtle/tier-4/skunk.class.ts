import { getOpponent } from "app/util/helper-functions";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Skunk extends Pet {
    name = "Skunk";
    tier = 4;
    pack: Pack = 'Turtle';
    attack = 3;
    health = 5;
    startOfBattle(gameApi, tiger) {
        let opponent = getOpponent(gameApi, this);
        let targetPet = opponent.getHighestHealthPet();
        let power = .33 * this.level;
        let reducedTo =  Math.ceil(targetPet.health * (1 - power));
        targetPet.health = reducedTo;
        this.logService.createLog({
            message: `${this.name} reduced ${targetPet.name} health by ${power * 100}% (${reducedTo})`,
            type: 'ability',
            player: this.parent,
            tiger
        });

        this.superStartOfBattle(gameApi, tiger);
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.health = health ?? this.health;
        this.attack = attack ?? this.attack;
        this.exp = exp ?? this.exp;
        this.originalHealth = this.health;
        this.originalAttack = this.attack;
        this.equipment = equipment;
        this.originalEquipment = equipment;
    }
}