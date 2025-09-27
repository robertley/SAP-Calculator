import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { ConeSnailAbility } from "../../../abilities/pets/golden/tier-1/cone-snail-ability.class";

export class ConeSnail extends Pet {
    name = "Cone Snail";
    tier = 1;
    pack: Pack = 'Golden';
    attack = 1;
    health = 2;
    initAbilities(): void {
        this.addAbility(new ConeSnailAbility(this, this.logService));
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