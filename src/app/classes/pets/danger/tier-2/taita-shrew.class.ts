import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { TaitaShrewAbility } from "../../../abilities/pets/danger/tier-2/taita-shrew-ability.class";

export class TaitaShrew extends Pet {
    name = "Taita Shrew";
    tier = 2;
    pack: Pack = 'Danger';
    attack = 2;
    health = 2;
    initAbilities(): void {
        this.addAbility(new TaitaShrewAbility(this, this.logService, this.abilityService));
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