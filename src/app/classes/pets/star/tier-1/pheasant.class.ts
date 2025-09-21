import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Strawberry } from "../../../equipment/star/strawberry.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { PheasantAbility } from "../../../abilities/pets/star/tier-1/pheasant-ability.class";


export class Pheasant extends Pet {
    name = "Pheasant";
    tier = 1;
    pack: Pack = 'Star';
    attack = 2;
    health = 1;

    initAbilities(): void {
        this.addAbility(new PheasantAbility(this, this.logService, this.abilityService));
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