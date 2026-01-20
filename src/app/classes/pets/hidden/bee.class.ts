import { AbilityService } from "../../../services/ability/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment } from "../../equipment.class";
import { Pack, Pet } from "../../pet.class";
import { Player } from "../../player.class";
import { BeeAbility } from "../../abilities/pets/hidden/bee-ability.class";

export class Bee extends Pet {
    name = "Bee";
    tier = 1;
    pack: Pack = 'Turtle';
    hidden: boolean = true;
    health = 1;
    attack = 1;
    initAbilities(): void {
        this.addAbility(new BeeAbility(this, this.logService, this.abilityService));
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