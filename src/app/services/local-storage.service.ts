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