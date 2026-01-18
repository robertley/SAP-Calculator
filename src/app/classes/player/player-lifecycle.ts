import type { Player } from "../player.class";
import { Pet } from "../pet.class";
import { LogService } from "../../services/log.service";
import { AbilityService } from "../../services/ability/ability.service";

export const alive = (player: Player): boolean => {
    return player.petArray.length > 0;
};

export const resetPets = (player: Player): void => {
    player.pet0 = player.orignalPet0;
    player.pet0?.resetPet();
    player.pet1 = player.orignalPet1;
    player.pet1?.resetPet();
    player.pet2 = player.orignalPet2;
    player.pet2?.resetPet();
    player.pet3 = player.orignalPet3;
    player.pet3?.resetPet();
    player.pet4 = player.orignalPet4;
    player.pet4?.resetPet();

    player.orignalPet0 = player.pet0;
    player.orignalPet1 = player.pet1;
    player.orignalPet2 = player.pet2;
    player.orignalPet3 = player.pet3;
    player.orignalPet4 = player.pet4;

    player.toy = player.originalToy;
    if (player.toy) {
        player.toy.used = false;
        player.toy.triggers = 0;
    }
    player.brokenToy = null;
    player.trumpets = 0;
    player.spawnedGoldenRetiever = false;
    player.summonedBoatThisBattle = false;
    player.cannedAilments = [];
};

export const resetJumpedFlags = (player: Player): void => {
    for (const pet of player.petArray) {
        if (pet) {
            pet.jumped = false;
        }
    }
};

export const createDeathLog = (pet: Pet, logService: LogService): void => {
    logService.createLog({
        message: `${pet.name} fainted.`,
        type: "death",
        player: pet.parent
    });
};

export const handleDeath = (pet: Pet, logService: LogService): void => {
    pet.seenDead = true;
    pet.setFaintEventIfPresent();
    createDeathLog(pet, logService);
};

export const checkPetsAlive = (player: Player, logService: LogService): void => {
    if (player.pet0 && !player.pet0.alive && !player.pet0.seenDead) {
        handleDeath(player.pet0, logService);
    }
    if (player.pet1 && !player.pet1.alive && !player.pet1.seenDead) {
        handleDeath(player.pet1, logService);
    }
    if (player.pet2 && !player.pet2.alive && !player.pet2.seenDead) {
        handleDeath(player.pet2, logService);
    }
    if (player.pet3 && !player.pet3.alive && !player.pet3.seenDead) {
        handleDeath(player.pet3, logService);
    }
    if (player.pet4 && !player.pet4.alive && !player.pet4.seenDead) {
        handleDeath(player.pet4, logService);
    }
};

export const removeDeadPets = (player: Player, abilityService: AbilityService): boolean => {
    let petRemoved = false;

    const petSlots = [
        { pet: player.pet0, index: 0 },
        { pet: player.pet1, index: 1 },
        { pet: player.pet2, index: 2 },
        { pet: player.pet3, index: 3 },
        { pet: player.pet4, index: 4 }
    ];

    for (const slot of petSlots) {
        if (slot.pet && !slot.pet.alive) {
            slot.pet.removed = true;
            abilityService.triggerAfterFaintEvents(slot.pet);
            player[`pet${slot.index}`] = null;
            petRemoved = true;
        }
    }

    return petRemoved;
};
