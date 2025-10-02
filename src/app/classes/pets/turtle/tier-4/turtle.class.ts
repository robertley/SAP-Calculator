import { Melon } from "app/classes/equipment/turtle/melon.class";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { TurtleAbility } from "../../../abilities/pets/turtle/tier-4/turtle-ability.class";

export class Turtle extends Pet {
    name = "Turtle";
    tier = 4;
    pack: Pack = 'Turtle';
    attack = 2;
    health = 5;
    initAbilities(): void {
        this.addAbility(new TurtleAbility(this, this.logService));
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