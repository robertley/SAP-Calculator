import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { FlyingSquirrelAbility } from "../../../abilities/pets/puppy/tier-3/flying-squirrel-ability.class";

export class FlyingSquirrel extends Pet {
    name = "Flying Squirrel";
    tier = 3;
    pack: Pack = 'Puppy';
    attack = 3;
    health = 3;
    initAbilities(): void {
        this.addAbility(new FlyingSquirrelAbility(this, this.logService));
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