import { Pet } from "../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability/ability.service";
import { Player } from "../../../player.class";
import { BlueDragonAbility } from "../../../abilities/pets/custom/tier-3/blue-dragon-ability.class";

export class BlueDragon extends Pet {
    constructor(logService: LogService, abilityService: AbilityService, parent: Player) {
        super(logService, abilityService, parent);
        this.name = "Blue Dragon";
        this.tier = 3;
        this.pack = "Custom";
        this.attack = 3;
        this.health = 4;
    }

    initAbilities(): void {
        this.abilityList = [new BlueDragonAbility(this, this.logService)];
        super.initAbilities();
    }
}
