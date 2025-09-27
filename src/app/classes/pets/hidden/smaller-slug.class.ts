import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment } from "../../equipment.class";
import { Pack, Pet } from "../../pet.class";
import { Player } from "../../player.class";
import { SmallerSlugAbility } from "../../abilities/pets/hidden/smaller-slug-ability.class";

export class SmallerSlug extends Pet {
    name = "Smaller Slug";
    tier = 1;
    pack: Pack = 'Golden';
    hidden: boolean = true;
    health = 2;
    attack = 2;
    initAbilities(): void {
        this.addAbility(new SmallerSlugAbility(this, this.logService, this.abilityService));
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