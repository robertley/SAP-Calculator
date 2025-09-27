import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { PandaAbility } from "../../../abilities/pets/custom/tier-2/panda-ability.class";

export class Panda extends Pet {
    name = "Panda";
    tier = 2;
    pack: Pack = 'Custom';
    attack = 2;
    health = 4;
    initAbilities(): void {
        this.addAbility(new PandaAbility(this, this.logService));
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