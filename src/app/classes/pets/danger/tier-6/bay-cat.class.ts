import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { PetService } from "../../../../services/pet.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class BayCat extends Pet {
    name = "Bay Cat";
    tier = 6;
    pack: Pack = 'Danger';
    attack = 7;
    health = 5;

    afterFaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let bayPool = [
            "Skunk", "Fossa", "Kraken", "Lynx", "Humphead Wrasse", "Goblin Shark", "Red Lipped Batfish", "Platybelodon" , "Tasmanian Devil"          
        ];
        
        for (let i = 0; i < this.level; i++) {
            let petName = bayPool[Math.floor(Math.random() * bayPool.length)];
            let summonedPet = this.petService.createPet({
                name: petName,
                attack: null,
                health: null,
                equipment: null,
                mana: 0,
                exp: 0
            }, this.parent);
            
            let summonResult = this.parent.summonPet(summonedPet, this.savedPosition, false, this);
            if (summonResult.success) {
                this.logService.createLog({
                    message: `${this.name} summoned ${summonedPet.name}`,
                    type: 'ability',
                    player: this.parent,
                    tiger: tiger,
                    pteranodon: pteranodon,
                    randomEvent: true
                });
                
                // Activate start of battle ability
                if (summonedPet.startOfBattle) {
                    this.logService.createLog({
                        message: `${summonedPet.name} activated its start of battle ability`,
                        type: 'ability',
                        player: this.parent,
                        tiger: tiger,
                        pteranodon: pteranodon
                    });
                    summonedPet.startOfBattle(gameApi, tiger);               
                }
                
                this.abilityService.triggerFriendSummonedEvents(summonedPet);
            }
        }
        
        this.superAfterFaint(gameApi, tiger);
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