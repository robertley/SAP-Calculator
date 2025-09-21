import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { NessieQ } from "../../hidden/nessie-q.class";
import { NessieAbility } from "../../../abilities/pets/unicorn/tier-5/nessie-ability.class";

export class Nessie extends Pet {
    name = "Nessie";
    tier = 5;
    pack: Pack = 'Unicorn';
    attack = 3;
    health = 5;
    initAbilities(): void {
        this.addAbility(new NessieAbility(this, this.logService, this.abilityService));
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