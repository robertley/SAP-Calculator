import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Pet } from 'app/domain/entities/pet.class';
import { getPetIconPath } from 'app/runtime/asset-catalog';
import { SwallowedPetTarget } from '../pet-selector.constants';

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
    @Input() showSwallowedLevels = false;

    @Output() openSelection = new EventEmitter<{
        type: 'pet' | 'equipment' | 'swallowed-pet',
        index?: number,
        target: SwallowedPetTarget,
        parentIndex?: number
    }>();

    getPetImagePath(name: string): string | null {
        return getPetIconPath(name);
    }

    trackByIndex(index: number): number {
        return index;
    }

    getParrotCopyAbominationSlotCount(): number {
        const level = this.formGroup.get('parrotCopyPetAbominationLevel')?.value || 1;
        return level;
    }

    private supportsTimesHurt(petName: string | null | undefined): boolean {
        return petName === 'Tuna' || petName === 'Sabertooth Tiger';
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

    openSelectionDialog(
        type: 'swallowed-pet',
        index?: number,
        target: SwallowedPetTarget = 'pet',
        parentIndex?: number
    ) {
        this.openSelection.emit({ type, index, target, parentIndex });
    }
}



