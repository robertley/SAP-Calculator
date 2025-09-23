import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment } from "../../equipment.class";
import { Pack, Pet } from "../../pet.class";
import { Player } from "../../player.class";
import { BabyUrchinAbility } from "../../abilities/pets/hidden/baby-urchin-ability.class";

export class BabyUrchin extends Pet {
    name = "Baby Urchin";
    tier = 2;
    pack: Pack = 'Star';
    attack = 2;
    health = 1;
    
    initAbilities(): void {
        this.addAbility(new BabyUrchinAbility(this, this.logService));
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