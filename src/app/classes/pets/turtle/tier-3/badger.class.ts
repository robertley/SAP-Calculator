import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Badger extends Pet {
    name = "Badger";
    tier = 3;
    pack: Pack = 'Turtle';
    health = 3;
    attack = 6;
    faint = (gameApi, tiger) => {
        let opponent: Player;
        if (gameApi.player == this.parent) {
            opponent = gameApi.opponet;
        } else {
            opponent = gameApi.player;
        }

        let attackAmt = this.attack * (this.level * .5);
        if (this.petBehind) {
            this.snipePet(this.petBehind, attackAmt, false, tiger);
        }
        let snipeAhead;
        if (this.petAhead) {
            snipeAhead = this.petAhead;
        } else {
            snipeAhead = opponent.furthestUpPet;
        }

        if (snipeAhead != null) {
            this.snipePet(snipeAhead, attackAmt, false, tiger);
        }

        super.superFaint(gameApi, tiger);
        this.done = true;
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