import { Injectable } from '@angular/core';
import { shuffle } from 'lodash-es';
import { AbilityEvent } from 'app/domain/interfaces/ability-event.interface';
import { RandomEventReason } from 'app/domain/interfaces/log.interface';
import { Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { GameService } from 'app/runtime/state/game.service';
import { LogService } from '../log.service';

@Injectable({
  providedIn: 'root',
})
export class ToyEventService {
  private startOfBattleToyEvents: AbilityEvent[] = [];
  // Toy event queues
  private emptyFrontSpaceToyEvents: AbilityEvent[] = [];
  private friendSummonedToyEvents: AbilityEvent[] = [];
  private friendlyLevelUpToyEvents: AbilityEvent[] = [];
  private friendFaintsToyEvents: AbilityEvent[] = [];
  private friendJumpedToyEvents: AbilityEvent[] = [];

  constructor(
    private gameService: GameService,
    private logService: LogService,
  ) {}

  private enqueueToyEvents(
    queue: AbilityEvent[],
    player: Player,
    triggerPet: Pet | undefined,
    callback: (...args: any[]) => void,
  ): void {
    this.addToyEvent(queue, {
      callback,
      priority: 100,
      level: player.toy.level,
      triggerPet,
      player,
    });

    const pumas = player.petArray.filter((pet) => pet.name === 'Puma');
    for (const puma of pumas) {
      this.addToyEvent(queue, {
        callback,
        priority: +puma.attack,
        level: puma.level,
        triggerPet,
        player,
      });
    }
  }

  private addToyEvent(queue: AbilityEvent[], event: AbilityEvent): void {
    queue.push(event);
  }

  setStartOfBattleEvent(event: AbilityEvent): void {
    event.tieBreaker = Math.random();
    this.startOfBattleToyEvents.push(event);
  }

  executeStartOfBattleEvents(): void {
    const events = shuffle(this.startOfBattleToyEvents);
    events.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      const aTie = a.tieBreaker ?? 0;
      const bTie = b.tieBreaker ?? 0;
      return bTie - aTie;
    });

    const priorityCounts = new Map<number, number>();
    for (const event of events) {
      priorityCounts.set(
        event.priority,
        (priorityCounts.get(event.priority) ?? 0) + 1,
      );
    }

    for (const event of events) {
      const isRandomOrder = (priorityCounts.get(event.priority) ?? 0) > 1;
      const randomEventReason: RandomEventReason = isRandomOrder
        ? 'tie-broken'
        : 'deterministic';
      this.logStartOfBattleToyEvent(
        event,
        isRandomOrder,
        randomEventReason,
      );
      event.callback(this.gameService.gameApi);
    }

    this.startOfBattleToyEvents = [];
  }

  private logStartOfBattleToyEvent(
    event: AbilityEvent,
    randomEvent: boolean,
    randomEventReason: RandomEventReason,
  ): void {
    const toyName = event.player?.toy?.name;
    if (!toyName) {
      return;
    }
    const ownerLabel = event.player?.isOpponent ? "Opponent's" : "Player's";
    const triggerPetName = event.triggerPet?.name
      ? ` (${event.triggerPet.name})`
      : '';
    this.logService.createLog({
      message: `${ownerLabel} ${toyName} activated at start of battle${triggerPetName}`,
      type: 'ability',
      player: event.player,
      randomEvent,
      randomEventReason,
    });
  }

  private executeToyEventQueue(
    queue: AbilityEvent[],
    executor: (event: AbilityEvent) => void,
    label?: string,
    shouldLog?: (event: AbilityEvent) => boolean,
  ): void {
    const events = shuffle(queue);
    events.sort((a, b) =>
      a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0,
    );

    const priorityCounts = new Map<number, number>();
    for (const event of events) {
      priorityCounts.set(
        event.priority,
        (priorityCounts.get(event.priority) ?? 0) + 1,
      );
    }

    for (const event of events) {
      if (label && (shouldLog == null || shouldLog(event))) {
        const isRandomOrder = (priorityCounts.get(event.priority) ?? 0) > 1;
        const randomEventReason: RandomEventReason = isRandomOrder
          ? 'tie-broken'
          : 'deterministic';
        this.logToyEvent(event, label, isRandomOrder, randomEventReason);
      }
      executor(event);
    }

    queue.length = 0;
  }

  private logToyEvent(
    event: AbilityEvent,
    label: string,
    randomEvent: boolean,
    randomEventReason: RandomEventReason,
  ): void {
    const toyName = event.player?.toy?.name;
    if (!toyName) {
      return;
    }
    const triggerPetName = event.triggerPet?.name
      ? ` (${event.triggerPet.name})`
      : '';
    this.logService.createLog({
      message: `${toyName} ${label}${triggerPetName}`,
      type: 'ability',
      player: event.player,
      randomEvent,
      randomEventReason,
    });
  }

  // Empty front space events
  triggerEmptyFrontSpaceToyEvents(player: Player): void {
    if (player.toy?.emptyFromSpace != null) {
      if (player.toy.used) {
        return;
      }
      this.enqueueToyEvents(
        this.emptyFrontSpaceToyEvents,
        player,
        undefined,
        player.toy.emptyFromSpace.bind(player.toy),
      );
    }
  }

  executeEmptyFrontSpaceToyEvents(): void {
    this.executeToyEventQueue(
      this.emptyFrontSpaceToyEvents,
      (event) => {
        event.callback(
          this.gameService.gameApi,
          event.priority < 100,
          event.level,
          event.priority,
        );
      },
      'triggered after empty front space',
    );
  }

  // Friend summoned toy events
  triggerFriendSummonedToyEvents(player: Player, pet: Pet): void {
    if (player.toy?.friendSummoned != null) {
      this.enqueueToyEvents(
        this.friendSummonedToyEvents,
        player,
        pet,
        player.toy.friendSummoned.bind(player.toy),
      );
    }
  }

  executeFriendSummonedToyEvents(): void {
    this.executeToyEventQueue(
      this.friendSummonedToyEvents,
      (event) => {
        event.callback(
          this.gameService.gameApi,
          event.triggerPet,
          event.priority < 100,
          event.level,
        );
      },
      'reacted to friend summoned',
    );
  }

  // Friendly level up toy events
  triggerFriendlyLevelUpToyEvents(player: Player, pet: Pet): void {
    if (player != pet.parent) {
      return;
    }
    if (player.toy?.friendlyLevelUp != null) {
      this.enqueueToyEvents(
        this.friendlyLevelUpToyEvents,
        player,
        pet,
        player.toy.friendlyLevelUp.bind(player.toy),
      );
    }
  }

  executeFriendlyLevelUpToyEvents(): void {
    this.executeToyEventQueue(
      this.friendlyLevelUpToyEvents,
      (event) => {
        event.callback(
          this.gameService.gameApi,
          event.triggerPet,
          event.priority < 100,
          event.level,
        );
      },
      'reacted to friendly level up',
    );
  }

  // Friend faints toy events
  triggerFriendFaintsToyEvents(player: Player, pet: Pet): void {
    if (player != pet.parent) {
      return;
    }
    if (player.toy?.friendFaints != null) {
      this.enqueueToyEvents(
        this.friendFaintsToyEvents,
        player,
        pet,
        player.toy.friendFaints.bind(player.toy),
      );
    }
  }

  executeFriendFaintsToyEvents(): void {
    this.executeToyEventQueue(
      this.friendFaintsToyEvents,
      (event) => {
        event.callback(
          this.gameService.gameApi,
          event.triggerPet,
          event.priority < 100,
          event.level,
        );
      },
      'reacted to friend fainting',
      (event) => !event.player?.toy?.suppressFriendFaintLog,
    );
  }

  // Friend jumped toy events
  triggerFriendJumpedToyEvents(player: Player, pet: Pet): void {
    if (player != pet.parent) {
      return;
    }
    if (player.toy?.friendJumped != null) {
      this.enqueueToyEvents(
        this.friendJumpedToyEvents,
        player,
        pet,
        player.toy.friendJumped.bind(player.toy),
      );
    }
  }

  executeFriendJumpedToyEvents(): void {
    this.executeToyEventQueue(
      this.friendJumpedToyEvents,
      (event) => {
        event.callback(
          this.gameService.gameApi,
          event.triggerPet,
          event.priority < 100,
          event.level,
        );
      },
      'reacted to friend jumping',
    );
  }
}

