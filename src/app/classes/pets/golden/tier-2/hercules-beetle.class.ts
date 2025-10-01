import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { HerculesBeetleAbility } from "../../../abilities/pets/golden/tier-2/hercules-beetle-ability.class";

export class HerculesBeetle extends Pet {
    name = "Hercules Beetle";
    tier = 2;
    pack: Pack = 'Golden';
    attack = 3;
    health = 4;
    initAbilities(): void {
        this.addAbility(new HerculesBeetleAbility(this, this.logService, this.abilityService));
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