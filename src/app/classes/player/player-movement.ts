import { clone } from 'lodash-es';
import type { Player } from '../player.class';
import { Pet } from '../pet.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';
import { Onion } from 'app/classes/equipment/golden/onion.class';


export const pushPetsForward = (player: Player): void => {
  const array = clone(player.petArray);
  try {
    player.setPet(0, array[0]);
  } catch {
    player.pet0 = undefined;
  }
  try {
    player.setPet(1, array[1]);
  } catch {
    player.pet1 = undefined;
  }
  try {
    player.setPet(2, array[2]);
  } catch {
    player.pet2 = undefined;
  }
  try {
    player.setPet(3, array[3]);
  } catch {
    player.pet3 = undefined;
  }
  try {
    player.setPet(4, array[4]);
  } catch {
    player.pet4 = undefined;
  }
};

export const onionCheck = (player: Player): void => {
  if (player.pet0?.equipment == null) {
    return;
  }
  if (player.pet0.equipment instanceof Onion) {
    player.pet0.equipment.callback(player.pet0);
    pushPetsForward(player);
  }
};

export const pushForwardFromSlot = (player: Player, slot: number): boolean => {
  let slotWithSpace: number | null = null;
  let isSpaceAhead = false;
  if (slot > 0) {
    if (player.pet0 == null) {
      isSpaceAhead = true;
      slotWithSpace = 0;
    }
  }
  if (slot > 1) {
    if (player.pet1 == null) {
      isSpaceAhead = true;
      slotWithSpace = 1;
    }
  }
  if (slot > 2) {
    if (player.pet2 == null) {
      isSpaceAhead = true;
      slotWithSpace = 2;
    }
  }
  if (slot > 3) {
    if (player.pet3 == null) {
      isSpaceAhead = true;
      slotWithSpace = 3;
    }
  }
  if (isSpaceAhead) {
    if (slotWithSpace == null) {
      return false;
    }
    const setSlot = (index: number, value?: Pet) => {
      switch (index) {
        case 0:
          player.pet0 = value;
          break;
        case 1:
          player.pet1 = value;
          break;
        case 2:
          player.pet2 = value;
          break;
        case 3:
          player.pet3 = value;
          break;
        case 4:
          player.pet4 = value;
          break;
      }
    };
    for (let i = slotWithSpace; i < slot; i++) {
      setSlot(i, player.getPet(i + 1));
    }
    return true;
  }
  return false;
};

export const pushBackwardFromSlot = (player: Player, slot: number): boolean => {
  let slotWithSpace: number | null = null;
  let isSpaceBehind = false;
  if (slot < 4) {
    if (player.pet4 == null) {
      isSpaceBehind = true;
      slotWithSpace = 4;
    }
  }
  if (slot < 3) {
    if (player.pet3 == null) {
      isSpaceBehind = true;
      slotWithSpace = 3;
    }
  }
  if (slot < 2) {
    if (player.pet2 == null) {
      isSpaceBehind = true;
      slotWithSpace = 2;
    }
  }
  if (slot < 1) {
    if (player.pet1 == null) {
      isSpaceBehind = true;
      slotWithSpace = 1;
    }
  }
  if (isSpaceBehind) {
    if (slotWithSpace == null) {
      return false;
    }
    const setSlot = (index: number, value?: Pet) => {
      switch (index) {
        case 0:
          player.pet0 = value;
          break;
        case 1:
          player.pet1 = value;
          break;
        case 2:
          player.pet2 = value;
          break;
        case 3:
          player.pet3 = value;
          break;
        case 4:
          player.pet4 = value;
          break;
      }
    };
    for (let i = slotWithSpace; i > slot; i--) {
      setSlot(i, player.getPet(i - 1));
    }
    return true;
  }
  return false;
};

export const makeRoomForSlot = (player: Player, slot: number): void => {
  if (player.petArray.length === 5) {
    console.warn('No room to Make Room');
    return;
  }
  if (pushForwardFromSlot(player, slot)) {
    return;
  }
  pushBackwardFromSlot(player, slot);
};

export const pushPet = (
  player: Player,
  pet: Pet,
  spaces: number = 1,
  jump: boolean | undefined,
  logService: LogService,
  abilityService: AbilityService,
): void => {
  if (pet?.equipment?.name === 'Brussels Sprout') {
    logService.createLog({
      message: `${pet.name} blocked being pushed. (Brussels Sprout)`,
      type: 'equipment',
      player: pet.parent,
    });
    pet.removePerk();
    return;
  }

  const position = pet.position;
  switch (position) {
    case 0:
      pet.parent.pet0 = undefined;
      break;
    case 1:
      pet.parent.pet1 = undefined;
      break;
    case 2:
      pet.parent.pet2 = undefined;
      break;
    case 3:
      pet.parent.pet3 = undefined;
      break;
    case 4:
      pet.parent.pet4 = undefined;
      break;
  }
  let destination;
  if (spaces > 0) {
    destination = Math.max(position - spaces, 0);
    if (player.getPet(destination) != null) {
      if (!pushForwardFromSlot(player, destination)) {
        pushBackwardFromSlot(player, destination);
      }
    }
    player.setPet(destination, pet);
  }
  if (spaces < 0) {
    destination = Math.min(position - spaces, 4);
    if (player.getPet(destination) != null) {
      if (!pushBackwardFromSlot(player, destination)) {
        pushForwardFromSlot(player, destination);
      }
    }
    player.setPet(destination, pet);
  }

  if (jump) {
    pet.jumped = true;
    abilityService.triggerJumpEvents(pet);
  } else {
    abilityService.triggerPushedEvents(pet);
  }

  if (player.pet0 == null) {
    abilityService.triggerEmptyFrontSpaceEvents(player);
    abilityService.executeEmptyFrontSpaceEvents();
    abilityService.triggerEmptyFrontSpaceToyEvents(player);
    abilityService.executeEmptyFrontSpaceToyEvents();
  } else {
    for (const teammate of player.petArray) {
      teammate.clearFrontTriggered = false;
    }
  }
};

export const pushPetToFront = (
  player: Player,
  pet: Pet,
  jump: boolean | undefined,
  logService: LogService,
  abilityService: AbilityService,
): void => {
  pushPet(player, pet, 4, jump, logService, abilityService);
};

export const pushPetToBack = (
  player: Player,
  pet: Pet,
  logService: LogService,
  abilityService: AbilityService,
): void => {
  pushPet(player, pet, -4, false, logService, abilityService);
};
