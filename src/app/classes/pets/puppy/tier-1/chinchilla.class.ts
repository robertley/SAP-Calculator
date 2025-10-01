import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { ChinchillaAbility } from "../../../abilities/pets/puppy/tier-1/chinchilla-ability.class";

export class Chinchilla extends Pet {
    name = "Chinchilla";
    tier = 1;
    pack: Pack = 'Puppy';
    attack = 2
    health = 3;
    initAbilities(): void {
        this.addAbility(new ChinchillaAbility(this, this.logService, this.abilityService));
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