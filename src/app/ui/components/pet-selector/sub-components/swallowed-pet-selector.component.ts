import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { getPetIconPath } from 'app/runtime/asset-catalog';

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
    @Input() pet: any;
    @Input() showSwallowedLevels = false;

    @Output() openSelection = new EventEmitter<{
        type: 'pet' | 'equipment' | 'swallowed-pet',
        index?: number,
        target:
        | 'pet'
        | 'abomination'
        | 'sarcastic'
        | 'abomination-beluga'
        | 'parrot'
        | 'parrot-beluga'
        | 'parrot-abomination'
        | 'parrot-abomination-beluga'
        | 'abomination-parrot'
        | 'abomination-parrot-beluga'
        | 'abomination-parrot-abomination'
        | 'abomination-parrot-abomination-beluga'
        | 'parrot-abomination-parrot'
        | 'parrot-abomination-parrot-beluga'
        | 'parrot-abomination-parrot-abomination'
        | 'parrot-abomination-parrot-abomination-beluga',
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

    shouldShowParrotCopyPetAbominationParrotAbominationTimesHurt(i: number, k: number): boolean {
        const petName = this.formGroup.get(`parrotCopyPetAbominationSwallowedPet${i}ParrotCopyPetAbominationSwallowedPet${k}`)?.value;
        return petName === 'Tuna';
    }

    shouldShowParrotCopyPetAbominationTimesHurt(i: number): boolean {
        const petName = this.formGroup.get(`parrotCopyPetAbominationSwallowedPet${i}`)?.value;
        return petName === 'Tuna';
    }

    shouldShowAbominationParrotCopyAbominationTimesHurt(i: number, j: number): boolean {
        const petName = this.formGroup.get(`abominationSwallowedPet${i}ParrotCopyPetAbominationSwallowedPet${j}`)?.value;
        return petName === 'Tuna';
    }

    shouldShowAbominationSwallowTimesHurt(i: number): boolean {
        const petName = this.formGroup.get(`abominationSwallowedPet${i + 1}`)?.value;
        return petName === 'Tuna';
    }

    openSelectionDialog(
        type: 'swallowed-pet',
        index?: number,
        target:
            | 'pet'
            | 'abomination'
            | 'sarcastic'
            | 'abomination-beluga'
            | 'parrot'
            | 'parrot-beluga'
            | 'parrot-abomination'
            | 'parrot-abomination-beluga'
            | 'abomination-parrot'
            | 'abomination-parrot-beluga'
            | 'abomination-parrot-abomination'
            | 'abomination-parrot-abomination-beluga'
            | 'parrot-abomination-parrot'
            | 'parrot-abomination-parrot-beluga'
            | 'parrot-abomination-parrot-abomination'
            | 'parrot-abomination-parrot-abomination-beluga' = 'pet',
        parentIndex?: number
    ) {
        this.openSelection.emit({ type, index, target, parentIndex });
    }
}



