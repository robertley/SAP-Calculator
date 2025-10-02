import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { DogAbility } from "../../../abilities/pets/turtle/tier-3/dog-ability.class";

// TODO fix bug when spawned out of spider getting bonus
export class Dog extends Pet {
    name = "Dog";
    tier = 3;
    pack: Pack = 'Turtle';
    attack = 3;
    health = 2;
    initAbilities(): void {
        this.addAbility(new DogAbility(this, this.logService));
        super.initAbilities();
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment, triggersConsumed?: number) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
    }
}