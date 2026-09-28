import type { Battle as EngineBattle } from 'sap-battle-engine';
import { Log } from './log.interface';
export interface Battle extends Omit<EngineBattle, 'logs' | 'finalBoard'> { logs: Log[]; finalBoard?: EngineBattle['finalBoard']; }
