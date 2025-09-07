import { getOpponent } from "app/util/helper-functions";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { PetService } from "../../../../services/pet.service";
import { clone } from "lodash";

export class Whale extends Pet {
    name = "Whale";
    tier = 4;
    pack: Pack = 'Turtle';
    attack = 3;
    health = 7;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let targetsAheadResp = this.parent.nearestPetsAhead(1, this);
        if (targetsAheadResp.pets.length === 0) {
            return;
        }
        let targetPet = targetsAheadResp.pets[0];
        let swallowPet = this.petService.createPet({
            name: targetPet.name,
            attack: targetPet.attack,
            health: targetPet.health,
            exp: this.exp,
            equipment: null,
            mana: 0
        }, this.parent);
        this.swallowedPets.push(swallowPet);
        targetPet.health = 0;
        this.logService.createLog({
            message: `${this.name} swallowed ${targetPet.name}`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: targetsAheadResp.random
        });
        this.superStartOfBattle(gameApi, tiger);
    }
    //TO DO: Move this inside sob ability
    afterFaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        while (this.swallowedPets.length > 0) {
            let pet = this.swallowedPets.shift();
            
            let summonResult = this.parent.summonPet(pet, this.savedPosition, false, this);
            
            if (summonResult.success) {
                this.logService.createLog({
                    message: `${this.name} summoned ${pet.name} (level ${pet.level}).`,
                    type: 'ability',
                    player: this.parent,
                    tiger: tiger,
                    pteranodon: pteranodon,
                    randomEvent: summonResult.randomEvent
                })
                
                this.abilityService.triggerFriendSummonedEvents(pet);
            }       
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