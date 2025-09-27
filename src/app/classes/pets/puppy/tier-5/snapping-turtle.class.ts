import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { SnappingTurtleAbility } from "../../../abilities/pets/puppy/tier-5/snapping-turtle-ability.class";

export class SnappingTurtle extends Pet {
    name = "Snapping Turtle";
    tier = 5;
    pack: Pack = 'Puppy';
    attack = 4;
    health = 5;
    initAbilities(): void {
        this.addAbility(new SnappingTurtleAbility(this, this.logService));
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