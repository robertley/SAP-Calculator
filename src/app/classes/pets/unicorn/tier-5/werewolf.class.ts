import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { WerewolfAbility } from "../../../abilities/pets/unicorn/tier-5/werewolf-ability.class";

export class Werewolf extends Pet {
    name = "Werewolf";
    tier = 5;
    pack: Pack = 'Unicorn';
    attack = 6;
    health = 6;
    initAbilities(): void {
        this.addAbility(new WerewolfAbility(this, this.logService));
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