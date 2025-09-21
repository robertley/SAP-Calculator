import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { OrchidMantisAbility } from "../../../abilities/pets/puppy/tier-5/orchid-mantis-ability.class";

export class OrchidMantis extends Pet {
    name = "Orchid Mantis";
    tier = 5;
    pack: Pack = 'Puppy';
    attack = 8;
    health = 4;
    initAbilities(): void {
        this.addAbility(new OrchidMantisAbility(this, this.logService, this.abilityService));
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