import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { SleipnirAbility } from "../../../abilities/pets/unicorn/tier-6/sleipnir-ability.class";

export class Sleipnir extends Pet {
    name = "Sleipnir";
    tier = 6;
    pack: Pack = 'Unicorn';
    attack = 8;
    health = 5;
    initAbilities(): void {
        this.addAbility(new SleipnirAbility(this, this.logService));
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