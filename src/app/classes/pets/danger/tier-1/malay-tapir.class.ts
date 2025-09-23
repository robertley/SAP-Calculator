import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { MalayTapirAbility } from "../../../abilities/pets/danger/tier-1/malay-tapir-ability.class";

export class MalayTapir extends Pet {
    name = "Malay Tapir";
    tier = 1;
    pack: Pack = 'Danger';
    attack = 2;
    health = 2;
    initAbilities(): void {
        this.addAbility(new MalayTapirAbility(this, this.logService));
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