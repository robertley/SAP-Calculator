import { PetService } from "app/services/pet.service";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { ParrotAbility } from "app/classes/abilities/pets/turtle/tier-4/parrot-ability.class";
// TODO - verify parrot has all ability methods
// fix bug with parrot copying parrot working despite order
export class Parrot extends Pet {
    name = "Parrot";
    tier = 4;
    pack: Pack = 'Turtle';
    attack = 4;
    health = 2;
    copyPet: Pet;
    initAbilities(): void {
        this.addAbility(new ParrotAbility(this, this.logService));
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
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment);
    }
}