import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { AardvarkAbility } from "../../../abilities/pets/custom/tier-3/aardvark-ability.class";

export class Aardvark extends Pet {
    name = "Aardvark";
    tier = 3;
    pack: Pack = 'Custom';
    attack = 2;
    health = 3;
    initAbilities(): void {
        this.addAbility(new AardvarkAbility(this, this.logService));
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