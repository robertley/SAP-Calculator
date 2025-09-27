import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Groundhog } from "../tier-1/groundhog.class";
import { OspreyAbility } from "../../../abilities/pets/golden/tier-3/osprey-ability.class";

export class Osprey extends Pet {
    name = "Osprey";
    tier = 3;
    pack: Pack = 'Golden';
    attack = 3;
    health = 3;
    initAbilities(): void {
        this.addAbility(new OspreyAbility(this, this.logService, this.abilityService));
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