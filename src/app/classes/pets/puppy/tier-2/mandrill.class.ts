import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { MandrillAbility } from "../../../abilities/pets/puppy/tier-2/mandrill-ability.class";

export class Mandrill extends Pet {
    name = "Mandrill";
    tier = 2;
    pack: Pack = 'Puppy';
    attack = 3;
    health = 4;
    initAbilities(): void {
        this.addAbility(new MandrillAbility(this, this.logService, this.abilityService));
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