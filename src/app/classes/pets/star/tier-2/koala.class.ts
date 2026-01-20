import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { KoalaAbility } from "../../../abilities/pets/star/tier-2/koala-ability.class";

export class Koala extends Pet {
    name = "Koala";
    tier = 2;
    pack: Pack = 'Star';
    attack = 4;
    health = 2;
    initAbilities(): void {
        this.addAbility(new KoalaAbility(this, this.logService));
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