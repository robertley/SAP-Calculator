import { Injectable } from '@angular/core';
import { Equipment } from '../../classes/equipment.class';
import { LogService } from '../log.service';
import { AbilityService } from '../ability/ability.service';
import { GameService } from '../game.service';
import { PetService } from '../pet/pet.service';
import { InjectorService } from '../injector.service';
import {
  EquipmentRegistryDeps,
  NO_ARG_EQUIPMENT,
  LOG_ONLY_EQUIPMENT,
  LOG_ABILITY_EQUIPMENT,
  NO_ARG_AILMENTS,
  SPECIAL_EQUIPMENT_BUILDERS,
  SPECIAL_AILMENT_BUILDERS,
} from './equipment-registry';

const EQUIPMENT_TIER_OVERRIDES = new Map<string, number>([
  ['Blueberry', 1],
  ['Golden Egg', 1],
  ['Gros Michel Banana', 1],
  ['Health Potion', 1],
  ['Honey', 1],
  ['Macaron', 1],
  ['Mana Potion', 1],
  ['Unagi', 1],
  ['Caramel', 2],
  ['Cherry', 2],
  ['Chocolate Cake', 2],
  ['Churros', 2],
  ['Cod Roe', 2],
  ['Eucalyptus', 2],
  ['Faint Bread', 2],
  ['Fairy Dust', 2],
  ['Meat Bone', 2],
  ['Radish', 2],
  ['Sudduth Tomato', 2],
  ['Brussels Sprout', 3],
  ['Cucumber', 3],
  ['Fig', 3],
  ['Gingerbread Man', 3],
  ['Pineapple', 3],
  ['Rambutan', 3],
  ['Sausage', 3],
  ['Seaweed', 3],
  ['White Truffle', 3],
  ['Baguette', 4],
  ['Banana', 4],
  ['Cauliflower', 4],
  ['Cheese', 4],
  ['Donut', 4],
  ['Fortune Cookie', 4],
  ['Grapes', 4],
  ['Melon Slice', 4],
  ['Oyster Mushroom', 4],
  ['Potato', 4],
  ['Carrot', 5],
  ['Chili', 5],
  ['Durian', 5],
  ['Easter Egg', 5],
  ['Eggplant', 5],
  ['Kiwano', 5],
  ['Magic Beans', 5],
  ['Onion', 5],
  ['Pepper', 5],
  ['Mild Chili', 4],
  ['Popcorn', 6],
  ['Sardinian Currant', 6],
  ['Yggdrasil Fruit', 6],
]);

@Injectable({
  providedIn: 'root',
})
export class EquipmentFactoryService {
  constructor(
    private logService: LogService,
    private abilityService: AbilityService,
    private gameService: GameService,
  ) {}

  getAllEquipment(): Map<string, Equipment> {
    const petService = InjectorService.getInjector().get(PetService);
    const map = new Map<string, Equipment>();
    const deps: EquipmentRegistryDeps = {
      logService: this.logService,
      abilityService: this.abilityService,
      gameService: this.gameService,
      petService,
    };

    // No-arg equipment
    for (const [name, EquipClass] of Object.entries(NO_ARG_EQUIPMENT)) {
      map.set(name, new EquipClass());
    }

    // LogService-only equipment
    for (const [name, EquipClass] of Object.entries(LOG_ONLY_EQUIPMENT)) {
      map.set(name, new EquipClass(this.logService));
    }

    // LogService + AbilityService equipment
    for (const [name, EquipClass] of Object.entries(LOG_ABILITY_EQUIPMENT)) {
      map.set(name, new EquipClass(this.logService, this.abilityService));
    }

    // Special cases with unique constructors
    for (const [name, builder] of Object.entries(SPECIAL_EQUIPMENT_BUILDERS)) {
      map.set(name, builder(deps));
    }

    for (const [name, equipment] of map.entries()) {
      if (equipment?.tier == null) {
        const overrideTier = EQUIPMENT_TIER_OVERRIDES.get(name);
        if (overrideTier != null) {
          equipment.tier = overrideTier;
        }
      }
    }

    return map;
  }

  getAllAilments(): Map<string, Equipment> {
    const map = new Map<string, Equipment>();
    const deps: EquipmentRegistryDeps = {
      logService: this.logService,
      abilityService: this.abilityService,
      gameService: this.gameService,
      petService: null,
    };

    // No-arg ailments
    for (const [name, AilmentClass] of Object.entries(NO_ARG_AILMENTS)) {
      map.set(name, new AilmentClass());
    }

    // Special case
    for (const [name, builder] of Object.entries(SPECIAL_AILMENT_BUILDERS)) {
      map.set(name, builder(deps));
    }

    return map;
  }
}
