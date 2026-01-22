import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { LocalStorageService } from '../../services/local-storage.service';
import { cloneDeep } from 'lodash-es';

@Component({
  selector: 'app-export-calculator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './export-calculator.component.html',
  styleUrls: ['./export-calculator.component.scss'],
})
export class ExportCalculatorComponent implements OnInit {
  @Input()
  formGroup: FormGroup;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {}

  formGroupValueString() {
    if (!this.formGroup) {
      return '';
    }
    try {
      const rawValue = this.formGroup.value;
      const cleanValue = cloneDeep(rawValue);

      const petsToClean = [
        ...(cleanValue.playerPets || []),
        ...(cleanValue.opponentPets || []),
      ];

      for (const pet of petsToClean) {
        if (pet) {
          // Remove properties that are class instances or cause cycles
          delete pet.parent;
          delete pet.logService;
          delete pet.abilityService;
          delete pet.gameService;
          delete pet.petService; // If it exists on the pet

          if (pet.equipment) {
            pet.equipment = { name: pet.equipment.name };
          }
        }
      }

      return JSON.stringify(cleanValue, null, 2);
    } catch (e) {
      console.error('Error creating export string:', e);
      return 'Error: Could not generate the export data.';
    }
  }

  copyToClipboard() {
    this.localStorageService.setFormStorage(this.formGroup);

    // Use the cleaned data instead of raw form value to avoid circular references
    const calc = this.formGroupValueString();

    // Check if the data generation failed
    if (calc.startsWith('Error:')) {
      alert('Failed to export');
      return;
    }

    // copy to clipboard
    navigator.clipboard
      .writeText(calc)
      .then(() => {
        alert('Copied to clipboard');
      })
      .catch((error) => {
        console.error('Clipboard error:', error);
        alert('Failed to copy to clipboard.');
      });
  }
}
