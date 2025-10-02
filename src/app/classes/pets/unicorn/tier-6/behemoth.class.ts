import { BehemothAbility } from "app/classes/abilities/pets/unicorn/tier-6/behemoth-ability.class";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Behemoth extends Pet {
    name = "Behemoth";
    tier = 6;
    pack: Pack = 'Unicorn';
    attack = 12;
    health = 12;

    initAbilities(): void {
        this.addAbility(new BehemothAbility(this, this.logService, this.abilityService))
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