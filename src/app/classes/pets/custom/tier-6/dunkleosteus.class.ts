import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../../classes/equipment.class";
import { Pack, Pet } from "../../../../classes/pet.class";
import { Player } from "../../../../classes/player.class";
import { DunkleosteusAbility } from "../../../abilities/pets/custom/tier-6/dunkleosteus-ability.class";

export class Dunkleosteus extends Pet {
    name = "Dunkleosteus";
    tier = 6;
    pack: Pack = 'Custom';
    attack = 6;
    health = 8;
    initAbilities(): void {
        this.addAbility(new DunkleosteusAbility(this, this.logService));
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
