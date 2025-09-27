import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { AmsterdamAlbatrossAbility } from "../../../abilities/pets/danger/tier-6/amsterdam-albatross-ability.class";

export class AmsterdamAlbatross extends Pet {
    name = "Amsterdam Albatross";
    tier = 6;
    pack: Pack = 'Danger';
    attack = 3;
    health = 6;

    initAbilities(): void {
        this.addAbility(new AmsterdamAlbatrossAbility(this, this.logService));
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