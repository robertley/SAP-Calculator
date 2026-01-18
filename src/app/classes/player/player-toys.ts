import type { Player } from "../player.class";
import { AbilityEvent } from "../../interfaces/ability-event.interface";
import { Puma } from "../pets/puppy/tier-6/puma.class";
import { LogService } from "../../services/log.service";
import { AbilityService } from "../../services/ability/ability.service";
import { GameService } from "../../services/game.service";
import { Toy } from "../toy.class";

export const breakToy = (
    player: Player,
    respawn: boolean,
    logService: LogService,
    abilityService: AbilityService,
    gameService: GameService
): void => {
    if (player.toy == null) {
        return;
    }
    player.brokenToy = player.toy;
    logService.createLog({
        message: `${player.toy.name} broke!`,
        type: "ability",
        player: player,
        randomEvent: false
    });
    if (player.toy.onBreak != null) {
        const events: AbilityEvent[] = [{
            callback: player.toy.onBreak.bind(player.toy),
            priority: 99
        }];
        const toyLevel = player.toy.level;
        for (const pet of player.petArray) {
            if (pet instanceof Puma) {
                const callback = () => {
                    player.toy.level = pet.level;
                    player.toy.onBreak(gameService.gameApi, true);
                    player.toy.level = toyLevel;
                };
                events.push({
                    callback: callback,
                    priority: pet.attack
                });
            }
        }
        events.sort((a, b) => {
            return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0;
        });
        for (const event of events) {
            event.callback(gameService.gameApi);
        }
    }
    player.toy = null;
    if (respawn) {
        setToy(player, player.brokenToy);
    }
};

export const setToy = (player: Player, toy: Toy): void => {
    player.toy = toy;
};
