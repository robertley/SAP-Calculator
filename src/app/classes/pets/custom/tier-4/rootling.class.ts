import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { RootlingAbility } from "../../../abilities/pets/custom/tier-4/rootling-ability.class";

export class Rootling extends Pet {
    name = "Rootling";
    tier = 4;
    pack: Pack = 'Custom';
    attack = 1;
    health = 5;
    initAbilities(): void {
        this.addAbility(new RootlingAbility(this, this.logService, this.abilityService));
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