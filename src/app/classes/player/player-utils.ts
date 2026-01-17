import type { Player } from "../player.class";
import { Pet } from "../pet.class";

export const hasSilly = (pet: Pet): boolean => {
    return pet.equipment?.name === "Silly";
};

export const getPetsWithEquipment = (player: Player, equipmentName: string): Pet[] => {
    const pets: Pet[] = [];
    for (const pet of player.petArray) {
        if (!pet.alive) {
            continue;
        }
        if (equipmentName === "perk") {
            if (pet.equipment && !pet.equipment.equipmentClass?.startsWith("ailment")) {
                pets.push(pet);
            }
        } else if (pet.equipment?.name === equipmentName) {
            pets.push(pet);
        }
    }
    return pets;
};

export const getPetsWithoutEquipment = (player: Player, equipmentName: string): Pet[] => {
    const pets: Pet[] = [];
    for (const pet of player.petArray) {
        if (!pet.alive) {
            continue;
        }
        if (equipmentName === "Perk") {
            if (!pet.equipment || pet.equipment.name.startsWith("ailment")) {
                pets.push(pet);
            }
        } else {
            if (!pet.equipment || pet.equipment.name !== equipmentName) {
                pets.push(pet);
            }
        }
    }
    return pets;
};

export const getPetAtPosition = (player: Player, position: number): Pet | null => {
    for (const pet of player.petArray) {
        if (pet.position === position) {
            return pet;
        }
    }
    return null;
};

export const getManticoreMult = (player: Player): number[] => {
    const mult: number[] = [];
    for (const pet of player.petArray) {
        if (pet.hasTrigger(undefined, "Pet", "ManticoreAbility")) {
            for (const ability of pet.abilityList) {
                if (ability.name === "ManticoreAbility") {
                    mult.push(ability.level);
                }
            }
        }
    }

    return mult;
};
