import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { PiedTamarinAbility } from "../../../abilities/pets/golden/tier-1/pied-tamarin-ability.class";

export class PiedTamarin extends Pet {
    name = "Pied Tamarin";
    tier = 1;
    pack: Pack = 'Golden';
    attack = 2;
    health = 2;
    initAbilities(): void {
        this.addAbility(new PiedTamarinAbility(this, this.logService));
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