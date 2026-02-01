import { Pet } from './pet.class';
import { AbilityTrigger } from './ability.class';


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
  baseMultiplier: number = 1;

  // Optional minimum damage this equipment can reduce attacks to
  minimumDamage?: number;
  hasRandomEvents: boolean = false;
  triggers?: AbilityTrigger[];

  constructor() {
    this.originalPower = this.power;
    this.baseMultiplier = this.multiplier;
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
