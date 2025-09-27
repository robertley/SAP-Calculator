
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Rambutan } from "../../../equipment/unicorn/rambutan.class";
import { FurBearingTroutAbility } from "../../../abilities/pets/unicorn/tier-3/fur-bearing-trout-ability.class";

export class FurBearingTrout extends Pet {
    name = "Fur-Bearing Trout";
    tier = 3;
    pack: Pack = 'Unicorn';
    attack = 3;
    health = 5;
    initAbilities(): void {
        this.addAbility(new FurBearingTroutAbility(this, this.logService));
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