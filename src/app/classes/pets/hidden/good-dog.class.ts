import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment } from "../../equipment.class";
import { Pack, Pet } from "../../pet.class";
import { Player } from "../../player.class";
import { PetService } from "../../../services/pet.service";
import { GameService } from "../../../services/game.service";
import { GoodDogAbility } from "../../abilities/pets/hidden/good-dog-ability.class";
// TO DO: Add all perks
export class GoodDog extends Pet {
    name = "Good Dog";
    tier = 5;
    pack: Pack = 'Unicorn';
    attack = 3;
    health = 3;
    hidden: boolean = true;
    initAbilities(): void {
        this.addAbility(new GoodDogAbility(this, this.logService));
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