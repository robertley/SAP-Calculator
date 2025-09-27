import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { TunaAbility } from "../../../abilities/pets/star/tier-3/tuna-ability.class";

export class Tuna extends Pet {
    name = "Tuna";
    tier = 3;
    pack: Pack = 'Star';
    attack = 3;
    health = 5;

    initAbilities(): void {
        this.addAbility(new TunaAbility(this, this.logService));
        super.initAbilities();
    }

    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment,
        timesHurt?: number) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment);
        this.timesHurt = timesHurt ?? 0;
        this.originalTimesHurt = this.timesHurt;
    }
}