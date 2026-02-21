import { Injectable } from '@angular/core';
import { Log } from 'app/domain/interfaces/log.interface';
import {
  getAllEquipmentNames,
  getAllPetNames,
  getAllToyNames,
} from 'app/runtime/asset-catalog';
import { Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { AILMENT_CATEGORIES } from './equipment/equipment-categories';
import {
  buildInlineNameRegex,
  buildInlineNameTypeMap,
  buildNameRegex,
  decorateInlineIcons,
} from './log/log-inline-icons';
import { getMergedAttackHealthMessage } from './log/log-merge-utils';
import { buildBoardStateMessage } from './log/log-board-render';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  private logs: Log[] = [];
  private petNameRegex: RegExp;
  private toyNameRegex: RegExp;
  private equipmentNameRegex: RegExp;
  private inlineNameRegex: RegExp;
  private inlineNameTypeMap: Map<string, 'pet' | 'toy' | 'equipment'>;
  private ailmentNames: Set<string>;
  private enabled = true;
  private deferDecorations = false;
  private showTriggerNamesInLogs = false;
  private debugSummonBoardStateLogs = false;
  constructor() {
    const petNames = getAllPetNames();
    const toyNames = getAllToyNames();
    const equipmentNames = getAllEquipmentNames();
    this.petNameRegex = buildNameRegex(petNames);
    this.toyNameRegex = buildNameRegex(toyNames);
    this.equipmentNameRegex = buildNameRegex(equipmentNames);
    this.inlineNameTypeMap = buildInlineNameTypeMap(
      petNames,
      toyNames,
      equipmentNames,
    );
    this.inlineNameRegex = buildInlineNameRegex(
      petNames,
      toyNames,
      equipmentNames,
    );
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

  setShowTriggerNamesInLogs(enabled: boolean) {
    this.showTriggerNamesInLogs = Boolean(enabled);
  }

  isShowTriggerNamesInLogs(): boolean {
    return this.showTriggerNamesInLogs;
  }

  setDebugSummonBoardStateLogs(enabled: boolean) {
    this.debugSummonBoardStateLogs = Boolean(enabled);
  }

  isDebugSummonBoardStateLogs(): boolean {
    return this.debugSummonBoardStateLogs;
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
    log.message = decorateInlineIcons(
      message,
      this.inlineNameRegex,
      this.inlineNameTypeMap,
      this.ailmentNames,
    );
    log.decorated = true;
  }

  createLog(log: Log) {
    if (!this.enabled) {
      return;
    }
    if (log.message?.startsWith('Phase ')) {
      log.bold = true;
    }
    this.resolveLogMetadata(log);

    let message = this.decorateLogMessage(log);
    message = this.appendTagSuffixes(message, log);
    this.persistDecoratedMessage(log, message);

    const lastLog = this.logs[this.logs.length - 1];
    const shouldAppendSummonBoard = this.shouldAppendSummonBoardState(log);
    if (this.tryMergeAttackHealthLogs(lastLog, log)) {
      if (shouldAppendSummonBoard) {
        this.appendSummonBoardStateLog(log);
      }
      return;
    }
    if (this.shouldCollapseLog(lastLog, log)) {
      lastLog.count = (lastLog.count ?? 1) + 1;
    } else {
      this.logs.push(log);
    }

    if (shouldAppendSummonBoard) {
      this.appendSummonBoardStateLog(log);
    }
  }

  private resolveLogMetadata(log: Log): void {
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
    if (!log.randomEventReason && log.randomEvent === true) {
      log.randomEventReason = 'true-random';
    }
    if (log.player && log.message) {
      this.resolveSourceTargetFromMessage(log);
    }
    if (log.sourcePet && log.sourceIndex == null) {
      log.sourceIndex = this.getFrontIndex(log.sourcePet) ?? undefined;
    }
    if (log.targetPet && log.targetIndex == null) {
      log.targetIndex = this.getFrontIndex(log.targetPet) ?? undefined;
    }
  }

  private decorateLogMessage(log: Log): string {
    const message = log.message ?? '';
    if (this.deferDecorations) {
      return message;
    }
    return this.decorateMessageWithNames(
      message,
      log.sourcePet,
      log.targetPet,
      log.sourceIndex,
      log.targetIndex,
    );
  }

  private appendTagSuffixes(message: string, log: Log): string {
    let updated = message;
    if (log.tiger) {
      updated += ' (Tiger)';
    }
    if (log.puma) {
      updated += ' (Puma)';
    }
    if (log.pteranodon) {
      updated += ' (Pteranodon)';
    }
    if (log.pantherMultiplier != null && log.pantherMultiplier > 1) {
      updated += ` x${log.pantherMultiplier} (Panther)`;
    }
    return updated;
  }

  private persistDecoratedMessage(log: Log, message: string): void {
    if (!message) {
      return;
    }

    if (this.deferDecorations) {
      log.rawMessage = message;
      log.message = message;
      log.decorated = false;
      return;
    }

    log.message = decorateInlineIcons(
      message,
      this.inlineNameRegex,
      this.inlineNameTypeMap,
      this.ailmentNames,
    );
    log.decorated = true;
  }

  private shouldCollapseLog(lastLog: Log | undefined, log: Log): lastLog is Log {
    if (!lastLog) {
      return false;
    }

    const samePlayer = lastLog.player === log.player;
    const sameMessage = lastLog.message?.trim() === log.message?.trim();
    const sameRandom = lastLog.randomEvent === log.randomEvent;
    const sameRandomReason =
      lastLog.randomEventReason === log.randomEventReason;
    const sameSource =
      lastLog.sourcePet === log.sourcePet &&
      lastLog.sourceIndex === log.sourceIndex;
    const sameTarget =
      lastLog.targetPet === log.targetPet &&
      lastLog.targetIndex === log.targetIndex;
    const hasSourceOrTarget =
      log.sourcePet != null ||
      log.targetPet != null ||
      log.sourceIndex != null ||
      log.targetIndex != null;

    return (
      sameMessage &&
      samePlayer &&
      sameRandom &&
      sameRandomReason &&
      (!hasSourceOrTarget || (sameSource && sameTarget))
    );
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

  private resolveSourceTargetFromMessage(log: Log): void {
    if (log.sourcePet && log.targetPet) {
      return;
    }
    const message = log.message;
    if (!message) {
      return;
    }
    const names = this.extractPetNames(message);
    if (names.length < 2) {
      return;
    }

    const playerPets = log.player?.petArray ?? [];
    const opponentPets = log.player?.opponent?.petArray ?? [];

    const findPet = (
      pets: Pet[],
      name: string,
      exclude?: Pet | null,
    ): Pet | null =>
      pets.find((pet) => pet?.name === name && pet !== exclude) ?? null;

    if (!log.sourcePet) {
      log.sourcePet =
        findPet(playerPets, names[0]) ?? findPet(opponentPets, names[0]);
    }

    if (!log.targetPet) {
      if (names[1] === names[0]) {
        const messageStartsWithSource =
          log.sourcePet && message.startsWith(log.sourcePet.name);
        if (messageStartsWithSource && log.sourcePet) {
          // Prefer self-target when the message begins with the source name and the names match.
          log.targetPet = log.sourcePet;
        } else {
          log.targetPet =
            findPet(playerPets, names[1], log.sourcePet) ??
            findPet(opponentPets, names[1], log.sourcePet) ??
            log.sourcePet ??
            null;
        }
      } else {
        log.targetPet =
          findPet(opponentPets, names[1]) ?? findPet(playerPets, names[1]);
      }
    }
  }

  private extractPetNames(message: string): string[] {
    if (!this.petNameRegex || !message) {
      return [];
    }
    const matches = message.match(this.petNameRegex);
    return matches ?? [];
  }

  private tryMergeAttackHealthLogs(
    lastLog: Log | undefined,
    nextLog: Log,
  ): boolean {
    const combined = getMergedAttackHealthMessage(lastLog, nextLog);
    if (!combined) {
      return false;
    }

    if (this.deferDecorations) {
      lastLog.rawMessage = combined;
      lastLog.message = combined;
      lastLog.decorated = false;
    } else {
      const decorated = this.decorateMessageWithNames(
        combined,
        lastLog.sourcePet,
        lastLog.targetPet,
        lastLog.sourceIndex,
        lastLog.targetIndex,
      );
      lastLog.message = decorateInlineIcons(
        decorated,
        this.inlineNameRegex,
        this.inlineNameTypeMap,
        this.ailmentNames,
      );
      lastLog.decorated = true;
    }

    return true;
  }

  private shouldAppendSummonBoardState(log: Log): boolean {
    if (!this.debugSummonBoardStateLogs) {
      return false;
    }
    if (!log?.message || log.type === 'board') {
      return false;
    }
    if (!log.player || !log.player.opponent) {
      return false;
    }
    return /\b(summoned|spawned)\b|^No room to spawn\b/i.test(log.message);
  }

  private appendSummonBoardStateLog(log: Log): void {
    const player = log.player;
    const opponent = log.player?.opponent;
    if (!player || !opponent) {
      return;
    }

    this.logs.push({
      message: this.buildPlainBoardStateMessage(player, opponent),
      type: 'board',
      player,
    });
  }

  private buildPlainBoardStateMessage(player: Player, opponent: Player): string {
    const playerState = [
      player.pet4,
      player.pet3,
      player.pet2,
      player.pet1,
      player.pet0,
    ]
      .map((pet) => this.renderPlainPetText(pet))
      .join(' ');

    const opponentState = [
      opponent.pet0,
      opponent.pet1,
      opponent.pet2,
      opponent.pet3,
      opponent.pet4,
    ]
      .map((pet) => this.renderPlainPetText(pet))
      .join(' ');

    return `${playerState} | ${opponentState}`;
  }

  private renderPlainPetText(pet: Pet | null | undefined): string {
    if (!pet) {
      return '___ (-/-)';
    }
    const index = this.getFrontIndex(pet);
    const label = index != null ? `${pet.parent?.isOpponent ? 'O' : 'P'}${index}` : 'P?';
    return `${label} ${pet.name}(${pet.attack}/${pet.health}/${pet.exp}xp)`;
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
    const boardMessage = buildBoardStateMessage(
      player,
      opponent,
      (pet) => this.getFrontIndex(pet),
      (name) => this.isAilmentName(name),
    );

    this.createLog({
      message: boardMessage,
      type: 'board',
    });
  }
}



