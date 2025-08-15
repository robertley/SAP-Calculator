import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { PetService } from "../../../../services/pet.service";
import { getRandomInt } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class IriomoteCat extends Pet {
    name = "Iriomote Cat";
    tier = 1;
    pack: Pack = 'Danger';
    attack = 2;
    health = 2;
    beforeStartOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let allTier1Pets = this.petService.allPets.get(this.level);
        let randomIndex = getRandomInt(0, allTier1Pets.length - 1);
        let randomPetName = allTier1Pets[randomIndex];
        
        let transformedPet = this.petService.createPet({
            name: randomPetName,
            attack: this.attack,
            health: this.health,
            exp: this.exp,
            equipment: this.equipment,
            mana: this.mana
        }, this.parent);
        
        this.logService.createLog({
            message: `${this.name} transformed into a ${randomPetName}.`,
            type: 'ability',
            player: this.parent,
            randomEvent: true
        });
        
        this.parent.transformPet(this, transformedPet);
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