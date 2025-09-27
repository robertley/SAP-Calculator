import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { PetService } from "../../../../services/pet.service";
import { GoldenTamarinAbility } from "../../../abilities/pets/danger/tier-4/golden-tamarin-ability.class";

export class GoldenTamarin extends Pet {
    name = "Golden Tamarin";
    tier = 4;
    pack: Pack = 'Danger';
    attack = 4;
    health = 4;

    initAbilities(): void {
        this.addAbility(new GoldenTamarinAbility(this, this.logService, this.petService));
        super.initAbilities();
    }

    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService,
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