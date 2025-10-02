import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { AxolotlAbility } from "../../../abilities/pets/puppy/tier-5/axolotl-ability.class";

export class Axolotl extends Pet {
    name = "Axolotl";
    tier = 5;
    pack: Pack = 'Puppy';
    attack = 2;
    health = 5;
    initAbilities(): void {
        this.addAbility(new AxolotlAbility(this, this.logService));
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