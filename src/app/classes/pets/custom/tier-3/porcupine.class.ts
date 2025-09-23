import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { PorcupineAbility } from "../../../abilities/pets/custom/tier-3/porcupine-ability.class";

export class Porcupine extends Pet {
    name = "Porcupine";
    tier = 3;
    pack: Pack = 'Custom';
    attack = 2;
    health = 6;
    initAbilities(): void {
        this.addAbility(new PorcupineAbility(this, this.logService));
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