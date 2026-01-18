import { clone } from "lodash";
import type { Player } from "../player.class";
import { Pet } from "../pet.class";
import { LogService } from "../../services/log.service";
import { AbilityService } from "../../services/ability/ability.service";
import { Onion } from "../equipment/golden/onion.class";

export const pushPetsForward = (player: Player): void => {
    const array = clone(player.petArray);
    try {
        player.setPet(0, array[0]);
    } catch {
        player.pet0 = null;
    }
    try {
        player.setPet(1, array[1]);
    } catch {
        player.pet1 = null;
    }
    try {
        player.setPet(2, array[2]);
    } catch {
        player.pet2 = null;
    }
    try {
        player.setPet(3, array[3]);
    } catch {
        player.pet3 = null;
    }
    try {
        player.setPet(4, array[4]);
    } catch {
        player.pet4 = null;
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
    let slotWithSpace = null;
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
        for (let i = slotWithSpace; i < slot; i++) {
            player[`pet${i}`] = player[`pet${i + 1}`];
        }
        return true;
    }
    return false;
};

export const pushBackwardFromSlot = (player: Player, slot: number): boolean => {
    let slotWithSpace = null;
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
        for (let i = slotWithSpace; i > slot; i--) {
            player[`pet${i}`] = player[`pet${i - 1}`];
        }
        return true;
    }
    return false;
};

export const makeRoomForSlot = (player: Player, slot: number): void => {
    if (player.petArray.length === 5) {
        console.warn("No room to Make Room");
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
    abilityService: AbilityService
): void => {
    if (pet?.equipment?.name === "Brussels Sprout") {
        logService.createLog({
            message: `${pet.name} blocked being pushed. (Brussels Sprout)`,
            type: "equipment",
            player: pet.parent
        });
        pet.removePerk();
        return;
    }

    const position = pet.position;
    pet.parent[`pet${position}`] = null;
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
};

export const pushPetToFront = (
    player: Player,
    pet: Pet,
    jump: boolean | undefined,
    logService: LogService,
    abilityService: AbilityService
): void => {
    pushPet(player, pet, 4, jump, logService, abilityService);
};

export const pushPetToBack = (
    player: Player,
    pet: Pet,
    logService: LogService,
    abilityService: AbilityService
): void => {
    pushPet(player, pet, -4, false, logService, abilityService);
};
