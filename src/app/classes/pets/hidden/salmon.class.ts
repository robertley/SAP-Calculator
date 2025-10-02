import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment } from "../../equipment.class";
import { Pack, Pet } from "../../pet.class";
import { Player } from "../../player.class";
import { SalmonAbility } from "../../abilities/pets/hidden/salmon-ability.class";

export class Salmon extends Pet {
    name = "Salmon";
    tier = 1;
    pack: Pack = 'Star';
    attack = 1;
    health = 1;
    hidden = true;

    initAbilities(): void {
        this.addAbility(new SalmonAbility(this, this.logService));
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