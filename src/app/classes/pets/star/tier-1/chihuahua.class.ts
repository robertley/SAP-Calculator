import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { ChihuahuaAbility } from "../../../abilities/pets/star/tier-1/chihuahua-ability.class";

export class Chihuahua extends Pet {
    name = "Chihuahua";
    tier = 1;
    pack: Pack = 'Star';
    attack = 4;
    health = 1;

    initAbilities(): void {
        this.addAbility(new ChihuahuaAbility(this, this.logService));
        super.initAbilities();
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment, triggersConsumed?: number) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
    }
}