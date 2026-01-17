import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../../classes/equipment.class";
import { Pack, Pet } from "../../../../classes/pet.class";
import { Player } from "../../../../classes/player.class";
import { GiantIsopodAbility } from "../../../abilities/pets/custom/tier-5/giant-isopod-ability.class";

export class GiantIsopod extends Pet {
    name = "Giant Isopod";
    tier = 5;
    pack: Pack = 'Custom';
    attack = 5;
    health = 6;
    initAbilities(): void {
        this.addAbility(new GiantIsopodAbility(this, this.logService));
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
