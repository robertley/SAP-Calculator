import { Injectable } from "@angular/core";
import { Log } from "../interfaces/log.interface";
import { getAllEquipmentNames, getAllPetNames, getAllToyNames, getEquipmentIconPath, getPetIconPath, getToyIconPath } from "../util/asset-utils";
import { Pet } from "app/classes/pet.class";
import { Player } from "app/classes/player.class";

@Injectable({
    providedIn: 'root'
})
export class LogService {
    private logs: Log[] = [];
    private petNameRegex: RegExp;
    private toyNameRegex: RegExp;
    private equipmentNameRegex: RegExp;
    constructor() {
        this.petNameRegex = this.buildNameRegex(getAllPetNames());
        this.toyNameRegex = this.buildNameRegex(getAllToyNames());
        this.equipmentNameRegex = this.buildNameRegex(getAllEquipmentNames());

    }

    createLog(log: Log) {
        if (log.message?.startsWith('Phase ')) {
            log.bold = true;
        }
        // Fallback for auto-decoration if sourcePet is missing but we have player/message
        if (!log.sourcePet && log.player && log.message) {
            const possiblePets = log.player.petArray.filter(p => p && log.message.startsWith(p.name));
            if (possiblePets.length === 1) {
                log.sourcePet = possiblePets[0] as Pet;
            }
        }

        if (log.sourcePet && log.targetPet) {
            log.message = this.decorateAttackMessage(log.message, log.sourcePet, log.targetPet);
        } else if (log.sourcePet) {
            log.message = this.decorateMessage(log.message, log.sourcePet);
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

        if (log.message) {
            log.message = this.decorateInlineIcons(log.message);
        }

        const lastLog = this.logs[this.logs.length - 1];
        const samePlayer = lastLog?.player === log.player;
        const sameMessage = lastLog?.message?.trim() === log.message?.trim();
        const sameRandom = lastLog?.randomEvent === log.randomEvent;

        if (lastLog && sameMessage && samePlayer && sameRandom) {
            lastLog.count = (lastLog.count ?? 1) + 1;
        } else {
            this.logs.push(log);
        }
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

    private decorateMessage(message: string, pet: Pet): string {
        const index = this.getFrontIndex(pet);
        if (index == null) {
            return message;
        }
        const label = pet.parent?.isOpponent ? 'O' : 'P';
        const fullLabel = `${label}${index} ${pet.name}`;
        return this.replaceFirst(message, pet.name, fullLabel);
    }

    private decorateAttackMessage(message: string, sourcePet: Pet, targetPet: Pet): string {
        const sourceIndex = this.getFrontIndex(sourcePet);
        const targetIndex = this.getFrontIndex(targetPet);
        if (sourceIndex == null || targetIndex == null) {
            return message;
        }

        const sourceLabel = sourcePet.parent?.isOpponent ? 'O' : 'P';
        const targetLabel = targetPet.parent?.isOpponent ? 'O' : 'P';

        const sourceFullLabel = `${sourceLabel}${sourceIndex} ${sourcePet.name}`;
        const targetFullLabel = `${targetLabel}${targetIndex} ${targetPet.name}`;

        // If names are the same, we must use unique tokens during replacement to avoid recursion/clobbering
        const SOURCE_HOLDER = "___SOURCE_HOLDER___";
        const TARGET_HOLDER = "___TARGET_HOLDER___";

        let updated = this.replaceFirst(message, sourcePet.name, SOURCE_HOLDER);
        updated = this.replaceFirst(updated, targetPet.name, TARGET_HOLDER);

        updated = updated.replace(SOURCE_HOLDER, sourceFullLabel);
        updated = updated.replace(TARGET_HOLDER, targetFullLabel);

        return updated;
    }

    private replaceFirst(source: string, search: string, replacement: string): string {
        const index = source.indexOf(search);
        if (index === -1) {
            return source;
        }
        return source.slice(0, index) + replacement + source.slice(index + search.length);
    }

    private decorateInlineIcons(message: string): string {
        if (!message || message.includes('<img')) {
            return message;
        }
        let updated = this.replaceMatchesWithIcons(message, this.petNameRegex, (name) => getPetIconPath(name));
        updated = this.replaceMatchesWithIcons(updated, this.toyNameRegex, (name) => getToyIconPath(name));
        updated = this.replaceMatchesWithIcons(updated, this.equipmentNameRegex, (name) => {
            return getEquipmentIconPath(name) ?? getEquipmentIconPath(name, true);
        });
        return updated;
    }

    private replaceMatchesWithIcons(message: string, regex: RegExp, getIcon: (name: string) => string | null): string {
        if (!regex) {
            return message;
        }
        return message.replace(regex, (match) => {
            const icon = getIcon(match);
            if (!icon) {
                return match;
            }
            return `<img src="${icon}" class="log-inline-icon" alt="${match}" onerror="this.remove()"> ${match}`;
        });
    }

    private buildNameRegex(names: string[]): RegExp {
        const escaped = names
            .filter((name) => Boolean(name))
            .sort((a, b) => b.length - a.length)
            .map((name) => this.escapeRegExp(name));
        if (!escaped.length) {
            return null;
        }
        return new RegExp(`(?<![A-Za-z0-9])(${escaped.join('|')})(?![A-Za-z0-9])`, 'g');
    }

    private escapeRegExp(value: string): string {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
        const iconPath = getPetIconPath(pet.name);
        const petDisplay = iconPath ? `<img src="${iconPath}" class="log-pet-icon" alt="${pet.name}">` : '';

        return `${petDisplay}(${pet.attack}/${pet.health}) `;
    }
}
