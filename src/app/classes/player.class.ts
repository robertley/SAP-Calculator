import { clone, cloneDeep, shuffle, sum } from "lodash";
import { Pet } from "./pet.class";
import { LogService } from "../services/log.servicee";
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

    pack: 'Turtle' | 'Puppy' | 'Star' | 'Golden' | 'Custom' | 'Unicorn' = 'Turtle';

    toy: Toy;
    originalToy: Toy;

    trumpets: number = 0;
    spawnedGoldenRetiever: boolean = false;

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

        this.originalToy = this.toy;

        this.toy = this.originalToy;
        if (this.toy) {
            this.toy.used = false;
            this.toy.triggers = 0;
        }
        this.trumpets = 0;
        this.spawnedGoldenRetiever = false;
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
        this.onionCheck();
        
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
    summonPet(spawnPet: Pet, position: number, fly=false): boolean {
        if (this.petArray.length == 5) {
            if (!fly) {
                this.logService.createLog({
                    message: `No room to spawn ${spawnPet.name}!`,
                    type: 'ability',
                    player: this
                })
            }
            return false;
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

        if (spawnPet.summoned) {
            spawnPet.summoned(null);
        }

        let opponent = getOpponent(this.gameService.gameApi, this);

        this.abilityService.triggerEnemySummonedEvents(opponent, spawnPet);

        return true;
    }

    // TODO - Revise Logic -- might not be consistent with game
    makeRoomForSlot(slot: number) {
        if (this.petArray.length == 5) {
            console.warn("No room to Make Room") // should never happen
            return;
        }

        let isSpaceBehind = false;
        let slotWithSpace = null;
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
        if (pet.petBehind(true)?.friendAheadFaints != null) {
            this.abilityService.setFriendAheadFaintsEvent({
                    callback: pet.petBehind().friendAheadFaints.bind(pet.petBehind()),
                    priority: pet.petBehind().attack,
                    player: this,
                    callbackPet: pet
                })
        }
        this.abilityService.triggerFriendFaintsEvents(pet);
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

    removeDeadPets() {
        let petRemoved = false;
        if (!this.pet0?.alive && this.pet0 !== undefined) {
            this.pet0 = null;
            petRemoved = true;
        }
        if (!this.pet1?.alive) {
            this.pet1 = null;
            petRemoved = true;
        }
        if (!this.pet2?.alive) {
            this.pet2 = null;
            petRemoved = true;
        }
        if (!this.pet3?.alive) {
            this.pet3 = null;
            petRemoved = true;
        }
        if (!this.pet4?.alive) {
            this.pet4 = null;
            petRemoved = true;
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
    getRandomPet(excludePets?: Pet[], donut?: boolean, blueberry?: Boolean, notFiftyFifty?: boolean) {
        let pets = this.petArray;
        if (donut) {
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
        if (blueberry) {
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
            return null;
        }
        let index = getRandomInt(0, pets.length - 1);
        return pets[index];
    }

    /**
     * Will prioritize donut or blueberry pets. does not expect both arguments to be true.
     * @param amt amount of pets to return
     * @param excludePets pets to exclude from the random selection
     * @param donut find donut pets first
     * @param blueberry fine blueberry pets first
     * @returns pet array
     */
    getRandomPets(amt: number, excludePets?: Pet[], donut?: boolean, blueberry?: Boolean): Pet[] {
        let pets = [];
        excludePets = excludePets ?? [];
        for (let i = 0; i < amt; i++) {
            let pet = this.getRandomPet(excludePets, donut, blueberry);
            if (pet == null) {
                break;
            }
            excludePets.push(pet);
            pets.push(pet);
        }
        // if we didn't get enough pets, try again without donut/blueberry
        if (pets.length < amt) {
            for (let i = pets.length; i < amt; i++) {
                let pet = this.getRandomPet(excludePets);
                if (pet == null) {
                    break;
                }
                excludePets.push(pet);
                pets.push(pet);
            }
        }
        return pets;
    }

    getPetsWithEquipment(equipmentName: string) {
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

    getPetAtPosition(position: number) {
        for (let pet of this.petArray) {
            if (pet.position == position) {
                return pet;
            }
        }
        return null;
    }

    getLastPet() {
        for (let pet of this.petArray.reverse()) {
            if (pet.alive) {
                return pet;
            }
        }
    }

    /**
     * Returns highest health pet. Returns a random pet of highest health if there are multiple.
     * @param excludePet
     * @returns 
     */
    getHighestHealthPet(excludePet?: Pet): {
        pet: Pet,
        random: boolean
    } {
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
     * Returns lowest health pet. Returns a random pet of lowest health if there are multiple. Will only return alive pets.
     * @param excludePet
     * @returns 
     */
    getLowestHealthPet(excludePet?: Pet): {pet: Pet, random: boolean} {
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

    get furthestUpPet() {
        for (let pet of this.petArray) {
            if (pet.alive) {
                return pet;
            }
        }
        return null;
    }

    breakToy(respawn=false) {
        if (this.toy == null) {
            return;
        }
        if (this.toy.onBreak == null) {
            return;
        }
        this.logService.createLog({
            message: `${this.toy.name} broke!`,
            type: 'ability',
            player: this,
            randomEvent: false
        })

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

        let toyCopy = cloneDeep(this.toy);
        this.toy = null;
        if (respawn) {
            this.setToy(toyCopy);
        }
    }

    setToy(toy: Toy) {
        this.toy = toy;
        // do on toy abilities
    }

    getStrongestPet() {
        let strongestPet: Pet;
        let pets = shuffle(this.petArray);
        for (let pet of pets) {
            if (strongestPet == null) {
                strongestPet = pet;
                continue;
            }
            if (pet.attack + pet.health > strongestPet.attack + strongestPet.health) {
                strongestPet = pet;
            }
        }
        return strongestPet;
    }

    pushPetToFront(pet: Pet, jump = false) {
        this.pushPet(pet, 4);

        if (jump) {
            this.abilityService.triggerFriendJumpedEvents(this, pet);
            this.abilityService.triggerFriendJumpedToyEvents(this, pet);
            this.abilityService.executeFriendJumpedEvents();
            this.abilityService.executeFriendJumpedToyEvents();
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
        }
        if (spaces < 0) {
            destination = Math.max(position - spaces, 4);
        }
        player.summonPet(pet, destination);
        this.onionCheck();
    }

    getRandomStrawberryPet(excludePet?: Pet): Pet {
        let pets = this.getPetsWithEquipment('Strawberry');
        let filterPets = pets.filter((pet) => {
            return pet != excludePet;
        });
        if (filterPets.length == 0) {
            return null;
        }
        return pets[getRandomInt(0, filterPets.length - 1)];
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
            this.abilityService.triggerSummonedEvents(goldenRetriever);
        }
        this.trumpets = 0;
        this.spawnedGoldenRetiever = true;
    }

    getManticoreMult(): number[] {
        let mult = [];
        console.log(cloneDeep(this.petArray))
        for (let pet of this.petArray) {
            if (pet.name == 'Manticore') {
                // let petBehind = pet.petBehind();
                // if (petBehind == null) {
                //     mult.push(pet.level + 1);
                // }
                // if (petBehind != null && petBehind.name == 'Tiger') {
                //     mult.push(petBehind.level + 1);
                // }
                mult.push(pet.level + 1);
            }
        }

        return mult;
    }
}