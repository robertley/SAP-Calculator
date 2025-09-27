import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { MinotaurAbility } from "../../../abilities/pets/unicorn/tier-4/minotaur-ability.class";

export class Minotaur extends Pet {
    name = "Minotaur";
    tier = 4;
    pack: Pack = 'Unicorn';
    attack = 3;
    health = 3;
    initAbilities(): void {
        this.addAbility(new MinotaurAbility(this, this.logService));
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