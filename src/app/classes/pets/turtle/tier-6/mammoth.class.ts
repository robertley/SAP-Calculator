import { GameAPI } from "app/interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { MammothAbility } from "../../../abilities/pets/turtle/tier-6/mammoth-ability.class";

export class Mammoth extends Pet {
    name = "Mammoth";
    tier = 6;
    pack: Pack = 'Turtle';
    attack = 4;
    health = 12;
    initAbilities(): void {
        this.addAbility(new MammothAbility(this, this.logService));
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