import { Injectable } from '@angular/core';
import { LogService } from '../log.service';
import { AbilityService } from '../ability/ability.service';
import { EquipmentService } from '../equipment/equipment.service';
import { PetService } from '../pet/pet.service';
import { GameService } from 'app/runtime/state/game.service';
import { Player } from 'app/domain/entities/player.class';
import { Toy } from 'app/domain/entities/toy.class';
import {
  ToyRegistryDeps,
  ToyRuntimeService,
  STANDARD_TOYS,
  TOYS_NEEDING_ABILITY_SERVICE,
  SPECIAL_TOY_BUILDERS,
} from './toy-registry';

@Injectable({
  providedIn: 'root',
})
export class ToyFactoryService {
  constructor(
    private logService: LogService,
    private abilityService: AbilityService,
    private petService?: PetService,
    private equipmentService?: EquipmentService,
    private gameService?: GameService,
  ) {}

  createToy(
    toyName: string,
    parent: Player,
    level: number,
    toyService: ToyRuntimeService,
    petService?: PetService,
    equipmentService?: EquipmentService,
    gameService?: GameService,
  ): Toy | null {
    const deps: ToyRegistryDeps = {
      logService: this.logService,
      abilityService: this.abilityService,
      toyService,
      parent,
      level,
      petService: this.petService ?? petService,
      equipmentService: this.equipmentService ?? equipmentService,
      gameService: this.gameService ?? gameService,
    };

    // Special cases with unique constructor signatures
    const specialBuilder = SPECIAL_TOY_BUILDERS[toyName];
    if (specialBuilder) {
      return specialBuilder(deps);
    }

    // Toys needing AbilityService
    if (TOYS_NEEDING_ABILITY_SERVICE[toyName]) {
      const ToyClass = TOYS_NEEDING_ABILITY_SERVICE[toyName];
      return new ToyClass(
        this.logService,
        toyService,
        this.abilityService,
        parent,
        level,
      );
    }

    // Standard toys
    if (STANDARD_TOYS[toyName]) {
      const ToyClass = STANDARD_TOYS[toyName];
      return new ToyClass(this.logService, toyService, parent, level);
    }

    return null;
  }
}

