import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Player } from "../../../player.class";
import { Pet, Pack } from "../../../pet.class";
import { Equipment } from "../../../equipment.class";
import { BlueWhaleAbility } from "../../../abilities/pets/danger/tier-6/blue-whale-ability.class";

export class BlueWhale extends Pet {
    name = "Blue Whale";
    tier = 6;
    pack: Pack = "Danger";
    health = 12;
    attack = 12;
    initAbilities(): void {
        this.addAbility(new BlueWhaleAbility(this, this.logService, this.abilityService));
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
