import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment } from "../../equipment.class";
import { Pack, Pet } from "../../pet.class";
import { Player } from "../../player.class";
import { RockAbility } from "../../abilities/pets/hidden/rock-ability.class";

export class Rock extends Pet {
    name = "Rock";
    tier = 1;
    pack: Pack = 'Unicorn';
    hidden: boolean = true;
    health = 1;
    attack = 1;
    initAbilities(): void {
        this.addAbility(new RockAbility(this, this.logService, this.abilityService));
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