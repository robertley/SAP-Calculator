import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Camel extends Pet {
    name = "Camel";
    tier = 3;
    pack: Pack = 'Turtle';
    health = 4;
    attack = 3;
    hurt(gameApi, tiger) {
        let boostPet = this.petBehind();
        if (boostPet == null) {
            return;
        }
        let boostAmt = this.level * 2;
        if (boostPet) {
            boostPet.increaseAttack(this.level);
            boostPet.increaseHealth(boostAmt);
        }
        this.logService.createLog({
            message: `${this.name} gave ${boostPet.name} ${boostAmt} attack and ${boostAmt} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })

        super.superHurt(gameApi, tiger);
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