import { clone, cloneDeep } from "lodash";
import { Pet } from "./pet.class";
import { LogService } from "../services/log.servicee";
import { getRandomInt } from "../util/helper-functions";

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

    constructor(private logService: LogService) {
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
    }

    setPet(index: number, pet: Pet, init=false) {
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

    // TODO - no room logic
    spawnPet(spawnPet: Pet, sourcePet: Pet) {
        if (sourcePet.savedPosition == 0) {
            sourcePet.parent.pet0 = spawnPet;
        }
        if (sourcePet.savedPosition == 1) {
            sourcePet.parent.pet1 = spawnPet;
        }
        if (sourcePet.savedPosition == 2) {
            sourcePet.parent.pet2 = spawnPet;
        }
        if (sourcePet.savedPosition == 3) {
            sourcePet.parent.pet3 = spawnPet;
        }
        if (sourcePet.savedPosition == 4) {
            sourcePet.parent.pet4 = spawnPet;
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

    checkPetsAlive() {
        if (this.pet0 && !this.pet0.alive()) {
            this.createDeathLog(this.pet0);
            this.pet0 = null;
        }
        if (this.pet1 && !this.pet1.alive()) {
            this.createDeathLog(this.pet1);
            this.pet1 = null;
        }
        if (this.pet2 && !this.pet2.alive()) {
            this.createDeathLog(this.pet2);
            this.pet2 = null;
        }
        if (this.pet3 && !this.pet3.alive()) {
            this.createDeathLog(this.pet3);
            this.pet3 = null;
        }
        if (this.pet4 && !this.pet4.alive()) {
            this.createDeathLog(this.pet4);
            this.pet4 = null;
        }
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
    getRandomPet(excludePet?: Pet) {
        let pets = this.petArray;
        pets = pets.filter((pet) => {
            let keep = true;
            if (excludePet)
                keep = pet != excludePet;
            return keep && pet.health > 0;
        });
        if (pets.length == 0) {
            return null;
        }
        let index = getRandomInt(0, pets.length - 1);
        return pets[index];
    }

    getPetAtPosition(position: number) {
        for (let pet of this.petArray) {
            if (pet.position == position) {
                return pet;
            }
        }
        return null;
    }
}