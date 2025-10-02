import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { MantisShrimpAbility } from "../../../abilities/pets/puppy/tier-6/mantis-shrimp-ability.class";

export class MantisShrimp extends Pet {
    name = "Mantis Shrimp";
    tier = 6;
    pack: Pack = 'Puppy';
    attack = 9;
    health = 3;
    initAbilities(): void {
        this.addAbility(new MantisShrimpAbility(this, this.logService));
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