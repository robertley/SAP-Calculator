import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { SilkmothAbility } from "../../../abilities/pets/golden/tier-1/silkmoth-ability.class";

export class Silkmoth extends Pet {
    name = "Silkmoth";
    tier = 1;
    pack: Pack = 'Golden';
    attack = 3;
    health = 1;
    initAbilities(): void {
        this.addAbility(new SilkmothAbility(this, this.logService));
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