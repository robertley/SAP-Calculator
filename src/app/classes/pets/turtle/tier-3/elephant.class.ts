import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Elephant extends Pet {
    name = "Elephant";
    tier = 3;
    pack: Pack = 'Turtle';
    health = 7;
    attack = 3;
    afterAttack(gameApi, tiger) {
        for (let i = 0; i < this.level; i++) {
            if (this.petBehind())
                this.snipePet(this.petBehind(), 1, false, tiger);
        }
        super.superAfterAttack(gameApi, tiger);
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