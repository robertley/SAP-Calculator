import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { FlamingoAbility } from "../../../abilities/pets/turtle/tier-2/flamingo-ability.class";

export class Flamingo extends Pet {
    name = "Flamingo";
    tier = 2;
    pack: Pack = 'Turtle';
    health = 2;
    attack = 3;

    initAbilities(): void {
        this.addAbility(new FlamingoAbility(this, this.logService));
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