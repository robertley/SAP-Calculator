import { Log } from "./log.interface";

export interface Battle {
    logs: Log[];
    winner: 'opponent' | 'player' | 'draw';
}