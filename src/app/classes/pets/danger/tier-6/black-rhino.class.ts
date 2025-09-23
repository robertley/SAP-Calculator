import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { BlackRhinoAbility } from "../../../abilities/pets/danger/tier-6/black-rhino-ability.class";

export class BlackRhino extends Pet {
    name = "Black Rhino";
    tier = 6;
    pack: Pack = 'Danger';
    attack = 5;
    health = 9;

    initAbilities(): void {
        this.addAbility(new BlackRhinoAbility(this, this.logService));
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