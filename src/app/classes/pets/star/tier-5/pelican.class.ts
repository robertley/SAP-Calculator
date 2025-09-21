import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { PetService } from "../../../../services/pet.service";
import { Equipment } from "../../../equipment.class";
import { Strawberry } from "../../../equipment/star/strawberry.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { PelicanStartAbility } from "../../../abilities/pets/star/tier-5/pelican-start-ability.class";
import { PelicanFaintAbility } from "../../../abilities/pets/star/tier-5/pelican-faint-ability.class";

export class Pelican extends Pet {
    name = "Pelican";
    tier = 5;
    pack: Pack = 'Star';
    attack = 5;
    health = 5;

    initAbilities(): void {
        this.addAbility(new PelicanStartAbility(this, this.logService, this.petService));
        this.addAbility(new PelicanFaintAbility(this, this.logService, this.abilityService));
    }

    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService,
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