import { getOpponent } from "app/util/helper-functions";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { PetService } from "../../../../services/pet.service";
import { clone } from "lodash";

// TODO
// Research tiger behavior
export class Whale extends Pet {
    name = "Whale";
    tier = 4;
    pack: Pack = 'Turtle';
    attack = 3;
    health = 7;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let targetPet = this.petAhead;
        if (!targetPet) {
            return;
        }
        let swallowPet = clone(targetPet);
        swallowPet.exp = this.exp;
        swallowPet.removePerk();
        this.swallowedPets.push(swallowPet);
        targetPet.health = 0;
        this.logService.createLog({
            message: `${this.name} swallowed ${targetPet.name}`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        });
        this.superStartOfBattle(gameApi, tiger);
    }
    afterFaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        for (let pet of this.swallowedPets) {
            this.logService.createLog({
                message: `${this.name} summoned ${pet.name} (level ${pet.level}).`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon
            })
            this.parent.summonPet(pet, this.savedPosition);
            this.abilityService.triggerSummonedEvents(pet);
        }
        super.superAfterFaint(gameApi, tiger, pteranodon);
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