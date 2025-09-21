import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { WoodpeckerAbility } from "../../../abilities/pets/star/tier-5/woodpecker-ability.class";

export class Woodpecker extends Pet {
    name = "Woodpecker";
    tier = 5;
    pack: Pack = 'Star';
    attack = 6;
    health = 5;

    initAbilities(): void {
        this.addAbility(new WoodpeckerAbility(this, this.logService));
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