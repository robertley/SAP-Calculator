import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { TriceratopsAbility } from "../../../abilities/pets/star/tier-5/triceratops-ability.class";

export class Triceratops extends Pet {
    name = "Triceratops";
    tier = 5;
    pack: Pack = 'Star';
    attack = 5;
    health = 6;

    initAbilities(): void {
        this.addAbility(new TriceratopsAbility(this, this.logService));
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