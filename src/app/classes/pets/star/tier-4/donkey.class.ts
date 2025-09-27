import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { DonkeyAbility } from "../../../abilities/pets/star/tier-4/donkey-ability.class";

export class Donkey extends Pet {
    name = "Donkey";
    tier = 4;
    pack: Pack = 'Star';
    attack = 4;
    health = 6;

    initAbilities(): void {
        this.addAbility(new DonkeyAbility(this, this.logService));
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