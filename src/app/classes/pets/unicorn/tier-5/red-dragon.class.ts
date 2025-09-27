import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Crisp } from "../../../equipment/ailments/crisp.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { RedDragonAbility } from "../../../abilities/pets/unicorn/tier-5/red-dragon-ability.class";

export class RedDragon extends Pet {
    name = "Red Dragon";
    tier = 5;
    pack: Pack = 'Unicorn';
    attack = 4;
    health = 8;
    initAbilities(): void {
        this.addAbility(new RedDragonAbility(this, this.logService));
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