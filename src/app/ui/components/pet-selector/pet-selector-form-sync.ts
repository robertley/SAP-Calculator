import {
  Directive,
  OnDestroy,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { Equipment } from 'app/domain/entities/equipment.class';
import {
  AILMENT_CATEGORIES,
  EQUIPMENT_CATEGORIES,
} from 'app/integrations/equipment/equipment-categories';
import { PACK_NAMES } from 'app/runtime/pack-names';
import {
  getEquipmentIconPath,
  getPetIconFileName,
  getPetIconPath,
} from 'app/runtime/asset-catalog';
import {
  PARROT_COPY_TARGETS,
  SwallowedPetTarget,
} from './pet-selector.constants';
import { resolveSwallowedPetControlPath } from './pet-selector-control-paths';
import { PetSelectorFormSubscriptions } from './pet-selector-form-subscriptions';

@Directive()
export class PetSelectorFormSync
  extends PetSelectorFormSubscriptions
  implements OnInit, OnDestroy, OnChanges
{
  trackByIndex(index: number): number {
    return index;
  }

  ngOnInit(): void {
    this.initPackSets();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['formGroup'] ||
      changes['pet'] ||
      changes['index'] ||
      changes['player']
    ) {
      this.initSelector();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.customPackSubscription) {
      this.customPackSubscription.unsubscribe();
    }
  }

  initSelector() {
    this.destroy$.next();
    this.initPets();
    this.initEquipment();
    this.initForm();
    this.customPackSubscription?.unsubscribe();
    this.customPackSubscription =
      (this.customPacks as FormArray)?.valueChanges?.subscribe(() => {
        this.invalidatePackCaches();
      }) ?? null;

    this.fixLoadEquipment();
  }

  openSelectionDialog(
    type: 'pet' | 'equipment' | 'swallowed-pet',
    index?: number,
    target: SwallowedPetTarget = 'pet',
    parentIndex?: number,
  ) {
    this.selectionType = type;
    this.swallowedPetIndex = index;
    this.swallowedPetTarget = target;
    this.swallowedPetParentIndex = parentIndex;
    this.forceShowAllPets =
      type === 'swallowed-pet' && this.isParrotCopyTarget(target);
    this.showSelectionDialog = true;
  }

  onItemSelected(item: unknown) {
    if (item instanceof Event) {
      this.closeSelectionDialog();
      return;
    }
    if (this.selectionType === 'pet') {
      this.formGroup.get('name').setValue(item);
    } else if (this.selectionType === 'equipment') {
      const equipmentName =
        typeof item === 'string'
          ? item
          : item &&
              typeof item === 'object' &&
              typeof (item as { name?: unknown }).name === 'string'
            ? (item as { name: string }).name
            : null;
      this.formGroup.get('equipment').setValue(equipmentName);
    } else if (this.selectionType === 'swallowed-pet') {
      const controlPath = resolveSwallowedPetControlPath({
        target: this.swallowedPetTarget,
        swallowedPetIndex: this.swallowedPetIndex,
        swallowedPetParentIndex: this.swallowedPetParentIndex,
        petName: this.pet?.name,
      });
      if (!controlPath) {
        this.closeSelectionDialog();
        return;
      }
      this.formGroup.get(controlPath)?.setValue(item);
    }
    this.closeSelectionDialog();
  }

  closeSelectionDialog() {
    this.showSelectionDialog = false;
    this.forceShowAllPets = false;
  }

  setExp(amt: number) {
    this.formGroup.get('exp').setValue(amt);
  }

  getIsSelected(amt: number) {
    return this.formGroup.get('exp').value >= amt;
  }

  showRemoveExp() {
    return this.formGroup.get('exp').value > 0;
  }

  get petImageSrc(): string | null {
    const name = this.formGroup?.get('name')?.value;
    if (!name) {
      return null;
    }
    const fileName = getPetIconFileName(name);
    if (!fileName) {
      return null;
    }
    return `assets/art/Public/Public/Pets/${fileName}.png`;
  }

  get swallowedPetImageSrc(): string | null {
    const name = this.formGroup?.get('name')?.value;
    if (name === 'Beluga Whale') {
      return this.getPetImagePath(
        this.formGroup.get('belugaSwallowedPet')?.value,
      );
    }
    if (name === 'Sarcastic Fringehead') {
      return this.getPetImagePath(
        this.formGroup.get('sarcasticFringeheadSwallowedPet')?.value,
      );
    }
    if (name === 'Parrot') {
      const belugaSwallowed = this.formGroup.get(
        'parrotCopyPetBelugaSwallowedPet',
      )?.value;
      if (belugaSwallowed) {
        return this.getPetImagePath(belugaSwallowed);
      }
      return this.getPetImagePath(this.formGroup.get('parrotCopyPet')?.value);
    }
    return null;
  }

  get abominationSwallowedPetImages(): string[] {
    const name = this.formGroup?.get('name')?.value;
    if (name !== 'Abomination') {
      return [];
    }
    const values = [
      {
        name: this.formGroup.get('abominationSwallowedPet1')?.value,
        belugaSwallowed: this.formGroup.get(
          'abominationSwallowedPet1BelugaSwallowedPet',
        )?.value,
      },
      {
        name: this.formGroup.get('abominationSwallowedPet2')?.value,
        belugaSwallowed: this.formGroup.get(
          'abominationSwallowedPet2BelugaSwallowedPet',
        )?.value,
      },
      {
        name: this.formGroup.get('abominationSwallowedPet3')?.value,
        belugaSwallowed: this.formGroup.get(
          'abominationSwallowedPet3BelugaSwallowedPet',
        )?.value,
      },
    ];
    const images: string[] = [];
    for (const value of values) {
      if (!value.name) {
        continue;
      }
      const image = this.getPetImagePath(value.name);
      if (image) {
        images.push(image);
      }
      if (value.name === 'Beluga Whale' && value.belugaSwallowed) {
        const belugaImage = this.getPetImagePath(value.belugaSwallowed);
        if (belugaImage) {
          images.push(belugaImage);
        }
      }
    }
    return images;
  }

  get equipmentImageSrc(): string | null {
    const equipmentName = this.getSelectedEquipmentName();
    if (!equipmentName || this.ailmentEquipment?.has(equipmentName)) {
      return null;
    }
    return getEquipmentIconPath(equipmentName, false);
  }

  get ailmentImageSrc(): string | null {
    const equipmentName = this.getSelectedEquipmentName();
    if (!equipmentName || !this.ailmentEquipment?.has(equipmentName)) {
      return null;
    }
    return getEquipmentIconPath(equipmentName, true);
  }

  get equipmentSelected(): boolean {
    return !!this.getSelectedEquipmentName();
  }

  get equipmentHasUses(): boolean {
    const equipment = this.getSelectedEquipment();
    return equipment?.uses != null;
  }

  get equipmentUsesToggleId(): string {
    return `equipmentUsesToggle-${this.index ?? 'none'}`;
  }

  get equipmentUsesInputId(): string {
    return `equipmentUsesInput-${this.index ?? 'none'}`;
  }

  get equipmentUsesAvailable(): boolean {
    return this.equipmentSelected && this.equipmentHasUses;
  }

  getPetOptionStyle(pet: string) {
    const icon = getPetIconPath(pet);
    return this.buildOptionStyle(icon);
  }

  getEquipmentOptionStyle(equipment: Equipment, isAilment = false) {
    const icon = getEquipmentIconPath(equipment?.name, isAilment);
    return this.buildOptionStyle(icon);
  }

  shouldShowFriendsDiedInput(): boolean {
    return this.friendsDiedCaps.has(this.formGroup.get('name').value);
  }

  getPetImagePath(petName?: string | null): string | null {
    if (!petName) {
      return null;
    }
    const fileName = getPetIconFileName(petName);
    if (!fileName) {
      return null;
    }
    return `assets/art/Public/Public/Pets/${fileName}.png`;
  }

  private isParrotCopyTarget(target: SwallowedPetTarget): boolean {
    return PARROT_COPY_TARGETS.has(target);
  }

  private initPets() {
    this.pets = new Map();
    for (let i = 1; i <= 6; i++) {
      this.pets.set(i, []);
    }
    for (const packName of PACK_NAMES) {
      const packPets = this.petService.basePackPetsByName[packName];
      for (let [tier, pets] of packPets) {
        this.pets.get(tier).push(...pets);
      }
    }
    for (let [tier, pets] of this.pets) {
      this.pets.set(tier, [...new Set(pets)]);
    }
    this.initStartOfBattlePets();
  }

  private initStartOfBattlePets() {
    this.startOfBattlePets = new Map();
    for (let i = 1; i <= 6; i++) {
      let sobPets = [];
      for (let pet of this.pets.get(i)) {
        if (this.petService.startOfBattlePets.includes(pet)) {
          sobPets.push(pet);
        }
      }
      this.startOfBattlePets.set(i, sobPets);
    }
  }

  private initEquipment() {
    this.equipment = this.equipmentService.getInstanceOfAllEquipment();
    this.ailmentEquipment = this.equipmentService.getInstanceOfAllAilments();
    this.equipmentCategoryGroups = this.buildCategoryGroups(
      EQUIPMENT_CATEGORIES,
      this.equipment,
    );
    this.ailmentCategoryGroups = this.buildCategoryGroups(
      AILMENT_CATEGORIES,
      this.ailmentEquipment,
    );
  }

  private buildCategoryGroups(
    categoryMap: { [key: string]: string[] },
    source: Map<string, Equipment>,
  ) {
    return Object.entries(categoryMap)
      .map(([label, names]) => {
        const items: Equipment[] = [];
        for (const name of names) {
          const equipment = source.get(name);
          if (equipment) {
            items.push(equipment);
          }
        }
        return { label, items };
      })
      .filter((group) => group.items.length > 0);
  }

  private buildOptionStyle(icon: string | null) {
    if (!icon) {
      return {};
    }
    return {
      'background-image': `url(${icon})`,
      'background-repeat': 'no-repeat',
      'background-position': 'left center',
      'background-size': '24px 24px',
      'padding-left': '2.5rem',
    };
  }

}
