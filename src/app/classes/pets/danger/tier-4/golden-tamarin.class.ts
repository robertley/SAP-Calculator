import { clone, cloneDeep, shuffle } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { PetService } from "../../../../services/pet.service";

export class GoldenTamarin extends Pet {
    name = "Golden Tamarin";
    tier = 4;
    pack: Pack = 'Danger';
    attack = 4;
    health = 4;

    beforeStartOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        // Golden Tamarin pool of tier 5+ Start of Battle pets
        const petNames = ["Crocodile", "Red Dragon",  "Salmon of Knowledge", "Sea Cucumber", "Werewolf", "Tarantula Hawk"];
        //TO DO: add  "Snow Leopard"
        let randomIndex = Math.floor(Math.random() * petNames.length);
        let selectedPetName = petNames[randomIndex];
        
        let newPet = this.petService.createPet({
            name: selectedPetName,
            health: this.health,
            attack: this.attack,
            mana: this.mana,
            exp: this.exp,
            equipment: this.equipment
        }, this.parent);
        
        this.parent.transformPet(this, newPet);
        
        this.logService.createLog({
            message: `${this.name} transformed into a ${newPet.attack}/${newPet.health} ${newPet.name}.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: true
        });
        
        this.superBeforeStartOfBattle(gameApi, tiger);
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