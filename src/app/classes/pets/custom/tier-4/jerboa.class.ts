import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { JerboaAbility } from "../../../abilities/pets/custom/tier-4/jerboa-ability.class";

export class Jerboa extends Pet {
    name = "Jerboa";
    tier = 4;
    pack: Pack = 'Custom';
    attack = 1;
    health = 3;
    initAbilities(): void {
        this.addAbility(new JerboaAbility(this, this.logService, this.abilityService));
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