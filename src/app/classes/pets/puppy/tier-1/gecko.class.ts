import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { GeckoAbility } from "../../../abilities/pets/puppy/tier-1/gecko-ability.class";

export class Gecko extends Pet {
    name = "Gecko";
    tier = 1;
    pack: Pack = 'Puppy';
    attack = 3;
    health = 1;
    toyPet: boolean = true;
    initAbilities(): void {
        this.addAbility(new GeckoAbility(this, this.logService));
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