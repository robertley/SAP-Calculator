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
        if (log.sourcePet && log.targetPet) {
            log.message = this.decorateAttackMessage(log.message, log.sourcePet, log.targetPet);
        }
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

    private getFrontIndex(pet: Pet): number | null {
        const parent = pet?.parent;
        if (!parent) {
            return null;
        }
        if (parent.pet0 === pet) {
            return 1;
        }
        if (parent.pet1 === pet) {
            return 2;
        }
        if (parent.pet2 === pet) {
            return 3;
        }
        if (parent.pet3 === pet) {
            return 4;
        }
        if (parent.pet4 === pet) {
            return 5;
        }
        return null;
    }

    private decorateAttackMessage(message: string, sourcePet: Pet, targetPet: Pet): string {
        const sourceIndex = this.getFrontIndex(sourcePet);
        const targetIndex = this.getFrontIndex(targetPet);
        if (sourceIndex == null || targetIndex == null) {
            return message;
        }
        const sourceLabel = sourcePet.parent?.isOpponent ? 'O' : 'P';
        const targetLabel = targetPet.parent?.isOpponent ? 'O' : 'P';
        const sourceToken = `__SRC__${sourcePet.name}__`;
        let updated = this.replaceFirst(message, sourcePet.name, sourceToken);
        updated = this.replaceFirst(
            updated,
            targetPet.name,
            `${targetLabel}${targetIndex} ${targetPet.name}`
        );
        return updated.replace(sourceToken, `${sourceLabel}${sourceIndex} ${sourcePet.name}`);
    }

    private replaceFirst(source: string, search: string, replacement: string): string {
        const index = source.indexOf(search);
        if (index === -1) {
            return source;
        }
        return source.slice(0, index) + replacement + source.slice(index + search.length);
    }

    printState(player: Player, opponent: Player, message?: string) {
        if (message) {
            this.createLog({
                message: message,
                type: 'board'
            });
        }
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
