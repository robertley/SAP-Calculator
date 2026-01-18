import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../../classes/equipment.class";
import { Pack, Pet } from "../../../../classes/pet.class";
import { Player } from "../../../../classes/player.class";
import { RoadrunnerAbility } from "../../../abilities/pets/custom/tier-2/roadrunner-ability.class";

export class Roadrunner extends Pet {
    name = "Roadrunner";
    tier = 2;
    pack: Pack = 'Custom';
    attack = 4;
    health = 1;
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

    override initAbilities(): void {
        this.addAbility(new RoadrunnerAbility(this));
        super.initAbilities();
    }
}
