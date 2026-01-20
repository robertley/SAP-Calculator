import { Pet } from "../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability/ability.service";
import { Player } from "../../../player.class";
import { BarnacleAbility } from "../../../abilities/pets/custom/tier-3/barnacle-ability.class";

export class Barnacle extends Pet {
    constructor(logService: LogService, abilityService: AbilityService, parent: Player) {
        super(logService, abilityService, parent);
        this.name = "Barnacle";
        this.tier = 3;
        this.pack = "Custom";
        this.attack = 1;
        this.health = 3;
    }

    initAbilities(): void {
        this.abilityList = [new BarnacleAbility(this, this.logService)];
        super.initAbilities();
    }
}
