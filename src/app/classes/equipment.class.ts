import { Pet } from './pet.class';

export class Equipment {
  equipmentClass: EquipmentClass;
  name: string;
  tier?: number;
  power?: number;
  originalPower?: number;
  uses?: number;
  originalUses?: number;
  callback: (pet: Pet) => void;
  attackCallback?: (pet: Pet, attackedPet: Pet) => void;

  // Multiplier properties set when equipment is equipped
  multiplier: number = 1;
  multiplierMessage: string = '';

  // Optional minimum damage this equipment can reduce attacks to
  minimumDamage?: number;

  constructor() {
    this.originalPower = this.power;
  }

  reset() {
    this.uses = this.originalUses;
  }
}

// snipe is a misnomer
// currently being used for tomato, egg, but also durian
// basically it is before attack. Cake is a special case that also has this class name so didnt want to change it
export type EquipmentClass =
  | 'shop'
  | 'defense'
  | 'shield'
  | 'attack'
  | 'ailment-defense'
  | 'ailment-attack'
  | 'faint'
  | 'afterFaint'
  | 'attack-snipe'
  | 'skewer'
  | 'snipe'
  | 'beforeStartOfBattle'
  | 'beforeAttack'
  | 'startOfBattle'
  | 'shield-snipe'
  | 'hurt'
  | 'target'
  | 'ailment-other';
