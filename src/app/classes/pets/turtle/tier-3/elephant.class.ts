import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
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
            let targetsBehindResp = this.parent.nearestPetsBehind(1, this);
            if (targetsBehindResp.pets.length > 0) {
                let target = targetsBehindResp.pets[0];
                this.snipePet(target, 1, targetsBehindResp.random, tiger);
            }
        }
        super.superAfterAttack(gameApi, tiger);
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