import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Strawberry } from "../../../equipment/star/strawberry.class";

export class Pheasant extends Pet {
    name = "Pheasant";
    tier = 1;
    pack: Pack = 'Star';
    attack = 2;
    health = 1;
    maxAbilityUses = null;
    
    friendSummoned(gameApi: GameAPI, pet: Pet, tiger?: boolean): void {
        if (this.abilityUses < this.level) {
            pet.equipment = new Strawberry();
            this.abilityUses++;
            
            this.logService.createLog({
                message: `${this.name} gave ${pet.name} Strawberry perk`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            });
        }
        
        super.superFriendSummoned(gameApi, pet, tiger);
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
        this.maxAbilityUses = this.level;
    }
}