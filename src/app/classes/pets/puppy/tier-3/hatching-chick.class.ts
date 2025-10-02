import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { HatchingChickAbility } from "../../../abilities/pets/puppy/tier-3/hatching-chick-ability.class";

export class HatchingChick extends Pet {
    name = "Hatching Chick";
    tier = 3;
    pack: Pack = 'Puppy';
    attack = 2;
    health = 2;
    initAbilities(): void {
        this.addAbility(new HatchingChickAbility(this, this.logService, this.abilityService));
        super.initAbilities();
    }
    // endTurn(gameApi: GameAPI): void {
    //     if (this.level > 1) {
    //         return;
    //     }
    //     let target = this.petAhead;
    //     if (target == null) {
    //         return;
    //     }

    //     target.increaseAttack(3);
    //     target.increaseHealth(3);
    //     this.logService.createLog({
    //         message: `${this.name} gave ${target.name} ${3} attack and ${3} health.`,
    //         type: 'ability',
    //         player: this.parent
    //     })
    // }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
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