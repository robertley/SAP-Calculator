import type { Player } from "../player.class";
import { Equipment } from "../equipment.class";
import { Pet } from "../pet.class";
import { LogService } from "../../services/log.service";
import { AbilityService } from "../../services/ability/ability.service";
import { GameService } from "../../services/game.service";
import { AbilityTrigger } from "../ability.class";
import { GameAPI } from "../../interfaces/gameAPI.interface";
import { GoldenRetriever } from "../pets/hidden/golden-retriever.class";
import { hasSilly } from "./player-utils";
import { summonPet } from "./player-summon";

export const resolveTrumpetGainTarget = (player: Player, callingPet?: Pet): { player: Player; random: boolean } => {
    if (callingPet && hasSilly(callingPet)) {
        const targetPlayer = Math.random() < 0.5 ? player : player.opponent;
        return { player: targetPlayer, random: true };
    }
    return { player, random: false };
};

export const gainTrumpets = (
    player: Player,
    amt: number,
    pet: Pet | Equipment,
    logService: LogService,
    pteranodon?: boolean,
    pantherMultiplier?: number,
    cherry?: boolean,
    randomEvent?: boolean
): void => {
    player.trumpets = Math.min(50, player.trumpets += amt);
    const opponentGain = pet instanceof Pet && pet.parent != null && pet.parent !== player;
    let message = opponentGain
        ? `${pet.name} gave opponent ${amt} trumpets. (${player.trumpets})`
        : `${pet.name} gained ${amt} trumpets. (${player.trumpets})`;
    if (cherry) {
        message += " (Cherry)";
    }
    logService.createLog({
        message,
        type: "trumpets",
        player,
        pteranodon,
        pantherMultiplier,
        randomEvent
    });
};

export const spendTrumpets = (
    player: Player,
    amt: number,
    pet: Pet,
    logService: LogService,
    pteranodon?: boolean
): void => {
    player.trumpets = Math.max(0, player.trumpets -= amt);
    logService.createLog({
        message: `${pet.name} spent ${amt} trumpets. (${player.trumpets})`,
        type: "trumpets",
        player,
        pteranodon
    });
};

export const checkGoldenSpawn = (
    player: Player,
    abilityService: AbilityService,
    logService: LogService,
    gameService: GameService
): void => {
    if (player.spawnedGoldenRetiever) {
        return;
    }
    if (player.petArray.length > 1 || player.trumpets === 0) {
        return;
    }
    abilityService.setgoldenRetrieverSummonsEvent({
        priority: 0,
        callback: (trigger: AbilityTrigger, gameApi: GameAPI, triggerPet?: Pet) => {
            const goldenRetriever = new GoldenRetriever(logService, abilityService, player, player.trumpets, player.trumpets);

            const name = player === gameApi.player ? "Player" : "Opponent";

            logService.createLog(
                {
                    message: `${name} spawned Golden Retriever (${goldenRetriever.attack}/${goldenRetriever.health})`,
                    type: "ability",
                    player
                }
            );

            summonPet(player, goldenRetriever, 0, false, undefined, logService, abilityService, gameService);
            player.trumpets = 0;
        }
    });

    player.spawnedGoldenRetiever = true;
};
