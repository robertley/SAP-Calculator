import { GameAPI } from "app/interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Coconut } from "app/classes/equipment/turtle/coconut.class";
import { GorillaAbility } from "../../../abilities/pets/turtle/tier-6/gorilla-ability.class";

export class Gorilla extends Pet {
    name = "Gorilla";
    tier = 6;
    pack: Pack = 'Turtle';
    attack = 7;
    health = 10;
    initAbilities(): void {
        this.addAbility(new GorillaAbility(this, this.logService));
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