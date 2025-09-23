import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { NurseSharkAbility } from "../../../abilities/pets/golden/tier-5/nurse-shark-ability.class";

export class NurseShark extends Pet {
    name = "Nurse Shark";
    tier = 5;
    pack: Pack = 'Golden';
    attack = 5;
    health = 7;
    initAbilities(): void {
        this.addAbility(new NurseSharkAbility(this, this.logService));
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