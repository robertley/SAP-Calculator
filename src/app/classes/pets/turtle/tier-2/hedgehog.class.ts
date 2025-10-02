import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { HedgehogAbility } from "../../../abilities/pets/turtle/tier-2/hedgehog-ability.class";

export class Hedgehog extends Pet {
    name = "Hedgehog";
    tier = 2;
    pack: Pack = 'Turtle';
    attack = 4;
    health = 2;
    initAbilities(): void {
        this.addAbility(new HedgehogAbility(this, this.logService));
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