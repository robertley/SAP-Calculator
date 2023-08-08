import { shuffle } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Coconut } from "../../../equipment/turtle/coconut.class";

export class Velociraptor extends Pet {
    name = "Velociraptor";
    tier = 6;
    pack: Pack = 'Star';
    attack = 3;
    health = 2;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let strawberryPets = this.parent.getPetsWithEquipment('Strawberry').filter(pet => { 
            return pet !== this && pet.alive
        });
        strawberryPets = shuffle(strawberryPets);
        let coconutPets: Pet[] = [];
        for (let i = 0; i < this.level; i++) {
            let pet = strawberryPets[i];
            if (pet == null) {
                break;
            }
            coconutPets.push(strawberryPets[i]);
        }
        for (let pet of coconutPets) {
            pet.givePetEquipment(new Coconut());
            this.logService.createLog({
                message: `${this.name} gave ${pet.name} Coconut.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: this.level < strawberryPets.length
            })
        }
        
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, equipment);
    }
}