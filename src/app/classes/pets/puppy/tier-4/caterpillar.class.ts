import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { CaterpillarAbility } from "../../../abilities/pets/puppy/tier-4/caterpillar-ability.class";

export class Caterpillar extends Pet {
    name = "Caterpillar";
    tier = 4;
    pack: Pack = 'Puppy';
    attack = 1;
    health = 1;
    initAbilities(): void {
        this.addAbility(new CaterpillarAbility(this, this.logService, this.abilityService));
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