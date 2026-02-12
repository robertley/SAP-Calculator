import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

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

  setStorage(value: unknown) {
    if (typeof value === 'object' && value !== null) {
      const cache = new Set<unknown>();
      const replacer = (key: string, replacerValue: unknown): unknown => {
        if (
          key === 'equipment' &&
          typeof replacerValue === 'object' &&
          replacerValue !== null &&
          'name' in replacerValue
        ) {
          const equipmentName =
            typeof replacerValue.name === 'string' ? replacerValue.name : null;
          return equipmentName ? { name: equipmentName } : null;
        }

        // Prune service references that might be causing circular dependencies.
        if (['parent', 'logService', 'abilityService', 'gameService', 'petService'].includes(key)) {
          return undefined;
        }

        if (typeof replacerValue === 'object' && replacerValue !== null) {
          if (cache.has(replacerValue)) {
            // Circular reference found, discard.
            return undefined;
          }
          cache.add(replacerValue);
        }
        return replacerValue;
      };

      try {
        const jsonString = JSON.stringify(value, replacer);
        window.localStorage.setItem(this.key, jsonString);
      } catch (e) {
        console.error('Could not stringify value for local storage', e);
      }
    } else if (typeof value === 'string') {
      window.localStorage.setItem(this.key, value);
    }
  }

  clearStorage() {
    window.localStorage.removeItem(this.key);
  }
}
