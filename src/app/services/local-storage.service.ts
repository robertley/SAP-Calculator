import { Injectable } from '@angular/core';
import { Log } from '../interfaces/log.interface';
import { FormGroup } from '@angular/forms';
import { cloneDeep } from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  key = 'sapData';
  constructor() {}

  getStorage() {
    let storage = window.localStorage.getItem(this.key);

    return window.localStorage.getItem(this.key);
  }

  setFormStorage(formGroup: FormGroup) {
    this.setStorage(formGroup.value);
  }

  setStorage(value: any) {
    if (typeof value === 'object' && value !== null) {
      const cache = new Set();
      const replacer = (key: string, value: any) => {
        if (key === 'equipment' && value && typeof value === 'object' && value.name) {
          return { name: value.name };
        }

        // Prune service references that might be causing circular dependencies.
        if (['parent', 'logService', 'abilityService', 'gameService', 'petService'].includes(key)) {
            return undefined;
        }

        if (typeof value === 'object' && value !== null) {
            if (cache.has(value)) {
                // Circular reference found, discard.
                return undefined;
            }
            cache.add(value);
        }
        return value;
      };

      try {
          const jsonString = JSON.stringify(value, replacer);
          window.localStorage.setItem(this.key, jsonString);
      } catch (e) {
          console.error("Could not stringify value for local storage", e);
      }
    } else if (typeof value == 'string') {
      window.localStorage.setItem(this.key, value);
    }
  }

  clearStorage() {
    window.localStorage.removeItem(this.key);
  }
}
