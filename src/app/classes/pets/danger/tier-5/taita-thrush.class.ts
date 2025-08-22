import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class TaitaThrush extends Pet {
    name = "Taita Thrush";
    tier = 5;
    pack: Pack = 'Danger';
    attack = 3;
    health = 4;

    adjacentAttacked(gameApi: GameAPI, pet: Pet, tiger?: boolean): void {
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        
        let power = this.level; // 1/2/3 based on level
        
        // Get all friends (excluding self)
        let friends = this.parent.petArray.filter(friend => friend !== this && friend.alive);
        
        for (let friend of friends) {
            friend.increaseAttack(power);
            friend.increaseHealth(power);
            
            this.logService.createLog({
                message: `${this.name} gave ${friend.name} +${power} attack and +${power} health`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            });
        }
        
        this.abilityUses++;
        this.superAdjacentAttacked(gameApi, pet, tiger);
    }

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = 3; // 3 times per turn
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
    }
}