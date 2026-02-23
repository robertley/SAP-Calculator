export * from './types';
export * from './constants';
export * from './name-patterns';
export * from './text-formatting';
export * from './slot-utils';
export * from './log-parsers';
export * from './slot-resolver';
export * from './mutations';

import { Log } from 'app/domain/interfaces/log.interface';
import { FightAnimationBuildOptions, FightAnimationFrame, FightAnimationBoardState } from './types';
import { applyLogMutation, createEmptyMutationResult } from './mutations';
import { addPositionPrefix, normalizePositionBracketSpacing } from './text-formatting';
import { getPlainLogText } from '../app.component.simulation-log';
import { cloneSlots } from './slot-utils';
import { parseSideSlots } from './log-parsers';

export function buildFightAnimationFrames(
    logs: Log[],
    options: FightAnimationBuildOptions = {},
): FightAnimationFrame[] {
    if (!Array.isArray(logs) || logs.length === 0) {
        return [];
    }

    const includePositionPrefix = options.includePositionPrefix !== false;
    const includeBoardFrames = options.includeBoardFrames !== false;
    let boardState: FightAnimationBoardState | null = null;
    const frames: FightAnimationFrame[] = [];

    logs.forEach((log, logIndex) => {
        if (!log) {
            return;
        }

        if (log.type === 'board') {
            const parsedBoardState = parseFightAnimationBoardState(log.message ?? '');
            if (parsedBoardState) {
                boardState = parsedBoardState;
            }
        }

        if (!boardState) {
            return;
        }

        if (log.type === 'board' && !includeBoardFrames) {
            return;
        }

        const baseText = getPlainLogText(log);
        if (!baseText) {
            return;
        }

        const mutationResult =
            log.type !== 'board'
                ? applyLogMutation(boardState, log, baseText)
                : createEmptyMutationResult();
        const displayText = includePositionPrefix
            ? addPositionPrefix(baseText, log)
            : normalizePositionBracketSpacing(baseText);

        frames.push({
            index: frames.length,
            logIndex,
            type: log.type,
            text: displayText,
            randomEvent: log.randomEvent === true,
            impact: mutationResult.impact,
            popups: mutationResult.popups,
            death: mutationResult.death,
            shifts: mutationResult.shifts,
            equipmentChanges: mutationResult.equipmentChanges,
            toyChanges: mutationResult.toyChanges,
            playerSlots: cloneSlots(boardState.playerSlots),
            opponentSlots: cloneSlots(boardState.opponentSlots),
            playerToyName: boardState.playerToyName,
            playerHardToyName: boardState.playerHardToyName,
            opponentToyName: boardState.opponentToyName,
            opponentHardToyName: boardState.opponentHardToyName,
        });
    });

    return frames;
}

export function parseFightAnimationBoardState(
    message: string,
): FightAnimationBoardState | null {
    if (!message || !message.includes('|')) {
        return null;
    }

    const [playerRaw, opponentRaw] = message.split('|');
    if (playerRaw == null || opponentRaw == null) {
        return null;
    }

    const playerResult = parseSideSlots(playerRaw, 'player');
    const opponentResult = parseSideSlots(opponentRaw, 'opponent');
    if (!playerResult || !opponentResult) {
        return null;
    }

    return {
        playerSlots: playerResult.slots,
        opponentSlots: opponentResult.slots,
        playerToyName: playerResult.toyName,
        playerHardToyName: playerResult.hardToyName,
        opponentToyName: opponentResult.toyName,
        opponentHardToyName: opponentResult.hardToyName,
    };
}
