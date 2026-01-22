import { Injectable } from '@angular/core';
import { Equipment } from '../../classes/equipment.class';
import { LogService } from '../log.service';
import { AbilityService } from '../ability/ability.service';
import { GameService } from '../game.service';
import { EquipmentFactoryService } from './equipment-factory.service';

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  constructor(
    private logService: LogService,
    private abilityService: AbilityService,
    private gameService: GameService,
    private equipmentFactory: EquipmentFactoryService,
  ) {}

  getInstanceOfAllEquipment() {
    return this.equipmentFactory.getAllEquipment();
  }

  getInstanceOfAllAilments() {
    return this.equipmentFactory.getAllAilments();
  }

  private static readonly USEFUL_PERKS: Map<string, number> = new Map([
    //T1
    ['Honey', 1],
    ['Strawberry', 1],
    ['Egg', 1],
    ['Cake Slice', 1],
    ['Cashew Nut', 1],
    ['Nachos', 1],
    // T2
    ['Lime', 2],
    ['Meat Bone', 2],
    ['Cherry', 2],
    ['Bok Choy', 2],
    ['Kiwifruit', 2],
    ['Fairy Dust', 2],
    // T3
    ['Garlic', 3],
    ['Gingerbread Man', 3],
    ['Fig', 3],
    ['Cucumber', 3],
    ['Croissant', 3],
    ['Squash', 3],
    // T4
    ['Banana', 4],
    ['Love Potion', 4],
    ['Pie', 4],
    ['Grapes', 4],
    ['Cheese', 4],
    ['Cod Roe', 4],
    ['Salt', 4],
    ['Fortune Cookie', 4],
    // T5
    ['Easter Egg', 5],
    ['Magic Beans', 5],
    ['Chili', 5],
    ['Lemon', 5],
    ['Durian', 5],
    ['Honeydew Melon', 5],
    ['Maple Syrup', 5],
    ['Cocoa Bean', 5],
    ['White Okra', 5],
    // T6
    ['Popcorn', 6],
    ['Steak', 6],
    ['Pancakes', 6],
    ['Yggdrasil Fruit', 6],
    ['Melon', 6],
    ['Tomato', 6],
    ['Sudduth Tomato', 6],
    ['Pita Bread', 6],
    // Hidden
    ['Seaweed', 5],
    // Golden
    ['Caramel', 4],
    // Star
    ['Baguette', 4],
  ]);

  isUsefulPerk(equipmentName: string): boolean {
    return EquipmentService.USEFUL_PERKS.has(equipmentName);
  }

  getUsefulPerksByTier(tier: number): Equipment[] {
    const allEquipment = this.getInstanceOfAllEquipment();
    const usefulPerksForTier: Equipment[] = [];

    for (const [name, tierValue] of EquipmentService.USEFUL_PERKS.entries()) {
      if (tierValue === tier && allEquipment.has(name)) {
        usefulPerksForTier.push(allEquipment.get(name)!);
      }
    }

    return usefulPerksForTier;
  }

  getUsefulPerks(): Equipment[] {
    const allEquipment = this.getInstanceOfAllEquipment();
    const usefulPerks: Equipment[] = [];

    for (const name of EquipmentService.USEFUL_PERKS.keys()) {
      if (allEquipment.has(name)) {
        usefulPerks.push(allEquipment.get(name)!);
      }
    }

    return usefulPerks;
  }
}
