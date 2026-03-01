import { Injectable } from '@angular/core';
import { LogService } from '../log.service';
import { Player } from 'app/domain/entities/player.class';
import { Pet } from 'app/domain/entities/pet.class';
import { Equipment } from 'app/domain/entities/equipment.class';
import { AbilityService } from '../ability/ability.service';
import { AbilityEvent } from 'app/domain/interfaces/ability-event.interface';
import { shuffle } from 'lodash-es';
import { GameService } from 'app/runtime/state/game.service';
import { PetService } from '../pet/pet.service';
import { EquipmentService } from '../equipment/equipment.service';
import { ToyFactoryService } from './toy-factory.service';
import { ToyEventService } from '../ability/toy-event.service';
import { RandomEventReason } from 'app/domain/interfaces/log.interface';
import * as toysJson from 'assets/data/toys.json';
import {
  calculateIncomingDamageBeforeReductions,
  prepareDefenseForIncomingDamage,
} from 'app/domain/entities/combat/defense-damage-calculation';
import {
  applyDamageReductions,
} from 'app/domain/entities/combat/damage-reduction';
import {
  appendSnipeContextAndReductionMessages,
  appendSnipeDefenseEquipmentMessage,
} from 'app/domain/entities/combat/combat-snipe-utils';
import { getRandomFloat } from 'app/runtime/random';
import { coerceLogService } from 'app/runtime/log-service-fallback';

interface ToyJsonEntry {
  Name: string;
  Tier: number | string;
  NameId?: string;
  ToyType?: number | string;
  Random?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ToyService {
  toys: Map<number, string[]> = new Map();
  private toysByType: Map<number, Map<number, string[]>> = new Map();
  private toyNameIds: Map<string, string> = new Map();
  private localStartOfBattleEvents: AbilityEvent[] = [];

  constructor(
    private logService: LogService,
    private abilityService: AbilityService,
    private gameService: GameService,
    private equipmentService: EquipmentService,
    private petService: PetService,
    private toyFactory: ToyFactoryService,
    private toyEventService?: ToyEventService,
  ) {
    this.logService = coerceLogService(this.logService);
    this.setToys();
  }

  setToys() {
    this.toys.clear();
    this.toyNameIds.clear();
    this.toysByType.clear();
    const toyEntries = this.getToyEntriesFromJson();
    for (const toy of toyEntries) {
      const tier = Number(toy.Tier);
      if (!Number.isFinite(tier) || tier < 1) {
        continue;
      }
      if (!this.toys.has(tier)) {
        this.toys.set(tier, []);
      }
      const tierList = this.toys.get(tier);
      if (tierList) {
        tierList.push(toy.Name);
      }
      const toyType = Number.isFinite(Number(toy.ToyType))
        ? Number(toy.ToyType)
        : 0;
      if (!this.toysByType.has(toyType)) {
        this.toysByType.set(toyType, new Map());
      }
      const typeMap = this.toysByType.get(toyType);
      if (typeMap && !typeMap.has(tier)) {
        typeMap.set(tier, []);
      }
      const typeTierList = typeMap?.get(tier);
      if (typeTierList) {
        typeTierList.push(toy.Name);
      }
      if (toy.Name && toy.NameId) {
        this.toyNameIds.set(toy.Name, toy.NameId);
      }
    }
    for (const [tier, toyNames] of this.toys) {
      this.toys.set(tier, [...new Set(toyNames)]);
    }
    for (const [toyType, tierMap] of this.toysByType) {
      for (const [tier, toyNames] of tierMap) {
        tierMap.set(tier, [...new Set(toyNames)]);
      }
    }
  }

  getToyNameId(toyName: string): string | null {
    if (!toyName) {
      return null;
    }
    return this.toyNameIds.get(toyName) ?? null;
  }

  getToysByType(toyType: number): Map<number, string[]> {
    const tierMap = this.toysByType.get(toyType);
    if (!tierMap) {
      return new Map();
    }
    return new Map(
      Array.from(tierMap.entries()).map(([tier, names]) => [tier, [...names]]),
    );
  }

  isToyRandom(name: string): boolean {
    return this.toyDataMap.get(name)?.Random === true;
  }

  private toyDataMap: Map<string, ToyJsonEntry> = new Map();

  private getToyEntriesFromJson(): ToyJsonEntry[] {
    const entries =
      (toysJson as unknown as { default?: ToyJsonEntry[] }).default ??
      (toysJson as unknown as ToyJsonEntry[]) ??
      [];
    entries.forEach((toy) => {
      if (toy.Name) {
        this.toyDataMap.set(toy.Name, toy);
      }
    });
    return entries.filter((toy) => Boolean(toy?.Name));
  }

  createToy(toyName: string, parent: Player, level: number = 1) {
    return this.toyFactory.createToy(
      toyName,
      parent,
      level,
      this,
      this.petService,
      this.equipmentService,
      this.gameService,
    );
  }

  snipePet(
    pet: Pet,
    power: number,
    parent: Player,
    toyName: string,
    randomEvent = false,
    puma = false,
  ) {
    let damageResp = this.calculateDamage(
      pet,
      parent.getManticoreMult(),
      power,
    );
    let defenseEquipment = damageResp.defenseEquipment;
    let damage = damageResp.damage;

    this.dealDamage(pet, damage, parent);

    let message = `${toyName} sniped ${pet.name} for ${damage}.`;
    message = appendSnipeDefenseEquipmentMessage(message, pet, defenseEquipment, {
      consumeDefenseEquipment: true,
      includeMultiplierMessage: true,
      coconutAsBlock: false,
    });
    message = appendSnipeContextAndReductionMessages(
      message,
      pet,
      parent.getManticoreMult(),
      damageResp,
    );
    if (puma) {
      message += ` (Puma)`;
    }
    this.logService.createLog({
      message: message,
      type: 'attack',
      randomEvent: randomEvent,
      player: parent,
    });
    return damage;
  }

  calculateDamage(
    pet: Pet,
    manticoreMult: number[],
    power?: number,
  ): {
    defenseEquipment: Equipment | null;
    damage: number;
    nurikabe: number;
    fairyBallReduction?: number;
    fanMusselReduction?: number;
    ghostKittenReduction?: number;
  } {
    const preparedDefense = prepareDefenseForIncomingDamage(
      pet,
      manticoreMult,
      {
        includeShieldSnipe: true,
        nullifyMapleSyrupDefense: true,
      },
    );
    const defenseEquipment = preparedDefense.defenseEquipment;
    const damageBeforeReductions = calculateIncomingDamageBeforeReductions(
      pet,
      power ?? 0,
      defenseEquipment,
      manticoreMult,
    );
    const reductionResult = applyDamageReductions(pet, damageBeforeReductions, {
      includeGhostKitten: true,
      fairyMinimumOne: false,
      fairyRequiresPositiveDamage: true,
      nurikabeConsumesOnZeroHit: true,
      fanMusselConsumesOnZeroHit: true,
    });
    const damage = reductionResult.damage;
    const fairyBallReduction = reductionResult.fairyBallReduction;
    const nurikabe = reductionResult.nurikabe;
    const fanMusselReduction = reductionResult.fanMusselReduction;
    const ghostKittenReduction = reductionResult.ghostKittenReduction;

    return {
      defenseEquipment: defenseEquipment,
      damage: damage,
      nurikabe: nurikabe,
      fairyBallReduction: fairyBallReduction,
      fanMusselReduction: fanMusselReduction,
      ghostKittenReduction: ghostKittenReduction,
    };
  }
  dealDamage(pet: Pet, damage: number, ToyParent: Player) {
    pet.health -= damage;

    // hurt ability
    if (damage > 0) {
      this.abilityService.triggerHurtEvents(pet);
    }
  }
  setStartOfBattleEvent(event: AbilityEvent) {
    if (this.toyEventService) {
      this.toyEventService.setStartOfBattleEvent(event);
      return;
    }
    event.tieBreaker = getRandomFloat();
    this.localStartOfBattleEvents.push(event);
  }

  executeStartOfBattleEvents() {
    if (this.toyEventService) {
      this.toyEventService.executeStartOfBattleEvents();
      return;
    }
    this.localStartOfBattleEvents = shuffle(this.localStartOfBattleEvents);
    this.localStartOfBattleEvents.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      const aTie = a.tieBreaker ?? 0;
      const bTie = b.tieBreaker ?? 0;
      return bTie - aTie;
    });

    const priorityCounts = new Map<number, number>();
    for (const event of this.localStartOfBattleEvents) {
      priorityCounts.set(
        event.priority,
        (priorityCounts.get(event.priority) ?? 0) + 1,
      );
    }

    for (const event of this.localStartOfBattleEvents) {
      const isRandomOrder = (priorityCounts.get(event.priority) ?? 0) > 1;
      const randomEventReason: RandomEventReason = isRandomOrder
        ? 'tie-broken'
        : 'deterministic';
      this.logLocalStartOfBattleToyEvent(event, isRandomOrder, randomEventReason);
      event.callback(this.gameService.gameApi);
    }

    this.localStartOfBattleEvents = [];
  }

  private logLocalStartOfBattleToyEvent(
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
}


