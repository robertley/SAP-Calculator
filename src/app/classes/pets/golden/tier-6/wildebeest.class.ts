import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { WildebeestAbility } from "../../../abilities/pets/golden/tier-6/wildebeest-ability.class";

export class Wildebeest extends Pet {
    name = "Wildebeest";
    tier = 6;
    pack: Pack = 'Golden';
    attack = 8;
    health = 6;
    initAbilities(): void {
        this.addAbility(new WildebeestAbility(this, this.logService));
        super.initAbilities();
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