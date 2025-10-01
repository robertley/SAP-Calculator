import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Player } from "../../../player.class";
import { Pet, Pack } from "../../../pet.class";
import { Equipment } from "../../../equipment.class";
import { SeaAnemoneAbility } from "../../../abilities/pets/custom/tier-4/sea-anemone-ability.class";

export class SeaAnemone extends Pet {
    name = "Sea Anemone";
    tier = 4;
    pack: Pack = "Custom";
    health = 4;
    attack = 3;
    initAbilities(): void {
        this.addAbility(new SeaAnemoneAbility(this, this.logService, this.abilityService));
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