import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { HorseAbility } from "../../../abilities/pets/turtle/tier-1/horse-ability.class";

export class Horse extends Pet {
    name = "Horse";
    tier = 1;
    pack: Pack = 'Turtle';
    health = 1;
    attack = 2;
    initAbilities() {
        this.addAbility(new HorseAbility(this, this.logService));
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