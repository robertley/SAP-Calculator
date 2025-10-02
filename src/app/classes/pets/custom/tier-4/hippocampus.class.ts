import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { HippocampusAbility } from "../../../abilities/pets/custom/tier-4/hippocampus-ability.class";

export class Hippocampus extends Pet {
    name = "Hippocampus";
    tier = 4;
    pack: Pack = 'Custom';
    attack = 2;
    health = 4;
    //TO DO: Needs update abilty
    initAbilities(): void {
        this.addAbility(new HippocampusAbility(this, this.logService, this.abilityService));
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