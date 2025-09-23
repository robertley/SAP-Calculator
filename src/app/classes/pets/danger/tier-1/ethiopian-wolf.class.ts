import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { EthiopianWolfAbility } from "../../../abilities/pets/danger/tier-1/ethiopian-wolf-ability.class";

export class EthiopianWolf extends Pet {
    name = "Ethiopian Wolf";
    tier = 1;
    pack: Pack = 'Danger';
    attack = 2;
    health = 3;
    initAbilities(): void {
        this.addAbility(new EthiopianWolfAbility(this, this.logService));
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