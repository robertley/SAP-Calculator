import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { PetService } from 'app/integrations/pet/pet.service';
import { LocalStorageService } from 'app/runtime/state/local-storage.service';
import * as petJson from 'assets/data/pets.json';
import { PACK_NAMES } from 'app/runtime/pack-names';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomPackFormComponent } from './custom-pack-form/custom-pack-form.component';

@Component({
  selector: 'app-custom-pack-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomPackFormComponent],
  templateUrl: './custom-pack-editor.component.html',
  styleUrls: ['./custom-pack-editor.component.scss'],
})
export class CustomPackEditorComponent implements OnInit {
  @Input()
  formGroup: FormGroup;
  customPacks: FormArray;
  // Map<tier, Map<pack, pets>>
  petPackMap: Map<number, Map<string, string[]>>;
  petIdLookup: Map<string, { name: string; tier: number }> = new Map();
  petNameToId: Map<string, string> = new Map();
  petNameToTier: Map<string, number> = new Map();
  focusedGroup: FormGroup = null;

  importFormGroup = new FormGroup({
    code: new FormControl(null),
  });

  statusMessage = '';
  statusTone: 'success' | 'error' = 'success';
  private statusTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private petService: PetService,
    private localStorageService: LocalStorageService,
  ) {}

  ngOnInit(): void {
    this.customPacks = this.formGroup.get('customPacks') as FormArray;
    this.buildPetPackMap();
    this.buildPetNameToTierMap();
    this.buildPetIdLookup();
  }

  buildPetPackMap() {
    this.petPackMap = new Map<number, Map<string, string[]>>();
    for (let i = 1; i <= 6; i++) {
      let packMap = new Map<string, string[]>();
      for (const packName of PACK_NAMES) {
        packMap.set(packName, []);
      }
      this.petPackMap.set(i, packMap);
    }
    for (const packName of PACK_NAMES) {
      const packPets = this.petService.basePackPetsByName[packName];
      for (let [tier, pets] of packPets) {
        this.petPackMap
          .get(tier)
          .get(packName)
          .push(...pets);
      }
    }
  }

  createNewPack() {
    let group = this.createPack();
    this.focusedGroup = group;
  }

  createPack() {
    let formGroup = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        this.forbiddenNameValidator(),
      ]),
      tier1Pets: new FormControl([], this.controlArrayLengthOf10()),
      // tier1Food: new FormControl([]),
      tier2Pets: new FormControl([], this.controlArrayLengthOf10()),
      // tier2Food: new FormControl([]),
      tier3Pets: new FormControl([], this.controlArrayLengthOf10()),
      // tier3Food: new FormControl([]),
      tier4Pets: new FormControl([], this.controlArrayLengthOf10()),
      // tier4Food: new FormControl([]),
      tier5Pets: new FormControl([], this.controlArrayLengthOf10()),
      // tier5Food: new FormControl([]),
      tier6Pets: new FormControl([], this.controlArrayLengthOf10()),
      // tier6Food: new FormControl([]),
      spells: new FormControl([]),
    });

    return formGroup;
  }

  makeFormGroup(control: AbstractControl) {
    return control as FormGroup;
  }

  // custom angular validator
  controlArrayLengthOf10(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value.length !== 10) {
        return { length: true };
      }
      return null;
    };
  }

  submitEvent(event: FormGroup) {
    if (this.customPacks.controls.includes(event)) {
      // update
    } else {
      this.customPacks.push(event);
    }
    this.petService.buildCustomPackPets(this.customPacks);
    this.focusedGroup = null;
    this.localStorageService.setFormStorage(this.formGroup);
  }

  cancelEvent(event: FormGroup) {
    this.focusedGroup = null;
  }

  editPack(group: AbstractControl) {
    this.focusedGroup = group as FormGroup;
  }

  deletePack(group: AbstractControl) {
    if (confirm('Are you sure you want to delete this pack?')) {
      let index = this.customPacks.controls.indexOf(group);
      this.customPacks.removeAt(index);
      this.focusedGroup = null;
      this.localStorageService.setFormStorage(this.formGroup);
    }
  }

  trackByPackName(index: number, pack: AbstractControl): string {
    return pack?.get('name')?.value ?? String(index);
  }

  forbiddenNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let forbiddenNames = ['custom'];
      for (let formGroup of this.customPacks.controls) {
        let con = formGroup.get('name');
        if (control == con) {
          continue;
        }
        forbiddenNames.push(formGroup.get('name').value?.toLowerCase());
      }
      if (forbiddenNames.includes(control.value?.toLowerCase())) {
        return { forbiddenName: true };
      }
      return null;
    };
  }

  importCustomPack() {
    let code = this.importFormGroup.get('code').value;
    this.clearStatus();
    try {
      let jsonString = code;
      const firstBracket = code.indexOf('{');
      const lastBracket = code.lastIndexOf('}');
      if (firstBracket !== -1 && lastBracket > firstBracket) {
        jsonString = code.substring(firstBracket, lastBracket + 1);
      }
      const parsedCode = JSON.parse(jsonString);
      let parsed = this.parseMinions(parsedCode.Minions, parsedCode.MinionMap);
      const parsedSpells = Array.isArray(parsedCode.Spells) ? parsedCode.Spells : [];
      let formValue = {
        name: parsedCode.Title,
        tier1Pets: parsed.tierMinions.get(1),
        tier2Pets: parsed.tierMinions.get(2),
        tier3Pets: parsed.tierMinions.get(3),
        tier4Pets: parsed.tierMinions.get(4),
        tier5Pets: parsed.tierMinions.get(5),
        tier6Pets: parsed.tierMinions.get(6),
        spells: parsedSpells,
      };
      this.createNewPack();
      this.focusedGroup.patchValue(formValue);
      if (parsed.missingMinions.length > 0) {
        this.setStatus(
          `Some minion IDs were not recognized and were skipped: ${parsed.missingMinions.join(
            ', ',
          )}`,
          'error',
        );
      } else {
        this.setStatus('Custom pack imported.', 'success');
      }
    } catch (e) {
      this.setStatus('Invalid code.', 'error');
      console.error(e);
    }
  }

  buildPetIdLookup() {
    this.petIdLookup = new Map();
    this.petNameToId = new Map();
    const petList =
      (
        petJson as unknown as {
          default?: Array<{ Id: string; Name: string; Tier: string | number }>;
        }
      ).default ??
      (petJson as unknown as Array<{
        Id: string;
        Name: string;
        Tier: string | number;
      }>);
    for (let pet of petList) {
      let tier = Number(pet.Tier);
      let id = String(pet.Id);
      if (!this.petIdLookup.has(id)) {
        this.petIdLookup.set(id, { name: pet.Name, tier: tier });
      }
      if (!this.petNameToId.has(pet.Name)) {
        this.petNameToId.set(pet.Name, id);
      }
    }
  }

  exportCustomPack(pack: AbstractControl) {
    const payload = this.buildExportPayload(pack);
    const json = JSON.stringify(payload);
    this.importFormGroup.get('code')?.setValue(json);
    this.copyToClipboard(json);
  }

  private buildExportPayload(pack: AbstractControl) {
    const getPetsForTier = (tier: number): string[] => {
      const control = pack.get(`tier${tier}Pets`);
      const pets = Array.isArray(control?.value) ? control.value : [];
      return pets.filter((pet: string | null) => Boolean(pet));
    };

    const minions: Array<string | number> = [];
    for (let tier = 1; tier <= 6; tier++) {
      const pets = getPetsForTier(tier);
      for (const petName of pets) {
        const id = this.petNameToId.get(petName);
        minions.push(id ?? petName);
      }
    }

    const spellsControl = pack.get('spells');
    const rawSpells = Array.isArray(spellsControl?.value)
      ? spellsControl.value
      : Array.isArray((pack as FormGroup)?.value?.spells)
        ? (pack as FormGroup).value.spells
        : [];
    const spells = rawSpells.filter((spell: string | number | null) =>
      Boolean(spell),
    );

    return {
      Title: pack.get('name')?.value || 'Custom Pack',
      Minions: minions,
      ...(spells.length ? { Spells: spells } : {}),
    };
  }

  private copyToClipboard(text: string) {
    this.clearStatus();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          this.setStatus('Custom pack copied to clipboard.', 'success');
        })
        .catch(() => {
          this.setStatus('Failed to copy custom pack.', 'error');
        });
    } else {
      this.setStatus('Clipboard not available.', 'error');
    }
  }

  buildPetNameToTierMap() {
    this.petNameToTier = new Map();
    for (let [tier, packMap] of this.petPackMap) {
      for (let pets of packMap.values()) {
        for (let pet of pets) {
          if (!this.petNameToTier.has(pet)) {
            this.petNameToTier.set(pet, tier);
          }
        }
      }
    }
  }

  parseMinions(
    minions: Array<number | string>,
    minionMap: { [id: string]: string } = {},
  ) {
    let tierMinions = new Map<number, string[]>();
    for (let i = 1; i <= 6; i++) {
      tierMinions.set(i, []);
    }
    let missingMinions: (number | string)[] = [];
    if (!Array.isArray(minions)) {
      return { tierMinions, missingMinions };
    }

    for (let minion of minions) {
      let name: string | null = null;
      let idKey: string | null = null;
      if (typeof minion === 'number') {
        idKey = String(minion);
      } else if (typeof minion === 'string') {
        let trimmed = minion.trim();
        if (trimmed && trimmed.match(/^\d+$/)) {
          idKey = trimmed;
        } else {
          name = minion;
        }
      }

      if (idKey) {
        let pet = this.petIdLookup.get(idKey);
        if (pet) {
          name = pet.name;
        } else if (minionMap && minionMap[idKey]) {
          name = minionMap[idKey];
        }
      }

      if (!name) {
        missingMinions.push(minion);
        continue;
      }

      let tier = this.petNameToTier.get(name);
      if (!tier) {
        missingMinions.push(minion);
        continue;
      }
      tierMinions.get(tier).push(name);
    }

    return { tierMinions, missingMinions };
  }

  private clearStatus() {
    if (this.statusTimer) {
      clearTimeout(this.statusTimer);
      this.statusTimer = null;
    }
    this.statusMessage = '';
  }

  private setStatus(message: string, tone: 'success' | 'error') {
    this.statusMessage = message;
    this.statusTone = tone;
    if (this.statusTimer) {
      clearTimeout(this.statusTimer);
    }
    this.statusTimer = setTimeout(() => {
      this.statusMessage = '';
      this.statusTimer = null;
    }, 4000);
  }
}




