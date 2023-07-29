import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Melon } from "../../../equipment/melon.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Ox extends Pet {
    name = "Ox";
    tier = 3;
    pack: Pack = 'Turtle';
    health = 3;
    attack = 1;
    friendAheadFaints = (gameApi, tiger) => {
        this.increaseAttack(this.level);
        this.equipment = new Melon();
        this.logService.createLog({
            message: `Ox gained Melon and ${this.level} attack`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        super.superFriendAheadFaints(gameApi, tiger);
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