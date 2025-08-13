import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment } from "../../equipment.class";
import { Pack, Pet } from "../../pet.class";
import { Player } from "../../player.class";

export class FairyBall extends Pet {
    name = "Fairy Ball";
    tier = 1;
    pack: Pack = 'Star';
    attack = 2;
    health = 6;
    hidden = true;


    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        // The equipment from the Fairy Armadillo is passed in here.
        this.initPet(exp, health, attack, mana, equipment);
    }
}