import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { BettaFishAbility } from "../../../abilities/pets/custom/tier-3/betta-fish-ability.class";

export class BettaFish extends Pet {
    name = "Betta Fish";
    tier = 3;
    pack: Pack = 'Custom';
    attack = 2;
    health = 3;
    initAbilities(): void {
        this.addAbility(new BettaFishAbility(this, this.logService));
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