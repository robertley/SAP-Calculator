import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { VultureAbility } from "../../../abilities/pets/star/tier-5/vulture-ability.class";

export class Vulture extends Pet {
    name = "Vulture";
    tier = 5;
    pack: Pack = 'Star';
    attack = 4;
    health = 3;

    initAbilities(): void {
        this.addAbility(new VultureAbility(this, this.logService, this.abilityService));
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