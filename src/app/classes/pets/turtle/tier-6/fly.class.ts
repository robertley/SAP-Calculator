import { GameAPI } from "app/interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { ZombieFly } from "../../hidden/zombie-fly.class";
import { cloneDeep } from "lodash";
import { FlyAbility } from "../../../abilities/pets/turtle/tier-6/fly-ability.class";

export class Fly extends Pet {
    name = "Fly";
    tier = 6;
    pack: Pack = 'Turtle';
    attack = 5;
    health = 5;
    initAbilities(): void {
        this.addAbility(new FlyAbility(this, this.logService, this.abilityService));
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