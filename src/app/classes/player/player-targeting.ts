import { clone, shuffle } from "lodash-es";
import type { Player } from "../player.class";
import { Pet } from "../pet.class";
import { getRandomInt } from "../../util/helper-functions";
import { getPetAtPosition, getPetsWithEquipment, hasSilly } from "./player-utils";

export interface PetRandomResult {
    pet: Pet | null;
    random: boolean;
}

export interface PetsRandomResult {
    pets: Pet[];
    random: boolean;
}

export const getRandomPet = (
    player: Player,
    excludePets?: Pet[],
    donut?: boolean,
    blueberry?: boolean,
    notFiftyFifty?: boolean,
    callingPet?: Pet,
    includeOpponent?: boolean
): PetRandomResult => {
    if (callingPet && hasSilly(callingPet)) {
        return getRandomLivingPet(player, excludePets);
    }

    let pets: Pet[] = [];
    if (includeOpponent) {
        pets = [...player.petArray, ...player.opponent.petArray];
    } else {
        pets = player.petArray;
    }

    if (donut && blueberry) {
        const donutPets = getPetsWithEquipment(player, "Donut").filter((pet) => !excludePets?.includes(pet));
        const blueberryPets = getPetsWithEquipment(player, "Blueberry").filter((pet) => !excludePets?.includes(pet));
        if (donutPets.length > 0 || blueberryPets.length > 0) {
            pets = [...donutPets, ...blueberryPets];
        }
    } else if (donut) {
        const donutPets = getPetsWithEquipment(player, "Donut").filter((pet) => !excludePets?.includes(pet));
        if (donutPets.length > 0) {
            pets = donutPets;
        }
        if (notFiftyFifty) {
            pets = pets.filter((pet) => {
                return pet.health !== 50
                    || pet.attack !== 50
                    || pet.hasTrigger(undefined, "Pet", "BehemothAbility")
                    || pet.hasTrigger(undefined, "Pet", "GiantTortoiseAbility");
            });

            if (pets.length === 0) {
                pets = player.petArray;
            }
        }
    } else if (blueberry) {
        const blueberryPets = getPetsWithEquipment(player, "Blueberry").filter((pet) => !excludePets?.includes(pet));
        if (blueberryPets.length > 0) {
            pets = blueberryPets;
        }
    }

    pets = pets.filter((pet) => {
        let keep = true;
        if (excludePets) {
            keep = !excludePets.includes(pet);
        }
        return keep && pet.health > 0;
    });

    if (notFiftyFifty) {
        const beforeFilterPets = clone(pets);
        pets = pets.filter((pet) => {
            return pet.health !== 50 || pet.attack !== 50;
        });
        if (pets.length === 0) {
            pets = beforeFilterPets;
        }
    }

    if (pets.length === 0) {
        return { pet: null, random: false };
    }
    const index = getRandomInt(0, pets.length - 1);
    return { pet: pets[index], random: pets.length > 1 };
};

export const getRandomPets = (
    player: Player,
    amt: number,
    excludePets?: Pet[],
    donut?: boolean,
    blueberry?: boolean,
    callingPet?: Pet,
    includeOpponent?: boolean
): PetsRandomResult => {
    if (callingPet && hasSilly(callingPet)) {
        return getRandomLivingPets(player, amt);
    }

    const pets: Pet[] = [];
    const localExclude = excludePets ?? [];
    let random = true;
    for (let i = 0; i < amt; i++) {
        const petResp = getRandomPet(player, localExclude, donut, blueberry, undefined, callingPet, includeOpponent);
        random = petResp.random;
        if (petResp.pet == null) {
            break;
        }
        localExclude.push(petResp.pet);
        pets.push(petResp.pet);
    }

    return { pets, random };
};

export const getRandomLivingPets = (player: Player, amt: number): PetsRandomResult => {
    const pets: Pet[] = [];
    const excludePets: Pet[] = [];

    const getCandidatePool = (excludes: Pet[]) => {
        let candidates = [...player.petArray, ...player.opponent.petArray];

        const donutPets = getPetsWithEquipment(player, "Donut").filter((pet) => !excludes?.includes(pet));
        const blueberryPets = getPetsWithEquipment(player, "Blueberry").filter((pet) => !excludes?.includes(pet));
        const opponentDonutPets = getPetsWithEquipment(player.opponent, "Donut").filter((pet) => !excludes?.includes(pet));
        const opponentBlueberryPets = getPetsWithEquipment(player.opponent, "Blueberry").filter((pet) => !excludes?.includes(pet));

        if (donutPets.length > 0 || blueberryPets.length > 0 || opponentDonutPets.length > 0 || opponentBlueberryPets.length > 0) {
            candidates = [
                ...donutPets,
                ...blueberryPets,
                ...opponentDonutPets,
                ...opponentBlueberryPets
            ];
        }

        return candidates.filter((pet) => {
            let keep = true;
            if (excludes) {
                keep = !excludes.includes(pet);
            }
            return keep && pet.health > 0;
        });
    };

    const initialCandidateCount = getCandidatePool(excludePets).length;

    for (let i = 0; i < amt; i++) {
        const petResp = getRandomLivingPet(player, excludePets);
        if (petResp.pet == null) {
            break;
        }
        excludePets.push(petResp.pet);
        pets.push(petResp.pet);
    }

    return { pets, random: initialCandidateCount > pets.length };
};

export const getAll = (player: Player, includeOpponent: boolean, callingPet?: Pet, excludeSelf?: boolean): PetsRandomResult => {
    if (callingPet && hasSilly(callingPet)) {
        const allLivingPets = [...player.petArray, ...player.opponent.petArray].filter(pet => pet.alive);
        return { pets: allLivingPets, random: false };
    }

    let pets: Pet[] = [];
    if (includeOpponent) {
        pets = [...player.petArray, ...player.opponent.petArray];
    } else {
        pets = [...player.petArray];
    }
    if (excludeSelf) {
        pets = pets.filter((pet) => pet !== callingPet);
    }

    pets = pets.filter((pet) => pet.alive);
    return { pets, random: false };
};

export const getMiddleFriend = (player: Player, callingPet?: Pet): PetRandomResult => {
    if (callingPet && hasSilly(callingPet)) {
        return getRandomLivingPet(player);
    }

    const pet = player.getPet(2) ?? null;
    return { pet, random: false };
};

export const getLastPet = (player: Player, excludePets?: Pet[], callingPet?: Pet): PetRandomResult => {
    if (callingPet && hasSilly(callingPet)) {
        return getRandomLivingPet(player);
    }

    for (const pet of [...player.petArray].reverse()) {
        if (pet.alive && (!excludePets || !excludePets.includes(pet))) {
            return { pet, random: false };
        }
    }
    return { pet: null, random: false };
};

export const getLastPets = (player: Player, count: number, excludePets?: Pet[], callingPet?: Pet): PetsRandomResult => {
    if (callingPet && hasSilly(callingPet)) {
        return getRandomLivingPets(player, count);
    }

    const availablePets = [...player.petArray].filter((pet) => pet.alive && (!excludePets || !excludePets.includes(pet)));

    if (availablePets.length === 0) {
        return { pets: [], random: false };
    }

    const reversedPets = [...availablePets].reverse();
    const targets = reversedPets.slice(0, count);

    return { pets: targets, random: false };
};

export const getHighestHealthPet = (player: Player, excludePet?: Pet, callingPet?: Pet): PetRandomResult => {
    if (callingPet && hasSilly(callingPet)) {
        return getRandomLivingPet(player);
    }
    const targets = player.petArray.filter((pet) => pet !== excludePet && pet.alive);
    if (targets.length === 0) {
        return { pet: null, random: false };
    }
    let highestHealthPets: Pet[] = [];
    for (let i in player.petArray) {
        const index = +i;
        const pet = player.petArray[index];
        if (pet === excludePet) {
            continue;
        }
        if (highestHealthPets.length === 0) {
            highestHealthPets = [pet];
            continue;
        }
        if (pet.health === highestHealthPets[0].health) {
            highestHealthPets.push(pet);
            continue;
        }
        if (pet.health > highestHealthPets[0].health) {
            highestHealthPets = [pet];
        }
    }
    if (highestHealthPets.length === 0) {
        return { pet: null, random: false };
    }
    return {
        pet: highestHealthPets[getRandomInt(0, highestHealthPets.length - 1)],
        random: highestHealthPets.length > 1
    };
};

export const getHighestAttackPet = (player: Player, excludePet?: Pet, callingPet?: Pet): PetRandomResult => {
    if (callingPet && hasSilly(callingPet)) {
        return getRandomLivingPet(player);
    }
    let highestAttackPets: Pet[] = [];
    for (let i in player.petArray) {
        const index = +i;
        const pet = player.petArray[index];
        if (pet === excludePet) {
            continue;
        }
        if (!pet.alive) {
            continue;
        }
        if (highestAttackPets.length === 0) {
            highestAttackPets = [pet];
            continue;
        }
        if (pet.attack === highestAttackPets[0].attack) {
            highestAttackPets.push(pet);
            continue;
        }
        if (pet.attack > highestAttackPets[0].attack) {
            highestAttackPets = [pet];
        }
    }
    const pet = highestAttackPets.length === 0 ? null : highestAttackPets[getRandomInt(0, highestAttackPets.length - 1)];

    return {
        pet,
        random: pet == null ? false : highestAttackPets.length > 1
    };
};

export const getHighestAttackPets = (player: Player, count: number, excludePets?: Pet[], callingPet?: Pet): PetsRandomResult => {
    if (callingPet && hasSilly(callingPet)) {
        return getRandomLivingPets(player, count);
    }

    const availablePets = [...player.petArray].filter((pet) => pet.alive && (!excludePets || !excludePets.includes(pet)));

    if (availablePets.length === 0) {
        return { pets: [], random: false };
    }

    const shuffledPets = shuffle(availablePets);
    shuffledPets.sort((a, b) => b.attack - a.attack);
    const targets = shuffledPets.slice(0, count);
    let isRandom = false;
    if (targets.length === count && shuffledPets.length > count) {
        const lastSelectedAttack = targets[count - 1].attack;
        const nextPetAttack = shuffledPets[count].attack;
        if (lastSelectedAttack === nextPetAttack) {
            isRandom = true;
        }
    }
    return { pets: targets, random: isRandom };
};

export const getLowestAttackPets = (player: Player, count: number, excludePets?: Pet[], callingPet?: Pet): PetsRandomResult => {
    if (callingPet && hasSilly(callingPet)) {
        return getRandomLivingPets(player, count);
    }

    const availablePets = [...player.petArray].filter((pet) => pet.alive && (!excludePets || !excludePets.includes(pet)));

    if (availablePets.length === 0) {
        return { pets: [], random: false };
    }

    const shuffledPets = shuffle(availablePets);
    shuffledPets.sort((a, b) => a.attack - b.attack);
    const targets = shuffledPets.slice(0, count);
    let isRandom = false;
    if (targets.length === count && shuffledPets.length > count) {
        const lastSelectedAttack = targets[count - 1].attack;
        const nextPetAttack = shuffledPets[count].attack;
        if (lastSelectedAttack === nextPetAttack) {
            isRandom = true;
        }
    }
    return { pets: targets, random: isRandom };
};

export const getLowestAttackPet = (player: Player, excludePet?: Pet, callingPet?: Pet): PetRandomResult => {
    if (callingPet && hasSilly(callingPet)) {
        return getRandomLivingPet(player);
    }
    let lowestAttackPets: Pet[] = [];
    for (let i in player.petArray) {
        const index = +i;
        const pet = player.petArray[index];
        if (pet === excludePet) {
            continue;
        }
        if (!pet.alive) {
            continue;
        }
        if (lowestAttackPets.length === 0) {
            lowestAttackPets = [pet];
            continue;
        }
        if (pet.attack === lowestAttackPets[0].attack) {
            lowestAttackPets.push(pet);
            continue;
        }
        if (pet.attack < lowestAttackPets[0].attack) {
            lowestAttackPets = [pet];
        }
    }
    const pet = lowestAttackPets.length === 0 ? null : lowestAttackPets[getRandomInt(0, lowestAttackPets.length - 1)];

    return {
        pet,
        random: pet == null ? false : lowestAttackPets.length > 1
    };
};

export const getLowestHealthPet = (player: Player, excludePet?: Pet, callingPet?: Pet): PetRandomResult => {
    if (callingPet && hasSilly(callingPet)) {
        return getRandomLivingPet(player);
    }
    let lowestHealthPets: Pet[] = [];
    for (let i in player.petArray) {
        const index = +i;
        const pet = player.petArray[index];
        if (pet === excludePet) {
            continue;
        }
        if (!pet.alive) {
            continue;
        }
        if (lowestHealthPets.length === 0) {
            lowestHealthPets = [pet];
            continue;
        }
        if (pet.health === lowestHealthPets[0].health) {
            lowestHealthPets.push(pet);
            continue;
        }
        if (pet.health < lowestHealthPets[0].health) {
            lowestHealthPets = [pet];
        }
    }
    const pet = lowestHealthPets.length === 0 ? null : lowestHealthPets[getRandomInt(0, lowestHealthPets.length - 1)];

    return {
        pet,
        random: pet == null ? false : lowestHealthPets.length > 1
    };
};

export const getLowestHealthPets = (player: Player, count: number, excludePets?: Pet[], callingPet?: Pet): PetsRandomResult => {
    if (callingPet && hasSilly(callingPet)) {
        return getRandomLivingPets(player, count);
    }

    const availablePets = [...player.petArray].filter((pet) => pet.alive && (!excludePets || !excludePets.includes(pet)));

    if (availablePets.length === 0) {
        return { pets: [], random: false };
    }

    const shuffledPets = shuffle(availablePets);
    shuffledPets.sort((a, b) => a.health - b.health);

    const targets = shuffledPets.slice(0, count);

    let isRandom = false;
    if (targets.length === count && shuffledPets.length > count) {
        const lastSelectedHealth = targets[count - 1].health;
        const nextPetHealth = shuffledPets[count].health;
        if (lastSelectedHealth === nextPetHealth) {
            isRandom = true;
        }
    }

    return { pets: targets, random: isRandom };
};

export const getHighestHealthPets = (player: Player, count: number, excludePets?: Pet[], callingPet?: Pet): PetsRandomResult => {
    if (callingPet && hasSilly(callingPet)) {
        return getRandomLivingPets(player, count);
    }

    const availablePets = [...player.petArray].filter((pet) => pet.alive && (!excludePets || !excludePets.includes(pet)));

    if (availablePets.length === 0) {
        return { pets: [], random: false };
    }

    const shuffledPets = shuffle(availablePets);
    shuffledPets.sort((a, b) => b.health - a.health);

    const targets = shuffledPets.slice(0, count);

    let isRandom = false;
    if (targets.length === count && shuffledPets.length > count) {
        const lastSelectedHealth = targets[count - 1].health;
        const nextPetHealth = shuffledPets[count].health;
        if (lastSelectedHealth === nextPetHealth) {
            isRandom = true;
        }
    }

    return { pets: targets, random: isRandom };
};

export const getHighestTierPets = (player: Player, count: number, excludePets?: Pet[], callingPet?: Pet): PetsRandomResult => {
    if (callingPet && hasSilly(callingPet)) {
        return getRandomLivingPets(player, count);
    }

    const availablePets = [...player.petArray].filter((pet) => pet.alive && (!excludePets || !excludePets.includes(pet)));

    if (availablePets.length === 0) {
        return { pets: [], random: false };
    }

    const shuffledPets = shuffle(availablePets);
    shuffledPets.sort((a, b) => b.tier - a.tier);

    const targets = shuffledPets.slice(0, count);

    let isRandom = false;
    if (targets.length === count && shuffledPets.length > count) {
        const lastSelectedTier = targets[count - 1].tier;
        const nextPetTier = shuffledPets[count].tier;
        if (lastSelectedTier === nextPetTier) {
            isRandom = true;
        }
    }

    return { pets: targets, random: isRandom };
};

export const getTierXOrLowerPet = (player: Player, tier: number, excludePets?: Pet[], callingPet?: Pet): PetRandomResult => {
    if (callingPet && hasSilly(callingPet)) {
        return getRandomLivingPet(player);
    }

    const availablePets = [...player.petArray].filter((pet) => pet.alive && pet.tier <= tier && (!excludePets || !excludePets.includes(pet)));

    if (availablePets.length === 0) {
        return { pet: null, random: false };
    }

    const index = getRandomInt(0, availablePets.length - 1);
    return { pet: availablePets[index], random: availablePets.length > 1 };
};

export const getFurthestUpPet = (player: Player, callingPet?: Pet, excludePets?: Pet[]): PetRandomResult => {
    if (callingPet && hasSilly(callingPet)) {
        return getRandomLivingPet(player);
    }

    for (const pet of player.petArray) {
        if (pet.alive) {
            if (excludePets && excludePets.includes(pet)) {
                continue;
            }
            return { pet, random: false };
        }
    }
    return { pet: null, random: false };
};

export const getFurthestUpPets = (player: Player, count: number, excludePets?: Pet[], callingPet?: Pet): PetsRandomResult => {
    if (callingPet && hasSilly(callingPet)) {
        return getRandomLivingPets(player, count);
    }

    const availablePets = [...player.petArray].filter((pet) => pet.alive && (!excludePets || !excludePets.includes(pet)));

    if (availablePets.length === 0) {
        return { pets: [], random: false };
    }

    const targets = availablePets.slice(0, count);
    return { pets: targets, random: false };
};

export const nearestPetsBehind = (player: Player, amt: number, callingPet: Pet, excludePets?: Pet[]): PetsRandomResult => {
    if (callingPet && hasSilly(callingPet)) {
        return getRandomLivingPets(player, amt);
    }

    const allPetsBehind = callingPet.getPetsBehind(amt * 2);
    const filteredPets = allPetsBehind.filter(pet => !excludePets || !excludePets.includes(pet));
    const pets = filteredPets.slice(0, amt);
    return { pets, random: false };
};

export const getThis = (player: Player, callingPet: Pet): PetRandomResult => {
    if (callingPet && hasSilly(callingPet)) {
        return getRandomLivingPet(player);
    }

    return { pet: callingPet, random: false };
};

export const getSpecificPet = (player: Player, callingPet: Pet, target: Pet): PetRandomResult => {
    if (callingPet && hasSilly(callingPet)) {
        return getRandomLivingPet(player);
    }

    return { pet: target, random: false };
};

export const nearestPetsAhead = (
    player: Player,
    amt: number,
    callingPet: Pet,
    excludePets?: Pet[],
    includeOpponent?: boolean
): PetsRandomResult => {
    if (callingPet && hasSilly(callingPet)) {
        return getRandomLivingPets(player, amt);
    }

    const allPetsAhead = callingPet.getPetsAhead(amt * 2, includeOpponent || false);
    const filteredPets = allPetsAhead.filter(pet => !excludePets || !excludePets.includes(pet));
    const pets = filteredPets.slice(0, amt);
    return { pets, random: false };
};

export const getStrongestPet = (player: Player, callingPet?: Pet): PetRandomResult => {
    if (callingPet && hasSilly(callingPet)) {
        return getRandomLivingPet(player);
    }

    let strongestPets: Pet[] = [];
    let maxStrength = -1;
    const pets = shuffle(player.petArray.filter(p => p.alive));

    for (const pet of pets) {
        const strength = pet.attack + pet.health;
        if (strength > maxStrength) {
            maxStrength = strength;
            strongestPets = [pet];
        } else if (strength === maxStrength) {
            strongestPets.push(pet);
        }
    }

    if (strongestPets.length === 0) {
        return { pet: null, random: false };
    }

    const selectedPet = strongestPets[getRandomInt(0, strongestPets.length - 1)];
    return {
        pet: selectedPet,
        random: strongestPets.length > 1
    };
};

export const getPetsWithinXSpaces = (player: Player, callingPet: Pet, range: number): PetsRandomResult => {
    if (callingPet && hasSilly(callingPet)) {
        return getRandomLivingPets(player, range * 2);
    }

    const callingPosition = callingPet.savedPosition;
    const targets: Pet[] = [];

    for (const pet of player.petArray) {
        if (pet.alive && pet !== callingPet) {
            const distance = Math.abs(pet.position - callingPosition);
            if (distance > 0 && distance <= range) {
                targets.push(pet);
            }
        }
    }

    for (const pet of player.opponent.petArray) {
        if (pet.alive) {
            const distance = callingPosition + pet.position + 1;
            if (distance <= range) {
                targets.push(pet);
            }
        }
    }

    return { pets: targets, random: false };
};

export const getOppositeEnemyPet = (player: Player, callingPet: Pet): PetRandomResult => {
    if (callingPet && hasSilly(callingPet)) {
        return getRandomLivingPet(player);
    }

    const position = callingPet.position;

    let target = getPetAtPosition(player.opponent, position);
    if (target && target.alive) {
        return { pet: target, random: false };
    }

    for (let distance = 1; distance <= 4; distance++) {
        target = getPetAtPosition(player.opponent, position + distance);
        if (target && target.alive) {
            return { pet: target, random: false };
        }

        target = getPetAtPosition(player.opponent, position - distance);
        if (target && target.alive) {
            return { pet: target, random: false };
        }
    }

    return { pet: null, random: false };
};

export const getRandomLivingPet = (player: Player, excludePets?: Pet[]): PetRandomResult => {
    let pets = [...player.petArray, ...player.opponent.petArray];

    const donutPets = getPetsWithEquipment(player, "Donut").filter((pet) => !excludePets?.includes(pet));
    const blueberryPets = getPetsWithEquipment(player, "Blueberry").filter((pet) => !excludePets?.includes(pet));
    const opponentDonutPets = getPetsWithEquipment(player.opponent, "Donut").filter((pet) => !excludePets?.includes(pet));
    const opponentBlueberryPets = getPetsWithEquipment(player.opponent, "Blueberry").filter((pet) => !excludePets?.includes(pet));

    if (donutPets.length > 0 || blueberryPets.length > 0 || opponentDonutPets.length > 0 || opponentBlueberryPets.length > 0) {
        pets = [
            ...donutPets,
            ...blueberryPets,
            ...opponentDonutPets,
            ...opponentBlueberryPets
        ];
    }

    pets = pets.filter((pet) => {
        let keep = true;
        if (excludePets) {
            keep = !excludePets.includes(pet);
        }
        return keep && pet.health > 0;
    });

    if (pets.length === 0) {
        return { pet: null, random: false };
    }
    const index = getRandomInt(0, pets.length - 1);
    return { pet: pets[index], random: pets.length > 1 };
};
