import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { MacaqueAbility } from "../../../abilities/pets/golden/tier-5/macaque-ability.class";

export class Macaque extends Pet {
    name = "Macaque";
    tier = 5;
    pack: Pack = 'Golden';
    attack = 2;
    health = 2;
    initAbilities(): void {
        this.addAbility(new MacaqueAbility(this, this.logService, this.abilityService));
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