import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { CerberusAbility } from "../../../abilities/pets/unicorn/tier-6/cerberus-ability.class";

// TODO fix bug where cerberus spawns 2 fire pups at start of battle when there is an empty slot
export class Cerberus extends Pet {
    name = "Cerberus";
    tier = 6;
    pack: Pack = 'Unicorn';
    attack = 9;
    health = 9;
    initAbilities(): void {
        this.addAbility(new CerberusAbility(this, this.logService, this.abilityService));
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