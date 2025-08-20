import { cloneDeep } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { PetService } from "../../../../services/pet.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

function levelToExp(level: number) {
    return level == 1 ? 0 : level == 2 ? 2 : 5;
}

export class SilkySifaka extends Pet {
    name = "Silky Sifaka";
    tier = 6;
    pack: Pack = 'Danger';
    attack = 4;
    health = 6;

    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        //TO DO: Add "Ammonite"
        let sifakaPool = [
            "Mammoth", "Lionfish",  "Orca", "Sabertooth Tiger",
            "Warthog", "Hydra", "Phoenix", "Bay Cat", "Walrus"
        ];
        
        let petsBehind = [];
        let currentPet = this.petBehind();
        while (currentPet && petsBehind.length < 2) {
            petsBehind.push(currentPet);
            currentPet = currentPet.petBehind();
        }
        
        // Transform each friend behind
        for (let targetPet of petsBehind) {
            let randomPetName = sifakaPool[Math.floor(Math.random() * sifakaPool.length)];
            let newPet = this.petService.createPet({
                name: randomPetName,
                attack: targetPet.attack,
                health: targetPet.health,
                mana: targetPet.mana,
                exp: levelToExp(this.level),
                equipment: targetPet.equipment
            }, this.parent);
            
            this.parent.transformPet(targetPet, newPet);
            
            this.logService.createLog({
                message: `${this.name} transformed ${targetPet.name} into level ${this.level} ${newPet.name}`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: true
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