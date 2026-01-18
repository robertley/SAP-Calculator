import { cloneDeep, shuffle } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { BlueRingedOctopusAbility } from "../../../abilities/pets/golden/tier-5/blue-ringed-octopus-ability.class";

export class BlueRingedOctopus extends Pet {
    name = "Blue Ringed Octopus";
    tier = 5;
    pack: Pack = 'Golden';
    attack = 2;
    health = 4;
    initAbilities(): void {
        this.addAbility(new BlueRingedOctopusAbility(this, this.logService, this.abilityService));
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