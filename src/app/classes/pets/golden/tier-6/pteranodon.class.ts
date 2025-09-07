import { cloneDeep, shuffle, sum } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { PetService } from "../../../../services/pet.service";

export class Pteranodon extends Pet {
    name = "Pteranodon";
    tier = 6;
    pack: Pack = 'Golden';
    attack = 3;
    health = 5;
    friendFaints(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (!this.alive) {
            return;
        } 
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        if (pet.name == this.name) {
            return;
        }
        
        let summonPet = this.petService.createPet(
            {
                attack: 1,
                health: 1,
                equipment: null,
                exp: pet.exp,
                name: pet.name,
                mana: 0
            }, this.parent
        );
        let result = this.parent.summonPetBehind(this, summonPet);
        if (result.success) {
            this.logService.createLog({
                message: `${this.name} summoned a 1/1 ${pet.name} behind it.`,
                type: 'ability',
                player: this.parent,
                randomEvent: result.randomEvent,
                tiger: tiger,
            })
            this.abilityService.triggerFriendSummonedEvents(summonPet);
        }
        
        this.abilityUses++;
        this.superFriendFaints(gameApi, pet, tiger);
        //debug 
        // this.logService.printState(gameApi.player, gameApi.opponet);
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
    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = this.level;
    }

}