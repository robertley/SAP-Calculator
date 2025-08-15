import { clone, shuffle } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { PetService } from "../../../../services/pet.service";

export class RolowayMonkey extends Pet {
    name = "Roloway Monkey";
    tier = 3;
    pack: Pack = 'Danger';
    attack = 2;
    health = 5;

    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let targets = this.getPetsAhead(2, false);
        if (!targets || targets.length === 0) {
            return;
        }

        // Pool of useful hurt pets to transform into
        const petNames = ["Camel", "Peacock", "Porcupine", "Lizard", "Guineafowl"];

        for (let target of targets) {
            let randomIndex = Math.floor(Math.random() * petNames.length);
            let selectedPetName = petNames[randomIndex];
            
            let newPet = this.petService.createPet({
                name: selectedPetName,
                health: target.health,
                attack: target.attack,
                mana: target.mana,
                exp: this.exp,
                equipment: target.equipment
            }, this.parent);
            
            this.parent.transformPet(target, newPet);
            
            this.logService.createLog({
                message: `${this.name} transformed ${target.name} into a ${newPet.attack}/${newPet.health} ${newPet.name}.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            });
        }
        
        this.superStartOfBattle(gameApi, tiger);
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