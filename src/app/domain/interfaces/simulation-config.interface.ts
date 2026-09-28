import type { SimulationResult as EngineResult } from 'sap-battle-engine';
import type { Battle } from './battle.interface';
export type { SimulationConfig, PetConfig, CustomPackConfig, RandomDecisionCapture, RandomDecisionOverride, RandomDecisionOption } from 'sap-battle-engine';
export type CustomPackItem = string | number;
export interface SimulationResult extends Omit<EngineResult, 'battles'> { battles?: Battle[]; }
