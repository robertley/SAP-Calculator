import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { PetService } from "../../../../services/pet.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { AbominationAbility } from "../../../abilities/pets/unicorn/tier-4/abomination-ability.class";

export class Abomination extends Pet {
    name = "Abomination";
    tier = 4;
    pack: Pack = 'Unicorn';
    attack = 6;
    health = 5;
    initAbilities(): void {
        this.addAbility(new AbominationAbility(this, this.logService, this.petService));
        super.initAbilities();
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment,
        abominationSwallowedPet1?: string,
        abominationSwallowedPet2?: string,
        abominationSwallowedPet3?: string) {
            super(logService, abilityService, parent);
            this.initPet(exp, health, attack, mana, equipment);
            this.abominationSwallowedPet1 = abominationSwallowedPet1;
            this.abominationSwallowedPet2 = abominationSwallowedPet2;
            this.abominationSwallowedPet3 = abominationSwallowedPet3;
    }
}