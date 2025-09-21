import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Head } from "../../hidden/head.class";
import { HydraAbility } from "../../../abilities/pets/unicorn/tier-6/hydra-ability.class";

export class Hydra extends Pet {
    name = "Hydra";
    tier = 6;
    pack: Pack = 'Unicorn';
    attack = 10;
    health = 6;
    initAbilities(): void {
        this.addAbility(new HydraAbility(this, this.logService, this.abilityService));
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