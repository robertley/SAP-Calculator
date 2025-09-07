import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Camel extends Pet {
    name = "Camel";
    tier = 3;
    pack: Pack = 'Turtle';
    health = 3;
    attack = 3;
    hurt(gameApi, pet, tiger) {
        let targetsBehindResp = this.parent.nearestPetsBehind(1, this);
        if (targetsBehindResp.pets.length === 0) {
            return;
        }
        let boostPet = targetsBehindResp.pets[0];
        let boostAmt = this.level * 2;
        boostPet.increaseAttack(this.level);
        boostPet.increaseHealth(boostAmt);
        this.logService.createLog({
            message: `${this.name} gave ${boostPet.name} ${this.level} attack and ${boostAmt} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: targetsBehindResp.random
        });

        super.superHurt(gameApi, pet, tiger);
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