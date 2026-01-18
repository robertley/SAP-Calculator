import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { KitsuneAbility } from "../../../abilities/pets/unicorn/tier-5/kitsune-ability.class";

export class Kitsune extends Pet {
    name = "Kitsune";
    tier = 5;
    pack: Pack = 'Unicorn';
    attack = 2;
    health = 7;
    initAbilities(): void {
        this.addAbility(new KitsuneAbility(this, this.logService));
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