import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Pet } from 'app/domain/entities/pet.class';
import {
    getAllEquipmentNames,
    getAllPetNames,
    getAllToyNames,
    getEquipmentIconPath,
    getPetIconPath,
    getToyIconPath,
} from 'app/runtime/asset-catalog';
import { AILMENT_CATEGORIES } from 'app/integrations/equipment/equipment-categories';
import {
    supportsTimesHurtPet,
    SwallowedPetTarget,
} from '../pet-selector.constants';

const PET_NAME_LOOKUP = new Map(
    getAllPetNames().map((name) => [name.toLowerCase(), name]),
);
const TOY_NAME_LOOKUP = new Map(
    getAllToyNames().map((name) => [name.toLowerCase(), name]),
);
const EQUIPMENT_NAME_LOOKUP = new Map(
    getAllEquipmentNames().map((name) => [name.toLowerCase(), name]),
);
const AILMENT_NAME_SET = new Set(
    Object.values(AILMENT_CATEGORIES)
        .flat()
        .map((name) => `${name}`.toLowerCase()),
);

@Component({
    selector: 'app-swallowed-pet-selector',
    standalone: true,
    imports: [CommonModule, NgOptimizedImage, ReactiveFormsModule],
    templateUrl: './swallowed-pet-selector.component.html',
    styleUrls: ['../pet-selector.component.scss'],
    host: { style: 'display: contents' },
})
export class SwallowedPetSelectorComponent {
    @Input() formGroup!: FormGroup;
    @Input() pet: Pet | null = null;

    @Output() openSelection = new EventEmitter<{
        type: 'pet' | 'equipment' | 'swallowed-pet' | 'ability',
        index?: number,
        target: SwallowedPetTarget,
        parentIndex?: number
    }>();

    getPetImagePath(name: string): string | null {
        return getPetIconPath(name);
    }

    getAbilityImagePath(name: string | null | undefined): string | null {
        if (!name) {
            return null;
        }
        const normalizedName = name.trim().toLowerCase();

        const petName = PET_NAME_LOOKUP.get(normalizedName);
        if (petName) {
            return getPetIconPath(petName);
        }

        const toyName = TOY_NAME_LOOKUP.get(normalizedName);
        if (toyName) {
            return getToyIconPath(toyName);
        }

        const equipmentName = EQUIPMENT_NAME_LOOKUP.get(normalizedName);
        if (equipmentName) {
            return getEquipmentIconPath(
                equipmentName,
                AILMENT_NAME_SET.has(normalizedName),
            );
        }

        return null;
    }

    trackByIndex(index: number): number {
        return index;
    }

    getParrotCopyAbominationSlotCount(): number {
        return 3;
    }

    getAbominationAbilityLevel(index: number): number {
        return this.getLevelValue(`abominationSwallowedPet${index + 1}Level`);
    }

    getNestedAbominationAbilityLevel(parentIndex: number, nestedIndex: number): number {
        return this.getLevelValue(
            `abominationSwallowedPet${parentIndex + 1}ParrotCopyPetAbominationSwallowedPet${nestedIndex + 1}Level`,
        );
    }

    getParrotAbominationAbilityLevel(index: number): number {
        return this.getLevelValue(`parrotCopyPetAbominationSwallowedPet${index + 1}Level`);
    }

    getAbilityTitle(index: number): string {
        const slot = index + 1;
        const level = this.getLevelValue(`abominationSwallowedPet${slot}Level`);
        return `Ability ${slot} - Level ${level}`;
    }

    getNestedAbominationAbilityTitle(parentIndex: number, nestedIndex: number): string {
        const parentSlot = parentIndex + 1;
        const nestedSlot = nestedIndex + 1;
        const level = this.getLevelValue(
            `abominationSwallowedPet${parentSlot}ParrotCopyPetAbominationSwallowedPet${nestedSlot}Level`,
        );
        return `Nested Slot ${nestedSlot} - Level ${level}`;
    }

    getParrotAbominationAbilityTitle(index: number): string {
        const slot = index + 1;
        const level = this.getLevelValue(`parrotCopyPetAbominationSwallowedPet${slot}Level`);
        return `Ability ${slot} - Level ${level}`;
    }

    private supportsTimesHurt(petName: string | null | undefined): boolean {
        return supportsTimesHurtPet(petName);
    }

    shouldShowParrotCopyPetAbominationParrotAbominationTimesHurt(i: number, k: number): boolean {
        const petName = this.formGroup.get(`parrotCopyPetAbominationSwallowedPet${i}ParrotCopyPetAbominationSwallowedPet${k}`)?.value;
        return this.supportsTimesHurt(petName);
    }

    shouldShowParrotCopyPetAbominationTimesHurt(i: number): boolean {
        const petName = this.formGroup.get(`parrotCopyPetAbominationSwallowedPet${i}`)?.value;
        return this.supportsTimesHurt(petName);
    }

    shouldShowAbominationParrotCopyAbominationTimesHurt(i: number, j: number): boolean {
        const petName = this.formGroup.get(`abominationSwallowedPet${i}ParrotCopyPetAbominationSwallowedPet${j}`)?.value;
        return this.supportsTimesHurt(petName);
    }

    shouldShowAbominationSwallowTimesHurt(i: number): boolean {
        const petName = this.formGroup.get(`abominationSwallowedPet${i + 1}`)?.value;
        return this.supportsTimesHurt(petName);
    }

    private getLevelValue(controlName: string): number {
        const rawValue = this.formGroup.get(controlName)?.value;
        const parsed = Number(rawValue);
        if (!Number.isFinite(parsed) || parsed < 1 || parsed > 3) {
            return 1;
        }
        return parsed;
    }

    openSelectionDialog(
        type: 'swallowed-pet' | 'ability',
        index?: number,
        target: SwallowedPetTarget = 'pet',
        parentIndex?: number
    ) {
        this.openSelection.emit({ type, index, target, parentIndex });
    }
}



