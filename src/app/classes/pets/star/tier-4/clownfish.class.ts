import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { ClownfishAbility } from "../../../abilities/pets/star/tier-4/clownfish-ability.class";

export class Clownfish extends Pet {
    name = "Clownfish";
    tier = 4;
    pack: Pack = 'Star';
    attack = 3;
    health = 4;

    initAbilities(): void {
        this.addAbility(new ClownfishAbility(this, this.logService));
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