import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { SeaTurtleAbility } from "../../../abilities/pets/golden/tier-2/sea-turtle-ability.class";

export class SeaTurtle extends Pet {
    name = "Sea Turtle";
    tier = 2;
    pack: Pack = 'Golden';
    attack = 1;
    health = 4;
    initAbilities(): void {
        this.addAbility(new SeaTurtleAbility(this, this.logService));
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