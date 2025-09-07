import { Injectable } from "@angular/core";
import { Log } from "../interfaces/log.interface";
import { FormGroup } from "@angular/forms";
import { cloneDeep } from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    key = 'sapData'
    constructor() {

    }

    getStorage() {
        let storage = window.localStorage.getItem(this.key);

        return window.localStorage.getItem(this.key);
    }

    setFormStorage(formGroup: FormGroup) {
        let value = cloneDeep(formGroup.value);

        const petsToClean = [...(value.playerPets || []), ...(value.opponentPets || [])];

        for (const pet of petsToClean) {
            // This check is important because the array can have null slots
            if (pet) {
                // Remove all complex objects and circular references
                delete pet.parent;
                delete pet.logService;
                delete pet.abilityService;
                delete pet.gameService;
                delete pet.petService;

                // Simplify equipment to just its name
                if (pet.equipment != null) {
                    pet.equipment = {
                        name: pet.equipment.name
                    };
                }
            }
        }
        this.setStorage(value);
    }

    setStorage(value: any) {
        if (typeof value == 'object') {
            value = JSON.stringify(value);
        }
        window.localStorage.setItem(this.key, value);
    }

    clearStorage() {
        window.localStorage.removeItem(this.key);
    }
}