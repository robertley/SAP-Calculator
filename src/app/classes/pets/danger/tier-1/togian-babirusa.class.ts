import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class TogianBabirusa extends Pet {
    name = "Togian Babirusa";
    tier = 1;
    pack: Pack = 'Danger';
    attack = 4;
    health = 3;

    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let target = this.parent.opponent.getRandomPet();
        
        if (target) {  // getRandomPet returns null if no living pets
            target.increaseAttack(1);  // Fixed +1, not this.level * 1
            target.increaseHealth(1);  // Fixed +1, not this.level * 1
            
            this.logService.createLog({
                message: `${this.name} gave ${target.name} +1 attack and +1 health.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon
            });
        }
        
        this.superFaint(gameApi, tiger);
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