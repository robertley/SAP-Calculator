import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { StegosaurusAbility } from "../../../abilities/pets/custom/tier-6/stegosaurus-ability.class";

export class Stegosaurus extends Pet {
    name = "Stegosaurus";
    tier = 6;
    pack: Pack = 'Custom';
    attack = 3;
    health = 8;
    initAbilities(): void {
        this.addAbility(new StegosaurusAbility(this, this.logService));
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