import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";

export class Platybelodon extends Pet {
    name = "Platybelodon";
    tier = 4;
    pack: Pack = 'Custom';
    attack = 3;
    health = 5;
    
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        // Get roll amount from gameApi
        let rollAmount = 0;
        
        // Determine if this is player's pet or opponent's pet and get appropriate roll count
        if (this.parent === gameApi.player) {
            rollAmount = gameApi.playerRollAmount || 0;
        } else if (this.parent === gameApi.opponet) {
            rollAmount = gameApi.opponentRollAmount || 0;
        }
        
        let trumpetsGained =this.level * Math.min( rollAmount, 8);
        
        if (trumpetsGained > 0) {
            this.parent.gainTrumpets(trumpetsGained, this, tiger);
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