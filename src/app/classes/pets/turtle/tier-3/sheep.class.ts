import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Ram } from "../../hidden/ram.class";
import { SheepAbility } from "../../../abilities/pets/turtle/tier-3/sheep-ability.class";

export class Sheep extends Pet {
    name = "Sheep";
    tier = 3;
    pack: Pack = 'Turtle';
    attack = 2;
    health = 2;
    initAbilities(): void {
        this.addAbility(new SheepAbility(this, this.logService, this.abilityService));
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