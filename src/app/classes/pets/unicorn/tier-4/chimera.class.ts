import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { ChimeraGoat } from "../../hidden/chimera-goat.class";
import { ChimeraAbility } from "../../../abilities/pets/unicorn/tier-4/chimera-ability.class";

export class Chimera extends Pet {
    name = "Chimera";
    tier = 4;
    pack: Pack = 'Unicorn';
    attack = 2;
    health = 6;
    initAbilities(): void {
        this.addAbility(new ChimeraAbility(this, this.logService, this.abilityService));
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
