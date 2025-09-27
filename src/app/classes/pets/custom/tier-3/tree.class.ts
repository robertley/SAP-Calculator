import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { TreeAbility } from "../../../abilities/pets/custom/tier-3/tree-ability.class";

export class Tree extends Pet {
    name = "Tree";
    tier = 3;
    pack: Pack = 'Custom';
    attack = 2;
    health = 5;
    initAbilities(): void {
        this.addAbility(new TreeAbility(this, this.logService));
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