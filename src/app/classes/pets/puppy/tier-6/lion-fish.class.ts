import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { LionfishAbility } from "../../../abilities/pets/puppy/tier-6/lionfish-ability.class";

export class Lionfish extends Pet {
    name = "Lionfish";
    tier = 6;
    pack: Pack = 'Puppy';
    attack = 8;
    health = 4;
    initAbilities(): void {
        this.addAbility(new LionfishAbility(this, this.logService));
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