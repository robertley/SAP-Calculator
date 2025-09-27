import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { RoyalFlycatcherAbility } from "../../../abilities/pets/golden/tier-3/royal-flycatcher-ability.class";

export class RoyalFlycatcher extends Pet {
    name = "Royal Flycatcher";
    tier = 3;
    pack: Pack = 'Golden';
    attack = 2;
    health = 4;
    initAbilities(): void {
        this.addAbility(new RoyalFlycatcherAbility(this, this.logService));
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