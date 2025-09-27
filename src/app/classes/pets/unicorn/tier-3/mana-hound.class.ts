import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { ManaHoundAbility } from "../../../abilities/pets/unicorn/tier-3/mana-hound-ability.class";

export class ManaHound extends Pet {
    name = "Mana Hound";
    tier = 3;
    pack: Pack = 'Unicorn';
    attack = 5;
    health = 3;
    initAbilities(): void {
        this.addAbility(new ManaHoundAbility(this, this.logService));
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