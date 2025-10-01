import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { AlbatrossAbility } from "../../../abilities/pets/custom/tier-6/albatross-ability.class";

export class Albatross extends Pet {
    name = "Albatross";
    tier = 6;
    pack: Pack = 'Custom';
    attack = 5;
    health = 4;
    initAbilities(): void {
        this.addAbility(new AlbatrossAbility(this, this.logService, this.abilityService));
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