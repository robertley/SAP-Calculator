import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { BlackNeckedStiltAbility } from "../../../abilities/pets/golden/tier-2/black-necked-stilt-ability.class";

export class BlackNeckedStilt extends Pet {
    name = "Black Necked Stilt";
    tier = 2;
    pack: Pack = 'Golden';
    attack = 3;
    health = 2;
    initAbilities(): void {
        this.addAbility(new BlackNeckedStiltAbility(this, this.logService));
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