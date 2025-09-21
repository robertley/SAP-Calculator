import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { DolphinAbility } from "../../../abilities/pets/turtle/tier-3/dolphin-ability.class";

export class Dolphin extends Pet {
    name = "Dolphin";
    tier = 3;
    pack: Pack = 'Turtle';
    health = 3;
    attack = 4;
    initAbilities(): void {
        this.addAbility(new DolphinAbility(this, this.logService));
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