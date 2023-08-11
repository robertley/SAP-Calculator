import { getOpponent } from "app/util/helper-functions";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { PetService } from "../../../../services/pet.service";

// TODO
// Research tiger behavior
export class Whale extends Pet {
    name = "Whale";
    tier = 4;
    pack: Pack = 'Turtle';
    attack = 3;
    health = 8;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let targetPet = this.petAhead;
        if (!targetPet) {
            return;
        }
        targetPet.exp = this.exp;
        this.swallowedPets.push(this.petService.createDefaultVersionOfPet(targetPet));
        targetPet.health = 0;
        this.logService.createLog({
            message: `${this.name} swallowed ${targetPet.name}`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        });
        this.superStartOfBattle(gameApi, tiger);
    }
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        for (let pet of this.swallowedPets) {
            this.abilityService.setSpawnEvent({
                callback: () => {
                    this.logService.createLog({
                        message: `${this.name} summoned ${pet.name} (level ${this.level}).`,
                        type: 'ability',
                        player: this.parent,
                        tiger: tiger,
                        pteranodon: pteranodon
                    })
                    this.parent.summonPet(pet, this.savedPosition);
                },
                priority: this.attack,
                player: this.parent
            })

        }
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, equipment);
    }
}