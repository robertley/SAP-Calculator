import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { WhiteBelliedHeronAbility } from "../../../abilities/pets/danger/tier-2/white-bellied-heron-ability.class";

export class WhiteBelliedHeron extends Pet {
    name = "White-Bellied Heron";
    tier = 2;
    pack: Pack = 'Danger';
    attack = 4;
    health = 2;
    initAbilities(): void {
        this.addAbility(new WhiteBelliedHeronAbility(this, this.logService));
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