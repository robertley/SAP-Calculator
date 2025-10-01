import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { FerretAbility } from "../../../abilities/pets/puppy/tier-1/ferret-ability.class";

export class Ferret extends Pet {
    name = "Ferret";
    tier = 1;
    pack: Pack = 'Puppy';
    attack = 2;
    health = 1;
    initAbilities(): void {
        this.addAbility(new FerretAbility(this, this.logService, this.abilityService));
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