import { Injectable } from "@angular/core";
import { Log } from "../interfaces/log.interface";
import { FormGroup } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    key = 'sapData'
    constructor() {

    }

    getStorage() {
        return window.localStorage.getItem(this.key);
    }

    setFormStorage(formGroup: FormGroup) {
        let value = formGroup.value;
        // remove all fields from equipment except for the name
        for (let pet of value.playerPets) {
            if (pet.equipment != null) {
                pet.equipment = {
                    name: pet.equipment.name
                }
            } 
        }
        for (let pet of value.opponentPets) {
            if (pet.equipment != null) {
                pet.equipment = {
                    name: pet.equipment.name
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