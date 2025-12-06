import { GiantTortoiseAbility } from "app/classes/abilities/pets/danger/tier-4/giant-tortoise-ability.class";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class GiantTortoise extends Pet {
    name = "Giant Tortoise";
    tier = 4;
    pack: Pack = 'Danger';
    attack = 4;
    health = 8;

    initAbilities(): void {
        this.addAbility(new GiantTortoiseAbility(this, this.logService, this.abilityService));
        super.initAbilities();
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment, triggersConsumed?: number) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
    }
}
