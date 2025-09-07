import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { PetService } from "../../../../services/pet.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Takhi extends Pet {
    name = "Takhi";
    tier = 2;
    pack: Pack = 'Danger';
    attack = 2;
    health = 2;

    afterFaint(gameApi: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let attackValue = this.level * 3;
        let healthValue = this.level * 2;
        
        let africanWildDog = this.petService.createPet({
            name: 'African Wild Dog',
            attack: attackValue,
            health: healthValue,
            exp: 0,
            mana: 0,
            equipment: null
        }, this.parent);
        
        if (africanWildDog) {
            let summonResult = this.parent.summonPet(africanWildDog, this.savedPosition, false, this);
            if (summonResult.success) {
                this.logService.createLog({
                    message: `${this.name} summoned a ${africanWildDog.attack}/${africanWildDog.health} ${africanWildDog.name}`,
                    type: 'ability',
                    player: this.parent,
                    tiger: tiger,
                    pteranodon: pteranodon,
                    randomEvent: summonResult.randomEvent
                });
                
                this.abilityService.triggerFriendSummonedEvents(africanWildDog);
                africanWildDog.startOfBattle(gameApi, tiger);               
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