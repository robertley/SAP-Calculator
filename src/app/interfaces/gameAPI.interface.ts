import { Player } from "../classes/player.class";

export interface GameAPI {
    player: Player;
    opponet: Player;
    tier3Pets?: string[];
}