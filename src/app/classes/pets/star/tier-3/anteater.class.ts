import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Ant } from "../../turtle/tier-1/ant.class";
import { AnteaterAbility } from "../../../abilities/pets/star/tier-3/anteater-ability.class";

export class Anteater extends Pet {
    name = "Anteater";
    tier = 3;
    pack: Pack = 'Star';
    attack = 3;
    health = 2;

    initAbilities(): void {
        this.addAbility(new AnteaterAbility(this, this.logService, this.abilityService));
        super.initAbilities();
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment, triggersConsumed?: number) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
    }
}