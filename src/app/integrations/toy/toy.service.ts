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
  applyDamageReductions,
  applyIckyMultiplier,
  applyManticoreMultiplier,
} from 'app/domain/entities/combat/damage-reduction';
import { getRandomFloat } from 'app/runtime/random';

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
    if (defenseEquipment != null) {
      pet.useDefenseEquipment(true);
      let power = Math.abs(defenseEquipment.power ?? 0);
      let sign = '-';
      if ((defenseEquipment.power ?? 0) < 0) {
        sign = '+';
      }
      if (defenseEquipment.name === 'Strawberry') {
        let sparrowLevel = pet.getSparrowLevel();
        if (sparrowLevel > 0) {
          power = sparrowLevel * 5;
          message += ` (Strawberry -${power} (Sparrow))`;
        }
      } else {
        message += ` (${defenseEquipment.name} ${sign}${power})`;
      }
      message += defenseEquipment.multiplierMessage ?? '';
    }
    if (pet.equipment?.name == 'Icky') {
      message += 'x2 (Icky)';
      if (pet.equipment.multiplier > 1) {
        message += pet.equipment.multiplierMessage;
      }
    }
    let manticoreMult = parent.getManticoreMult();
    let manticoreAilments = ['Weak', 'Cold', 'Icky', 'Spooked'];
    let hasAilment = manticoreAilments.includes(pet.equipment?.name);
    if (manticoreMult.length > 0 && hasAilment) {
      for (let mult of manticoreMult) {
        message += ` x${mult + 1} (Manticore)`;
      }
    }

    if (damageResp.nurikabe > 0) {
      message += ` -${damageResp.nurikabe} (Nurikabe)`;
    }
    if (damageResp.fairyBallReduction > 0) {
      message += ` -${damageResp.fairyBallReduction} (Fairy Ball)`;
    }
    if (damageResp.fanMusselReduction > 0) {
      message += ` -${damageResp.fanMusselReduction} (Fan Mussel)`;
    }
    if (damageResp.ghostKittenReduction > 0) {
      message += ` -${damageResp.ghostKittenReduction} (Ghost Kitten)`;
    }
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
    let defenseMultiplier = pet.equipment?.multiplier ?? 1;
    const manticoreDefenseAilments = ['Cold', 'Weak', 'Spooked'];
    const isGuavaDefense = pet.equipment?.name === 'Guava';
    let defenseEquipment: Equipment | null =
      pet.equipment?.equipmentClass == 'defense' ||
        pet.equipment?.equipmentClass == 'shield' ||
        pet.equipment?.equipmentClass == 'ailment-defense' ||
        pet.equipment?.equipmentClass == 'shield-snipe'
        ? pet.equipment
        : null;
    if (defenseEquipment == null && isGuavaDefense) {
      defenseEquipment = pet.equipment;
    }

    if (defenseEquipment != null) {
      if (defenseEquipment.name == 'Maple Syrup') {
        defenseEquipment = null;
      } else {
        defenseMultiplier = applyManticoreMultiplier(
          defenseMultiplier,
          defenseEquipment.name,
          manticoreMult,
          manticoreDefenseAilments,
        );
        const basePower =
          defenseEquipment.originalPower ?? defenseEquipment.power ?? 0;
        defenseEquipment.power = basePower * defenseMultiplier;
      }
    }

    let defenseAmt = defenseEquipment?.power ? defenseEquipment.power : 0;
    let sparrowLevel = pet.getSparrowLevel();
    if (pet.equipment?.name === 'Strawberry' && sparrowLevel > 0) {
      defenseAmt += sparrowLevel * 5;
    }

    power = applyIckyMultiplier(power ?? 0, pet.equipment, manticoreMult);
    let min =
      defenseEquipment?.equipmentClass == 'shield' ||
        defenseEquipment?.equipmentClass == 'shield-snipe'
        ? 0
        : 1;
    //check garlic
    if (defenseEquipment?.minimumDamage !== undefined) {
      min = defenseEquipment.minimumDamage;
    }
    let damage: number;
    const incomingPower = power ?? 0;
    if (incomingPower <= min && defenseAmt > 0) {
      damage = Math.max(incomingPower, 0);
    } else {
      damage = Math.max(min, incomingPower - defenseAmt);
    }
    const reductionResult = applyDamageReductions(pet, damage, {
      includeGhostKitten: true,
      fairyMinimumOne: false,
      fairyRequiresPositiveDamage: true,
      nurikabeConsumesOnZeroHit: true,
      fanMusselConsumesOnZeroHit: true,
    });
    damage = reductionResult.damage;
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


