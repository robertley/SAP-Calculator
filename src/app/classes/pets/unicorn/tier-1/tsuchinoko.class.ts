import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { TsuchinokoAbility } from "../../../abilities/pets/unicorn/tier-1/tsuchinoko-ability.class";

export class Tsuchinoko extends Pet {
    name = "Tsuchinoko";
    tier = 1;
    pack: Pack = 'Unicorn';
    attack = 2;
    health = 1;
    initAbilities(): void {
        this.addAbility(new TsuchinokoAbility(this, this.logService));
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