import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { PetService } from "../../../../services/pet.service";
import { GoblinSharkStartAbility } from "../../../abilities/pets/custom/tier-4/goblin-shark-start-ability.class";
import { GoblinSharkFaintAbility } from "../../../abilities/pets/custom/tier-4/goblin-shark-faint-ability.class";

export class GoblinShark extends Pet {
    name = "Goblin Shark";
    tier = 4;
    pack: Pack = 'Custom';
    attack = 6;
    health = 3;
    
    initAbilities(): void {
        this.addAbility(new GoblinSharkStartAbility(this, this.logService, this.petService));
        this.addAbility(new GoblinSharkFaintAbility(this, this.logService, this.abilityService));
    }
    
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService,
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