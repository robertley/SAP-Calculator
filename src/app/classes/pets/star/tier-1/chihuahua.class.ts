import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Chihuahua extends Pet {
    name = "Chihuahua";
    tier = 1;
    pack: Pack = 'Star';
    attack = 4;
    health = 1;

    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        const opponent = this.parent.opponent;
        
        const targetInfo = opponent.getHighestHealthPet();
        const target = targetInfo.pet;

        if (target) {
            const spaces = this.level;
            
            this.logService.createLog({
                message: `${this.name} pushed ${target.name} forward ${spaces} space(s).`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: targetInfo.random 
            });

            opponent.pushPet(target, spaces);
        }

        this.superStartOfBattle(gameApi, tiger);
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