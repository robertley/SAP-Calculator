import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { GreenSeaTurtleAbility } from "../../../abilities/pets/danger/tier-6/green-sea-turtle-ability.class";

export class GreenSeaTurtle extends Pet {
    name = "Green Sea Turtle";
    tier = 6;
    pack: Pack = 'Danger';
    attack = 5;
    health = 6;

    initAbilities(): void {
        this.addAbility(new GreenSeaTurtleAbility(this, this.logService));
        super.initAbilities();
    }

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = 1; // 1 time per turn
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