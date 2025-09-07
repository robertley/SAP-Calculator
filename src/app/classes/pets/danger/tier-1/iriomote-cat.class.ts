import { cloneDeep } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { PetService } from "../../../../services/pet.service";
import { getRandomInt } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
//TO DO: Add all pets tier 1-3
export class IriomoteCat extends Pet {
    name = "Iriomote Cat";
    tier = 1;
    pack: Pack = 'Danger';
    attack = 2;
    health = 2;
    beforeStartOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let targetResp = this.parent.getThis(this);
        let target = targetResp.pet;
        
        if (!target || !target.alive) {
            return;
        }
        
        let allTierXPets = this.petService.allPets.get(this.level);
        let randomIndex = getRandomInt(0, allTierXPets.length - 1);
        let randomPetName = allTierXPets[randomIndex];
        
        let transformedPet = this.petService.createPet({
            name: randomPetName,
            attack: target.attack,
            health: target.health,
            exp: target.exp,
            equipment: target.equipment,
            mana: target.mana
        }, this.parent);
        
        this.logService.createLog({
            message: `${this.name} transformed ${target.name} into a ${randomPetName}.`,
            type: 'ability',
            player: this.parent,
            randomEvent: true
        });
        
        this.parent.transformPet(target, transformedPet);
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