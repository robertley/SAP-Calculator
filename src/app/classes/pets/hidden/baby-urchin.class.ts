import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment } from "../../equipment.class";
import { Pack, Pet } from "../../pet.class";
import { Player } from "../../player.class";

export class BabyUrchin extends Pet {
    name = "Baby Urchin";
    tier = 2;
    pack: Pack = 'Star';
    attack = 2;
    health = 1;
    
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let targets = [this.parent.opponent.furthestUpPet];
        if (targets[0] == null) {
            this.superFaint(gameApi, tiger);
            return;
        }
        
        for (let i = 0; i < this.level - 1; i++) {
            let currTarget = targets[i];
            let target = currTarget.petBehind();
            if (target == null) {
                break;
            }
            targets.push(target);
        }
        
        for (let target of targets) {
            target.increaseHealth(-4);
            this.logService.createLog({
                message: `${this.name} removed 4 health from ${target.name}.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon,
            })
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