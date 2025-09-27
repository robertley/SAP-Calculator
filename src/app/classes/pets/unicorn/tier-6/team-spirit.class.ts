import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { TeamSpiritAbility } from "../../../abilities/pets/unicorn/tier-6/team-spirit-ability.class";

export class TeamSpirit extends Pet {
    name = "Team Spirit";
    tier = 6;
    pack: Pack = 'Unicorn';
    attack = 4;
    health = 5;
    initAbilities(): void {
        this.addAbility(new TeamSpiritAbility(this, this.logService));
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