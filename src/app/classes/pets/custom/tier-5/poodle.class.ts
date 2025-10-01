import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { PoodleAbility } from "../../../abilities/pets/custom/tier-5/poodle-ability.class";

export class Poodle extends Pet {
    name = "Poodle";
    tier = 5;
    pack: Pack = 'Puppy';
    attack = 2;
    health = 2;
    initAbilities(): void {
        this.addAbility(new PoodleAbility(this, this.logService, this.abilityService));
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