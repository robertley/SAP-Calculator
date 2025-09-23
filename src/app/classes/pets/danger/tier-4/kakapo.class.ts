import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { KakapoAbility } from "../../../abilities/pets/danger/tier-4/kakapo-ability.class";

export class Kakapo extends Pet {
    name = "Kakapo";
    tier = 4;
    pack: Pack = 'Danger';
    attack = 3;
    health = 5;

    initAbilities(): void {
        this.addAbility(new KakapoAbility(this, this.logService));
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