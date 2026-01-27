import { Injectable } from '@angular/core';
import { Log } from '../interfaces/log.interface';
import {
  getAllEquipmentNames,
  getAllPetNames,
  getAllToyNames,
  getEquipmentIconPath,
  getPetIconPath,
  getToyIconPath,
} from '../util/asset-utils';
import { Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { AILMENT_CATEGORIES } from './equipment/equipment-categories';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  private logs: Log[] = [];
  private petNameRegex: RegExp;
  private toyNameRegex: RegExp;
  private equipmentNameRegex: RegExp;
  private ailmentNames: Set<string>;
  private enabled = true;
  private deferDecorations = false;
  constructor() {
    this.petNameRegex = this.buildNameRegex(getAllPetNames());
    this.toyNameRegex = this.buildNameRegex(getAllToyNames());
    this.equipmentNameRegex = this.buildNameRegex(getAllEquipmentNames());
    this.ailmentNames = new Set(
      Object.values(AILMENT_CATEGORIES).flat().filter(Boolean),
    );
  }

  setEnabled(enabled: boolean) {
    this.enabled = Boolean(enabled);
    if (!this.enabled) {
      this.logs = [];
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  setDeferDecorations(enabled: boolean) {
    this.deferDecorations = Boolean(enabled);
  }

  isDeferDecorations(): boolean {
    return this.deferDecorations;
  }

  decorateLogIfNeeded(log: Log) {
    if (!log || log.decorated || !log.rawMessage) {
      return;
    }
    const message = this.decorateMessageWithNames(
      log.rawMessage,
      log.sourcePet,
      log.targetPet,
      log.sourceIndex,
      log.targetIndex,
    );
    log.message = this.decorateInlineIcons(message);
    log.decorated = true;
  }

  createLog(log: Log) {
    if (!this.enabled) {
      return;
    }
    if (log.message?.startsWith('Phase ')) {
      log.bold = true;
    }
    // Fallback for auto-decoration if sourcePet is missing but we have player/message
    if (!log.sourcePet && log.player && log.message) {
      const possiblePets = log.player.petArray.filter(
        (p) => p && log.message.startsWith(p.name),
      );
      if (possiblePets.length === 1) {
        log.sourcePet = possiblePets[0] as Pet;
      }
    }
    if (log.type === 'attack' && log.player && log.message) {
      this.resolveAttackPetsFromMessage(log);
    }
    if (log.sourcePet && log.sourceIndex == null) {
      log.sourceIndex = this.getFrontIndex(log.sourcePet) ?? undefined;
    }
    if (log.targetPet && log.targetIndex == null) {
      log.targetIndex = this.getFrontIndex(log.targetPet) ?? undefined;
    }

    let message = log.message ?? '';
    if (!this.deferDecorations) {
      message = this.decorateMessageWithNames(
        message,
        log.sourcePet,
        log.targetPet,
        log.sourceIndex,
        log.targetIndex,
      );
    }

    if (log.tiger) {
      message += ' (Tiger)';
    }
    if (log.puma) {
      message += ' (Puma)';
    }
    if (log.pteranodon) {
      message += ' (Pteranodon)';
    }
    if (log.pantherMultiplier != null && log.pantherMultiplier > 1) {
      message += ` x${log.pantherMultiplier} (Panther)`;
    }

    if (message) {
      if (this.deferDecorations) {
        log.rawMessage = message;
        log.message = message;
        log.decorated = false;
      } else {
        log.message = this.decorateInlineIcons(message);
        log.decorated = true;
      }
    }

    const lastLog = this.logs[this.logs.length - 1];
    const samePlayer = lastLog?.player === log.player;
    const sameMessage = lastLog?.message?.trim() === log.message?.trim();
    const sameRandom = lastLog?.randomEvent === log.randomEvent;
    const sameSource =
      lastLog?.sourcePet === log.sourcePet &&
      lastLog?.sourceIndex === log.sourceIndex;
    const sameTarget =
      lastLog?.targetPet === log.targetPet &&
      lastLog?.targetIndex === log.targetIndex;
    const hasSourceOrTarget =
      log.sourcePet != null ||
      log.targetPet != null ||
      log.sourceIndex != null ||
      log.targetIndex != null;

    if (
      lastLog &&
      sameMessage &&
      samePlayer &&
      sameRandom &&
      (!hasSourceOrTarget || (sameSource && sameTarget))
    ) {
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

  private decorateAttackMessage(
    message: string,
    sourcePet: Pet,
    targetPet: Pet,
    sourceIndexOverride?: number,
    targetIndexOverride?: number,
  ): string {
    const sourceIndex =
      sourceIndexOverride ?? this.getFrontIndex(sourcePet);
    const targetIndex =
      targetIndexOverride ?? this.getFrontIndex(targetPet);
    if (sourceIndex == null || targetIndex == null) {
      return message;
    }

    const sourceLabel = sourcePet.parent?.isOpponent ? 'O' : 'P';
    const targetLabel = targetPet.parent?.isOpponent ? 'O' : 'P';

    const sourceFullLabel = `${sourceLabel}${sourceIndex} ${sourcePet.name}`;
    const targetFullLabel = `${targetLabel}${targetIndex} ${targetPet.name}`;

    // If names are the same, we must use unique tokens during replacement to avoid recursion/clobbering
    const SOURCE_HOLDER = '___SOURCE_HOLDER___';
    const TARGET_HOLDER = '___TARGET_HOLDER___';

    let updated = this.replaceFirst(message, sourcePet.name, SOURCE_HOLDER);
    updated = this.replaceFirst(updated, targetPet.name, TARGET_HOLDER);

    updated = updated.replace(SOURCE_HOLDER, sourceFullLabel);
    updated = updated.replace(TARGET_HOLDER, targetFullLabel);

    return updated;
  }

  private decorateMessageWithNames(
    message: string,
    sourcePet?: Pet,
    targetPet?: Pet,
    sourceIndex?: number,
    targetIndex?: number,
  ): string {
    if (!message) {
      return message;
    }
    if (sourcePet && targetPet) {
      return this.decorateAttackMessage(
        message,
        sourcePet,
        targetPet,
        sourceIndex,
        targetIndex,
      );
    }
    if (sourcePet) {
      if (sourceIndex != null) {
        const label = sourcePet.parent?.isOpponent ? 'O' : 'P';
        const fullLabel = `${label}${sourceIndex} ${sourcePet.name}`;
        return this.replaceFirst(message, sourcePet.name, fullLabel);
      }
      return this.decorateMessage(message, sourcePet);
    }
    return message;
  }

  private replaceFirst(
    source: string,
    search: string,
    replacement: string,
  ): string {
    const index = source.indexOf(search);
    if (index === -1) {
      return source;
    }
    return (
      source.slice(0, index) + replacement + source.slice(index + search.length)
    );
  }

  private decorateInlineIcons(message: string): string {
    if (!message || message.includes('<img')) {
      return message;
    }
    let updated = this.replaceMatchesWithIcons(
      message,
      this.petNameRegex,
      (name) => getPetIconPath(name),
    );
    updated = this.replaceMatchesWithIcons(updated, this.toyNameRegex, (name) =>
      getToyIconPath(name),
    );
    updated = this.replaceMatchesWithIcons(
      updated,
      this.equipmentNameRegex,
      (name) => {
        const isAilment = this.isAilmentName(name);
        return (
          getEquipmentIconPath(name, isAilment) ??
          getEquipmentIconPath(name, !isAilment)
        );
      },
      (name) => {
        const isAilment = this.isAilmentName(name);
        const primary = getEquipmentIconPath(name, isAilment);
        if (!primary) {
          return null;
        }
        const secondary = getEquipmentIconPath(name, !isAilment);
        const secondaryAttr = secondary
          ? `this.dataset.step='1';this.src='${secondary}';`
          : `this.dataset.step='1';`;
        return `<img src="${primary}" class="log-inline-icon" alt="${name}" onerror="if(!this.dataset.step){${secondaryAttr}return;}this.remove();"> ${name}`;
      },
    );
    const manaIcon = 'assets/art/Public/Public/Icons/TextMap-resources.assets-31-split/mana.png';
    const manaRegex = /(?<![A-Za-z0-9])mana(?![A-Za-z0-9])(?!\s+Potion)/gi;
    updated = this.replaceMatchesWithIcons(updated, manaRegex, () => manaIcon);
    return updated;
  }

  private resolveAttackPetsFromMessage(log: Log): void {
    if (!log?.message || !log.player) {
      return;
    }
    if (log.sourcePet && log.targetPet) {
      return;
    }
    const message = log.message;
    const snipedMatch = /^(.+?)\s+sniped\s+(.+?)\s+for\s+/i.exec(message);
    const attackMatch =
      /^(.+?)\s+(?:jump-)?attacks?\s+(.+?)\s+for\s+/i.exec(message);
    const match = snipedMatch ?? attackMatch;
    if (!match) {
      return;
    }
    const sourceName = match[1].trim();
    const targetName = match[2].trim();
    const playerPets = log.player.petArray ?? [];
    const opponentPets = log.player.opponent?.petArray ?? [];

    if (!log.sourcePet) {
      log.sourcePet =
        playerPets.find((pet) => pet?.name === sourceName) ?? null;
    }
    if (!log.targetPet) {
      log.targetPet =
        opponentPets.find((pet) => pet?.name === targetName) ??
        playerPets.find((pet) => pet?.name === targetName) ??
        null;
    }
  }

  private isAilmentName(name: string): boolean {
    return this.ailmentNames.has(name);
  }

  private replaceMatchesWithIcons(
    message: string,
    regex: RegExp,
    getIcon: (name: string) => string | null,
    getHtml?: (name: string, icon: string | null) => string | null,
  ): string {
    if (!regex) {
      return message;
    }
    return message.replace(regex, (match) => {
      const icon = getIcon(match);
      if (getHtml) {
        const html = getHtml(match, icon);
        if (html) {
          return html;
        }
      }
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
    return new RegExp(
      `(?<![A-Za-z0-9])(${escaped.join('|')})(?![A-Za-z0-9])`,
      'g',
    );
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  printState(player: Player, opponent: Player, message?: string) {
    if (!this.enabled) {
      return;
    }
    if (message) {
      this.createLog({
        message: message,
        type: 'board',
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
      type: 'board',
    });
  }

  getPetText(pet?: Pet) {
    if (pet == null) {
      return '___ (-/-) ';
    }
    const index = this.getFrontIndex(pet);
    const label =
      index != null ? `${pet.parent?.isOpponent ? 'O' : 'P'}${index} ` : '';
    const iconPath = getPetIconPath(pet.name);
    const petDisplay = iconPath
      ? `<img src="${iconPath}" class="log-pet-icon" alt="${pet.name}">`
      : '';
    const equipmentName =
      typeof (pet.equipment as { name?: string })?.name === 'string'
        ? (pet.equipment as { name?: string }).name
        : null;
    const equipmentDisplay = equipmentName
      ? (() => {
          const isAilment = this.isAilmentName(equipmentName);
          const primary =
            getEquipmentIconPath(equipmentName, isAilment) ??
            getEquipmentIconPath(equipmentName, !isAilment);
          if (!primary) {
            return '';
          }
          const secondary = getEquipmentIconPath(equipmentName, !isAilment);
          const secondaryAttr = secondary
            ? `this.dataset.step='1';this.src='${secondary}';`
            : `this.dataset.step='1';`;
          return `<img src="${primary}" class="log-inline-icon" alt="${equipmentName}" onerror="if(!this.dataset.step){${secondaryAttr}return;}this.remove()">`;
        })()
      : '';

    return `${label}${petDisplay}${equipmentDisplay}(${pet.attack}/${pet.health}) `;
  }
}
