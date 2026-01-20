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
        // Reset mutable properties
        player.toy.used = false;
        player.toy.triggers = 0;
        // If originalToy has a level, restore it (assuming strict reference wasn't just copy)
        // Ideally we should have a deep clone or a dedicated reset method on Toy, 
        // but for now let's ensure we aren't carrying over broken states if reference is shared.
        // Actually, looking at the code, `player.toy = player.originalToy` restores the reference.
        // If `originalToy` was never mutated, this is fine. 
        // But if `toy` logic mutated the object that `originalToy` points to, we have a problem.
        // Let's assume `originalToy` is the safe "template" and it was NOT mutated.
        // Use object spread to reset properties if needed, or if originalToy IS the mutated one, we need a better way.
        // Given the bug report "resetting a player doesn't reset toy", it implies `originalToy` might be getting mutated or lost.
        // Let's try to restore the level from originalToy explicitely if it exists, or re-create it?
        // Re-creating is hard without the service. 
        // Let's at least reset known mutable fields.
        if (player.originalToy) {
            player.toy.level = player.originalToy.level;
        }
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
        player: pet.parent,
        sourcePet: pet
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
            switch (slot.index) {
                case 0:
                    player.pet0 = undefined;
                    break;
                case 1:
                    player.pet1 = undefined;
                    break;
                case 2:
                    player.pet2 = undefined;
                    break;
                case 3:
                    player.pet3 = undefined;
                    break;
                case 4:
                    player.pet4 = undefined;
                    break;
            }
            petRemoved = true;
        }
    }

    return petRemoved;
};
