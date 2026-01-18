import { cloneDeep, shuffle } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { EmuAbility } from "../../../abilities/pets/golden/tier-5/emu-ability.class";

export class Emu extends Pet {
    name = "Emu";
    tier = 5;
    pack: Pack = 'Golden';
    attack = 3;
    health = 4;
    initAbilities(): void {
        this.addAbility(new EmuAbility(this, this.logService));
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