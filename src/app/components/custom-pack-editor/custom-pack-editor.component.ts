import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { PetService } from "../../services/pet/pet.service";
import { remove } from "lodash-es";
import { LocalStorageService } from "../../services/local-storage.service";
import * as petJson from "../../files/pets.json";
import { PACK_NAMES } from "../../util/pack-names";
import { ReactiveFormsModule } from "@angular/forms";
import { CustomPackFormComponent } from "./custom-pack-form/custom-pack-form.component";

@Component({
  selector: "app-custom-pack-editor",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomPackFormComponent],
  templateUrl: "./custom-pack-editor.component.html",
  styleUrls: ["./custom-pack-editor.component.scss"],
})
export class CustomPackEditorComponent implements OnInit {
  @Input()
  formGroup: FormGroup;
  customPacks: FormArray;
  // Map<tier, Map<pack, pets>>
  petPackMap: Map<number, Map<string, string[]>>;
  petIdLookup: Map<string, { name: string; tier: number }> = new Map();
  petNameToTier: Map<string, number> = new Map();
  focusedGroup: FormGroup = null;

  importFormGroup = new FormGroup({
    code: new FormControl(null),
  });

  constructor(
    private petService: PetService,
    private localStorageService: LocalStorageService,
  ) {}

  ngOnInit(): void {
    this.customPacks = this.formGroup.get("customPacks") as FormArray;
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

  submitEvent(event) {
    if (this.customPacks.controls.includes(event)) {
      // update
    } else {
      this.customPacks.push(event);
    }
    this.petService.buildCustomPackPets(this.customPacks);
    this.focusedGroup = null;
    this.localStorageService.setStorage(this.formGroup.value);
  }

  cancelEvent(event: FormGroup) {
    this.focusedGroup = null;
  }

  editPack(group: AbstractControl) {
    this.focusedGroup = group as FormGroup;
  }

  deletePack(group: AbstractControl) {
    if (confirm("Are you sure you want to delete this pack?")) {
      let index = this.customPacks.controls.indexOf(group);
      this.customPacks.removeAt(index);
      this.localStorageService.setStorage(this.formGroup.value);
    }
  }

  forbiddenNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let forbiddenNames = ["custom"];
      for (let formGroup of this.customPacks.controls) {
        let con = formGroup.get("name");
        if (control == con) {
          continue;
        }
        forbiddenNames.push(formGroup.get("name").value?.toLowerCase());
      }
      if (forbiddenNames.includes(control.value?.toLowerCase())) {
        return { forbiddenName: true };
      }
      return null;
    };
  }

  importCustomPack() {
    let code = this.importFormGroup.get("code").value;
    try {
      code = JSON.parse(code);
      let parsed = this.parseMinions(code.Minions, code.MinionMap);
      let formValue = {
        name: code.Title,
        tier1Pets: parsed.tierMinions.get(1),
        tier2Pets: parsed.tierMinions.get(2),
        tier3Pets: parsed.tierMinions.get(3),
        tier4Pets: parsed.tierMinions.get(4),
        tier5Pets: parsed.tierMinions.get(5),
        tier6Pets: parsed.tierMinions.get(6),
      };
      this.createNewPack();
      this.focusedGroup.patchValue(formValue);
      if (parsed.missingMinions.length > 0) {
        alert(
          `Some minion IDs were not recognized and were skipped: ${parsed.missingMinions.join(", ")}`,
        );
      }
    } catch (e) {
      alert("Invalid code");
      console.error(e);
    }
  }

  buildPetIdLookup() {
    this.petIdLookup = new Map();
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
      if (typeof minion === "number") {
        idKey = String(minion);
      } else if (typeof minion === "string") {
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
}
