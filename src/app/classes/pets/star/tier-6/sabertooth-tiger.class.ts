import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { PetService } from "../../../../services/pet.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { SabertoothTigerAbility } from "../../../abilities/pets/star/tier-6/sabertooth-tiger-ability.class";

export class SabertoothTiger extends Pet {
    name = "Sabertooth Tiger";
    tier = 6;
    pack: Pack = 'Star';
    attack = 4;
    health = 5;
    initAbilities(): void {
        this.addAbility(new SabertoothTigerAbility(this, this.logService, this.abilityService, this.petService));
        super.initAbilities();
    }

    resetPet(): void {
        super.resetPet();
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment,
        triggersConsumed?: number,
        timesHurt?: number) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
        this.timesHurt = timesHurt ?? 0;
        this.originalTimesHurt = this.timesHurt;
    }
}