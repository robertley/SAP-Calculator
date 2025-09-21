import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { BeetleAbility } from "../../../abilities/pets/puppy/tier-1/beetle-ability.class";

export class Beetle extends Pet {
    name = "Beetle";
    tier = 1;
    pack: Pack = 'Puppy';
    attack = 2;
    health = 2;
    initAbilities(): void {
        this.addAbility(new BeetleAbility(this, this.logService, this.abilityService));
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