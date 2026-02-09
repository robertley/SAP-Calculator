import { Pet } from '../pet.class';
import type { Player } from '../player.class';
import { LogService } from 'app/integrations/log.service';
import { AbilityService } from 'app/integrations/ability/ability.service';
import { GameService } from 'app/runtime/state/game.service';
import { getRandomInt } from 'app/runtime/random';
import { hasSilly } from './player-utils';
import { makeRoomForSlot, pushBackwardFromSlot, pushForwardFromSlot } from './player-movement';
import type { PlayerLike } from './player-like.types';


export const summonPet = (
  player: PlayerLike,
  spawnPet: Pet,
  position: number,
  fly: boolean,
  summoner: Pet | undefined,
  logService: LogService,
  abilityService: AbilityService,
  gameService: GameService,
): { success: boolean; randomEvent: boolean } => {
  if (summoner && hasSilly(summoner)) {
    const targetTeam = Math.random() < 0.5 ? player : player.opponent;
    const randomPosition = getRandomInt(0, 4);

    spawnPet.parent = targetTeam as Player;

    const result = summonPet(
      targetTeam,
      spawnPet,
      randomPosition,
      fly,
      undefined,
      logService,
      abilityService,
      gameService,
    );
    return { success: result.success, randomEvent: true };
  }
  if (position < 0 || position > 4) {
    if (!fly) {
      logService.createLog({
        message: `No room to spawn ${spawnPet.name}!`,
        type: 'ability',
        player: player as Player,
      });
    }
    return { success: false, randomEvent: false };
  }

  if (fly && player.getPet(position) != null) {
    return { success: false, randomEvent: false };
  }

  if (player.petArray.length === 5) {
    if (!fly) {
      logService.createLog({
        message: `No room to spawn ${spawnPet.name}!`,
        type: 'ability',
        player: player as Player,
      });
    }
    return { success: false, randomEvent: false };
  }
  const isPlayer = player === gameService.gameApi.player;
  if (isPlayer) {
    gameService.gameApi.playerSummonedAmount++;
  } else {
    gameService.gameApi.opponentSummonedAmount++;
  }
  if (position === 0) {
    if (player.pet0 != null) {
      makeRoomForSlot(player, 0);
    }
    player.setPet(0, spawnPet);
  }
  if (position === 1) {
    if (player.pet1 != null) {
      makeRoomForSlot(player, 1);
    }
    player.setPet(1, spawnPet);
  }
  if (position === 2) {
    if (player.pet2 != null) {
      makeRoomForSlot(player, 2);
    }
    player.setPet(2, spawnPet);
  }
  if (position === 3) {
    if (player.pet3 != null) {
      makeRoomForSlot(player, 3);
    }
    player.setPet(3, spawnPet);
  }
  if (position === 4) {
    if (player.pet4 != null) {
      makeRoomForSlot(player, 4);
    }
    player.setPet(4, spawnPet);
  }
  abilityService.triggerSummonEvents(spawnPet);

  return { success: true, randomEvent: false };
};

export const transformPet = (
  player: PlayerLike,
  originalPet: Pet,
  newPet: Pet,
  abilityService: AbilityService,
  gameService: GameService,
): void => {
  const targetPlayer = originalPet?.parent ?? player;

  if (newPet.parent !== targetPlayer) {
    newPet.parent = targetPlayer as Player;
  }

  targetPlayer.setPet(originalPet.position, newPet);
  const isPlayer = targetPlayer === gameService.gameApi.player;
  if (isPlayer) {
    gameService.gameApi.playerTransformationAmount++;
  } else {
    gameService.gameApi.opponentTransformationAmount++;
  }
  originalPet.transformed = true;
  originalPet.transformedInto = newPet;
  newPet.applyEquipment(newPet.equipment);
  abilityService.triggerTransformEvents(originalPet);
};

export const summonPetInFront = (
  player: PlayerLike,
  summoner: Pet,
  summonedPet: Pet,
  logService: LogService,
  abilityService: AbilityService,
  gameService: GameService,
): { success: boolean; randomEvent: boolean } => {
  if (player.petArray.length === 5) {
    logService.createLog({
      message: `No room to spawn ${summonedPet.name}!`,
      type: 'ability',
      player: player as Player,
    });
    return { success: false, randomEvent: false };
  }

  let hasSpaceInFront = false;
  for (let pos = 0; pos < summoner.position; pos++) {
    if (player.getPet(pos) == null) {
      hasSpaceInFront = true;
      break;
    }
  }

  if (hasSpaceInFront) {
    return summonPet(
      player,
      summonedPet,
      summoner.position - 1,
      false,
      summoner,
      logService,
      abilityService,
      gameService,
    );
  }

  const oldPosition = summoner.position;
  const destination = Math.min(oldPosition + 1, 4);
  summoner.parent[`pet${oldPosition}`] = null;
  if (player.getPet(destination) != null) {
    pushBackwardFromSlot(player, destination);
  }
  player.setPet(destination, summoner);
  return summonPet(
    player,
    summonedPet,
    oldPosition,
    false,
    summoner,
    logService,
    abilityService,
    gameService,
  );
};

export const summonPetBehind = (
  player: PlayerLike,
  summoner: Pet,
  summonedPet: Pet,
  logService: LogService,
  abilityService: AbilityService,
  gameService: GameService,
): { success: boolean; randomEvent: boolean } => {
  if (player.petArray.length === 5) {
    logService.createLog({
      message: `No room to spawn ${summonedPet.name}!`,
      type: 'ability',
      player: player as Player,
    });
    return { success: false, randomEvent: false };
  }

  let hasSpaceInFront = false;
  for (let pos = 0; pos < summoner.position; pos++) {
    if (player.getPet(pos) == null) {
      hasSpaceInFront = true;
      break;
    }
  }

  if (hasSpaceInFront) {
    const position = summoner.position;
    summoner.parent[`pet${position}`] = null;
    const destination = Math.max(position - 1, 0);
    if (player.getPet(destination) != null) {
      pushForwardFromSlot(player, destination);
    }
    player.setPet(destination, summoner);
    return summonPet(
      player,
      summonedPet,
      summoner.position + 1,
      false,
      summoner,
      logService,
      abilityService,
      gameService,
    );
  }

  return summonPet(
    player,
    summonedPet,
    summoner.position + 1,
    false,
    summoner,
    logService,
    abilityService,
    gameService,
  );
};






