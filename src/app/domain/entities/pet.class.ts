import { Player } from './player.class';
import { Equipment } from './equipment.class';
import { PetMemoryState } from '../interfaces/pet-memory.interface';

/** Display and form state only; no battle abilities or mutable combat runtime. */
// The interface adds only optional form-memory fields to this data model.
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class Pet {
  name: string;
  tier: number;
  parent: Player;
  attack: number;
  health: number;
  exp = 0;
  mana = 0;
  equipment: Equipment | null = null;
  equipmentUsesOverride?: number | null;
  plainCopy = false;
  triggersConsumed = 0;
  foodsEaten = 0;
  timesGaveHealth = 0;
  battlesFought = 0;
  timesHurt = 0;
  friendsDiedBeforeBattle = 0;
  friendsHurtBeforeBattle = 0;
  ailmentsCount = 0;
  savedPosition = 0;
  get level(): number { return this.exp >= 5 ? 3 : this.exp >= 2 ? 2 : 1; }
}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging, no-redeclare
export interface Pet extends PetMemoryState {}
