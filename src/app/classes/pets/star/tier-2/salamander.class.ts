import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { SalamanderAbility } from "../../../abilities/pets/star/tier-2/salamander-ability.class";

export class Salamander extends Pet {
    name = "Salamander";
    tier = 2;
    pack: Pack = 'Star';
    attack = 2;
    health = 4;
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
    initAbilities(): void {
        this.addAbility(new SalamanderAbility(this, this.logService));
        super.initAbilities();
    }
}