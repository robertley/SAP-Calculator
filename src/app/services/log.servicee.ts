import { Injectable } from "@angular/core";
import { Log } from "../interfaces/log.interface";
import { Pet } from "app/classes/pet.class";
import { Player } from "app/classes/player.class";

@Injectable({
    providedIn: 'root'
})
export class LogService {
    private logs: Log[] = [];
    constructor() {

    }

    createLog(log: Log) {
        if (log.tiger) {
            log.message += " (Tiger)"
        }
        if (log.puma) {
            log.message += " (Puma)"
        }
        if (log.pteranodon) {
            log.message += " (Pteranodon)"
        }
        if (log.pantherMultiplier != null && log.pantherMultiplier > 1) {
            log.message += ` x${log.pantherMultiplier} (Panther)`
        }
        this.logs.push(log);
    }

    getLogs() {
        return this.logs;
    }

    reset() {
        this.logs = [];
    }

    printState(player: Player, opponent: Player) {
        let playerState = '';
        playerState += this.getPetText(player.pet4);
        playerState += this.getPetText(player.pet3);
        playerState += this.getPetText(player.pet2);
        playerState += this.getPetText(player.pet1);
        playerState += this.getPetText(player.pet0);
        let opponentState = '';
        opponentState += this.getPetText(opponent.pet0);
        opponentState += this.getPetText(opponent.pet1);
        opponentState += this.getPetText(opponent.pet2);
        opponentState += this.getPetText(opponent.pet3);
        opponentState += this.getPetText(opponent.pet4);
    
        this.createLog({
          message: `${playerState}| ${opponentState}`,
          type: 'board'
        });
        
      }

      
    getPetText(pet?: Pet) {
        if (pet == null) {
        return '___ (-/-) ';
        }
        let abbrev = pet.name.substring(0, 3);
        // return `${abbrev}${pet.equipment ? `<${pet.equipment.name.substring(0,2)}>` : ''} (${pet.attack}/${pet.health}) `;
        return `${abbrev} (${pet.attack}/${pet.health}) `;
    }
}