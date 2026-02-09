import {
  PetConfig,
  SimulationConfig,
} from 'app/domain/interfaces/simulation-config.interface';
import { EquipmentService } from 'app/integrations/equipment/equipment.service';
import { PetService } from 'app/integrations/pet/pet.service';
import { ToyService } from 'app/integrations/toy/toy.service';

export function isBattleDeterministic(
  config: SimulationConfig,
  petService: PetService,
  equipmentService: EquipmentService,
  toyService: ToyService,
): boolean {
  if (config.komodoShuffle || config.oldStork) {
    return false;
  }

  if (config.playerToy && toyService.isToyRandom(config.playerToy)) {
    return false;
  }
  if (config.opponentToy && toyService.isToyRandom(config.opponentToy)) {
    return false;
  }

  const checkPets = (pets: (PetConfig | null)[]) => {
    if (!pets) return true;
    for (let i = 0; i < pets.length; i++) {
      const pet = pets[i];
      if (!pet || !pet.name) continue;

      if (petService.isPetRandom(pet.name)) {
        return false;
      }

      let equipmentName: string | null = null;
      if (typeof pet.equipment === 'string') {
        equipmentName = pet.equipment;
      } else if (pet.equipment && typeof pet.equipment === 'object') {
        equipmentName = pet.equipment.name;
      }

      if (equipmentName && equipmentService.isEquipmentRandom(equipmentName)) {
        return false;
      }
    }
    return true;
  };

  if (!checkPets(config.playerPets)) {
    return false;
  }
  if (!checkPets(config.opponentPets)) {
    return false;
  }

  return true;
}

export function applySeededRandom(seed: number | null | undefined): () => void {
  if (seed == null || !Number.isFinite(seed)) {
    return () => {};
  }
  const random = createSeededRandom(Math.trunc(seed));
  const originalRandom = Math.random;
  (Math as any).random = random;
  return () => {
    (Math as any).random = originalRandom;
  };
}

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
