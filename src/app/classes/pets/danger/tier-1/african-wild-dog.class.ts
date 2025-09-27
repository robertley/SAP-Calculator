import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { AfricanWildDogAbility } from "../../../abilities/pets/danger/tier-1/african-wild-dog-ability.class";

export class AfricanWildDog extends Pet {
    name = "African Wild Dog";
    tier = 1;
    pack: Pack = 'Danger';
    attack = 2;
    health = 1;
    initAbilities(): void {
        this.addAbility(new AfricanWildDogAbility(this, this.logService));
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