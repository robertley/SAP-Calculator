import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { SmallerSlug } from "../../hidden/smaller-slug.class";
import { SlugAbility } from "../../../abilities/pets/golden/tier-4/slug-ability.class";

export class Slug extends Pet {
    name = "Slug";
    tier = 4;
    pack: Pack = 'Golden';
    attack = 4;
    health = 4;
    initAbilities(): void {
        this.addAbility(new SlugAbility(this, this.logService, this.abilityService));
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