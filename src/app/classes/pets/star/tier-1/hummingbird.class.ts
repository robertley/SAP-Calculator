import { Strawberry } from "app/classes/equipment/star/strawberry.class";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { HummingbirdAbility } from "../../../abilities/pets/star/tier-1/hummingbird-ability.class";

export class Hummingbird extends Pet {
    name = "Hummingbird";
    tier = 1;
    pack: Pack = 'Star';
    attack = 2;
    health = 2;

    initAbilities(): void {
        this.addAbility(new HummingbirdAbility(this, this.logService, this.abilityService));
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