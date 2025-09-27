import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { TasmanianDevilAbility } from "../../../abilities/pets/danger/tier-4/tasmanian-devil-ability.class";

export class TasmanianDevil extends Pet {
    name = "Tasmanian Devil";
    tier = 4;
    pack: Pack = 'Danger';
    attack = 5;
    health = 5;

    initAbilities(): void {
        this.addAbility(new TasmanianDevilAbility(this, this.logService));
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