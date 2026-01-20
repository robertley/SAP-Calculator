import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { PeacockAbility } from "../../../abilities/pets/turtle/tier-2/peacock-ability.class";

export class Peacock extends Pet {
    name = "Peacock";
    tier = 2;
    pack: Pack = 'Turtle';
    health = 5;
    attack = 2;
    initAbilities(): void {
        this.addAbility(new PeacockAbility(this, this.logService));
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