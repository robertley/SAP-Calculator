import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { JackalopeAbility } from "../../../abilities/pets/unicorn/tier-2/jackalope-ability.class";

export class Jackalope extends Pet {
    name = "Jackalope";
    tier = 2;
    pack: Pack = 'Unicorn';
    attack = 1;
    health = 3;

    initAbilities(): void {
        this.addAbility(new JackalopeAbility(this, this.logService));
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