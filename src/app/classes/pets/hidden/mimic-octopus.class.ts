import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment } from "../../equipment.class";
import { Pack, Pet } from "../../pet.class";
import { Player } from "../../player.class";
import { MimicOctopusAbility } from "../../abilities/pets/hidden/mimic-octopus-ability.class";

export class MimicOctopus extends Pet {
    name = "Mimic Octopus";
    tier = 6;
    pack: Pack = 'Star';
    attack = 3;
    health = 6;

    initAbilities(): void {
        this.addAbility(new MimicOctopusAbility(this, this.logService));
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