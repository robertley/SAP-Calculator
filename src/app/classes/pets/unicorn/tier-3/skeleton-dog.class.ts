import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { SkeletonDogAbility } from "../../../abilities/pets/unicorn/tier-3/skeleton-dog-ability.class";

export class SkeletonDog extends Pet {
    name = "Skeleton Dog";
    tier = 3;
    pack: Pack = 'Unicorn';
    attack = 3;
    health = 3;
    initAbilities(): void {
        this.addAbility(new SkeletonDogAbility(this, this.logService));
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