import { clone, cloneDeep, shuffle, sum } from "lodash";
import { Pet } from "./pet.class";
import { LogService } from "../services/log.service";
import { getOpponent, getRandomInt } from "../util/helper-functions";
import { AbilityService } from "../services/ability.service";
import { Toy } from "./toy.class";
import { Equipment } from "./equipment.class";
import { AbilityEvent } from "../interfaces/ability-event.interface";
import { Puma } from "./pets/puppy/tier-6/puma.class";
import { GameService } from "../services/game.service";
import { GoldenRetriever } from "./pets/hidden/golden-retriever.class";
import { Onion } from "./equipment/golden/onion.class";

export class Player {
    pet0?: Pet;
    pet1?: Pet;
    pet2?: Pet;
    pet3?: Pet;
    pet4?: Pet;

    private orignalPet0?: Pet;
    private orignalPet1?: Pet;
    private orignalPet2?: Pet;
    private orignalPet3?: Pet;
    private orignalPet4?: Pet;

    pack: 'Turtle' | 'Puppy' | 'Star' | 'Golden' | 'Custom' | 'Unicorn' | 'Danger'= 'Turtle' ;

    toy: Toy;
    brokenToy: Toy;
    originalToy: Toy;

    trumpets: number = 0;
    spawnedGoldenRetiever: boolean = false;
    summonedBoatThisBattle: boolean = false;

    constructor(private logService: LogService, private abilityService: AbilityService, private gameService: GameService) {
    }

    alive(): boolean {
        return this.petArray.length > 0;
    }

    resetPets() {
        this.pet0 = this.orignalPet0;
        this.pet0?.resetPet();
        this.pet1 = this.orignalPet1;
        this.pet1?.resetPet();
        this.pet2 = this.orignalPet2;
        this.pet2?.resetPet();
        this.pet3 = this.orignalPet3;
        this.pet3?.resetPet();
        this.pet4 = this.orignalPet4;
        this.pet4?.resetPet();

        this.orignalPet0 = this.pet0;
        this.orignalPet1 = this.pet1;
        this.orignalPet2 = this.pet2;
        this.orignalPet3 = this.pet3;
        this.orignalPet4 = this.pet4;

        this.toy = this.originalToy;
        if (this.toy) {
            this.toy.used = false;
            this.toy.triggers = 0;
        }
        this.brokenToy = null
        this.trumpets = 0;
        this.spawnedGoldenRetiever = false;
        this.summonedBoatThisBattle = false;
    }

    setPet(index: number, pet: Pet, init=false) {
        let oldPet = this.getPet(index);
        if (oldPet != null) {
            // oldPet.savedPosition = null;
        }
        if (index == 0) {
            this.pet0 = pet;
            if (pet != null) {
                this.pet0.savedPosition = 0;
            }
            if (init) {
                this.orignalPet0 = pet;
            }
        }
        if (index == 1) {
            this.pet1 = pet;
            if (pet != null) {
                this.pet1.savedPosition = 1;
            }
            if (init) {
                this.orignalPet1 = pet;
            }
        }
        if (index == 2) {
            this.pet2 = pet;
            if (pet != null) {
                this.pet2.savedPosition = 2;
            }
            if (init) {
                this.orignalPet2 = pet;
            }
        }
        if (index == 3) {
            this.pet3 = pet;
            if (pet != null) {
                this.pet3.savedPosition = 3;
            }
            if (init) {
                this.orignalPet3 = pet;
            }
        }
        if (index == 4) {
            this.pet4 = pet;
            if (pet != null) {
                this.pet4.savedPosition = 4;
            }
            if (init) {
                this.orignalPet4 = pet;
            }
        }
        if (init && pet != null) {
            pet.originalSavedPosition = pet.savedPosition;
        }
    }

    getPet(index: number) {
        return this[`pet${index}`];
    }

    pushPetsForward() {
        let array = clone(this.petArray);
        try {
            this.setPet(0, array[0]);
        } catch {
            this.pet0 = null;
        }
        try {
            this.setPet(1, array[1]);
        } catch {
            this.pet1 = null;
        }
        try {
            this.setPet(2, array[2]);
        } catch {
            this.pet2 = null;
        }
        try {
            this.setPet(3, array[3]);
        } catch {
            this.pet3 = null;
        }
        try {
            this.setPet(4, array[4]);
        } catch {
            this.pet4 = null;
        }        
    }

    onionCheck() {
        if (this.pet0?.equipment == null) {
            return;
        }
        if (this.pet0.equipment instanceof Onion) {
            this.pet0.equipment.callback(this.pet0);
            this.pushPetsForward();
        }
    }

    // TODO - no room logic
    summonPet(spawnPet: Pet, position: number, fly=false, summoner?: Pet): {success: boolean, randomEvent: boolean} {
        // Handle Silly ailment randomization
        if (summoner && this.hasSilly(summoner)) {
            // Randomly choose team (50% chance each)
            let targetTeam = Math.random() < 0.5 ? this : this.opponent;
            // Randomly choose position (0-4) without checking availability
            let randomPosition = getRandomInt(0, 4);
            
            spawnPet.parent = targetTeam;
            
            let result = targetTeam.summonPet(spawnPet, randomPosition, fly, undefined);
            return {success: result.success, randomEvent: true};
        }

        if (this.petArray.length == 5) {
            if (!fly) {
                this.logService.createLog({
                    message: `No room to spawn ${spawnPet.name}!`,
                    type: 'ability',
                    player: this
                })
            }
            return {success: false, randomEvent: false};
        }
        let isPlayer = this == this.gameService.gameApi.player;
        if (isPlayer) {
            this.gameService.gameApi.playerSummonedAmount++;
        } else {
            this.gameService.gameApi.opponentSummonedAmount++;
        }
        if (position == 0) {
            if (this.pet0 != null) {
                this.makeRoomForSlot(0)
            }
            this.setPet(0, spawnPet);
        }
        if (position == 1) {
            if (this.pet1 != null) {
                this.makeRoomForSlot(1)
            }
            this.setPet(1, spawnPet);
        }
        if (position == 2) {
            if (this.pet2 != null) {
                this.makeRoomForSlot(2)
            }
            this.setPet(2, spawnPet);
        }
        if (position == 3) {
            if (this.pet3 != null) {
                this.makeRoomForSlot(3)
            }
            this.setPet(3, spawnPet);
        }
        if (position == 4) {
            if (this.pet4 != null) {
                this.makeRoomForSlot(4)
            }
            this.setPet(4, spawnPet);
        }
        if (spawnPet.summoned != null) {
            this.abilityService.setSummonedEvent({
                callback: spawnPet.summoned.bind(spawnPet),
                priority: spawnPet.attack,
                pet: spawnPet
            })
        }

        let opponent = getOpponent(this.gameService.gameApi, this);

        this.abilityService.triggerEnemySummonedEvents(opponent, spawnPet);

        return {success: true, randomEvent: false};
    }

    transformPet(originalPet: Pet, newPet: Pet): void {
        this.setPet(originalPet.position, newPet);
        let isPlayer = this == this.gameService.gameApi.player;
        if (isPlayer) {
            this.gameService.gameApi.playerTransformationAmount++;
        } else {
            this.gameService.gameApi.opponentTransformationAmount++;
        }
        // Set transformation flags for ability execution tracking
        originalPet.transformed = true;
        originalPet.transformedInto = newPet;
        newPet.applyEquipment(newPet.equipment);
        if (newPet.transform) {
            this.abilityService.setTransformEvent({
                callback: newPet.transform.bind(newPet),
                priority: newPet.attack,
                pet: newPet
            });
        }
        this.abilityService.triggerFriendTransformedEvents(this, newPet);
    }
    /** 
     *@returns if able to make space
    */
    pushForwardFromSlot(slot: number) {
        let slotWithSpace = null;
        // isSpaceAhead
        let isSpaceAhead = false;
        if (slot > 0) {
            if (this.pet0 == null) {
                isSpaceAhead = true;
                slotWithSpace = 0;
            }
        }
        if (slot > 1) {
            if (this.pet1 == null) {
                isSpaceAhead = true;
                slotWithSpace = 1;
            }
        }
        if (slot > 2) {
            if (this.pet2 == null) {
                isSpaceAhead = true;
                slotWithSpace = 2;
            }
        }
        if (slot > 3) {
            if (this.pet3 == null) {
                isSpaceAhead = true;
                slotWithSpace = 3;
            }
        }
        if (isSpaceAhead) {
            for (let i = slotWithSpace; i < slot; i++) {
                this[`pet${i}`] = this[`pet${i+1}`];
            }
            return true;
        }
        return false;
    }
    /**
     * @returns if able to make space
     */
    pushBackwardFromSlot(slot: number) {
        let slotWithSpace = null;
        let isSpaceBehind = false;
        if (slot < 4) {
            if (this.pet4 == null) {
                isSpaceBehind = true;
                slotWithSpace = 4;
            }
        }
        if (slot < 3) {
            if (this.pet3 == null) {
                isSpaceBehind = true;
                slotWithSpace = 3;
            }
        }
        if (slot < 2) {
            if (this.pet2 == null) {
                isSpaceBehind = true;
                slotWithSpace = 2;
            }
        }
        if (slot < 1) {
            if (this.pet1 == null) {
                isSpaceBehind = true;
                slotWithSpace = 1;
            }
        }
        if (isSpaceBehind) {
            for (let i = slotWithSpace; i > slot; i--) {
                this[`pet${i}`] = this[`pet${i-1}`];
            }
            return;
        }

    }
    makeRoomForSlot(slot: number) {
        if (this.petArray.length == 5) {
            console.warn("No room to Make Room") // should never happen
            return;
        }
        if (this.pushForwardFromSlot(slot)) {
            return;
        } else {
            this.pushBackwardFromSlot(slot)
        }
    }

    get petArray(): Pet[] {
        let petArray: Pet[] = [];

        if (this.pet0 != null) {
            petArray.push(this.pet0);
        }
        
        if (this.pet1 != null) {
            petArray.push(this.pet1);
        }

        if (this.pet2 != null) {
            petArray.push(this.pet2);
        }

        if (this.pet3 != null) {
            petArray.push(this.pet3);
        }

        if (this.pet4 != null) {
            petArray.push(this.pet4);
        }
  
        return petArray;
    }

    handleDeath(pet: Pet) {
        pet.seenDead = true;
        pet.setFaintEventIfPresent();
        let petBehind = pet.petBehind(null, true);
        if (petBehind?.friendAheadFaints != null && petBehind?.alive) {
            this.abilityService.setFriendAheadFaintsEvent({
                    callback: petBehind.friendAheadFaints.bind(petBehind),
                    priority: petBehind.attack,
                    player: this,
                    callbackPet: pet,
                    pet: petBehind
                })
        }
        this.createDeathLog(pet);
    }

    checkPetsAlive() {
        if (this.pet0 && !this.pet0.alive && !this.pet0.seenDead) {
            this.handleDeath(this.pet0)
            // this.pet0 = null;
        }
        if (this.pet1 && !this.pet1.alive && !this.pet1.seenDead) {
            this.handleDeath(this.pet1)
            // this.pet1 = null;
        }
        if (this.pet2 && !this.pet2.alive && !this.pet2.seenDead) {
            this.handleDeath(this.pet2)
            // this.pet2 = null;
        }
        if (this.pet3 && !this.pet3.alive && !this.pet3.seenDead) {
            this.handleDeath(this.pet3)
            // this.pet3 = null;
        }
        if (this.pet4 && !this.pet4.alive && !this.pet4.seenDead) {
            this.handleDeath(this.pet4)
            // this.pet4 = null;
        }
    }

    removeDeadPets(): boolean {
        let petRemoved = false;
        
        // Map pets to their slots for cleaner iteration
        const petSlots = [
            { pet: this.pet0, index: 0 },
            { pet: this.pet1, index: 1 },
            { pet: this.pet2, index: 2 },
            { pet: this.pet3, index: 3 },
            { pet: this.pet4, index: 4 }
        ];
        
        for (const slot of petSlots) {
            if (slot.pet && !slot.pet.alive) {
                if (slot.pet.afterFaint) {
                    this.abilityService.setAfterFaintEvents({
                        callback: slot.pet.afterFaint.bind(slot.pet),
                        priority: slot.pet.attack,
                        player: this,
                        callbackPet: slot.pet,
                        pet: slot.pet
                    });
                } else {
                    slot.pet.disabled = true;
                }
                this.abilityService.triggerFriendFaintsEvents(slot.pet);
                this.abilityService.triggerenemyFaintsEvents(slot.pet);
                // Mark pet as disabled before removing
                // Set the pet property to null using the index
                this[`pet${slot.index}`] = null;
                petRemoved = true;
            }
        }
        
        return petRemoved;
    }

    createDeathLog(pet: Pet) {
        this.logService.createLog({
            message: `${pet.name} fainted.`,
            type: "death",
            player: pet.parent
        })
    }

    /**
     * During the turn life cycle a pet may have fainted but not removed.
     * Those pets cannot be returned from this method.
     * @param excludePet pet we want to exclude from being chosen
     * @returns Pet or null
     */
    getRandomPet(excludePets?: Pet[], donut?: boolean, blueberry?: Boolean, notFiftyFifty?: boolean, callingPet?: Pet, includeOpponent?: boolean): {pet: Pet, random: boolean} {
        // Check for Silly ailment - get random pet from both teams, ignoring exclusions
        if (callingPet && this.hasSilly(callingPet)) {
            let randomPetResp = this.getRandomLivingPet();
            return { pet: randomPetResp.pet, random: randomPetResp.random };
        }
        
        // Normal behavior
        let pets = []
        if (includeOpponent) {
            pets = [
                ...this.petArray,
                ...this.opponent.petArray
            ]
        } else {
            pets = this.petArray;
        }
        
        if (donut && blueberry) {
            let donutPets = this.getPetsWithEquipment('Donut').filter((pet) => { !excludePets?.includes(pet) });
            let blueberryPets = this.getPetsWithEquipment('Blueberry').filter((pet) => { !excludePets?.includes(pet) });
            if (donutPets.length > 0 || blueberryPets.length > 0) {
                pets = [
                    ...donutPets,
                    ...blueberryPets
                ]
            }
        }
        else if (donut) {
            let donutPets = this.getPetsWithEquipment('Donut').filter((pet) => { !excludePets?.includes(pet) });
            if (donutPets.length > 0) {
                pets = donutPets;
            }
            if (notFiftyFifty) {
                pets = pets.filter((pet) => {
                    return pet.health != 50 || pet.attack != 50 || pet.name == 'Behemoth';
                });

                if (pets.length == 0) {
                    pets = this.petArray;
                }
            }
        }
        else if (blueberry) {
            let blueberryPets = this.getPetsWithEquipment('Blueberry').filter((pet) => { !excludePets?.includes(pet) });
            if (blueberryPets.length > 0) {
                pets = blueberryPets;
            }
        }
        
        pets = pets.filter((pet) => {
            let keep = true;
            if (excludePets)
                keep = !excludePets.includes(pet);
            return keep && pet.health > 0;
        });

        if (notFiftyFifty) {
            let beforeFilterPets = clone(pets);
            pets = pets.filter((pet) => {
                return pet.health != 50 || pet.attack != 50;
            });
            if (pets.length == 0) {
                pets = beforeFilterPets;
            }
        }
        
        if (pets.length == 0) {
            return { pet: null, random: false };
        }
        let index = getRandomInt(0, pets.length - 1);
        return { pet: pets[index], random: pets.length > 1 };
    }

    /**
     * Will prioritize donut or blueberry pets. does not expect both arguments to be true.
     * @param amt amount of pets to return
     * @param excludePets pets to exclude from the random selection
     * @param donut find donut pets first
     * @param blueberry fine blueberry pets first
     * @returns pet array
     */
    getRandomPets(amt: number, excludePets?: Pet[], donut?: boolean, blueberry?: Boolean, callingPet?: Pet, includeOpponent?: boolean): {pets: Pet[], random: boolean} {
        // Check for Silly ailment - get random pets from both teams, ignoring exclusions
        if (callingPet && this.hasSilly(callingPet)) {
            let petsResp = this.getRandomLivingPets(amt);           
            return { pets: petsResp.pets, random: petsResp.random };
        }
        
        // Normal behavior
        let pets = [];
        excludePets = excludePets ?? [];
        for (let i = 0; i < amt; i++) {
            let petResp = this.getRandomPet(excludePets, donut, blueberry, null, callingPet, includeOpponent);
            if (petResp.pet == null) {
                break;
            }
            excludePets.push(petResp.pet);
            pets.push(petResp.pet);
        }
        
        return { pets: pets, random: pets.length > amt };
    }

    /**
     * Returns multiple random living pets from both teams with donut/blueberry prioritization.
     * Calls getRandomLivingPet in a loop, same relationship as getRandomPets/getRandomPet.
     * @param amt Number of pets to return
     * @returns Array of random living pets from both teams
     */
    getRandomLivingPets(amt: number): {pets: Pet[], random: boolean} {
        let pets = [];
        let excludePets: Pet[] = [];
        
        for (let i = 0; i < amt; i++) {
            let petResp = this.getRandomLivingPet(excludePets);
            if (petResp.pet == null) {
                break;
            }
            excludePets.push(petResp.pet);
            pets.push(petResp.pet);
        }
        
        return { pets: pets, random: pets.length > amt };
    }

    /**
     * Returns all living pets with optional opponent inclusion and Silly ailment handling.
     * @param includeOpponent Whether to include opponent's pets
     * @param callingPet Pet calling this method (for Silly ailment detection)
     * @returns Array of all living pets with random boolean
     */
    getAll(includeOpponent: boolean, callingPet?: Pet, excludeSelf?: boolean): {pets: Pet[], random: boolean} {
        // Check for Silly ailment - return all living pets from both teams
        if (callingPet && this.hasSilly(callingPet)) {
            let allLivingPets = [...this.petArray, ...this.opponent.petArray].filter(p => p.alive);
            return { pets: allLivingPets, random: false };
        }
        
        // Normal behavior
        let pets = [];
        if (includeOpponent) {
            pets = [...this.petArray, ...this.opponent.petArray];
        } else {
            pets = [...this.petArray];
        }
        if (excludeSelf) {
            pets = pets.filter((pet) => pet != callingPet)
        }
        // Filter to living pets only
        pets = pets.filter((pet) => pet.alive);
        
        return { pets: pets, random: false };
    }

    getPetsWithEquipment(equipmentName: string): Pet[] {
        let pets = [];
        for (let pet of this.petArray) {
            if (!pet.alive) {
                continue;
            }
            if (pet.equipment?.name == equipmentName) {
                pets.push(pet);
            }
        }
        return pets;
    }

    getPetAtPosition(position: number): Pet {
        for (let pet of this.petArray) {
            if (pet.position == position) {
                return pet;
            }
        }
        return null;
    }

    getLastPet(excludePets?: Pet[], callingPet?: Pet): {pet: Pet, random: boolean} {
        // Check for Silly ailment - return random living pet, ignoring exclusions
        if (callingPet && this.hasSilly(callingPet)) {
            let randomPetResp = this.getRandomLivingPet();
            return { pet: randomPetResp.pet, random: randomPetResp.random };
        }
        
        for (let pet of [...this.petArray].reverse()) {
            if (pet.alive && (!excludePets || !excludePets.includes(pet))) {
                return { pet: pet, random: false };
            }
        }
        return { pet: null, random: false };
    }

    /**
     * Returns multiple pets from the back of the formation (rightmost positions first)
     * @param count Number of pets to return
     * @param excludeEquipment Optional equipment name to exclude pets that already have it, or 'perk-less'
     * @param callingPet Pet calling this method (for Silly ailment detection)
     * @returns Array of pets from back positions
     */
    getLastPets(count: number, excludeEquipment?: string, callingPet?: Pet): {pets: Pet[], random: boolean} {
        // Check for Silly ailment - return random living pets
        if (callingPet && this.hasSilly(callingPet)) {
            let petsResp = this.getRandomLivingPets(count);
            return { pets: petsResp.pets, random: petsResp.random };
        }

        let availablePets = [...this.petArray].filter((pet) => pet.alive);
        if (excludeEquipment) {
            if (excludeEquipment == 'perk-less') {
                availablePets = availablePets.filter((pet) => pet.equipment == null || pet.equipment?.name.startsWith('ailment'));
            } else {
                availablePets = availablePets.filter((pet) => pet.equipment?.name != excludeEquipment);
            }
        }
        
        if (availablePets.length === 0) {
            return { pets: [], random: false };
        }
        
        // Reverse to get pets from back positions first (position 4, 3, 2, 1, 0)
        let reversedPets = [...availablePets].reverse();
        let targets = reversedPets.slice(0, count);
        
        return { pets: targets, random: false };
    }

    /**
     * Returns highest health pet. Returns a random pet of highest health if there are multiple.
     * @param excludePet
     * @param callingPet Pet calling this method (for Silly ailment detection)
     * @returns 
     */
    getHighestHealthPet(excludePet?: Pet, callingPet?: Pet): {
        pet: Pet,
        random: boolean
    } {
        // Check for Silly ailment - return random living pet, ignoring exclusions
        if (callingPet && this.hasSilly(callingPet)) {
            let randomPetResp = this.getRandomLivingPet();
            return { pet: randomPetResp.pet, random: randomPetResp.random };
        }
        let targets = this.petArray.filter((pet) => { return pet != excludePet && pet.alive });
        if (targets.length == 0) {
            return { pet: null, random: false };
        }
        let highestHealthPets: Pet[];
        for (let i in this.petArray) {
            let index = +i;
            let pet = this.petArray[index];
            if (pet == excludePet) {
                continue;
            }
            if (highestHealthPets == null) {
                highestHealthPets = [pet];
                continue;
            }
            if (pet.health == highestHealthPets[0].health) {
                highestHealthPets.push(pet);
                continue;
            }
            if (pet.health > highestHealthPets[0].health) {
                highestHealthPets = [pet];
            }
        }
        return { 
            pet: highestHealthPets[getRandomInt(0, highestHealthPets.length - 1)],
            random: highestHealthPets.length > 1
        }
    }

    /**
     * Returns highest attack pet. Returns a random pet of highest attack if there are multiple.
     * @param excludePet
     * @param callingPet Pet calling this method (for Silly ailment detection)
     * @returns 
     */
    getHighestAttackPet(excludePet?: Pet, callingPet?: Pet): {pet: Pet, random: boolean} {
        // Check for Silly ailment - return random living pet, ignoring exclusions
        if (callingPet && this.hasSilly(callingPet)) {
            let randomPetResp = this.getRandomLivingPet();
            return { pet: randomPetResp.pet, random: randomPetResp.random };
        }
        let highestAttackPets: Pet[];
        for (let i in this.petArray) {
            let index = +i;
            let pet = this.petArray[index];
            if (pet == excludePet) {
                continue;
            }
            if (!pet.alive) {
                continue;
            }
            if (highestAttackPets == null) {
                highestAttackPets = [pet];
                continue;
            }
            if (pet.attack == highestAttackPets[0].attack) {
                highestAttackPets.push(pet);
                continue;
            }
            if (pet.attack > highestAttackPets[0].attack) {
                highestAttackPets = [pet];
            }
        }
        let pet = highestAttackPets == null ? null : highestAttackPets[getRandomInt(0, highestAttackPets.length - 1)];

        return {
            pet: pet,
            random: pet == null ? false : highestAttackPets.length > 1
        };
    }

    /**
     * Returns lowest attack pet. Returns a random pet of lowest attack if there are multiple.
     * @param excludePet
     * @param callingPet Pet calling this method (for Silly ailment detection)
     * @returns 
     */
    getLowestAttackPet(excludePet?: Pet, callingPet?: Pet): {pet: Pet, random: boolean} {
        // Check for Silly ailment - return random living pet, ignoring exclusions
        if (callingPet && this.hasSilly(callingPet)) {
            let randomPetResp = this.getRandomLivingPet();
            return { pet: randomPetResp.pet, random: randomPetResp.random };
        }
        let lowestAttackPets: Pet[];
        for (let i in this.petArray) {
            let index = +i;
            let pet = this.petArray[index];
            if (pet == excludePet) {
                continue;
            }
            if (!pet.alive) {
                continue;
            }
            if (lowestAttackPets == null) {
                lowestAttackPets = [pet];
                continue;
            }
            if (pet.attack == lowestAttackPets[0].attack) {
                lowestAttackPets.push(pet);
                continue;
            }
            if (pet.attack < lowestAttackPets[0].attack) {
                lowestAttackPets = [pet];
            }
        }
        let pet = lowestAttackPets == null ? null : lowestAttackPets[getRandomInt(0, lowestAttackPets.length - 1)];

        return {
            pet: pet,
            random: pet == null ? false : lowestAttackPets.length > 1
        };
    }

    /**
     * Returns lowest health pet. Returns a random pet of lowest health if there are multiple. Will only return alive pets.
     * @param excludePet
     * @param callingPet Pet calling this method (for Silly ailment detection)
     * @returns 
     */
    getLowestHealthPet(excludePet?: Pet, callingPet?: Pet): {pet: Pet, random: boolean} {
        // Check for Silly ailment - return random living pet, ignoring exclusions  
        if (callingPet && this.hasSilly(callingPet)) {
            let randomPetResp = this.getRandomLivingPet();
            return { pet: randomPetResp.pet, random: randomPetResp.random };
        }
        let lowestHealthPets: Pet[];
        for (let i in this.petArray) {
            let index = +i;
            let pet = this.petArray[index];
            if (pet == excludePet) {
                continue;
            }
            if (!pet.alive) {
                continue;
            }
            if (lowestHealthPets == null) {
                lowestHealthPets = [pet];
                continue;
            }
            if (pet.health == lowestHealthPets[0].health) {
                lowestHealthPets.push(pet);
                continue;
            }
            if (pet.health < lowestHealthPets[0].health) {
                lowestHealthPets = [pet];
            }
        }
        let pet = lowestHealthPets == null ? null : lowestHealthPets[getRandomInt(0, lowestHealthPets.length - 1)];

        return {
            pet: pet,
            random: pet == null ? false : lowestHealthPets.length > 1
        };
    }

    /**
     * Returns multiple lowest health pets sorted by health (lowest first), excluding pets that already have specified equipment
     * @param count Number of pets to return
     * @param excludeEquipment Optional equipment name to exclude pets that already have it
     * @returns Array of pets sorted by health (lowest first)
     */
    getLowestHealthPets(count: number, excludeEquipment?: string, callingPet?: Pet): {pets: Pet[], random: boolean} {
        // Check for Silly ailment - return random living pets
        if (callingPet && this.hasSilly(callingPet)) {
            let petsResp = this.getRandomLivingPets(count);
            return { pets: petsResp.pets, random: petsResp.random };
        }

        let availablePets = [...this.petArray].filter((pet) => pet.alive);
        if (excludeEquipment) {
            availablePets = availablePets.filter((pet) => pet.equipment?.name != excludeEquipment);
        }
        
        if (availablePets.length === 0) {
            return { pets: [], random: false };
        }
        
        // Shuffle first, then sort by health (lowest first)
        let shuffledPets = shuffle(availablePets);
        shuffledPets.sort((a, b) => a.health - b.health);
        
        let targets = shuffledPets.slice(0, count);
        
        // Check if the (count+1)th pet has the same health as the count-th pet
        let isRandom = false;
        if (targets.length === count && shuffledPets.length > count) {
            let lastSelectedHealth = targets[count - 1].health;
            let nextPetHealth = shuffledPets[count].health;
            if (lastSelectedHealth === nextPetHealth) {
                isRandom = true;
            }
        }
        
        return { pets: targets, random: isRandom };
    }

    /**
     * Returns multiple highest health pets sorted by health (highest first), excluding pets that already have specified equipment
     * @param count Number of pets to return  
     * @param excludeEquipment Optional equipment name to exclude pets that already have it
     * @returns Array of pets sorted by health (highest first)
     */
    getHighestHealthPets(count: number, excludeEquipment?: string, callingPet?: Pet): {pets: Pet[], random: boolean} {
        // Check for Silly ailment - return random living pets
        if (callingPet && this.hasSilly(callingPet)) {
            let petsResp = this.getRandomLivingPets(count);
            return { pets: petsResp.pets, random: petsResp.random};
        }

        let availablePets = [...this.petArray].filter((pet) => pet.alive);
        if (excludeEquipment) {
            availablePets = availablePets.filter((pet) => pet.equipment?.name != excludeEquipment);
        }
        
        if (availablePets.length === 0) {
            return { pets: [], random: false };
        }
        
        // Shuffle first, then sort by health (highest first)
        let shuffledPets = shuffle(availablePets);
        shuffledPets.sort((a, b) => b.health - a.health);
        
        let targets = shuffledPets.slice(0, count);
        
        // Check if the (count+1)th pet has the same health as the count-th pet
        let isRandom = false;
        if (targets.length === count && shuffledPets.length > count) {
            let lastSelectedHealth = targets[count - 1].health;
            let nextPetHealth = shuffledPets[count].health;
            if (lastSelectedHealth === nextPetHealth) {
                isRandom = true;
            }
        }
        
        return { pets: targets, random: isRandom };
    }

    /**
     * Returns multiple highest tier pets sorted by tier (highest first)
     * @param count Number of pets to return  
     * @param excludeEquipment Optional equipment name to exclude pets that already have it
     * @param callingPet Pet calling this method (for Silly ailment detection)
     * @returns Array of pets sorted by tier (highest first)
     */
    getHighestTierPets(count: number, excludeEquipment?: string, callingPet?: Pet): {pets: Pet[], random: boolean} {
        // Check for Silly ailment - return random living pets
        if (callingPet && this.hasSilly(callingPet)) {
            let petsResp = this.getRandomLivingPets(count)
            return { pets: petsResp.pets, random: petsResp.random };
        }

        let availablePets = [...this.petArray].filter((pet) => pet.alive);
        if (excludeEquipment) {
            availablePets = availablePets.filter((pet) => pet.equipment?.name != excludeEquipment);
        }
        
        if (availablePets.length === 0) {
            return { pets: [], random: false };
        }
        
        // Shuffle first, then sort by tier (highest first)
        let shuffledPets = shuffle(availablePets);
        shuffledPets.sort((a, b) => b.tier - a.tier);
        
        let targets = shuffledPets.slice(0, count);
        
        // Check if the (count+1)th pet has the same tier as the count-th pet
        let isRandom = false;
        if (targets.length === count && shuffledPets.length > count) {
            let lastSelectedTier = targets[count - 1].tier;
            let nextPetTier = shuffledPets[count].tier;
            if (lastSelectedTier === nextPetTier) {
                isRandom = true;
            }
        }
        
        return { pets: targets, random: isRandom };
    }
        /**
     * Returns a pet that's tier X or lower
     * @param excludeEquipment Optional equipment name to exclude pets that already have it
     * @param callingPet Pet calling this method (for Silly ailment detection)
     * @returns Array of pets sorted by tier (highest first)
     */
    getTierXOrLowerPet(tier: number, excludeEquipment?: string, callingPet?: Pet): {pet: Pet, random: boolean} {
        // Check for Silly ailment - return random living pets
        if (callingPet && this.hasSilly(callingPet)) {
            let petResp = this.getRandomLivingPet();
            return { pet: petResp.pet, random: petResp.random };
        }

        let availablePets = [...this.petArray].filter((pet) => pet.alive && pet.tier <= tier);
        if (excludeEquipment) {
            availablePets = availablePets.filter((pet) => pet.equipment?.name != excludeEquipment);
        }
        
        if (availablePets.length === 0) {
            return { pet: null, random: false };
        }
        
        let index = getRandomInt(0, availablePets.length - 1);
        return { pet: availablePets[index], random: availablePets.length > 1 };

    }
    get furthestUpPet(): Pet {
        for (let pet of this.petArray) {
            if (pet.alive) {
                return pet;
            }
        }
        return null;
    }
    getFurthestUpPet(callingPet?: Pet): {pet: Pet, random: boolean} {
        // Check for Silly ailment - return random living pet, ignoring all positioning
        if (callingPet && this.hasSilly(callingPet)) {
            let randomPetResp = this.getRandomLivingPet();
            return { pet: randomPetResp.pet, random: randomPetResp.random };
        }
        
        for (let pet of this.petArray) {
            if (pet.alive) {
                return { pet: pet, random: false };
            }
        }
        return { pet: null, random: false };
    }

    /**
     * Returns multiple pets from the furthest up positions (front of the team)
     * @param count Number of pets to return
     * @param excludeEquipment Optional equipment name to exclude pets that already have it
     * @param callingPet Pet calling this method (for Silly ailment detection)
     * @returns Object with pets array and random boolean (for Silly compatibility)
     */
    getFurthestUpPets(count: number, excludeEquipment?: string, callingPet?: Pet, onlyEquipment?: string, excludePets?: Pet[]): {pets: Pet[], random: boolean} {
        // Check for Silly ailment - return random living pets
        if (callingPet && this.hasSilly(callingPet)) {
            let petsResp = this.getRandomLivingPets(count);
            return { pets: petsResp.pets, random: petsResp.random};
        }

        let availablePets = [...this.petArray].filter((pet) => pet.alive && !excludePets?.includes(pet));
        if (excludeEquipment) {
            if (excludeEquipment == 'perk-less') {
                availablePets = availablePets.filter((pet) => pet.equipment == null || pet.equipment?.name.startsWith('ailment'));
            } else {
                availablePets = availablePets.filter((pet) => pet.equipment?.name != excludeEquipment);
            }
        }
        if (onlyEquipment) {
            availablePets = availablePets.filter((pet) => pet.equipment?.name == onlyEquipment);
        }
        if (availablePets.length === 0) {
            return { pets: [], random: false };
        }
        
        // Get pets from front positions first (position 0, 1, 2, 3, 4)
        let targets = availablePets.slice(0, count);
                
        return { pets: targets, random: false };
    }

    /**
     * Returns pets behind the calling pet, starting from the position right behind it
     * @param amt Number of pets to return
     * @param callingPet Pet calling this method (for Silly ailment detection)
     * @param excludeEquipment Optional equipment name to exclude pets that already have it
     * @returns Array of pets behind the calling pet
     */
    nearestPetsBehind(amt: number, callingPet: Pet, excludeEquipment?: string): {pets: Pet[], random: boolean} {
        // Check for Silly ailment - return random living pets from both teams
        if (callingPet && this.hasSilly(callingPet)) {
            let petsResp = this.getRandomLivingPets(amt);
            return { pets: petsResp.pets, random: petsResp.random };
        }

        // Use the existing getPetsBehind method on the calling pet
        let pets = callingPet.getPetsBehind(amt, excludeEquipment);
        return { pets: pets, random: false };
    }

    /**
     * Returns the calling pet normally, but returns a random living pet when Silly is active
     * @param callingPet Pet calling this method (for Silly ailment detection)
     * @returns The calling pet or random pet if Silly is active
     */
    getThis(callingPet: Pet): {pet: Pet, random: boolean} {
        // Check for Silly ailment - return random living pet from both teams
        if (callingPet && this.hasSilly(callingPet)) {
            let randomPetResp = this.getRandomLivingPet();
            return { pet: randomPetResp.pet, random: randomPetResp.random };
        }
        
        // Normal behavior - return the calling pet
        return { pet: callingPet, random: false };
    }
    getSpecificPet(callingPet: Pet, target: Pet): {pet: Pet, random: boolean} {
        // Check for Silly ailment - return random living pet from both teams
        if (callingPet && this.hasSilly(callingPet)) {
            let randomPetResp = this.getRandomLivingPet();
            return { pet: randomPetResp.pet, random: randomPetResp.random };
        }
        
        // Normal behavior - return the calling pet
        return { pet: target, random: false };
    }
    /**
     * Returns pets ahead of the calling pet, starting from the position right ahead of it
     * @param amt Number of pets to return
     * @param callingPet Pet calling this method (for Silly ailment detection)
     * @param excludeEquipment Optional equipment name to exclude pets that already have it
     * @param includeOpponent Whether to include opponent pets in targeting (default: false)
     * @returns Array of pets ahead of the calling pet
     */
    nearestPetsAhead(amt: number, callingPet: Pet, excludeEquipment?: string, includeOpponent?: boolean): {pets: Pet[], random: boolean} {
        // Check for Silly ailment - return random living pets from both teams
        if (callingPet && this.hasSilly(callingPet)) {
            let petsResp = this.getRandomLivingPets(amt);
            return { pets: petsResp.pets, random: petsResp.random };
        }

        // Use the existing getPetsAhead method on the calling pet
        let pets = callingPet.getPetsAhead(amt, includeOpponent || false, excludeEquipment);
        return { pets: pets, random: false };
    }

    breakToy(respawn=false) {
        if (this.toy == null) {
            return;
        }
        this.brokenToy = this.toy;
        this.logService.createLog({
            message: `${this.toy.name} broke!`,
            type: 'ability',
            player: this,
            randomEvent: false
        })
        if (this.toy.onBreak != null) {       
            let events: AbilityEvent[] = [{
                callback: this.toy.onBreak.bind(this.toy),
                priority: 99
            }];
            let toyLevel = this.toy.level;
            for (let pet of this.petArray) {
                if (pet instanceof Puma) {
                    let callback = () => {
                        this.toy.level = pet.level;
                        this.toy.onBreak(this.gameService.gameApi, true);
                        this.toy.level = toyLevel;
                    }
                    events.push({
                        callback: callback,
                        priority: pet.attack,
                    });
                }
            }
            events.sort((a, b) => {
                return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0;
            });
            for (let event of events) {
                event.callback(this.gameService.gameApi);
            }
        }
        this.toy = null;
        if (respawn) {
            this.setToy(this.brokenToy);
        }
    }

    setToy(toy: Toy) {
        this.toy = toy;
        // do on toy abilities
    }

    getStrongestPet(callingPet?: Pet): {pet: Pet, random: boolean} {
        // Check for Silly ailment - return random living pet
        if (callingPet && this.hasSilly(callingPet)) {
            let randomPetResp = this.getRandomLivingPet();
            return { pet: randomPetResp.pet, random: randomPetResp.random };
        }
        
        let strongestPets: Pet[] = [];
        let maxStrength = -1;
        let pets = shuffle(this.petArray.filter(p => p.alive));
        
        for (let pet of pets) {
            let strength = pet.attack + pet.health;
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
        
        let selectedPet = strongestPets[getRandomInt(0, strongestPets.length - 1)];
        return { 
            pet: selectedPet, 
            random: strongestPets.length > 1 
        };
    }

    pushPetToFront(pet: Pet, jump = false) {
        this.pushPet(pet, 4);

        if (jump) {
            this.abilityService.triggerFriendJumpedEvents(this, pet);
            this.abilityService.triggerFriendJumpedToyEvents(this, pet);
            this.abilityService.triggerEnemyJumpedEvents(this, pet);
        }
    }

    pushPetToBack(pet: Pet) {
        this.pushPet(pet, -4);
    }

    pushPet(pet: Pet, spaces = 1) {
        let player = pet.parent;
        let position = pet.position;
        player[`pet${position}`] = null;
        let destination;
        if (spaces > 0) {
            destination = Math.max(position - spaces, 0);
            if (this.getPet(destination) != null) {
                this.pushForwardFromSlot(destination);
            }          
            this.setPet(destination, pet);
            
        }
        if (spaces < 0) {
            destination = Math.min(position - spaces, 4);
            if (this.getPet(destination) != null) {
                this.pushBackwardFromSlot(destination);
            }          
            this.setPet(destination, pet);
        }

        let opponent = getOpponent(this.gameService.gameApi, player);
        this.abilityService.triggerEnemyPushedEvents(opponent, pet);
        
    }

    get opponent() {
        return getOpponent(this.gameService.gameApi, this);

    }

    gainTrumpets(amt: number, pet: Pet | Equipment, pteranodon?: boolean, pantherMultiplier?: number, cherry?: boolean) {
        this.trumpets = Math.min(50, this.trumpets += amt);
        let message = `${pet.name} gained ${amt} trumpets. (${this.trumpets})`;
        if (cherry) {
            message += ` (Cherry)`;
        }
        this.logService.createLog({
            message: message,
            type: 'trumpets',
            player: this,
            pteranodon: pteranodon,
            pantherMultiplier: pantherMultiplier
        })
    }

    spendTrumpets(amt: number, pet: Pet, pteranodon?: boolean) {
        this.trumpets = Math.max(0, this.trumpets -= amt);
        this.logService.createLog({
            message: `${pet.name} spent ${amt} trumpets. (${this.trumpets})`,
            type: 'trumpets',
            player: this,
            pteranodon: pteranodon
        })
    }

    checkGoldenSpawn() {
        if (this.spawnedGoldenRetiever) {
            return;
        }
        if (this.petArray.length > 1 || this.trumpets == 0) {
            return;
        }
        let goldenRetriever = new GoldenRetriever(this.logService, this.abilityService, this, this.trumpets, this.trumpets);

        let name = this == this.gameService.gameApi.player ? 'Player' : 'Opponent';

        this.logService.createLog(
            {
                message: `${name} spawned Golden Retriever (${goldenRetriever.attack}/${goldenRetriever.health})`,
                type: "ability",
                player: this
            }
        )

        if (this.summonPet(goldenRetriever, 0)) {
            this.abilityService.triggerFriendSummonedEvents(goldenRetriever);
        }
        this.trumpets = 0;
        this.spawnedGoldenRetiever = true;
    }

    getManticoreMult(): number[] {
        let mult = [];
        for (let pet of this.petArray) {
            if (pet.name == 'Manticore') {
                // let petBehind = pet.petBehind();
                // if (petBehind == null) {
                //     mult.push(pet.level + 1);
                // }
                // if (petBehind != null && petBehind.name == 'Tiger') {
                //     mult.push(petBehind.level + 1);
                // }
                mult.push(pet.level);
            }
        }

        return mult;
    }

    summonPetInFront(summoner: Pet, summonedPet: Pet): {success: boolean, randomEvent: boolean} {
        if (this.petArray.length == 5) {
            this.logService.createLog({
                message: `No room to spawn ${summonedPet.name}!`,
                type: 'ability',
                player: this
            })
            return {success: false, randomEvent: false};
        }

        // Check if ANY space exists in front (positions 0 to summoner.position-1)
        let hasSpaceInFront = false;
        for (let pos = 0; pos < summoner.position; pos++) {
            if (this.getPet(pos) == null) {
                hasSpaceInFront = true;
                break;
            }
        }
        
        if (hasSpaceInFront) {
            // Let makeRoomForSlot handle the positioning
            return this.summonPet(summonedPet, summoner.position - 1, false, summoner);
        } else {
            // No space in front, move summoner backward and summon in old spot
            let oldPosition = summoner.position;
            this.pushPet(summoner, -1);
            return this.summonPet(summonedPet, oldPosition, false, summoner);
        }
    }

    summonPetBehind(summoner: Pet, summonedPet: Pet): {success: boolean, randomEvent: boolean} {
        if (this.petArray.length == 5) {
            this.logService.createLog({
                message: `No room to spawn ${summonedPet.name}!`,
                type: 'ability',
                player: this
            })
            return {success: false, randomEvent: false};
        }

        // Normal behavior - try to summon behind
        // Check if ANY space exists in front (positions 0 to summoner.position-1)
        let hasSpaceInFront = false;
        for (let pos = 0; pos < summoner.position; pos++) {
            if (this.getPet(pos) == null) {
                hasSpaceInFront = true;
                break;
            }
        }
        
        if (hasSpaceInFront) {
            // Move summoner forward and summon behind
            this.pushPet(summoner, 1);
            return this.summonPet(summonedPet, summoner.position + 1, false, summoner);
        } else {
            // No space in front, summon directly behind (let makeRoomForSlot handle it)
            return this.summonPet(summonedPet, summoner.position + 1, false, summoner);
        }
    }

    /**
     * Get all pets within X spaces from the calling pet's position
     * Similar to Bear and Visitor targeting logic
     * @param callingPet Pet calling this method (for position and Silly ailment detection)
     * @param range Number of spaces to search within
     * @returns Object with pets array and random boolean (for Silly compatibility)
     */
    getPetsWithinXSpaces(callingPet: Pet, range: number): {pets: Pet[], random: boolean} {
        // Check for Silly ailment - return random living pets from both teams
        if (callingPet && this.hasSilly(callingPet)) {
            let petsResp = this.getRandomLivingPets(range * 2); // Rough estimate of expected targets
            return { pets: petsResp.pets, random: petsResp.random };
        }

        const callingPosition = callingPet.savedPosition;
        const targets: Pet[] = [];

        for (const pet of this.petArray) {
            if (pet.alive && pet !== callingPet) {
                const distance = Math.abs(pet.position - callingPosition);
                if (distance > 0 && distance <= range) {
                    targets.push(pet);
                }
            }
        }

        // Check opponent pets (enemy team)
        for (const pet of this.opponent.petArray) {
            if (pet.alive) {
                const distance = callingPosition + pet.position + 1;
                if (distance <= range) {
                    targets.push(pet);
                }
            }
        }
        

        return { pets: targets, random: false };
    }

    /**
     * Get enemy pet at calling pet's position with nearby search and Silly support
     * @param callingPet Pet making the call (for position and Silly detection)
     * @returns Object with pet and random boolean (for Silly compatibility)
     */
    getOppositeEnemyPet(callingPet: Pet): {pet: Pet, random: boolean} {
        // Check for Silly ailment - return random living pet from both teams
        if (callingPet && this.hasSilly(callingPet)) {
            let randomPetResp = this.getRandomLivingPet();
            return { pet: randomPetResp.pet, random: randomPetResp.random };
        }
        
        let position = callingPet.position;
        
        // Try exact position first
        let target = this.opponent.getPetAtPosition(position);
        if (target && target.alive) {
            return { pet: target, random: false };
        }
        
        // Search nearby positions up to distance 4
        for (let distance = 1; distance <= 4; distance++) {
            // Try position + distance
            target = this.opponent.getPetAtPosition(position + distance);
            if (target && target.alive) {
                return { pet: target, random: false };
            }
            
            // Try position - distance  
            target = this.opponent.getPetAtPosition(position - distance);
            if (target && target.alive) {
                return { pet: target, random: false };
            }
        }
        
        return { pet: null, random: false };
    }

    private hasSilly(pet: Pet): boolean {
        return pet.equipment?.name === 'Silly';
    }

    getRandomLivingPet(excludePets?: Pet[]): {pet: Pet, random: boolean} {
        // Always get pets from both teams (no Silly check, always include opponent)
        let pets = [...this.petArray, ...this.opponent.petArray];
        
        // Handle donut/blueberry prioritization like getRandomPet
        let donutPets = this.getPetsWithEquipment('Donut').filter((pet) => !excludePets?.includes(pet));
        let blueberryPets = this.getPetsWithEquipment('Blueberry').filter((pet) => !excludePets?.includes(pet));
        let opponentDonutPets = this.opponent.getPetsWithEquipment('Donut').filter((pet) => !excludePets?.includes(pet));
        let opponentBlueberryPets = this.opponent.getPetsWithEquipment('Blueberry').filter((pet) => !excludePets?.includes(pet));
        
        if (donutPets.length > 0 || blueberryPets.length > 0 || opponentDonutPets.length > 0 || opponentBlueberryPets.length > 0) {
            pets = [
                ...donutPets,
                ...blueberryPets,
                ...opponentDonutPets,
                ...opponentBlueberryPets
            ];
        }
        
        // Filter to living pets and exclude specified pets (same as getRandomPet)
        pets = pets.filter((pet) => {
            let keep = true;
            if (excludePets)
                keep = !excludePets.includes(pet);
            return keep && pet.health > 0;
        });
        
        if (pets.length == 0) {
            return { pet: null, random: false };
        }
        let index = getRandomInt(0, pets.length - 1);
        return { pet: pets[index], random: pets.length > 1 };
    }

}
