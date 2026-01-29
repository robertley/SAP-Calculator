import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pet-equipment-selector',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, ReactiveFormsModule],
  template: `
    <ng-container [formGroup]="formGroup">
      <div class="col-12 mb-2">
        <button
          type="button"
          class="btn selection-btn w-100 d-flex align-items-center"
          (click)="openSelection.emit()"
        >
          <img
            *ngIf="equipmentImageSrc"
            [ngSrc]="equipmentImageSrc"
            class="btn-icon me-2"
            width="24"
            height="24"
            loading="lazy"
            decoding="async"
          />
          <img
            *ngIf="!equipmentImageSrc && ailmentImageSrc"
            [ngSrc]="ailmentImageSrc"
            class="btn-icon me-2"
            width="24"
            height="24"
            loading="lazy"
            decoding="async"
          />
          <span class="btn-text">{{
            formGroup.get("equipment")?.value || "Select Equipment"
          }}</span>
          <i class="bi bi-chevron-down ms-auto"></i>
        </button>
      </div>
      <div
        class="col-6 mb-2"
        *ngIf="allowEquipmentUseOverrides && equipmentUsesAvailable"
      >
        <label [for]="equipmentUsesInputId">Uses</label>
        <input
          class="form-control"
          type="number"
          min="1"
          max="99"
          [id]="equipmentUsesInputId"
          formControlName="equipmentUses"
        />
      </div>
    </ng-container>
  `,
  styleUrls: ['../pet-selector.component.scss'],
  host: { style: 'display: contents' },
})
export class PetEquipmentSelectorComponent {
  @Input() formGroup!: FormGroup;
  @Input() equipmentImageSrc: string | null = null;
  @Input() ailmentImageSrc: string | null = null;
  @Input() allowEquipmentUseOverrides = false;
  @Input() equipmentUsesAvailable = false;
  @Input() equipmentUsesInputId = '';

  @Output() openSelection = new EventEmitter<void>();
}
