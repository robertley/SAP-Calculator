import { Pet } from "../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { Player } from "../../../player.class";
import { FlyingSquirrelAbility } from "../../../abilities/pets/puppy/tier-3/flying-squirrel-ability.class";
export class FlyingSquirrel extends Pet {
    constructor(logService: LogService, abilityService: AbilityService, parent: Player) {
        super(logService, abilityService, parent);
        this.name = "Flying Squirrel";
        this.tier = 3;
        this.pack = "Custom";
        this.attack = 3;
        this.health = 3;
    }

    initAbilities(): void {
        this.abilityList = [new FlyingSquirrelAbility(this, this.logService)];
        super.initAbilities();
    }
}
