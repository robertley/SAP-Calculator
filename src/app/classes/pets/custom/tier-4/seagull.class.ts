import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { PetService } from "../../../../services/pet/pet.service";
import { GameService } from "../../../../services/game.service";
import { SeagullAbility } from "../../../abilities/pets/custom/tier-4/seagull-ability.class";

export class Seagull extends Pet {
    name = "Seagull";
    tier = 4;
    pack: Pack = 'Custom';
    attack = 4;
    health = 3;
    initAbilities(): void {
        this.addAbility(new SeagullAbility(this, this.logService));
        super.initAbilities();
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService,
        protected gameService: GameService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment, triggersConsumed?: number) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
    }

}