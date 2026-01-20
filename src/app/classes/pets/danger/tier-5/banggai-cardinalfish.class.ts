import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { BanggaiCardinalfishAbility } from "../../../abilities/pets/danger/tier-5/banggai-cardinalfish-ability.class";

export class BanggaiCardinalfish extends Pet {
    name = "Banggai Cardinalfish";
    tier = 5;
    pack: Pack = 'Danger';
    attack = 4;
    health = 7;

    initAbilities(): void {
        this.addAbility(new BanggaiCardinalfishAbility(this, this.logService));
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