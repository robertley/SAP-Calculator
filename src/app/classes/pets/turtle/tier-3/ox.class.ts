import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Melon } from "../../../equipment/turtle/melon.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Ox extends Pet {
    name = "Ox";
    tier = 3;
    pack: Pack = 'Turtle';
    health = 3;
    attack = 1;
    friendAheadFaints(gameApi, tiger) {
        this.increaseAttack(this.level);
        this.equipment = new Melon();
        this.logService.createLog({
            message: `${this.name} gained Melon and ${this.level} attack`,
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
        this.initPet(exp, health, attack, equipment);
    }
}