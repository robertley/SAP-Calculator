import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { LemmingAbility } from "../../../abilities/pets/golden/tier-1/lemming-ability.class";

export class Lemming extends Pet {
    name = "Lemming";
    tier = 1;
    pack: Pack = 'Golden';
    attack = 3;
    health = 2;
    initAbilities(): void {
        this.addAbility(new LemmingAbility(this, this.logService, this.abilityService));
        super.initAbilities();
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment);
    }
}