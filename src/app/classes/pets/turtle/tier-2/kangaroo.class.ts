import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { KangarooAbility } from "../../../abilities/pets/turtle/tier-2/kangaroo-ability.class";

export class Kangaroo extends Pet {
    name = "Kangaroo";
    tier = 2;
    pack: Pack = 'Turtle';
    health = 2;
    attack = 2;
    initAbilities(): void {
        this.addAbility(new KangarooAbility(this, this.logService));
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