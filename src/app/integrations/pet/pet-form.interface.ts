import { PetMemoryState } from 'app/domain/interfaces/pet-memory.interface';
import { Equipment } from 'app/domain/entities/equipment.class';

export interface PetForm extends PetMemoryState {
  name: string;
  attack?: number | null;
  health?: number | null;
  mana?: number | null;
  triggersConsumed?: number;
  foodsEaten?: number;
  exp: number;
  hasRandomEvents?: boolean;
  equipment?: string | Equipment | { name?: string } | null;
  battlesFought?: number;
  timesHurt?: number;
  friendsDiedBeforeBattle?: number;
  equipmentUses?: number;
}
