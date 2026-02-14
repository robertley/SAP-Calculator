import { Injectable } from '@angular/core';
import { shuffle } from 'lodash-es';
import {
  AbilityEvent,
  AbilityEventCallback,
} from 'app/domain/interfaces/ability-event.interface';
import { RandomEventReason } from 'app/domain/interfaces/log.interface';
import { Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Toy } from 'app/domain/entities/toy.class';
import { GameService } from 'app/runtime/state/game.service';
import { LogService } from '../log.service';
import { getRandomFloat } from 'app/runtime/random';

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
    toy: Toy,
    triggerPet: Pet | undefined,
    callback: AbilityEventCallback,
  ): void {
    this.addToyEvent(queue, {
      callback,
      priority: 100,
      level: toy.level,
      triggerPet,
      player,
      customParams: {
        toyName: toy.name,
        suppressFriendFaintLog: toy.suppressFriendFaintLog,
      },
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

  private getActiveToys(player: Player): Toy[] {
    const activeToys: Toy[] = [];
    if (player.toy) {
      activeToys.push(player.toy);
    }
    if (player.hardToy) {
      activeToys.push(player.hardToy);
    }
    return activeToys;
  }

  private addToyEvent(queue: AbilityEvent[], event: AbilityEvent): void {
    queue.push(event);
  }

  setStartOfBattleEvent(event: AbilityEvent): void {
    event.tieBreaker = getRandomFloat();
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
    const toyName =
      (event.customParams?.toyName as string | undefined) ??
      event.player?.toy?.name;
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
    const toyName =
      (event.customParams?.toyName as string | undefined) ??
      event.player?.toy?.name;
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
    for (const toy of this.getActiveToys(player)) {
      if (toy.emptyFromSpace == null) {
        continue;
      }
      if (toy.used) {
        continue;
      }
      this.enqueueToyEvents(
        this.emptyFrontSpaceToyEvents,
        player,
        toy,
        undefined,
        toy.emptyFromSpace.bind(toy),
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
    for (const toy of this.getActiveToys(player)) {
      if (toy.friendSummoned == null) {
        continue;
      }
      this.enqueueToyEvents(
        this.friendSummonedToyEvents,
        player,
        toy,
        pet,
        toy.friendSummoned.bind(toy),
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
    for (const toy of this.getActiveToys(player)) {
      if (toy.friendlyLevelUp == null) {
        continue;
      }
      this.enqueueToyEvents(
        this.friendlyLevelUpToyEvents,
        player,
        toy,
        pet,
        toy.friendlyLevelUp.bind(toy),
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
    for (const toy of this.getActiveToys(player)) {
      if (toy.friendFaints == null) {
        continue;
      }
      this.enqueueToyEvents(
        this.friendFaintsToyEvents,
        player,
        toy,
        pet,
        toy.friendFaints.bind(toy),
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
      (event) => !Boolean(event.customParams?.suppressFriendFaintLog),
    );
  }

  // Friend jumped toy events
  triggerFriendJumpedToyEvents(player: Player, pet: Pet): void {
    if (player != pet.parent) {
      return;
    }
    for (const toy of this.getActiveToys(player)) {
      if (toy.friendJumped == null) {
        continue;
      }
      this.enqueueToyEvents(
        this.friendJumpedToyEvents,
        player,
        toy,
        pet,
        toy.friendJumped.bind(toy),
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

